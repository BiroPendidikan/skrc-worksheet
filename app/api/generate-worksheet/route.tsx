import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/ai/prompts';
import { generateWorksheetContent } from '@/lib/ai/deepseek';
import { validateWorksheetJSON } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    year,
    subject,
    topic,
    learningStandard,
    questionTypes,
    numQuestions,
    difficulty,
    language,
    estimatedTime,
    contextMode,
    instructions,
  } = body;

  const systemPrompt = buildSystemPrompt({
    contextMode: contextMode || 'harian',
    homeLearning: true,
  });
  const userPrompt = buildUserPrompt({
    year,
    subject,
    topic,
    learningStandard,
    questionTypes,
    numQuestions,
    difficulty,
    language,
    estimatedTime,
    instructions,
    contextMode: contextMode || 'harian',
  });

  try {
    let worksheetData = await generateWorksheetContent(systemPrompt, userPrompt);
    if (!validateWorksheetJSON(worksheetData)) {
      // Cuba sekali lagi dengan arahan lebih ketat
      const retryPrompt = userPrompt + '\n\nPASTIKAN OUTPUT HANYA JSON SAH DENGAN STRUKTUR TEPAT.';
      worksheetData = await generateWorksheetContent(systemPrompt, retryPrompt);
      if (!validateWorksheetJSON(worksheetData)) {
        throw new Error('Data tidak sah selepas cubaan kedua.');
      }
    }
    return NextResponse.json({ worksheet: worksheetData });
  } catch (error: any) {
    console.error('Generate worksheet error:', error);
    return NextResponse.json({ error: error.message || 'Gagal menjana worksheet' }, { status: 500 });
  }
}