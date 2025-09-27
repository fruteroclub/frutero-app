CREATE TABLE "mentorships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentor_id" uuid NOT NULL,
	"participant_id" uuid NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"session_notes" jsonb,
	"mentor_rating" integer,
	"participant_rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_mentorship" UNIQUE("mentor_id","participant_id")
);
--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "organizer" text;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "tracks" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "programs" ADD COLUMN "submission_deadline" timestamp;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "available_from" timestamp;--> statement-breakpoint
ALTER TABLE "quests" ADD COLUMN "due_date" timestamp;--> statement-breakpoint
ALTER TABLE "user_quests" ADD COLUMN "submission_text" text;--> statement-breakpoint
ALTER TABLE "user_quests" ADD COLUMN "submission_urls" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "mentorships" ADD CONSTRAINT "mentorships_mentor_id_users_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorships" ADD CONSTRAINT "mentorships_participant_id_users_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;