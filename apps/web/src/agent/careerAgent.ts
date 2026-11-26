import { careerKnowledge, type CareerKnowledge } from '../data/agentKnowledge';
import { bottomLineLabels } from '../data/productData';
import type { AgentIntent, AgentMessage, AgentResponse, Career, UserProfile } from '../types';

const intentRules: Array<{ intent: Exclude<AgentIntent, 'handoff'>; terms: string[] }> = [
  { intent: 'salary', terms: ['薪资', '工资', '收入', '薪水', '多少钱'] },
  { intent: 'qualification', terms: ['双非', '本科', '学历', '门槛', '学校', '资格'] },
  { intent: 'market', terms: ['就业', '就业率', '好找工作', '前景', '需求', '招聘', '趋势'] },
  { intent: 'ai-risk', terms: ['ai', '人工智能', '替代', '自动化', '风险'] },
  { intent: 'learning', terms: ['学习', '技能', '怎么准备', '补救', '交叉', '作品'] },
  { intent: 'overview', terms: ['日常', '每天', '工作内容', '任务', '干嘛', '做什么'] },
];

export function classifyIntent(question: string): AgentIntent {
  const text = question.trim().toLocaleLowerCase();
  if (!text || /推荐.{0,8}(大学|院校|专业组合)|报哪所|保证.{0,8}(就业|薪资)|你觉得我适合|替我决定/.test(text)) return 'handoff';
  return intentRules.find(rule => rule.terms.some(term => text.includes(term)))?.intent ?? 'overview';
}

export function retrieveKnowledge(question: string, careerId: Career['id'], intent: AgentIntent, knowledge = careerKnowledge): CareerKnowledge[] {
  if (intent === 'handoff') return [];
  const candidates = knowledge.filter(item => item.careerId === careerId && item.intent === intent);
  const query = question.toLocaleLowerCase();
  const scored = candidates.map(item => ({ item, score: item.keywords.reduce((score, keyword) => score + (query.includes(keyword.toLocaleLowerCase()) ? Math.max(1, keyword.length) : 0), 0) }));
  return scored.filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map(item => item.item);
}

function getCareerConflicts(career: Career, profile?: UserProfile): string[] {
  return (profile?.bottomLines ?? []).filter(line => career.conflictTags.includes(line));
}

export function runCareerAgent(question: string, career: Career, profile?: UserProfile, history: AgentMessage[] = []): AgentResponse {
  const recent = history.slice(-10);
  const previousQuestion = [...recent].reverse().find(message => message.role === 'user')?.content ?? '';
  const followUp = question.length < 14 || /^(那|这个|它|还有|继续|具体呢|为什么)/.test(question.trim());
  const context = followUp ? previousQuestion : '';
  const directIntent = classifyIntent(question);
  const intent = directIntent === 'overview' && context ? classifyIntent(context) : directIntent;
  const retrievalQuery = `${question} ${context}`;
  const trace = ['识别问题意图', '按职业与意图检索演示知识库'];
  if (intent === 'handoff') {
    return { intent, answer: '这超出了本地职业资料能可靠回答的范围。我不会替你决定院校、专业，也不会保证薪资或就业结果。建议核对官方招生/招聘信息，或登记真人专家校准。', sources: [], trace: [...trace, '护栏命中：高影响决策 / 结果保证', '转人工校准'], handoff: true };
  }
  const evidence = retrieveKnowledge(retrievalQuery, career.id, intent);
  if (!evidence.length) {
    return { intent, answer: '当前职业资料里没有足够证据回答这个问题。我不会用模型常识补全结论。请补充地区、岗位级别等条件，或登记真人专家校准。', sources: [], trace: [...trace, '检索证据不足', '转人工校准'], handoff: true };
  }
  const source = evidence[0];
  const conflicts = getCareerConflicts(career, profile);
  const boundaryNote = conflicts.length ? `\n\n结合你记录的底线，这个方向触及：${conflicts.map(line => bottomLineLabels[line] ?? line).join('、')}。PathMap 将它作为风险提示，不替你做最终决定。` : '';
  const caveat = source.requiresHuman ? '\n\n这项资料缺少公开市场样本，不能作就业率、录用率或个人收入推断。需要最新结论时建议转真人核验。' : '';
  return {
    intent,
    answer: `${source.content}${boundaryNote}${caveat}`,
    sources: evidence.map(({ id, title, sourceName, asOf, scope }) => ({ id, title, sourceName, asOf, scope })),
    trace: [...trace, `召回 ${evidence.length} 条资料`, '输出约束检查：未作院校、适配度或结果保证', ...(source.requiresHuman ? ['没有可核验的市场样本：建议人工校准'] : [])],
    handoff: source.requiresHuman,
  };
}

export async function* streamLocalAnswer(answer: string, chunkSize = 18): AsyncGenerator<string> {
  const chunks = answer.match(new RegExp(`.{1,${chunkSize}}`, 'gu')) ?? [answer];
  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, 24));
    yield chunk;
  }
}
