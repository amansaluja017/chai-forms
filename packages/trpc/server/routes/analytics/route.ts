import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formIdInputSchema } from "@repo/services/form/model";
import { globalAnalyticsSchema, formAnalyticsSchema, formChartDataSchema } from "@repo/services/analytics/model";
import { getGlobalAnalyticsProcedure, getFormAnalyticsProcedure, getFormChartDataProcedure, trackFormViewProcedure } from "./procedures";

const TAGS = ["Analytics"];
const getPath = generatePath("/analytics");

export const analyticsRouter = router({
  getGlobalAnalytics: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/global"), tags: TAGS } })
    .input(z.void())
    .output(globalAnalyticsSchema)
    .query(async ({ ctx }) => await getGlobalAnalyticsProcedure({ ctx })),

  getFormAnalytics: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{id}"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(formAnalyticsSchema)
    .query(async ({ input, ctx }) => await getFormAnalyticsProcedure({ input, ctx })),

  getFormChartData: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/{id}/charts"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(z.array(formChartDataSchema))
    .query(async ({ input, ctx }) => await getFormChartDataProcedure({ input, ctx })),

  trackFormView: publicProcedure
    .meta({ openapi: { method: "POST", path: getPath("/{id}/view"), tags: TAGS } })
    .input(formIdInputSchema)
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => await trackFormViewProcedure({ input })),
});
