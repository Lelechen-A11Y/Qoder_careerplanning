import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, SkipForward } from 'lucide-react';
import { useEffect, useState } from 'react';
const scenes = [
  { time: '选择之前', title: '志愿表有很多空格，', accent: '却没有“我想成为谁”。', text: '看起来每个专业都有前景，但那真的是我的生活吗？' },
  { time: '走到中途', title: '课程表已经排满，', accent: '方向感却一直缺席。', text: '不喜欢现在的专业，是否意味着只能推倒重来？' },
  { time: '面对下一步', title: '别人已经在出发，', accent: '我还站在岔路口。', text: '考研、考公、就业。能不能先试一次，再做决定？' },
];
export default function StoryIntro() {
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (!playing || finished || reduce) return;
    const timer = setTimeout(() => { if (scene === 2) { setFinished(true); setPlaying(false); } else setScene(scene + 1); }, 6000);
    return () => clearTimeout(timer);
  }, [playing, scene, finished, reduce]);
  return <div className="mx-auto mt-10 max-w-3xl text-center">
    <div className="mb-5 flex items-center justify-center gap-3"><span className="font-mono text-[10px] tracking-[.25em] text-teal-300">{scenes[scene].time} / 0{scene + 1}</span><button type="button" aria-label={playing ? '暂停故事' : '重播故事'} onClick={() => { if (finished) { setScene(0); setFinished(false); } setPlaying(!playing); }} className="rounded-full border border-white/15 p-2 text-slate-400 hover:text-white">{playing ? <Pause size={12} /> : <Play size={12} />}</button><button type="button" onClick={() => { setFinished(true); setPlaying(false); document.getElementById('scenario-cards')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }} className="flex items-center gap-1 text-xs text-slate-400">跳过<SkipForward size={12} /></button></div>
    <AnimatePresence mode="wait"><motion.div key={scene} initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><h1 className="text-3xl font-medium leading-[1.4] tracking-tight sm:text-5xl">{scenes[scene].title}<br /><span className="bg-gradient-to-r from-teal-100 to-sky-300 bg-clip-text text-transparent">{scenes[scene].accent}</span></h1><p className="mt-6 text-sm leading-7 text-slate-400">{scenes[scene].text}</p></motion.div></AnimatePresence>
    <div className="mt-7 flex justify-center gap-2">{scenes.map((item, index) => <button type="button" key={item.time} aria-label={`故事：${item.time}`} onClick={() => { setScene(index); setFinished(false); }} className={`h-1 rounded-full transition-all ${index === scene ? 'w-10 bg-teal-300' : 'w-4 bg-white/20'}`} />)}</div>
  </div>;
}
