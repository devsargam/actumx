CREATE TABLE "endpoints" (
	"id" text PRIMARY KEY NOT NULL,
	"service_id" text NOT NULL,
	"method" text NOT NULL,
	"path" text NOT NULL,
	"price_cents" integer NOT NULL,
	"is_enabled" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_links" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"description" text,
	"is_reusable" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"favicon_url" text,
	"base_url" text NOT NULL,
	"websocket_url" text,
	"auth_method" text NOT NULL,
	"api_key" text,
	"is_live" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_endpoints_service_id" ON "endpoints" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "idx_payment_links_user_id" ON "payment_links" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_services_user_id" ON "services" USING btree ("user_id");