-- Users profile (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  credits_remaining INTEGER DEFAULT 10,  -- 10 free calls
  total_calls_made INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  vapi_api_key TEXT,
  twilio_account_sid TEXT,
  twilio_auth_token TEXT,
  twilio_phone_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Agents
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  vapi_assistant_id TEXT,               -- Vapi assistant ID
  voice_id TEXT DEFAULT 'jennifer',
  system_prompt TEXT,
  first_message TEXT,
  language TEXT DEFAULT 'en-US',
  is_active BOOLEAN DEFAULT true,
  call_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  company TEXT,
  tags TEXT[],
  notes TEXT,
  call_count INTEGER DEFAULT 0,
  last_called_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calls
CREATE TABLE calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  campaign_id UUID,
  vapi_call_id TEXT UNIQUE,
  phone_number_to TEXT NOT NULL,
  phone_number_from TEXT,
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued','ringing','in-progress','completed','failed','no-answer','busy','canceled')),
  duration_seconds INTEGER,
  recording_url TEXT,
  transcript TEXT,
  summary TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive','neutral','negative')),
  ended_reason TEXT,
  cost_credits INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns (bulk calling)
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','running','paused','completed')),
  total_contacts INTEGER DEFAULT 0,
  calls_completed INTEGER DEFAULT 0,
  calls_failed INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transactions
CREATE TABLE credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('purchase','usage','bonus','refund')),
  amount INTEGER NOT NULL,
  description TEXT,
  stripe_payment_intent_id TEXT,
  call_id UUID REFERENCES calls(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (enable for all tables)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Each user sees only their own data
CREATE POLICY "Users own data" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own agents" ON agents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own contacts" ON contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own calls" ON calls FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own transactions" ON credit_transactions FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX idx_calls_user_id ON calls(user_id);
CREATE INDEX idx_calls_status ON calls(status);
CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
