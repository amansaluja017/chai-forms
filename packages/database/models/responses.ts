import {
  pgTable,
  uuid,
  timestamp,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";

export interface ResponseField {
  formFieldId: string;
  value: string;
};

export type ResponseFields = ResponseField[];

export const responsesTable = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id").notNull().references(() => formTable.id),
  response: jsonb("response").$type<ResponseFields>().notNull(),
  timeToComplete: integer("time_to_complete").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export type SelectResponse = typeof responsesTable.$inferSelect;
export type InsertResponse = typeof responsesTable.$inferInsert;
