import db, { eq, and, inArray, asc } from "@repo/database";
import { formTable, formFieldsTable, formFeildOptions, formStatusTable, responsesTable, usersTable } from "@repo/database/schema";
import { CreateFormInputType, UpdateFormInputType, FormIdInputType, SaveFormFieldsInputType, FormStatusType, CreateFormFieldInputType, UpdateFormFieldInputType, DeleteFormFieldInputType, ReorderFormFieldsInputType, SubmitFormResponseInputType } from "./model";

class FormService {
  public async createForm(userId: string, input: CreateFormInputType) {
    const [form] = await db.insert(formTable).values({
      title: input.title,
      description: input.description,
      createdBy: userId,
    }).returning();

    if (!form) throw new Error("Failed to create form");

    // Also create a default status record
    await db.insert(formStatusTable).values({
      formId: form.id,
      status: "draft",
      visibility: "unlisted"
    });

    return form;
  }

  public async getForms(userId: string) {
    return await db.select().from(formTable).where(eq(formTable.createdBy, userId));
  }

  public async getFormById(userId: string, input: FormIdInputType) {
    const [form] = await db.select()
      .from(formTable)
      .where(and(eq(formTable.id, input.id), eq(formTable.createdBy, userId)))
      .limit(1);

    if (!form) {
      throw new Error("Form not found");
    }

    return form;
  }

  public async updateForm(userId: string, input: UpdateFormInputType) {
    const { id, ...updateData } = input;
    await this.getFormById(userId, { id });

    const [updatedForm] = await db.update(formTable)
      .set(updateData)
      .where(eq(formTable.id, id))
      .returning();

    if (!updatedForm) throw new Error("Failed to update form");

    return updatedForm;
  }

  public async deleteForm(userId: string, input: FormIdInputType) {
    await this.getFormById(userId, { id: input.id });

    // delete form fields, options, and status first (if no cascade)
    // assuming cascade is not set, we manually delete
    await db.delete(formFeildOptions).where(
      inArray(formFeildOptions.formFeildId, 
        db.select({ id: formFieldsTable.id }).from(formFieldsTable).where(eq(formFieldsTable.formId, input.id))
      )
    );
    await db.delete(formFieldsTable).where(eq(formFieldsTable.formId, input.id));
    await db.delete(formStatusTable).where(eq(formStatusTable.formId, input.id));

    const [deletedForm] = await db.delete(formTable)
      .where(eq(formTable.id, input.id))
      .returning();

    if (!deletedForm) throw new Error("Failed to delete form");

    return deletedForm;
  }

  public async getFormWorkspace(userId: string, input: FormIdInputType) {
    const form = await this.getFormById(userId, input);

    const fields = await db.select().from(formFieldsTable).where(eq(formFieldsTable.formId, form.id)).orderBy(formFieldsTable.orderIndex);
    
    // get options for fields that have them
    const fieldIds = fields.map(f => f.id);
    let allOptions: any[] = [];
    if (fieldIds.length > 0) {
      allOptions = await db.select().from(formFeildOptions).where(inArray(formFeildOptions.formFeildId, fieldIds)).orderBy(formFeildOptions.orderIndex);
    }

    const [status] = await db.select().from(formStatusTable).where(eq(formStatusTable.formId, form.id)).limit(1);

    const fieldsWithOptions = fields.map(field => ({
      ...field,
      orderIndex: Number(field.orderIndex),
      options: allOptions.filter(o => o.formFeildId === field.id).map(opt => ({
        ...opt,
        orderIndex: Number(opt.orderIndex)
      }))
    }));

    return {
      ...form,
      fields: fieldsWithOptions,
      status: status || null
    } as any;
  }

