import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle 
} from 'docx';
import { WeeklyReport, Member } from '../types';

/**
 * Xuất file Word (.docx) chuẩn chỉnh bám sát cấu trúc của Progress-Report-template.docx
 */
export const exportReportToDocx = async (report: WeeklyReport, members: Member[]): Promise<void> => {
  const m1 = members.find(m => m.id === 'member-1') || members[0];
  const m2 = members.find(m => m.id === 'member-2') || members[1];
  const m3 = members.find(m => m.id === 'member-3') || members[2];

  const c1 = report.contributions['member-1'];
  const c2 = report.contributions['member-2'];
  const c3 = report.contributions['member-3'];

  // Tạo tài liệu docx
  const doc = new Document({
    title: `Báo cáo tiến độ Tuần ${report.weekNumber} - Đề tài ${report.projectCode}`,
    description: `Báo cáo tiến độ tuần ${report.weekNumber} môn Hệ điều hành HUST`,
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 24, // 12pt (docx uses half-points: 24 = 12pt)
            color: '000000',
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
              after: 120, // 6pt after
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          // Header: PROGRESS REPORT
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: 'PROGRESS REPORT',
                bold: true,
                size: 32, // 16pt
                color: '1E3A8A', // Navy
              }),
            ],
          }),

          // Metadata Table / Information Block
          new Paragraph({
            children: [
              new TextRun({ text: 'Course: ', bold: true }),
              new TextRun({ text: report.course || 'Operating Systems [Multimedia] - 20261' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Project code: ', bold: true }),
              new TextRun({ text: report.projectCode || '27' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Project title: ', bold: true }),
              new TextRun({ text: report.projectTitle || 'TTY Layer & Job Control trên xv6-riscv' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Design thinking page (e.g. Figma): ', bold: true }),
              new TextRun({ text: report.designThinkingPage || 'https://www.figma.com/design/xv6-tty-jobctl-architecture' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Task management page (e.g. JIRA): ', bold: true }),
              new TextRun({ text: report.taskManagementPage || 'https://github.com/kudohieu1209/hedieuhanh-hust' }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Members: ', bold: true }),
              new TextRun({ text: `${m1?.name} (${m1?.studentId}), ${m2?.name} (${m2?.studentId}), ${m3?.name} (${m3?.studentId})` }),
            ],
          }),
          new Paragraph({
            spacing: { after: 280 },
            children: [
              new TextRun({ text: 'Reported working period: ', bold: true }),
              new TextRun({ text: `from: ${report.reportPeriodFrom}         to: ${report.reportPeriodTo}` }),
            ],
          }),

          // SECTION 1: Summary of latest progress
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({
                text: '1. Summary of latest progress',
                bold: true,
                size: 26, // 13pt
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '(200-300 words to summarize how the overall progress in the period looks like; also indicate cumulative progress)',
                italics: true,
                size: 20, // 10pt
                color: '555555',
              }),
            ],
          }),
          ...report.summaryOfProgress.split('\n\n').map(
            (p) =>
              new Paragraph({
                spacing: { after: 140 },
                children: [new TextRun({ text: p.trim() })],
              })
          ),

          // SECTION 2: Review of technical activities
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            children: [
              new TextRun({
                text: '2. Review of technical activities',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          ...report.technicalActivities.flatMap((act, idx) => [
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({ text: `${act.name || `Activity ${idx + 1}`}:`, bold: true }),
              ],
            }),
            new Paragraph({
              indent: { left: 400 },
              children: [
                new TextRun({ text: '• Description: ', bold: true }),
                new TextRun({ text: act.description }),
              ],
            }),
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 100 },
              children: [
                new TextRun({ text: '• Output & Evidence: ', bold: true }),
                new TextRun({ text: act.outputAndEvidence }),
              ],
            }),
          ]),

          // SECTION 3: Personal contribution
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            children: [
              new TextRun({
                text: '3. Personal contribution (omitted if only one member)',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '(Clearly report what individuals each have done and outputs; clarify how he/she has contributed to the overall progress)',
                italics: true,
                size: 20,
                color: '555555',
              }),
            ],
          }),

          // Member 1
          new Paragraph({
            children: [
              new TextRun({ text: `Member 1: ${m1?.name} (${m1?.studentId} - ${m1?.role})`, bold: true }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Công việc đảm nhiệm: ', bold: true }),
              new TextRun({ text: c1?.assignedRole || m1?.role }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Nghiên cứu kỹ thuật: ', bold: true }),
              new TextRun({ text: c1?.technicalWork }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Nhiệm vụ hoàn thành: ', bold: true }),
              new TextRun({ text: c1?.completedTasksSummary }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Kết quả & Đầu ra: ', bold: true }),
              new TextRun({ text: c1?.outputsAchieved }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 140 },
            children: [
              new TextRun({ text: '• Minh chứng code: ', bold: true }),
              new TextRun({ text: c1?.evidenceLinks }),
            ],
          }),

          // Member 2
          new Paragraph({
            children: [
              new TextRun({ text: `Member 2: ${m2?.name} (${m2?.studentId} - ${m2?.role})`, bold: true }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Công việc đảm nhiệm: ', bold: true }),
              new TextRun({ text: c2?.assignedRole || m2?.role }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Nghiên cứu kỹ thuật: ', bold: true }),
              new TextRun({ text: c2?.technicalWork }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Nhiệm vụ hoàn thành: ', bold: true }),
              new TextRun({ text: c2?.completedTasksSummary }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Kết quả & Đầu ra: ', bold: true }),
              new TextRun({ text: c2?.outputsAchieved }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 140 },
            children: [
              new TextRun({ text: '• Minh chứng code: ', bold: true }),
              new TextRun({ text: c2?.evidenceLinks }),
            ],
          }),

          // Member 3
          new Paragraph({
            children: [
              new TextRun({ text: `Member 3: ${m3?.name} (${m3?.studentId} - ${m3?.role})`, bold: true }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Công việc đảm nhiệm: ', bold: true }),
              new TextRun({ text: c3?.assignedRole || m3?.role }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Nghiên cứu kỹ thuật: ', bold: true }),
              new TextRun({ text: c3?.technicalWork }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Nhiệm vụ hoàn thành: ', bold: true }),
              new TextRun({ text: c3?.completedTasksSummary }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            children: [
              new TextRun({ text: '• Kết quả & Đầu ra: ', bold: true }),
              new TextRun({ text: c3?.outputsAchieved }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: '• Minh chứng code: ', bold: true }),
              new TextRun({ text: c3?.evidenceLinks }),
            ],
          }),

          // SECTION 4: Developed code review
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            children: [
              new TextRun({
                text: '4. Developed code review',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'a. Algorithmic development:', bold: true }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: report.codeReview.algorithmicDevelopment }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'b. Source code enhanced and/or revised:', bold: true }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: report.codeReview.sourceCodeEnhanced }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'c. Testing result:', bold: true }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: report.codeReview.testingResult }),
            ],
          }),

          // SECTION 5: TODO
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 80 },
            children: [
              new TextRun({
                text: '5. TODO',
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'a) List of remaining issues:', bold: true }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: report.todo.remainingIssues }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'b) List of tasks to carry out in the next period:', bold: true }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: report.todo.nextPeriodTasks }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'c) Milestone (what to do more to reach the next milestone progress?):', bold: true }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: report.todo.milestone }),
            ],
          }),
        ],
      },
    ],
  });

  // Xuất file và kích hoạt tải về
  const blob = await Packer.toBlob(doc);
  const fileName = `Progress-Report-Week-${report.weekNumber}.docx`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
