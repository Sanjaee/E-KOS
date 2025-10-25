ALTER TABLE "users" ADD COLUMN "reset_password_code" varchar(6);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_expiry" timestamp;