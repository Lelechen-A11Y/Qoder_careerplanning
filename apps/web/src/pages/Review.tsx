import { CheckCircle2, Circle, RotateCcw, Send } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { careers } from '../data/mockData';
import { getData } from '../utils/storage';
import { reviewVerdict } from '../utils/decision';
import type { ReviewRecord, ThirtyDayPlan } from '../types';

const planKey = 'pathmap-30-day-plan';
const prompts = [
  { id: 'actions', title: '你实际完成了哪些行动？', helper: '记录你做过的任务、访谈或作品。' },
  { id: 'energy', title: '过程中的精力状态如何？', helper: '比起“擅不擅长”，先注意能不能持续。' },
  { id: 'boundary', title: '是否触及你设下的底线？', helper: '这是决策规则，不是意志力测试。' },
  { id: 'evidence', title: '目前最重要的一条证据是什么？', helper: '可以是作品、反馈、成本或一个被排除的选项。' },
];
export default function Review() {
  const navigate = useNavigate();
  const { plan: contextPlan, reviewRecords, setReviewRecords, experiences } = useAppContext();
  const plan = contextPlan ?? getData<ThirtyDayPlan | null>(planKey, null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ title: string; description: string } | null>(null);
  const related = experiences.filter(item => plan?.careerIds.includes(item.careerId));
  const allAnswered = prompts.every(prompt => (answers[prompt.id] ?? '').trim());
  const careersInPlan = useMemo(() => (plan?.careerIds ?? []).map(id => careers.find(career => career.id === id)).filter(career => career !== undefined), [plan]);
  const set = (id: string, value: string) => setAnswers(current => ({ ...current, [id]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault(); if (!allAnswered) return;
    const verdict = reviewVerdict(answers.boundary, answers.evidence, answers.energy);
    setResult(verdict);
    const record: ReviewRecord = { careerId: plan?.careerIds.join(',') ?? 'career-exploration', status: 'completed', answers: prompts.map(prompt => `${prompt.title} ${answers[prompt.id]}`), createdAt: new Date().toISOString(), verdict: verdict.title };
    setReviewRecords(current => [record, ...current]);
  };
  return <div className="mx-auto max-w-3xl space-y-8 pb-16"><header><p className="eyebrow">30-DAY REVIEW</p><h1 className="mt-4 text-3xl font-semibold">不是给自己打分。<br/><span className="text-slate-400">是让证据替你说话。</span></h1><p className="mt-4 text-sm leading-7 text-slate-500">排除不适合，也是一种有效进展。没有按计划完成的部分，同样值得如实记录。</p></header>
    {plan && <section className="surface p-6"><div className="flex justify-between gap-4"><div><p className="eyebrow">ACTIVE EXPERIMENT</p><h2 className="mt-2 font-semibold">计划方向</h2></div><span className="text-xs text-slate-400">复盘节点 {plan.reviewAt ?? '未设定'}</span></div><p className="mt-3 text-sm text-slate-600">{careersInPlan.map(career => career.title).join('、') || '综合探索'}</p><p className="mt-3 text-xs leading-5 text-slate-500">退出条件：{plan.exitConditions?.join('；') ?? '遇到底线、资格门槛或预算限制时暂停。'}</p></section>}
    {related.length > 0 && <section className="surface p-6"><h2 className="text-sm font-semibold">已保存的微体验证据</h2><div className="mt-3 space-y-3">{related.map((item, index) => <div key={`${item.createdAt}-${index}`} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-400">{careers.find(career => career.id === item.careerId)?.title} · {new Date(item.createdAt).toLocaleDateString()}</p><p className="mt-2 text-sm leading-6 text-slate-600">{item.output}</p><p className="mt-2 text-xs text-slate-500">精力：{item.energy} · 触及底线：{item.crossedBottomLine ? '是' : '否'}</p></div>)}</div></section>}
    <form onSubmit={submit} className="space-y-4">{prompts.map((prompt, index) => <fieldset key={prompt.id} className="surface p-5 sm:p-6"><legend className="text-sm font-semibold">0{index + 1} · {prompt.title}</legend><p className="mt-1 text-xs text-slate-400">{prompt.helper}</p>{prompt.id === 'energy' ? <div className="mt-4 flex flex-wrap gap-2">{[['energized','更投入'],['neutral','可以接受'],['drained','明显消耗']].map(([value,label]) => <label key={value} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${answers.energy === value ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}><input type="radio" name="energy" checked={answers.energy === value} onChange={() => set('energy',value)} className="mr-2 accent-teal-700"/>{label}</label>)}</div> : prompt.id === 'boundary' ? <div className="mt-4 flex flex-wrap gap-2">{[['yes','是，触及底线'],['no','没有触及'],['uncertain','还不确定']].map(([value,label]) => <label key={value} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${answers.boundary === value ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}><input type="radio" name="boundary" checked={answers.boundary === value} onChange={() => set('boundary',value)} className="mr-2 accent-teal-700"/>{label}</label>)}</div> : <textarea required minLength={prompt.id === 'evidence' ? 15 : 3} value={answers[prompt.id] ?? ''} onChange={event => set(prompt.id,event.target.value)} rows={3} className="field mt-4" placeholder="写下你的观察与证据…"/>}</fieldset>)}
    {!allAnswered && <p className="text-xs text-slate-400">完成四项记录后，PathMap 会依照底线、证据完整度和精力状态给出规则建议。</p>}{!result && <div className="flex justify-end border-t border-slate-200 pt-5"><button type="submit" disabled={!allAnswered} className="button-primary"><Send size={16}/>提交四问复盘</button></div>}</form>
    {result && <section role="status" className={`rounded-3xl border p-6 ${result.title === '建议调整' ? 'border-rose-200 bg-rose-50' : result.title === '建议加码' ? 'border-teal-200 bg-teal-50' : 'border-amber-200 bg-amber-50'}`}><div className="flex items-start gap-3">{result.title === '建议调整' ? <RotateCcw size={20} className="mt-0.5 text-rose-700"/> : <CheckCircle2 size={20} className="mt-0.5 text-teal-700"/>}<div><p className="font-semibold">{result.title}</p><p className="mt-2 text-sm leading-6 text-slate-700">{result.description}</p></div></div><button type="button" onClick={() => navigate('/safeguard')} className="button-secondary mt-5">查看我的决策资产<ArrowRightIcon/></button></section>}
    <section className="surface p-6"><h2 className="text-sm font-semibold">历次复盘</h2>{reviewRecords.length ? reviewRecords.map((record,index) => <div key={`${record.createdAt}-${index}`} className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3 text-sm"><Circle size={14} className="text-slate-400"/><span>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '历史记录'}</span><span className="ml-auto text-teal-800">{record.verdict ?? record.status}</span></div>) : <p className="mt-3 text-sm text-slate-400">完成第一次复盘后，记录会保存在本机。</p>}</section>
  </div>;
}
function ArrowRightIcon() { return <span aria-hidden="true">↗</span>; }
