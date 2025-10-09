CREATE TABLE IF NOT EXISTS prompts (
                         id UUID NOT NULL,
                         title TEXT NOT NULL,
                         prompt TEXT NOT NULL,
                         tweak TEXT NOT NULL,
                         created_at TIMESTAMP DEFAULT NOW(),
                         updated_at TIMESTAMP DEFAULT NOW()
);

-- versions table
CREATE TABLE IF NOT EXISTS versions (
                          id UUID PRIMARY KEY,
                          prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
                          text TEXT,
                          created_at TIMESTAMP DEFAULT NOW(),
                          updated_at TIMESTAMP DEFAULT NOW()
);