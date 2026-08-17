import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parse } from 'csv-parse/sync';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'Sila pilih fail CSV' }, { status: 400 });
    }

    const curriculumName = formData.get('curriculumName') as string || 'KSSR Semakan 2017';
    const text = await file.text();

    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let inserted = 0;
    let skipped = 0;

    // Dapatkan atau cipta kurikulum
    let { data: curriculum } = await supabase
      .from('curriculums')
      .select('id')
      .eq('name', curriculumName)
      .single();

    if (!curriculum) {
      const { data: newCurr } = await supabase
        .from('curriculums')
        .insert({ name: curriculumName })
        .select('id')
        .single();
      curriculum = newCurr;
    }

    for (const rec of records as any[]) {
      const record = rec as any;

      // Cari subjek berdasarkan code
      const { data: subject } = await supabase
        .from('subjects')
        .select('id')
        .eq('code', record.subject_code)
        .single();

      if (!subject) {
        skipped++;
        continue;
      }

      // Cari atau cipta domain
      let { data: domain } = await supabase
        .from('domains')
        .select('id')
        .eq('subject_id', subject.id)
        .eq('name', record.domain)
        .single();

      if (!domain) {
        const { data: newDomain } = await supabase
          .from('domains')
          .insert({ subject_id: subject.id, name: record.domain })
          .select('id')
          .single();
        domain = newDomain;
      }

      if (!domain) {
        skipped++;
        continue;
      }

      // Cari atau cipta topik
      let { data: topic } = await supabase
        .from('topics')
        .select('id')
        .eq('domain_id', domain.id)
        .eq('name', record.topic)
        .single();

      if (!topic) {
        const { data: newTopic } = await supabase
          .from('topics')
          .insert({ domain_id: domain.id, name: record.topic })
          .select('id')
          .single();
        topic = newTopic;
      }

      if (!topic) {
        skipped++;
        continue;
      }

      // Masukkan standard pembelajaran
      const { error: lsError } = await supabase
        .from('learning_standards')
        .upsert({
          curriculum_id: curriculum?.id,
          year: parseInt(record.year),
          subject_id: subject.id,
          domain_id: domain.id,
          topic_id: topic.id,
          content_standard: record.content_standard || null,
          learning_standard: record.learning_standard || null,
          performance_standard: record.performance_standard || null,
          kbat_elements: record.kbat_elements ? record.kbat_elements.split('|').map((s: string) => s.trim()) : [],
          cross_curricular_elements: record.cross_curricular_elements ? record.cross_curricular_elements.split('|').map((s: string) => s.trim()) : [],
        }, { onConflict: 'curriculum_id, year, subject_id, topic_id, content_standard, learning_standard' });

      if (lsError) {
        skipped++;
      } else {
        inserted++;
      }
    }

    return NextResponse.json({ inserted, skipped });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
