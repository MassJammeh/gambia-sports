import Navbar from '@/components/layout/Navbar'
import NewsTicker from '@/components/layout/NewsTicker'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8 pb-16">
        {children}
      </main>
      {<NewsTicker />}
    </>
  )
}