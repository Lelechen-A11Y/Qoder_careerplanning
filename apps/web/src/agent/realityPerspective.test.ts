import { describe, expect, it } from 'vitest';
import { realityPerspective } from './realityPerspective';
import { careers } from '../data/mockData';

describe('reality perspective adaptation', () => {
  it('labels the attribution and does not treat mock data as real research', () => {
    const text = realityPerspective(careers[0]);
    expect(text).toContain('不代表张雪峰本人');
    expect(text).toContain('演示样本');
    expect(text).toContain('可逆验证');
    expect(text).toContain('还需澄清');
  });
  it('uses voluntary constraints rather than assigning a family-based outcome', () => {
    const text = realityPerspective(careers[2], { major: '统计', stage: '大学', preferences: [], bottomLines: [], budget: 'low', weeklyHours: 3 });
    expect(text).toContain('3 小时');
    expect(text).toContain('不按家庭或学校背景判定个人上限');
  });
});
