import AnalyticsService from "@repo/services/analytics";
import { formIdInputSchema } from "@repo/services/form/model";
import { z } from "zod";
import { Context } from "../../context";

const analyticsService = new AnalyticsService();

export const getGlobalAnalyticsProcedure = async ({ ctx }: { ctx: Context }) => {
  return await analyticsService.getGlobalAnalytics(ctx.user!.id);
};

export const getFormAnalyticsProcedure = async ({ input, ctx }: { input: z.infer<typeof formIdInputSchema>, ctx: Context }) => {
  return await analyticsService.getFormAnalytics(ctx.user!.id, input.id);
};

export const getFormChartDataProcedure = async ({ input, ctx }: { input: z.infer<typeof formIdInputSchema>, ctx: Context }) => {
  return await analyticsService.getFormChartData(ctx.user!.id, input.id);
};

export const trackFormViewProcedure = async ({ input }: { input: z.infer<typeof formIdInputSchema> }) => {
  return await analyticsService.trackFormView(input.id);
};
