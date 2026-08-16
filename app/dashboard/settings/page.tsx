'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Save, Loader2, Upload, ImagePlus } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    schoolName: '',
    schoolAddress: '',
    schoolMotto: '',
    headmasterName: '',
    academicYear: '',
    activeCurriculum: 'KSSR Semakan 2017',
    aiLimitPerDay: '50',
    defaultNumQuestions: '10',
    defaultKbatRatio: '30',
    schoolLogoUrl: '',
  });

  // Muat tetapan sedia ada
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setForm({
            schoolName: data.settings.schoolName || '',
            schoolAddress: data.settings.schoolAddress || '',
            schoolMotto: data.settings.schoolMotto || '',
            headmasterName: data.settings.headmasterName || '',
            academicYear: data.settings.academicYear || '',
            activeCurriculum: data.settings.activeCurriculum || 'KSSR Semakan 2017',
            aiLimitPerDay: data.settings.aiLimitPerDay || '50',
            defaultNumQuestions: data.settings.defaultNumQuestions || '10',
            defaultKbatRatio: data.settings.defaultKbatRatio || '30',
            schoolLogoUrl: data.settings.schoolLogoUrl || '',
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memuat naik logo.');
      setForm((prev) => ({ ...prev, schoolLogoUrl: data.url }));
      toast.success('Logo berjaya dimuat naik!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan tetapan.');
      toast.success('Tetapan berjaya disimpan!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Memuatkan tetapan...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Tetapan Admin</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
        {/* Logo Sekolah */}
        <div>
          <label className="block text-sm font-medium mb-2">Logo Sekolah</label>
          <div className="flex items-center gap-4">
            {form.schoolLogoUrl ? (
              <img
                src={form.schoolLogoUrl}
                alt="Logo Sekolah"
                className="w-16 h-16 object-contain border rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 border rounded flex items-center justify-center text-gray-400">
                <ImagePlus className="w-6 h-6" />
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 flex items-center gap-2 disabled:opacity-50"
              >
                {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploadingLogo ? 'Memuat naik...' : 'Muat Naik Logo'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Nama Sekolah</label>
            <input type="text" name="schoolName" value={form.schoolName} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Alamat Sekolah</label>
            <input type="text" name="schoolAddress" value={form.schoolAddress} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Moto Sekolah</label>
            <input type="text" name="schoolMotto" value={form.schoolMotto} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Nama Guru Besar</label>
            <input type="text" name="headmasterName" value={form.headmasterName} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Tahun Akademik</label>
            <input type="text" name="academicYear" value={form.academicYear} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Kurikulum Aktif</label>
            <select name="activeCurriculum" value={form.activeCurriculum} onChange={handleChange} className="w-full p-2 border rounded">
              <option>KSSR Semakan 2017</option>
              <option>Kurikulum 2027</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Had AI Harian</label>
            <input type="number" name="aiLimitPerDay" value={form.aiLimitPerDay} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Bilangan Soalan Lalai</label>
            <input type="number" name="defaultNumQuestions" value={form.defaultNumQuestions} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Nisbah KBAT Lalai (%)</label>
            <input type="number" name="defaultKbatRatio" value={form.defaultKbatRatio} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Simpan Tetapan
            </>
          )}
        </button>
      </form>
    </div>
  );
}