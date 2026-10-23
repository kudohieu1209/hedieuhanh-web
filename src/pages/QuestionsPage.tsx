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
  const { data, currentMember, updateQuestionRating, addDefenseQuestion } = useApp();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<string>('all');
  const [onlyWeak, setOnlyWeak] = useState(false);

  // Revealed answers state
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Mock Quiz Mode
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<DefenseQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswersRevealed, setQuizAnswersRevealed] = useState(false);
  const [quizScores, setQuizScores] = useState<Record<string, QuestionRating>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // New Question Form
  const [isAddingModal, setIsAddingModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCategory, setNewCategory] = useState<QuestionCategory>('process_signal');
  const [newType, setNewType] = useState<QuestionType>('theory');
  const [newDifficulty, setNewDifficulty] = useState<QuestionDifficulty>('medium');
  const [newSuggestedAnswer, setNewSuggestedAnswer] = useState('');
  const [newDetailedExplanation, setNewDetailedExplanation] = useState('');
  const [newCodeRef, setNewCodeRef] = useState('kernel/proc.c');

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const ratingLabels: Record<QuestionRating, { label: string; variant: BadgeVariant }> = {
    untested: { label: 'Chưa ôn', variant: 'default' },
    not_understood: { label: 'Chưa hiểu rõ', variant: 'danger' },
    understood: { label: 'Đã hiểu đáp án', variant: 'primary' },
    confident: { label: 'Trả lời xuất sắc ★', variant: 'success' },
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
    const myRating = q.memberRatings[currentMember.id] || 'untested';
    const matchesRating = selectedRatingFilter === 'all' || myRating === selectedRatingFilter;
    const matchesWeak = !onlyWeak || myRating === 'not_understood';

    return matchesSearch && matchesCategory && matchesDifficulty && matchesRating && matchesWeak;
  });

  // Start Mock Quiz
  const startMockQuiz = (count: number) => {
    const shuffled = [...data.defenseQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
    setQuizQuestions(shuffled);
    setQuizIndex(0);
    setQuizAnswersRevealed(false);
    setQuizScores({});
    setQuizFinished(false);
    setQuizModalOpen(true);
  };

  const handleRateQuizQuestion = (rating: QuestionRating) => {
    const currentQ = quizQuestions[quizIndex];
    if (!currentQ) return;

    // Update in global app context
    updateQuestionRating(currentQ.id, currentMember.id, rating);
    setQuizScores(prev => ({ ...prev, [currentQ.id]: rating }));

    // Move to next or finish
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(quizIndex + 1);
      setQuizAnswersRevealed(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleCreateQuestion = () => {
    if (!newQuestionText.trim() || !newSuggestedAnswer.trim()) return;

    addDefenseQuestion({
      question: newQuestionText.trim(),
      type: newType,
      category: newCategory,
      difficulty: newDifficulty,
      suggestedAnswer: newSuggestedAnswer.trim(),
      detailedExplanation: newDetailedExplanation.trim() || newSuggestedAnswer.trim(),
      codeReference: newCodeRef.trim(),
      author: currentMember.name,
      tags: [categoryLabels[newCategory]],
      memberRatings: {
        'member-1': 'untested',
        'member-2': 'untested',
        'member-3': 'untested'
      }
    });

    setIsAddingModal(false);
    setNewQuestionText('');
    setNewSuggestedAnswer('');
    setNewDetailedExplanation('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-500" />
            Ngân Hàng Câu Hỏi Vấn Đáp Bảo Vệ Đồ Án
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tổng hợp 25+ câu hỏi lý thuyết, luồng xử lý và phản biện trích xuất từ ON_TAP.md và các đề thi HUST
          </p>
        </div>

        {/* Action Buttons: Mock Quiz & Add Question */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="primary"
            icon={<Play className="w-4 h-4" />}
            onClick={() => startMockQuiz(5)}
            className="bg-purple-600 hover:bg-purple-500 border-purple-500/30 justify-center"
          >
            Thi thử 5 câu
          </Button>
          <Button
            variant="outline"
            icon={<Play className="w-4 h-4" />}
            onClick={() => startMockQuiz(10)}
            className="justify-center"
          >
            Thi thử 10 câu
          </Button>
          <Button
            variant="outline"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddingModal(true)}
            className="col-span-2 sm:col-span-1 justify-center"
          >
            Thêm câu hỏi
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm câu hỏi, đáp án, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 sm:py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Filter Selects Grid on Mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
          >
            <option value="all">Tất cả chuyên môn</option>
            <option value="process_signal">Process & Signal</option>
            <option value="tty_layer">TTY Layer</option>
            <option value="shell_jobctl">Shell & Job Control</option>
            <option value="architecture">Kiến trúc tổng thể</option>
            <option value="testing">Kiểm thử & Thiết kế</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
          >
            <option value="all">Mọi độ khó</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Hóc búa (Khó)</option>
          </select>

          {/* Rating Filter for current member */}
          <select
            value={selectedRatingFilter}
            onChange={(e) => setSelectedRatingFilter(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
          >
            <option value="all">Tất cả mức tự đánh giá</option>
            <option value="untested">Chưa ôn</option>
            <option value="not_understood">Chưa hiểu rõ</option>
            <option value="understood">Đã hiểu đáp án</option>
            <option value="confident">Trả lời xuất sắc ★</option>
          </select>

          {/* Weak questions toggle */}
          <button
            onClick={() => setOnlyWeak(!onlyWeak)}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
              onlyWeak
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Chỉ câu chưa tốt ({data.defenseQuestions.filter(q => q.memberRatings[currentMember.id] === 'not_understood').length})</span>
          </button>
        </div>
      </div>

      {/* Questions Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Hiển thị <strong>{filteredQuestions.length}</strong> / {data.defenseQuestions.length} câu hỏi ôn tập</span>
        <span>Người đang tự đánh giá: <strong>{currentMember.name}</strong></span>
      </div>

      {/* Questions Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const isRevealed = revealedIds[q.id];
          const myRating = q.memberRatings[currentMember.id] || 'untested';

          return (
            <Card key={q.id} className="p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge variant="purple">
                        {categoryLabels[q.category]}
                      </Badge>
                      <Badge variant={difficultyLabels[q.difficulty].variant}>
                        {difficultyLabels[q.difficulty].label}
                      </Badge>
                      <span className="text-[11px] font-mono text-slate-400">
                        {q.codeReference.split(':')[0]}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </h3>
                  </div>
                </div>

                {/* Rating Dropdown for Current Member */}
                <div className="flex items-center gap-2 shrink-0 sm:self-start">
                  <span className="text-[11px] text-slate-400">Đánh giá:</span>
                  <select
                    value={myRating}
                    onChange={(e) => updateQuestionRating(q.id, currentMember.id, e.target.value as QuestionRating)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="untested">Chưa ôn</option>
                    <option value="not_understood">Chưa hiểu rõ</option>
                    <option value="understood">Đã hiểu đáp án</option>
                    <option value="confident">Trả lời xuất sắc ★</option>
                  </select>
                </div>
              </div>

              {/* Toggle Reveal Answer Button */}
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  onClick={() => toggleReveal(q.id)}
                  className="text-xs"
                >
                  {isRevealed ? 'Ẩn đáp án gợi ý' : 'Hiện đáp án gợi ý'}
                </Button>
              </div>

              {/* Revealed Answer Box */}
              {isRevealed && (
                <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 text-xs space-y-3 animate-in fade-in duration-200">
                  <div>
                    <h4 className="font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider text-[11px] mb-1">
                      Đáp án gợi ý trả lời nhanh cho hội đồng:
                    </h4>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                      {q.suggestedAnswer}
                    </p>
                  </div>

                  {q.detailedExplanation && (
                    <div className="pt-2 border-t border-sky-500/10">
                      <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                        Giải thích chi tiết & Cơ chế Kernel:
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
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
          subtitle={`Thành viên: ${currentMember.name}`}
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
                Kết quả tự đánh giá đã được lưu vào hồ sơ cá nhân của {currentMember.name}. Bạn có thể xem lại những câu chưa hiểu để ôn tập thêm.
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="font-bold text-emerald-500 text-lg">
                    {Object.values(quizScores).filter(s => s === 'confident').length}
                  </div>
                  <div className="text-[10px] text-slate-400">Xuất sắc</div>
                </div>
                <div>
                  <div className="font-bold text-sky-500 text-lg">
                    {Object.values(quizScores).filter(s => s === 'understood').length}
                  </div>
                  <div className="text-[10px] text-slate-400">Đã hiểu</div>
                </div>
                <div>
                  <div className="font-bold text-rose-500 text-lg">
                    {Object.values(quizScores).filter(s => s === 'not_understood').length}
                  </div>
                  <div className="text-[10px] text-slate-400">Cần ôn lại</div>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button variant="outline" onClick={() => startMockQuiz(quizQuestions.length)}>
                  Thi thử lại
                </Button>
                <Button variant="primary" onClick={() => setQuizModalOpen(false)}>
                  Đóng & Xem Ngân Hàng
                </Button>
              </div>
            </div>
          ) : (
            /* In-Quiz Question */
            quizQuestions[quizIndex] && (
              <div className="space-y-5 text-xs">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                    <span>Tiến độ bài thi</span>
                    <span>{quizIndex + 1}/{quizQuestions.length} câu</span>
                  </div>
                  <Progress value={((quizIndex + 1) / quizQuestions.length) * 100} size="sm" barColor="bg-purple-600" />
                </div>

                {/* Question */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="purple">
                      {categoryLabels[quizQuestions[quizIndex].category]}
                    </Badge>
                    <Badge variant={difficultyLabels[quizQuestions[quizIndex].difficulty].variant}>
                      {difficultyLabels[quizQuestions[quizIndex].difficulty].label}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                    {quizQuestions[quizIndex].question}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-2">
                    File tham khảo: {quizQuestions[quizIndex].codeReference}
                  </div>
                </div>

                {/* Reveal Answer */}
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={quizAnswersRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    onClick={() => setQuizAnswersRevealed(!quizAnswersRevealed)}
                  >
                    {quizAnswersRevealed ? 'Ẩn đáp án' : 'Xem đáp án gợi ý & chấm điểm'}
                  </Button>
                </div>

                {quizAnswersRevealed && (
                  <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 space-y-2 animate-in fade-in">
                    <span className="font-bold text-sky-800 dark:text-sky-300 block">Đáp án chuẩn:</span>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                      {quizQuestions[quizIndex].suggestedAnswer}
                    </p>
                    <p className="text-slate-500 text-[11px] leading-relaxed pt-1">
                      {quizQuestions[quizIndex].detailedExplanation}
                    </p>
                  </div>
                )}

                {/* Self Rating Buttons */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-semibold block text-slate-700 dark:text-slate-300">
                    Bạn tự đánh giá câu trả lời của mình thế nào?
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleRateQuizQuestion('not_understood')}
                      className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold transition-colors"
                    >
                      Chưa hiểu rõ
                    </button>
                    <button
                      onClick={() => handleRateQuizQuestion('understood')}
                      className="p-2.5 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold transition-colors"
                    >
                      Đã hiểu đáp án
                    </button>
                    <button
                      onClick={() => handleRateQuizQuestion('confident')}
                      className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold transition-colors"
                    >
                      Trả lời tốt ★
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </Modal>
      )}

      {/* Modal: Thêm câu hỏi mới */}
      {isAddingModal && (
        <Modal
          isOpen={isAddingModal}
          onClose={() => setIsAddingModal(false)}
          title="Thêm Câu Hỏi Vấn Đáp Mới"
          subtitle="Bổ sung câu hỏi thực tế hoặc tình huống thầy hỏi khi demo"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Nội dung câu hỏi:</label>
              <textarea
                rows={2}
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="VD: Nếu tiến trình con bỏ qua SIGTTIN thì read() trả về gì?"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Chuyên môn:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as QuestionCategory)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="process_signal">Process & Signal</option>
                  <option value="tty_layer">TTY Layer</option>
                  <option value="shell_jobctl">Shell & Job Control</option>
                  <option value="architecture">Kiến trúc tổng thể</option>
                  <option value="testing">Kiểm thử</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Loại câu hỏi:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as QuestionType)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="theory">Lý thuyết</option>
                  <option value="code_reading">Đọc code</option>
                  <option value="flow">Luồng xử lý</option>
                  <option value="edge_case">Tình huống biên</option>
                  <option value="counter_arg">Phản biện</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Độ khó:</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as QuestionDifficulty)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="easy">Dễ</option>
                  <option value="medium">Trung bình</option>
                  <option value="hard">Hóc búa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Đáp án gợi ý trả lời nhanh:</label>
              <textarea
                rows={2}
                value={newSuggestedAnswer}
                onChange={(e) => setNewSuggestedAnswer(e.target.value)}
                placeholder="Nêu vắn tắt ý chính..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Giải thích chi tiết:</label>
              <textarea
                rows={3}
                value={newDetailedExplanation}
                onChange={(e) => setNewDetailedExplanation(e.target.value)}
                placeholder="Giải thích cơ chế trong kernel..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">File/hàm tham chiếu:</label>
              <input
                type="text"
                value={newCodeRef}
                onChange={(e) => setNewCodeRef(e.target.value)}
                placeholder="kernel/console.c: consoleread()"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsAddingModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleCreateQuestion}>
                Lưu Câu Hỏi
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
