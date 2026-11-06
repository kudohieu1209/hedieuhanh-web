import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Copy, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  ShieldCheck, 
  ExternalLink,
  Moon,
  Sun,
  Users
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { testSupabaseConnection, resetSupabaseClient, normalizeSupabaseUrl } from '../services/supabase';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { data, currentMember, setCurrentMemberId, theme, toggleTheme, updateSettings, resetData, exportData, importData, isRemote } = useApp();
  const toast = useToast();

  // Supabase Form state
  const [supabaseUrl, setSupabaseUrl] = useState(data.settings.supabaseUrl || '');
  const [supabaseKey, setSupabaseKey] = useState(data.settings.supabaseAnonKey || '');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{ success: boolean; message: string } | null>(null);

  // SQL schema view
  const [activeSqlTab, setActiveSqlTab] = useState<'schema' | 'seed'>('schema');
  const [copiedSql, setCopiedSql] = useState(false);

  // Import JSON Modal
  const [isImportModal, setIsImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Reset confirmation
  const [isResetConfirmModal, setIsResetConfirmModal] = useState(false);

  const sampleSchemaSql = `-- =========================================================================
-- xv6 Team Hub — Supabase Schema DDL (PostgreSQL)
-- =========================================================================
CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  assigned_files TEXT[] DEFAULT '{}',
  github_username TEXT
);

CREATE TABLE IF NOT EXISTS weeks (
  week_number INT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  goals TEXT[] DEFAULT '{}',
  custom_report_date DATE,
  status TEXT NOT NULL DEFAULT 'not_started',
  member_assignments JSONB DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  checklist JSONB DEFAULT '[]',
  demo_script TEXT[] DEFAULT '{}',
  notes TEXT,
  lecturer_feedback TEXT,
  post_report_requests TEXT[] DEFAULT '{}',
  pdf_url TEXT,
  slide_url TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id TEXT REFERENCES members(id),
  week_number INT REFERENCES weeks(week_number),
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'todo',
  deadline DATE,
  checklist JSONB DEFAULT '[]',
  code_files TEXT[] DEFAULT '{}',
  proof_of_completion TEXT,
  comments JSONB DEFAULT '[]'
);

-- RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read All" ON members FOR SELECT USING (true);
CREATE POLICY "Public Read Weeks" ON weeks FOR SELECT USING (true);
CREATE POLICY "Public Read Tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow Mod" ON members FOR ALL USING (true);
CREATE POLICY "Allow Mod Weeks" ON weeks FOR ALL USING (true);
CREATE POLICY "Allow Mod Tasks" ON tasks FOR ALL USING (true);`;

  const sampleSeedSql = `-- =========================================================================
-- xv6 Team Hub — Seed Data
-- =========================================================================
INSERT INTO members (id, name, student_id, email, role)
VALUES 
('member-1', 'Mai Duy Hiếu', '20223967', 'hieu.md223967@sis.hust.edu.vn', 'TTY Layer & Device Driver (Trưởng nhóm)'),
('member-2', 'Nguyễn Huy Hoàng', '20223912', 'hoang.nh223912@sis.hust.edu.vn', 'Kernel & Signal (Process Management)'),
('member-3', 'Nguyễn Tuấn Anh', '20223988', 'anh.nt223988@sis.hust.edu.vn', 'Shell & Testing (User Space & Integration)')
ON CONFLICT (id) DO NOTHING;`;

  const handleTestConnection = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      toast.error('Vui lòng điền đủ Supabase URL và API Key.');
      return;
    }
    setTestingConnection(true);
    setConnectionResult(null);

    const cleanUrl = normalizeSupabaseUrl(supabaseUrl);
    const cleanKey = supabaseKey.trim();
    // Update local inputs to clean values
    setSupabaseUrl(cleanUrl);

    const res = await testSupabaseConnection(cleanUrl, cleanKey);
    setTestingConnection(false);

    if (res.success) {
      if (res.needsMigration) {
        setConnectionResult({
          success: true,
          message: 'Kết nối Supabase xác thực thành công! Tuy nhiên database chưa có bảng. Hãy copy mã SQL ở mục bên dưới và nhấn RUN trong Supabase SQL Editor.'
        });
        toast.warning('Kết nối thành công! Cần chạy schema.sql trong Supabase để tạo bảng.');
      } else {
        setConnectionResult({
          success: true,
          message: 'Kết nối Supabase thành công 100%! Bảng members và hệ thống phản hồi tốt.'
        });
        toast.success('Đã kích hoạt Team Mode đồng bộ với Supabase!');
      }

      // Save config
      localStorage.setItem('xv6_hub_supabase_config', JSON.stringify({
        url: cleanUrl,
        key: cleanKey
      }));
      resetSupabaseClient();
      updateSettings({
        mode: 'team',
        supabaseUrl: cleanUrl,
        supabaseAnonKey: cleanKey
      });
    } else {
      setConnectionResult({
        success: false,
        message: res.error || 'Kết nối thất bại. Vui lòng kiểm tra lại URL hoặc Project API Key.'
      });
      toast.error('Không thể kết nối tới Supabase.');
    }
  };

  const handleCopySql = () => {
    const text = activeSqlTab === 'schema' ? sampleSchemaSql : sampleSeedSql;
    navigator.clipboard.writeText(text);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
    toast.success('Đã sao chép SQL vào bộ nhớ đệm!');
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xv6-team-hub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Đã tải xuống file sao lưu JSON!');
  };

  const handleConfirmImport = () => {
    if (!importJsonText.trim()) return;
    try {
      importData(importJsonText.trim());
      setIsImportModal(false);
      setImportJsonText('');
    } catch (e: any) {
      // Toast already handled inside importData
    }
  };

  const handleConfirmReset = () => {
    resetData();
    setIsResetConfirmModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-200/90 dark:border-slate-800/80 pb-5">
        <div className="ds-hero-badge mb-2">
          <Settings className="w-3.5 h-3.5 text-sky-500" />
          <span>CẤU HÌNH HỆ THỐNG &amp; CƠ SỞ DỮ LIỆU</span>
        </div>
        <h1 className="ds-editorial-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Cài Đặt Hệ Thống &amp; <em>Đồng Bộ Supabase</em>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Quản lý chế độ hoạt động (Demo Mode / Team Mode), kết nối cơ sở dữ liệu PostgreSQL Supabase, sao lưu và khôi phục dữ liệu nhóm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Supabase Connection & General Settings */}
        <div className="space-y-6">
          {/* Supabase Team Mode Card as Apple macOS Window */}
          <Card 
            trafficLights 
            macTitle="Kết Nối Supabase (Team Mode)"
            macAction={
              <Badge variant={isRemote ? 'success' : 'warning'}>
                {isRemote ? 'Team Mode (Synced)' : 'Demo Mode (Local)'}
              </Badge>
            }
          >
            <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Điền thông tin Project URL và Public Anon Key từ bảng điều khiển Supabase của nhóm
              </p>
            </div>

            <CardContent className="space-y-4 text-xs p-5">
              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  Supabase Project URL:
                </label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  Supabase Anon Public Key:
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px]"
                />
              </div>

              {connectionResult && (
                <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 shadow-2xs ${
                  connectionResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
                }`}>
                  {connectionResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <span className="font-medium">{connectionResult.message}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  loading={testingConnection}
                  onClick={handleTestConnection}
                >
                  Kiểm tra &amp; Kích hoạt Team Mode
                </Button>

                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Mở Supabase Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* General App Settings */}
          <Card trafficLights macTitle="Thiết Lập Giao Diện & Người Dùng">
            <CardContent className="space-y-4 text-xs p-5">
              {/* Theme toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 shadow-2xs">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Giao diện màu sắc</div>
                  <div className="text-[11px] text-slate-500">
                    Đang chọn: <strong>{theme === 'dark' ? 'Chế độ Tối (Dark Workstation)' : 'Chế độ Sáng (Apple Drafting Canvas)'}</strong>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleTheme}
                  icon={theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-600" />}
                >
                  Đổi sang {theme === 'dark' ? 'Canvas Sáng' : 'Tối'}
                </Button>
              </div>

              {/* Active member switch */}
              <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 space-y-2.5 shadow-2xs">
                <div className="font-bold text-slate-800 dark:text-slate-200">Người dùng làm việc chính:</div>
                <div className="space-y-1.5">
                  {data.members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setCurrentMemberId(m.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                        m.id === currentMember.id
                          ? 'bg-sky-500 text-white font-bold shadow-xs'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={m.avatarUrl} alt={m.name} className={`w-6 h-6 rounded-full object-cover ring-1 ${m.id === currentMember.id ? 'ring-white' : 'ring-slate-300'}`} />
                        <span className="text-xs">{m.name} ({m.role})</span>
                      </div>
                      {m.id === currentMember.id && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: SQL Migration Scripts & Backup/Restore */}
        <div className="space-y-6">
          {/* SQL Scripts Viewer */}
          <Card 
            trafficLights 
            macTitle="Kịch Bản SQL Supabase (Migrations)"
            macAction={
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 hover:underline font-bold"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép SQL</span>
                  </>
                )}
              </button>
            }
          >
            <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dán vào Supabase SQL Editor và bấm Run để tạo bảng và nạp dữ liệu ban đầu
              </p>
              <div className="flex gap-2 pt-2.5">
                <button
                  onClick={() => setActiveSqlTab('schema')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeSqlTab === 'schema'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  1. schema.sql (Bảng &amp; RLS)
                </button>
                <button
                  onClick={() => setActiveSqlTab('seed')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeSqlTab === 'seed'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  2. seed.sql (Dữ liệu ban đầu)
                </button>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="ds-mac-window bg-slate-950 p-4 max-h-72 overflow-y-auto font-mono text-[11px] text-slate-300 border-slate-800 shadow-inner">
                <pre className="leading-relaxed text-sky-300">
                  {activeSqlTab === 'schema' ? sampleSchemaSql : sampleSeedSql}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Backup & Restore Card */}
          <Card trafficLights macTitle="Sao Lưu & Khôi Phục Dữ Liệu">
            <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bảo vệ toàn vẹn dữ liệu đồ án, xuất file JSON dự phòng hoặc nạp lại khi cần
              </p>
            </div>

            <CardContent className="space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5 text-sky-500" />}
                  onClick={handleDownloadBackup}
                >
                  Tải file sao lưu (JSON)
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Upload className="w-3.5 h-3.5 text-emerald-500" />}
                  onClick={() => setIsImportModal(true)}
                >
                  Nhập file sao lưu
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={() => setIsResetConfirmModal(true)}
                >
                  Khôi phục dữ liệu gốc
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal: Nhập dữ liệu JSON */}
      {isImportModal && (
        <Modal
          isOpen={isImportModal}
          onClose={() => setIsImportModal(false)}
          title="Nhập Dữ Liệu Sao Lưu (JSON)"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-500">
              Dán nội dung JSON sao lưu vào ô dưới đây để phục hồi toàn bộ tiến độ, nhiệm vụ và câu hỏi:
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Dán mã JSON tại đây..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-[11px]"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" onClick={() => setIsImportModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleConfirmImport}>
                Phục Hồi Dữ Liệu
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Xác nhận Reset */}
      {isResetConfirmModal && (
        <Modal
          isOpen={isResetConfirmModal}
          onClose={() => setIsResetConfirmModal(false)}
          title="Xác Nhận Khôi Phục Dữ Liệu Ban Đầu?"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Thao tác này sẽ đặt lại toàn bộ nhiệm vụ, lộ trình 7 tuần, tiến độ học tập và ngân hàng câu hỏi về trạng thái thiết kế chuẩn ban đầu của đồ án Đề #27.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setIsResetConfirmModal(false)}>
                Hủy bỏ
              </Button>
              <Button variant="danger" onClick={handleConfirmReset}>
                Đồng Ý Khôi Phục
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
