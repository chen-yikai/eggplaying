-- Not expressible in the Drizzle schema, so it lives in this custom migration.
-- Explicit grants: the Data API needs them, and project default privileges can't be relied on. RLS still applies.
GRANT SELECT, INSERT, UPDATE, DELETE ON "favorites", "plays" TO "authenticated";--> statement-breakpoint
GRANT SELECT ON "chat_messages" TO "anon", "authenticated";--> statement-breakpoint
GRANT INSERT ON "chat_messages" TO "authenticated";--> statement-breakpoint
ALTER PUBLICATION "supabase_realtime" ADD TABLE "chat_messages";
