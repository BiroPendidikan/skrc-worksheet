'use client';

export default function WorksheetView({ worksheet }: { worksheet: any }) {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold">SK RC KUBONG</h1>
        <p className="text-sm text-gray-500">Lembaran Kerja Pembelajaran di Rumah</p>
        <h2 className="text-lg font-semibold mt-2">{worksheet.title}</h2>
        <p className="text-sm text-gray-600">
          {worksheet.subject} Tahun {worksheet.year}
        </p>
      </div>
      <p className="mb-4 whitespace-pre-wrap">{worksheet.instructions}</p>
      <ol className="space-y-4 list-decimal list-inside">
        {worksheet.questions.map((q: any, idx: number) => (
          <li key={idx} className="border rounded-lg p-3">
            <p className="inline">{q.question}</p>
            {q.options && (
              <ul className="ml-6 mt-1 list-none">
                {q.options.map((opt: string, optIdx: number) => (
                  <li key={optIdx}>{String.fromCharCode(65 + optIdx)}. {opt}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
      <button
        onClick={() => window.print()}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Cetak
      </button>
    </div>
  );
}