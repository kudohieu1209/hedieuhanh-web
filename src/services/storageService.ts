import { 
  Member, 
  WeekRoadmap, 
  Task, 
  KnowledgeTopic, 
  DefenseQuestion, 
  DocumentItem, 
  TestCase, 
  BugItem, 
  MeetingNote, 
  AppSettings 
} from '../types';
import { INITIAL_MEMBERS } from '../data/initialMembers';
import { INITIAL_WEEKS } from '../data/initialWeeks';
import { INITIAL_TASKS } from '../data/initialTasks';
import { KNOWLEDGE_TOPICS } from '../data/knowledgeData';
import { DEFENSE_QUESTIONS } from '../data/questionsData';
import { INITIAL_TESTS, INITIAL_BUGS } from '../data/testsData';
import { INITIAL_DOCUMENTS } from '../data/documentsData';
import { INITIAL_MEETINGS } from '../data/meetingsData';
import { INITIAL_SETTINGS } from '../data/initialSettings';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { generateDraftReport } from './reportGenerator';

export interface AppData {
  members: Member[];
  weeks: WeekRoadmap[];
  tasks: Task[];
  knowledgeTopics: KnowledgeTopic[];
  defenseQuestions: DefenseQuestion[];
  documents: DocumentItem[];
  testCases: TestCase[];
  bugs: BugItem[];
  meetings: MeetingNote[];
  settings: AppSettings;
}

const STORAGE_KEY = 'xv6_hub_data_v3';

export const getInitialData = (): AppData => {
  const base: AppData = {
    members: INITIAL_MEMBERS,
    weeks: INITIAL_WEEKS,
    tasks: INITIAL_TASKS,
    knowledgeTopics: KNOWLEDGE_TOPICS,
    defenseQuestions: DEFENSE_QUESTIONS,
    documents: INITIAL_DOCUMENTS,
    testCases: INITIAL_TESTS,
    bugs: INITIAL_BUGS,
    meetings: INITIAL_MEETINGS,
    settings: INITIAL_SETTINGS,
  };

  // Populate reports for all 7 weeks based on the template
  base.weeks = base.weeks.map(w => {
    if (!w.report) {
      w.report = generateDraftReport(w.weekNumber, base);
    }
    return w;
  });

  return base;
};

export const loadAppData = async (): Promise<{ data: AppData; isRemote: boolean; error?: string }> => {
  const supabase = getSupabaseClient();

  // If Supabase is configured and in Team Mode, attempt to fetch from Supabase
  if (supabase && isSupabaseConfigured()) {
    try {
      const [
        { data: membersData },
        { data: weeksData },
        { data: tasksData },
        { data: knowledgeData },
        { data: questionsData },
        { data: documentsData },
        { data: testsData },
        { data: bugsData },
        { data: meetingsData },
        { data: settingsData }
      ] = await Promise.all([
        supabase.from('members').select('*'),
        supabase.from('weeks').select('*').order('week_number', { ascending: true }),
        supabase.from('tasks').select('*'),
        supabase.from('knowledge_topics').select('*'),
        supabase.from('questions').select('*'),
        supabase.from('documents').select('*'),
        supabase.from('test_cases').select('*'),
        supabase.from('bugs').select('*'),
        supabase.from('meetings').select('*'),
        supabase.from('settings').select('*').limit(1).maybeSingle()
      ]);

      if (membersData && membersData.length > 0) {
        const local = loadLocalData();
        return {
          data: {
            members: membersData || local.members,
            weeks: weeksData || local.weeks,
            tasks: tasksData || local.tasks,
            knowledgeTopics: knowledgeData || local.knowledgeTopics,
            defenseQuestions: questionsData || local.defenseQuestions,
            documents: documentsData || local.documents,
            testCases: testsData || local.testCases,
            bugs: bugsData || local.bugs,
            meetings: meetingsData || local.meetings,
            settings: {
              ...(settingsData || local.settings),
              mode: 'team'
            }
          },
          isRemote: true
        };
      }
    } catch (err: any) {
      console.warn('Supabase fetch failed, falling back to local storage:', err);
    }
  }

  // Fallback to localStorage (Demo Mode)
  return {
    data: loadLocalData(),
    isRemote: false
  };
};

export const loadLocalData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialData();
      saveLocalData(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    // Ensure backwards compatibility and default fields
    const initial = getInitialData();
    const loadedWeeks = (parsed.weeks || INITIAL_WEEKS).map((w: WeekRoadmap) => {
      if (!w.report) {
        w.report = generateDraftReport(w.weekNumber, initial);
      }
      return w;
    });

    return {
      members: parsed.members || INITIAL_MEMBERS,
      weeks: loadedWeeks,
      tasks: parsed.tasks || INITIAL_TASKS,
      knowledgeTopics: parsed.knowledgeTopics || KNOWLEDGE_TOPICS,
      defenseQuestions: parsed.defenseQuestions || DEFENSE_QUESTIONS,
      documents: parsed.documents || INITIAL_DOCUMENTS,
      testCases: parsed.testCases || INITIAL_TESTS,
      bugs: parsed.bugs || INITIAL_BUGS,
      meetings: parsed.meetings || INITIAL_MEETINGS,
      settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
    };
  } catch (e) {
    console.error('Error loading data from localStorage, resetting to initial data:', e);
    const initial = getInitialData();
    saveLocalData(initial);
    return initial;
  }
};

export const saveLocalData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export const resetLocalData = (): AppData => {
  const initial = getInitialData();
  saveLocalData(initial);
  return initial;
};

export const exportDataAsJson = (data: AppData): string => {
  return JSON.stringify(data, null, 2);
};

export const importDataFromJson = (jsonStr: string): AppData => {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.members || !parsed.weeks || !parsed.tasks) {
    throw new Error('Dữ liệu sao lưu không đúng định dạng xv6 Team Hub.');
  }
  saveLocalData(parsed);
  return parsed;
};
