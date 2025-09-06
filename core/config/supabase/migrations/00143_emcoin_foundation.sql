-- Session 143: EmCoin Foundation - The Virtual Economy for EDL
-- Purpose: Create the Dotori-inspired currency system that drives engagement
-- Priority: P0.1 (Cyworld Identity Hook)

-- ============================================
-- 1. EMCOIN WALLETS - Every user's virtual worth
-- ============================================
CREATE TABLE IF NOT EXISTS public.emcoin_wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC(10,2) DEFAULT 0 NOT NULL CHECK (balance >= 0),
  total_earned NUMERIC(10,2) DEFAULT 0 NOT NULL,
  total_spent NUMERIC(10,2) DEFAULT 0 NOT NULL,
  last_daily_bonus DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Index for fast user lookups
CREATE INDEX idx_emcoin_wallets_user_id ON public.emcoin_wallets(user_id);

-- ============================================
-- 2. EMCOIN TRANSACTIONS - Complete history
-- ============================================
CREATE TABLE IF NOT EXISTS public.emcoin_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_wallet_id UUID REFERENCES public.emcoin_wallets(id),
  to_wallet_id UUID REFERENCES public.emcoin_wallets(id),
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN (
    'top_up',           -- Parent purchasing EmCoins
    'activity_fee',     -- Paying for activity participation
    'achievement_reward', -- Earning from achievements
    'daily_bonus',      -- Daily login reward
    'transfer',         -- Friend-to-friend transfer
    'purchase',         -- Buying customization items
    'judge_payment',    -- Judge earning for work
    'refund'           -- System refund
  )),
  description TEXT,
  metadata JSONB DEFAULT '{}',  -- Store activity_id, achievement_id, item_id, etc.
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- At least one wallet must be specified
  CHECK (from_wallet_id IS NOT NULL OR to_wallet_id IS NOT NULL)
);

-- Indexes for transaction queries
CREATE INDEX idx_emcoin_transactions_from_wallet ON public.emcoin_transactions(from_wallet_id);
CREATE INDEX idx_emcoin_transactions_to_wallet ON public.emcoin_transactions(to_wallet_id);
CREATE INDEX idx_emcoin_transactions_type ON public.emcoin_transactions(type);
CREATE INDEX idx_emcoin_transactions_created_at ON public.emcoin_transactions(created_at DESC);

-- ============================================
-- 3. ACHIEVEMENTS - What students can earn
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  emcoin_reward NUMERIC(10,2) DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  category TEXT NOT NULL CHECK (category IN (
    'debate_wins',
    'participation',
    'streaks',
    'social',
    'academic',
    'special_event',
    'milestone'
  )),
  requirement_type TEXT CHECK (requirement_type IN ('count', 'streak', 'score', 'special')),
  requirement_value INTEGER,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for category queries
CREATE INDEX idx_achievements_category ON public.achievements(category);
CREATE INDEX idx_achievements_active ON public.achievements(is_active);

-- ============================================
-- 4. USER ACHIEVEMENTS - Personal trophy case
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  emcoin_awarded NUMERIC(10,2) DEFAULT 0,
  transaction_id UUID REFERENCES public.emcoin_transactions(id),
  showcase_position INTEGER, -- If user wants to display this prominently
  metadata JSONB DEFAULT '{}', -- Store context like debate_id, score, etc.
  UNIQUE(user_id, achievement_id) -- Can't earn same achievement twice
);

-- Indexes for user achievement queries
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_earned_at ON public.user_achievements(earned_at DESC);
CREATE INDEX idx_user_achievements_showcase ON public.user_achievements(showcase_position) WHERE showcase_position IS NOT NULL;

-- ============================================
-- 5. ACHIEVEMENT MILESTONES - Progressive rewards
-- ============================================
CREATE TABLE IF NOT EXISTS public.achievement_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  milestone_value INTEGER NOT NULL,
  emcoin_bonus NUMERIC(10,2) DEFAULT 0,
  badge_upgrade TEXT, -- New badge image for this milestone
  description TEXT,
  UNIQUE(achievement_id, milestone_value)
);

