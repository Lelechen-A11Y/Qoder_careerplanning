import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Check, CircleDollarSign, Clock3, Compass, Printer, ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAppContext } from '../context/AppContext';
import { careers } from '../data/mockData';
import { scenarios } from '../data/productData';
import { assessCareer, dateAfter } from '../utils/decision';
import type { ThirtyDayPlan } from '../types';

const weeklyTasks = [
  { week: '第 1 周 · 核实现实', items: ['找 3 份目标岗位招聘信息', '确认学历、技能与时间要求', '完成 20 分钟微体验'] },
  { week: '第 2 周 · 补一项能力', items: ['挑一个最关键的能力缺口', '每周安排两次短时练习', '找一位从业者核实日常任务'] },
  { week: '第 3–4 周 · 形成证据', items: ['交付一个可展示的小作品', '复盘精力、成本和边界', '按退出条件做下一步决定'] },
];
export default function Result() {
  const navigate = useNavigate(); const { userProfile, selectedCareerIds, experiences, setPlan, storageAvailable } = useAppContext();
  const [saved, setSaved] = useState(false);
  const scenario = scenarios.find(item => item.id === userProfile.decisionGoal) ?? scenarios.find(item => item.title.includes(userProfile.stage)) ?? scenarios[1];
  const ranked = useMemo(() => careers.map(career => assessCareer(career, userProfile)).filter(result => result.eligible).sort((a, b) => b.score - a.score || b.career.salaryMid - a.career.salaryMid), [userProfile]);
  const excluded = useMemo(() => careers.map(career => assessCareer(career, userProfile)).filter(result => !result.eligible), [userProfile]);
  const selected = careers.filter(career => selectedCareerIds.includes(career.id));
  const primary = selected[0] ?? ranked[0]?.career ?? careers[2];
  const secondary = ranked.find(result => result.career.id !== primary.id)?.career ?? careers[0];
  const paths = [
    { title: '保底出口', days: '第 1 周', icon: ShieldCheck, career: secondary, detail: secondary.fallback },
    { title: '补救交叉路径', days: '第 2–3 周', icon: Compass, career: primary, detail: primary.crossover },
    { title: '30 天测试计划', days: '第 4 周', icon: CalendarDays, career: primary, detail: primary.experiment.join(' ') },
  ];
  const conflictsFor = (careerId: string) => careers.find(career => career.id === careerId)?.conflictTags.filter(tag => userProfile.bottomLines.includes(tag)) ?? [];
  const firstConflict = userProfile.bottomLines.length ? careers.find(career => career.conflictTags.some(tag => userProfile.bottomLines.includes(tag))) : undefined;
  const startDate = new Date().toISOString().slice(0, 10);
  const endDate = dateAfter(startDate, 30);
  const savePlan = () => {
    const next: ThirtyDayPlan = { createdAt: new Date().toISOString(), reviewAt: endDate, careerIds: [primary.id, secondary.id], milestones: paths.map(path => ({ title: path.title, description: path.detail, days: path.days })), tasks: weeklyTasks, exitConditions: ['已确认两项以上硬性门槛无法满足', '连续两次微体验精力明显耗竭且无改善假设', '现金成本超过预先设定预算'], weeklyHours: userProfile.weeklyHours };
    setPlan(next); setSaved(true); navigate('/safeguard');
  };
  const completedCount = experiences.filter(item => [primary.id, secondary.id].includes(item.careerId)).length;
  return <div className="mx-auto max-w-4xl space-y-10 pb-16">
    <header><p className="eyebrow">03 / MAKE A MOVE</p><h1 className="mt-4 text-3xl font-semibold sm:text-4xl">这不是一次押注。<br/><span className="text-slate-400">是可逆的 30 天验证。</span></h1><p className="mt-5 text-sm leading-7 text-slate-500">{scenario.goal} · {scenario.action} · 你的期限是 {userProfile.deadline ?? '待确认'}。下方路径优先呈现符合硬底线的方向。</p></header>
    <section className="surface grid gap-5 p-6 sm:grid-cols-3 sm:p-7">{[['每周投入', `${userProfile.weeklyHours ?? 3} 小时`, Clock3], ['试错成本', userProfile.budget === 'low' ? '尽量零成本' : userProfile.budget ? '按预算逐步投入' : '先从免费资源开始', CircleDollarSign], ['决策节点', userProfile.deadline ?? '待补充', CalendarDays]].map(([label, value, Icon]) => <div key={label as string} className="flex gap-3"><Icon size={18} className="mt-0.5 text-teal-700"/><div><p className="text-xs text-slate-400">{label as string}</p><p className="mt-1 text-sm font-medium">{value as string}</p></div></div>)}</section>
    <div className="relative space-y-7 before:absolute before:bottom-8 before:left-6 before:top-8 before:w-px before:bg-gradient-to-b before:from-teal-600 before:via-slate-300 before:to-slate-200 sm:before:left-8">{paths.map((path, index) => { const Icon = path.icon; const conflict = conflictsFor(path.career.id); const task = path.career.experiment[0]; return <motion.section key={path.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .1 }} className={clsx('surface relative ml-6 p-6 sm:ml-8 sm:p-8', conflict.length && 'border-rose-500 ring-1 ring-rose-200')}><span className={clsx('absolute -left-[41px] top-7 grid size-8 place-items-center rounded-full border-4 border-[#f5f6f8] text-white sm:-left-[49px] sm:size-10', conflict.length ? 'bg-rose-600' : 'bg-teal-700')}><Icon size={17}/></span><div className="flex items-center justify-between"><p className="eyebrow">{path.title}</p><span className="text-xs text-slate-400">{path.days}</span></div><h2 className="mt-3 text-lg font-semibold">{path.career.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{index === 2 ? task : path.detail}</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">{path.career.salary}</span><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">AI 风险 {path.career.aiRisk}</span></div>{conflict.length > 0 && <div role="alert" className="mt-5 flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800"><TriangleAlert size={17} className="mt-0.5 shrink-0"/><div><strong className="text-sm">与你底线冲突</strong><p className="mt-1 text-xs leading-5">{conflict.map(tag => ({boring:'无法忍受枯燥',copywriting:'受不了写文案','long-overtime':'无法接受长期加班','frequent-travel':'无法接受频繁出差'}[tag] ?? tag)).join('、')}。该方向不会进入建议清单；这里只展示冲突原因供复核。</p></div></div>}{index === 1 && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><p className="text-xs font-medium">能力补救动作</p><p className="mt-2 text-sm text-slate-600">{path.career.crossover}</p></div>}{index === 2 && <div className="mt-5 border-t border-slate-100 pt-4"><p className="flex items-center gap-2 text-xs font-medium"><ShieldAlert size={15} className="text-amber-600"/>退出条件与可逆窗口</p><p className="mt-2 text-xs leading-6 text-slate-500">30 天内只做公开信息、免费工具与小作品验证。若连续两次明显耗竭、预算超限或门槛无法满足，即停止投入并回到保底出口。</p></div>}</motion.section>; })}</div>
    {firstConflict && <p className="flex gap-2 text-xs leading-6 text-slate-500"><ShieldAlert size={15} className="mt-0.5 shrink-0 text-amber-600"/>你设置的底线已排除了至少一个职业方向，因而不进入保底或交叉推荐。仍可回到知彼查看具体冲突。</p>}
    {excluded.length > 0 && <section className="space-y-3"><div><p className="text-xs font-semibold tracking-[.18em] text-rose-700">HARD BOUNDARY / EXCLUDED PATHS</p><h2 className="mt-2 text-lg font-semibold">这些方向触及了你的底线</h2></div>{excluded.map(({ career, conflicts }) => <article key={career.id} className="rounded-2xl border border-rose-300 bg-rose-50 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold text-rose-950">{career.title}</h3><span className="text-xs text-rose-700">与你底线冲突</span></div><p className="mt-2 text-sm leading-6 text-rose-900">{career.realScene}</p><p className="mt-3 text-xs text-rose-800">触及：{conflicts.join('、')}。该方向不会被排进推荐，但保留在这里供你复核信息与规则。</p></article>)}</section>}
    <section className="surface p-6 sm:p-8"><div className="flex flex-wrap justify-between gap-3"><div><p className="eyebrow">30-DAY EXPERIMENT</p><h2 className="mt-2 text-xl font-semibold">{startDate} — {endDate}</h2></div><span className="rounded-full bg-teal-50 px-4 py-2 text-xs text-teal-800">可随时调整</span></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{weeklyTasks.map(week => <div key={week.week} className="rounded-2xl bg-slate-50 p-4"><h3 className="text-sm font-medium">{week.week}</h3><ul className="mt-3 space-y-2">{week.items.map(item => <li key={item} className="flex gap-2 text-xs leading-5 text-slate-500"><Check size={13} className="mt-1 shrink-0 text-teal-700"/>{item}</li>)}</ul></div>)}</div><div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-medium text-amber-950">明确退出条件</p><ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-5 text-amber-900"><li>连续两次任务体验精力明显耗竭，且没有可执行的调整假设</li><li>出现无法满足的硬性资格门槛，或投入成本超出预算</li><li>退出不代表失败，排除不适合本身就是决策证据</li></ul></div><p className="mt-5 flex items-center gap-2 text-xs text-slate-500"><Check size={14} className="text-teal-700"/>{completedCount} 项体验证据已留存</p></section>
    {!storageAvailable && <p role="status" className="text-xs text-amber-700">浏览器存储不可用，刷新页面后资料可能无法保留。</p>}
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6"><button type="button" onClick={() => window.print()} className="button-secondary"><Printer size={16}/>打印路径摘要</button><button type="button" onClick={savePlan} className="button-primary">{saved ? '打开护航工作台' : '保存计划并继续'}<ArrowRight size={17}/></button></footer>
  </div>;
}
