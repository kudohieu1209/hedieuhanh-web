export type MemberId = 'member-1' | 'member-2' | 'member-3';

export interface Member {
  id: MemberId;
  name: string;
  studentId: string;
  email: string;
  role: string;
  avatarUrl: string;
  bio: string;
  focusAreas: string[];
  assignedFiles: string[];
  githubUsername?: string;
}

export type WeekStatus = 'not_started' | 'in_progress' | 'ready_to_report' | 'reported' | 'accepted';

export interface WeekChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignedMemberId?: MemberId | 'all';
}

export type ReportStatus = 'draft' | 'review' | 'approved' | 'submitted';

export interface TechnicalActivity {
  id: string;
  name: string; // e.g. Activity 1
  description: string;
  outputAndEvidence: string;
}

export interface MemberContribution {
  memberId: MemberId;
  assignedRole: string;
  technicalWork: string;
  outputsAchieved: string;
  completedTasksSummary: string;
  evidenceLinks: string;
}

export interface DevelopedCodeReview {
  algorithmicDevelopment: string;
  sourceCodeEnhanced: string;
  testingResult: string;
  commitOrPrLinks?: string;
}

export interface TodoSection {
  remainingIssues: string;
  nextPeriodTasks: string;
  milestone: string;
}

export interface WeeklyReport {
  id: string;
  weekNumber: number;
  reportPeriodFrom: string; // e.g. 13/10/2026
  reportPeriodTo: string; // e.g. 20/10/2026
  course: string;
  projectCode: string;
  projectTitle: string;
  designThinkingPage: string;
  taskManagementPage: string;
  status: ReportStatus;
  summaryOfProgress: string; // 200-300 words
  technicalActivities: TechnicalActivity[];
  contributions: {
    'member-1': MemberContribution;
    'member-2': MemberContribution;
    'member-3': MemberContribution;
  };
  codeReview: DevelopedCodeReview;
  todo: TodoSection;
  lecturerFeedback?: string;
  version: string;
  updatedBy: string;
  updatedAt: string;
}

export interface WeekRoadmap {
  weekNumber: number;
  title: string;
  subtitle: string;
  goals: string[];
  customReportDate: string; // YYYY-MM-DD
  status: WeekStatus;
  memberAssignments: {
    'member-1': string[];
    'member-2': string[];
    'member-3': string[];
  };
  deliverables: string[];
  checklist: WeekChecklistItem[];
  demoScript: string[];
  notes: string;
  lecturerFeedback: string;
  postReportRequests: string[];
  pdfUrl?: string;
  slideUrl?: string;
  report?: WeeklyReport;
  updatedAt: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  memberId: MemberId;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: MemberId | 'all';
  weekNumber: number;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  checklist: TaskChecklistItem[];
  codeFiles: string[];
  prOrCommitUrl?: string;
  proofOfCompletion?: string;
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

export type KnowledgeCategory = 'process_signal' | 'tty_layer' | 'shell_jobctl';
export type LearningState = 'unread' | 'read' | 'understood' | 'ready_to_defend';

export interface CodeSnippet {
  language: string;
  filename: string;
  code: string;
  highlightLines?: number[];
}

export interface KnowledgeTopic {
  id: string;
  category: KnowledgeCategory;
  title: string;
  shortSummary: string;
  explanation: string;
  terminology: { term: string; definition: string }[];
  codeSnippet?: CodeSnippet;
  githubLink?: string;
  diagram?: string;
  prerequisites: string[];
  selfCheckQuestions: string[];
  memberProgress: {
    [key in MemberId]: LearningState;
  };
}

export type QuestionType = 'theory' | 'code_reading' | 'flow' | 'edge_case' | 'counter_arg';
export type QuestionCategory = 'process_signal' | 'tty_layer' | 'shell_jobctl' | 'architecture' | 'testing';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionRating = 'untested' | 'not_understood' | 'understood' | 'confident';

export interface DefenseQuestion {
  id: string;
  question: string;
  type: QuestionType;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  suggestedAnswer: string;
  detailedExplanation: string;
  codeReference: string;
  author: string;
  tags: string[];
  memberRatings: {
    [key in MemberId]: QuestionRating;
  };
}

export type DocumentType = 
  | 'report_pdf' 
  | 'slide' 
  | 'research' 
  | 'diagram' 
  | 'demo_guide' 
  | 'reference' 
  | 'lecturer_notes';

export interface DocumentItem {
  id: string;
  title: string;
  type: DocumentType;
  weekNumber?: number;
  fileUrl: string;
  isExternalUrl: boolean;
  fileSize?: string;
  version: string;
  uploaderName: string;
  uploadedAt: string;
  notes?: string;
}

export type TestSuite = 
  | 'tty_modes' 
  | 'signals' 
  | 'proc_groups' 
  | 'job_control' 
  | 'pipeline' 
  | 'multi_tty' 
  | 'line_editor' 
  | 'regression';

export type TestStatus = 'pass' | 'fail' | 'pending';

export interface TestCase {
  id: string;
  suite: TestSuite;
  name: string;
  commandOrFunction: string;
  description: string;
  status: TestStatus;
  lastRunAt: string;
  executedBy: string;
  outputLog: string;
  githubActionsUrl?: string;
  relatedIssueId?: string;
}

export type BugSeverity = 'critical' | 'major' | 'minor';
export type BugStatus = 'open' | 'investigating' | 'resolved';

export interface BugItem {
  id: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  assigneeId: MemberId;
  relatedTestId?: string;
  stepsToReproduce: string;
  solutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface MeetingActionItem {
  id: string;
  text: string;
  assigneeId: MemberId;
  deadline: string;
  status: 'pending' | 'in_progress' | 'done';
}

export interface MeetingNote {
  id: string;
  weekNumber: number;
  date: string;
  presenter: string;
  attendeeNames: string[];
  reportedContent: string;
  lecturerQuestions: string[];
  lecturerFeedback: string;
  actionItems: MeetingActionItem[];
  status: 'completed' | 'pending_review';
}

export interface AppSettings {
  mode: 'demo' | 'team';
  currentMemberId: MemberId;
  theme: 'light' | 'dark' | 'system';
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  currentWeek: number;
  nextReportDate: string;
  githubRepoUrl: string;
}
