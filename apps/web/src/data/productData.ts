import type { Career } from '../types';
export const bottomLineLabels: Record<string, string> = { boring: '无法忍受枯燥', copywriting: '受不了写文案', 'long-overtime': '无法接受长期加班', 'frequent-travel': '无法接受频繁出差' };
export const preferenceLabels: Record<string, string> = { stability: '稳定', growth: '成长', income: '收入', autonomy: '自主创造', research: '研究探索', social: '沟通协作', practical: '动手实践', structure: '清晰结构' };
export const scenarios = [
  { id: 'high-school', title: '高三填志愿', goal: '先看专业通向的真实任务', action: '比较两份课程表、访谈在读学生，再做一次专业入门任务。', stage: '高中阶段' },
  { id: 'college', title: '专业补救 / 大学迷茫', goal: '找到现有专业的交叉出口', action: '保留学业基本盘，用作品与实践验证跨方向，而非先决定退学或转专业。', stage: '大学阶段' },
  { id: 'choice', title: '考研 / 考公 / 就业', goal: '比较备考与就业的机会成本', action: '核对报考资格与时间线，同时保留求职材料。这里的岗位卡用于验证就业备选，不预测录取。', stage: '求职准备中' },
  { id: 'working', title: '已工作，但不对劲', goal: '分清岗位不适与职业不适', action: '先在业余时间做一次任务体验，区分团队、岗位与行业问题，保留现金流。', stage: '已工作' },
];
interface CareerDetail {
  demand: string; salaryCurve: number[]; drain: string; exitCost: string; reversible: string;
  preferences: string[]; hours: number; cost: string; qualification: string;
  microTask: { minutes: number; brief: string; material: string; steps: string[]; deliverable: string };
}
export const careerDetails: Record<Career['id'], CareerDetail> = {
  bioinformatics: {
    demand: '研究与医疗数据场景有需求，受地区、学历与项目方向影响明显', salaryCurve: [10, 16, 22], drain: '长时间专注、代码排错、统计理解、重复质控', exitCost: '中等：领域学习投入较多，数据技能可迁移', reversible: '先用 30 天公开数据项目验证；未验证前不购买长期培训', preferences: ['growth', 'research', 'structure'], hours: 5, cost: '公开数据 + 免费工具；先投入 0–200 元', qualification: '部分研发岗位要求研究生学历，需逐个核实招聘条件',
    microTask: { minutes: 20, brief: '做一次测序样本质控判断', material: '样本 A：有效读段 92%，重复率 12%\n样本 B：有效读段 56%，重复率 48%\n样本 C：有效读段 89%，重复率 15%\n练习规则：有效读段 < 80% 或重复率 > 30% 需要排查。', steps: ['按练习规则识别异常样本', '写出需要进一步确认的两条信息', '用非技术语言向实验同事解释下一步'], deliverable: '输出异常判断、证据和下一步排查建议，100 字左右。' },
  },
  'new-media-operations': {
    demand: '执行岗位多，平台变化快；能连接内容与业务结果更重要', salaryCurve: [7, 11, 16], drain: '持续输出、反复改稿、反馈压力、临时热点', exitCost: '较低：作品与渠道经验可迁移，但要避免只熟悉单平台', reversible: '先做 5 条内容；两周后评估是否愿意持续产出', preferences: ['autonomy', 'social', 'practical'], hours: 3, cost: '手机 + 免费编辑工具；先投入 0 元', qualification: '需作品与复盘能力，具体门槛以岗位要求为准',
    microTask: { minutes: 15, brief: '为校园旧书交换活动设计内容', material: '对象：大学生。目标：让 20 人报名。限制：无预算，不夸大价值。活动：周六下午图书馆门口，带一本书即可交换。', steps: ['写一个不夸大的标题和 80 字正文', '设计一个清楚的报名行动指引', '假设阅读量高但无人报名，提出一个改进点'], deliverable: '提交标题、正文、行动指引和改进假设。' },
  },
  'data-analyst': {
    demand: '基础报表趋于自动化，业务问题定义与指标解释更重要', salaryCurve: [10, 17, 24], drain: '反复核对口径、清洗数据、沟通争议、维护报表', exitCost: '中低：SQL 与业务理解可迁移到运营和商业分析', reversible: '用公开数据做一次完整分析；先验证口径沟通与重复维护', preferences: ['income', 'research', 'structure'], hours: 4, cost: '表格 / SQL 在线工具；先投入 0 元', qualification: '基础 SQL 与业务案例是切入口，不保证岗位可及性',
    microTask: { minutes: 20, brief: '分析一次活动的真实转化', material: '上周：访问 1000 人，报名 100 人，付费 20 人。\n本周：访问 1500 人，报名 90 人，付费 18 人。\n有人说：流量涨了 50%，活动很成功。', steps: ['分别计算两周访问到报名的转化率', '判断是否能仅凭流量增长宣布成功', '列出一个需要补充的数据和一个行动建议'], deliverable: '写出两个转化率、结论、缺失信息与建议。' },
  },
};
export const services = [
  { title: '1 对 1 行业校准', subtitle: '把岗位滤镜交给真实经验校准', scope: '讨论岗位日常、入行条件和一个具体困惑；不承诺 offer 或录取。', duration: '45 分钟', price: '演示服务 · 未开放支付' },
  { title: '30 天测试陪跑', subtitle: '每周对行动证据做一次校准', scope: '明确测试目标、检查作品、复盘退出条件；服务尚未上线。', duration: '每周一次', price: '演示服务 · 未开放支付' },
];
