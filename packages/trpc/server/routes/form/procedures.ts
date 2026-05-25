import { CreateFormInputType, FormIdInputType, UpdateFormInputType, SaveFormFieldsInputType, FormStatusType, CreateFormFieldInputType, UpdateFormFieldInputType, DeleteFormFieldInputType, ReorderFormFieldsInputType, SubmitFormResponseInputType } from "@repo/services/form/model";
import { formService } from "../../services";
import { Context } from "../../context";

export const createFormProcedure = async ({ input, ctx }: { input: CreateFormInputType, ctx: Context }) => {
  if (!ctx.user) {
    throw new Error("No user found");
  }
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
  return await formService.getFormById(ctx.user.id, input);
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
  return await formService.getFormWorkspace(ctx.user.id, input);
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

export const getPublicFormWorkspaceProcedure = async ({ input }: { input: FormIdInputType }) => {
  return await formService.getPublicFormWorkspace(input);
};

export const submitFormProcedure = async ({ input }: { input: SubmitFormResponseInputType }) => {
  return await formService.submitForm(input);
};
