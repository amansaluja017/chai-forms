import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const tokenTypeEnum = pgEnum("token_type", ["passwordResetToken", "verificationToken"]);

export const tokensTable = pgTable("tokens", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id").notNull().references(() => usersTable.id),

  tokenType: tokenTypeEnum("token_type").notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),

  revoked: boolean("revoked").notNull().default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectToken = typeof tokensTable.$inferSelect;
export type InsertToken = typeof tokensTable.$inferInsert;
