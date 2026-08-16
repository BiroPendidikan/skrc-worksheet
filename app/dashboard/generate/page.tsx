'use client';

import { useState } from 'react';
import SubjectSelector from '@/components/SubjectSelector';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  Loader2,
  Download,
  Share2,
  RotateCw,
  Eye,
  EyeOff,
  Save,
  Copy,
  Check,
} from 'lucide-react';

const CURRICULUM_ID = '9cfb3147-5c95-4128-afbf-4b2e4a206532';

export default function GeneratePage() {
  const [year, setYear] = useState<number>(1);
  const [subject, setSubject] = useState<{ name: string; id: string } | null>(null);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Asas');
  const [questionTypes, setQuestionTypes] = useState<string[]>(['multiple_choice']);
  const [numQuestions, setNumQuestions] = useState(10);
  const [estimatedTime, setEstimatedTime] = useState('30 minit');
  const [language, setLanguage] = useState('Bahasa Melayu');
  const [contextMode, setContextMode] = useState<'harian' | 'banjir' | 'penyakit' | 'jerebu'>('harian');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<any>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [regeneratingNumber, setRegeneratingNumber] = useState<number | null>(null);

  // ========== JANA WORKSHEET ==========
  const handleGenerate = async () => {
    if (!subject) {
      toast.error('Pilih mata pelajaran dahulu.');
      return;
    }
    if (!topic.trim()) {
      toast.error('Sila masukkan topik.');
      return;
    }
    setLoading(true);
    setShareUrl('');
    try {
      const res = await fetch('/api/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          subject: subject.name,
          topic,
          questionTypes,
          numQuestions,
          difficulty,
          language,
          estimatedTime,
          contextMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ralat penjanaan.');
      setGenerated(data.worksheet);
      toast.success('Lembaran kerja berjaya dijana!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionType = (type: string) => {
    setQuestionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // ========== JANA SEMULA SOALAN INDIVIDU ==========
  const handleRegenerateQuestion = async (questionNumber: number) => {
    if (!generated) return;

    setRegeneratingNumber(questionNumber);
    try {
      const currentQuestion = generated.questions.find((q: any) => q.number === questionNumber);
      const otherQuestions = generated.questions.filter((q: any) => q.number !== questionNumber);

      const res = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          subject: subject?.name || '',
          topic,
          difficulty,
          questionTypes,
          contextMode,
          currentQuestion,
          existingQuestions: otherQuestions,
          numQuestions,
          estimatedTime,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menjana semula soalan.');

      const newQuestion = data.question;
      setGenerated((prev: any) => ({
        ...prev,
        questions: prev.questions.map((q: any) =>
          q.number === questionNumber ? newQuestion : q
        ),
      }));
      toast.success(`Soalan ${questionNumber} berjaya dijana semula!`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRegeneratingNumber(null);
    }
  };

  // ========== SIMPAN KE KOLEKSI & JANA LINK PERKONGSIAN ==========
  const handleSave = async () => {
    if (!generated) return;
    setSaving(true);
    try {
      const res = await fetch('/api/worksheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: generated.title,
          year,
          subject: subject?.name || '',
          topic,
          difficulty,
          numQuestions,
          questionTypes,
          language,
          estimatedTime,
          contextMode,
          questions: generated.questions,
          instructions: generated.instructions,
          answerScheme: showAnswers ? generated.questions : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan.');

      if (data.public_share_id) {
        const url = `${window.location.origin}/worksheet/${data.public_share_id}`;
        setShareUrl(url);
      }
      toast.success('Lembaran kerja disimpan ke Koleksi!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ========== MUAT TURUN PDF ==========
  const handleDownloadPDF = async () => {
    if (!generated) return;
    try {
      const payload = {
        worksheetData: {
          title: generated.title,
          subject: subject?.name || '',
          year,
          instructions: generated.instructions,
          questions: generated.questions,
        },
        includeAnswerScheme: showAnswers,
      };

      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menjana PDF');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `worksheet-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('PDF dimuat turun!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // ========== SALIN LINK ==========
  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Pautan disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin pautan.');
    }
  };

  // ========== KOMPONEN UI ==========
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Jana Lembaran Kerja AI</h1>

      {/* Borang Parameter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        {/* Tahun */}
        <div>
          <label className="block text-sm font-medium">Tahun</label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full p-2 border rounded">
            {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Tahun {y}</option>)}
          </select>
        </div>
        {/* Kurikulum */}
        <div>
          <label className="block text-sm font-medium">Kurikulum</label>
          <select className="w-full p-2 border rounded" disabled>
            <option>KSSR Semakan 2017</option>
          </select>
        </div>
        {/* Mata Pelajaran */}
        <div className="md:col-span-2">
          <SubjectSelector
            selectedYear={year}
            onSelect={setSubject}
          />
        </div>
        {/* Topik */}
        <div>
          <label className="block text-sm font-medium">Topik</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Cth: Kata Nama, Operasi Tambah..."
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Tahap Kesukaran */}
        <div>
          <label className="block text-sm font-medium">Tahap</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full p-2 border rounded">
            <option>Pemulihan</option><option>Asas</option><option>Sederhana</option><option>Tinggi</option><option>KBAT</option>
          </select>
        </div>
        {/* Bahasa */}
        <div>
          <label className="block text-sm font-medium">Bahasa</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded">
            <option>Bahasa Melayu</option><option>Bahasa Inggeris</option><option>Dwibahasa</option>
          </select>
        </div>
        {/* Tempoh */}
        <div>
          <label className="block text-sm font-medium">Tempoh Aktiviti</label>
          <select value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} className="w-full p-2 border rounded">
            <option>15 minit</option><option>30 minit</option><option>45 minit</option><option>60 minit</option><option>90 minit</option>
          </select>
        </div>
        {/* Bil. Soalan */}
        <div>
          <label className="block text-sm font-medium">Bil. Soalan</label>
          <input type="number" min={5} max={30} value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} className="w-full p-2 border rounded" />
        </div>
        {/* Mod Khas (Situasi Kecemasan) */}
        <div>
          <label className="block text-sm font-medium">Mod Khas (Situasi Kecemasan)</label>
          <select
            value={contextMode}
            onChange={(e) => setContextMode(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="harian">Tiada (Harian Biasa)</option>
            <option value="banjir">🌧️ Banjir</option>
            <option value="penyakit">🦠 Penyakit Berjangkit</option>
            <option value="jerebu">🌫️ Jerebu Udara</option>
          </select>
        </div>
      </div>

      {/* Jenis Soalan */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3">Jenis Soalan</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'multiple_choice', label: 'Aneka Pilihan' },
            { id: 'fill_blank', label: 'Isi Tempat Kosong' },
            { id: 'true_false', label: 'Betul / Salah' },
            { id: 'short_answer', label: 'Jawapan Pendek' },
            { id: 'structure', label: 'Struktur' },
            { id: 'matching', label: 'Padankan' },
            { id: 'problem_solving', label: 'Penyelesaian Masalah' },
          ].map((type) => (
            <label key={type.id} className="flex items-center gap-2 text-sm border rounded px-3 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input type="checkbox" checked={questionTypes.includes(type.id)} onChange={() => toggleQuestionType(type.id)} />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      {/* Butang Jana */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" />
            AI sedang menyediakan...
          </>
        ) : (
          '🚀 Jana Lembaran Kerja dengan AI'
        )}
      </button>

      {/* Paparan Hasil + Butang Simpan, Muat Turun, dll. */}
      {generated && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{generated.title}</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowAnswers(!showAnswers)} className="p-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700" title={showAnswers ? 'Sembunyi skema' : 'Tunjuk skema'}>
                {showAnswers ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button onClick={handleDownloadPDF} className="p-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700" title="Muat Turun PDF">
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleCopyLink}
                disabled={!shareUrl}
                className="p-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
                title={shareUrl ? 'Salin Pautan' : 'Simpan dahulu untuk berkongsi'}
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
              </button>
              <button onClick={handleGenerate} className="p-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700" title="Jana Semula">
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                title="Simpan ke Koleksi"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{generated.instructions}</p>
          <div className="space-y-4">
            {generated.questions.map((q: any) => (
              <div key={q.number} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <p className="font-medium">{q.number}. {q.question}</p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {q.cognitive_level} ({q.marks} markah)
                  </span>
                </div>
                {q.type === 'multiple_choice' && q.options && (
                  <ul className="mt-2 grid grid-cols-2 gap-1">
                    {q.options.map((opt: string, idx: number) => (
                      <li key={idx} className="text-sm">{String.fromCharCode(65 + idx)}. {opt}</li>
                    ))}
                  </ul>
                )}
                {showAnswers && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    <strong>Jawapan:</strong> {q.answer}
                  </p>
                )}
                {/* Butang Jana Semula Soalan Ini */}
                <button
                  onClick={() => handleRegenerateQuestion(q.number)}
                  disabled={regeneratingNumber === q.number}
                  className="mt-2 text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 disabled:opacity-50"
                >
                  {regeneratingNumber === q.number ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RotateCw className="w-3 h-3" />
                  )}
                  {regeneratingNumber === q.number ? 'Menjana semula...' : 'Jana Semula Soalan Ini'}
                </button>
              </div>
            ))}
          </div>

          {/* Refleksi Murid */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">📝 Refleksi Saya</h3>
            <ol className="space-y-3 list-decimal list-inside text-sm">
              <li>Apakah perkara baharu yang saya pelajari?</li>
              <li>Apakah soalan yang paling mencabar?</li>
              <li>Bagaimanakah saya menyelesaikannya?</li>
              <li>Apakah yang ingin saya pelajari seterusnya?</li>
            </ol>
          </div>

          {/* Bahagian Perkongsian */}
          {shareUrl && (
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-2">🔗 Kongsi kepada Murid</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1 w-full">
                  <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{shareUrl}</p>
                  <button
                    onClick={handleCopyLink}
                    className="mt-2 inline-flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                  >
                    <Copy className="w-4 h-4" /> Salin Pautan
                  </button>
                </div>
                <div className="flex-shrink-0 bg-white p-2 rounded border">
                  <QRCodeSVG value={shareUrl} size={100} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Imbas QR code untuk membuka lembaran kerja di telefon atau tablet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}