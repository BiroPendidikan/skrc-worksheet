import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('app_settings')
    .select('key, value');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Tukar array ke object
  const settings: Record<string, any> = {};
  data.forEach((item: any) => {
    settings[item.key] = item.value;
  });

  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { settings } = body; // settings adalah object key-value

  if (!settings || typeof settings !== 'object') {
    return NextResponse.json({ error: 'Format tidak sah' }, { status: 400 });
  }

  // Simpan setiap tetapan
  const entries = Object.entries(settings);
  for (const [key, value] of entries) {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key, value }, { onConflict: 'key' });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}