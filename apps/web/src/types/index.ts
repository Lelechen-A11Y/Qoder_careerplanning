export interface UserProfile {
  major: string;
  stage: string;
  bottomLines: string[];
  preferences: string[];
  deadline?: string;
  subjects?: string;
  strengths?: string;
  scoreRange?: string;
  schoolTier?: string;
  budget?: string;
  weeklyHours?: number;
  decisionGoal?: string;
  workStyle?: string;
}

export interface Career {
  id: string;
  title: string;
  tasks: string[];
  salary: string;
  aiRisk: string;
  realScene: string;
  salaryMid: number;
  riskScore: number;
  conflictTags: string[];
  fallback: string;
  crossover: string;
  experiment: string[];
  expertAnswers: string[];
}

export interface ReviewRecord {
  careerId: string;
  status: 'ongoing' | 'completed';
  answers: string[];
  createdAt?: string;
  verdict?: string;
}

export interface ThirtyDayPlan {
  createdAt: string;
  careerIds: string[];
  milestones: { title: string; description: string; days: string }[];
  tasks: { week: string; items: string[] }[];
  exitConditions?: string[];
  reviewAt?: string;
  weeklyHours?: number;
}

export interface ExperienceRecord {
  careerId: string;
  output: string;
  energy: 'energized' | 'neutral' | 'drained';
  crossedBottomLine: boolean;
  createdAt: string;
}

export interface LocalRequest {
  id: string;
  kind: 'expert' | 'calibrator' | 'hr';
  title: string;
  detail: string;
  createdAt: string;
}

export type AgentIntent = 'overview' | 'salary' | 'market' | 'ai-risk' | 'learning' | 'qualification' | 'handoff';

export interface AgentSource {
  id: string;
  title: string;
  sourceName: string;
  asOf: string;
  scope: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  intent?: AgentIntent;
  sources?: AgentSource[];
  trace?: string[];
  handoff?: boolean;
}

export interface AgentResponse {
  answer: string;
  intent: AgentIntent;
  sources: AgentSource[];
  trace: string[];
  handoff: boolean;
}

export interface QuestionnaireOption {
  value: string;
  label: string;
}

export interface QuestionnaireQuestion {
  id: string;
  prompt: string;
  type: 'single' | 'multiple' | 'text';
  options?: QuestionnaireOption[];
}
