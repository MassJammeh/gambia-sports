import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LeaguesPage() {
  const supabase = await createClient()
  const { data: leagues } = await supabase
    .from('leagues')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight" style={{ color: '#111827' }}>
          Leagues
        </h1>
        <p className="text-sm mt-1 font-medium" style={{ color: '#6B7280' }}>
          All active leagues on GamFoot
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {leagues?.map((league) => (
          <Link
            key={league.id}
            href={`/leagues/${league.slug}`}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg, #1A6B3A, #2D8A50)' }}
            >
              {league.name.charAt(0)}
            </div>
            <div>
              <div className="font-black text-base" style={{ color: '#111827' }}>{league.name}</div>
              {league.description && (
                <div className="text-sm mt-0.5 truncate" style={{ color: '#6B7280' }}>{league.description}</div>
              )}
              <div className="mt-2">
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ backgroundColor: '#E8F5EE', color: '#1A6B3A' }}
                >
                  ● Active
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}