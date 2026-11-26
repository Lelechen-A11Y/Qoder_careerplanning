import { Link, Outlet, useLocation } from 'react-router-dom';
import { Route } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
  const { pathname } = useLocation();
  const dark = pathname === '/' || pathname === '/survey';
  return (
    <div className={clsx('min-h-screen', dark ? 'bg-[#0c1220] text-white' : 'bg-[#f5f6f8] text-slate-900')}>
      <header className={clsx('relative z-10 border-b', dark ? 'border-white/10' : 'border-slate-200 bg-white/80')}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10">
          <Link to="/" className="flex items-center gap-3" aria-label="PathMap 首页"><Route size={25} className={dark ? 'text-teal-300' : 'text-teal-700'} /><span className="text-xl font-semibold tracking-tight">PathMap<span className="ml-1 text-teal-500">.</span></span></Link>
          <nav aria-label="主要导航" className="flex gap-3 text-[11px] sm:gap-6 sm:text-sm">{[['/survey', '01 知己'], ['/explore', '02 知彼'], ['/result', '03 知行'], ['/safeguard', '04 护航']].map(([url, title]) => <Link key={url} to={url} className={clsx('transition hover:text-teal-500', pathname === url ? 'text-teal-500' : dark ? 'text-slate-400' : 'text-slate-500')}>{title}</Link>)}</nav>
        </div>
      </header>
      <main className={clsx(dark ? '' : 'mx-auto max-w-7xl px-6 py-12 sm:px-10')}><Outlet /></main>
    </div>
  );
}
