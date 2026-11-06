import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Plus, 
  Code2, 
  Play, 
  RotateCcw, 
  Award,
  ChevronRight,
  BookOpen,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Badge, BadgeVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import { DefenseQuestion, QuestionRating, QuestionCategory, QuestionDifficulty, QuestionType } from '../types';

export const QuestionsPage: React.FC = () => {
  const { data } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Revealed answers state
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Mock Quiz Mode
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<DefenseQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswersRevealed, setQuizAnswersRevealed] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // New Question Form
  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categoryLabels: Record<QuestionCategory, string> = {
    process_signal: 'Process & Signal',
    tty_layer: 'TTY Layer',
    shell_jobctl: 'Shell & Job Control',
    architecture: 'Kiến trúc tổng thể',
    testing: 'Kiểm thử & Thiết kế'
  };

  const difficultyLabels: Record<QuestionDifficulty, { label: string; variant: BadgeVariant }> = {
    easy: { label: 'Dễ', variant: 'default' },
    medium: { label: 'Trung bình', variant: 'warning' },
    hard: { label: 'Hóc búa (Khó)', variant: 'danger' },
  };

  // Filter questions
  const filteredQuestions = data.defenseQuestions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.suggestedAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.detailedExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Start Mock Quiz
  const startMockQuiz = (count: number) => {
    const shuffled = [...data.defenseQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
    setQuizQuestions(shuffled);
    setQuizIndex(0);
    setQuizAnswersRevealed(false);
    setQuizFinished(false);
    setQuizModalOpen(true);
  };

  // Thi thử: chỉ lật đáp án rồi sang câu tiếp, không chấm điểm
  // (web không có đăng nhập nên không lưu được kết quả của từng người).
  const nextQuizQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setQuizAnswersRevealed(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800/80 pb-5">
        <div>
          <div className="ds-hero-badge mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
            <span>NGÂN HÀNG CÂU HỎI VẤN ĐÁP HỘI ĐỒNG</span>
          </div>
          <h1 className="ds-editorial-headline text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Ngân Hàng Câu Hỏi <em>Bảo Vệ Đồ Án HUST</em>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Tổng hợp 25+ câu hỏi lý thuyết, luồng xử lý và phản biện trích xuất từ ON_TAP.md và các đề thi HUST thực tế.
          </p>
        </div>

        {/* Action Buttons: Mock Quiz & Add Question */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="primary"
            icon={<Play className="w-4 h-4" />}
            onClick={() => startMockQuiz(5)}
            className="bg-purple-600 hover:bg-purple-500 border-purple-500/30 justify-center shadow-purple-500/25"
          >
            Thi thử 5 câu
          </Button>
          <Button
            variant="secondary"
            icon={<Play className="w-4 h-4 text-purple-500" />}
            onClick={() => startMockQuiz(10)}
            className="justify-center"
          >
            Thi thử 10 câu
          </Button>
        </div>
      </div>

      {/* Filter Toolbar with Apple Pill Controls */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 p-3.5 rounded-[22px] bg-white/80 dark:bg-[#111827]/80 border border-slate-200/90 dark:border-slate-800 text-xs shadow-apple">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi, từ khóa, file code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
        </div>

        {/* Filter Selects Grid on Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="all">Tất cả chuyên môn</option>
            <option value="process_signal">Process &amp; Signal</option>
            <option value="tty_layer">TTY Layer</option>
            <option value="shell_jobctl">Shell &amp; Job Control</option>
            <option value="architecture">Kiến trúc tổng thể</option>
            <option value="testing">Kiểm thử &amp; Thiết kế</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="all">Mọi độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Hóc búa (Khó)</option>
          </select>

        </div>
      </div>

      {/* Questions Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
        <span>Hiển thị <strong>{filteredQuestions.length}</strong> / {data.defenseQuestions.length} câu hỏi ôn tập</span>
      </div>

      {/* Questions Cards List as Apple macOS Windows */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isRevealed = revealedIds[q.id];

          return (
            <Card 
              key={q.id} 
              trafficLights 
              macTitle={`Câu #${idx + 1} · ${categoryLabels[q.category]}`}
              macAction={
                <div className="flex items-center gap-2">
                  <Badge variant={difficultyLabels[q.difficulty].variant}>
                    {difficultyLabels[q.difficulty].label}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                    {q.codeReference.split(':')[0]}
                  </span>
                </div>
              }
              className="hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="p-5 space-y-4">
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                        {q.question}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        Căn cứ mã nguồn: <strong>{q.codeReference}</strong>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Toggle Reveal Answer Button */}
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-sky-500" />}
                    onClick={() => toggleReveal(q.id)}
                    className="text-xs font-bold"
                  >
                    {isRevealed ? 'Ẩn đáp án gợi ý' : 'Hiện đáp án gợi ý'}
                  </Button>
                </div>

                {/* Revealed Answer Box */}
                {isRevealed && (
                  <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 text-xs space-y-3 animate-in fade-in duration-200 shadow-2xs">
                    <div>
                      <h4 className="font-extrabold text-sky-800 dark:text-sky-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                        <span className="ds-live-dot" />
                        Đáp án gợi ý trả lời nhanh cho hội đồng:
                      </h4>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium text-xs sm:text-sm">
                        {q.suggestedAnswer}
                      </p>
                    </div>

                    {q.detailedExplanation && (
                      <div className="pt-2.5 border-t border-sky-500/10">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                          Giải thích chi tiết &amp; Cơ chế Kernel xv6:
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line text-xs">
                          {q.detailedExplanation}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-sky-500/10 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <Code2 className="w-3.5 h-3.5 text-sky-500" />
                      <span>Vị trí code đối chiếu: <strong>{q.codeReference}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal: Mock Defense Quiz (Thi Thử Vấn Đáp) */}
      {quizModalOpen && (
        <Modal
          isOpen={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          title={quizFinished ? 'Kết Quả Thi Thử Vấn Đáp' : `Thi Thử Vấn Đáp: Câu ${quizIndex + 1} / ${quizQuestions.length}`}
          maxWidth="2xl"
        >
          {quizFinished ? (
            /* Quiz Finish Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center mx-auto ring-4 ring-purple-500/10">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Hoàn thành buổi thi thử {quizQuestions.length} câu!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Câu nào chưa trả lời được thì mở lại trong ngân hàng câu hỏi để đọc kỹ đáp án và đoạn mã liên quan.
              </p>

              <div className="flex justify-center gap-3 pt-4">
                <Button variant="secondary" onClick={() => startMockQuiz(quizQuestions.length)}>
                  Thi thử lại
                </Button>
                <Button variant="primary" onClick={() => setQuizModalOpen(false)}>
                  Đóng &amp; Xem Ngân Hàng
                </Button>
              </div>
            </div>
          ) : (
            /* In-Quiz Question */
            quizQuestions[quizIndex] && (
              <div className="space-y-5 text-xs">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1.5 font-semibold">
                    <span>Tiến độ bài thi</span>
                    <span className="font-mono">{quizIndex + 1}/{quizQuestions.length} câu</span>
                  </div>
                  <Progress value={((quizIndex + 1) / quizQuestions.length) * 100} size="sm" barColor="bg-gradient-to-r from-purple-500 to-sky-500" />
                </div>

                {/* Question */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="purple">
                      {categoryLabels[quizQuestions[quizIndex].category]}
                    </Badge>
                    <Badge variant={difficultyLabels[quizQuestions[quizIndex].difficulty].variant}>
                      {difficultyLabels[quizQuestions[quizIndex].difficulty].label}
                    </Badge>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                    {quizQuestions[quizIndex].question}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-2">
                    File tham khảo: {quizQuestions[quizIndex].codeReference}
                  </div>
                </div>

                {/* Reveal Answer */}
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={quizAnswersRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-sky-500" />}
                    onClick={() => setQuizAnswersRevealed(!quizAnswersRevealed)}
                  >
                    {quizAnswersRevealed ? 'Ẩn đáp án' : 'Xem đáp án gợi ý'}
                  </Button>
                </div>

                {quizAnswersRevealed && (
                  <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 space-y-2 animate-in fade-in shadow-2xs">
                    <span className="font-extrabold text-sky-800 dark:text-sky-300 block">Đáp án chuẩn:</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {quizQuestions[quizIndex].suggestedAnswer}
                    </p>
                    <p className="text-slate-500 text-[11px] leading-relaxed pt-1">
                      {quizQuestions[quizIndex].detailedExplanation}
                    </p>
                  </div>
                )}

                <div className="pt-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <Button variant="primary" size="sm" onClick={nextQuizQuestion}>
                    {quizIndex < quizQuestions.length - 1 ? 'Câu tiếp theo' : 'Kết thúc'}
                  </Button>
                </div>
              </div>
            )
          )}
        </Modal>
      )}

    </div>
  );
};
