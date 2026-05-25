import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formTable = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  views: integer("views").default(0).notNull(),

  createdBy: uuid("created_by").notNull().references(() => usersTable.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectForm = typeof formTable.$inferSelect;
export type InsertForm = typeof formTable.$inferInsert;
