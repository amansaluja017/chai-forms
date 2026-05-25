import db, { eq, inArray, sql } from "@repo/database";
import { formTable, responsesTable, formFieldsTable, formFeildOptions } from "@repo/database/schema";

class AnalyticsService {
  public async getGlobalAnalytics(userId: string) {
    const userForms = await db.select({ id: formTable.id, views: formTable.views }).from(formTable).where(eq(formTable.createdBy, userId));
    const formIds = userForms.map(f => f.id);
    
    if (formIds.length === 0) {
      return { totalForms: 0, totalViews: 0, totalResponses: 0, completionRate: 0 };
    }

    const totalViews = userForms.reduce((sum, form) => sum + form.views, 0);

    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(responsesTable)
      .where(inArray(responsesTable.formId, formIds));
      
    const totalResponses = Number(countResult[0]?.count || 0);
    
    let completionRate = 0;
    if (totalViews > 0) {
      completionRate = Math.round((totalResponses / totalViews) * 100);
    }

    return {
      totalForms: userForms.length,
      totalViews,
      totalResponses,
      completionRate
    };
  }

  public async getFormAnalytics(userId: string, formId: string) {
    // Verify ownership
    const [form] = await db.select({ id: formTable.id, views: formTable.views })
      .from(formTable)
      .where(eq(formTable.id, formId));

    if (!form) throw new Error("Form not found");

    const responses = await db.select({ timeToComplete: responsesTable.timeToComplete })
      .from(responsesTable)
      .where(eq(responsesTable.formId, formId));

    const totalResponses = responses.length;
    let averageTime = 0;
    if (totalResponses > 0) {
      const totalTime = responses.reduce((sum, r) => sum + r.timeToComplete, 0);
      averageTime = Math.round(totalTime / totalResponses);
    }

    let completionRate = 0;
    if (form.views > 0) {
      completionRate = Math.round((totalResponses / form.views) * 100);
    }

    return {
      views: form.views,
      responses: totalResponses,
      completionRate,
      averageTime
    };
  }

  public async trackFormView(formId: string) {
    await db.update(formTable)
      .set({ views: sql`${formTable.views} + 1` })
      .where(eq(formTable.id, formId));
    return { success: true };
  }

  public async getFormChartData(userId: string, formId: string) {
    // Return aggregated chart data for multi-choice fields
    const fields = await db.select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));

    const chartableFields = fields.filter(f => ["radio", "checkbox", "dropdown", "yes_no"].includes(f.type));
    
    if (chartableFields.length === 0) return [];

    const fieldIds = chartableFields.map(f => f.id);
    let options: any[] = [];
    if (fieldIds.length > 0) {
       options = await db.select().from(formFeildOptions).where(inArray(formFeildOptions.formFeildId, fieldIds));
    }

    const responses = await db.select({ response: responsesTable.response })
      .from(responsesTable)
      .where(eq(responsesTable.formId, formId));

    const results = chartableFields.map(field => {
      const fieldOptions = options.filter(o => o.formFeildId === field.id);
      
      // Initialize counts based on available options, or generic ones for yes_no
      const counts: Record<string, number> = {};
      if (field.type === "yes_no") {
        counts["true"] = 0;
        counts["false"] = 0;
      } else {
        fieldOptions.forEach(opt => counts[opt.value] = 0);
      }

      // Aggregate responses
      responses.forEach(r => {
        const answer = r.response.find((ans: any) => ans.formFieldId === field.id);
        if (answer && answer.value) {
          // Checkbox might be comma separated or json array string depending on frontend implementation
          let values = [answer.value];
          if (field.type === "checkbox") {
            try {
               values = JSON.parse(answer.value); // If it's a JSON array
            } catch (e) {
               values = answer.value.split(","); // Fallback
            }
          }
          
          values.forEach((v: string) => {
            if (counts[v] !== undefined) {
              counts[v]++;
            } else {
              counts[v] = 1;
            }
          });
        }
      });

      return {
        fieldId: field.id,
        label: field.label,
        type: field.type,
        data: Object.entries(counts).map(([name, value]) => {
           // Map "value" back to "label" if possible for display
           const option = fieldOptions.find(o => o.value === name);
           const displayName = option ? option.label : name;
           return { name: displayName, value };
        })
      };
    });

    return results;
  }
}

export default AnalyticsService;
