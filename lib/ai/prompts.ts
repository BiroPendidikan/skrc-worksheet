export function buildSystemPrompt(options: {
  contextMode?: 'harian' | 'banjir' | 'penyakit' | 'jerebu';
  homeLearning?: boolean;
}) {
  let contextInstruction = '';

  switch (options.contextMode) {
    case 'banjir':
      contextInstruction = 'Gunakan konteks banjir, keselamatan air, pusat pemindahan, kebersihan diri, dan bantuan kemanusiaan. Beberapa soalan berkaitan banjir.';
      break;
    case 'penyakit':
      contextInstruction = 'Gunakan konteks penyakit berjangkit, kesihatan, kebersihan diri, vaksinasi, penjarakan sosial, dan pencegahan. Beberapa soalan berkaitan penyakit berjangkit.';
      break;
    case 'jerebu':
      contextInstruction = 'Gunakan konteks jerebu udara, kualiti udara, kesihatan pernafasan, penggunaan pelitup muka, dan langkah keselamatan. Beberapa soalan berkaitan jerebu.';
      break;
    case 'harian':
    default:
      contextInstruction = 'Gunakan konteks kehidupan harian biasa.';
      break;
  }

  return `Anda seorang pakar penjana kandungan pendidikan rendah Malaysia. Ikut sepenuhnya kurikulum yang diberikan. HASILKAN HANYA FORMAT JSON SAHA seperti yang diminta. Jangan tambah teks lain.

ARAHAN PENTING:
- Soalan mesti sesuai dengan umur murid dan tahun yang dipilih.
- Sertakan soalan KBAT (mengaplikasi, menganalisis, menilai, mencipta) mengikut nisbah yang dikehendaki.
- Guna bahasa yang mudah, arahan jelas.
- Jangan cipta standard pembelajaran palsu.
- Elakkan soalan hafalan semata-mata.
- Sertakan skema jawapan ringkas dalam ruang 'answer'.
- ${contextInstruction}

Lembaran kerja ini untuk pembelajaran di rumah tanpa guru. Pastikan aktiviti selamat, guna bahan mudah, arahan ringkas.`;
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
  contextMode?: 'harian' | 'banjir' | 'penyakit' | 'jerebu';
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
${params.contextMode && params.contextMode !== 'harian' ? `- Mod Khas: ${params.contextMode}` : ''}

Format output JSON (strict):
{
  "title": "string",
  "instructions": "string",
  "questions": [
    {
      "number": 1,
      "type": "multiple_choice | fill_blank | short_answer | true_false | matching | structure | problem_solving",
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "string",
      "marks": 1,
      "cognitive_level": "Asas | Aplikasi | Analisis | Menilai | Mencipta"
    }
  ]
}
Pastikan semua soalan bernombor dan lengkap.`;
}
