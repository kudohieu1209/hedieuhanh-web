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
    ready_to_defend: { label: '3. Sẵn sàng bảo vệ ★', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold' }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-b border-slate-200/90 dark:border-slate-800/80 pb-5">
        <div className="ds-hero-badge mb-2.5">
          <BookOpen className="w-3.5 h-3.5 text-sky-500" />
          <span>CẨM NANG THIẾT KẾ &amp; BẢO VỆ ĐỒ ÁN</span>
        </div>
        <h1 className="ds-editorial-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          Thư Viện Kiến Thức &amp; <em>Cơ Chế Chuyên Sâu</em>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Hệ thống hóa toàn bộ lý thuyết thiết kế từ DESIGN.md, các hàm kernel cốt lõi và kịch bản vấn đáp bảo vệ cho 3 thành viên.
        </p>
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 overflow-x-auto no-scrollbar shadow-2xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count = cat.id === 'all' 
              ? data.knowledgeTopics.length 
              : data.knowledgeTopics.filter(t => t.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  activeCategory === cat.id
                    ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-auto sm:min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chủ đề, syscall, cờ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs font-medium"
          />
        </div>
      </div>

      {/* 2-Column Layout: Sidebar of Topics + Reader View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topics List (4 Cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredTopics.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-[#111827] rounded-[22px] border border-slate-200 dark:border-slate-800 shadow-apple">
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
                  className={`p-4 rounded-[20px] border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-sky-500/30'
                      : 'border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-[#111827]/80 hover:bg-white dark:hover:bg-[#111827] shadow-apple-sm hover:shadow-apple hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <Badge variant={topic.category === 'process_signal' ? 'primary' : topic.category === 'tty_layer' ? 'warning' : 'purple'}>
                      {topic.category === 'process_signal' ? 'Process & Signal' : topic.category === 'tty_layer' ? 'TTY Layer' : 'Shell & Job Control'}
                    </Badge>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${learningStateLabels[myState].color}`}>
                      {learningStateLabels[myState].label}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {topic.shortSummary}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Reader View (8 Cols) as Apple macOS Window */}
        {selectedTopic && (
          <div className="lg:col-span-8">
            <Card 
              trafficLights 
              macTitle={selectedTopic.title}
              macAction={
                selectedTopic.githubLink ? (
                  <a
                    href={selectedTopic.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 hover:underline font-mono font-bold"
                  >
                    <span>Mã nguồn GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : undefined
              }
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <Badge variant={selectedTopic.category === 'process_signal' ? 'primary' : selectedTopic.category === 'tty_layer' ? 'warning' : 'purple'}>
                      {selectedTopic.category === 'process_signal' ? 'Process & Signal' : selectedTopic.category === 'tty_layer' ? 'TTY Layer' : 'Shell & Job Control'}
                    </Badge>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {selectedTopic.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {selectedTopic.shortSummary}
                  </p>

                  {/* Prerequisites */}
                  {selectedTopic.prerequisites && selectedTopic.prerequisites.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-slate-400">
                      <span className="font-bold text-slate-500">Kiến thức nền:</span>
                      {selectedTopic.prerequisites.map((prereq, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200/60 dark:border-slate-700/60">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Learning Progress Bar for all 3 members */}
                <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                  <h4 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <span className="ds-live-dot" />
                    Trạng thái học tập của 3 thành viên:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {data.members.map((member) => {
                      const state = selectedTopic.memberProgress[member.id] || 'unread';
                      const isMe = member.id === currentMember.id;

                      return (
                        <div
                          key={member.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                            isMe
                              ? 'border-sky-300 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/30'
                              : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                            />
                            <span className="font-bold truncate text-slate-800 dark:text-slate-200">
                              {member.name.split(' ').slice(-1)[0]}
                              {isMe && ' (Tôi)'}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${learningStateLabels[state].color}`}>
                            {learningStateLabels[state].label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* My Status Update Buttons */}
                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Cập nhật trạng thái của bạn ({currentMember.name}):
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['read', 'understood', 'ready_to_defend'] as LearningState[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateKnowledgeProgress(selectedTopic.id, currentMember.id, st)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            selectedTopic.memberProgress[currentMember.id] === st
                              ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/30'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {learningStateLabels[st].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Explanation Content */}
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {selectedTopic.explanation}
                </div>

                {/* ASCII Diagram if available - in macOS Terminal Box */}
                {selectedTopic.asciiDiagram && (
                {/* Diagram if available - in macOS Terminal Box */}
                {selectedTopic.diagram && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-sky-500" />
                        Sơ đồ kiến trúc &amp; Luồng điều khiển:
                      </span>
                    </div>
                    <div className="ds-mac-window bg-slate-950 text-slate-200 border-slate-800">
                      <div className="px-3.5 py-2 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
                        <div className="ds-mac-dots">
                          <span className="ds-mac-dot ds-mac-dot-red" />
                          <span className="ds-mac-dot ds-mac-dot-yellow" />
                          <span className="ds-mac-dot ds-mac-dot-green" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">xv6-diagram.txt</span>
                      </div>
                      <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-400 leading-tight">
                        {selectedTopic.asciiDiagram}
                        {selectedTopic.diagram}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Code Snippet if available - in macOS Terminal Box */}
                {selectedTopic.codeSnippet && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-sky-500" />
                        Đoạn mã kernel xv6 cốt lõi ({selectedTopic.sourceFile}):
                        Đoạn mã kernel xv6 cốt lõi ({selectedTopic.codeSnippet.filename}):
                      </span>
                    </div>
                    <div className="ds-mac-window bg-slate-950 text-slate-200 border-slate-800">
                      <div className="px-3.5 py-2 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
                        <div className="ds-mac-dots">
                          <span className="ds-mac-dot ds-mac-dot-red" />
                          <span className="ds-mac-dot ds-mac-dot-yellow" />
                          <span className="ds-mac-dot ds-mac-dot-green" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{selectedTopic.sourceFile}</span>
                        <span className="text-[10px] font-mono text-slate-400">{selectedTopic.codeSnippet.filename}</span>
                      </div>
                      <pre className="p-4 text-xs font-mono overflow-x-auto text-sky-300 leading-normal">
                        {selectedTopic.codeSnippet}
                        {selectedTopic.codeSnippet.code}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Self-check Questions */}
                {selectedTopic.selfCheckQuestions && selectedTopic.selfCheckQuestions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
                    <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      Câu hỏi tự kiểm tra khi bảo vệ đồ án:
                    </h4>
                    <ul className="space-y-2 text-xs text-amber-900 dark:text-amber-200">
                      {selectedTopic.selfCheckQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-amber-600 shrink-0 font-mono">Q{idx + 1}.</span>
                          <span className="leading-relaxed font-medium">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
