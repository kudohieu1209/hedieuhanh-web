import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  Users, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Sparkles,
  Bug,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';

export const DashboardPage: React.FC = () => {
  const { data, currentMember, overallProgress, taskStats, updateSettings } = useApp();
  const [editingDateModal, setEditingDateModal] = useState(false);
  const [newDateInput, setNewDateInput] = useState(data.settings.nextReportDate);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);

  // My Tasks
  const myTasks = data.tasks.filter(
    t => (t.assigneeId === currentMember.id || t.assigneeId === 'all') && t.status !== 'done'
  );

  // Recent PDF Report
  const recentReport = data.documents.find(d => d.type === 'report_pdf') || data.documents[0];

  // Weak spots (Questions where current member marked not_understood or untested)
  const weakQuestions = data.defenseQuestions.filter(
    q => q.memberRatings[currentMember.id] === 'not_understood'
  );

  // Open Bugs
  const openBugs = data.bugs.filter(b => b.status !== 'resolved');

  // Next week milestone
  const currentWeek = data.weeks.find(w => w.weekNumber === data.settings.currentWeek);

  const handleSaveNextReportDate = () => {
    updateSettings({ nextReportDate: newDateInput });
    setEditingDateModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Project Title & Quick Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-900/40 via-slate-900 to-indigo-950/40 border border-sky-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Đề tài #27 · Đại học Bách khoa Hà Nội
            </span>
            <span className="text-xs text-slate-400">Kỳ 2026.1</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            TTY Layer & Job Control trên xv6-riscv
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Hệ thống quản lý nghiên cứu, phân công 3 thành viên, thư viện kiến thức chuyên sâu và ngân hàng câu hỏi bảo vệ đồ án trước hội đồng.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 relative z-10 shrink-0">
          <Link to="/roadmap" className="w-full sm:w-auto">
            <Button variant="primary" icon={<Calendar className="w-4 h-4" />} className="w-full justify-center">
              Xem Lộ Trình 7 Tuần
            </Button>
          </Link>
          <a
            href={data.settings.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="outline" icon={<ExternalLink className="w-4 h-4" />} className="w-full justify-center">
              GitHub Repo
            </Button>
          </a>
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Current Week & Progress */}
        <Card hover className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Tuần Báo Cáo</span>
              <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-mono font-semibold">
                Tuần {data.settings.currentWeek}/7
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {overallProgress}%
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                tiến độ thực tế
              </span>
            </div>
            <Progress value={overallProgress} size="sm" className="mt-3" barColor="bg-gradient-to-r from-sky-500 to-emerald-500" />
            <p className="text-[11px] text-slate-400 mt-2 truncate">
              {currentWeek?.title}
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Tasks Status */}
        <Card hover>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Nhiệm Vụ Đồ Án</span>
              <CheckSquare className="w-4 h-4 text-sky-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {taskStats.completed}/{taskStats.total}
              </span>
              <span className="text-xs text-slate-400">hoàn thành</span>
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {taskStats.completed} xong
              </span>
              <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                {taskStats.inProgress} đang làm
              </span>
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                {taskStats.review} duyệt
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Next Report Date */}
        <Card hover>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Ngày Báo Cáo Kế Tiếp</span>
              <button
                onClick={() => setEditingDateModal(true)}
                className="text-sky-500 hover:text-sky-600 text-xs font-semibold hover:underline"
              >
                Đổi ngày
              </button>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {data.settings.nextReportDate}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Gặp GVHD: TS. Phạm Văn Tiến</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Defense Readiness */}
        <Card hover>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span>Sẵn Sàng Bảo Vệ</span>
              <GraduationCap className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {data.defenseQuestions.filter(q => q.memberRatings[currentMember.id] === 'confident').length}/{data.defenseQuestions.length}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">câu trả lời tốt</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Cần ôn lại:</span>
              <span className="font-semibold text-rose-500">{weakQuestions.length} câu</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): My Tasks & 3-Member Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Nhiệm vụ của người đang đăng nhập */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-sky-500" />
                  <span>Nhiệm vụ của tôi ({currentMember.name})</span>
                </CardTitle>
                <CardDescription>
                  Các đầu việc được giao cần xử lý trong tuần này
                </CardDescription>
              </div>
              <Link to="/tasks">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Xem Kanban
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80">
              {myTasks.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  Bạn đã hoàn thành tất cả nhiệm vụ được giao!
                </div>
              ) : (
                myTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            task.priority === 'urgent' ? 'danger' :
                            task.priority === 'high' ? 'warning' : 'default'
                          }
                        >
                          {task.priority === 'urgent' ? 'Khẩn cấp' : task.priority === 'high' ? 'Ưu tiên cao' : 'Thường'}
                        </Badge>
                        <span className="text-xs text-slate-400 font-mono">Tuần {task.weekNumber}</span>
                        {task.deadline && (
                          <span className="text-xs text-slate-400">· Hạn: {task.deadline}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Badge
                        variant={
                          task.status === 'in_progress' ? 'primary' :
                          task.status === 'review' ? 'purple' : 'default'
                        }
                      >
                        {task.status === 'in_progress' ? 'Đang làm' :
                         task.status === 'review' ? 'Chờ kiểm tra' : 'Cần làm'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Card: Bảng tiến độ 3 thành viên */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-500" />
                  <span>Tiến Độ 3 Thành Viên Nhóm</span>
                </CardTitle>
                <CardDescription>
                  Đánh giá phân công chuyên môn và mức độ sẵn sàng bảo vệ của từng người
                </CardDescription>
              </div>
              <Link to="/members">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Chi tiết hồ sơ
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="space-y-4">
              {data.members.map((member) => {
                // Calculate member progress
                const memberTasks = data.tasks.filter(t => t.assigneeId === member.id);
                const completedTasks = memberTasks.filter(t => t.status === 'done');
                const taskPct = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 100;
                
                // Knowledge readiness
                const readyTopics = data.knowledgeTopics.filter(k => k.memberProgress[member.id] === 'ready_to_defend').length;
                const readyQuestions = data.defenseQuestions.filter(q => q.memberRatings[member.id] === 'confident').length;

                return (
                  <div key={member.id} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/30"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {member.name}
                            <span className="text-[11px] font-mono text-slate-400 font-normal">
                              ({member.studentId})
                            </span>
                          </h4>
                          <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                          {taskPct}%
                        </span>
                        <div className="text-[10px] text-slate-400">nhiệm vụ xong</div>
                      </div>
                    </div>

                    <Progress value={taskPct} size="sm" className="my-2" barColor="bg-sky-500" />

                    <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs border-t border-slate-200/60 dark:border-slate-800/60 pt-2.5">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                          {completedTasks.length}/{memberTasks.length}
                        </div>
                        <div className="text-[10px] text-slate-400">Nhiệm vụ</div>
                      </div>
                      <div>
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                          {readyTopics}/{data.knowledgeTopics.length}
                        </div>
                        <div className="text-[10px] text-slate-400">Kiến thức vững</div>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-600 dark:text-purple-400 font-mono">
                          {readyQuestions}/{data.defenseQuestions.length}
                        </div>
                        <div className="text-[10px] text-slate-400">Vấn đáp tốt</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Latest PDF, Weak Spots & Active Bugs */}
        <div className="space-y-6">
          {/* Latest PDF Report */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-500" />
                <span>Báo Cáo PDF Gần Nhất</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentReport ? (
                <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {recentReport.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>Tuần {recentReport.weekNumber}</span>
                        <span>·</span>
                        <span>{recentReport.fileSize}</span>
                        <span>·</span>
                        <span>{recentReport.version}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedPdfUrl(recentReport.fileUrl)}
                    >
                      Xem Báo Cáo
                    </Button>
                    <Link to="/documents">
                      <Button variant="outline" size="sm">
                        Tất cả
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-sky-500/10">
                    <Link
                      to="/roadmap"
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center justify-between font-medium"
                    >
                      <span>Soạn báo cáo tiến độ Tuần {data.settings.currentWeek} (Mẫu HUST)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Chưa có file báo cáo nào.</p>
              )}
            </CardContent>
          </Card>

          {/* Weak Knowledge Spots */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Nội Dung Cần Ôn Lại</span>
              </CardTitle>
              <CardDescription>
                Các câu hỏi vấn đáp {currentMember.name} chưa tự tin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {weakQuestions.length === 0 ? (
                <div className="p-4 text-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1 opacity-80" />
                  Bạn không có câu hỏi nào bị đánh giá yếu!
                </div>
              ) : (
                weakQuestions.slice(0, 3).map((q) => (
                  <div key={q.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                      {q.question}
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-[11px]">
                      <span className="text-slate-400">{q.codeReference.split(':')[0]}</span>
                      <Link to="/questions" className="text-sky-500 hover:underline">
                        Ôn ngay →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Link to="/questions" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Mở Ngân Hàng Câu Hỏi ({data.defenseQuestions.length})
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Active Bugs Pending */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bug className="w-4 h-4 text-rose-500" />
                <span>Lỗi Đang Chờ Xử Lý</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {openBugs.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Không có lỗi nào đang mở. Hệ thống ổn định.
                </div>
              ) : (
                openBugs.map((bug) => (
                  <div key={bug.id} className="p-2.5 rounded-lg border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {bug.title}
                      </span>
                      <Badge variant="danger" dot>
                        {bug.severity}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {bug.description}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Link to="/tests" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Quản lý Kiểm thử & Lỗi
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Modal: Đổi ngày báo cáo tiếp theo */}
      <Modal
        isOpen={editingDateModal}
        onClose={() => setEditingDateModal(false)}
        title="Cập nhật Ngày Báo cáo Tiếp theo"
        subtitle="Thông tin sẽ được đồng bộ hiển thị lên bảng điều khiển nhóm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Chọn ngày hẹn gặp giảng viên (YYYY-MM-DD):
            </label>
            <input
              type="date"
              value={newDateInput}
              onChange={(e) => setNewDateInput(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setEditingDateModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSaveNextReportDate}>
              Lưu Ngày Báo Cáo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Xem PDF Báo Cáo */}
      <Modal
        isOpen={!!selectedPdfUrl}
        onClose={() => setSelectedPdfUrl(null)}
        title="Xem Báo Cáo Đồ Án"
        subtitle={recentReport?.title}
        maxWidth="4xl"
      >
        <div className="space-y-4">
          <div className="w-full h-[550px] bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center border border-slate-800 p-4">
            <iframe
              src={selectedPdfUrl || ''}
              className="w-full h-full rounded-lg"
              title="PDF Viewer"
            />
          </div>
          <div className="flex items-center justify-between">
            <a
              href={selectedPdfUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-500 hover:underline flex items-center gap-1 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Mở trong tab mới
            </a>
            <Button variant="secondary" onClick={() => setSelectedPdfUrl(null)}>
              Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
