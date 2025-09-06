-- Living Progress Matrix System
-- Session 142 Implementation of Session 141 Design
-- Single source of truth for platform development status

CREATE TABLE IF NOT EXISTS public.platform_progress_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Feature Identity
  canvas_id TEXT, -- Links to Canvas wireframe (001-1, 001-2, etc.)
  user_story TEXT, -- US-155, US-156, etc.
  feature_name TEXT NOT NULL UNIQUE, -- Unique identifier
  feature_category TEXT, -- "onboarding", "communication", "activities", etc.
  priority TEXT CHECK (priority IN ('P0', 'P1', 'P2')) NOT NULL,
  
  -- Implementation Status
  status TEXT CHECK (status IN (
    'not_started',
    'in_progress', 
    'implemented',
    'validated',
    'production',
    'deprecated'
  )) DEFAULT 'not_started' NOT NULL,
  
  -- Progress Details (JSONB for flexibility)
  database_tables JSONB DEFAULT '[]'::jsonb,
  api_endpoints JSONB DEFAULT '[]'::jsonb,
  ui_components JSONB DEFAULT '[]'::jsonb,
  test_coverage JSONB DEFAULT '{}'::jsonb,
  
  -- Validation & Health
  reality_health DECIMAL(5,2),
  last_validated TIMESTAMPTZ,
  validation_notes TEXT,
  known_issues JSONB DEFAULT '[]'::jsonb,
  ninety_five_syndrome BOOLEAN DEFAULT false,
  
  -- Session Tracking
  implemented_by TEXT[], -- Array of session IDs
  modified_by TEXT[], -- Array of session IDs that modified
  documentation TEXT[], -- Array of document paths
  pr_numbers TEXT[], -- GitHub PR numbers
  
  -- Dependencies
  depends_on TEXT[], -- Other feature_names this depends on
  blocks TEXT[], -- Features blocked by this
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_progress_status ON platform_progress_matrix(status);
CREATE INDEX idx_progress_priority ON platform_progress_matrix(priority);
CREATE INDEX idx_progress_canvas ON platform_progress_matrix(canvas_id);
CREATE INDEX idx_progress_updated ON platform_progress_matrix(updated_at DESC);

-- RLS for public read access
ALTER TABLE platform_progress_matrix ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view progress" 
  ON platform_progress_matrix FOR SELECT 
  USING (true);

CREATE POLICY "System can update progress" 
  ON platform_progress_matrix FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_progress_matrix_updated_at 
  BEFORE UPDATE ON platform_progress_matrix 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE platform_progress_matrix IS 'Living progress tracking system - Single source of truth for platform development status. Created Session 141-142.';