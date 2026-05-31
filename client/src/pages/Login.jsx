import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, Shield, Briefcase, Eye, EyeOff, Sun, Moon, Calendar, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, signup, isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'EMPLOYEE',
  });

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      if (user.role === 'HR') {
        navigate('/hr');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, phoneNumber, role } = formData;

    if (isLoginTab) {
      if (!username || !password) {
        toast.error('Please enter both your credentials!');
        return;
      }
      const res = await login(username, password);
      if (res.success) {
        if (res.role === 'HR') navigate('/hr');
        else navigate('/dashboard');
      }
    } else {
      if (!username || !email || !password || !confirmPassword || !phoneNumber) {
        toast.error('Please fill in all registration fields!');
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match. Please verify your confirmation password.');
        return;
      }
      const res = await signup(username, email, password, role, phoneNumber);
      if (res.success) {
        if (res.role === 'HR') navigate('/hr');
        else navigate('/dashboard');
      }
    }
  };

  // Clear fields when toggling tabs to prevent unexpected states
  const handleTabChange = (isLogin) => {
    setIsLoginTab(isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      role: 'EMPLOYEE',
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-transparent">
      
      {/* Top Navigation Bar / Div Bar (Stays Dark) */}
      <div className="dark-glass-panel w-full absolute top-0 left-0 z-30 px-6 py-4 flex items-center justify-between shadow-md">
        {/* Brand logo & name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold relative overflow-hidden group">
            <Calendar className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-indigo-100 to-indigo-300 tracking-tight">
              Leave<span className="text-indigo-400">Tracker</span>
            </span>
          </div>
        </div>

        {/* Action Toggle Items in Top Right */}
        <div className="flex items-center gap-4">
          
          {/* Tab Selector */}
          <div className="flex p-1 bg-slate-900/60 rounded-xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => handleTabChange(true)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all focus:outline-none ${isLoginTab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(false)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all focus:outline-none ${!isLoginTab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Sign Up
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 bg-slate-800/40 hover:bg-slate-700/80 border border-slate-800 text-indigo-400 hover:text-indigo-300 rounded-xl transition-all duration-300 shadow-sm focus:outline-none"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Decorative Glow Backgrounds */}
      <div className="glow-background top-24 left-10" />
      <div className="glow-background bottom-10 right-10" />

      {/* Main Panel Box - Centered in Middle */}
      <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800/80 relative z-10 transition-all duration-300 mt-24 mb-10">

        {/* Top Header Branding inside Card */}
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4 text-white">
            {isLoginTab ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            {isLoginTab ? 'Enterprise Sign In' : 'Create Account'}
          </h2>
          <p className="text-slate-550 dark:text-slate-455 text-xs mt-1.5 leading-relaxed">
            {isLoginTab 
              ? 'Access your Leave Tracker employee or administrator workspace.' 
              : 'Register your enterprise account as an Employee or HR Manager.'}
          </p>
        </div>

        {/* Auth Forms */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username / UsernameOrEmail Field */}
          <div>
            <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest mb-1.5">
              {isLoginTab ? 'Username or Email' : 'Username'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder={isLoginTab ? 'admin / employee / email' : 'johndoe'}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all placeholder-slate-400 dark:placeholder-slate-650"
              />
            </div>
          </div>

          {/* Email Field (Signup Only) */}
          {!isLoginTab && (
            <div>
              <label className="block text-[10px] font-bold text-slate-555 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="johndoe@company.com"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all placeholder-slate-400 dark:placeholder-slate-650"
                />
              </div>
            </div>
          )}

          {/* Phone Number Field (Signup Only) */}
          {!isLoginTab && (
            <div>
              <label className="block text-[10px] font-bold text-slate-555 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all placeholder-slate-400 dark:placeholder-slate-650"
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-bold text-slate-555 dark:text-slate-400 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-10 py-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all placeholder-slate-400 dark:placeholder-slate-650"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Signup Only) */}
          {!isLoginTab && (
            <div>
              <label className="block text-[10px] font-bold text-slate-555 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-10 py-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all placeholder-slate-400 dark:placeholder-slate-650"
                />
              </div>
            </div>
          )}

          {/* Role Selector Field (Signup Only) */}
          {!isLoginTab && (
            <div>
              <label className="block text-[10px] font-bold text-slate-555 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                Organizational Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border rounded-xl cursor-pointer text-slate-650 dark:text-slate-300 transition-all ${formData.role === 'EMPLOYEE'
                    ? 'border-indigo-500/60 bg-indigo-500/5 text-indigo-750 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-700/60'
                  }`}>
                  <input
                    type="radio"
                    name="role"
                    value="EMPLOYEE"
                    checked={formData.role === 'EMPLOYEE'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <Briefcase className="w-4 h-4 text-indigo-550 dark:text-indigo-400" />
                  <span className="text-xs font-semibold">Employee</span>
                </label>

                <label className={`flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border rounded-xl cursor-pointer text-slate-650 dark:text-slate-300 transition-all ${formData.role === 'HR'
                    ? 'border-amber-500/60 bg-amber-500/5 text-amber-750 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700/60'
                  }`}>
                  <input
                    type="radio"
                    name="role"
                    value="HR"
                    checked={formData.role === 'HR'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <Shield className="w-4 h-4 text-amber-550 dark:text-amber-400" />
                  <span className="text-xs font-semibold">HR Manager</span>
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 glow-btn-indigo mt-6 transition-all duration-300"
          >
            {isLoginTab ? (
              <>
                <LogIn className="w-4 h-4" /> Sign In Securely
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Create New Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
