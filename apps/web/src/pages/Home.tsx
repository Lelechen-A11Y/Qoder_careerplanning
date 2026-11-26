import { motion, useReducedMotion } from 'framer-motion';
import { BriefcaseBusiness, Compass, GraduationCap, Split, ArrowRight, Check, Clock3, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StoryIntro from '../components/StoryIntro';
import { AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const scenarios = [
  { id: 'high-school', title: '高三填志愿', subtitle: '专业太多，怕一步选错', icon: GraduationCap, tag: '第一次选择' },
  { id: 'college', title: '大学迷茫', subtitle: '正在学的，真的是我想要的吗', icon: Compass, tag: '重新认识自己' },
  { id: 'choice', title: '考研 / 考公 / 就业', subtitle: '每条路都有道理，哪条适合我', icon: Split, tag: '面对岔路口' },
  { id: 'working', title: '已工作，但不对劲', subtitle: '不想将就，也不想盲目重来', icon: BriefcaseBusiness, tag: '寻找第二条路' },
];
export default function Home() {
  const navigate = useNavigate();
  const { setSelectedScenario, selectedScenario, plan, userProfile, experiences, reviewRecords } = useAppContext();
  const reduce = useReducedMotion();
  const activeScenario = scenarios.find(item => item.id === selectedScenario) ?? scenarios[0];
  const currentStep = reviewRecords.length ? 3 : experiences.length ? 2 : userProfile.major ? 1 : 0;
  return (
    <div className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#183c46_0%,#111c30_38%,#0c1220_75%)] px-6 py-16 sm:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <motion.div initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="relative mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
          <div className="text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/5 px-4 py-2 text-xs tracking-widest text-teal-200"><span className="size-1.5 rounded-full bg-teal-300" />让重要选择，有迹可循</span>
            <div className="mt-4 text-left"><StoryIntro /></div>
            <div className="mt-8 flex flex-wrap items-center gap-3"><button type="button" onClick={() => { setSelectedScenario(selectedScenario || 'college'); navigate('/survey'); }} className="inline-flex items-center gap-3 rounded-full bg-teal-300 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-200">开始梳理 <ArrowRight size={17}/></button><span className="flex items-center gap-2 text-xs text-slate-400"><Clock3 size={14}/>约 5 分钟 · 可随时保存</span></div>
          </div>
          <aside className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.045] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-teal-300/10 blur-3xl" aria-hidden="true"/>
            <div className="relative flex items-start justify-between"><div><p className="font-mono text-[10px] tracking-[.2em] text-teal-200">YOUR DECISION BRIEF</p><h2 className="mt-2 text-lg font-medium">此刻的岔路口</h2></div><Sparkles size={19} className="text-teal-200"/></div>
            <p className="relative mt-7 text-2xl font-medium leading-snug text-white">{activeScenario.title}</p><p className="relative mt-2 text-sm leading-6 text-slate-400">{activeScenario.subtitle}</p>
            <div className="relative mt-7 space-y-2">{scenarios.map((scenario, index) => { const Icon = scenario.icon; const selected = activeScenario.id === scenario.id; return <button key={scenario.id} type="button" onClick={() => setSelectedScenario(scenario.id)} aria-pressed={selected} className={clsx('flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition', selected ? 'border-teal-300/40 bg-teal-300/10' : 'border-white/5 bg-black/10 hover:border-white/20')}><span className={clsx('grid size-8 place-items-center rounded-lg', selected ? 'bg-teal-300 text-slate-950' : 'bg-white/5 text-slate-400')}><Icon size={16}/></span><span className="min-w-0 flex-1"><span className={clsx('block text-xs', selected ? 'text-white' : 'text-slate-300')}>{scenario.title}</span><span className="mt-1 block truncate text-[10px] text-slate-500">{scenario.tag}</span></span><span className="font-mono text-[10px] text-slate-600">0{index + 1}</span></button>; })}</div>
            <AnimatePresence mode="wait"><motion.div key={activeScenario.id} initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="relative mt-5 rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-[10px] tracking-wider text-slate-500">第一步可以先做</p><p className="mt-2 text-sm leading-6 text-slate-300">{activeScenario.subtitle}，再梳理现实约束和可验证的下一步。</p></motion.div></AnimatePresence>
          </aside>
        </div>
        {plan && <button type="button" onClick={() => navigate('/review')} className="mt-8 flex w-full items-center justify-between rounded-2xl border border-teal-300/30 bg-teal-300/10 px-5 py-4 text-left text-sm text-teal-100"><span><span className="block font-medium">继续 30 天验证计划</span><span className="mt-1 block text-xs text-teal-100/60">你的行动记录还在这里</span></span><ArrowRight size={18}/></button>}
        <section className="mt-14 border-t border-white/10 pt-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[.2em] text-slate-500">A DECISION, NOT A TEST</p><h2 className="mt-2 text-lg font-medium text-white">让想法走过四个可见步骤</h2></div><span className="text-xs text-slate-500">当前阶段 {currentStep + 1} / 4</span></div><div className="mt-6 grid gap-3 sm:grid-cols-4">{[['01 知己','厘清偏好与边界','/survey'],['02 知彼','看见真实任务','/explore'],['03 知行','用行动验证','/result'],['04 护航','保留证据与复盘','/safeguard']].map(([title, detail, path], index) => <button type="button" key={path} onClick={() => navigate(path)} className={clsx('group rounded-xl border p-4 text-left transition hover:-translate-y-0.5', index <= currentStep ? 'border-teal-300/30 bg-teal-300/[.07]' : 'border-white/10 bg-white/[.025] hover:border-white/25')}><div className="flex items-center justify-between"><span className="text-xs font-medium text-teal-100">{title}</span>{index < currentStep ? <Check size={14} className="text-teal-300"/> : <span className="font-mono text-[10px] text-slate-600">0{index + 1}</span>}</div><p className="mt-3 text-[11px] leading-5 text-slate-400">{detail}</p><div className="mt-4 h-0.5 rounded bg-white/10"><div className={clsx('h-full rounded bg-teal-300 transition-all', index < currentStep ? 'w-full' : index === currentStep ? 'w-1/2' : 'w-0')}/></div></button>)}</div></section>
      </motion.div>
    </div>
  );
}
