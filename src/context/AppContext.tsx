import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Member, 
  MemberId, 
  WeekRoadmap, 
  Task, 
  KnowledgeTopic, 
  DefenseQuestion, 
  DocumentItem, 
  TestCase, 
  BugItem, 
  MeetingNote, 
  AppSettings,
  LearningState,
  QuestionRating
} from '../types';
import { 
  AppData, 
  loadAppData, 
  saveLocalData, 
  resetLocalData, 
  exportDataAsJson, 
  importDataFromJson,
  getInitialData 
} from '../services/storageService';
import { useToast } from './ToastContext';

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  isRemote: boolean;
  currentMember: Member;
  setCurrentMemberId: (id: MemberId) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Progress calculations
  overallProgress: number; // 0 to 100
  taskStats: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
    review: number;
  };
  // Mutations
  updateTask: (task: Task) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateWeek: (week: WeekRoadmap) => Promise<void>;
  updateKnowledgeProgress: (topicId: string, memberId: MemberId, state: LearningState) => Promise<void>;
  updateQuestionRating: (questionId: string, memberId: MemberId, rating: QuestionRating) => Promise<void>;
  addDefenseQuestion: (question: Omit<DefenseQuestion, 'id'>) => Promise<void>;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateTestCase: (testCase: TestCase) => Promise<void>;
  addBug: (bug: Omit<BugItem, 'id' | 'createdAt'>) => Promise<void>;
  updateBug: (bug: BugItem) => Promise<void>;
  updateMeeting: (meeting: MeetingNote) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  resetData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getInitialData());
  const [isLoading, setIsLoading] = useState(true);
  const [isRemote, setIsRemote] = useState(false);
  const toast = useToast();

  // Load data on mount
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const res = await loadAppData();
        if (mounted) {
          setData(res.data);
          setIsRemote(res.isRemote);
          // Apply theme
          applyTheme(res.data.settings.theme === 'light' ? 'light' : 'dark');
        }
      } catch (err) {
        console.error('Failed to load initial app data:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const applyTheme = (t: 'light' | 'dark') => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const toggleTheme = useCallback(() => {
    setData((prev) => {
      const nextTheme: 'light' | 'dark' = prev.settings.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      const next: AppData = {
        ...prev,
        settings: { ...prev.settings, theme: nextTheme }
      };
      saveLocalData(next);
      return next;
    });
  }, []);

  const setCurrentMemberId = useCallback((id: MemberId) => {
    setData((prev) => {
      const next = {
        ...prev,
        settings: { ...prev.settings, currentMemberId: id }
      };
      saveLocalData(next);
      return next;
    });
    toast.info(`Đã chuyển sang thành viên: ${data.members.find(m => m.id === id)?.name || id}`);
  }, [data.members, toast]);

  const currentMember = data.members.find(m => m.id === data.settings.currentMemberId) || data.members[0];

  // Dynamically calculate progress metrics
  const taskStats = {
    total: data.tasks.length,
    completed: data.tasks.filter(t => t.status === 'done').length,
    inProgress: data.tasks.filter(t => t.status === 'in_progress').length,
    blocked: data.bugs.filter(b => b.status === 'open' && b.severity === 'critical').length,
    review: data.tasks.filter(t => t.status === 'review').length,
  };

  // Overall progress is weighted from tasks (60%) and completed weeks (40%)
  const completedWeeks = data.weeks.filter(w => w.status === 'accepted' || w.status === 'reported').length;
  const taskProgress = taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 60 : 0;
  const weekProgress = (completedWeeks / 7) * 40;
  const overallProgress = Math.round(taskProgress + weekProgress);

  // Helper to persist state
  const persist = (nextData: AppData) => {
    setData(nextData);
    saveLocalData(nextData);
  };

  // Mutators
  const updateTask = async (task: Task) => {
    // Acceptance criteria check
    if (task.status === 'done') {
      const uncompletedChecklist = task.checklist.some(item => !item.completed);
      if (uncompletedChecklist) {
        toast.error('Không thể đánh dấu Hoàn thành khi các tiêu chí checklist con chưa được tích đủ!');
        return;
      }
    }

    const updatedTasks = data.tasks.map(t => t.id === task.id ? { ...task, updatedAt: new Date().toISOString() } : t);
    persist({ ...data, tasks: updatedTasks });
    toast.success(`Đã cập nhật nhiệm vụ: "${task.title}"`);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persist({ ...data, tasks: [newTask, ...data.tasks] });
    toast.success('Đã thêm nhiệm vụ mới vào Kanban!');
  };

  const deleteTask = async (taskId: string) => {
    persist({ ...data, tasks: data.tasks.filter(t => t.id !== taskId) });
    toast.info('Đã xóa nhiệm vụ.');
  };

  const updateWeek = async (week: WeekRoadmap) => {
    const updatedWeeks = data.weeks.map(w => w.weekNumber === week.weekNumber ? { ...week, updatedAt: new Date().toISOString() } : w);
    persist({ ...data, weeks: updatedWeeks });
    toast.success(`Đã lưu cập nhật cho Tuần ${week.weekNumber}: ${week.title}`);
  };

  const updateKnowledgeProgress = async (topicId: string, memberId: MemberId, state: LearningState) => {
    const updatedTopics = data.knowledgeTopics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          memberProgress: {
            ...topic.memberProgress,
            [memberId]: state
          }
        };
      }
      return topic;
    });
    persist({ ...data, knowledgeTopics: updatedTopics });
    const stateLabels: Record<LearningState, string> = {
      unread: 'Chưa đọc',
      read: 'Đã đọc',
      understood: 'Đã hiểu sâu',
      ready_to_defend: 'Sẵn sàng bảo vệ ★'
    };
    toast.success(`Tiến độ kiến thức: Đã cập nhật "${stateLabels[state]}"!`);
  };

  const updateQuestionRating = async (questionId: string, memberId: MemberId, rating: QuestionRating) => {
    const updatedQuestions = data.defenseQuestions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          memberRatings: {
            ...q.memberRatings,
            [memberId]: rating
          }
        };
      }
      return q;
    });
    persist({ ...data, defenseQuestions: updatedQuestions });
    const ratingLabels: Record<QuestionRating, string> = {
      untested: 'Chưa ôn',
      not_understood: 'Chưa hiểu rõ',
      understood: 'Đã hiểu đáp án',
      confident: 'Trả lời xuất sắc ★'
    };
    toast.success(`Đã lưu đánh giá: "${ratingLabels[rating]}"`);
  };

  const addDefenseQuestion = async (qData: Omit<DefenseQuestion, 'id'>) => {
    const newQ: DefenseQuestion = {
      ...qData,
      id: `q-${Date.now()}`
    };
    persist({ ...data, defenseQuestions: [newQ, ...data.defenseQuestions] });
    toast.success('Đã thêm câu hỏi mới vào ngân hàng vấn đáp!');
  };

  const addDocument = async (docData: Omit<DocumentItem, 'id' | 'uploadedAt'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString()
    };
    persist({ ...data, documents: [newDoc, ...data.documents] });
    toast.success('Đã lưu tài liệu mới thành công!');
  };

  const deleteDocument = async (id: string) => {
    persist({ ...data, documents: data.documents.filter(d => d.id !== id) });
    toast.info('Đã xóa tài liệu.');
  };

  const updateTestCase = async (testCase: TestCase) => {
    const updated = data.testCases.map(tc => tc.id === testCase.id ? testCase : tc);
    persist({ ...data, testCases: updated });
    toast.success(`Đã cập nhật bài test ${testCase.name}`);
  };

  const addBug = async (bugData: Omit<BugItem, 'id' | 'createdAt'>) => {
    const newBug: BugItem = {
      ...bugData,
      id: `bug-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    persist({ ...data, bugs: [newBug, ...data.bugs] });
    toast.success('Đã tạo báo cáo lỗi mới!');
  };

  const updateBug = async (bug: BugItem) => {
    const updated = data.bugs.map(b => b.id === bug.id ? bug : b);
    persist({ ...data, bugs: updated });
    toast.success(`Đã cập nhật trạng thái lỗi: "${bug.title}"`);
  };

  const updateMeeting = async (meeting: MeetingNote) => {
    const updated = data.meetings.map(m => m.id === meeting.id ? meeting : m);
    persist({ ...data, meetings: updated });
    toast.success('Đã lưu biên bản nhận xét báo cáo!');
  };

  const updateMember = async (member: Member) => {
    const updated = data.members.map(m => m.id === member.id ? member : m);
    persist({ ...data, members: updated });
    toast.success(`Đã cập nhật hồ sơ: ${member.name}`);
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = {
      ...data,
      settings: { ...data.settings, ...newSettings }
    };
    persist(updated);
    toast.success('Đã lưu cấu hình hệ thống!');
  };

  const resetData = () => {
    const initial = resetLocalData();
    setData(initial);
    toast.info('Đã khôi phục toàn bộ dữ liệu ban đầu của đồ án.');
  };

  const exportData = () => {
    return exportDataAsJson(data);
  };

  const importData = (jsonStr: string) => {
    try {
      const parsed = importDataFromJson(jsonStr);
      setData(parsed);
      toast.success('Đã nhập dữ liệu sao lưu thành công!');
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi nhập dữ liệu JSON');
    }
  };

  return (
    <AppContext.Provider
      value={{
        data,
        isLoading,
        isRemote,
        currentMember,
        setCurrentMemberId,
        theme: data.settings.theme === 'light' ? 'light' : 'dark',
        toggleTheme,
        overallProgress,
        taskStats,
        updateTask,
        addTask,
        deleteTask,
        updateWeek,
        updateKnowledgeProgress,
        updateQuestionRating,
        addDefenseQuestion,
        addDocument,
        deleteDocument,
        updateTestCase,
        addBug,
        updateBug,
        updateMeeting,
        updateMember,
        updateSettings,
        resetData,
        exportData,
        importData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
