-- Session 143: Visitor Tracking - Social Validation through Daily Checks
-- Purpose: Create the "Today Counter" that drove Cyworld addiction
-- Priority: P0.1 (Daily Engagement Hook)

-- ============================================
-- PROFILE VISITORS - Who's checking you out?
-- ============================================
CREATE TABLE IF NOT EXISTS public.profile_visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visited_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  visit_date DATE DEFAULT CURRENT_DATE NOT NULL,
  visit_count INTEGER DEFAULT 1,
  last_visit TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  is_friend BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}', -- Store referrer, context, etc.
  
  -- Unique visitor per day (can visit multiple times but counts as one daily visitor)
  UNIQUE(profile_id, visitor_id, visit_date)
);

-- Indexes for fast queries
CREATE INDEX idx_profile_visitors_profile ON public.profile_visitors(profile_id);
CREATE INDEX idx_profile_visitors_date ON public.profile_visitors(visit_date DESC);
CREATE INDEX idx_profile_visitors_visited_at ON public.profile_visitors(visited_at DESC);
-- Index for today's visitors (without partial index due to CURRENT_DATE mutability)
CREATE INDEX idx_profile_visitors_by_date ON public.profile_visitors(profile_id, visit_date);

-- ============================================
-- VISITOR STATS - Aggregated metrics
-- ============================================
CREATE TABLE IF NOT EXISTS public.visitor_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  today_count INTEGER DEFAULT 0,
  yesterday_count INTEGER DEFAULT 0,
  week_count INTEGER DEFAULT 0,
  month_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  unique_total INTEGER DEFAULT 0,
  peak_daily_count INTEGER DEFAULT 0,
  peak_date DATE,
  last_visitor_id UUID REFERENCES auth.users(id),
  last_visit_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- ============================================
-- PROFILE VIEWS LEADERBOARD - Competition!
-- ============================================
CREATE TABLE IF NOT EXISTS public.visitor_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'all_time')),
  period_date DATE NOT NULL,
  visitor_count INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, period_type, period_date)
);

-- Index for leaderboard queries
CREATE INDEX idx_visitor_leaderboard_period ON public.visitor_leaderboard(period_type, period_date, visitor_count DESC);

