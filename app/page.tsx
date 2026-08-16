// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">SK RC KUBONG</h1>
      <p className="text-lg mb-6">AI Home Learning Worksheet Generator</p>
      <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        Log Masuk Guru
      </Link>
    </div>
  )
}