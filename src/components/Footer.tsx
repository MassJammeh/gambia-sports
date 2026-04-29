import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3">⚽ Gambia Sports</h3>
            <p className="text-sm text-gray-400">
              Your home for Gambian football. Track standings, fixtures, results, and teams from the Gambian Premier League.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/standings" className="hover:text-white transition-colors">
                  Standings
                </Link>
              </li>
              <li>
                <Link href="/fixtures" className="hover:text-white transition-colors">
                  Fixtures
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-white transition-colors">
                  Results
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-white transition-colors">
                  Teams
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="text-white font-semibold mb-3">Admin</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} Gambia Sports. All rights reserved.</p>
          <p>Powered by <span className="text-white font-semibold">TechPalz</span></p>
        </div>
      </div>
    </footer>
  )
}
