import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { Career, ExperienceRecord, LocalRequest, ReviewRecord, ThirtyDayPlan, UserProfile } from '../types';
import { getData, saveData } from '../utils/storage';

type Setter<T> = Dispatch<SetStateAction<T>>;
interface AppContextValue {
  userProfile: UserProfile; setUserProfile: Setter<UserProfile>;
  reviewRecords: ReviewRecord[]; setReviewRecords: Setter<ReviewRecord[]>;
  availableCareers: Career[]; setAvailableCareers: Setter<Career[]>;
  progress: number; setProgress: Setter<number>;
  selectedScenario: string; setSelectedScenario: Setter<string>;
  selectedCareerIds: string[]; setSelectedCareerIds: Setter<string[]>;
  experiences: ExperienceRecord[]; setExperiences: Setter<ExperienceRecord[]>;
  plan: ThirtyDayPlan | null; setPlan: Setter<ThirtyDayPlan | null>;
  requests: LocalRequest[]; setRequests: Setter<LocalRequest[]>;
  checkedTasks: string[]; setCheckedTasks: Setter<string[]>;
  storageAvailable: boolean;
}
const initial: UserProfile = { major: '', stage: '', bottomLines: [], preferences: [] };
const AppContext = createContext<AppContextValue | undefined>(undefined);
export function AppProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({ ...initial, ...getData<Partial<UserProfile>>('pathmap-profile', {}) }));
  const [reviewRecords, setReviewRecords] = useState<ReviewRecord[]>(() => getData('pathmap-reviews', []));
  const [availableCareers, setAvailableCareers] = useState<Career[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState(() => getData('pathmap-scenario', ''));
  const [selectedCareerIds, setSelectedCareerIds] = useState<string[]>(() => getData('pathmap-selection', []));
  const [experiences, setExperiences] = useState<ExperienceRecord[]>(() => getData('pathmap-experiences', []));
  const [plan, setPlan] = useState<ThirtyDayPlan | null>(() => getData('pathmap-30-day-plan', null));
  const [requests, setRequests] = useState<LocalRequest[]>(() => getData('pathmap-requests', []));
  const [checkedTasks, setCheckedTasks] = useState<string[]>(() => getData('pathmap-checked-tasks', []));
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    const results = [saveData('pathmap-profile', userProfile), saveData('pathmap-reviews', reviewRecords), saveData('pathmap-scenario', selectedScenario), saveData('pathmap-selection', selectedCareerIds), saveData('pathmap-experiences', experiences), saveData('pathmap-30-day-plan', plan), saveData('pathmap-requests', requests), saveData('pathmap-checked-tasks', checkedTasks)];
    setStorageAvailable(results.every(Boolean));
  }, [userProfile, reviewRecords, selectedScenario, selectedCareerIds, experiences, plan, requests, checkedTasks]);
  return <AppContext.Provider value={{ userProfile, setUserProfile, reviewRecords, setReviewRecords, availableCareers, setAvailableCareers, progress, setProgress, selectedScenario, setSelectedScenario, selectedCareerIds, setSelectedCareerIds, experiences, setExperiences, plan, setPlan, requests, setRequests, checkedTasks, setCheckedTasks, storageAvailable }}>{children}</AppContext.Provider>;
}
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
