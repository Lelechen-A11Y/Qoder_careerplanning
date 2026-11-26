import { CalendarClock, Download, Handshake, Printer, Sparkles, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { careers } from '../data/mockData';
import { preferenceLabels, scenarios, services } from '../data/productData';
import { useAppContext } from '../context/AppContext';
import { getConflicts } from '../utils/decision';
import { dateAfter } from '../utils/decision';
import type { LocalRequest } from '../types';

export default function Safeguard() {
  const navigate = useNavigate();
  const { userProfile, plan, requests, setRequests, checkedTasks, setCheckedTasks, experiences, storageAvailable } = useAppContext();
  const [notice, setNotice] = useState('');
  const profile = useMemo(() => ({
    scenario: scenarios.find(item => item.id === userProfile.decisionGoal)?.title ?? '生涯探索',
    preferences: userProfile.preferences.map(value => preferenceLabels[value] ?? value),
    boundaries: userProfile.bottomLines.map(value => ({ boring:'无法忍受枯燥', copywriting:'受不了写文案', 'long-overtime':'无法接受长期加班', 'frequent-travel':'无法接受频繁出差' }[value] ?? value)),
    candidates: careers.filter(career => getConflicts(career, userProfile.bottomLines).length === 0),
  }), [userProfile]);
  const plainText = `PathMap · 我的决策说明\n决策场景：${profile.scenario}\n当前阶段：${userProfile.stage}\n专业方向：${userProfile.major}\n重要偏好：${profile.preferences.join('、') || '继续探索'}\n不可接受：${profile.boundaries.join('、') || '暂未设置'}\n优先了解：${profile.candidates.map(career => career.title).join('、')}\n试错预算：${userProfile.budget ?? '暂未设置'}；每周投入：${userProfile.weeklyHours ?? '未设置'} 小时\n说明：这份卡片用于支持讨论，不替代个人决定。`;
  const saveRequest = (kind: LocalRequest['kind'], title: string, detail: string) => {
    const request = { id: `${Date.now()}`, kind, title, detail, createdAt: new Date().toISOString() };
    setRequests(current => [request, ...current]); setNotice('意向已保存在本浏览器的服务记录中。');
  };
  const download = (filename: string, text: string) => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url); setNotice('摘要文件已生成。');
  };
  const done = checkedTasks.length;
  const upcoming = plan?.reviewAt ?? dateAfter(new Date().toISOString().slice(0, 10), 30);
  const remindOn = userProfile.deadline ? dateAfter(userProfile.deadline, -45) : upcoming;
  const parentText = `PathMap 家庭沟通摘要\nTA目前关注：${profile.candidates.map(career => career.title).join('、') || '仍在探索'}\n硬性边界：${profile.boundaries.join('、') || '还在澄清'}\n验证方式：先做低成本体验，并于 ${upcoming} 复盘。\n可逆性：先不做大额投入与不可逆决定；如触及底线或成本超出预算，按退出条件暂停并重新选择。\n家庭支持：提供信息、时间和讨论空间，不用单次测评替TA做决定。`;
  return <div className="mx-auto max-w-5xl space-y-10 pb-16">
    <header><p className="eyebrow">04 / CONTINUITY</p><h1 className="mt-4 text-3xl font-semibold sm:text-4xl">让决定有人陪，也有地方回来。</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">计划、体验证据和复盘都留在你的浏览器中。先与家人或同行者对齐可逆边界，再决定是否需要真人协助。</p></header>
    {!storageAvailable && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">浏览器存储不可用，资产无法可靠保留；请勿关闭本页前忘记另存摘要。</p>}
    <section className="surface p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">30-DAY CHECKPOINT</p><h2 className="mt-2 text-xl font-semibold">节点与资产</h2></div><CalendarClock size={22} className="text-teal-700"/></div><div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">建议首次校准</p><p className="mt-2 text-lg font-semibold">{remindOn}</p><p className="mt-2 text-xs leading-5 text-slate-500">距决策节点约 45 天。仅在再次打开 PathMap 时提醒，不会后台推送。</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">计划复盘日</p><p className="mt-2 text-lg font-semibold">{upcoming}</p><p className="mt-2 text-xs text-slate-500">30 天测试复盘节点。</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-slate-400">微体验记录</p><p className="mt-2 text-lg font-semibold">{experiences.length} 份</p><p className="mt-2 text-xs text-slate-500">保存在此浏览器，可在本机回看。</p></div></div><button type="button" onClick={() => navigate('/review')} className="button-primary mt-6">进行四问复盘<ArrowRight size={16}/></button>
      {plan && <div className="mt-6 border-t border-slate-100 pt-5"><h3 className="text-sm font-semibold">本周行动</h3><div className="mt-3 space-y-2">{plan.tasks.flatMap(week => week.items.map(item => ({ id: `${week.week}:${item}`, label: item }))).map(task => { const checked = checkedTasks.includes(task.id); return <label key={task.id} className="flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-slate-50"><input type="checkbox" checked={checked} onChange={() => setCheckedTasks(current => checked ? current.filter(id => id !== task.id) : [...current, task.id])} className="mt-0.5 size-4 accent-teal-700"/><span className={checked ? 'text-sm text-slate-400 line-through' : 'text-sm text-slate-700'}>{task.label}</span></label>; })}</div><p className="mt-3 text-xs text-slate-500">完成 {done} 项 · 退出条件：{plan.exitConditions?.join('；')}</p></div>}
    </section>
    <div className="grid gap-5 lg:grid-cols-2"><section className="surface p-6 sm:p-8"><p className="eyebrow">MY PREFERENCE CARD</p><h2 className="mt-2 text-xl font-semibold">我的协作说明</h2><p className="mt-3 text-sm leading-6 text-slate-500">可在面试、求职沟通或自我复盘时使用。不是心理诊断，也不替你定义人格。</p><dl className="mt-5 space-y-3 text-sm"><div><dt className="text-xs text-slate-400">决策场景</dt><dd className="mt-1">{profile.scenario}</dd></div><div><dt className="text-xs text-slate-400">有动力的条件</dt><dd className="mt-1">{profile.preferences.join('、') || '继续探索'}</dd></div><div><dt className="text-xs text-slate-400">需要提前沟通的边界</dt><dd className="mt-1">{profile.boundaries.join('、') || '暂未设置'}</dd></div></dl><button type="button" onClick={() => download('PathMap-我的偏好说明.txt', plainText)} className="button-secondary mt-6"><Download size={16}/>下载说明卡</button></section>
    <section className="surface p-6 sm:p-8"><p className="eyebrow">FAMILY DISCUSSION</p><h2 className="mt-2 text-xl font-semibold">一份可逆的家庭摘要</h2><p className="mt-3 text-sm leading-6 text-slate-500">把讨论从“替我选”转向“如何低成本验证”，保留选择权与退出机制。</p><div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">{parentText.split('\n').slice(1).map(line => <p key={line}>{line}</p>)}</div><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => download('PathMap-家庭沟通摘要.txt', parentText)} className="button-primary"><Download size={16}/>下载摘要</button><button type="button" onClick={() => window.print()} className="button-secondary"><Printer size={16}/>打印</button></div></section></div>
    <section><div className="mb-5"><p className="eyebrow">HUMAN SUPPORT</p><h2 className="mt-2 text-xl font-semibold">让真实经验加入决策</h2><p className="mt-2 text-sm text-slate-500">以下为本地意向登记，不收集联系方式、不发起支付，也不会真实预约。</p></div><div className="grid gap-4 sm:grid-cols-2">{services.map(service => <article key={service.title} className="surface p-6"><div className="flex justify-between gap-4"><div><h3 className="font-semibold">{service.title}</h3><p className="mt-2 text-sm text-slate-500">{service.subtitle}</p></div><Handshake size={20} className="shrink-0 text-teal-700"/></div><p className="mt-4 text-xs leading-6 text-slate-600">{service.scope}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs text-slate-400">{service.duration} · {service.price}</span><button type="button" onClick={() => saveRequest('expert', service.title, service.scope)} className="button-secondary min-h-9 px-4 py-2">登记意向</button></div></article>)}</div><article className="surface mt-4 flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><UsersRound size={18} className="text-teal-700"/><h3 className="font-semibold">加入过来人校准网络 / 企业岗位画像</h3></div><p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">职场人可申请成为校准官；HR 可申请任务级岗位画像。当前只做角色意向登记和本地保存，审核、账号、数据共享与 B 端管理端尚未上线。</p></div><div className="flex gap-2"><button type="button" onClick={() => saveRequest('calibrator', '申请成为校准官', '申请角色：过来人校准官')} className="button-secondary">申请校准官</button><button type="button" onClick={() => saveRequest('hr', 'HR 岗位画像工具', '申请角色：HR 岗位画像试用')} className="button-primary">HR 试用意向</button></div></article>{requests.length > 0 && <div className="surface mt-4 p-5"><h3 className="text-sm font-semibold">本地服务意向记录</h3>{requests.map(request => <p key={request.id} className="mt-2 text-xs text-slate-500">{new Date(request.createdAt).toLocaleDateString()} · {request.title} · 仅本地保存</p>)}</div>}</section>
    <section className="surface p-6"><div className="flex items-center gap-3"><CircleHelpIcon/><h2 className="font-semibold">产品边界</h2></div><p className="mt-3 text-xs leading-6 text-slate-500">提醒目前只在你打开 PathMap 时显示；真人服务、HR 岗位画像和校准官网络尚未连接后端。此原型没有用户账号或云端同步，请下载重要摘要自行留存。</p></section>
    {notice && <p role="status" className="fixed bottom-5 right-5 z-50 rounded-full bg-slate-900 px-5 py-3 text-sm text-white shadow-lg">{notice}</p>}
  </div>;
}
function CircleHelpIcon() { return <Sparkles size={17} className="text-teal-700"/>; }
