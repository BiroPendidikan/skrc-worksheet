'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  PlusCircle,
  Library,
  BarChart3,
  Settings,
  Upload,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/generate', label: 'Jana', icon: PlusCircle },
  { href: '/dashboard/collections', label: 'Koleksi', icon: Library },
  { href: '/dashboard/analytics', label: 'Analitik', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Tetapan', icon: Settings },
  { href: '/dashboard/import', label: 'Import', icon: Upload },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    toast.success('Anda telah log keluar.')
  }

  return (
    <>
      {/* ====== DESKTOP SIDEBAR ====== */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-700 dark:text-blue-300">
            SK RC KUBONG
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            AI Worksheet Generator
          </p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Keluar</span>
          </button>
        </div>
      </aside>

      {/* ====== MOBILE BOTTOM NAVIGATION ====== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 flex justify-around items-center py-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-1 px-2 text-xs ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="mt-0.5">{link.label}</span>
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center py-1 px-2 text-xs text-gray-500 dark:text-gray-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="mt-0.5">Keluar</span>
        </button>
      </nav>
    </>
  )
}