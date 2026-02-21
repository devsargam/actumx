CREATE TABLE "agents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "agents_public_key_unique" UNIQUE("public_key")
);
--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_agents_user_id" ON "agents" USING btree ("user_id");