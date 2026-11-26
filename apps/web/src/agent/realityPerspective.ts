import type { Career, UserProfile } from '../types';
import { careerDetails } from '../data/productData';

/** Method-only adaptation. Upstream persona and factual claims are not executed. */
export function realityPerspective(career: Career, profile?: UserProfile): string {
  const detail = careerDetails[career.id];
  const missing = [!profile?.stage && '当前阶段', !profile?.budget && '可承受的试错预算', !profile?.weeklyHours && '每周可投入时间'].filter(Boolean);
  return [
    '现实校准视角 · 方法借鉴，不代表张雪峰本人或其背书。',
    '先验证日常与退出成本，再决定是否增加投入。',
    `① 就业倒推：先看具体任务——${career.realScene}`,
    '② 普通样本：现有资料是演示样本，没有经过核验的就业率、中位数薪资或地区统计，不能拿个别成功案例推断结果。',
    `③ 试错成本：${detail.cost}；${detail.exitCost}。${profile?.weeklyHours ? `你记录的每周时间为 ${profile.weeklyHours} 小时。` : ''}`,
    `④ 可逆验证：${detail.reversible}。`,
    missing.length ? `还需澄清：${missing.join('、')}。不必提供家庭身份或收入隐私，只需描述这次尝试可接受的成本。` : '已记录的条件只用于安排验证节奏，不按家庭或学校背景判定个人上限。',
  ].join('\n\n');
}
