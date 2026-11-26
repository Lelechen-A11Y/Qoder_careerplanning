import { ArrowRight, LoaderCircle, Send, ShieldCheck, Sparkles, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { expertQuestions } from '../data/mockData';
import { runCareerAgent, streamLocalAnswer } from '../agent/careerAgent';
import { getData, saveData } from '../utils/storage';
import type { AgentMessage, AgentResponse, Career } from '../types';

const intentLabels: Record<string, string> = { overview: '职业日常', salary: '薪资信息', market: '市场趋势', 'ai-risk': 'AI 影响', learning: '学习路径', qualification: '岗位门槛', handoff: '人工校准' };

export default function ExpertDialog({ career, onClose }: { career: Career; onClose: () => void }) {
  const { userProfile } = useAppContext();
  const navigate = useNavigate();
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelled = useRef(false);
  const [messages, setMessages] = useState<AgentMessage[]>(() => getData(`pathmap-agent-${career.id}`, []));
  const [question, setQuestion] = useState('');
  const [thinking, setThinking] = useState(false);
  const [lastResponse, setLastResponse] = useState<AgentResponse | null>(null);
  useEffect(() => { cancelled.current = false; dialog.current?.showModal(); return () => { cancelled.current = true; }; }, []);

  const ask = async (value: string) => {
    const content = value.trim();
    if (!content || thinking) return;
    setQuestion(''); setThinking(true); setLastResponse(null);
    const userMessage: AgentMessage = { id: crypto.randomUUID(), role: 'user', content, createdAt: new Date().toISOString() };
    const prior = messages.slice(-10);
    const partial: AgentMessage = { id: crypto.randomUUID(), role: 'assistant', content: '', createdAt: new Date().toISOString() };
    setMessages([...messages, userMessage, partial]);
    const response = runCareerAgent(content, career, userProfile, prior);
    let streamed = '';
    for await (const chunk of streamLocalAnswer(response.answer)) {
      if (cancelled.current) return;
      streamed += chunk;
      setMessages([...messages, userMessage, { ...partial, content: streamed, intent: response.intent, sources: response.sources, trace: response.trace, handoff: response.handoff }]);
    }
    const assistant: AgentMessage = { ...partial, content: response.answer, intent: response.intent, sources: response.sources, trace: response.trace, handoff: response.handoff };
    const complete = [...messages, userMessage, assistant].slice(-20);
    setMessages(complete); saveData(`pathmap-agent-${career.id}`, complete); setLastResponse(response); setThinking(false);
  };

  const submit = (event: FormEvent) => { event.preventDefault(); void ask(question); };
  return <dialog ref={dialog} onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }} aria-labelledby="agent-title" className="max-h-[90svh] w-[calc(100%-1.5rem)] max-w-xl overflow-y-auto rounded-3xl bg-[#111c2e] p-0 text-white shadow-2xl backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm">
    <div className="p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-xs text-teal-300"><Sparkles size={14}/>PATHMAP CAREER AGENT / LOCAL RAG</p><h2 id="agent-title" className="mt-3 text-xl font-semibold">{career.title} · 职业专家</h2></div><button type="button" onClick={onClose} aria-label="关闭对话" className="rounded-full p-2 text-slate-400 hover:bg-white/10"><X size={19}/></button></div>
      <div className="mt-4 flex gap-3 rounded-xl border border-amber-300/15 bg-amber-100/[.04] p-3 text-xs leading-5 text-slate-400"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-amber-200"/><p>纯前端 Agent 演示：按意图检索本地职业资料，不调用大模型。资料均为演示内容，不代表真实市场数据；不会替你决定或承诺结果。</p></div>
      <div className="mt-5 space-y-3">
        {!messages.length && <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><p className="text-sm text-slate-300">从一个具体问题开始。</p><div className="mt-3 flex flex-wrap gap-2">{expertQuestions.map(prompt => <button key={prompt} type="button" onClick={() => void ask(prompt)} disabled={thinking} className="rounded-full border border-white/10 px-3 py-2 text-left text-xs text-slate-300 hover:border-teal-300/50 hover:text-teal-100">{prompt}</button>)}</div></div>}
        {messages.map(message => <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>{message.role === 'assistant' && <span className="grid size-7 shrink-0 place-items-center rounded-full bg-teal-300/10 text-teal-200"><Sparkles size={14}/></span>}<div className={`max-w-[88%] rounded-2xl p-4 ${message.role === 'user' ? 'bg-teal-300 text-slate-950' : 'border border-white/10 bg-white/[.045]'}`}>{message.role === 'assistant' && message.intent && <p className="mb-2 text-[10px] tracking-wider text-teal-300">ROUTE · {intentLabels[message.intent]}</p>}<p className="whitespace-pre-wrap text-sm leading-6">{message.content || <span className="flex items-center gap-2 text-slate-400"><LoaderCircle size={14} className="animate-spin"/>正在检索资料…</span>}</p>{message.sources?.length ? <div className="mt-4 border-t border-white/10 pt-3"><p className="mb-2 text-[10px] font-medium tracking-wider text-slate-500">资料依据 / 更新时间 / 适用范围</p>{message.sources.map(source => <div key={source.id} className="mb-2 rounded-lg bg-black/15 p-3 text-[10px] leading-5 text-slate-400"><p className="text-slate-300">{source.title}</p><p>{source.sourceName} · {source.asOf}</p><p>{source.scope}</p></div>)}</div> : message.role === 'assistant' && message.content && <p className="mt-3 border-t border-white/10 pt-2 text-[10px] leading-5 text-amber-200/80">未检索到可引用资料 · 建议人工核验</p>}{message.role === 'assistant' && message.handoff && <button type="button" onClick={() => { onClose(); navigate('/safeguard'); }} className="mt-3 inline-flex items-center gap-2 rounded-full border border-teal-300/30 px-3 py-2 text-xs text-teal-200 hover:bg-teal-300/10">去护航页查看人工校准 <ArrowRight size={13}/></button>}</div>{message.role === 'user' && <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-slate-300"><UserRound size={14}/></span>}</div>)}
        {lastResponse?.trace && <details className="ml-10 text-[10px] text-slate-500"><summary className="cursor-pointer">查看本次处理步骤</summary><ol className="mt-2 space-y-1">{lastResponse.trace.map((step,index)=><li key={`${step}-${index}`}>{String(index+1).padStart(2,'0')} · {step}</li>)}</ol></details>}
      </div>
      <form onSubmit={submit} className="sticky bottom-0 mt-5 flex gap-2 border-t border-white/10 bg-[#111c2e] pt-4"><input autoFocus value={question} onChange={event=>setQuestion(event.target.value)} maxLength={300} placeholder="问职业日常、学习路径或岗位门槛…" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-teal-300/50"/><button disabled={!question.trim() || thinking} aria-label="发送问题" className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-300 text-slate-950 hover:bg-teal-200 disabled:opacity-40"><Send size={16}/></button></form>
      <p className="mt-2 text-center text-[10px] leading-5 text-slate-500">最近 5 轮仅保存在本机浏览器。查不到资料、涉及录取或结果保证时，会拒绝推断并建议人工核验。</p>
    </div>
  </dialog>;
}
