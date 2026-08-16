import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/ai/prompts';
import { generateWorksheetContent } from '@/lib/ai/deepseek';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    year, subject, topic, difficulty, questionTypes, contextMode,
    currentQuestion, existingQuestions, numQuestions, estimatedTime, language,
  } = body;

  if (!currentQuestion || !existingQuestions) {
    return NextResponse.json({ error: 'Data soalan diperlukan' }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt({ contextMode, homeLearning: true });
  const userPrompt = `
Anda perlu menggantikan SATU soalan dalam lembaran kerja sedia ada.

Soalan yang perlu diganti (nombor ${currentQuestion.number}):
${JSON.stringify(currentQuestion, null, 2)}

Soalan-soalan lain yang KEKAL (JANGAN ubah atau ulang):
${JSON.stringify(existingQuestions, null, 2)}

Jana SATU soalan baharu yang:
- Mempunyai nombor yang sama (${currentQuestion.number}).
- Mempunyai jenis yang sama atau setara.
- Sesuai dengan Tahun ${year}, subjek ${subject}, topik ${topic}.
- Mempunyai tahap kesukaran ${difficulty}.
- Menggunakan jenis soalan: ${questionTypes.join(', ')}.
- Mengandungi unsur KBAT.
- TIDAK sama dengan mana-mana soalan sedia ada.

Kembalikan JSON SAHAJA dengan struktur:
{
  "number": ${currentQuestion.number},
  "type": "...",
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "answer": "...",
  "marks": 1,
  "cognitive_level": "Asas | Aplikasi | Analisis | Menilai | Mencipta"
}
`;

  try {
    const content = await generateWorksheetContent(systemPrompt, userPrompt);
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const cleaned = content.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }
    if (!parsed.question) throw new Error('Soalan tidak sah dijana');
    return NextResponse.json({ question: parsed });
  } catch (error: any) {
    console.error('Regenerate question error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}