-- ============================================
-- 6. DAILY BONUSES - Keep them coming back
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_bonus_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_number INTEGER NOT NULL UNIQUE,
  emcoin_amount NUMERIC(10,2) NOT NULL,
  bonus_multiplier NUMERIC(3,2) DEFAULT 1.0, -- For special events
  is_active BOOLEAN DEFAULT true
);

-- Default daily bonus structure (like Cyworld's daily login rewards)
INSERT INTO public.daily_bonus_config (day_number, emcoin_amount) VALUES
  (1, 10),   -- Day 1: 10 EmCoins
  (2, 15),   -- Day 2: 15 EmCoins
  (3, 20),   -- Day 3: 20 EmCoins
  (4, 25),   -- Day 4: 25 EmCoins
  (5, 30),   -- Day 5: 30 EmCoins
  (6, 40),   -- Day 6: 40 EmCoins
  (7, 50),   -- Day 7: 50 EmCoins (weekly bonus)
  (14, 100), -- 2 weeks: 100 EmCoins
  (30, 250); -- Monthly: 250 EmCoins

-- ============================================
-- TRIGGERS FOR ATOMIC BALANCE UPDATES
-- ============================================

-- Function to update wallet balances atomically
CREATE OR REPLACE FUNCTION update_wallet_balances()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process completed transactions
  IF NEW.status != 'completed' THEN
    RETURN NEW;
  END IF;

  -- Deduct from sender if exists
  IF NEW.from_wallet_id IS NOT NULL THEN
    UPDATE emcoin_wallets 
    SET 
      balance = balance - NEW.amount,
      total_spent = total_spent + NEW.amount,
      updated_at = NOW()
    WHERE id = NEW.from_wallet_id;
    
    -- Check if balance went negative (should be prevented by constraint)
    IF (SELECT balance FROM emcoin_wallets WHERE id = NEW.from_wallet_id) < 0 THEN
      RAISE EXCEPTION 'Insufficient EmCoin balance';
    END IF;
  END IF;

  -- Add to receiver if exists
  IF NEW.to_wallet_id IS NOT NULL THEN
    UPDATE emcoin_wallets 
    SET 
      balance = balance + NEW.amount,
      total_earned = total_earned + NEW.amount,
      updated_at = NOW()
    WHERE id = NEW.to_wallet_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for balance updates
CREATE TRIGGER trigger_update_wallet_balances
AFTER INSERT ON public.emcoin_transactions
FOR EACH ROW
EXECUTE FUNCTION update_wallet_balances();

-- ============================================
-- RLS POLICIES - Security with social visibility
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.emcoin_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emcoin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_bonus_config ENABLE ROW LEVEL SECURITY;

-- Wallet policies (private balance, public existence)
CREATE POLICY "Users can view own wallet" ON public.emcoin_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role manages wallets" ON public.emcoin_wallets
  FOR ALL USING (auth.role() = 'service_role');

-- Transaction policies (see your own + public achievements)
CREATE POLICY "Users see own transactions" ON public.emcoin_transactions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM emcoin_wallets WHERE id IN (from_wallet_id, to_wallet_id)
    )
  );

CREATE POLICY "Service role manages transactions" ON public.emcoin_transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Achievements are public (social validation principle)
CREATE POLICY "Everyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY "Service role manages achievements" ON public.achievements
  FOR ALL USING (auth.role() = 'service_role');

-- User achievements are public (show off your trophies!)
CREATE POLICY "Everyone can view user achievements" ON public.user_achievements
  FOR SELECT USING (true);

CREATE POLICY "Service role manages user achievements" ON public.user_achievements
  FOR ALL USING (auth.role() = 'service_role');

-- Milestones are public
CREATE POLICY "Everyone can view milestones" ON public.achievement_milestones
  FOR SELECT USING (true);

