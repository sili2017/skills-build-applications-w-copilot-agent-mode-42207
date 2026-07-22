import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import logo from '../../../docs/octofitapp-small.png'
import './App.css'

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api'
  const usingFallback = !codespaceName

  return (
    <div className="container py-4">
      <header className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <img src={logo} width="48" height="48" alt="Octofit logo" />
          <div>
            <h1 className="h3 mb-1">Octofit Tracker</h1>
            <p className="text-body-secondary mb-0">React 19 presentation tier</p>
          </div>
        </div>
        <div className="text-md-end">
          <div className="small text-body-secondary">API base URL</div>
          <div className="fw-semibold">{apiBaseUrl}</div>
        </div>
      </header>

      {usingFallback && (
        <div className="alert alert-warning" role="alert">
          <strong>Using localhost fallback.</strong> Set <code>VITE_CODESPACE_NAME</code> (for
          example in <code>.env.local</code>) to target the Codespaces public API URL.
        </div>
      )}

      <nav className="nav nav-pills mb-4 gap-2">
        <NavLink
          to="/users"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Users
        </NavLink>
        <NavLink
          to="/activities"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Activities
        </NavLink>
        <NavLink
          to="/teams"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Teams
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Leaderboard
        </NavLink>
        <NavLink
          to="/workouts"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          Workouts
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<Users apiBaseUrl={apiBaseUrl} />} />
        <Route path="/activities" element={<Activities apiBaseUrl={apiBaseUrl} />} />
        <Route path="/teams" element={<Teams apiBaseUrl={apiBaseUrl} />} />
        <Route path="/leaderboard" element={<Leaderboard apiBaseUrl={apiBaseUrl} />} />
        <Route path="/workouts" element={<Workouts apiBaseUrl={apiBaseUrl} />} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </div>
  )
}

export default App
