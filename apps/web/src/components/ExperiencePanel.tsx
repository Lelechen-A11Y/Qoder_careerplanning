import { useState } from 'react';
import { Check, Clock3, FlaskConical } from 'lucide-react';
import { careerDetails } from '../data/productData';
import { useAppContext } from '../context/AppContext';
import type { Career, ExperienceRecord } from '../types';

export default function ExperiencePanel({ career }: { career: Career }) {
  const { experiences, setExperiences } = useAppContext();
  const previous = experiences.filter(record => record.careerId === career.id).at(-1);
  const [output, setOutput] = useState(previous?.output ?? '');
  const [energy, setEnergy] = useState<ExperienceRecord['energy']>(previous?.energy ?? 'neutral');
  const [crossed, setCrossed] = useState(previous?.crossedBottomLine ?? false);
  const [saved, setSaved] = useState(false);
  const task = careerDetails[career.id].microTask;
  return <section className="surface p-6 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><span className="eyebrow flex items-center gap-2"><FlaskConical size={16} />先试一下</span><span className="flex items-center gap-2 text-xs text-slate-500"><Clock3 size={14} />建议 {task.minutes} 分钟</span></div>
    <h3 className="mt-4 text-xl font-semibold">{task.brief}</h3><p className="mt-2 text-sm text-slate-500">{career.title} · 不求标准答案，记录你做这件事的真实感受。</p>
    <pre className="my-5 whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 font-sans text-sm leading-7 text-slate-300">{task.material}</pre>
    <ol className="space-y-2 text-sm leading-6 text-slate-600">{task.steps.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}</ol>
    <label className="mt-6 block text-sm font-medium">体验产出<textarea value={output} onChange={event => { setOutput(event.target.value); setSaved(false); }} placeholder={task.deliverable} rows={4} className="field mt-3" /></label>
    <fieldset className="mt-5"><legend className="text-sm font-medium">做完后的精力状态</legend><div className="mt-3 flex flex-wrap gap-2">{([['energized', '更有投入感'], ['neutral', '可以接受'], ['drained', '明显被消耗']] as const).map(([value, label]) => <label key={value} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${energy === value ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}><input type="radio" name={`energy-${career.id}`} checked={energy === value} onChange={() => { setEnergy(value); setSaved(false); }} className="mr-2 accent-teal-700" />{label}</label>)}</div></fieldset>
    <label className="mt-5 flex items-center gap-3 text-sm text-slate-600"><input type="checkbox" checked={crossed} onChange={event => { setCrossed(event.target.checked); setSaved(false); }} className="size-4 accent-rose-600" />这次任务触碰了我的底线</label>
    <div className="mt-6 flex flex-wrap items-center gap-4"><button type="button" disabled={output.trim().length < 10} onClick={() => { setExperiences(records => [...records, { careerId: career.id, output: output.trim(), energy, crossedBottomLine: crossed, createdAt: new Date().toISOString() }]); setSaved(true); }} className="button-primary"><Check size={16} />保存体验证据</button><span role="status" className="text-xs text-slate-500">{saved ? '已保存到我的资产' : '至少记录 10 个字再保存'}</span></div>
  </section>;
}
