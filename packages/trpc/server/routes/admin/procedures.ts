import { z } from "zod";
import AdminService from "@repo/services/admin";
import { adminFormsListInputSchema, adminDeleteFormInputSchema } from "@repo/services/admin/model";
import { Context } from "../../context";

const adminService = new AdminService();

export const getDashboardStatsProcedure = async ({ ctx }: { ctx: Context }) => {
  return await adminService.getDashboardStats();
};

export const getFormsListProcedure = async ({ input, ctx }: { input: z.infer<typeof adminFormsListInputSchema>, ctx: Context }) => {
  return await adminService.getFormsList(input);
};

export const deleteFormAsAdminProcedure = async ({ input, ctx }: { input: z.infer<typeof adminDeleteFormInputSchema>, ctx: Context }) => {
  return await adminService.deleteForm(input);
};
