import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import WorksheetView from '@/components/WorksheetView'

export default async function PublicWorksheetPage({
  params,
}: {
  params: Promise<{ public_share_id: string }>
}) {
  // 🔥 WAJIB: unwrap params sebelum akses
  const { public_share_id } = await params

  const supabase = createAdminClient()

  const { data: worksheet, error } = await supabase
    .from('worksheets')
    .select('title, subject, year, instructions, questions')
    .eq('public_share_id', public_share_id)
    .single()

  if (error || !worksheet) {
    notFound()
  }

  return <WorksheetView worksheet={worksheet} />
}