-- ============================================
-- PROFILE CUSTOMIZATION - Express yourself
-- ============================================
CREATE TABLE IF NOT EXISTS public.profile_customization (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id TEXT DEFAULT 'default',
  background_url TEXT,
  background_color TEXT DEFAULT '#ffffff',
  accent_color TEXT DEFAULT '#3b82f6',
  font_family TEXT DEFAULT 'Inter',
  profile_music_url TEXT,
  status_message TEXT,
  status_emoji TEXT DEFAULT '😊',
  show_achievements BOOLEAN DEFAULT true,
  show_visitor_count BOOLEAN DEFAULT true,
  show_emcoin_balance BOOLEAN DEFAULT false, -- Some may want privacy
  showcase_achievement_ids UUID[] DEFAULT '{}',
  custom_css TEXT, -- For advanced users
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- ============================================
-- PROFILE THEMES - Purchasable with EmCoins
-- ============================================
CREATE TABLE IF NOT EXISTS public.profile_themes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_url TEXT,
  emcoin_price NUMERIC(10,2) DEFAULT 0,
  category TEXT CHECK (category IN ('free', 'basic', 'premium', 'seasonal', 'achievement')),
  required_achievement_id UUID REFERENCES public.achievements(id),
  css_variables JSONB, -- Store theme CSS variables
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Seed some default themes
INSERT INTO public.profile_themes (id, name, description, category, emcoin_price, css_variables) VALUES
  ('default', 'Classic Blue', 'The default EDL theme', 'free', 0, 
   '{"primary": "#3b82f6", "background": "#ffffff", "text": "#1f2937"}'),
  ('dark', 'Night Mode', 'Easy on the eyes', 'free', 0,
   '{"primary": "#60a5fa", "background": "#111827", "text": "#f3f4f6"}'),
  ('sakura', 'Cherry Blossom', 'Spring vibes', 'basic', 100,
   '{"primary": "#fbbf24", "background": "#fef3c7", "text": "#92400e"}'),
  ('ocean', 'Deep Ocean', 'Dive deep', 'basic', 150,
   '{"primary": "#06b6d4", "background": "#0e7490", "text": "#ecfeff"}'),
  ('champion', 'Champion Gold', 'For winners only', 'achievement', 0,
   '{"primary": "#fbbf24", "background": "#1f2937", "text": "#fef3c7"}'),
  ('cyber', 'Cyberpunk', 'Future is now', 'premium', 500,
   '{"primary": "#f43f5e", "background": "#18181b", "text": "#fce7f3"}');

-- ============================================
-- FUNCTIONS FOR VISITOR TRACKING
-- ============================================

-- Function to record a profile visit
CREATE OR REPLACE FUNCTION record_profile_visit(
  p_profile_id UUID,
  p_visitor_id UUID
) RETURNS VOID AS $$
DECLARE
  v_is_friend BOOLEAN;
BEGIN
  -- Don't record self-visits
  IF p_profile_id = p_visitor_id THEN
    RETURN;
  END IF;

  -- Check if they're friends
  SELECT EXISTS (
    SELECT 1 FROM friendship 
    WHERE (requester_id = p_profile_id AND addressee_id = p_visitor_id 
           OR requester_id = p_visitor_id AND addressee_id = p_profile_id)
      AND status = 'accepted'
  ) INTO v_is_friend;

  -- Insert or update visit record
  INSERT INTO profile_visitors (
    profile_id, visitor_id, is_friend
  ) VALUES (
    p_profile_id, p_visitor_id, v_is_friend
  )
  ON CONFLICT (profile_id, visitor_id, visit_date) 
  DO UPDATE SET
    visit_count = profile_visitors.visit_count + 1,
    last_visit = NOW(),
    is_friend = v_is_friend;

  -- Update visitor stats
  PERFORM update_visitor_stats(p_profile_id);
END;
$$ LANGUAGE plpgsql;

-- Function to update visitor statistics
CREATE OR REPLACE FUNCTION update_visitor_stats(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_today_count INTEGER;
  v_yesterday_count INTEGER;
  v_week_count INTEGER;
  v_month_count INTEGER;
  v_total_count INTEGER;
  v_unique_total INTEGER;
  v_last_visitor UUID;
  v_last_visit TIMESTAMPTZ;
BEGIN
  -- Calculate counts
  SELECT COUNT(DISTINCT visitor_id) INTO v_today_count
  FROM profile_visitors 
  WHERE profile_id = p_user_id AND visit_date = CURRENT_DATE;

  SELECT COUNT(DISTINCT visitor_id) INTO v_yesterday_count
  FROM profile_visitors 
  WHERE profile_id = p_user_id AND visit_date = CURRENT_DATE - 1;

  SELECT COUNT(DISTINCT visitor_id) INTO v_week_count
  FROM profile_visitors 
  WHERE profile_id = p_user_id AND visit_date >= CURRENT_DATE - 7;

  SELECT COUNT(DISTINCT visitor_id) INTO v_month_count
  FROM profile_visitors 
  WHERE profile_id = p_user_id AND visit_date >= CURRENT_DATE - 30;

  SELECT COUNT(*), COUNT(DISTINCT visitor_id) 
  INTO v_total_count, v_unique_total
  FROM profile_visitors 
  WHERE profile_id = p_user_id;

  SELECT visitor_id, visited_at INTO v_last_visitor, v_last_visit
  FROM profile_visitors 
  WHERE profile_id = p_user_id 
  ORDER BY visited_at DESC 
  LIMIT 1;

  -- Upsert stats
  INSERT INTO visitor_stats (
    user_id, today_count, yesterday_count, week_count, 
    month_count, total_count, unique_total,
    last_visitor_id, last_visit_at
  ) VALUES (
    p_user_id, v_today_count, v_yesterday_count, v_week_count,
    v_month_count, v_total_count, v_unique_total,
    v_last_visitor, v_last_visit
  )
  ON CONFLICT (user_id) DO UPDATE SET
    today_count = v_today_count,
    yesterday_count = v_yesterday_count,
    week_count = v_week_count,
    month_count = v_month_count,
    total_count = v_total_count,
    unique_total = v_unique_total,
    last_visitor_id = v_last_visitor,
    last_visit_at = v_last_visit,
    peak_daily_count = GREATEST(visitor_stats.peak_daily_count, v_today_count),
    peak_date = CASE 
      WHEN v_today_count > visitor_stats.peak_daily_count 
      THEN CURRENT_DATE 
      ELSE visitor_stats.peak_date 
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to reset daily counts (run at midnight)
CREATE OR REPLACE FUNCTION reset_daily_visitor_counts()
RETURNS VOID AS $$
BEGIN
  UPDATE visitor_stats 
  SET yesterday_count = today_count, 
      today_count = 0,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.profile_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_customization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_themes ENABLE ROW LEVEL SECURITY;

-- Profile visitors - everyone can see (social validation!)
CREATE POLICY "Public visitor records" ON public.profile_visitors
  FOR SELECT USING (true);

CREATE POLICY "Service role manages visitors" ON public.profile_visitors
  FOR ALL USING (auth.role() = 'service_role');

-- Visitor stats - public for social competition
CREATE POLICY "Public visitor stats" ON public.visitor_stats
  FOR SELECT USING (true);

CREATE POLICY "Service role manages stats" ON public.visitor_stats
  FOR ALL USING (auth.role() = 'service_role');

-- Leaderboard - public for competition
CREATE POLICY "Public leaderboard" ON public.visitor_leaderboard
  FOR SELECT USING (true);

CREATE POLICY "Service role manages leaderboard" ON public.visitor_leaderboard
  FOR ALL USING (auth.role() = 'service_role');

-- Profile customization - view all, edit own
CREATE POLICY "View all customizations" ON public.profile_customization
  FOR SELECT USING (true);

CREATE POLICY "Users edit own customization" ON public.profile_customization
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users insert own customization" ON public.profile_customization
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages customization" ON public.profile_customization
  FOR ALL USING (auth.role() = 'service_role');

-- Themes - everyone can view
CREATE POLICY "Public themes" ON public.profile_themes
  FOR SELECT USING (true);

CREATE POLICY "Service role manages themes" ON public.profile_themes
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- AUTO-CREATE CUSTOMIZATION FOR NEW USERS
-- ============================================
CREATE OR REPLACE FUNCTION create_profile_customization()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profile_customization (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.visitor_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_profile_customization
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_customization();

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE public.profile_visitors IS 'Track who visits each profile - the Today counter that drives daily engagement';
COMMENT ON TABLE public.visitor_stats IS 'Aggregated visitor statistics for quick display';
COMMENT ON TABLE public.visitor_leaderboard IS 'Competition through visitor counts';
COMMENT ON TABLE public.profile_customization IS 'User profile customization - express identity';
COMMENT ON TABLE public.profile_themes IS 'Purchasable themes using EmCoins';

-- ============================================
-- SUCCESS
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Visitor Tracking & Profile Customization created! 👁️';
  RAISE NOTICE 'Tables: profile_visitors, visitor_stats, visitor_leaderboard, profile_customization, profile_themes';
  RAISE NOTICE 'The daily check addiction mechanism is ready!';
END $$;