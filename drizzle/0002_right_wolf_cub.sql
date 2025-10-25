ALTER TABLE "users" ALTER COLUMN "emailVerified" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "otp_code" varchar(6);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "otp_expiry" timestamp;