import { createClient } from '@/lib/supabase/server';
import { BarChart3, FileText, Layers, TrendingUp } from 'lucide-react';
import AnalyticsCharts from '@/components/AnalyticsCharts'; // komponen client untuk carta

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Ambil semua worksheet guru semasa
  const { data: worksheets, error } = await supabase
    .from('worksheets')
    .select('*')
    .eq('user_id', session?.user?.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return <p className="text-red-500">Gagal memuat data analitik.</p>;
  }

  const total = worksheets?.length || 0;
  const thisWeek = worksheets?.filter((ws: any) => {
    if (!ws.created_at) return false;
    const diff = Date.now() - new Date(ws.created_at).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length || 0;

  // Agregat mengikut tahun
  const yearCounts: Record<number, number> = {};
  // Agregat mengikut subjek
  const subjectCounts: Record<string, number> = {};

  worksheets?.forEach((ws: any) => {
    const y = ws.year;
    yearCounts[y] = (yearCounts[y] || 0) + 1;
    const s = ws.subject || 'Lain-lain';
    subjectCounts[s] = (subjectCounts[s] || 0) + 1;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Analitik Penggunaan</h1>

      {/* Kad Ringkasan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center gap-2 text-blue-600">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Jumlah Worksheet</span>
          </div>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Minggu Ini</span>
          </div>
          <p className="text-3xl font-bold">{thisWeek}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center gap-2 text-purple-600">
            <Layers className="w-5 h-5" />
            <span className="text-sm">Tahun Paling Aktif</span>
          </div>
          <p className="text-xl font-semibold">
            {Object.keys(yearCounts).length > 0
              ? `Tahun ${Object.entries(yearCounts).sort((a,b) => b[1] - a[1])[0][0]}`
              : '-'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center gap-2 text-orange-600">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm">Subjek Terbanyak</span>
          </div>
          <p className="text-lg font-semibold">
            {Object.keys(subjectCounts).length > 0
              ? Object.entries(subjectCounts).sort((a,b) => b[1] - a[1])[0][0]
              : '-'}
          </p>
        </div>
      </div>

      {/* Carta */}
      <AnalyticsCharts yearData={yearCounts} subjectData={subjectCounts} />

      {/* Senarai 5 terkini */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-3">5 Lembaran Kerja Terkini</h2>
        {worksheets?.length === 0 ? (
          <p className="text-gray-500">Belum ada data.</p>
        ) : (
          <ul className="space-y-2">
            {worksheets?.slice(0, 5).map((ws: any) => (
              <li key={ws.id} className="flex justify-between text-sm">
                <span>{ws.title} ({ws.subject} Tahun {ws.year})</span>
                <span className="text-gray-400">{new Date(ws.created_at).toLocaleDateString('ms')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}