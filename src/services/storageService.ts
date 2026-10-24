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

const STORAGE_KEY = 'xv6_hub_data_v5';

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

// DB Mappers: Chuẩn hóa snake_case từ Supabase sang camelCase TypeScript
const mapMemberFromDb = (m: any): Member => ({
  id: m.id,
  name: m.name,
  studentId: m.student_id || m.studentId || '',
  email: m.email,
  role: m.role,
  avatarUrl: m.avatar_url || m.avatarUrl || '',
  bio: m.bio || '',
  focusAreas: m.focus_areas || m.focusAreas || [],
  assignedFiles: m.assigned_files || m.assignedFiles || [],
  githubUsername: m.github_username || m.githubUsername,
});

const mapWeekFromDb = (w: any): WeekRoadmap => ({
  weekNumber: w.week_number ?? w.weekNumber,
  title: w.title,
  subtitle: w.subtitle,
  goals: w.goals || [],
  customReportDate: w.custom_report_date || w.customReportDate || '',
  status: w.status,
  memberAssignments: w.member_assignments || w.memberAssignments || {},
  deliverables: w.deliverables || [],
  checklist: w.checklist || [],
  demoScript: w.demo_script || w.demoScript || [],
  notes: w.notes,
  lecturerFeedback: w.lecturer_feedback || w.lecturerFeedback,
  postReportRequests: w.post_report_requests || w.postReportRequests || [],
  pdfUrl: w.pdf_url || w.pdfUrl,
  slideUrl: w.slide_url || w.slideUrl,
  report: w.report,
  updatedAt: w.updated_at || w.updatedAt || new Date().toISOString()
});

const mapTaskFromDb = (t: any): Task => ({
  id: t.id,
  title: t.title,
  description: t.description || '',
  assigneeId: t.assignee_id || t.assigneeId,
  weekNumber: t.week_number ?? t.weekNumber,
  priority: t.priority,
  status: t.status,
  deadline: t.deadline,
  checklist: t.checklist || [],
  codeFiles: t.code_files || t.codeFiles || [],
  prOrCommitUrl: t.pr_or_commit_url || t.prOrCommitUrl,
  proofOfCompletion: t.proof_of_completion || t.proofOfCompletion,
  comments: t.comments || [],
  createdAt: t.created_at || t.createdAt || new Date().toISOString(),
  updatedAt: t.updated_at || t.updatedAt || new Date().toISOString()
});

const mapDocumentFromDb = (d: any): DocumentItem => ({
  id: d.id,
  title: d.title,
  type: d.type,
  weekNumber: d.week_number ?? d.weekNumber,
  fileUrl: d.file_url || d.fileUrl || '',
  isExternalUrl: d.is_external_url ?? d.isExternalUrl ?? true,
  fileSize: d.file_size || d.fileSize,
  version: d.version,
  uploaderName: d.uploader_name || d.uploaderName || '',
  uploadedAt: d.uploaded_at || d.uploadedAt || new Date().toISOString(),
  notes: d.notes
});

const mapTestCaseFromDb = (t: any): TestCase => ({
  id: t.id,
  suite: t.suite,
  name: t.name,
  commandOrFunction: t.command_or_function || t.commandOrFunction || '',
  description: t.description || '',
  status: t.status,
  lastRunAt: t.last_run_at || t.lastRunAt,
  executedBy: t.executed_by || t.executedBy,
  outputLog: t.output_log || t.outputLog,
  githubActionsUrl: t.github_actions_url || t.githubActionsUrl,
  relatedIssueId: t.related_issue_id || t.relatedIssueId
});

const mapBugFromDb = (b: any): BugItem => ({
  id: b.id,
  title: b.title,
  description: b.description || '',
  severity: b.severity,
  status: b.status,
  assigneeId: b.assignee_id || b.assigneeId,
  relatedTestId: b.related_test_id || b.relatedTestId,
  stepsToReproduce: b.steps_to_reproduce || b.stepsToReproduce || '',
  solutionNote: b.solution_note || b.solutionNote,
  createdAt: b.created_at || b.createdAt || new Date().toISOString(),
  resolvedAt: b.resolved_at || b.resolvedAt
});

const mapMeetingFromDb = (m: any): MeetingNote => ({
  id: m.id,
  weekNumber: m.week_number ?? m.weekNumber,
  date: m.date,
  presenter: m.presenter,
  attendeeNames: m.attendee_names || m.attendeeNames || [],
  reportedContent: m.reported_content || m.reportedContent || '',
  lecturerQuestions: m.lecturer_questions || m.lecturerQuestions || [],
  lecturerFeedback: m.lecturer_feedback || m.lecturerFeedback || '',
  actionItems: m.action_items || m.actionItems || [],
  status: m.status
});

const mapSettingsFromDb = (s: any): AppSettings => ({
  mode: s.mode || 'team',
  currentMemberId: s.current_member_id || s.currentMemberId || 'member-1',
  theme: s.theme || 'dark',
  currentWeek: s.current_week ?? s.currentWeek ?? 6,
  nextReportDate: s.next_report_date || s.nextReportDate || '2026-10-27',
  githubRepoUrl: s.github_repo_url || s.githubRepoUrl || 'https://github.com/kudohieu1209/hedieuhanh-hust',
  supabaseUrl: s.supabase_url || s.supabaseUrl,
  supabaseAnonKey: s.supabase_anon_key || s.supabaseAnonKey
});

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
            members: membersData.map(mapMemberFromDb),
            weeks: (weeksData && weeksData.length > 0) ? weeksData.map(mapWeekFromDb) : local.weeks,
            tasks: (tasksData && tasksData.length > 0) ? tasksData.map(mapTaskFromDb) : local.tasks,
            knowledgeTopics: (knowledgeData && knowledgeData.length > 0) ? knowledgeData : local.knowledgeTopics,
            defenseQuestions: (questionsData && questionsData.length > 0) ? questionsData : local.defenseQuestions,
            documents: (documentsData && documentsData.length > 0) ? documentsData.map(mapDocumentFromDb) : local.documents,
            testCases: (testsData && testsData.length > 0) ? testsData.map(mapTestCaseFromDb) : local.testCases,
            bugs: (bugsData && bugsData.length > 0) ? bugsData.map(mapBugFromDb) : local.bugs,
            meetings: (meetingsData && meetingsData.length > 0) ? meetingsData.map(mapMeetingFromDb) : local.meetings,
            settings: settingsData ? mapSettingsFromDb(settingsData) : { ...local.settings, mode: 'team' }
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
