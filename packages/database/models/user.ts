import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  pgEnum,
  check
} from "drizzle-orm/pg-core";

export const providerEnum = pgEnum("provider", ["google", "local"]);
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  fullName: varchar("full_name", { length: 80 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),

  provider: providerEnum("provider").notNull(),

  password: varchar("password", { length: 255 }),

  profileImageUrl: text("profile_image_url"),

  is2FAEnabled: boolean("is_2fa_enabled").default(false).notNull(),

  role: roleEnum("role").default("user").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table) => [
  check(
    "provider_password_check",
    sql`
        (
          ${table.provider} = 'google'
          AND ${table.password} IS NULL
        )
        OR
        (
          ${table.provider} = 'local'
          AND ${table.password} IS NOT NULL
        )
      `
  )
]);

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