  public async saveFormFields(userId: string, input: SaveFormFieldsInputType) {
    await this.getFormById(userId, { id: input.formId });

    await db.transaction(async (tx) => {
      // Delete existing options
      await tx.delete(formFeildOptions).where(
        inArray(formFeildOptions.formFeildId, 
          tx.select({ id: formFieldsTable.id }).from(formFieldsTable).where(eq(formFieldsTable.formId, input.formId))
        )
      );
      // Delete existing fields
      await tx.delete(formFieldsTable).where(eq(formFieldsTable.formId, input.formId));

      // Re-insert fields
      for (const field of input.fields) {
        const [insertedField] = await tx.insert(formFieldsTable).values({
          id: field.id || undefined, 
          formId: input.formId,
          label: field.label,
          type: field.type,
          isRequired: field.isRequired,
          placeHolder: field.placeHolder,
          description: field.description,
          orderIndex: field.orderIndex,
          labelKey: field.labelKey,
        }).returning();

        if (!insertedField) throw new Error("Failed to insert field");

        // Insert options if any
        if (field.options && field.options.length > 0) {
          const optionsToInsert = field.options.map(opt => ({
            id: opt.id || undefined,
            formFeildId: insertedField.id,
            label: opt.label,
            value: opt.value,
            orderIndex: opt.orderIndex
          }));
          await tx.insert(formFeildOptions).values(optionsToInsert);
        }
      }
    });

    return { success: true };
  }

  public async updateFormStatus(userId: string, input: FormStatusType) {
    await this.getFormById(userId, { id: input.formId });

    const [existing] = await db.select().from(formStatusTable).where(eq(formStatusTable.formId, input.formId));

    if (existing) {
      await db.update(formStatusTable).set({
        status: input.status,
        visibility: input.visibility
      }).where(eq(formStatusTable.formId, input.formId));
    } else {
      await db.insert(formStatusTable).values({
        formId: input.formId,
        status: input.status,
        visibility: input.visibility
      });
    }

    return { success: true };
  }

  // --- Atomic Auto-Save Operations ---

  public async createFormField(userId: string, input: CreateFormFieldInputType) {
    await this.getFormById(userId, { id: input.formId });

    const [insertedField] = await db.insert(formFieldsTable).values({
      formId: input.formId,
      label: input.label,
      type: input.type,
      isRequired: input.isRequired,
      placeHolder: input.placeHolder,
      description: input.description,
      orderIndex: input.orderIndex,
      labelKey: input.labelKey,
    }).returning();

    if (!insertedField) throw new Error("Failed to create field");

    if (input.options && input.options.length > 0) {
      const optionsToInsert = input.options.map(opt => ({
        formFeildId: insertedField.id,
        label: opt.label,
        value: opt.value,
        orderIndex: opt.orderIndex
      }));
      await db.insert(formFeildOptions).values(optionsToInsert);
    }

    return insertedField;
  };

  public async updateFormField(userId: string, input: UpdateFormFieldInputType) {
    await this.getFormById(userId, { id: input.formId });

    await db.update(formFieldsTable).set({
      label: input.label,
      type: input.type,
      isRequired: input.isRequired,
      placeHolder: input.placeHolder,
      description: input.description,
      orderIndex: input.orderIndex,
      labelKey: input.labelKey,
    }).where(and(eq(formFieldsTable.id, input.id), eq(formFieldsTable.formId, input.formId)));

    if (input.options && input.options.length > 0) {
      await db.delete(formFeildOptions).where(eq(formFeildOptions.formFeildId, input.id));
      const optionsToInsert = input.options.map(opt => ({
        formFeildId: input.id,
        label: opt.label,
        value: opt.value,
        orderIndex: opt.orderIndex
      }));
      await db.insert(formFeildOptions).values(optionsToInsert);
    }

    return { success: true };
  };

  public async deleteFormField(userId: string, input: DeleteFormFieldInputType) {
    await this.getFormById(userId, { id: input.formId });

    await db.delete(formFeildOptions).where(eq(formFeildOptions.formFeildId, input.id));
    await db.delete(formFieldsTable).where(and(eq(formFieldsTable.id, input.id), eq(formFieldsTable.formId, input.formId)));

    return { success: true };
  }

