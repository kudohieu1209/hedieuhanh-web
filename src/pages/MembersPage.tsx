import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
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
import { MemberId } from '../types';

export const MembersPage: React.FC = () => {
  const { data } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState<MemberId>('member-1');

  const selectedMember = data.members.find(m => m.id === selectedMemberId) || data.members[0];

  // Assigned tasks
  const memberTasks = data.tasks.filter(t => t.assigneeId === selectedMember.id || t.assigneeId === 'all');
  const completedTasks = memberTasks.filter(t => t.status === 'done');
  const taskPct = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 100;

  // Chủ đề kiến thức theo phần phụ trách: Hiếu = TTY, Hoàng = Process & Signal, Tuấn Anh = Shell
  const CATEGORY_OF: Record<MemberId, string> = {
    'member-1': 'tty_layer',
    'member-2': 'process_signal',
    'member-3': 'shell_jobctl'
  };
  const memberTopics = data.knowledgeTopics.filter(t => t.category === CATEGORY_OF[selectedMember.id]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800/80 pb-5">
        <div>
          <div className="ds-hero-badge mb-2">
            <Users className="w-3.5 h-3.5 text-red-600" />
            <span>ĐỘI NGŨ THỰC HIỆN ĐỒ ÁN</span>
          </div>
          <h1 className="ds-editorial-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Quản Lý 3 Thành Viên <em>Nhóm Đồ Án HUST</em>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Phân công chuyên môn rạch ròi, theo dõi mã nguồn phụ trách và mức độ sẵn sàng bảo vệ của từng cá nhân.
          </p>
        </div>

        {/* Member Selector Tabs */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 shadow-2xs w-full sm:w-auto">
          {data.members.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMemberId(m.id)}
              className={`flex items-center justify-center sm:justify-start gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                m.id === selectedMember.id
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xs shadow-red-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
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

      {/* Member Profile Banner as Apple macOS Window */}
      <Card trafficLights macTitle={`Hồ Sơ Thành Viên: ${selectedMember.name}`}>
        <div className="p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-950 text-white">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={selectedMember.avatarUrl}
                alt={selectedMember.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-red-500/40 shadow-xl shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {selectedMember.name}
                  </h2>
                  <Badge variant="primary">
                    MSSV: {selectedMember.studentId}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-amber-400 mt-1">
                  {selectedMember.role}
                </p>
                <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {selectedMember.bio}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    {selectedMember.email}
                  </span>
                  {selectedMember.githubUsername && (
                    <a
                      href={`https://github.com/${selectedMember.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-white transition-colors font-mono font-medium"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      @{selectedMember.githubUsername}
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </Card>

      {/* Tiến độ việc được giao (tính từ phân công trong lộ trình) */}
      <Card trafficLights macTitle="Tiến Độ Việc Giao">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
              {completedTasks.length}/{memberTasks.length}
            </span>
            <span className="text-xs text-emerald-500 font-bold">{taskPct}% xong</span>
          </div>
          <Progress value={taskPct} size="sm" barColor="bg-gradient-to-r from-red-600 to-amber-500" />
        </CardContent>
      </Card>

      {/* Main Grid: Code Files & Focus Areas vs Knowledge & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 Col): Code Files & Focus Areas */}
        <div className="space-y-6">
          {/* Assigned Code Files */}
          <Card trafficLights macTitle="Mã Nguồn Phụ Trách Chính">
            <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thành viên phải đọc hiểu từng dòng trong các file này
              </p>
            </div>
            <CardContent className="space-y-2.5 p-5">
              {selectedMember.assignedFiles.map((file, idx) => (
                <a
                  key={idx}
                  href={`https://github.com/kudohieu1209/hedieuhanh-hust/blob/tty-jobctl/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-400 dark:hover:border-red-800 transition-all text-xs font-mono group shadow-2xs hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 truncate font-semibold">
                    <Terminal className="w-3.5 h-3.5 shrink-0 text-red-600" />
                    <span className="truncate">{file}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 shrink-0" />
                </a>
              ))}
            </CardContent>
          </Card>

          {/* Focus Areas */}
          <Card trafficLights macTitle="Chuyên Môn Bắt Buộc">
            <CardContent className="p-5">
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {selectedMember.focusAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed font-medium">{area}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (2 Cols): Learning Topics Progress & Assigned Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chủ đề kiến thức thuộc phần của thành viên này */}
          <Card trafficLights macTitle={`Chủ Đề Kiến Thức Phụ Trách (${memberTopics.length})`}>
            <CardContent className="space-y-2.5 p-4 sm:p-5">
              {memberTopics.map((topic) => (
                <Link
                  key={topic.id}
                  to={`/knowledge?topic=${topic.id}`}
                  className="block p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 hover:border-red-300 dark:hover:border-red-800 transition-colors shadow-2xs"
                >
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {topic.shortSummary}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Assigned Tasks for this member */}
          <Card trafficLights macTitle={`Nhiệm Vụ Được Giao (${memberTasks.length})`}>
            <CardContent className="space-y-2.5 p-5">
              {memberTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 flex items-center justify-between gap-3 text-xs shadow-2xs hover:bg-white dark:hover:bg-slate-900 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={task.status === 'done' ? 'success' : task.status === 'in_progress' ? 'primary' : 'default'}>
                        {task.status === 'done' ? 'Xong' : task.status === 'in_progress' ? 'Đang làm' : 'Cần làm'}
                      </Badge>
                      <span className="font-mono text-slate-400 font-bold">Tuần {task.weekNumber}</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {task.title}
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0 font-mono font-medium">
                    {task.deadline}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};
