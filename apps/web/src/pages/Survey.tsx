import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAppContext } from '../context/AppContext';
import { careers, questionnaire } from '../data/mockData';
import { scenarios } from '../data/productData';
import { calculateProgress } from '../utils/ruleEngine';
import type { UserProfile } from '../types';

const stages = ['高中阶段', '大学阶段', '求职准备中', '已工作'];
export default function Survey() {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, setAvailableCareers, setProgress, selectedScenario, setSelectedCareerIds } = useAppContext();
  const scenario = scenarios.find(item => item.id === selectedScenario) ?? scenarios[1];
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<UserProfile>({ ...userProfile, stage: userProfile.stage || scenario.stage, decisionGoal: selectedScenario });
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => Object.fromEntries(questionnaire.map(question => [question.id, question.id === 'bottom-lines' ? userProfile.bottomLines : question.id === 'work-style' ? userProfile.workStyle ? [userProfile.workStyle] : [] : userProfile.preferences.filter(value => question.options?.some(option => option.value === value))])));
  const reduce = useReducedMotion();
  const total = questionnaire.length + 4;
  const question = step >= 4 ? questionnaire[step - 4] : undefined;
  const last = step === total - 1;
  const selected = question ? answers[question.id] ?? [] : [];
  const ready = step === 0 ? Boolean(draft.major.trim()) : step === 1 ? Boolean(draft.stage) : step === 2 ? Boolean(draft.deadline) : step === 3 ? true : selected.length > 0;
  const update = (field: keyof UserProfile, value: string | number) => setDraft(current => ({ ...current, [field]: value }));
  const profile = (): UserProfile => ({ ...draft, major: draft.major.trim(), bottomLines: (answers['bottom-lines'] ?? []).filter(value => value !== 'none'), preferences: [...(answers['work-values'] ?? []), ...(answers.interests ?? [])], workStyle: answers['work-style']?.[0] });
  const submit = (event: FormEvent) => {
    event.preventDefault(); if (!ready) return;
    setUserProfile(profile());
    if (!last) { setStep(step + 1); return; }
    setProgress(calculateProgress(profile())); setAvailableCareers(careers); setSelectedCareerIds([]); navigate('/explore');
  };
  const toggle = (value: string) => {
    if (!question) return;
    setAnswers(current => ({ ...current, [question.id]: question.type === 'single' || value === 'none' ? [value] : selected.includes(value) ? selected.filter(item => item !== value) : [...selected.filter(item => item !== 'none'), value] }));
  };
  const options = step === 1 ? stages.map(value => ({ value, label: value })) : [...(question?.options ?? []), ...(last ? [{ value: 'none', label: '目前没有明确底线，先通过体验确认' }] : [])];
  const titles = ['你正在学习什么，或擅长什么？', '此刻，你站在人生的哪一站？', '你最晚需要在什么时候做决定？', '这次尝试，你有哪些现实条件？'];
  const optionalFields = [['subjects', '选科组合', '例如：物化生'], ['strengths', '优势学科 / 技能', '例如：生物、写作'], ['scoreRange', '成绩区间', '可不填'], ['schoolTier', '学校背景', '可不填，仅供沟通参考']] as const;
  return <div className="min-h-[calc(100svh-5rem)] bg-[radial-gradient(ellipse_at_90%_0%,#17333b_0%,#0c1220_60%)] px-6 py-10 sm:py-16"><form onSubmit={submit} className="mx-auto max-w-2xl pb-28">
    <div className="mb-8 flex items-center justify-between"><button type="button" onClick={() => step ? setStep(step - 1) : navigate('/')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} />返回</button><span className="text-xs tracking-widest text-teal-300">01 / 知己</span></div>
    <p className="mb-5 text-xs leading-6 text-slate-400">{scenario.title} · {scenario.goal}</p>
    <div className="flex gap-2" aria-label={`第 ${step + 1} 题，共 ${total} 题`}>{Array.from({ length: total }, (_, index) => <div key={index} className={clsx('h-1 flex-1 rounded-full', index <= step ? 'bg-teal-300' : 'bg-white/10')} />)}</div>
    <AnimatePresence mode="wait" initial={false}><motion.section key={step} initial={{ opacity: 0, x: reduce ? 0 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduce ? 0 : -20 }} transition={{ duration: .2 }} className="mt-10">
      <p className="font-mono text-xs tracking-widest text-slate-500">QUESTION {String(step + 1).padStart(2, '0')} / {total}</p><h1 className="mt-5 text-3xl font-medium leading-snug sm:text-4xl">{titles[step] ?? question?.prompt}</h1>
      <p className="mb-8 mt-4 text-sm leading-6 text-slate-400">{step === 3 ? '全部选填。不根据学校或家庭条件替你下结论，只调整尝试成本。' : last ? '底线会从推荐中硬过滤。你仍可主动查看冲突方向的风险。' : step >= 4 ? '这是偏好探索，不是标准化心理测评，不生成 MBTI 人格标签。' : '如实填写即可，不必把暂时的状态当成永久定义。'}</p>
      {step === 0 ? <input aria-label="专业或擅长方向" autoFocus value={draft.major} onChange={event => update('major', event.target.value)} placeholder="例如：生物科学 / 暂未确定" className="dark-field" /> : step === 2 ? <input aria-label="紧迫决策节点" type="date" required value={draft.deadline ?? ''} onChange={event => update('deadline', event.target.value)} className="dark-field [color-scheme:dark]" /> : step === 3 ? <div className="grid gap-4 sm:grid-cols-2">{optionalFields.map(([key, label, placeholder]) => <label key={key} className="text-xs text-slate-400">{label}<input value={draft[key] ?? ''} onChange={event => update(key, event.target.value)} placeholder={placeholder} className="dark-field mt-2" /></label>)}<label className="text-xs text-slate-400">家庭试错预算<select value={draft.budget ?? ''} onChange={event => update('budget', event.target.value)} className="dark-field mt-2"><option value="">暂不填写</option><option value="low">尽量零成本</option><option value="medium">可承担少量课程 / 项目费用</option><option value="flexible">可讨论更多投入</option></select></label><label className="text-xs text-slate-400">每周可投入小时数<input type="number" min={1} max={40} value={draft.weeklyHours ?? ''} onChange={event => update('weeklyHours', Math.min(40, Math.max(1, Number(event.target.value))))} className="dark-field mt-2" /></label></div> : <div className="space-y-3">{options.map(option => {
        const checked = step === 1 ? draft.stage === option.value : selected.includes(option.value);
        return <motion.label layout key={option.value} className={clsx('flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition-colors', checked ? 'border-teal-300 bg-teal-300/10' : 'border-white/10 bg-white/[.035] hover:border-white/30')}><input className="peer sr-only" type={question?.type === 'multiple' ? 'checkbox' : 'radio'} name={`step-${step}`} checked={checked} onChange={() => step === 1 ? update('stage', option.value) : toggle(option.value)} /><span className={clsx('grid size-6 shrink-0 place-items-center rounded-md border peer-focus-visible:ring-2 peer-focus-visible:ring-teal-200', checked ? 'border-teal-300 bg-teal-300 text-slate-950' : 'border-white/20')}>{checked && <Check size={16} />}</span><span className={checked ? 'text-teal-50' : 'text-slate-300'}>{option.label}</span></motion.label>;
      })}</div>}
    </motion.section></AnimatePresence>
    {!last && <button type="submit" disabled={!ready} className="mt-9 flex items-center gap-3 rounded-full bg-teal-300 px-7 py-3.5 font-medium text-slate-950 hover:bg-teal-200 disabled:opacity-30">{step === 3 ? '保存条件并继续' : '继续'}<ArrowRight size={17} /></button>}
    <AnimatePresence>{last && ready && <motion.div initial={{ y: reduce ? 0 : 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed inset-x-0 bottom-0 z-20 border-t border-teal-300/20 bg-[#0c1220]/95 px-6 py-5 backdrop-blur-xl"><button type="submit" className="mx-auto flex w-full max-w-2xl items-center justify-center gap-3 rounded-xl bg-teal-300 py-4 font-semibold text-slate-950"><Sparkles size={19} />生成我的决策路径<ArrowRight size={18} /></button></motion.div>}</AnimatePresence>
  </form></div>;
}
