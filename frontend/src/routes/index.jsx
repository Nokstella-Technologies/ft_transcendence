import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';// Corrigi o nome do arquivo para AuthContext
import Login from '../pages/Login';
import SignUp from '../pages/SingUp';
import Home from '../pages/Home';
import { AuthContext } from '../context/AuthContex';

const AppRoutes = () => {
  const { loading } = useContext(AuthContext);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </Router>
      )}
    </>
  );
};

export default AppRoutes;
