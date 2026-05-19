export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  credits_remaining: number;
  total_calls_made: number;
  plan: PlanType;
  stripe_customer_id: string | null;
  vapi_api_key: string | null;
  twilio_account_sid: string | null;
  twilio_auth_token: string | null;
  twilio_phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  vapi_assistant_id: string | null;
  voice_id: string;
  system_prompt: string | null;
  first_message: string | null;
  language: string;
  is_active: boolean;
  call_count: number;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  email: string | null;
  company: string | null;
  tags: string[] | null;
  notes: string | null;
  call_count: number;
  last_called_at: string | null;
  created_at: string;
}

export type CallStatus = 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'no-answer' | 'busy' | 'canceled';
export type CallSentiment = 'positive' | 'neutral' | 'negative';

export interface Call {
  id: string;
  user_id: string;
  agent_id: string | null;
  contact_id: string | null;
  campaign_id: string | null;
  vapi_call_id: string | null;
  phone_number_to: string;
  phone_number_from: string | null;
  status: CallStatus;
  duration_seconds: number | null;
  recording_url: string | null;
  transcript: string | null;
  summary: string | null;
  sentiment: CallSentiment | null;
  ended_reason: string | null;
  cost_credits: number;
  metadata: any;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

export type CampaignStatus = 'draft' | 'running' | 'paused' | 'completed';

export interface Campaign {
  id: string;
  user_id: string;
  agent_id: string | null;
  name: string;
  description: string | null;
  status: CampaignStatus;
  total_contacts: number;
  calls_completed: number;
  calls_failed: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export type TransactionType = 'purchase' | 'usage' | 'bonus' | 'refund';

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  stripe_payment_intent_id: string | null;
  call_id: string | null;
  created_at: string;
}
