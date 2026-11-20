
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import './MainLayout.css';

const navigation = [
  { name: 'Dashboard', path: '/', icon: '▦' },
  { name: 'My Projects', path: '/projects', icon: '▣' },
  { name: 'Create Project', path: '/projects/new', icon: '＋' },
];

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('launchcraft-theme') || 'light';
  });

  const location = useLocation();

  // Apply and save selected theme
  useEffect(() => {
    localStorage.setItem('launchcraft-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previousTheme) =>
      previousTheme === 'light' ? 'dark' : 'light'
    );
  };

  const currentPage =
    navigation.find((item) => {
      if (item.path === '/') return location.pathname === '/';

      if (item.path === '/projects') {
        return location.pathname === '/projects';
      }

      return location.pathname.startsWith(item.path);
    })?.name || 'Project Workspace';

  return (
    <div className="app-layout" data-theme={theme}>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`app-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>

        <div className="sidebar-brand">
          <div className="brand-icon">✦</div>
          <span>LaunchCraft</span>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>

        <div className="workspace-card">
          <div className="workspace-avatar">L</div>

          <div>
            <strong>My Workspace</strong>
            <small>Startup Studio</small>
          </div>

          <span className="workspace-arrow">⌄</span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/' || item.path === '/projects'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-label tools-label">TOOLS</div>

        <div className="sidebar-navigation">
          <div className="sidebar-static-link">
            <span className="nav-icon">◈</span>
            <span>MVP Planning</span>
          </div>

          <div className="sidebar-static-link">
            <span className="nav-icon">⌁</span>
            <span>AI Workspace</span>
            <span className="coming-soon">AI</span>
          </div>
        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-help">
            <span>ⓘ</span>
            <span>Help Center</span>
          </div>

          <div className="sidebar-profile">
            <div className="profile-avatar">U</div>

            <div className="profile-info">
              <strong>Workspace User</strong>
              <small>Free Plan</small>
            </div>

            <span>•••</span>
          </div>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <header className="topbar">

          <div className="topbar-left">

            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              ☰
            </button>

            <div>
              <div className="breadcrumb">
                Workspace / {currentPage}
              </div>

              <h2>{currentPage}</h2>
            </div>

          </div>

          <div className="topbar-right">

            <div className="system-status">
              <span className="status-dot" />
              All systems operational
            </div>

            {/* THEME TOGGLE */}
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon size={19} />
              ) : (
                <Sun size={19} />
              )}
            </button>

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              ♧
              <span />
            </button>

            <div className="topbar-user">
              <div className="profile-avatar">U</div>

              <div>
                <strong>My Account</strong>
                <small>Startup Founder</small>
              </div>
            </div>

          </div>
        </header>

        <section className="page-container">
          <Outlet />
        </section>

        <footer className="app-footer">
          <span>© 2026 LaunchCraft</span>
          <span>Build smarter. Launch faster.</span>
        </footer>

      </main>
    </div>
  );
};

export default MainLayout;
