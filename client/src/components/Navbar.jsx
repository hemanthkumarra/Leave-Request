import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, ShieldAlert, Sparkles, Sun, Moon, User, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  const isHr = user.role === 'HR';

  return (
    <nav className="glass-panel sticky top-0 z-40 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shadow-md">
      {/* Brand logo & name */}
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-3 cursor-pointer select-none group"
      >
        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold relative overflow-hidden">
          <Calendar className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div>
          <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 via-indigo-900 to-indigo-950 dark:from-indigo-200 dark:via-indigo-100 dark:to-indigo-300 tracking-tight">
            Leave<span className="text-indigo-600 dark:text-indigo-400">Tracker</span>
          </span>
          <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400/70 border border-indigo-200 dark:border-indigo-500/30 px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/5">
            MVP
          </span>
        </div>
      </div>

      {/* User profile & actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/40 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-xl transition-all duration-300 shadow-sm focus:outline-none"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Settings Button */}
        <button
          onClick={() => navigate('/profile')}
          className="p-2.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/40 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 rounded-xl transition-all duration-300 shadow-sm focus:outline-none"
          title="Profile Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-800 cursor-pointer hover:opacity-85 transition-opacity group"
          title="View Profile Settings"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.username}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
          
          {/* Custom Avatar / Role badge wrapper */}
          <div className="flex items-center gap-2">
            {isHr ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-300/30 dark:border-amber-500/30 px-2.5 py-1 rounded-full shadow-inner">
                <ShieldAlert className="w-3 h-3 text-amber-555" />
                HR Administrator
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 border border-indigo-300/30 dark:border-indigo-500/30 px-2.5 py-1 rounded-full shadow-inner">
                <Sparkles className="w-3 h-3" />
                Employee
              </span>
            )}
            
            <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-455 rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:border-indigo-500 dark:group-hover:border-indigo-400 transition-colors">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-slate-550 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-455 text-sm font-semibold bg-slate-100 dark:bg-slate-800/40 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-500/25 px-3 py-2 rounded-lg transition-all duration-300"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
