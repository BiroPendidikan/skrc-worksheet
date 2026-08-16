import Navigation from '@/components/Navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 md:p-6 pb-20 md:pb-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}