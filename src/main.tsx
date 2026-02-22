import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import AppShell from './shell/AppShell'
import Architecture from './work/Architecture'
import WorkDashboard from './work/WorkDashboard'
import WorkCV from './work/WorkCV'
import HealthProfile from './health/HealthProfile'
import SignIn from './health/SignIn'
import LinkedInPage from './health/LinkedInPage'
import BlogList from './health/BlogList'
import BlogPost from './blog/BlogPost'

const router = createBrowserRouter([
  { path: '/', element: <AppShell />, children: [
      { index: true, element: <WorkDashboard /> },
      { path: 'work-dashboard', element: <WorkDashboard /> },
      { path: 'work-architecture', element: <Architecture /> },
      { path: 'work-cv', element: <WorkCV /> },
      { path: 'health', element: <HealthProfile /> },
      { path: 'login', element: <SignIn /> },
      { path: 'linkedin', element: <LinkedInPage /> },
      { path: 'blog', element: <BlogList /> },
      { path: 'blog/:slug', element: <BlogPost /> }
  ] }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
)
