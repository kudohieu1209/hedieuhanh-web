import { Task, TaskStatus, WeekRoadmap } from '../types';
import { INITIAL_WEEKS } from './initialWeeks';

// Mỗi việc trong phần phân công của một tuần (initialWeeks.ts) là một thẻ nhiệm vụ.
// Trạng thái suy ra từ trạng thái tuần; nhóm tự kéo thẻ khi làm xong.
const statusOf = (w: WeekRoadmap): TaskStatus =>
  w.status === 'reported' || w.status === 'accepted' ? 'done' : w.status === 'not_started' ? 'todo' : 'in_progress';

export const INITIAL_TASKS: Task[] = INITIAL_WEEKS.flatMap(w =>
  (Object.entries(w.memberAssignments) as [Task['assigneeId'], string[]][]).flatMap(([memberId, items]) =>
    items.map((title, i) => ({
      id: `task-w${w.weekNumber}-${memberId}-${i + 1}`,
      title,
      description: `Tuần ${w.weekNumber}: ${w.title}`,
      assigneeId: memberId,
      weekNumber: w.weekNumber,
      priority: 'medium' as const,
      status: statusOf(w),
      deadline: w.customReportDate,
      checklist: [],
      codeFiles: [],
      comments: [],
      createdAt: '2026-10-18T00:00:00Z',
      updatedAt: w.updatedAt
    }))
  )
);
