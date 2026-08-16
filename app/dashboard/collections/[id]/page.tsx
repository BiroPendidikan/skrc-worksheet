import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DownloadWorksheetButton from '@/components/DownloadWorksheetButton'
import { Calendar, FileText, Layers, Clock } from 'lucide-react'

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    notFound()
  }

  const { data: worksheet, error } = await supabase
    .from('worksheets')
    .select('*')
    .eq('id', id)
    .eq('user_id', session.user.id)
    .single()

  if (error || !worksheet) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold">{worksheet.title}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>{worksheet.subject} Tahun {worksheet.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-green-500" />
            <span>{worksheet.topic}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>{worksheet.estimated_time || '30 minit'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>{new Date(worksheet.created_at).toLocaleDateString('ms')}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Arahan</h2>
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap mb-6">
          {worksheet.instructions}
        </p>

        <h2 className="text-lg font-semibold mb-4">Soalan</h2>
        <div className="space-y-4">
          {worksheet.questions.map((q: any) => (
            <div key={q.number} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <p className="font-medium">
                  {q.number}. {q.question}
                </p>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {q.cognitive_level} ({q.marks} markah)
                </span>
              </div>
              {q.type === 'multiple_choice' && q.options && (
                <ul className="mt-2 grid grid-cols-2 gap-1">
                  {q.options.map((opt: string, idx: number) => (
                    <li key={idx} className="text-sm">
                      {String.fromCharCode(65 + idx)}. {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      <DownloadWorksheetButton
        worksheetData={{
          title: worksheet.title,
          subject: worksheet.subject,
          year: worksheet.year,
          instructions: worksheet.instructions,
          questions: worksheet.questions,
        }}
      />
    </div>
  )
}