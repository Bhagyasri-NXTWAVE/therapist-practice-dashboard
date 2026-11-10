/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PracticeProvider } from './context/PracticeContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { PatientDetails } from './pages/PatientDetails';
import { Calendar } from './pages/Calendar';
import { Sessions } from './pages/Sessions';
import { Messages } from './pages/Messages';
import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <PracticeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/:id" element={<PatientDetails />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="messages" element={<Messages />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PracticeProvider>
  );
}

