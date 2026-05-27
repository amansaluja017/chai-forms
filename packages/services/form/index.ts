import db, { eq, and, inArray, asc, not } from "@repo/database";
import { formTable, formFieldsTable, formFeildOptions, formStatusTable, responsesTable, usersTable } from "@repo/database/schema";
import { CreateFormInputType, UpdateFormInputType, FormIdInputType, SaveFormFieldsInputType, FormStatusType, CreateFormFieldInputType, UpdateFormFieldInputType, DeleteFormFieldInputType, ReorderFormFieldsInputType, SubmitFormResponseInputType, updateFormInputSchema, updateFormFieldInputSchema, GenerateFormWithAIInputType, GetPublicFormWorkspaceInputType } from "./model";
import { generateFormFieldsSchema } from "@repo/ai";
import { sendEmail, formSubmittedCreatorMail, formSubmittedResponderMail } from "@repo/email";

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
    const forms = await db.select({
      id: formTable.id,
      title: formTable.title,
      description: formTable.description,
      createdBy: formTable.createdBy,
      createdAt: formTable.createdAt,
      updatedAt: formTable.updatedAt,
      status: formStatusTable.status,
    })
      .from(formTable)
      .innerJoin(formStatusTable, eq(formTable.id, formStatusTable.formId))
      .where(
        and(
          eq(formTable.createdBy, userId),
          not(eq(formStatusTable.status, "deleted"))
        )
      );

    return forms;
  }

  public async getFormById(userId: string, input: FormIdInputType, isAdmin: boolean = false) {
    const conditions = isAdmin
      ? eq(formTable.id, input.id)
      : and(
        eq(formTable.id, input.id),
        eq(formTable.createdBy, userId)
      );

    const [formRecord] = await db.select({
      form: formTable,
      status: formStatusTable.status,
    })
      .from(formTable)
      .innerJoin(formStatusTable, eq(formTable.id, formStatusTable.formId))
      .where(conditions)
      .limit(1);

    if (!formRecord) {
      throw new Error("Form not found");
    }

    if (!isAdmin && formRecord.status === "deleted") {
      throw new Error("Form not found or has been deleted");
    }

    return formRecord.form;
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
    const form = await this.getFormById(userId, { id: input.id });

    // Soft delete the form by updating its status
    const [deletedStatus] = await db.update(formStatusTable)
      .set({ status: "deleted" })
      .where(eq(formStatusTable.formId, input.id))
      .returning();

    if (!deletedStatus) throw new Error("Failed to delete form");

    return form;
  }

  public async getFormWorkspace(userId: string, input: FormIdInputType, isAdmin: boolean = false) {
    const form = await this.getFormById(userId, input, isAdmin);

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

    const values = {
      formId: input.formId,
      status: input.status,
      visibility: input.visibility,
      isProtected: input.isProtected,
      password: input.password || null,
    }

    if (existing) {
      await db.update(formStatusTable).set(values).where(eq(formStatusTable.formId, input.formId));
    } else {
      await db.insert(formStatusTable).values(values);
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
    const { id, type, label, isRequired, placeHolder, description, orderIndex, labelKey, options, validation } = updateFormFieldInputSchema.parse(input);

    await this.getFormById(userId, { id: input.formId });

    await db.update(formFieldsTable).set({
      label,
      type,
      isRequired,
      placeHolder,
      description,
      orderIndex,
      labelKey,
      validation
    }).where(and(eq(formFieldsTable.id, id), eq(formFieldsTable.formId, input.formId)));

    if (options && options.length > 0) {
      await db.delete(formFeildOptions).where(eq(formFeildOptions.formFeildId, id));
      const optionsToInsert = options.map(opt => ({
        formFeildId: id,
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

  public async getPublicFormWorkspace(input: GetPublicFormWorkspaceInputType) {
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

    if (statusRecord.isProtected) {
      if (!input.password || input.password !== statusRecord.password) {
        return {
          isProtected: true,
          isPasswordInvalid: !!input.password, // true if they provided a wrong password
        };
      }
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
        .filter(opt => opt.formFeildId === field.id)
        .map(opt => ({
          ...opt,
          orderIndex: Number(opt.orderIndex)
        }))
    }));

    return {
      isProtected: false,
      form: {
        ...formRecord,
        fields: fieldsWithOptions,
      }
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

    // Fetch form creator and form details
    const [formData] = await db.select({
      formTitle: formTable.title,
      creatorName: usersTable.fullName,
      creatorEmail: usersTable.email,
    })
      .from(formTable)
      .innerJoin(usersTable, eq(formTable.createdBy, usersTable.id))
      .where(eq(formTable.id, input.formId))
      .limit(1);

    // Fetch form fields to identify email fields
    const formFields = await db.select({
      id: formFieldsTable.id,
      type: formFieldsTable.type,
    })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, input.formId));

    await db.insert(responsesTable).values({
      formId: input.formId,
      response: input.response,
      timeToComplete: input.timeToComplete,
    });

    // Send Emails Asynchronously
    if (formData) {
      // Find responder's email if available
      let responderEmail: string | null = null;
      for (const field of formFields) {
        if (field.type === "email") {
          const responseField = input.response.find((r: any) => r.formFieldId === field.id);
          if (responseField && responseField.value && responseField.value.trim() !== "") {
            responderEmail = responseField.value.trim();
            break; // Stop at first email field found
          }
        }
      }

      Promise.allSettled([
        // Send email to creator
        sendEmail(
          formData.creatorEmail,
          `New Response on "${formData.formTitle}"`,
          formSubmittedCreatorMail(formData.creatorName, formData.formTitle)
        ),
        // Send email to responder if email was provided
        responderEmail
          ? sendEmail(
            responderEmail,
            `Submission Successful: ${formData.formTitle}`,
            formSubmittedResponderMail(formData.formTitle)
          )
          : Promise.resolve()
      ]).catch(console.error); // Catch any unexpected errors from Promise.allSettled itself
    }

    return { success: true };
  }

  public async getFormResponses(userId: string, input: FormIdInputType, isAdmin: boolean = false) {
    // Check form ownership or admin role
    await this.getFormById(userId, { id: input.id }, isAdmin);

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

  public async generateFormWithAI(userId: string, input: GenerateFormWithAIInputType) {
    // Fetch the existing form context
    const existingForm = await this.getFormWorkspace(userId, { id: input.formId });

    // Provide context to AI so it knows what to modify
    const existingContextStr = JSON.stringify({
      title: existingForm.title,
      description: existingForm.description,
      fields: existingForm.fields.map((f: any) => ({
        id: f.id,
        label: f.label,
        type: f.type,
        isRequired: f.isRequired,
        description: f.description,
        options: f.options
      }))
    });

    const aiResponse = await generateFormFieldsSchema(input.prompt, existingContextStr);

    if (!aiResponse || typeof aiResponse !== "object") {
      throw new Error("Invalid schema generated by AI");
    }

    const { title, description, fieldsToCreate = [], fieldsToUpdate = [], fieldsToDelete = [] } = aiResponse;

    await db.transaction(async (tx) => {
      // 1. Update Title & Description
      if ((title && title !== existingForm.title) || (description !== undefined && description !== existingForm.description)) {
        await tx.update(formTable).set({
          title: title || existingForm.title,
          description: description !== undefined ? description : existingForm.description,
        }).where(eq(formTable.id, input.formId));
      }

      // 2. Delete fields
      if (Array.isArray(fieldsToDelete) && fieldsToDelete.length > 0) {
        for (const fieldId of fieldsToDelete) {
          if (typeof fieldId === "string") {
            await tx.delete(formFeildOptions).where(eq(formFeildOptions.formFeildId, fieldId));
            await tx.delete(formFieldsTable).where(and(eq(formFieldsTable.id, fieldId), eq(formFieldsTable.formId, input.formId)));
          }
        }
      }

      // 3. Update fields
      if (Array.isArray(fieldsToUpdate) && fieldsToUpdate.length > 0) {
        for (const field of fieldsToUpdate) {
          if (!field.id) continue;

          await tx.update(formFieldsTable).set({
            label: field.label,
            type: field.type,
            isRequired: field.isRequired,
            placeHolder: field.placeHolder,
            description: field.description,
          }).where(and(eq(formFieldsTable.id, field.id), eq(formFieldsTable.formId, input.formId)));

          if (field.options && Array.isArray(field.options)) {
            await tx.delete(formFeildOptions).where(eq(formFeildOptions.formFeildId, field.id));
            if (field.options.length > 0) {
              let optOrder = 0;
              const optionsToInsert = field.options.map((opt: any) => ({
                id: crypto.randomUUID(),
                formFeildId: field.id,
                label: opt.label || `Option ${optOrder + 1}`,
                value: opt.value || `option_${optOrder + 1}`,
                orderIndex: opt.orderIndex || optOrder++
              }));
              await tx.insert(formFeildOptions).values(optionsToInsert);
            }
          }
        }
      }

      // 4. Create new fields
      if (Array.isArray(fieldsToCreate) && fieldsToCreate.length > 0) {
        const [lastField] = await tx.select({ orderIndex: formFieldsTable.orderIndex })
          .from(formFieldsTable)
          .where(eq(formFieldsTable.formId, input.formId))
          .orderBy(asc(formFieldsTable.orderIndex))
          .limit(1);

        let currentOrderIndex = (lastField?.orderIndex || 0) + 1;

        for (const field of fieldsToCreate) {
          const fieldId = crypto.randomUUID();
          const labelKey = field.label ? field.label.toLowerCase().replace(/[^a-z0-9]/g, "_").substring(0, 50) : "untitled";

          const [insertedField] = await tx.insert(formFieldsTable).values({
            id: fieldId,
            formId: input.formId,
            label: field.label || "Untitled Field",
            type: field.type || "text",
            isRequired: field.isRequired || false,
            placeHolder: field.placeHolder,
            description: field.description,
            orderIndex: currentOrderIndex++,
            labelKey: labelKey,
          }).returning();

          if (!insertedField) continue;

          if (field.options && Array.isArray(field.options) && field.options.length > 0) {
            let optOrder = 0;
            const optionsToInsert = field.options.map((opt: any) => ({
              id: crypto.randomUUID(),
              formFeildId: insertedField.id,
              label: opt.label || `Option ${optOrder + 1}`,
              value: opt.value || `option_${optOrder + 1}`,
              orderIndex: opt.orderIndex || optOrder++
            }));
            await tx.insert(formFeildOptions).values(optionsToInsert);
          }
        }
      }
    });

    return { success: true };
  }
}

export default FormService;
