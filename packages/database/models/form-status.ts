import {
  pgTable,
  uuid,
  timestamp,
  pgEnum,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { formTable } from "./form";

export const statusEnum = pgEnum("status", ["draft", "published", "archived", "deleted"]);
export const visibilityEnum = pgEnum("visibility", ["public", "unlisted"]);

export const formStatusTable = pgTable("form_status", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id").notNull().references(() => formTable.id),

  status: statusEnum("status").default("draft").notNull(),
  visibility: visibilityEnum("visibility").default("public").notNull(),

  isProtected: boolean("is_protected").default(false).notNull(),
  password: varchar("password", {length: 100}),

  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectFormStatus = typeof formStatusTable.$inferSelect;
export type InsertFormStatus = typeof formStatusTable.$inferInsert;
