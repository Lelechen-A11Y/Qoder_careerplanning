import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Compass, Route, ShieldCheck, Sparkles, Waypoints } from 'lucide-react';
import clsx from 'clsx';
import { useAppContext } from '../context/AppContext';

const stages = [
  { path: '/survey', label: '知己', detail: '厘清自己', icon: Sparkles },
  { path: '/explore', label: '知彼', detail: '看清职业', icon: Compass },
  { path: '/result', label: '知行', detail: '开始验证', icon: Waypoints },
  { path: '/safeguard', label: '护航', detail: '持续复盘', icon: ShieldCheck },
];

export default function Layout() {
  const { pathname } = useLocation();
  const { userProfile, experiences, plan, reviewRecords } = useAppContext();
  const dark = pathname === '/' || pathname === '/survey';
  const currentPath = pathname === '/review' ? '/safeguard' : pathname;
  const stageIndex = stages.findIndex(stage => stage.path === currentPath);
  const completeThrough = reviewRecords.length ? 3 : experiences.length ? 2 : plan ? 2 : userProfile.major ? 1 : 0;

  return (
    <div className={clsx('min-h-screen', dark ? 'bg-[#0c1220] text-white' : 'bg-[#f5f6f8] text-slate-900')}>
      <header className={clsx('relative z-10 border-b', dark ? 'border-white/10' : 'border-slate-200 bg-white/90 backdrop-blur')}>
        <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="PathMap 首页">
            <span className={clsx('grid size-9 place-items-center rounded-xl', dark ? 'bg-teal-300/10 text-teal-200' : 'bg-teal-700 text-white')}><Route size={19} /></span>
            <span><span className="block text-base font-semibold tracking-tight">PathMap<span className="text-teal-500">.</span></span><span className={clsx('hidden text-[10px] sm:block', dark ? 'text-slate-500' : 'text-slate-400')}>CAREER DECISION STUDIO</span></span>
          </Link>
          <nav aria-label="决策流程" className="ml-4 flex items-center gap-1 overflow-x-auto sm:gap-2">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const active = currentPath === stage.path;
              const complete = index < completeThrough;
              return <Link key={stage.path} to={stage.path} aria-current={active ? 'step' : undefined} className={clsx('group flex shrink-0 items-center gap-2 rounded-xl px-2.5 py-2 transition sm:px-3.5', active ? dark ? 'bg-white/10 text-white' : 'bg-teal-50 text-teal-900' : dark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')}>
                <span className={clsx('grid size-7 place-items-center rounded-lg', active ? dark ? 'bg-teal-300 text-slate-950' : 'bg-teal-700 text-white' : complete ? dark ? 'bg-teal-300/10 text-teal-200' : 'bg-teal-100 text-teal-800' : dark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400')}><Icon size={14}/></span>
                <span className="text-left"><span className="block text-xs font-medium">{stage.label}<span className="ml-1 hidden font-normal opacity-60 md:inline">{stage.detail}</span></span><span className={clsx('mt-0.5 hidden font-mono text-[9px] tracking-wider sm:block', active ? 'opacity-60' : 'opacity-40')}>0{index + 1}</span></span>
              </Link>;
            })}
          </nav>
          <Link to="/" className={clsx('ml-2 hidden items-center gap-1.5 text-xs transition hover:text-teal-600 xl:flex', dark ? 'text-slate-400' : 'text-slate-500')}>总览<ArrowUpRight size={13}/></Link>
        </div>
      </header>
      {stageIndex >= 0 && <div className={clsx('h-0.5', dark ? 'bg-white/5' : 'bg-slate-200')}><div className="h-full bg-teal-500 transition-all duration-500" style={{ width: ((stageIndex + 1) / stages.length) * 100 + '%' }}/></div>}
      <main className={clsx(dark ? '' : 'mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-12')}><Outlet /></main>
    </div>
  );
}