  public async reorderFormFields(userId: string, input: ReorderFormFieldsInputType) {
    await this.getFormById(userId, { id: input.formId });

    await db.transaction(async (tx) => {
      for (const order of input.orders) {
        await tx.update(formFieldsTable)
          .set({ orderIndex: order.orderIndex })
          .where(and(eq(formFieldsTable.id, order.id), eq(formFieldsTable.formId, input.formId)));
      }
    });

    return { success: true };
  };

  public async getPublicFormWorkspace(input: FormIdInputType) {
    const [formRecord] = await db.select()
      .from(formTable)
      .where(eq(formTable.id, input.id))
      .limit(1);

    if (!formRecord) throw new Error("Form not found");

    const [statusRecord] = await db.select()
      .from(formStatusTable)
      .where(eq(formStatusTable.formId, formRecord.id))
      .limit(1);

    if (!statusRecord || statusRecord.status !== "published") {
      throw new Error("Form is not published");
    }

    const fields = await db.select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formRecord.id))
      .orderBy(asc(formFieldsTable.orderIndex));

    const fieldIds = fields.map(f => f.id);
    let allOptions: any[] = [];
    if (fieldIds.length > 0) {
      allOptions = await db.select()
        .from(formFeildOptions)
        .where(inArray(formFeildOptions.formFeildId, fieldIds))
        .orderBy(asc(formFeildOptions.orderIndex));
    }

    const fieldsWithOptions = fields.map(field => ({
      ...field,
      orderIndex: Number(field.orderIndex),
      options: allOptions
        .filter(o => o.formFeildId === field.id)
        .map(opt => ({
          ...opt,
          orderIndex: Number(opt.orderIndex)
        }))
    }));

    return {
      ...formRecord,
      fields: fieldsWithOptions,
      status: statusRecord
    } as any;
  }

  public async submitForm(input: SubmitFormResponseInputType) {
    const [statusRecord] = await db.select()
      .from(formStatusTable)
      .where(eq(formStatusTable.formId, input.formId))
      .limit(1);

    if (!statusRecord || statusRecord.status !== "published") {
      throw new Error("Cannot submit response: Form is not published.");
    }

    await db.insert(responsesTable).values({
      formId: input.formId,
      response: input.response,
      timeToComplete: input.timeToComplete,
    });

    return { success: true };
  }

  public async getFormResponses(userId: string, input: FormIdInputType) {
    // Check form ownership
    await this.getFormById(userId, { id: input.id });

    // Fetch fields
    const fields = await db.select({
      id: formFieldsTable.id,
      label: formFieldsTable.label,
      type: formFieldsTable.type,
      orderIndex: formFieldsTable.orderIndex,
    })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, input.id))
      .orderBy(asc(formFieldsTable.orderIndex));

    // Fetch responses
    const responses = await db.select({
      id: responsesTable.id,
      timeToComplete: responsesTable.timeToComplete,
      createdAt: responsesTable.createdAt,
      response: responsesTable.response,
    })
      .from(responsesTable)
      .where(eq(responsesTable.formId, input.id));

    return {
      fields,
      responses,
    };
  }

  public async getPublicForms() {
    const publicForms = await db.select({
      id: formTable.id,
      title: formTable.title,
      description: formTable.description,
      views: formTable.views,
      createdAt: formTable.createdAt,
      updatedAt: formTable.updatedAt,
      creatorName: usersTable.fullName,
    })
      .from(formTable)
      .innerJoin(formStatusTable, eq(formTable.id, formStatusTable.formId))
      .innerJoin(usersTable, eq(formTable.createdBy, usersTable.id))
      .where(
        and(
          eq(formStatusTable.status, "published"),
          eq(formStatusTable.visibility, "public")
        )
      )
      .orderBy(asc(formTable.createdAt));

    return publicForms;
  }
}

export default FormService;
