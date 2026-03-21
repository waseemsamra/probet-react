import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

function MainLayout() {
  const location = useLocation();
  const [horseRacingSubmenuOpen, setHorseRacingSubmenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleHorseRacingSubmenu = () => {
    setHorseRacingSubmenuOpen(!horseRacingSubmenuOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shadow-lg flex-shrink-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              P
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-800">ProBet</h1>
              <p className="text-xs text-slate-500 font-medium">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Main</p>
            <Link to="/" className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${isActive('/') ? 'bg-slate-50 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Dashboard
            </Link>
            <Link to="/analytics" className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${isActive('/analytics') ? 'bg-slate-50 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Analytics
            </Link>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Betting Categories</p>

            {/* Horse Racing with Submenu */}
            <div className="mb-2">
              <button onClick={toggleHorseRacingSubmenu} className="sidebar-item w-full flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Horse Racing
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">LIVE</span>
                  <svg className={`w-4 h-4 transition-transform ${horseRacingSubmenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </button>
              <div className={`ml-4 mt-1 space-y-1 ${horseRacingSubmenuOpen ? '' : 'hidden'}`}>
                <Link to="/horse-racing" className={`block px-3 py-2 text-sm rounded-lg font-medium ${isActive('/horse-racing') ? 'bg-slate-50 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>All Horse Racing</Link>
                <a href="#" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg font-medium">UK & Ireland</a>
                <a href="#" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg font-medium">International</a>
                <a href="#" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Greyhounds</a>
                <a href="#" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg font-medium">Virtual Racing</a>
              </div>
            </div>

            <Link to="/football" className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${isActive('/football') ? 'bg-slate-50 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Football
            </Link>

            <a href="#" className="sidebar-item flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Esports
            </a>

            <Link to="/casino" className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${isActive('/casino') ? 'bg-slate-50 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Casino
            </Link>

            <Link to="/all-sports" className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${isActive('/all-sports') ? 'bg-slate-50 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              All Sports
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Management</p>
            <Link to="/users" className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${isActive('/users') ? 'bg-slate-50 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Users
            </Link>
            <Link to="/reports" className={`sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${isActive('/reports') ? 'bg-slate-50 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Reports
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Alex Morgan</p>
              <p className="text-xs text-slate-500 truncate">Super Admin</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
