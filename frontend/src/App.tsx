import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import QuizDetail from './pages/QuizDetail';
import Ranking from './pages/Ranking';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSubjects from './pages/admin/AdminSubjects';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminRanking from './pages/admin/AdminRanking';
import QuizForm from './pages/admin/QuizForm';
import QuizQuestions from './pages/admin/QuizQuestions';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return user?.role === 'ADMIN' ? <>{children}</> : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* User Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="quiz/:id" element={<QuizDetail />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/new" element={<Register />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="quizzes/new" element={<QuizForm />} />
        <Route path="quizzes/:id/edit" element={<QuizForm />} />
        <Route path="quizzes/:id/questions" element={<QuizQuestions />} />
        <Route path="achievements" element={<AdminAchievements />} />
        <Route path="ranking" element={<AdminRanking />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
