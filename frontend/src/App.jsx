import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LecteurHistoire from './pages/LecteurHistoire';
import MesHistoires from './pages/MesHistoires';
import EditeurHistoire from './pages/EditeurHistoire';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="lire/:id" element={<LecteurHistoire />} />
            
            {/* Routes auteur */}
            <Route 
              path="mes-histoires" 
              element={
                <ProtectedRoute requiredRole="AUTEUR">
                  <MesHistoires />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="editeur/:id?" 
              element={
                <ProtectedRoute requiredRole="AUTEUR">
                  <EditeurHistoire />
                </ProtectedRoute>
              } 
            />

            {/* Routes admin */}
            <Route 
              path="admin" 
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
