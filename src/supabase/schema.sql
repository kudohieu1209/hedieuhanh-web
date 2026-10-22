-- =========================================================================
-- xv6 Team Hub — Supabase PostgreSQL Schema Migration
-- Đề tài: TTY Layer & Job Control trên xv6-riscv (HUST 2026.1)
-- =========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG THÀNH VIÊN (Members)
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
  github_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG LỘ TRÌNH 7 TUẦN (Weeks)
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
  slide_url TEXT,
  report JSONB DEFAULT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG NHIỆM VỤ (Tasks)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY DEFAULT ('task-' || uuid_generate_v4()::text),
  title TEXT NOT NULL,
  description TEXT,
  assignee_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  week_number INT REFERENCES weeks(week_number) ON DELETE CASCADE,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'todo',
  deadline DATE,
  checklist JSONB DEFAULT '[]',
  code_files TEXT[] DEFAULT '{}',
  pr_or_commit_url TEXT,
  proof_of_completion TEXT,
  comments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG THƯ VIỆN KIẾN THỨC (Knowledge Topics)
CREATE TABLE IF NOT EXISTS knowledge_topics (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  short_summary TEXT,
  explanation TEXT,
  terminology JSONB DEFAULT '[]',
  code_snippet JSONB,
  github_link TEXT,
  diagram TEXT,
  prerequisites TEXT[] DEFAULT '{}',
  self_check_questions TEXT[] DEFAULT '{}',
  member_progress JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG NGÂN HÀNG CÂU HỎI BẢO VỆ (Defense Questions)
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  suggested_answer TEXT,
  detailed_explanation TEXT,
  code_reference TEXT,
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  member_ratings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG TÀI LIỆU & BÁO CÁO (Documents)
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY DEFAULT ('doc-' || uuid_generate_v4()::text),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  week_number INT,
  file_url TEXT NOT NULL,
  is_external_url BOOLEAN DEFAULT TRUE,
  file_size TEXT,
  version TEXT DEFAULT 'v1.0',
  uploader_name TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- 7. BẢNG BÀI KIỂM THỬ (Test Cases)
CREATE TABLE IF NOT EXISTS test_cases (
  id TEXT PRIMARY KEY,
  suite TEXT NOT NULL,
  name TEXT NOT NULL,
  command_or_function TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  last_run_at TIMESTAMPTZ,
  executed_by TEXT,
  output_log TEXT,
  github_actions_url TEXT,
  related_issue_id TEXT
);

-- 8. BẢNG QUẢN LÝ LỖI (Bugs)
CREATE TABLE IF NOT EXISTS bugs (
  id TEXT PRIMARY KEY DEFAULT ('bug-' || uuid_generate_v4()::text),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'minor',
  status TEXT NOT NULL DEFAULT 'open',
  assignee_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  related_test_id TEXT,
  steps_to_reproduce TEXT,
  solution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 9. BẢNG NHẬT KÝ BÁO CÁO & NHẬN XÉT GIẢNG VIÊN (Meetings)
CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY DEFAULT ('meet-' || uuid_generate_v4()::text),
  week_number INT,
  date DATE NOT NULL,
  presenter TEXT NOT NULL,
  attendee_names TEXT[] DEFAULT '{}',
  reported_content TEXT,
  lecturer_questions TEXT[] DEFAULT '{}',
  lecturer_feedback TEXT,
  action_items JSONB DEFAULT '[]',
  status TEXT DEFAULT 'completed'
);

-- 10. BẢNG CÀI ĐẶT HỆ THỐNG (Settings)
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  mode TEXT NOT NULL DEFAULT 'team',
  current_member_id TEXT DEFAULT 'member-1',
  theme TEXT DEFAULT 'dark',
  current_week INT DEFAULT 6,
  next_report_date DATE DEFAULT '2026-10-27',
  github_repo_url TEXT DEFAULT 'https://github.com/kudohieu1209/hedieuhanh-hust',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Phù hợp nhóm 3 người làm việc chung: Cho phép đọc công khai và ghi khi xác thực
-- =========================================================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách cho phép đọc (Public Read)
CREATE POLICY "Public Read Members" ON members FOR SELECT USING (true);
CREATE POLICY "Public Read Weeks" ON weeks FOR SELECT USING (true);
CREATE POLICY "Public Read Tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Public Read Knowledge" ON knowledge_topics FOR SELECT USING (true);
CREATE POLICY "Public Read Questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public Read Documents" ON documents FOR SELECT USING (true);
CREATE POLICY "Public Read TestCases" ON test_cases FOR SELECT USING (true);
CREATE POLICY "Public Read Bugs" ON bugs FOR SELECT USING (true);
CREATE POLICY "Public Read Meetings" ON meetings FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);

-- Cho phép sửa đổi cho các thao tác nhóm (hoặc khi authenticated)
CREATE POLICY "Allow All Modifications" ON members FOR ALL USING (true);
CREATE POLICY "Allow All Modifications Weeks" ON weeks FOR ALL USING (true);
CREATE POLICY "Allow All Modifications Tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow All Modifications Knowledge" ON knowledge_topics FOR ALL USING (true);
CREATE POLICY "Allow All Modifications Questions" ON questions FOR ALL USING (true);
CREATE POLICY "Allow All Modifications Documents" ON documents FOR ALL USING (true);
CREATE POLICY "Allow All Modifications TestCases" ON test_cases FOR ALL USING (true);
CREATE POLICY "Allow All Modifications Bugs" ON bugs FOR ALL USING (true);
CREATE POLICY "Allow All Modifications Meetings" ON meetings FOR ALL USING (true);
CREATE POLICY "Allow All Modifications Settings" ON settings FOR ALL USING (true);
