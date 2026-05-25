ALTER TABLE "tokens" ALTER COLUMN "token_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."token_type";--> statement-breakpoint
CREATE TYPE "public"."token_type" AS ENUM('passwordResetToken', 'verificationToken');--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "token_type" SET DATA TYPE "public"."token_type" USING "token_type"::"public"."token_type";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "two_fa_code";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "two_fa_code_expiry_at";