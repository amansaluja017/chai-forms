import { z } from "zod";

export const globalAnalyticsSchema = z.object({
  totalForms: z.number(),
  totalViews: z.number(),
  totalResponses: z.number(),
  completionRate: z.number(),
});

export const formAnalyticsSchema = z.object({
  views: z.number(),
  responses: z.number(),
  completionRate: z.number(),
  averageTime: z.number(), // in seconds
});

export const formChartDataSchema = z.object({
  fieldId: z.string().uuid(),
  label: z.string(),
  type: z.string(),
  data: z.array(z.object({
    name: z.string(),
    value: z.number(),
  })),
});

export type GlobalAnalyticsType = z.infer<typeof globalAnalyticsSchema>;
export type FormAnalyticsType = z.infer<typeof formAnalyticsSchema>;
export type FormChartDataType = z.infer<typeof formChartDataSchema>;
