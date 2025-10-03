import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TaskList from './components/Tasks/TaskList';
import TaskDetails from './components/Tasks/TaskDetails';
import TaskForm from './components/Tasks/TaskForm';
import LoadingSpinner from './components/UI/LoadingSpinner';

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Routes>
        {/* Rotas públicas */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} 
        />
        
        {/* Rotas protegidas */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<TaskList />} />
                  <Route path="/tasks" element={<TaskList />} />
                  <Route path="/tasks/new" element={<TaskForm />} />
                  <Route path="/tasks/:id" element={<TaskDetails />} />
                  <Route path="/tasks/:id/edit" element={<TaskForm />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
