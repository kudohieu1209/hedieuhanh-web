import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TestTube2, 
  Bug, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  ExternalLink, 
  Plus, 
  Search, 
  Play, 
  Layers,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge, BadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TestCase, BugItem, TestSuite, BugSeverity, BugStatus, MemberId } from '../types';

export const TestsPage: React.FC = () => {
  const { data, currentMember, updateTestCase, addBug, updateBug } = useApp();

  const [activeTab, setActiveTab] = useState<'tests' | 'bugs'>('tests');
  const [selectedSuite, setSelectedSuite] = useState<TestSuite | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected test for viewing full output log
  const [viewingTestLog, setViewingTestLog] = useState<TestCase | null>(null);

  // New bug modal
  const [isAddingBugModal, setIsAddingBugModal] = useState(false);
  const [newBugTitle, setNewBugTitle] = useState('');
  const [newBugDesc, setNewBugDesc] = useState('');
  const [newBugSeverity, setNewBugSeverity] = useState<BugSeverity>('minor');
  const [newBugAssignee, setNewBugAssignee] = useState<MemberId>(currentMember.id);
  const [newBugSteps, setNewBugSteps] = useState('');
  const [newBugSolution, setNewBugSolution] = useState('');

  const suiteLabels: Record<TestSuite, string> = {
    tty_modes: 'TTY Modes (ioctl/raw/noecho)',
    signals: 'Signals (Ctrl-C/Ctrl-Z/timer)',
    proc_groups: 'Process Groups (PGID/reparent)',
    job_control: 'Job Control (fg/bg/SIGTTIN)',
    pipeline: 'Pipeline (counter | cat)',
    multi_tty: 'Multi-TTY (Ctrl-T/obuf)',
    line_editor: 'Line Editor & History',
    regression: 'xv6 Regression (usertests)'
  };

  const statusBadges: Record<'pass' | 'fail' | 'pending', { label: string; variant: BadgeVariant; icon: any }> = {
    pass: { label: 'PASS (Đạt)', variant: 'success', icon: CheckCircle2 },
    fail: { label: 'FAIL (Lỗi)', variant: 'danger', icon: XCircle },
    pending: { label: 'Chưa chạy', variant: 'warning', icon: Clock },
  };

  const severityBadges: Record<BugSeverity, { label: string; variant: BadgeVariant }> = {
    critical: { label: 'Nghiêm trọng (Blocker)', variant: 'danger' },
    major: { label: 'Vừa (Major)', variant: 'warning' },
    minor: { label: 'Nhẹ (Minor)', variant: 'default' },
  };

  const bugStatusBadges: Record<BugStatus, { label: string; variant: BadgeVariant }> = {
    open: { label: 'Đang mở (Open)', variant: 'danger' },
    investigating: { label: 'Đang xử lý', variant: 'warning' },
    resolved: { label: 'Đã giải quyết', variant: 'success' },
  };

  // Filter tests
  const filteredTests = data.testCases.filter((tc) => {
    const matchesSuite = selectedSuite === 'all' || tc.suite === selectedSuite;
    const matchesSearch = tc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSuite && matchesSearch;
  });

  const passCount = data.testCases.filter(t => t.status === 'pass').length;
  const failCount = data.testCases.filter(t => t.status === 'fail').length;

  const handleCreateBug = () => {
    if (!newBugTitle.trim()) return;

    addBug({
      title: newBugTitle.trim(),
      description: newBugDesc.trim(),
      severity: newBugSeverity,
      status: 'open',
      assigneeId: newBugAssignee,
      stepsToReproduce: newBugSteps.trim(),
      solutionNote: newBugSolution.trim()
    });

    setIsAddingBugModal(false);
    setNewBugTitle('');
    setNewBugDesc('');
    setNewBugSteps('');
    setNewBugSolution('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800/80 pb-5">
        <div>
          <div className="ds-hero-badge mb-2">
            <TestTube2 className="w-3.5 h-3.5 text-sky-500" />
            <span>KIỂM THỬ TỰ ĐỘNG &amp; THEO DÕI LỖI</span>
          </div>
          <h1 className="ds-editorial-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Kiểm Thử Tự Động &amp; <em>Quản Lý Lỗi xv6</em>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Bộ 12 kịch bản đẩy phím tự động bằng Python pexpect và nhật ký theo dõi xử lý lỗi hệ thống.
          </p>
        </div>

        {/* Tab Switcher & Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="grid grid-cols-2 sm:flex p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'tests'
                  ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TestTube2 className="w-3.5 h-3.5" />
              <span>Bài test ({passCount}/{data.testCases.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bugs')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bugs'
                  ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Quản lý lỗi ({data.bugs.filter(b => b.status !== 'resolved').length})</span>
            </button>
          </div>

          {activeTab === 'bugs' && (
            <Button
              variant="danger"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddingBugModal(true)}
              className="w-full sm:w-auto justify-center"
            >
              Báo cáo lỗi
            </Button>
          )}
        </div>
      </div>

      {activeTab === 'tests' ? (
        /* TESTS VIEW */
        <div className="space-y-6">
          {/* Summary Banner as Apple macOS Window */}
          <div className="p-4 sm:p-5 rounded-[22px] border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#111827]/80 shadow-apple flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {passCount} Bài đạt (PASS)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {failCount} Bài hỏng (FAIL)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {data.testCases.length - passCount - failCount} Chờ chạy
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-sky-500" />
              <span>Lệnh: <strong>./test-jobctl.py &amp;&amp; ./test-xv6.py usertests</strong></span>
            </div>
          </div>

          {/* Filter Toolbar with Apple Pill Controls */}
          <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-[22px] bg-white/80 dark:bg-[#111827]/80 border border-slate-200/90 dark:border-slate-800 text-xs shadow-apple">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên bài test hoặc mô tả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <select
              value={selectedSuite}
              onChange={(e) => setSelectedSuite(e.target.value as TestSuite | 'all')}
              className="px-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
            >
              <option value="all">Tất cả nhóm kiểm thử (Suites)</option>
              <option value="signals">Signals</option>
              <option value="job_control">Job Control</option>
              <option value="pipeline">Pipeline</option>
              <option value="tty_modes">TTY Modes</option>
              <option value="line_editor">Line Editor &amp; History</option>
              <option value="multi_tty">Multi-TTY</option>
              <option value="proc_groups">Process Groups</option>
              <option value="regression">Regression (usertests)</option>
            </select>
          </div>

          {/* Tests List as Apple macOS Windows */}
          <div className="space-y-3.5">
            {filteredTests.map((tc) => {
              const statusInfo = statusBadges[tc.status];
              const StatusIcon = statusInfo.icon;

              return (
                <Card 
                  key={tc.id} 
                  trafficLights 
                  macTitle={
                    <span className="font-mono font-bold text-xs">
                      {tc.name}
                    </span>
                  }
                  macAction={
                    <Badge variant={statusInfo.variant}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusInfo.label}
                    </Badge>
                  }
                  className="hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-apple-hover"
                >
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <Badge variant="outline">
                          {suiteLabels[tc.suite] || tc.suite}
                        </Badge>
                        <span className="text-[11px] font-mono text-slate-400">
                          {tc.executedBy} · {new Date(tc.lastRunAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {tc.description}
                      </p>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        Lệnh thực thi: <strong>{tc.commandOrFunction}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Terminal className="w-3.5 h-3.5 text-sky-500" />}
                        onClick={() => setViewingTestLog(tc)}
                      >
                        Xem log bằng chứng
                      </Button>
                      {tc.githubActionsUrl && (
                        <a
                          href={tc.githubActionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title="Xem CI Log trên GitHub"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* BUGS VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card hover trafficLights macTitle="Nghiêm Trọng (Blocker)">
              <CardContent className="p-5">
                <div className="text-3xl font-extrabold font-mono text-rose-500">
                  {data.bugs.filter(b => b.severity === 'critical' && b.status !== 'resolved').length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Lỗi cần xử lý ngay</div>
              </CardContent>
            </Card>
            <Card hover trafficLights macTitle="Đang Xử Lý">
              <CardContent className="p-5">
                <div className="text-3xl font-extrabold font-mono text-amber-500">
                  {data.bugs.filter(b => b.status === 'investigating').length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Đang debug &amp; kiểm chứng</div>
              </CardContent>
            </Card>
            <Card hover trafficLights macTitle="Đã Khắc Phục">
              <CardContent className="p-5">
                <div className="text-3xl font-extrabold font-mono text-emerald-500">
                  {data.bugs.filter(b => b.status === 'resolved').length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Đã kiểm thử hồi quy đạt</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3.5">
            {data.bugs.map((bug) => {
              const assignee = data.members.find(m => m.id === bug.assigneeId);

              return (
                <Card key={bug.id} trafficLights macTitle={bug.title}>
                  <div className="p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <Badge variant={bugStatusBadges[bug.status].variant}>
                            {bugStatusBadges[bug.status].label}
                          </Badge>
                          <Badge variant={severityBadges[bug.severity].variant}>
                            {severityBadges[bug.severity].label}
                          </Badge>
                          <span className="text-[11px] text-slate-400 font-mono font-medium">
                            Phụ trách: {assignee?.name || 'Chưa gán'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {bug.description}
                        </p>
                      </div>

                      {/* Change Status Dropdown */}
                      <div className="shrink-0 flex items-center gap-2">
                        <select
                          value={bug.status}
                          onChange={(e) => updateBug({ ...bug, status: e.target.value as BugStatus, resolvedAt: e.target.value === 'resolved' ? new Date().toISOString() : undefined })}
                          className="text-xs font-bold px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs"
                        >
                          <option value="open">Đang mở (Open)</option>
                          <option value="investigating">Đang xử lý</option>
                          <option value="resolved">Đã giải quyết</option>
                        </select>
                      </div>
                    </div>

                    {/* Steps & Solution */}
                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                      {bug.stepsToReproduce && (
                        <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 font-mono text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Cách tái hiện:</span>
                          <pre className="whitespace-pre-line text-slate-600 dark:text-slate-400 leading-relaxed">{bug.stepsToReproduce}</pre>
                        </div>
                      )}
                      {bug.solutionNote && (
                        <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-medium">
                          <span className="font-bold block mb-0.5">Biện pháp giải quyết:</span>
                          <p>{bug.solutionNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Xem Log Bằng Chứng Test as macOS Terminal */}
      {viewingTestLog && (
        <Modal
          isOpen={!!viewingTestLog}
          onClose={() => setViewingTestLog(null)}
          title={`Log Kiểm Thử: ${viewingTestLog.name}`}
          subtitle={`Lệnh: ${viewingTestLog.commandOrFunction} · Người chạy: ${viewingTestLog.executedBy}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="ds-mac-window bg-slate-950 font-mono text-xs overflow-x-auto text-emerald-400 border-slate-800 shadow-inner">
              <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
                <div className="ds-mac-dots">
                  <span className="ds-mac-dot ds-mac-dot-red" />
                  <span className="ds-mac-dot ds-mac-dot-yellow" />
                  <span className="ds-mac-dot ds-mac-dot-green" />
                </div>
                <span className="text-[10px] text-slate-400">test-output.log</span>
              </div>
              <pre className="p-4 leading-relaxed whitespace-pre-wrap">{viewingTestLog.outputLog}</pre>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setViewingTestLog(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Báo Cáo Lỗi Mới */}
      {isAddingBugModal && (
        <Modal
          isOpen={isAddingBugModal}
          onClose={() => setIsAddingBugModal(false)}
          title="Báo Cáo Lỗi Mới (Bug Report)"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Tiêu đề lỗi:</label>
              <input
                type="text"
                value={newBugTitle}
                onChange={(e) => setNewBugTitle(e.target.value)}
                placeholder="VD: Nhấn Ctrl-Z trong raw mode bị in ký tự lạ"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Mức độ nghiêm trọng:</label>
                <select
                  value={newBugSeverity}
                  onChange={(e) => setNewBugSeverity(e.target.value as BugSeverity)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                >
                  <option value="critical">Nghiêm trọng (Blocker)</option>
                  <option value="major">Vừa (Major)</option>
                  <option value="minor">Nhẹ (Minor)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Giao người sửa:</label>
                <select
                  value={newBugAssignee}
                  onChange={(e) => setNewBugAssignee(e.target.value as MemberId)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                >
                  {data.members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Mô tả hiện tượng:</label>
              <textarea
                rows={2}
                value={newBugDesc}
                onChange={(e) => setNewBugDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Các bước tái hiện:</label>
              <textarea
                rows={3}
                value={newBugSteps}
                onChange={(e) => setNewBugSteps(e.target.value)}
                placeholder="1. Chạy make qemu&#10;2. Gõ lệnh..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" onClick={() => setIsAddingBugModal(false)}>
                Hủy
              </Button>
              <Button variant="danger" onClick={handleCreateBug}>
                Tạo Báo Cáo Lỗi
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
