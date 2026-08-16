'use client'

export default function WorksheetView({ worksheet }: { worksheet: any }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-3">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 print:shadow-none print:rounded-none print:p-0">
        {/* Header Sekolah */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            SK RC KUBONG
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lembaran Kerja Pembelajaran di Rumah
          </p>
          <h2 className="text-lg font-semibold mt-2 text-gray-800 dark:text-white">
            {worksheet.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {worksheet.subject} Tahun {worksheet.year}
          </p>
        </div>

        {/* Arahan */}
        <p className="mb-4 whitespace-pre-wrap text-gray-700 dark:text-gray-200">
          {worksheet.instructions}
        </p>

        {/* Soalan */}
        <ol className="space-y-4 list-decimal list-inside">
          {worksheet.questions.map((q: any, idx: number) => (
            <li key={idx} className="border rounded-lg p-4">
              <p className="inline font-medium">{q.question}</p>
              {q.type === 'multiple_choice' && q.options && (
                <ul className="ml-6 mt-2 list-none space-y-1">
                  {q.options.map((opt: string, optIdx: number) => (
                    <li key={optIdx} className="text-sm">
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </li>
                  ))}
                </ul>
              )}
              {/* Ruang jawapan untuk soalan subjektif atau isi tempat kosong */}
              {q.type !== 'multiple_choice' && (
                <div className="mt-2 border-b border-dotted border-gray-400 h-8" />
              )}
            </li>
          ))}
        </ol>

        {/* Butang Cetak */}
        <div className="mt-6 flex justify-center print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            🖨️ Cetak Lembaran Kerja
          </button>
        </div>
      </div>
    </div>
  )
}