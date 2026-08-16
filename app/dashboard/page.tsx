import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, PlusCircle, Download, Share2 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Ambil senarai worksheet untuk statistik
  const { data: worksheets, error } = await supabase
    .from('worksheets')
    .select('id, created_at')
    .eq('user_id', session?.user?.id)
    .order('created_at', { ascending: false })

  const totalWorksheets = worksheets?.length || 0
  const thisWeekWorksheets =
    worksheets?.filter((ws) => {
      if (!ws.created_at) return false
      const now = new Date()
      const wsDate = new Date(ws.created_at)
      const diff = now.getTime() - wsDate.getTime()
      return diff < 7 * 24 * 60 * 60 * 1000
    }).length || 0

  // Placeholder – boleh dikembangkan kemudian
  const mostUsedSubject = 'Matematik'
  const mostUsedYear = 'Tahun 5'

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Selamat Datang, Guru!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Pantau dan jana lembaran kerja pembelajaran di rumah.
        </p>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Jumlah Lembaran</p>
          <p className="text-3xl font-bold text-blue-600">{totalWorksheets}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Minggu Ini</p>
          <p className="text-3xl font-bold text-green-600">{thisWeekWorksheets}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Subjek Popular</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">{mostUsedSubject}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Tahun Popular</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">{mostUsedYear}</p>
        </div>
      </div>

      {/* Tindakan Pantas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/dashboard/generate"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 flex items-center gap-3 transition"
        >
          <PlusCircle className="w-6 h-6" />
          <span className="font-medium">Jana Lembaran Kerja</span>
        </Link>
        <Link
          href="/dashboard/collections"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 hover:shadow transition"
        >
          <FileText className="w-6 h-6 text-blue-600" />
          <span className="font-medium text-gray-800 dark:text-white">Koleksi</span>
        </Link>
        <Link
          href="/dashboard/generate?mode=banjir"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 hover:shadow transition"
        >
          <Download className="w-6 h-6 text-orange-600" />
          <span className="font-medium text-gray-800 dark:text-white">Mod Banjir</span>
        </Link>
        <Link
          href="/dashboard/collections?filter=shared"
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 hover:shadow transition"
        >
          <Share2 className="w-6 h-6 text-purple-600" />
          <span className="font-medium text-gray-800 dark:text-white">Perkongsian</span>
        </Link>
      </div>

      {/* Senarai Lembaran Kerja Terkini */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Lembaran Kerja Terkini</h2>
        {worksheets && worksheets.length > 0 ? (
          <ul className="space-y-2">
            {worksheets.slice(0, 5).map((ws) => (
              <li key={ws.id} className="text-sm text-gray-600 dark:text-gray-300">
                <Link href={`/dashboard/collections/${ws.id}`} className="hover:underline">
                  {`Lembaran Kerja #${ws.id.slice(0, 8)}`}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">
            Belum ada lembaran kerja. Klik &quot;Jana Lembaran Kerja&quot; untuk bermula.
          </p>
        )}
      </div>
    </div>
  )
}