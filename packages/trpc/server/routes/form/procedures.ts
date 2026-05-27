import { CreateFormInputType, FormIdInputType, UpdateFormInputType, SaveFormFieldsInputType, FormStatusType, CreateFormFieldInputType, UpdateFormFieldInputType, DeleteFormFieldInputType, ReorderFormFieldsInputType, SubmitFormResponseInputType, GetFormResponsesOutputType, GetPublicFormsOutputType, GenerateFormWithAIInputType, GetPublicFormWorkspaceInputType } from "@repo/services/form/model";
import { formService } from "../../services";
import { Context } from "../../context";
import { requireRateLimit } from "../../utils/rate-limit";

export const createFormProcedure = async ({ input, ctx }: { input: CreateFormInputType, ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }
  await requireRateLimit(ctx, "create_form", 10, 3600); // 10 forms per hour
  return await formService.createForm(ctx.user.id, input);
};

export const getFormsProcedure = async ({ ctx }: { ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }
  return await formService.getForms(ctx.user.id);
};

export const getFormByIdProcedure = async ({ input, ctx }: { input: FormIdInputType, ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }
  return await formService.getFormById(ctx.user.id, input, ctx.user.role === "admin");
};

export const updateFormProcedure = async ({ input, ctx }: { input: UpdateFormInputType, ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }
  return await formService.updateForm(ctx.user.id, input);
};

export const deleteFormProcedure = async ({ input, ctx }: { input: FormIdInputType, ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }
  return await formService.deleteForm(ctx.user.id, input);
};

export const getFormWorkspaceProcedure = async ({ input, ctx }: { input: FormIdInputType, ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }
  return await formService.getFormWorkspace(ctx.user.id, input, ctx.user.role === "admin");
};

export const saveFormFieldsProcedure = async ({ input, ctx }: { input: SaveFormFieldsInputType, ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }
  return await formService.saveFormFields(ctx.user.id, input);
};

export const updateFormStatusProcedure = async ({ input, ctx }: { input: FormStatusType, ctx: Context }) => {
  
  return await formService.updateFormStatus(ctx.user!.id, input);
};

export const createFormFieldProcedure = async ({ input, ctx }: { input: CreateFormFieldInputType, ctx: Context }) => {
  await requireRateLimit(ctx, "create_field", 10, 60); // 30 fields per minute
  return await formService.createFormField(ctx.user!.id, input);
};

export const updateFormFieldProcedure = async ({ input, ctx }: { input: UpdateFormFieldInputType, ctx: Context }) => {
  return await formService.updateFormField(ctx.user!.id, input);
};

export const deleteFormFieldProcedure = async ({ input, ctx }: { input: DeleteFormFieldInputType, ctx: Context }) => {
  return await formService.deleteFormField(ctx.user!.id, input);
};

export const reorderFormFieldsProcedure = async ({ input, ctx }: { input: ReorderFormFieldsInputType, ctx: Context }) => {
  return await formService.reorderFormFields(ctx.user!.id, input);
};

export const getPublicFormWorkspaceProcedure = async ({ input, ctx }: { input: GetPublicFormWorkspaceInputType, ctx: Context }) => {
  if (input.password) {
    await requireRateLimit(ctx, `form_password:${input.id}`, 5, 60); // 5 attempts per minute
  }
  return await formService.getPublicFormWorkspace(input);
};

export const submitFormProcedure = async ({ input, ctx }: { input: SubmitFormResponseInputType, ctx: Context }) => {
  await requireRateLimit(ctx, "submit_form", 3, 60); // 5 submissions per minute

  return await formService.submitForm(input);
};

export const getFormResponsesProcedure = async ({ input, ctx }: { input: FormIdInputType, ctx: Context }): Promise<GetFormResponsesOutputType> => {
  return await formService.getFormResponses(ctx.user!.id, input, ctx.user!.role === "admin");
};

export const getPublicFormsProcedure = async (): Promise<GetPublicFormsOutputType> => {
  return await formService.getPublicForms();
};

export const generateFormWithAIProcedure = async ({ input, ctx }: { input: GenerateFormWithAIInputType, ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }
  await requireRateLimit(ctx, "generate_ai", 5, 3600); // 5 AI generations per hour
  return await formService.generateFormWithAI(ctx.user.id, input);
};
