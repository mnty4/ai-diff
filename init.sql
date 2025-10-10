CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS prompts (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         title TEXT NOT NULL,
                         prompt TEXT NOT NULL,
                         tweak TEXT NOT NULL,
                         created_at TIMESTAMP DEFAULT NOW(),
                         updated_at TIMESTAMP DEFAULT NOW()
);

-- versions table
CREATE TABLE IF NOT EXISTS versions (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
                          text TEXT,
                          created_at TIMESTAMP DEFAULT NOW(),
                          updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_versions_prompt_id ON versions(prompt_id);
