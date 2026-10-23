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
  const { data, currentMember, updateTask, addTask, deleteTask } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [mobileActiveColumn, setMobileActiveColumn] = useState<TaskStatus | 'all'>('all');

  // Modals & Active task
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  // Form for creating new task
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState<MemberId | 'all'>('member-1');
  const [newWeek, setNewWeek] = useState<number>(data.settings.currentWeek);
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDeadline, setNewDeadline] = useState('2026-10-27');
  const [newCodeFiles, setNewCodeFiles] = useState('kernel/proc.c');
  const [newChecklistText, setNewChecklistText] = useState('Viết mã nguồn ban đầu\nKiểm thử với QEMU\nChạy usertests xác nhận');

  // Column definitions
  const columns: { id: TaskStatus; label: string; color: string; badgeVariant: BadgeVariant }[] = [
    { id: 'todo', label: 'Cần làm', color: 'border-slate-400/40 bg-slate-500/5', badgeVariant: 'default' },
    { id: 'in_progress', label: 'Đang thực hiện', color: 'border-sky-500/40 bg-sky-500/5', badgeVariant: 'primary' },
    { id: 'review', label: 'Chờ kiểm tra', color: 'border-purple-500/40 bg-purple-500/5', badgeVariant: 'purple' },
    { id: 'done', label: 'Hoàn thành', color: 'border-emerald-500/40 bg-emerald-500/5', badgeVariant: 'success' },
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

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    updateTask({ ...task, status: newStatus });
    if (activeTask && activeTask.id === task.id) {
      setActiveTask({ ...activeTask, status: newStatus });
    }
  };

  const handleToggleSubtask = (task: Task, subtaskId: string) => {
    const updatedChecklist = task.checklist.map(item =>
      item.id === subtaskId ? { ...item, completed: !item.completed } : item
    );
    const updated = { ...task, checklist: updatedChecklist };
    updateTask(updated);
    if (activeTask && activeTask.id === task.id) {
      setActiveTask(updated);
    }
  };

  const handleAddComment = () => {
    if (!activeTask || !newCommentText.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      memberId: currentMember.id,
      authorName: currentMember.name,
      content: newCommentText.trim(),
      createdAt: new Date().toISOString()
    };
    const updated = {
      ...activeTask,
      comments: [...activeTask.comments, newComment]
    };
    updateTask(updated);
    setActiveTask(updated);
    setNewCommentText('');
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;

    const checklistItems: TaskChecklistItem[] = newChecklistText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((text, idx) => ({ id: `chk-${Date.now()}-${idx}`, text, completed: false }));

    const codeFilesList = newCodeFiles
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addTask({
      title: newTitle.trim(),
      description: newDesc.trim(),
      assigneeId: newAssignee,
      weekNumber: Number(newWeek),
      priority: newPriority,
      status: 'todo',
      deadline: newDeadline,
      checklist: checklistItems,
      codeFiles: codeFilesList,
      comments: []
    });

    setIsCreatingModal(false);
    // Reset form
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-sky-500" />
            Bảng Quản Lý Nhiệm Vụ (Kanban Board)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi tiến độ thực hiện từng nhiệm vụ theo 4 cột trạng thái, phân công thành viên và bằng chứng nghiệm thu
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreatingModal(true)}
        >
          Thêm nhiệm vụ mới
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, mô tả hoặc file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 sm:py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Filter Selects Grid on Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Member Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
            <span className="text-[11px] text-slate-400 sm:hidden">Người phụ trách:</span>
            <select
              value={selectedMemberFilter}
              onChange={(e) => setSelectedMemberFilter(e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="all">Tất cả thành viên</option>
              {data.members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Week Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
            <span className="text-[11px] text-slate-400 sm:hidden">Tuần:</span>
            <select
              value={selectedWeekFilter}
              onChange={(e) => setSelectedWeekFilter(e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="all">Tất cả 7 tuần</option>
              {data.weeks.map(w => (
                <option key={w.weekNumber} value={w.weekNumber.toString()}>Tuần {w.weekNumber}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-1.5">
            <span className="text-[11px] text-slate-400 sm:hidden">Độ ưu tiên:</span>
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="all">Tất cả độ ưu tiên</option>
              <option value="urgent">Khẩn cấp</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Column Tab Switcher */}
      <div className="md:hidden flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setMobileActiveColumn('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all ${
            mobileActiveColumn === 'all'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
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
              className={`px-2.5 py-1.5 rounded-lg font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                mobileActiveColumn === c.id
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{c.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-300/80 dark:bg-slate-700">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const isHiddenOnMobile = mobileActiveColumn !== 'all' && mobileActiveColumn !== col.id;
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-2xl border ${col.color} p-3.5 flex flex-col min-h-[400px] md:min-h-[500px] transition-colors ${
                isHiddenOnMobile ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    {col.label}
                  </h3>
                  <Badge variant={col.badgeVariant}>
                    {colTasks.length}
                  </Badge>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-4">
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
                        className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-sky-400 dark:hover:border-sky-700 shadow-xs hover:shadow-md transition-all cursor-pointer group"
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
                            <span className="text-[10px] font-mono font-medium text-slate-400">
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
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-500 transition-colors line-clamp-2 leading-relaxed">
                          {task.title}
                        </h4>

                        {/* Description snippet */}
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {task.description}
                        </p>

                        {/* Subtasks Progress */}
                        {task.checklist.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <CheckSquare className="w-3 h-3 text-sky-500" />
                              {completedSubtasks}/{task.checklist.length} checklist
                            </span>
                            <span>
                              {Math.round((completedSubtasks / task.checklist.length) * 100)}%
                            </span>
                          </div>
                        )}

                        {/* Footer: Assignee & Comments */}
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {assignee ? (
                              <img
                                src={assignee.avatarUrl}
                                alt={assignee.name}
                                title={assignee.name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-sky-500/40"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">Cả nhóm</span>
                            )}
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[80px]">
                              {assignee ? assignee.name.split(' ').slice(-1)[0] : 'Chung'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                            {task.comments.length > 0 && (
                              <span className="flex items-center gap-1">
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
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Trạng thái:</span>
                <select
                  value={activeTask.status}
                  onChange={(e) => handleStatusChange(activeTask, e.target.value as TaskStatus)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="todo">Cần làm</option>
                  <option value="in_progress">Đang thực hiện</option>
                  <option value="review">Chờ kiểm tra</option>
                  <option value="done">Hoàn thành</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Phụ trách:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {data.members.find(m => m.id === activeTask.assigneeId)?.name || 'Cả nhóm'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Mô tả công việc:</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {activeTask.description}
              </p>
            </div>

            {/* Subtasks Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                  Tiêu chí hoàn thành (Checklist):
                </h4>
                <span className="font-mono text-slate-400">
                  {activeTask.checklist.filter(c => c.completed).length}/{activeTask.checklist.length} xong
                </span>
              </div>
              <div className="space-y-1.5">
                {activeTask.checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2.5 p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleSubtask(activeTask, item.id)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700 mt-0.5"
                    />
                    <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Code files & Proof */}
            {activeTask.codeFiles && activeTask.codeFiles.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5">File code liên quan:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeTask.codeFiles.map((file, idx) => (
                    <a
                      key={idx}
                      href={`https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 font-mono text-[11px] hover:underline"
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
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                <span className="font-semibold block mb-0.5">Bằng chứng hoàn thành:</span>
                <p>{activeTask.proofOfCompletion}</p>
              </div>
            )}

            {/* Comments Section */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                <span>Trao đổi / Bình luận ({activeTask.comments.length})</span>
              </h4>

              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {activeTask.comments.length === 0 ? (
                  <p className="text-slate-400 text-[11px] italic">Chưa có bình luận nào.</p>
                ) : (
                  activeTask.comments.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sky-600 dark:text-sky-400">{c.authorName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{c.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add comment box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Bình luận với tư cách ${currentMember.name}...`}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                />
                <Button variant="primary" size="sm" onClick={handleAddComment}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => {
                  deleteTask(activeTask.id);
                  setActiveTask(null);
                }}
              >
                Xóa nhiệm vụ
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTask(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Thêm nhiệm vụ mới */}
      {isCreatingModal && (
        <Modal
          isOpen={isCreatingModal}
          onClose={() => setIsCreatingModal(false)}
          title="Tạo Nhiệm Vụ Mới"
          subtitle="Giao việc cho thành viên và đưa vào bảng Kanban"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Tiêu đề nhiệm vụ:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="VD: Kiểm thử tình huống EOF với Ctrl-D trong Cooked mode"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Mô tả chi tiết:</label>
              <textarea
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Mô tả cụ thể mục tiêu và kết quả kỳ vọng..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Người phụ trách:</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value as MemberId | 'all')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="all">Cả 3 thành viên</option>
                  {data.members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tuần đồ án:</label>
                <select
                  value={newWeek}
                  onChange={(e) => setNewWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {data.weeks.map(w => (
                    <option key={w.weekNumber} value={w.weekNumber}>Tuần {w.weekNumber}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Độ ưu tiên:</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Ưu tiên cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Hạn chót (Deadline):</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">File code liên quan (cách nhau bởi dấu phẩy):</label>
              <input
                type="text"
                value={newCodeFiles}
                onChange={(e) => setNewCodeFiles(e.target.value)}
                placeholder="kernel/console.c, user/sh.c"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Tiêu chí nghiệm thu (Mỗi dòng một checklist):</label>
              <textarea
                rows={3}
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsCreatingModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleCreateTask}>
                Tạo Nhiệm Vụ
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
