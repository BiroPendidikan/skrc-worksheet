export function buildSystemPrompt(options: {
  banjirMode?: boolean;
  homeLearning?: boolean;
}) {
  const base = `Anda seorang pakar penjana kandungan pendidikan rendah Malaysia. Ikut sepenuhnya kurikulum yang diberikan. HASILKAN HANYA FORMAT JSON SAHA seperti yang diminta. Jangan tambah teks lain.

ARAHAN PENTING:
- Soalan mesti sesuai dengan umur murid dan tahun yang dipilih.
- Sertakan soalan KBAT (mengaplikasi, menganalisis, menilai, mencipta) mengikut nisbah yang dikehendaki.
- Guna bahasa yang mudah, arahan jelas.
- Jangan cipta standard pembelajaran palsu.
- Elakkan soalan hafalan semata-mata.
- Sertakan skema jawapan ringkas dalam ruang 'answer'.
- Jika konteks banjir dipilih, masukkan beberapa soalan berkaitan banjir, keselamatan, air, komuniti. Tapi jangan semua.`;

  if (options.homeLearning) {
    return base + ` Lembaran kerja ini untuk pembelajaran di rumah tanpa guru. Pastikan aktiviti selamat, guna bahan mudah, arahan ringkas.`;
  }
  if (options.banjirMode) {
    return base + ` Gunakan konteks kehidupan sebenar banjir, pusat pemindahan, keselamatan air, kebersihan, dll.`;
  }
  return base;
}

export function buildUserPrompt(params: {
  year: number;
  subject: string;
  topic: string;
  learningStandard?: string;
  questionTypes: string[];
  numQuestions: number;
  difficulty: string;
  language: string;
  estimatedTime: string;
  instructions?: string;
}) {
  return `Jana lembaran kerja dengan spesifikasi berikut:
- Tahun: ${params.year}
- Mata Pelajaran: ${params.subject}
- Topik: ${params.topic}
- Standard Pembelajaran: ${params.learningStandard || 'Tiada'}
- Tahap Kesukaran: ${params.difficulty}
- Bilangan Soalan: ${params.numQuestions}
- Jenis Soalan: ${params.questionTypes.join(', ')}
- Bahasa: ${params.language === 'Dwibahasa' ? 'Dwibahasa (BM dan BI)' : params.language}
- Tempoh Aktiviti: ${params.estimatedTime}
${params.instructions ? `- Arahan Tambahan: ${params.instructions}` : ''}

Format output JSON (strict):
{
  "title": "string",
  "instructions": "string",
  "questions": [
    {
      "number": 1,
      "type": "multiple_choice | fill_blank | short_answer | true_false | matching | structure | problem_solving",
      "question": "string",
      "options": ["A", "B", "C", "D"], // hanya untuk multiple_choice
      "answer": "string",
      "marks": 1,
      "cognitive_level": "Asas | Aplikasi | Analisis | Menilai | Mencipta"
    }
  ]
}
Pastikan semua soalan bernombor dan lengkap.`;
}