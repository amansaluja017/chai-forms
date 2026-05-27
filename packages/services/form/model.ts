import { z } from "zod";

export const createFormInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(255).optional(),
});

export const updateFormInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z.string().max(255).optional(),
});

export const formIdInputSchema = z.object({
  id: z.string().uuid(),
});

export const generateFormWithAIInputSchema = z.object({
  formId: z.string().uuid(),
  prompt: z.string().min(1).max(2000),
});

export const formOutputSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  createdBy: z.string().uuid(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
});

export type CreateFormInputType = z.infer<typeof createFormInputSchema>;
export type UpdateFormInputType = z.infer<typeof updateFormInputSchema>;
export type FormIdInputType = z.infer<typeof formIdInputSchema>;
export type FormOutputType = z.infer<typeof formOutputSchema>;
export type GenerateFormWithAIInputType = z.infer<typeof generateFormWithAIInputSchema>;

export const fieldTypeSchema = z.enum([
  "text", "number", "email", "phone", "address", "checkbox", 
  "radio", "file", "yes_no", "date", "datetime", "time", "dropdown"
]);

export const formOptionSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1),
  value: z.string().min(1),
  orderIndex: z.number()
});

export const fieldValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  message: z.string().optional(),
});

export const formFieldSchema = z.object({
  id: z.string().uuid().optional(),
  formId: z.string().uuid(),
  label: z.string().min(1),
  type: fieldTypeSchema,
  isRequired: z.boolean().default(false),
  placeHolder: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  orderIndex: z.number(),
  labelKey: z.string(),
  options: z.array(formOptionSchema).optional(),
  validation: fieldValidationSchema.nullable().optional(),
});

export const saveFormFieldsInputSchema = z.object({
  formId: z.string().uuid(),
  fields: z.array(formFieldSchema),
});

export const formStatusSchema = z.object({
  formId: z.string().uuid(),
  status: z.enum(["draft", "published", "archived", "deleted"]).default("draft"),
  visibility: z.enum(["public", "unlisted"]).default("public"),
});

export const formWorkspaceOutputSchema = formOutputSchema.extend({
  fields: z.array(formFieldSchema),
  status: formStatusSchema.nullable(),
});

export const getUserFormsOutputSchema = z.array(
  formOutputSchema.extend({
    status: z.string(),
  })
);

export type FormFieldType = z.infer<typeof formFieldSchema>;
export type FormOptionType = z.infer<typeof formOptionSchema>;
export type SaveFormFieldsInputType = z.infer<typeof saveFormFieldsInputSchema>;
export type FormStatusType = z.infer<typeof formStatusSchema>;
export type FormWorkspaceOutputType = z.infer<typeof formWorkspaceOutputSchema>;
export type GetUserFormsOutputType = z.infer<typeof getUserFormsOutputSchema>;

export const createFormFieldInputSchema = formFieldSchema.extend({ id: z.string().uuid().optional() });

export const updateFormFieldInputSchema = formFieldSchema.extend({
  id: z.string().uuid(),
});

export const deleteFormFieldInputSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
});

export const reorderFormFieldsInputSchema = z.object({
  formId: z.string().uuid(),
  orders: z.array(z.object({
    id: z.string().uuid(),
    orderIndex: z.number()
  }))
});

export type CreateFormFieldInputType = z.infer<typeof createFormFieldInputSchema>;
export type UpdateFormFieldInputType = z.infer<typeof updateFormFieldInputSchema>;
export type DeleteFormFieldInputType = z.infer<typeof deleteFormFieldInputSchema>;
export type ReorderFormFieldsInputType = z.infer<typeof reorderFormFieldsInputSchema>;

export const submitFormResponseInputSchema = z.object({
  formId: z.string().uuid(),
  response: z.array(z.object({
    formFieldId: z.string(), // Field ID is a UUID
    value: z.string(), // All field responses serialized as string
  })),
  timeToComplete: z.number().default(0),
});

export type SubmitFormResponseInputType = z.infer<typeof submitFormResponseInputSchema>;

export const getFormResponsesOutputSchema = z.object({
  fields: z.array(z.object({
    id: z.string(),
    label: z.string(),
    type: z.string(),
  })),
  responses: z.array(z.object({
    id: z.string(),
    timeToComplete: z.number(),
    createdAt: z.date().nullable(),
    response: z.array(z.object({
      formFieldId: z.string(),
      value: z.string(),
    })),
  })),
});

export type GetFormResponsesOutputType = z.infer<typeof getFormResponsesOutputSchema>;

export const getPublicFormsOutputSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  views: z.number(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  creatorName: z.string(),
}));

export type GetPublicFormsOutputType = z.infer<typeof getPublicFormsOutputSchema>;
