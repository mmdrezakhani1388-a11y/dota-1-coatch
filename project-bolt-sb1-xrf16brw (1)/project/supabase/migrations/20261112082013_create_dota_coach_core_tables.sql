/*
# Create core Dota Coach tables

1. New Tables
- `app_settings`: one row (id = 'default') holding the user's preferences as JSON (language, theme, level, coaching style, favorite heroes).
- `builds`: user-created item builds. Each build stores hero, role, playstyle, situation, ordered steps (items with optional alternatives and notes) and general notes.

2. Security
- Enable RLS on both tables.
- The app has no sign-in screen, so every request runs as the `anon` role. Policies therefore target `anon, authenticated`.
- Data is intentionally shared by whoever uses this instance (single-tenant, no accounts).

3. Notes
- No existing data is modified or removed.
- Statements are idempotent and safe to re-run.
*/

CREATE TABLE IF NOT EXISTS app_settings (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS builds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  hero_id text NOT NULL,
  role text NOT NULL DEFAULT 'carry',
  playstyle text NOT NULL DEFAULT 'balanced',
  situation text NOT NULL DEFAULT 'standard',
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS builds_hero_id_idx ON builds (hero_id);
CREATE INDEX IF NOT EXISTS builds_updated_at_idx ON builds (updated_at DESC);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON app_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON builds TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_app_settings" ON app_settings;
CREATE POLICY "anon_select_app_settings" ON app_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_app_settings" ON app_settings;
CREATE POLICY "anon_insert_app_settings" ON app_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_app_settings" ON app_settings;
CREATE POLICY "anon_update_app_settings" ON app_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_builds" ON builds;
CREATE POLICY "anon_select_builds" ON builds FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_builds" ON builds;
CREATE POLICY "anon_insert_builds" ON builds FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_builds" ON builds;
CREATE POLICY "anon_update_builds" ON builds FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_builds" ON builds;
CREATE POLICY "anon_delete_builds" ON builds FOR DELETE
  TO anon, authenticated USING (true);
