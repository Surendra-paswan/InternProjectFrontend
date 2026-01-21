import { useState } from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDataOpen, setIsDataOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const toggleData = () => setIsDataOpen((prev) => !prev)

  return (
    <nav className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:opacity-90">
          <span className="rounded-full bg-white/15 px-2 py-1 text-sm font-bold">SEF</span>
          <span>Student Portal</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="rounded-full px-3 py-2 text-sm font-medium transition hover:bg-white/15">Home</Link>
          <div
            className="relative"
            onMouseEnter={() => setIsDataOpen(true)}
            onMouseLeave={() => setIsDataOpen(false)}
          >
            <button
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition hover:bg-white/15"
              onClick={toggleData}
              aria-expanded={isDataOpen}
              aria-haspopup="true"
            >
              <span>Data</span>
              <svg
                className={`h-4 w-4 transition ${isDataOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDataOpen && (
              <div className="absolute left-0 z-20 mt-2 w-52 rounded-xl bg-white/95 py-2 text-slate-900 shadow-xl ring-1 ring-black/5 backdrop-blur">
                <Link to="/" onClick={() => setIsDataOpen(false)} className="block px-4 py-2 text-sm font-medium transition hover:bg-slate-100">Create New Data</Link>
                <Link to="/view-data" onClick={() => setIsDataOpen(false)} className="block px-4 py-2 text-sm font-medium transition hover:bg-slate-100">View Data</Link>
                <Link to="/edit-data" onClick={() => setIsDataOpen(false)} className="block px-4 py-2 text-sm font-medium transition hover:bg-slate-100">Edit Data</Link>
                <Link to="/delete-data" onClick={() => setIsDataOpen(false)} className="block px-4 py-2 text-sm font-medium transition hover:bg-slate-100">Delete Data</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className="inline-flex items-center rounded-lg bg-white/10 p-2 text-white ring-1 ring-white/30 md:hidden"
          onClick={toggleMenu}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t border-white/20 px-4 py-3">
            <Link to="/" className="block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10">Home</Link>
            <button
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-white/10"
              onClick={toggleData}
            >
              <span>Data</span>
              <svg
                className={`h-4 w-4 transition ${isDataOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDataOpen && (
              <div className="space-y-1 rounded-lg bg-white/10 px-3 py-2">
                <Link to="/" className="block rounded-md px-2 py-2 text-sm font-medium transition hover:bg-white/10">Create New Data</Link>
                <Link to="/view-data" className="block rounded-md px-2 py-2 text-sm font-medium transition hover:bg-white/10">View Data</Link>
                <Link to="/edit-data" className="block rounded-md px-2 py-2 text-sm font-medium transition hover:bg-white/10">Edit Data</Link>
                <Link to="/delete-data" className="block rounded-md px-2 py-2 text-sm font-medium transition hover:bg-white/10">Delete Data</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar
