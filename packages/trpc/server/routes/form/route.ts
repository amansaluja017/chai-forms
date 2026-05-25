import { z } from "zod";
import { createFormInputSchema, formIdInputSchema, formOutputSchema, updateFormInputSchema, formWorkspaceOutputSchema, saveFormFieldsInputSchema, formStatusSchema, createFormFieldInputSchema, updateFormFieldInputSchema, deleteFormFieldInputSchema, reorderFormFieldsInputSchema, submitFormResponseInputSchema } from "@repo/services/form/model";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormProcedure, deleteFormProcedure, getFormByIdProcedure, getFormsProcedure, updateFormProcedure, getFormWorkspaceProcedure, saveFormFieldsProcedure, updateFormStatusProcedure, createFormFieldProcedure, updateFormFieldProcedure, deleteFormFieldProcedure, reorderFormFieldsProcedure, getPublicFormWorkspaceProcedure, submitFormProcedure } from "./procedures";

const TAGS = ["Forms"];
const getPath = generatePath("/forms");

export const formRouter = router({
  createForm: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/create"), tags: TAGS } })
    .input(createFormInputSchema)
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => await createFormProcedure({ input, ctx })),

  getForms: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/"), tags: TAGS } })
    .input(z.void())
    .output(z.array(formOutputSchema))
    .query(async ({ ctx }) => await getFormsProcedure({ ctx })),

  getFormById: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{id}"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(formOutputSchema)
    .query(async ({ input, ctx }) => await getFormByIdProcedure({ input, ctx })),

  updateForm: protectedProcedure
    .meta({ openapi: { method: "PUT", path: getPath("/update"), tags: TAGS } })
    .input(updateFormInputSchema)
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => await updateFormProcedure({ input, ctx })),

  deleteForm: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/delete"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(formOutputSchema)
    .mutation(async ({ input, ctx }) => await deleteFormProcedure({ input, ctx })),

  getFormWorkspace: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{id}/workspace"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(formWorkspaceOutputSchema)
    .query(async ({ input, ctx }) => await getFormWorkspaceProcedure({ input, ctx })),

  saveFormFields: protectedProcedure
    .meta({ openapi: { method: "PUT", path: getPath("/{formId}/fields"), tags: TAGS } })
    .input(saveFormFieldsInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => await saveFormFieldsProcedure({ input, ctx })),

  updateFormStatus: protectedProcedure
    .meta({ openapi: { method: "PUT", path: getPath("/{formId}/status"), tags: TAGS } })
    .input(formStatusSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => await updateFormStatusProcedure({ input, ctx })),

  createFormField: protectedProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{formId}/field"), tags: TAGS } })
    .input(createFormFieldInputSchema)
    .output(z.any())
    .mutation(async ({ input, ctx }) => await createFormFieldProcedure({ input, ctx })),

  updateFormField: protectedProcedure
    .meta({ openapi: { method: "PUT", path: getPath("/{formId}/field"), tags: TAGS } })
    .input(updateFormFieldInputSchema)
    .output(z.any())
    .mutation(async ({ input, ctx }) => await updateFormFieldProcedure({ input, ctx })),

  deleteFormField: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/{formId}/field"), tags: TAGS } })
    .input(deleteFormFieldInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => await deleteFormFieldProcedure({ input, ctx })),

  reorderFormFields: protectedProcedure
    .meta({ openapi: { method: "PUT", path: getPath("/{formId}/reorder"), tags: TAGS } })
    .input(reorderFormFieldsInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => await reorderFormFieldsProcedure({ input, ctx })),

  getPublicFormWorkspace: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/public/{id}"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(formWorkspaceOutputSchema)
    .query(async ({ input }) => await getPublicFormWorkspaceProcedure({ input })),

  submitForm: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/public/{formId}/submit"), tags: TAGS } })
    .input(submitFormResponseInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => await submitFormProcedure({ input })),
});
