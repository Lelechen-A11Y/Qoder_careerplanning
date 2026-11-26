import { describe, expect, it } from 'vitest';
import { careers } from '../data/mockData';
import { classifyIntent, retrieveKnowledge, runCareerAgent } from './careerAgent';

describe('career agent intent routing', () => {
  it('routes market, salary, qualification and learning questions', () => {
    expect(classifyIntent('这个方向真实就业率怎么样？')).toBe('market');
    expect(classifyIntent('薪资范围大概是多少？')).toBe('salary');
    expect(classifyIntent('双非本科能进这个岗位吗？')).toBe('qualification');
    expect(classifyIntent('双非本科好找工作吗？')).toBe('qualification');
    expect(classifyIntent('我应该学习哪些技能？')).toBe('learning');
  });

  it('retrieves only records for the chosen career and intent', () => {
    const records = retrieveKnowledge('双非本科好找工作吗', 'data-analyst', 'qualification');
    expect(records).toHaveLength(1);
    expect(records[0].careerId).toBe('data-analyst');
    expect(records[0].intent).toBe('qualification');
  });

  it('refuses high-impact admission and outcome guarantees', () => {
    const result = runCareerAgent('直接告诉我报哪所大学，并保证毕业能就业', careers[0]);
    expect(result.handoff).toBe(true);
    expect(result.intent).toBe('handoff');
    expect(result.sources).toHaveLength(0);
    expect(result.answer).toContain('不会替你决定');
  });

  it('does not invent a market answer when retrieval has no evidence', () => {
    const result = runCareerAgent('这个职业明年在成都会招多少人', careers[0]);
    expect(result.handoff).toBe(true);
    expect(result.answer).toContain('没有足够证据');
  });

  it('uses the recent turn for a short follow-up and applies bottom-line context', () => {
    const result = runCareerAgent('那具体呢？', careers[2], { major: '统计学', stage: '大学阶段', preferences: [], bottomLines: ['boring'] }, [
      { id: 'q1', role: 'user', content: '数据分析师每天干嘛？', createdAt: '2026-11-21' },
    ]);
    expect(result.intent).toBe('overview');
    expect(result.answer).toContain('无法忍受枯燥');
    expect(result.sources[0].sourceName).toContain('非外部调研');
  });
});
