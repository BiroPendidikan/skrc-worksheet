import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('worksheets')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ worksheets: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    title, year, subject, topic, difficulty, numQuestions, questionTypes,
    language, estimatedTime, banjirMode, questions, instructions, answerScheme
  } = body;

  const { data, error } = await supabase
    .from('worksheets')
    .insert({
      user_id: session.user.id,
      title,
      year,
      subject,
      topic,
      difficulty,
      num_questions: numQuestions,
      question_types: questionTypes,
      language,
      estimated_time: estimatedTime,
      banjir_mode: banjirMode || false,
      questions,
      instructions,
      answer_scheme: answerScheme || null,
      public_share_id: crypto.randomUUID(),
    })
    .select('id, public_share_id')
    .single();

  if (error) {
    console.error('Insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Tiada data dipulangkan.' }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, public_share_id: data.public_share_id });
}