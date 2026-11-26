import type { AgentIntent, AgentSource, Career } from '../types';

export interface CareerKnowledge extends AgentSource {
  careerId: Career['id'];
  intent: Exclude<AgentIntent, 'handoff'>;
  keywords: string[];
  content: string;
  requiresHuman: boolean;
}

const asOf = '2026-11-21';
const sourceName = 'PathMap 职业卡演示资料（非外部调研）';
const common = (id: string, careerId: Career['id'], intent: CareerKnowledge['intent'], title: string, keywords: string[], content: string, requiresHuman = false): CareerKnowledge => ({ id, careerId, intent, title, keywords, content, sourceName, asOf, scope: 'MVP 情景样本；需以地区、岗位和年份重新核验', requiresHuman });

export const careerKnowledge: CareerKnowledge[] = [
  common('bio-scene','bioinformatics','overview','生物信息任务日常',['每天干嘛','日常','工作内容','真实工作','任务'], '日常样本包括测序质控、重复运行分析流程、环境排错，以及向实验团队解释结果。体验重点：能否接受排错、等待和重复质控。'),
  common('bio-pay','bioinformatics','salary','生物信息薪资区间',['薪资','工资','收入','薪水'], '当前演示卡片区间为月薪 10k–22k，未按城市、学历、岗位级别或年份统计。不能据此推算个人薪酬。', true),
  common('bio-demand','bioinformatics','market','生物信息市场条件',['就业','就业率','好找工作','前景','需求','招聘'], '演示资料提示研究与医疗数据场景可能有相关岗位，但机会受地区、学历、项目方向影响。此原型没有实时招聘数据或就业率样本。', true),
  common('bio-risk','bioinformatics','ai-risk','生物信息 AI 影响',['ai','人工智能','替代','风险'], '演示标签为“中”。流程自动化可能减少重复操作，但不能据此预测岗位消失或个人就业结果。'),
  common('bio-learning','bioinformatics','learning','生物信息交叉准备',['学习','技能','怎么准备','补救','交叉'], '演示路径建议补齐 Python / R 与统计基础，做一份可复现的公开数据分析，并能解释数据限制。具体课程或资格需按目标岗位核验。'),
  common('bio-qualification','bioinformatics','qualification','生物信息岗位门槛',['双非','本科','学历','门槛','学校'], '演示资料指出部分研发岗位要求研究生学历；不同岗位差异很大。应查看目标地区的原始招聘要求，不能仅凭学校标签判断结果。', true),
  common('media-scene','new-media-operations','overview','新媒体运营任务日常',['每天干嘛','日常','工作内容','真实工作','任务'], '日常样本包括追热点、改标题、剪辑、盯转化；内容可能多轮修改，数据表现需要复盘和解释。'),
  common('media-pay','new-media-operations','salary','新媒体运营薪资区间',['薪资','工资','收入','薪水'], '当前演示卡片区间为月薪 7k–16k，没有地区、级别或年度样本，不构成市场统计或个人薪酬承诺。', true),
  common('media-market','new-media-operations','market','新媒体运营市场条件',['就业','就业率','好找工作','前景','需求','招聘'], '演示资料显示执行类岗位场景较多，但平台变化快；能否连接内容与业务结果很关键。当前没有实时招聘数据或真实就业率。', true),
  common('media-risk','new-media-operations','ai-risk','新媒体运营 AI 影响',['ai','人工智能','替代','风险'], '演示标签为“极高”，用于表达内容生产流程的自动化暴露假设，不是岗位消失概率或经过实证校准的风险评分。'),
  common('media-learning','new-media-operations','learning','新媒体运营交叉准备',['学习','技能','怎么准备','补救','交叉'], '演示路径建议完成一组内容作品并复盘选题、耗时、转化和修改原因；也可尝试用户增长或内容策略交叉方向。'),
  common('media-qualification','new-media-operations','qualification','新媒体运营岗位门槛',['双非','本科','学历','门槛','学校'], '演示资料认为作品与复盘能帮助展示能力，但不包含雇主抽样数据。请逐条核实目标岗位招聘条件。', true),
  common('data-scene','data-analyst','overview','数据分析任务日常',['每天干嘛','日常','工作内容','真实工作','任务'], '日常样本包括重复跑数据、核对口径、维护报表；与业务确认“这个数怎么算”可能比建复杂模型更常见。'),
  common('data-pay','data-analyst','salary','数据分析薪资区间',['薪资','工资','收入','薪水'], '当前演示卡片区间为月薪 10k–24k，没有地区、级别或年份拆分，不构成市场统计或个人收入承诺。', true),
  common('data-market','data-analyst','market','数据分析市场条件',['就业','就业率','好找工作','前景','需求','招聘'], '演示资料认为基础报表自动化增加，业务问题定义和指标解释更重要；本原型没有实时岗位或市场增速数据。', true),
  common('data-risk','data-analyst','ai-risk','数据分析 AI 影响',['ai','人工智能','替代','风险'], '演示标签为“中”，表示基础报表与查询可能受自动化影响，不代表个人岗位替代概率。'),
  common('data-learning','data-analyst','learning','数据分析交叉准备',['学习','技能','怎么准备','补救','交叉'], '演示路径建议用公开数据练习 SQL、指标口径和业务建议，形成从问题到行动的完整案例。'),
  common('data-qualification','data-analyst','qualification','数据分析岗位门槛',['双非','本科','学历','门槛','学校'], '演示资料建议核对 SQL、行业案例及目标岗位要求；没有足够招聘样本来判断某类院校的录用率。', true),
];
