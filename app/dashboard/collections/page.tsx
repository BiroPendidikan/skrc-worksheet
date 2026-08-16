'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CollectionsPage() {
  const [worksheets, setWorksheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWorksheets();
  }, []);

  const fetchWorksheets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/worksheets');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memuat koleksi.');
      setWorksheets(data.worksheets || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Padam lembaran kerja ini?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/worksheets/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memadam.');

      // Buang daripada senarai tempatan
      setWorksheets((prev) => prev.filter((ws) => ws.id !== id));
      toast.success('Lembaran kerja dipadam.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Koleksi Lembaran Kerja</h1>
      {loading ? (
        <p className="text-gray-500">Memuatkan...</p>
      ) : worksheets.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto w-12 h-12 text-gray-300" />
          <p className="text-gray-500 mt-2">Belum ada lembaran kerja tersimpan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {worksheets.map((ws) => (
            <div
              key={ws.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{ws.title}</h2>
              <p className="text-sm text-gray-500">
                {ws.subject} Tahun {ws.year} – {ws.topic}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(ws.created_at).toLocaleDateString('ms')}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href={`/dashboard/collections/${ws.id}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Lihat & Muat Turun
                </Link>
                <button
                  onClick={() => handleDelete(ws.id)}
                  disabled={deletingId === ws.id}
                  className="text-red-600 text-sm hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId === ws.id ? 'Memadam...' : 'Padam'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}