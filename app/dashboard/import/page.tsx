'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, Loader2 } from 'lucide-react';

export default function ImportCurriculumPage() {
  const [file, setFile] = useState<File | null>(null);
  const [curriculumName, setCurriculumName] = useState('KSSR Semakan 2017');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ inserted: number; skipped: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Sila pilih fail CSV terlebih dahulu.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('curriculumName', curriculumName);

      const res = await fetch('/api/import-curriculum', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import gagal.');
      setResult(data);
      toast.success(`Import selesai: ${data.inserted} berjaya, ${data.skipped} dilangkau.`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Import Kurikulum (CSV)</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Format CSV</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Lajur yang diperlukan: <code>year, subject_code, domain, topic, content_standard, learning_standard, performance_standard, kbat_elements, cross_curricular_elements</code>
          <br />
          Contoh: <code>1, BM, Kemahiran Mendengar, Unit 1, 1.1, 1.1.1, Tahap 1, "Mengaplikasi|Menganalisis", "Nilai Murni|TMK"</code>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Kurikulum</label>
            <input
              type="text"
              value={curriculumName}
              onChange={(e) => setCurriculumName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="KSSR Semakan 2017"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fail CSV</label>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="mt-1 w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Mengimport...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Import CSV
              </>
            )}
          </button>
        </form>
        {result && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded">
            <p className="text-sm">
              ✅ Berjaya: {result.inserted} | Dilangkau: {result.skipped}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}