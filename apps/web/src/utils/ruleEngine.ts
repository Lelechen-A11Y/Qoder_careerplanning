import type { Career, UserProfile } from '../types';

const bottomLineTaskKeywords: Record<string, string[]> = {
  boring: ['重复', '枯燥'],
  copywriting: ['文案', '写作'],
  'long-overtime': ['加班', '高强度'],
  'low-income': ['低收入', '收入低'],
  'high-uncertainty': ['不稳定', '不确定'],
  'no-growth': ['缺少成长', '没有成长', '无发展'],
  'frequent-travel': ['出差', '异地'],
};

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

export function filterCareersByBottomLines(
  careers: Career[],
  userBottomLines: string[],
): Career[] {
  const bottomLines = userBottomLines.map(normalize).filter(Boolean);
  if (bottomLines.length === 0) return careers;

  return careers.filter((career) => {
    const tasks = career.tasks.map(normalize);

    return !bottomLines.some((bottomLine) => {
      const keywords = bottomLineTaskKeywords[bottomLine] ?? [bottomLine];
      return keywords.some((keyword) =>
        tasks.some((task) => task.includes(normalize(keyword)) || normalize(keyword).includes(task)),
      );
    });
  });
}

export function calculateProgress(userProfile: UserProfile): number {
  const fields = [
    Boolean(userProfile.major.trim()),
    Boolean(userProfile.stage.trim()),
    userProfile.bottomLines.length > 0,
    userProfile.preferences.length > 0,
  ];

  const completedFields = fields.filter(Boolean).length;
  return Math.round((completedFields / fields.length) * 100);
}
