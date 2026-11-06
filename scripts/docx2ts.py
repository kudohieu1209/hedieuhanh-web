# Cách chạy (cần: pip install python-docx):
#   python3 scripts/docx2ts.py ../docs src/data/weeklyReports.ts
#   rồi chép lại các file .docx vào public/reports/progress-report-tuan-N.docx
"""Read the official weekly PROGRESS REPORT .docx files and write
web/src/data/weeklyReports.ts, so the web shows exactly what was submitted."""
import json, re, sys
import docx

DOCS, OUT = sys.argv[1], sys.argv[2]
STATUS = {1: 'submitted', 2: 'submitted'}          # others: draft
MEMBER = {'Hiếu': 'member-1', 'Hoàng': 'member-2', 'Tuấn Anh': 'member-3'}


def paras(path):
    d = docx.Document(path)
    out = []
    for p in d.paragraphs:
        t = p.text.strip()
        if not t:
            continue
        hl = any(r.font.highlight_color for r in p.runs)
        bold = ''.join(r.text for r in p.runs if r.bold).strip()
        out.append((t, bold, hl))
    return out


def between(ps, start, end):
    i = next(k for k, p in enumerate(ps) if p[0].startswith(start))
    j = next(k for k, p in enumerate(ps) if k > i and p[0].startswith(end))
    return ps[i + 1:j], ps[i]


def strip_label(t, label):
    return t[len(label):].strip() if label and t.startswith(label) else t


reports = []
for w in range(1, 8):
    name = 'PROGRESS REPORT.docx' if w == 1 else f'PROGRESS REPORT tuần {w}.docx'
    ps = paras(f'{DOCS}/{name}')
    per = next(p[0] for p in ps if p[0].startswith('from:'))
    m = re.match(r'from:\s*(\S+)\s+to:\s*(\S+)', per)
    summary, _ = between(ps, '1. Summary', '2. Review')
    acts, _ = between(ps, '2. Review', '3. Personal')
    mems, _ = between(ps, '3. Personal', '4. Developed')
    code, _ = between(ps, '4. Developed', '5. TODO')
    issues, _ = between(ps, 'a) List of remaining', 'b) List of tasks')
    tasks, bhead = between(ps, 'b) List of tasks', 'c) Milestone')
    mile = next(p for p in ps if p[0].startswith('c) Milestone'))

    activities = []
    for k, (t, b, _) in enumerate(p for p in acts if p[0].startswith('Activity')):
        activities.append(dict(id=f'w{w}-act-{k + 1}', name=b.rstrip('. ').strip(),
                               description=strip_label(t, b), outputAndEvidence=''))
    contrib = {}
    for t, b, _ in mems:
        mid = next(v for k, v in MEMBER.items() if k in t.split('–')[0])
        head = re.match(r'(Member \d+: [^(]+\(([^)]+)\)\.)\s*', t)
        body = t[head.end():] if head else t
        work, _, output = body.partition('Output:')
        contrib[mid] = dict(memberId=mid, assignedRole=head.group(2) if head else '',
                            technicalWork=work.strip(), outputsAchieved=output.strip(),
                            completedTasksSummary='', evidenceLinks='')
    cr = {}
    for t, b, _ in code:
        for key, lab in (('algorithmicDevelopment', 'a. Algorithmic development:'),
                         ('sourceCodeEnhanced', 'b. Source code enhanced and/or revised:'),
                         ('testingResult', 'c. Testing result:')):
            if t.startswith(lab):
                cr[key] = t[len(lab):].strip()
    reports.append(dict(
        id=f'report-w{w}', weekNumber=w,
        reportPeriodFrom=m.group(1), reportPeriodTo=m.group(2),
        course='Operating Systems [Multimedia] – 20261', projectCode='26126',
        projectTitle='TTY layer and job control',
        designThinkingPage='https://www.figma.com/board/VohV5EoTLyQ9YczJvytmDU',
        taskManagementPage='https://trello.com/b/fgC11Nz9/os-project-26126',
        status=STATUS.get(w, 'draft'),
        summaryOfProgress='\n\n'.join(p[0] for p in summary),
        technicalActivities=activities,
        contributions=contrib,
        codeReview=cr,
        todo=dict(remainingIssues='\n'.join('- ' + p[0] for p in issues),
                  nextPeriodTasks=bhead[0] + '\n' + '\n'.join('- ' + p[0] for p in tasks),
                  milestone=strip_label(mile[0], 'c) Milestone (what to do more to reach the next milestone progress?):')),
        lecturerFeedback='',
        version='1.0', updatedBy='Mai Duy Hiếu', updatedAt='2026-11-07T00:00:00Z',
    ))
    pend = sum(1 for p in ps if p[2])
    print(f'week {w}: {len(summary)} summary, {len(activities)} act, {len(contrib)} members, '
          f'{len(cr)} code, {len(issues)} issues, {len(tasks)} tasks, {pend} yellow')
    assert len(activities) == 3 and len(contrib) == 3 and len(cr) == 3, w

ts = ('// Generated from docs/PROGRESS REPORT*.docx by scripts/docx2ts.py; do not edit by hand.\n'
      '// The .docx files are the official reports; regenerate this file after editing them.\n'
      "import { WeeklyReport } from '../types';\n\n"
      'export const WEEKLY_REPORTS: WeeklyReport[] = '
      + json.dumps(reports, ensure_ascii=False, indent=2) + ';\n')
open(OUT, 'w', encoding='utf8').write(ts)
