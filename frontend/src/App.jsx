import React, { useState, useEffect } from 'react';
import './App.css';
import RatePage from './Pages/RatePage/RatePage';
import RequestForm from './Pages/RequestForm/RequestForm';
import Home from "./Pages/Home/Home";
import Landing from "./Pages/Landing/Landing";
import Layout from './Pages/Layout/Layout';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Notfound from './Pages/Notfound/Notfound';
import ManageUser from './Pages/ManageUser/ManageUser';
import SignIn from './Pages/Sign/SignIn';
import SignUp from './Pages/Sign/SignUp';
import Dashboard from './Pages/Admin/Dashboard';
import { getStoredUser, isAuthenticated } from './services/api';

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }
  
  const user = getStoredUser();
  
  if (requireAdmin && user?.role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }
  
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const routers = createBrowserRouter([
    {
      path: '/',
      element: <Layout user={user} />,  // Navbar + Footer
      children: [
        { index: true, element: <Landing /> },
        { 
          path: 'home', 
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          )
        },
        { 
          path: 'admin/dashboard', 
          element: (
            <ProtectedRoute requireAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          )
        },
        { path: 'ratepage', element: <RatePage /> },
        { 
          path: 'requestform', 
          element: (
            <ProtectedRoute>
              <RequestForm />
            </ProtectedRoute>
          )
        },
        { path: 'manageuser', element: <ManageUser /> },
        { path: '*', element: <Notfound /> },
      ]
    },
    { path: 'signin', element: <SignIn setUser={setUser} /> },
    { path: 'ratepage', element: <SignIn setUser={setUser} /> },
    { path: 'signup', element: <SignUp setUser={setUser} /> },
  ]);

  return <RouterProvider router={routers} />;
}
