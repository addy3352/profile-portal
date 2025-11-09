import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { User, HeartPulse, Download, ShieldCheck, LayoutDashboard, Newspaper } from 'lucide-react'
import { Toaster } from "react-hot-toast";
<Toaster position="top-right" />

const AppShell: React.FC = () => {
  const loc = useLocation()
  const nav = useNavigate()
  const loggedIn = localStorage.getItem('hp_token') === import.meta.env.VITE_HEALTH_PASS

  const is = (p:string)=> loc.pathname===p || loc.pathname.startsWith(p)

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-brand-primary">
            <ShieldCheck className="h-5 w-5" /> Profile Portal
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/work-dashboard" className={`px-3 py-1.5 rounded ${is('/work-dashboard')?'bg-brand-primary text-white':'hover:bg-slate-100'}`}>
              <div className="inline-flex items-center gap-2"><LayoutDashboard className="h-4 w-4"/>Dashboard</div>
            </Link>
            <Link to="/work-cv" className={`px-3 py-1.5 rounded ${is('/work-cv')?'bg-brand-primary text-white':'hover:bg-slate-100'}`}>
              <div className="inline-flex items-center gap-2"><Newspaper className="h-4 w-4"/>Visual CV</div>
            </Link>
            <Link to="/work-architecture" className={`px-3 py-1.5 rounded ${is('/work-architecture')?'bg-brand-primary text-white':'hover:bg-slate-100'}`}>
              <div className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Architecture</div>
            </Link>
            <Link to="/health" className={`px-3 py-1.5 rounded ${is('/health')?'bg-brand-primary text-white':'hover:bg-slate-100'}`}>
              <div className="inline-flex items-center gap-2"><HeartPulse className="h-4 w-4" /> Health</div>
            </Link>
            <button onClick={()=>window.print()} className="px-3 py-1.5 rounded hover:bg-slate-100"><Download className="h-4 w-4" /></button>
            {!loggedIn ? (
              <button onClick={()=>nav('/login')} className="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50">Sign in</button>
            ) : (
              <button onClick={()=>{localStorage.removeItem('hp_token'); nav('/')}} className="px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-50">Sign out</button>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-slate-500 py-6">© 2025 Aditya Raman</footer>
    </div>
  )
}

export default AppShell
