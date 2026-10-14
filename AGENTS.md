# Agent Notes

## Backend
- This project runs on Lovable Cloud. All schema changes go through the database migration tool, and every new `public` table needs `GRANT`s in the same migration before RLS policies.
- Keep application tables in `public`. Never edit the generated Supabase client, types, or `.env`.

## Data fetching
- Give each React Query a cache key that is unique to the columns it selects. Two queries sharing one key but selecting different columns overwrite each other's cache, and rows can arrive without `id` — which makes admin edit and delete requests target `id=eq.undefined`. Name the key after the screen and purpose (e.g. `registrationTeams`, `leaderboardGames`) rather than after the table.

## Admin panel
- The admin panel is gated by a client-side password, not real accounts. Do not present it, or the registration admin codes, as security; if real access control is ever needed, move it to Lovable Cloud auth with a roles table.
