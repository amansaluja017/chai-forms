import { z } from "zod";

export const adminFormsListInputSchema = z.object({
  search: z.string().optional(),
  statusFilter: z.enum(["all", "active", "draft"]).optional(),
  sortFilter: z.enum(["latest", "oldest"]).optional(),
});

export const adminDeleteFormInputSchema = z.object({
  formId: z.string(),
  reason: z.string().min(10, "Reason must be at least 10 characters long"),
});

export const adminStatsOutputSchema = z.object({
  totalUsers: z.number(),
  totalForms: z.number(),
  draftForms: z.number(),
  totalResponses: z.number(),
  averageCompletionTime: z.number(),
  chartData: z.array(z.object({
    date: z.string(),
    responses: z.number(),
  })),
});

export const adminFormsListOutputSchema = z.array(z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  responsesCount: z.number(),
  createdAt: z.date(),
  creatorName: z.string(),
  creatorEmail: z.string(),
}));
