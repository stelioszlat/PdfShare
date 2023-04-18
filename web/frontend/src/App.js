import React from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import './App.css';

import AdminPage from './pages/AdminPage';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import FilePage from './pages/FilePage';
import ProfilePage from './pages/ProfilePage';
import UserPage from './pages/UserPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NewFilePage from './pages/NewFilePage';
import ResultsPage from './pages/ResultsPage';

const ProfileRoot = props => {
  return (<><Outlet /></>)
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/signup',
    element: <SignupPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/home',
    element: <MainPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/new-file',
    element: <NewFilePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/file/:id",
    element: <FilePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/results",
    element: <ResultsPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/profile",
    element: <ProfileRoot />,
    errorElement: <ErrorPage />,
    children: [
      {index: true, element: <ProfilePage />},
      {path: ':userId', element: <UserPage />}
    ]
  },
  {
    path: "/error",
    element: <ErrorPage />
  }
]);

function App() {

  return (
    <RouterProvider router={router}>
      <AdminPage />
      <LoginPage />
      <SignupPage />
      <ForgotPasswordPage />
      <MainPage />
      <FilePage />
      <ProfilePage />
      <ResultsPage />
    </RouterProvider>
  );
}

export default App;
