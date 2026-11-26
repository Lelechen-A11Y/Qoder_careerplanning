import type { Career, ExperienceRecord, UserProfile } from '../types';
import { bottomLineLabels, careerDetails } from '../data/productData';
export function getConflicts(career: Career, bottomLines: string[]): string[] {
  return career.conflictTags.filter(tag => bottomLines.includes(tag)).map(tag => bottomLineLabels[tag] ?? tag);
}
export function assessCareer(career: Career, profile: UserProfile) {
  const detail = careerDetails[career.id];
  const matches = detail.preferences.filter(preference => profile.preferences.includes(preference));
  const conflicts = getConflicts(career, profile.bottomLines);
  return { career, conflicts, matches, eligible: conflicts.length === 0, score: matches.length,
    constraints: [profile.weeklyHours && profile.weeklyHours < detail.hours ? `当前每周可投入 ${profile.weeklyHours} 小时，建议将 ${detail.hours} 小时任务拆成两周完成` : `建议每周 ${detail.hours} 小时`, detail.qualification] };
}
export function reviewVerdict(crossed: string, evidence: string, energy: string): { title: string; description: string } {
  if (crossed === 'yes') return { title: '建议调整', description: '底线已被触及。先暂停新增投入，调整岗位条件或替代方向。排除不适合也是成功。' };
  if (crossed === 'uncertain' || evidence.trim().length < 15 || energy === 'drained') return { title: '建议补充验证', description: '现有证据不足或任务持续消耗精力。先补做一次低成本任务与一次访谈，再决定是否加码。' };
  return { title: '建议加码', description: '已有行动证据且未确认触碰底线。可以增加一次更接近真实工作的测试，仍保留退出条件。' };
}
export function experienceSummary(records: ExperienceRecord[], careerId: string) {
  return records.filter(record => record.careerId === careerId).at(-1);
}
export function dateAfter(date: string, days: number): string {
  const result = new Date(`${date.slice(0, 10)}T12:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}
