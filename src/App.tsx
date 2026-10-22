import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { MembersPage } from './pages/MembersPage';
import { TasksPage } from './pages/TasksPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { QuestionsPage } from './pages/QuestionsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { TestsPage } from './pages/TestsPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="roadmap" element={<RoadmapPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="knowledge" element={<KnowledgePage />} />
              <Route path="questions" element={<QuestionsPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="tests" element={<TestsPage />} />
              <Route path="meetings" element={<MeetingsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
