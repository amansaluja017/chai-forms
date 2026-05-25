CREATE TYPE "public"."provider" AS ENUM('google', 'local');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" "provider" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "provider_password_check" CHECK (
        (
          "users"."provider" = 'google'
          AND "users"."password" IS NULL
        )
        OR
        (
          "users"."provider" = 'local'
          AND "users"."password" IS NOT NULL
        )
      );