CREATE POLICY "Service role manages milestones" ON public.achievement_milestones
  FOR ALL USING (auth.role() = 'service_role');

-- Daily bonus config is public
CREATE POLICY "Everyone can view daily bonuses" ON public.daily_bonus_config
  FOR SELECT USING (true);

CREATE POLICY "Service role manages daily bonuses" ON public.daily_bonus_config
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- SEED DATA - Initial achievements
-- ============================================

INSERT INTO public.achievements (name, description, category, emcoin_reward, rarity, requirement_type, requirement_value) VALUES
  ('First Debate', 'Participate in your first debate', 'participation', 50, 'common', 'count', 1),
  ('First Victory', 'Win your first debate', 'debate_wins', 100, 'common', 'count', 1),
  ('Week Warrior', 'Log in 7 days in a row', 'streaks', 200, 'rare', 'streak', 7),
  ('Social Butterfly', 'Add 5 friends', 'social', 75, 'common', 'count', 5),
  ('Debate Veteran', 'Participate in 10 debates', 'participation', 150, 'rare', 'count', 10),
  ('Champion', 'Win 5 debates', 'debate_wins', 300, 'epic', 'count', 5),
  ('Perfect Score', 'Achieve a perfect debate score', 'academic', 500, 'legendary', 'special', null),
  ('Team Player', 'Join your first team', 'social', 50, 'common', 'count', 1),
  ('Monthly Master', 'Log in 30 days in a row', 'streaks', 1000, 'legendary', 'streak', 30);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to create wallet for new users
CREATE OR REPLACE FUNCTION create_emcoin_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.emcoin_wallets (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create wallet when user signs up
CREATE TRIGGER trigger_create_wallet_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_emcoin_wallet();

-- Function to award achievement
CREATE OR REPLACE FUNCTION award_achievement(
  p_user_id UUID,
  p_achievement_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_wallet_id UUID;
  v_emcoin_reward NUMERIC;
  v_transaction_id UUID;
BEGIN
  -- Check if already earned
  IF EXISTS (
    SELECT 1 FROM user_achievements 
    WHERE user_id = p_user_id AND achievement_id = p_achievement_id
  ) THEN
    RETURN FALSE;
  END IF;

  -- Get wallet and reward amount
  SELECT id INTO v_wallet_id FROM emcoin_wallets WHERE user_id = p_user_id;
  SELECT emcoin_reward INTO v_emcoin_reward FROM achievements WHERE id = p_achievement_id;

  -- Create transaction if there's a reward
  IF v_emcoin_reward > 0 THEN
    INSERT INTO emcoin_transactions (
      to_wallet_id, amount, type, description, metadata
    ) VALUES (
      v_wallet_id, 
      v_emcoin_reward, 
      'achievement_reward',
      'Achievement reward',
      jsonb_build_object('achievement_id', p_achievement_id)
    ) RETURNING id INTO v_transaction_id;
  END IF;

  -- Record achievement
  INSERT INTO user_achievements (
    user_id, achievement_id, emcoin_awarded, transaction_id
  ) VALUES (
    p_user_id, p_achievement_id, v_emcoin_reward, v_transaction_id
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE public.emcoin_wallets IS 'User EmCoin wallets - the virtual currency that drives engagement';
COMMENT ON TABLE public.emcoin_transactions IS 'Complete transaction history for EmCoins';
COMMENT ON TABLE public.achievements IS 'All available achievements students can earn';
COMMENT ON TABLE public.user_achievements IS 'Personal trophy case - achievements earned by each user';
COMMENT ON TABLE public.achievement_milestones IS 'Progressive rewards for continued achievement';
COMMENT ON TABLE public.daily_bonus_config IS 'Daily login bonus structure to drive engagement';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'EmCoin Foundation created successfully! 💰';
  RAISE NOTICE 'Tables created: emcoin_wallets, emcoin_transactions, achievements, user_achievements, achievement_milestones, daily_bonus_config';
  RAISE NOTICE 'The virtual economy is ready to drive engagement!';
END $$;