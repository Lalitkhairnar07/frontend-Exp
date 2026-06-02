import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Controls mobile drawer
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch current user details for the profile section
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/user/me');
        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error('Error fetching user for navbar:', err);
      }
    };
    fetchUser();
  }, [location.pathname]); // Re-run when page changes in case profile changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Grouped Navigation Structure
  const navigationGroups = [
    {
      title: 'Overview',
      links: [
        {
          name: 'Dashboard',
          path: '',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
        {
          name: 'Analytics',
          path: 'reports',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Transactions',
      links: [
        {
          name: 'My Expenses',
          path: 'my-expenses',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
        },
        {
          name: 'Add Expense',
          path: 'add-expense',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Budgets',
      links: [
        {
          name: 'My Budgets',
          path: 'budget',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          ),
        },
        {
          name: 'Add Budget',
          path: 'add-budget',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Categories',
      links: [
        {
          name: 'My Categories',
          path: 'my-categories',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
        },
        {
          name: 'Add Category',
          path: 'add-category',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          ),
        },
      ],
    },
  ];

  // Render nav link content
  const renderNavLink = (link, key) => (
    <NavLink
      key={key}
      to={link.path}
      end={link.path === ''}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 group gap-3 ${
          isActive
            ? 'bg-indigo-600/15 border-l-4 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-600/5'
            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-l-4 border-transparent'
        }`
      }
    >
      <span className="shrink-0 transition-colors group-hover:text-indigo-400">
        {link.icon}
      </span>
      <span>{link.name}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col lg:flex-row">
      
      {/* 1. DESKTOP SIDEBAR - FIXED LEFT */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 h-screen sticky top-0">
        {/* Brand/Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20">
              E
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent tracking-tight">
              ExpTrack
            </span>
          </div>
        </div>

        {/* Sidebar Nav Content */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7 scrollbar-thin scrollbar-thumb-slate-800">
          {navigationGroups.map((group, index) => (
            <div key={index} className="space-y-2">
              <span className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest block">
                {group.title}
              </span>
              <div className="space-y-1">
                {group.links.map((link, linkIdx) => renderNavLink(link, linkIdx))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Account / Footer Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          {user ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-950/40 border border-slate-800/40">
              <NavLink to="profile" className="flex items-center gap-3 group flex-1 min-w-0">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="User profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-md">
                    {getInitials()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </NavLink>
              
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="animate-pulse flex items-center space-x-4 p-2 bg-slate-950/40 rounded-2xl border border-slate-800/40">
              <div className="rounded-full bg-slate-800 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                <div className="h-2 bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MOBILE HEADER & NAVIGATION */}
      <header className="lg:hidden h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40 w-full shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-indigo-500/20">
            E
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
            ExpTrack
          </span>
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* 3. MOBILE SIDEBAR DRAWER OVERLAY */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Drawer content */}
          <aside className="relative flex flex-col w-72 max-w-xs bg-slate-900 border-r border-slate-800 h-full p-6 animate-slide-in-left shadow-2xl">
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-extrabold text-base">
                  E
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
                  ExpTrack
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 overflow-y-auto space-y-6">
              {navigationGroups.map((group, index) => (
                <div key={index} className="space-y-1">
                  <span className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest block">
                    {group.title}
                  </span>
                  <div className="space-y-1">
                    {group.links.map((link, linkIdx) => renderNavLink(link, linkIdx))}
                  </div>
                </div>
              ))}
            </nav>

            {/* Drawer User Account footer */}
            <div className="pt-6 border-t border-slate-800 mt-auto bg-slate-900">
              {user ? (
                <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-950/40 border border-slate-800/40">
                  <NavLink to="profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 flex-1 min-w-0">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="Profile Pic"
                        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                        {getInitials()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-200 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="animate-pulse flex items-center space-x-4 p-2 bg-slate-950/40 rounded-2xl border border-slate-800/40">
                  <div className="rounded-full bg-slate-800 h-10 w-10"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* 4. MAIN LAYOUT AND ROUTE CONTENT */}
      <main className="flex-1 w-full min-h-screen bg-slate-950 flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};