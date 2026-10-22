import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Search, 
  Code2, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  Cpu, 
  Terminal, 
  Layers,
  GraduationCap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { KnowledgeTopic, KnowledgeCategory, LearningState } from '../types';

export const KnowledgePage: React.FC = () => {
  const { data, currentMember, updateKnowledgeProgress } = useApp();

  const [activeCategory, setActiveCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(data.knowledgeTopics[0]?.id || '');

  const categories: { id: KnowledgeCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'Tất cả bài học', icon: Layers },
    { id: 'process_signal', label: '1. Process & Signal', icon: Cpu },
    { id: 'tty_layer', label: '2. TTY Layer', icon: Terminal },
    { id: 'shell_jobctl', label: '3. Shell & Job Control', icon: Code2 },
  ];

  const filteredTopics = data.knowledgeTopics.filter((topic) => {
    const matchesCategory = activeCategory === 'all' || topic.category === activeCategory;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedTopic = data.knowledgeTopics.find(t => t.id === selectedTopicId) || filteredTopics[0] || data.knowledgeTopics[0];

  const learningStateLabels: Record<LearningState, { label: string; color: string }> = {
    unread: { label: 'Chưa đọc', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
    read: { label: '1. Đã đọc', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    understood: { label: '2. Đã hiểu', color: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
    ready_to_defend: { label: '3. Sẵn sàng bảo vệ ★', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-500" />
          Thư Viện Kiến Thức & Bài Học Chuyên Sâu
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hệ thống hóa toàn bộ kiến thức thiết kế từ DESIGN.md và mã nguồn thực tế xv6-riscv cho 3 thành viên
        </p>
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = cat.id === 'all' 
              ? data.knowledgeTopics.length 
              : data.knowledgeTopics.filter(t => t.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-slate-500">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chủ đề hoặc từ khóa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* 2-Column Layout: Sidebar of Topics + Reader View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topics List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2">
          {filteredTopics.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800">
              Không tìm thấy bài học nào phù hợp.
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isSelected = selectedTopic && selectedTopic.id === topic.id;
              const myState = topic.memberProgress[currentMember.id] || 'unread';

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <Badge variant={topic.category === 'process_signal' ? 'primary' : topic.category === 'tty_layer' ? 'warning' : 'purple'}>
                      {topic.category === 'process_signal' ? 'Process & Signal' : topic.category === 'tty_layer' ? 'TTY' : 'Shell'}
                    </Badge>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${learningStateLabels[myState].color}`}>
                      {learningStateLabels[myState].label}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {topic.shortSummary}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Reader View (8 Cols) */}
        {selectedTopic && (
          <div className="lg:col-span-8">
            <Card className="p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <Badge variant={selectedTopic.category === 'process_signal' ? 'primary' : selectedTopic.category === 'tty_layer' ? 'warning' : 'purple'}>
                    {selectedTopic.category === 'process_signal' ? 'Process & Signal' : selectedTopic.category === 'tty_layer' ? 'TTY Layer' : 'Shell & Job Control'}
                  </Badge>

                  {selectedTopic.githubLink && (
                    <a
                      href={selectedTopic.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-sky-500 hover:underline font-mono"
                    >
                      <span>Xem code trên GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {selectedTopic.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {selectedTopic.shortSummary}
                </p>

                {/* Prerequisites */}
                {selectedTopic.prerequisites && selectedTopic.prerequisites.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
                    <span className="font-semibold text-slate-500">Kiến thức cần học trước:</span>
                    {selectedTopic.prerequisites.map((prereq, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {prereq}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Learning Progress Bar for all 3 members */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Trạng thái học tập của 3 thành viên:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {data.members.map((m) => {
                    const st = selectedTopic.memberProgress[m.id] || 'unread';

                    return (
                      <div key={m.id} className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs">
                        <div className="flex items-center gap-2 mb-1.5">
                          <img
                            src={m.avatarUrl}
                            alt={m.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {m.name}
                          </span>
                        </div>
                        <select
                          value={st}
                          onChange={(e) => updateKnowledgeProgress(selectedTopic.id, m.id, e.target.value as LearningState)}
                          className={`w-full text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none focus:ring-1 focus:ring-sky-500 ${learningStateLabels[st].color}`}
                        >
                          <option value="unread">Chưa đọc</option>
                          <option value="read">1. Đã đọc</option>
                          <option value="understood">2. Đã hiểu</option>
                          <option value="ready_to_defend">3. Sẵn sàng bảo vệ ★</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Explanation Text */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedTopic.explanation}
              </div>

              {/* Terminology / Definitions */}
              {selectedTopic.terminology && selectedTopic.terminology.length > 0 && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    <span>Thuật ngữ & Khái niệm cốt lõi:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {selectedTopic.terminology.map((term, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-[#111827] text-xs">
                        <div className="font-bold font-mono text-sky-600 dark:text-sky-400 mb-0.5">
                          {term.term}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                          {term.definition}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Diagram / Flowchart */}
              {selectedTopic.diagram && (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs overflow-x-auto text-sky-300">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                    Sơ đồ luồng trạng thái / Luồng dữ liệu:
                  </div>
                  <pre className="text-[11px] leading-relaxed">
                    {selectedTopic.diagram}
                  </pre>
                </div>
              )}

              {/* Code Snippet */}
              {selectedTopic.codeSnippet && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/90 text-slate-300">
                    <span className="flex items-center gap-2 font-semibold text-[11px]">
                      <Code2 className="w-3.5 h-3.5 text-sky-400" />
                      {selectedTopic.codeSnippet.filename}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">
                      {selectedTopic.codeSnippet.language}
                    </span>
                  </div>
                  <pre className="p-4 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
                    {selectedTopic.codeSnippet.code}
                  </pre>
                </div>
              )}

              {/* Self-Check Questions */}
              {selectedTopic.selfCheckQuestions && selectedTopic.selfCheckQuestions.length > 0 && (
                <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/20 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Câu hỏi tự kiểm tra (Hội đồng thường hỏi):</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
                    {selectedTopic.selfCheckQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">?</span>
                        <span className="font-medium">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
