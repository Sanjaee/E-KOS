CREATE TABLE "consultations" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"phone_number" varchar(20),
	"consultation_type" varchar(50) NOT NULL,
	"consultation_content" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"admin_response" text,
	"admin_id" varchar(191),
	"response_date" timestamp,
	"notification_sent_to_admin" boolean DEFAULT false,
	"notification_sent_to_user" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;