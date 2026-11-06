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
  const { data, overallProgress, taskStats } = useApp();

  // Nhiệm vụ tuần hiện tại của cả nhóm (web không có đăng nhập nên không có "của tôi")
  const weekTasks = data.tasks.filter(
    t => t.weekNumber === data.settings.currentWeek && t.status !== 'done'
  );
  const memberOf = (id: string) => data.members.find(m => m.id === id);

  // Next week milestone
  const currentWeek = data.weeks.find(w => w.weekNumber === data.settings.currentWeek);


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
        <h1 className="ds-editorial-headline text-[28px] leading-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white mb-4">
          TTY Layer &amp; Job Control
        </h1>

        {/* Editorial Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
          Quản lý tiến độ 7 tuần
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Metric 1: Current Week & Progress */}
        <Card 
          hover 
          trafficLights 
          macTitle="Tiến Độ Đồ Án" 
          macAction={
            <Badge variant="primary">Tuần {data.settings.currentWeek}/7</Badge>
          }
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
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
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
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
          macTitle="Lịch Báo Cáo"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-lg sm:text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                {data.settings.nextReportDate}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>TS. Phạm Văn Tiến</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: tài liệu ôn tập có trong web */}
        <Link to="/questions" className="block">
          <Card
            hover
            trafficLights
            macTitle="Ôn Tập Bảo Vệ"
            className="h-full"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {data.defenseQuestions.length}
                </span>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold text-right">câu hỏi vấn đáp</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Chủ đề kiến thức:</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{data.knowledgeTopics.length}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div>
        {/* Nhiệm vụ tuần + tiến độ 3 thành viên: cạnh nhau trên màn hình rộng */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* Card: nhiệm vụ tuần hiện tại của cả nhóm */}
          <Card 
            trafficLights 
            macTitle={`Nhiệm Vụ Tuần ${data.settings.currentWeek}`}
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
                Các việc của cả nhóm chưa xong, cần bàn giao trước buổi báo cáo tuần
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {weekTasks.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  Cả nhóm đã xong các nhiệm vụ của tuần này!
                </div>
              ) : (
                weekTasks.slice(0, 6).map((task) => (
                  <div key={task.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {(() => {
                          const m = memberOf(task.assigneeId);
                          return (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                              {m && <img src={m.avatarUrl} alt="" className="w-4 h-4 rounded-full" />}
                              {m ? m.name : 'Cả nhóm'}
                            </span>
                          );
                        })()}
                        {task.deadline && (
                          <span className="text-xs text-slate-400">· Hạn: {task.deadline}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 sm:truncate">
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
                Số việc được giao trong lộ trình 7 tuần và tiến độ của từng người
              </p>
            </div>

            <CardContent className="space-y-4 p-5">
              {data.members.map((member) => {
                // Calculate member progress
                const memberTasks = data.tasks.filter(t => t.assigneeId === member.id);
                const completedTasks = memberTasks.filter(t => t.status === 'done');
                const taskPct = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 100;
                const doingTasks = memberTasks.filter(t => t.status === 'in_progress' || t.status === 'review');

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
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{completedTasks.length}</div>
                        <div className="text-[10px] text-slate-400">Đã xong</div>
                      </div>
                      <div>
                        <div className="font-bold text-sky-600 dark:text-sky-400 font-mono">{doingTasks.length}</div>
                        <div className="text-[10px] text-slate-400">Đang làm</div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 font-mono">{memberTasks.length}</div>
                        <div className="text-[10px] text-slate-400">Tổng việc</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

      </div>


    </div>
  );
};
