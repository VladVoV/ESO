import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import EvaluationForm from './Components/Admin/Evaluation/EvaluationForm';
import SubmissionConfirmation from './Components/SubmissionConfirmation';
import DepartmentManagement from './Components/Admin/DepartmentManagement';
import TeacherManagement from './Components/Admin/Teacher/TeacherManagement';
import GroupManagement from './Components/Admin/Group/GroupManagement';
import QuestionManagement from './Components/Admin/Question/QuestionManagement';
import EvaluationResults from './Components/Admin/Evaluation/EvaluationResults';
import EvaluationStatistics from './Components/Admin/Evaluation/EvaluationStatistics';
import AdminForm from "./Components/Admin/AdminForm";
import TeacherSelection from "./Components/TeacherSelection";
import ProtectedRoute from "./Components/ProtectedRoutes";
import ConfirmationMessage from "./Components/ConfirmationMessage";

const App = () => {
  return (
      <Router>
          <Routes>
            {/* Student Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/evaluate" element={<EvaluationForm />} />
            <Route path="/confirmation" element={<SubmissionConfirmation />} />
            <Route path="/teacher-selection" element={<TeacherSelection />} />
            <Route path="/message" element={<ConfirmationMessage/>}/>
            {/* Admin Routes */}
            <Route path="/admin/auth" element={<AdminForm />} />
            <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['admin']}><DepartmentManagement /></ProtectedRoute>} />
            <Route path="/admin/teachers" element={<ProtectedRoute allowedRoles={['admin']}><TeacherManagement /></ProtectedRoute>} />
            <Route path="/admin/groups" element={<ProtectedRoute allowedRoles={['admin']}><GroupManagement /></ProtectedRoute>} />
            <Route path="/admin/questions" element={<ProtectedRoute allowedRoles={['admin']}><QuestionManagement /></ProtectedRoute>} />
            <Route path="/admin/evaluation-results" element={<ProtectedRoute allowedRoles={['admin']}><EvaluationResults /></ProtectedRoute>} />
            <Route path="/admin/evaluation-statistics" element={<ProtectedRoute allowedRoles={['admin']}><EvaluationStatistics /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
      </Router>
  );
};

export default App;
