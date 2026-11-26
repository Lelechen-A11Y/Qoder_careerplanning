import type { Career, QuestionnaireQuestion } from '../types';

// 情景样本：非统计数据，问答是预设模拟内容。
export const expertQuestions = ['这个方向真实就业情况怎么样？', '双非本科好找工作吗？', '入行后最容易后悔什么？'];
export const careers: Career[] = [
  {
    id: 'bioinformatics', title: '生物信息分析师', salary: '月薪 10k–22k', salaryMid: 16, aiRisk: '中', riskScore: 50,
    realScene: '上午盯着测序质控报告排查异常，下午重复跑分析流程；最花时间的经常是环境报错和解释结果。',
    tasks: ['重复跑数据与质控', '维护 Python / R 分析流程', '向实验团队解释结果'], conflictTags: ['boring'],
    fallback: '先看科研助理、实验数据整理岗位，用已有生物背景建立第一段项目经历。',
    crossover: '补齐 Python / R 与统计基础，尝试生物数据分析和临床数据管理的交叉岗位。',
    experiment: ['第 1–7 天：找一份公开表达数据，读懂字段与分析目的。', '第 8–20 天：完成清洗、质控和差异分析，记录重复劳动的感受。', '第 21–30 天：写两页结果解释，请一位相关从业者挑错。'],
    expertAnswers: ['别把会跑工具当成能就业。先看本地岗位要的是研发、分析还是售后支持，很多岗位还会看学历和项目方向。', '本科不是自动出局，但一份课程作业很难说明问题。拿一个能复现、能解释限制的项目，比堆工具名更有说服力。', '以为每天都在发现新东西，实际上排错、等流程、重跑数据占了不少时间。先完整做一次公开数据项目，看看你能不能接受。'],
  },
  {
    id: 'new-media-operations', title: '新媒体运营', salary: '月薪 7k–16k', salaryMid: 11.5, aiRisk: '极高', riskScore: 92,
    realScene: '追热点、改标题、剪视频、盯转化；一条内容改五版很常见，效果不好时还要解释为什么。',
    tasks: ['写文案并反复改稿', '追踪热点与内容排期', '复盘流量和转化数据'], conflictTags: ['copywriting', 'long-overtime'],
    fallback: '从内容执行或社群助理切入，先验证自己是否能承受持续产出与反馈压力。',
    crossover: '把内容能力与数据分析结合，尝试用户增长、内容策略或商业化运营。',
    experiment: ['第 1–7 天：选择一个主题，拆解 10 条同类内容。', '第 8–20 天：独立发布 5 条内容，记录制作耗时与反馈。', '第 21–30 天：复盘一次失败内容，提出可验证的改进假设。'],
    expertAnswers: ['岗位名字一样，工作可能天差地别。有的做品牌，有的实际是销售获客，面试一定问清考核指标和资源。', '作品通常比学校标签更容易让人看见。准备真实内容和复盘，别只拿阅读量截图，要说清你具体做了什么。', '最容易后悔的是喜欢表达，却不喜欢被数据考核。AI 能快速生成初稿，但选题、核实和对业务负责还是人的事。'],
  },
  {
    id: 'data-analyst', title: '数据分析师', salary: '月薪 10k–24k', salaryMid: 17, aiRisk: '中', riskScore: 55,
    realScene: '每天重复跑数据、核对口径、维护报表；做模型的时间，可能比跟业务确认“这个数怎么算”少。',
    tasks: ['重复跑数据与维护报表', '用 SQL 排查指标异常', '沟通业务口径与行动建议'], conflictTags: ['boring'],
    fallback: '从业务运营、报表支持岗位出发，积累对指标与业务流程的理解。',
    crossover: '结合专业选择垂直行业，把 SQL、可视化和业务分析串成完整案例。',
    experiment: ['第 1–7 天：选一份公开业务数据，定义三个决策问题。', '第 8–20 天：用 SQL 清洗与分析，重复更新一次报表。', '第 21–30 天：写一页业务建议，找人质疑指标口径。'],
    expertAnswers: ['不是学完 SQL 就有岗位等你。先分清数据开发、商业分析和报表岗位，要求差得很远，别把培训宣传当招聘现实。', '会受部分岗位筛选条件影响，但可以挑懂业务的切入口。用行业案例展示从问题到结论的过程，别只展示漂亮图表。', '以为每天做高级模型，结果大半时间在对数。最有价值的往往是问对问题，而不是把图做得更复杂。'],
  },
];
export const questionnaire: QuestionnaireQuestion[] = [
  { id: 'work-values', prompt: '下一份选择，你最想守住什么？', type: 'multiple', options: [
    { value: 'stability', label: '可预期的稳定' }, { value: 'growth', label: '持续学习与成长' },
    { value: 'income', label: '有竞争力的收入' }, { value: 'autonomy', label: '自主与创造空间' },
  ] },
  { id: 'interests', prompt: '哪些活动，常让你愿意多花一点时间？', type: 'multiple', options: [
    { value: 'research', label: '研究信息，寻找原因' }, { value: 'social', label: '与人沟通，提供帮助' },
    { value: 'practical', label: '动手尝试，做出作品' }, { value: 'structure', label: '整理细节，建立秩序' },
  ] },
  { id: 'work-style', prompt: '哪一种工作日常，更接近你？', type: 'single', options: [
    { value: 'deep-focus', label: '独立专注，把一个问题钻透' }, { value: 'collaboration', label: '与人协作，在交流中推进事情' }, { value: 'varied', label: '任务多样，不断遇到新挑战' },
  ] },
  { id: 'bottom-lines', prompt: '最后，哪些代价你不愿承受？', type: 'multiple', options: [
    { value: 'boring', label: '无法忍受枯燥' }, { value: 'copywriting', label: '受不了写文案' },
    { value: 'long-overtime', label: '无法接受长期加班' }, { value: 'frequent-travel', label: '无法接受频繁出差' },
  ] },
];
