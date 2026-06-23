CREATE TABLE "archive_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"image_url" text,
	"note" text,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"source" text,
	"found_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_reason" text
);
--> statement-breakpoint
CREATE TABLE "archive_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "archive_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "archive_item_tags" (
	"item_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "archive_item_tags_item_id_tag_id_pk" PRIMARY KEY("item_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "archive_item_tags" ADD CONSTRAINT "archive_item_tags_item_id_archive_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."archive_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "archive_item_tags" ADD CONSTRAINT "archive_item_tags_tag_id_archive_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."archive_tags"("id") ON DELETE cascade ON UPDATE no action;
