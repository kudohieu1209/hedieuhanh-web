import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Code2, 
  CheckSquare, 
  BookOpen, 
  GraduationCap, 
  ExternalLink, 
  Edit3, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Terminal,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import { Member, MemberId, LearningState } from '../types';

export const MembersPage: React.FC = () => {
  const { data, currentMember, setCurrentMemberId, updateMember, updateKnowledgeProgress } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState<MemberId>(currentMember.id);
  const [editingModal, setEditingModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Member>(currentMember);

  const selectedMember = data.members.find(m => m.id === selectedMemberId) || data.members[0];

  // Assigned tasks
  const memberTasks = data.tasks.filter(t => t.assigneeId === selectedMember.id || t.assigneeId === 'all');
  const completedTasks = memberTasks.filter(t => t.status === 'done');
  const taskPct = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 100;

  // Knowledge topics status
  const memberTopics = data.knowledgeTopics;
  const readyTopicsCount = memberTopics.filter(t => t.memberProgress[selectedMember.id] === 'ready_to_defend').length;
  const understoodTopicsCount = memberTopics.filter(t => t.memberProgress[selectedMember.id] === 'understood').length;
  const readTopicsCount = memberTopics.filter(t => t.memberProgress[selectedMember.id] === 'read').length;

  // Questions answered poorly
  const poorlyAnsweredQuestions = data.defenseQuestions.filter(
    q => q.memberRatings[selectedMember.id] === 'not_understood'
  );
  const confidentQuestions = data.defenseQuestions.filter(
    q => q.memberRatings[selectedMember.id] === 'confident'
  );

  const handleOpenEdit = () => {
    setEditFormData({ ...selectedMember });
    setEditingModal(true);
  };

  const handleSaveEdit = () => {
    updateMember(editFormData);
    setEditingModal(false);
  };

  const learningStateLabels: Record<LearningState, { label: string; color: string }> = {
    unread: { label: 'Chưa đọc', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    read: { label: '1. Đã đọc', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    understood: { label: '2. Đã hiểu', color: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
    ready_to_defend: { label: '3. Sẵn sàng bảo vệ ★', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-500" />
            Quản Lý 3 Thành Viên Nhóm Đồ Án
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Phân công chuyên môn rạch ròi, theo dõi file phụ trách và mức độ sẵn sàng bảo vệ của từng cá nhân
          </p>
        </div>

        {/* Member Selector Tabs */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
          {data.members.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMemberId(m.id)}
              className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                m.id === selectedMember.id
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <img
                src={m.avatarUrl}
                alt={m.name}
                className="w-5 h-5 rounded-full object-cover shrink-0"
              />
              <span className="truncate">{m.name.split(' ').slice(-1)[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Member Profile Banner */}
      <Card className="p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-950 text-white border-slate-800">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={selectedMember.avatarUrl}
              alt={selectedMember.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-sky-500/30 shadow-xl shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {selectedMember.name}
                </h2>
                <Badge variant="primary">
                  MSSV: {selectedMember.studentId}
                </Badge>
                {selectedMember.id === currentMember.id && (
                  <Badge variant="success">
                    Đang đăng nhập
                  </Badge>
                )}
              </div>
              <p className="text-sm font-semibold text-sky-400 mt-1">
                {selectedMember.role}
              </p>
              <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {selectedMember.bio}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {selectedMember.email}
                </span>
                {selectedMember.githubUsername && (
                  <a
                    href={`https://github.com/${selectedMember.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    @{selectedMember.githubUsername}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-end gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              icon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={handleOpenEdit}
              className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700"
            >
              Sửa hồ sơ
            </Button>
            {selectedMember.id !== currentMember.id && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentMemberId(selectedMember.id)}
              >
                Đổi làm người dùng chính
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Grid: 3 Metric Cards for this Member */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover>
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Tiến độ Nhiệm vụ được giao
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {completedTasks.length}/{memberTasks.length}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">{taskPct}% hoàn thành</span>
            </div>
            <Progress value={taskPct} size="sm" className="mt-2" barColor="bg-sky-500" />
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Bài học sẵn sàng bảo vệ
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {readyTopicsCount}/{memberTopics.length}
              </span>
              <span className="text-xs text-slate-400">chủ đề kiến thức</span>
            </div>
            <div className="flex gap-2 mt-2 text-[11px] text-slate-500">
              <span>{understoodTopicsCount} đã hiểu</span>
              <span>·</span>
              <span>{readTopicsCount} đã đọc</span>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Điểm tự tin vấn đáp
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
                {confidentQuestions.length}/{data.defenseQuestions.length}
              </span>
              <span className="text-xs text-slate-400">câu trả lời tốt</span>
            </div>
            <div className="mt-2 text-[11px] text-rose-500 font-medium">
              {poorlyAnsweredQuestions.length} câu cần ôn lại kỹ
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Code Files & Focus Areas vs Knowledge & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 Col): Code Files & Focus Areas */}
        <div className="space-y-6">
          {/* Assigned Code Files */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4 text-sky-500" />
                <span>Mã nguồn phụ trách chính</span>
              </CardTitle>
              <CardDescription>
                Thành viên phải đọc hiểu từng dòng trong các file này
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedMember.assignedFiles.map((file, idx) => (
                <a
                  key={idx}
                  href={`https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:border-sky-300 dark:hover:border-sky-800 transition-all text-xs font-mono group"
                >
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate">
                    <Terminal className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span className="truncate">{file}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 shrink-0" />
                </a>
              ))}
            </CardContent>
          </Card>

          {/* Focus Areas */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-500" />
                <span>Nội dung chuyên môn bắt buộc</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {selectedMember.focusAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Questions answered poorly */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-rose-500">
                <AlertTriangle className="w-4 h-4" />
                <span>Câu hỏi vấn đáp chưa tốt ({poorlyAnsweredQuestions.length})</span>
              </CardTitle>
              <CardDescription>
                Cần luyện tập trước buổi bảo vệ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {poorlyAnsweredQuestions.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Thành viên này trả lời tốt mọi câu hỏi đã ôn.</p>
              ) : (
                poorlyAnsweredQuestions.map((q) => (
                  <div key={q.id} className="p-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 text-xs">
                    <p className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                      {q.question}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Tham khảo: {q.codeReference}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (2 Cols): Learning Topics Progress & Assigned Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Topics & Progress State Picker */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-500" />
                    <span>Tiến độ 12 Chủ Đề Kiến Thức Bắt Buộc</span>
                  </CardTitle>
                  <CardDescription>
                    Cập nhật trạng thái tự học của {selectedMember.name} theo 3 mức độ
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {memberTopics.map((topic) => {
                const state = topic.memberProgress[selectedMember.id] || 'unread';

                return (
                  <div
                    key={topic.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={topic.category === 'process_signal' ? 'primary' : topic.category === 'tty_layer' ? 'warning' : 'purple'}>
                          {topic.category === 'process_signal' ? 'Process & Signal' : topic.category === 'tty_layer' ? 'TTY Layer' : 'Shell & Job Control'}
                        </Badge>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {topic.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {topic.shortSummary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={state}
                        onChange={(e) => updateKnowledgeProgress(topic.id, selectedMember.id, e.target.value as LearningState)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 ${learningStateLabels[state].color}`}
                      >
                        <option value="unread">Chưa đọc</option>
                        <option value="read">1. Đã đọc</option>
                        <option value="understood">2. Đã hiểu</option>
                        <option value="ready_to_defend">3. Sẵn sàng bảo vệ ★</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Assigned Tasks for this member */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-sky-500" />
                <span>Nhiệm vụ được giao ({memberTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {memberTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={task.status === 'done' ? 'success' : task.status === 'in_progress' ? 'primary' : 'default'}>
                        {task.status === 'done' ? 'Xong' : task.status === 'in_progress' ? 'Đang làm' : 'Cần làm'}
                      </Badge>
                      <span className="font-mono text-slate-400">Tuần {task.weekNumber}</span>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {task.title}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                    {task.deadline}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Sửa Hồ Sơ */}
      {editingModal && (
        <Modal
          isOpen={editingModal}
          onClose={() => setEditingModal(false)}
          title={`Sửa Hồ Sơ: ${selectedMember.name}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Họ và tên:</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Mã số sinh viên (MSSV):</label>
              <input
                type="text"
                value={editFormData.studentId}
                onChange={(e) => setEditFormData({ ...editFormData, studentId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Vai trò & Chuyên môn:</label>
              <input
                type="text"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email liên hệ:</label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Giới thiệu trách nhiệm:</label>
              <textarea
                rows={3}
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setEditingModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Lưu Hồ Sơ
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
