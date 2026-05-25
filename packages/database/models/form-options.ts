import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  numeric,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { formFieldsTable } from "./form-feilds";
import { unique } from "drizzle-orm/pg-core";

export const formFeildOptions = pgTable("form_options", {
  id: uuid("id").primaryKey().defaultRandom(),

  formFeildId: uuid("form_feild_id").notNull().references(() => formFieldsTable.id),

  label: varchar("label", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  orderIndex: doublePrecision("order_index").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table) => {
  return [unique("form_feild_id").on(table.formFeildId, table.orderIndex)];
});

export type SelectFormFieldOption = typeof formFeildOptions.$inferSelect;
export type InsertFormFieldOption = typeof formFeildOptions.$inferInsert;
