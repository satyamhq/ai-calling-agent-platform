import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { vapi } from '@/lib/vapi';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, description, voice_id, system_prompt, first_message } = body;

    // Call Vapi to create assistant
    const vapiRes = await vapi.createAssistant({
      name,
      voice: { voiceId: voice_id },
      model: {
        messages: [{ role: 'system', content: system_prompt }]
      },
      firstMessage: first_message,
    });

    const { data: agent, error } = await supabase.from('agents').insert({
      user_id: user.id,
      name,
      description,
      voice_id,
      system_prompt,
      first_message,
      vapi_assistant_id: vapiRes.id
    }).select().single();

    if (error) throw error;

    return NextResponse.json(agent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: agents, error } = await supabase.from('agents').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ agents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
