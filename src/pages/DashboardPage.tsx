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
  CheckSquare,
  Terminal,
  Activity,
  Award,
  Layers
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Incident.io & Apple Editorial Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-2 pb-4 px-2 sm:px-4">
        {/* Eyebrow Badge */}
        <div className="ds-hero-badge mb-4">
          <Terminal className="w-3.5 h-3.5 text-sky-500" />
          <span>HUST · KỲ 2026.1 · ĐỀ TÀI #27</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="ds-editorial-headline text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white mb-4">
          Kiến trúc TTY Layer &amp; Job Control,<br />
          <em>bảo vệ đồ án hoàn hảo trước hội đồng.</em>
        </h1>

        {/* Editorial Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
          Nền tảng quản lý tiến độ 7 tuần, điều phối 3 thành viên, thư viện kiến thức chuyên sâu và ngân hàng câu hỏi vấn đáp cho sinh viên ĐHBK Hà Nội.
        </p>

        {/* Pill Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
          <Link to="/roadmap">
            <Button
              variant="primary"
              size="md"
              icon={<Calendar className="w-4 h-4" />}
            >
              Xem Lộ Trình 7 Tuần
            </Button>
          </Link>
          <Link to="/roadmap">
            <Button
              variant="secondary"
              size="md"
              icon={<FileText className="w-4 h-4 text-sky-500" />}
            >
              Báo Cáo Tiến Độ Tuần {data.settings.currentWeek}
            </Button>
          </Link>
          <a
            href={data.settings.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="secondary"
              size="md"
              icon={<ExternalLink className="w-4 h-4 text-slate-400" />}
            >
              GitHub Repository
            </Button>
          </a>
        </div>

        {/* Server & Project Status Ticker */}
        <div className="ds-server-ticker shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="ds-live-dot" />
            <span className="text-slate-500 dark:text-slate-400">xv6-riscv:</span>
            <strong className="text-slate-800 dark:text-slate-100 font-mono font-bold">TTY Ready</strong>
          </div>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400">Tiến độ thực tế:</span>
            <strong className="text-sky-600 dark:text-sky-400 font-mono font-bold">{overallProgress}%</strong>
          </div>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400">Giai đoạn:</span>
            <strong className="text-slate-800 dark:text-slate-100 font-bold">Tuần {data.settings.currentWeek} / 7</strong>
          </div>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 dark:text-slate-400">Đội ngũ:</span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">3 Thành viên sẵn sàng</strong>
          </div>
        </div>
      </section>

      {/* Grid: 4 Metric Cards as Apple macOS Windows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Current Week & Progress */}
        <Card 
          hover 
          trafficLights 
          macTitle="Tiến Độ Đồ Án" 
          macAction={
            <Badge variant="primary">Tuần {data.settings.currentWeek}/7</Badge>
          }
        >
          <CardContent className="p-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {overallProgress}%
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Khối lượng chuẩn
              </span>
            </div>
            <Progress value={overallProgress} size="sm" barColor="bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-500" />
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-3 truncate font-medium">
              {currentWeek?.title}
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Tasks Status */}
        <Card 
          hover 
          trafficLights 
          macTitle="Nhiệm Vụ Nhóm"
          macAction={
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              {taskStats.completed}/{taskStats.total}
            </span>
          }
        >
          <CardContent className="p-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {taskStats.completed}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                trên {taskStats.total} việc xong
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {taskStats.completed} xong
              </span>
              <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                {taskStats.inProgress} làm
              </span>
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                {taskStats.review} duyệt
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Next Report Date */}
        <Card 
          hover 
          trafficLights 
          macTitle="Lịch Gặp GVHD"
          macAction={
            <button
              onClick={() => setEditingDateModal(true)}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Đổi ngày
            </button>
          }
        >
          <CardContent className="p-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                {data.settings.nextReportDate}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>TS. Phạm Văn Tiến</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Defense Readiness */}
        <Card 
          hover 
          trafficLights 
          macTitle="Vấn Đáp Bảo Vệ"
          macAction={
            <Badge variant="purple">25+ câu</Badge>
          }
        >
          <CardContent className="p-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {data.defenseQuestions.filter(q => q.memberRatings[currentMember.id] === 'confident').length}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">câu vững vàng</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Cần ôn lại:</span>
              <span className="font-bold text-rose-500 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50">
                {weakQuestions.length} câu
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): My Tasks & 3-Member Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Nhiệm vụ của người đang đăng nhập */}
          <Card 
            trafficLights 
            macTitle={`Nhiệm Vụ Của Tôi — ${currentMember.name}`}
            macAction={
              <Link to="/tasks">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Kanban
                </Button>
              </Link>
            }
          >
            <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Các đầu việc ưu tiên cần hoàn thiện và bàn giao trước buổi báo cáo tuần
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {myTasks.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  Bạn đã hoàn thành tất cả nhiệm vụ được giao!
                </div>
              ) : (
                myTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge
                          variant={
                            task.priority === 'urgent' ? 'danger' :
                            task.priority === 'high' ? 'warning' : 'default'
                          }
                        >
                          {task.priority === 'urgent' ? 'Khẩn cấp' : task.priority === 'high' ? 'Ưu tiên cao' : 'Thường'}
                        </Badge>
                        <span className="text-xs text-slate-400 font-mono font-medium">Tuần {task.weekNumber}</span>
                        {task.deadline && (
                          <span className="text-xs text-slate-400">· Hạn: {task.deadline}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
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
            </div>
          </Card>

          {/* Card: Bảng tiến độ 3 thành viên */}
          <Card 
            trafficLights 
            macTitle="Tiến Độ 3 Thành Viên Nhóm"
            macAction={
              <Link to="/members">
                <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Hồ sơ
                </Button>
              </Link>
            }
          >
            <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Theo dõi khối lượng nhiệm vụ, độ vững kiến thức và kỹ năng vấn đáp bảo vệ
              </p>
            </div>

            <CardContent className="space-y-4 p-5">
              {data.members.map((member) => {
                // Calculate member progress
                const memberTasks = data.tasks.filter(t => t.assigneeId === member.id);
                const completedTasks = memberTasks.filter(t => t.status === 'done');
                const taskPct = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 100;
                
                // Knowledge readiness
                const readyTopics = data.knowledgeTopics.filter(k => k.memberProgress[member.id] === 'ready_to_defend').length;
                const readyQuestions = data.defenseQuestions.filter(q => q.memberRatings[member.id] === 'confident').length;

                return (
                  <div key={member.id} className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 shadow-2xs hover:shadow-xs transition-all">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-500/30"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            {member.name}
                            <span className="text-[11px] font-mono text-slate-400 font-normal">
                              ({member.studentId})
                            </span>
                          </h4>
                          <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold font-mono text-slate-900 dark:text-slate-100">
                          {taskPct}%
                        </span>
                        <div className="text-[10px] text-slate-400 font-medium">hoàn thành</div>
                      </div>
                    </div>

                    <Progress value={taskPct} size="sm" className="my-2.5" barColor="bg-gradient-to-r from-sky-500 to-cyan-400" />

                    <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {completedTasks.length}/{memberTasks.length}
                        </div>
                        <div className="text-[10px] text-slate-400">Nhiệm vụ</div>
                      </div>
                      <div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {readyTopics}/{data.knowledgeTopics.length}
                        </div>
                        <div className="text-[10px] text-slate-400">Kiến thức vững</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-600 dark:text-purple-400 font-mono">
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
          <Card 
            trafficLights 
            macTitle="Báo Cáo Tiến Độ Gần Nhất"
          >
            <CardContent className="p-5">
              {recentReport ? (
                <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 shadow-2xs">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {recentReport.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="font-semibold text-sky-600 dark:text-sky-400">Tuần {recentReport.weekNumber}</span>
                        <span>·</span>
                        <span>{recentReport.fileSize}</span>
                        <span>·</span>
                        <span>{recentReport.version}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedPdfUrl(recentReport.fileUrl)}
                    >
                      Xem Báo Cáo
                    </Button>
                    <Link to="/documents">
                      <Button variant="secondary" size="sm">
                        Tất cả
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-sky-500/10">
                    <Link
                      to="/roadmap"
                      className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center justify-between font-semibold"
                    >
                      <span>Soạn báo cáo Tuần {data.settings.currentWeek} (Mẫu Word HUST)</span>
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
          <Card 
            trafficLights 
            macTitle="Nội Dung Cần Ôn Lại"
            macAction={
              <Badge variant="warning">{weakQuestions.length} câu</Badge>
            }
          >
            <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Các câu hỏi vấn đáp {currentMember.name} chưa tự tin
              </p>
            </div>
            <CardContent className="space-y-2.5 p-5">
              {weakQuestions.length === 0 ? (
                <div className="p-4 text-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1 opacity-80" />
                  Bạn không có câu hỏi nào bị đánh giá yếu!
                </div>
              ) : (
                weakQuestions.slice(0, 3).map((q) => (
                  <div key={q.id} className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 text-xs bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {q.question}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-[11px]">
                      <span className="text-slate-400 font-mono">{q.codeReference.split(':')[0]}</span>
                      <Link to="/questions" className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
                        Ôn ngay →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Link to="/questions" className="w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  Mở Ngân Hàng Câu Hỏi ({data.defenseQuestions.length})
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Active Bugs Pending */}
          <Card 
            trafficLights 
            macTitle="Lỗi Đang Chờ Xử Lý"
            macAction={
              <Badge variant={openBugs.length > 0 ? "danger" : "success"}>
                {openBugs.length > 0 ? `${openBugs.length} lỗi` : "0 lỗi"}
              </Badge>
            }
          >
            <CardContent className="space-y-2.5 p-5">
              {openBugs.length === 0 ? (
                <div className="p-4 text-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                  Không có lỗi nào đang mở. xv6 usertests ALL PASSED!
                </div>
              ) : (
                openBugs.map((bug) => (
                  <div key={bug.id} className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {bug.title}
                      </span>
                      <Badge variant="danger" dot>
                        {bug.severity}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {bug.description}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter>
              <Link to="/tests" className="w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  Quản lý Kiểm thử &amp; Lỗi
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Chọn ngày hẹn gặp giảng viên (YYYY-MM-DD):
            </label>
            <input
              type="date"
              value={newDateInput}
              onChange={(e) => setNewDateInput(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setEditingDateModal(false)}>
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
          <div className="w-full h-[550px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-slate-800 p-2 shadow-inner">
            <iframe
              src={selectedPdfUrl || ''}
              className="w-full h-full rounded-xl"
              title="PDF Viewer"
            />
          </div>
          <div className="flex items-center justify-between">
            <a
              href={selectedPdfUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-500 hover:underline flex items-center gap-1 font-semibold"
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
