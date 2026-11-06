import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Code2, 
  ExternalLink, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Send,
  User,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge, BadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Task, TaskPriority, TaskStatus, MemberId, TaskChecklistItem } from '../types';

export const TasksPage: React.FC = () => {
  const { data } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [mobileActiveColumn, setMobileActiveColumn] = useState<TaskStatus | 'all'>('all');

  // Modals & Active task
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Column definitions
  const columns: { id: TaskStatus; label: string; color: string; badgeVariant: BadgeVariant }[] = [
    { id: 'todo', label: 'Cần làm', color: 'border-slate-300 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40', badgeVariant: 'default' },
    { id: 'in_progress', label: 'Đang thực hiện', color: 'border-amber-300 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20', badgeVariant: 'warning' },
    { id: 'review', label: 'Chờ kiểm tra', color: 'border-purple-300 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-950/20', badgeVariant: 'purple' },
    { id: 'done', label: 'Hoàn thành', color: 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20', badgeVariant: 'success' },
  ];

  // Filter tasks
  const filteredTasks = data.tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMember = selectedMemberFilter === 'all' || task.assigneeId === selectedMemberFilter || task.assigneeId === 'all';
    const matchesWeek = selectedWeekFilter === 'all' || task.weekNumber.toString() === selectedWeekFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || task.priority === selectedPriorityFilter;
    return matchesSearch && matchesMember && matchesWeek && matchesPriority;
  });


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800/80 pb-5">
        <div>
          <div className="ds-hero-badge mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-red-600" />
            <span>ĐIỀU PHỐI CÔNG VIỆC 3 THÀNH VIÊN</span>
          </div>
          <h1 className="ds-editorial-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Bảng Quản Lý Nhiệm Vụ <em>Kanban Workstation</em>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Việc của từng người theo lộ trình 7 tuần. Trạng thái tự cập nhật theo trạng thái của tuần.
          </p>
        </div>

      </div>

      {/* Filter Toolbar with Apple Pill Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 p-3.5 rounded-[22px] bg-white/80 dark:bg-[#111827]/80 border border-slate-200/90 dark:border-slate-800 text-xs shadow-apple">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, mô tả hoặc file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          />
        </div>

        {/* Filter Selects Grid on Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Member Filter */}
          <select
            value={selectedMemberFilter}
            onChange={(e) => setSelectedMemberFilter(e.target.value)}
            className="col-span-2 sm:col-span-1 w-full sm:w-auto px-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="all">Tất cả thành viên</option>
            {data.members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Week Filter */}
          <select
            value={selectedWeekFilter}
            onChange={(e) => setSelectedWeekFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="all">Tất cả 7 tuần</option>
            {data.weeks.map(w => (
              <option key={w.weekNumber} value={w.weekNumber.toString()}>Tuần {w.weekNumber}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="all">Tất cả độ ưu tiên</option>
            <option value="urgent">Khẩn cấp</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>
      </div>

      {/* Mobile Column Tab Switcher */}
      <div className="md:hidden flex items-center gap-1.5 p-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-x-auto text-xs no-scrollbar shadow-2xs">
        <button
          onClick={() => setMobileActiveColumn('all')}
          className={`px-3.5 py-1.5 rounded-full font-bold shrink-0 transition-all ${
            mobileActiveColumn === 'all'
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Tất cả ({filteredTasks.length})
        </button>
        {columns.map((c) => {
          const count = filteredTasks.filter(t => t.status === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setMobileActiveColumn(c.id)}
              className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                mobileActiveColumn === c.id
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{c.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4-Column Kanban Board as Apple macOS Workstation Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const isHiddenOnMobile = mobileActiveColumn !== 'all' && mobileActiveColumn !== col.id;
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-[22px] border ${col.color} p-4 flex flex-col min-h-[400px] md:min-h-[500px] shadow-apple-sm transition-all ${
                isHiddenOnMobile ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Column Header with macOS Traffic Lights */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="ds-mac-dots" aria-hidden="true">
                    <span className="ds-mac-dot ds-mac-dot-red" />
                    <span className="ds-mac-dot ds-mac-dot-yellow" />
                    <span className="ds-mac-dot ds-mac-dot-green" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 ml-1">
                    {col.label}
                  </h3>
                </div>
                <Badge variant={col.badgeVariant}>
                  {colTasks.length}
                </Badge>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl my-4">
                    Chưa có nhiệm vụ
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = data.members.find(m => m.id === task.assigneeId);
                    const completedSubtasks = task.checklist.filter(c => c.completed).length;

                    return (
                      <div
                        key={task.id}
                        onClick={() => setActiveTask(task)}
                        className="p-4 rounded-[20px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-red-400 dark:hover:border-red-700 shadow-2xs hover:shadow-apple transition-all cursor-pointer group hover:-translate-y-0.5"
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant={
                                task.priority === 'urgent' ? 'danger' :
                                task.priority === 'high' ? 'warning' : 'default'
                              }
                            >
                              {task.priority === 'urgent' ? 'Khẩn cấp' : task.priority === 'high' ? 'Ưu tiên' : 'Thường'}
                            </Badge>
                            <span className="text-[10px] font-mono font-bold text-slate-400">
                              T{task.weekNumber}
                            </span>
                          </div>

                          {task.deadline && (
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {task.deadline.slice(5)}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors line-clamp-2 leading-relaxed">
                          {task.title}
                        </h4>

                        {/* Description snippet */}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Subtasks Progress */}
                        {task.checklist.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <CheckSquare className="w-3 h-3 text-red-600" />
                              {completedSubtasks}/{task.checklist.length} checklist
                            </span>
                            <span className="font-mono font-bold">
                              {Math.round((completedSubtasks / task.checklist.length) * 100)}%
                            </span>
                          </div>
                        )}

                        {/* Footer: Assignee & Comments */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {assignee ? (
                              <img
                                src={assignee.avatarUrl}
                                alt={assignee.name}
                                title={assignee.name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-red-500/40"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold">Cả nhóm</span>
                            )}
                            <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold truncate max-w-[80px]">
                              {assignee ? assignee.name.split(' ').slice(-1)[0] : 'Chung'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                            {task.comments.length > 0 && (
                              <span className="flex items-center gap-1 font-mono">
                                <MessageSquare className="w-3 h-3" />
                                {task.comments.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail & Comments Sheet/Modal */}
      {activeTask && (
        <Modal
          isOpen={!!activeTask}
          onClose={() => setActiveTask(null)}
          title={activeTask.title}
          subtitle={`Nhiệm vụ Tuần ${activeTask.weekNumber} · Hạn: ${activeTask.deadline}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Status & Priority Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-400">Trạng thái:</span>
                <Badge variant={activeTask.status === 'done' ? 'success' : activeTask.status === 'in_progress' ? 'primary' : 'default'}>
                  {activeTask.status === 'done' ? 'Hoàn thành' : activeTask.status === 'in_progress' ? 'Đang thực hiện' : activeTask.status === 'review' ? 'Chờ kiểm tra' : 'Cần làm'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-400">Phụ trách:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {data.members.find(m => m.id === activeTask.assigneeId)?.name || 'Cả nhóm'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Mô tả công việc:</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                {activeTask.description}
              </p>
            </div>

            {/* Subtasks Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">
                  Tiêu chí hoàn thành (Checklist):
                </h4>
                <span className="font-mono text-slate-400 font-bold">
                  {activeTask.checklist.filter(c => c.completed).length}/{activeTask.checklist.length} xong
                </span>
              </div>
              <div className="space-y-1.5">
                {activeTask.checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      disabled
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-700 mt-0.5"
                    />
                    <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-semibold'}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Code files & Proof */}
            {activeTask.codeFiles && activeTask.codeFiles.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1.5">File code liên quan:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeTask.codeFiles.map((file, idx) => (
                    <a
                      key={idx}
                      href={`https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-red-700 dark:text-red-400 font-mono text-[11px] font-bold hover:underline"
                    >
                      <Code2 className="w-3 h-3" />
                      {file}
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Proof of completion */}
            {activeTask.proofOfCompletion && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                <span className="font-bold block mb-0.5">Bằng chứng hoàn thành:</span>
                <p className="font-medium">{activeTask.proofOfCompletion}</p>
              </div>
            )}


            {/* Footer Buttons */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" size="sm" onClick={() => setActiveTask(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
