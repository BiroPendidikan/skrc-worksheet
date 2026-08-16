'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Props {
  worksheetData: {
    title: string
    subject: string
    year: number
    instructions: string
    questions: any[]
  }
}

export default function DownloadWorksheetButton({ worksheetData }: Props) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worksheetData,
          includeAnswerScheme: false,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Gagal menjana PDF')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `worksheet-${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('PDF dimuat turun!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin w-5 h-5" />
          Menjana PDF...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Muat Turun PDF
        </>
      )}
    </button>
  )
}