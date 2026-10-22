import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquare, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Plus, 
  Sparkles, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { MeetingNote, MeetingActionItem, MemberId } from '../types';

export const MeetingsPage: React.FC = () => {
  const { data, updateMeeting } = useApp();

  const [isAddingModal, setIsAddingModal] = useState(false);
  const [newWeek, setNewWeek] = useState(6);
  const [newDate, setNewDate] = useState('2026-10-27');
  const [newPresenter, setNewPresenter] = useState(data.members[0].name);
  const [newReported, setNewReported] = useState('');
  const [newFeedback, setNewFeedback] = useState('');
  const [newQuestions, setNewQuestions] = useState('');

  const handleToggleAction = (meeting: MeetingNote, actId: string) => {
    const updatedActs = meeting.actionItems.map(item =>
      item.id === actId
        ? { ...item, status: (item.status === 'done' ? 'pending' : 'done') as 'pending' | 'in_progress' | 'done' }
        : item
    );
    updateMeeting({ ...meeting, actionItems: updatedActs });
  };

  const handleCreateMeeting = () => {
    if (!newReported.trim() || !newFeedback.trim()) return;

    const qList = newQuestions.split('\n').map(s => s.trim()).filter(Boolean);

    const newMeeting: MeetingNote = {
      id: `meet-${Date.now()}`,
      weekNumber: Number(newWeek),
      date: newDate,
      presenter: newPresenter,
      attendeeNames: ['Mai Duy Hiếu', 'Nguyễn Tuấn Anh', 'Trần Đức Dũng', 'TS. Phạm Văn Tiến (GVHD)'],
      reportedContent: newReported.trim(),
      lecturerQuestions: qList,
      lecturerFeedback: newFeedback.trim(),
      actionItems: [],
      status: 'completed'
    };

    updateMeeting(newMeeting);
    setIsAddingModal(false);
    setNewReported('');
    setNewFeedback('');
    setNewQuestions('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-sky-500" />
            Nhận Xét Giảng Viên & Nhật Ký Tiến Độ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ghi nhận nhận xét, câu hỏi vấn đáp của TS. Phạm Văn Tiến sau mỗi buổi báo cáo và theo dõi công việc bổ sung
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddingModal(true)}
        >
          Thêm biên bản báo cáo
        </Button>
      </div>

      {/* Timeline Meetings List */}
      <div className="space-y-6">
        {data.meetings.map((meeting) => (
          <Card key={meeting.id} className="p-6 space-y-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            {/* Top Row: Week, Date, Presenter */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                  T{meeting.weekNumber}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Buổi Báo Cáo Tiến Độ Tuần {meeting.weekNumber}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {meeting.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-sky-500" />
                      Trình bày: <strong>{meeting.presenter}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant="success">
                Đã báo cáo & Nhận xét
              </Badge>
            </div>

            {/* Reported Content */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[11px]">
                Nội dung nhóm đã báo cáo:
              </h4>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {meeting.reportedContent}
              </p>
            </div>

            {/* Questions Asked by Lecturer */}
            {meeting.lecturerQuestions && meeting.lecturerQuestions.length > 0 && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 text-[11px] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Những câu hỏi thầy Tiến đã đặt ra:</span>
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {meeting.lecturerQuestions.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-purple-500 font-bold">?</span>
                      <span className="font-medium italic">"{q}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lecturer Feedback */}
            <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 text-xs space-y-1">
              <div className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nhận xét và chỉ đạo của Thầy Tiến:</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed italic pt-1">
                "{meeting.lecturerFeedback}"
              </p>
            </div>

            {/* Action Items */}
            {meeting.actionItems && meeting.actionItems.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
                  Việc cần bổ sung sau buổi báo cáo:
                </h4>
                <div className="space-y-1.5">
                  {meeting.actionItems.map((act) => {
                    const assignee = data.members.find(m => m.id === act.assigneeId);
                    const isDone = act.status === 'done';

                    return (
                      <div
                        key={act.id}
                        onClick={() => handleToggleAction(meeting, act.id)}
                        className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`} />
                          <span className={isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}>
                            {act.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>{assignee?.name}</span>
                          <span>Hạn: {act.deadline}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Modal: Thêm Biên Bản Báo Cáo */}
      {isAddingModal && (
        <Modal
          isOpen={isAddingModal}
          onClose={() => setIsAddingModal(false)}
          title="Ghi Nhận Buổi Báo Cáo Mới"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Tuần báo cáo:</label>
                <select
                  value={newWeek}
                  onChange={(e) => setNewWeek(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  {data.weeks.map(w => (
                    <option key={w.weekNumber} value={w.weekNumber}>Tuần {w.weekNumber}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ngày báo cáo:</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Thành viên thuyết trình:</label>
              <select
                value={newPresenter}
                onChange={(e) => setNewPresenter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {data.members.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Nội dung đã báo cáo:</label>
              <textarea
                rows={2}
                value={newReported}
                onChange={(e) => setNewReported(e.target.value)}
                placeholder="VD: Trình bày demo chuỗi Ctrl-Z -> bg -> fg..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Những câu hỏi thầy đặt ra (mỗi câu 1 dòng):</label>
              <textarea
                rows={2}
                value={newQuestions}
                onChange={(e) => setNewQuestions(e.target.value)}
                placeholder="Câu hỏi 1&#10;Câu hỏi 2"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Nhận xét của thầy:</label>
              <textarea
                rows={3}
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Nhận xét của TS. Phạm Văn Tiến..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsAddingModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleCreateMeeting}>
                Lưu Biên Bản
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
