import { z } from "zod";
import { adminProcedure, protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { adminFormsListInputSchema, adminDeleteFormInputSchema, adminStatsOutputSchema, adminFormsListOutputSchema } from "@repo/services/admin/model";
import { getDashboardStatsProcedure, getFormsListProcedure, deleteFormAsAdminProcedure } from "./procedures";

const TAGS = ["Admin"];
const getPath = generatePath("/admin");

export const adminRouter = router({
  getDashboardStats: adminProcedure
    .meta({ openapi: { method: "GET", path: getPath("/stats"), tags: TAGS } })
    .input(z.void())
    .output(adminStatsOutputSchema)
    .query(async ({ ctx }) => await getDashboardStatsProcedure({ ctx })),

  getFormsList: adminProcedure
    .meta({ openapi: { method: "GET", path: getPath("/forms"), tags: TAGS } })
    .input(adminFormsListInputSchema)
    .output(adminFormsListOutputSchema)
    .query(async ({ input, ctx }) => await getFormsListProcedure({ input, ctx })),

  deleteFormAsAdmin: adminProcedure
    .meta({ openapi: { method: "DELETE", path: getPath("/form"), tags: TAGS } })
    .input(adminDeleteFormInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => await deleteFormAsAdminProcedure({ input, ctx })),
});
