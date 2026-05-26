import db, { eq, desc, asc, ilike, and, sql, inArray } from "@repo/database";
import { usersTable, formTable, formStatusTable, responsesTable } from "@repo/database/schema";
import { z } from "zod";
import { adminFormsListInputSchema, adminDeleteFormInputSchema } from "./model";
import { formDeletionMail, sendEmail } from "@repo/email";

class AdminService {
  public async getDashboardStats() {
    // Total users
    const [usersCountResult] = await db.select({ count: sql<number>`count(*)` }).from(usersTable);
    const totalUsers = Number(usersCountResult?.count || 0);

    // Total forms
    const [formsCountResult] = await db.select({ count: sql<number>`count(*)` }).from(formTable);
    const totalForms = Number(formsCountResult?.count || 0);

    // Draft & Active forms
    const statuses = await db.select({ status: formStatusTable.status, count: sql<number>`count(*)` })
      .from(formStatusTable)
      .groupBy(formStatusTable.status);

    let draftForms = 0;
    let activeForms = 0;
    statuses.forEach((s) => {
      if (s.status === "draft") draftForms += Number(s.count);
      if (s.status === "published") activeForms += Number(s.count);
    });

    // Total responses and average completion time
    const [responsesResult] = await db.select({
      count: sql<number>`count(*)`,
      avgTime: sql<number>`avg(${responsesTable.timeToComplete})`
    }).from(responsesTable);
    const totalResponses = Number(responsesResult?.count || 0);
    const averageCompletionTime = Number(responsesResult?.avgTime || 0);

    // Chart Data (Last 30 days of responses)
    // In PostgreSQL, date_trunc works for truncating to day
    const chartDataResult = await db.select({
      date: sql<string>`to_char(date_trunc('day', ${responsesTable.createdAt}), 'YYYY-MM-DD')`,
      responses: sql<number>`count(*)`
    })
      .from(responsesTable)
      .groupBy(sql`date_trunc('day', ${responsesTable.createdAt})`)
      .orderBy(sql`date_trunc('day', ${responsesTable.createdAt})`);

    const chartData = chartDataResult.map(row => ({
      date: row.date,
      responses: Number(row.responses)
    }));

    return {
      totalUsers,
      totalForms: activeForms, // returning active forms as requested by user
      draftForms,
      totalResponses,
      averageCompletionTime: Math.round(averageCompletionTime),
      chartData,
    };
  }

  public async getFormsList(input: z.infer<typeof adminFormsListInputSchema>) {
    const { search, statusFilter, sortFilter } = input;

    let baseQuery = db.select({
      id: formTable.id,
      title: formTable.title,
      createdAt: formTable.createdAt,
      creatorName: usersTable.fullName,
      creatorEmail: usersTable.email,
      status: formStatusTable.status,
      responsesCount: sql<number>`(SELECT count(*) FROM ${responsesTable} WHERE ${responsesTable.formId} = ${formTable.id})`,
    })
      .from(formTable)
      .innerJoin(usersTable, eq(formTable.createdBy, usersTable.id))
      .innerJoin(formStatusTable, eq(formTable.id, formStatusTable.formId))
      .$dynamic();

    const conditions = [];

    if (search) {
      conditions.push(ilike(formTable.title, `%${search}%`));
    }

    if (statusFilter && statusFilter !== "all") {
      // mapping 'active' to 'published'
      const statusValue = statusFilter === "active" ? "published" : statusFilter;
      conditions.push(eq(formStatusTable.status, statusValue));
    }

    // Never show deleted forms in the general list to admin unless specifically requested? 
    // Usually admin wants to see them or filter them out. Let's filter out 'deleted'.
    conditions.push(sql`${formStatusTable.status} != 'deleted'`);

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions));
    }

    if (sortFilter === "oldest") {
      baseQuery = baseQuery.orderBy(asc(formTable.createdAt));
    } else {
      baseQuery = baseQuery.orderBy(desc(formTable.createdAt)); // latest by default
    }

    const forms = await baseQuery;

    return forms.map(f => ({
      ...f,
      createdAt: f.createdAt!,
      responsesCount: Number(f.responsesCount)
    }));
  }

  public async deleteForm(input: z.infer<typeof adminDeleteFormInputSchema>) {
    const { formId, reason } = input;

    // Fetch the form and creator details
    const [formDetails] = await db.select({
      title: formTable.title,
      creatorName: usersTable.fullName,
      creatorEmail: usersTable.email,
    })
      .from(formTable)
      .innerJoin(usersTable, eq(formTable.createdBy, usersTable.id))
      .where(eq(formTable.id, formId));

    if (!formDetails) {
      throw new Error("Form not found");
    }

    // Soft delete the form
    await db.update(formStatusTable)
      .set({ status: "deleted" })
      .where(eq(formStatusTable.formId, formId));

    // Send email notification
    sendEmail(
      formDetails.creatorEmail,
      "Important: Your Form has been Deleted",
      formDeletionMail(formDetails.creatorName, formDetails.title, reason)
    ).catch((err) => {
      throw new Error("Email notification failed, but form has been deleted");
    })

    return { success: true };
  }
}

export default AdminService;
