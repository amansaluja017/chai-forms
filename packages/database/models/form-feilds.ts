import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  numeric,
  unique,
  pgEnum,
  doublePrecision,
  jsonb,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type", [
  "text",
  "number",
  "email",
  "phone",
  "address",
  "checkbox",
  "radio",
  "file",
  "yes_no",
  "date",
  "datetime",
  "time",
  "dropdown"
]);

export const formFieldsTable = pgTable("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id").notNull().references(() => formTable.id),

  label: varchar("label", { length: 255 }).notNull(),
  type: fieldTypeEnum("type").notNull(),
  isRequired: boolean("is_required").notNull().default(false),
  placeHolder: varchar("placeholder", { length: 255 }),
  description: varchar("description", { length: 255 }),

  orderIndex: doublePrecision("order_index").notNull(),
  labelKey: varchar("label_key", { length: 255 }).notNull(),

  validation: jsonb("validation"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table) => {
  return [unique("form_fields_formId_orderIndex_idx").on(table.formId, table.orderIndex)];
});

export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;
