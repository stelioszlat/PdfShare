import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';

import './App.css';

import AdminPage from './pages/AdminPage';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
  {
    path: '',
    element: <MainPage />,
    errorElement: <ErrorPage />,
    action: () => {
      if (!localStorage.getItem('token')) {
        return redirect("/login");
      }
    } 
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <ErrorPage />
  }
]);

function App() {
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return (
    <RouterProvider router={router}>
      {isLoggedIn && isAdmin && <AdminPage />}
      {!isLoggedIn && <LoginPage />}
      {isLoggedIn && !isAdmin && <MainPage />}
      {isLoggedIn && !isAdmin && <ProfilePage />}
    </RouterProvider>
    // <MainPage />
  );
}

export default App;
