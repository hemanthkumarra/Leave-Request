import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldAlert, 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Save, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State to hold profile stats or database-level record
  const [dbRecord, setDbRecord] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/profile');
        const data = response.data;
        setDbRecord(data);
        setFormData({
          username: data.username || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (err) {
        console.error('Failed to load profile details:', err);
        toast.error('Failed to retrieve profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const { username, email, phoneNumber, newPassword, confirmPassword } = formData;

    if (!username.trim()) {
      toast.error('Username cannot be empty.');
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }
    if (!phoneNumber.trim()) {
      toast.error('Phone number cannot be empty.');
      return false;
    }
    // Verify phone number is valid digits
    if (!/^\+?[0-9\s-]{8,15}$/.test(phoneNumber.trim())) {
      toast.error('Please enter a valid phone number (8-15 digits).');
      return false;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long.');
        return false;
      }
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    const { username, email, phoneNumber, newPassword } = formData;

    const updatePayload = {
      username: username.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber.trim(),
      newPassword: newPassword ? newPassword : null,
    };

    const res = await updateProfile(updatePayload);
    setSubmitting(false);

    if (res.success) {
      // Update local dbRecord representation
      setDbRecord((prev) => ({
        ...prev,
        username: updatePayload.username,
        email: updatePayload.email,
        phoneNumber: updatePayload.phoneNumber,
      }));
      // Clear password fields on success
      setFormData((prev) => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
      }));
    }
  };

  const handleBack = () => {
    if (user?.role === 'HR') {
      navigate('/hr');
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">
          Loading Profile Information...
        </p>
      </div>
    );
  }

  // Generate beautiful avatar initials
  const initials = formData.username
    ? formData.username.substring(0, 2).toUpperCase()
    : 'US';

  const isHr = dbRecord?.role === 'HR' || user?.role === 'HR';

  return (
    <div className="relative min-h-[90vh] py-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Radiant glow decorations in background */}
      <div className="glow-background top-10 left-10" />
      <div className="glow-background bottom-10 right-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <button
              onClick={handleBack}
              className="group flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#151837] dark:hover:text-indigo-400 transition-colors duration-200 mb-2 focus:outline-none"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#151837] dark:text-slate-100">
              Profile Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your corporate identity, password security, and notifications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile overview card */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden h-full">
              
              {/* Top accent badge */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              {/* Outer glowing border for Avatar */}
              <div className="relative my-6 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-indigo-300">
                    {initials}
                  </span>
                </div>
              </div>

              {/* Identity details */}
              <h2 className="text-xl font-bold text-[#151837] dark:text-slate-100 tracking-tight">
                {formData.username}
              </h2>
              
              <div className="mt-2 mb-6">
                {isHr ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-300/30 dark:border-amber-500/30 shadow-sm">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    HR Administrator
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/10 border border-indigo-300/30 dark:border-indigo-500/30 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    Corporate Employee
                  </span>
                )}
              </div>

              {/* Brief credentials overview list */}
              <div className="w-full space-y-4 border-t border-slate-200/50 dark:border-slate-700/50 pt-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-slate-500 dark:text-slate-450 border border-slate-200 dark:border-slate-800">
                    <Mail className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Email Address</p>
                    <p className="text-sm font-medium text-slate-750 dark:text-slate-250 truncate">{formData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-slate-500 dark:text-slate-450 border border-slate-200 dark:border-slate-800">
                    <Phone className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Phone Number</p>
                    <p className="text-sm font-medium text-slate-750 dark:text-slate-250">{formData.phoneNumber || 'Not Assigned'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center text-xs text-slate-450 dark:text-slate-500 max-w-[200px]">
                Authentication claims are encoded in your secure browser session JWT token.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit fields form */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 sm:p-8">
              
              <h3 className="text-lg font-bold text-[#151837] dark:text-slate-100 border-b border-slate-200/50 dark:border-slate-700/50 pb-4 mb-6">
                Personal Identity & Security Information
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Row 1: Username & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Username field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl glow-input focus:outline-none transition-all text-sm font-medium"
                        placeholder="Enter username"
                        required
                      />
                    </div>
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl glow-input focus:outline-none transition-all text-sm font-medium"
                        placeholder="Enter email"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Phone Number Field */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl glow-input focus:outline-none transition-all text-sm font-medium"
                        placeholder="e.g. +1234567890"
                        required
                      />
                    </div>
                  </div>

                  {/* Statically display Role (Cannot be changed directly from settings) */}
                  <div className="space-y-2 opacity-75">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350">
                      Role / Position
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <ShieldAlert className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={isHr ? 'HR Administrator' : 'Employee'}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Change Alert Information Banner */}
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Leave the **New Password** fields empty if you do not want to change your current password. Modifying your username requires a session claims refresh, which is done automatically.
                  </p>
                </div>

                {/* Row 3: Password Changes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  
                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-650 dark:text-slate-350">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-10 py-2.5 bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl glow-input focus:outline-none transition-all text-sm font-medium"
                        placeholder="Leave empty to keep current"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#151837] dark:text-slate-350">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl glow-input focus:outline-none transition-all text-sm font-medium"
                        placeholder="Repeat new password"
                      />
                    </div>
                  </div>
                </div>

                {/* Password match indicator message */}
                {formData.newPassword && (
                  <div className="flex items-center gap-1.5 text-xs">
                    {formData.newPassword === formData.confirmPassword ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Passwords match perfectly
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 dark:text-rose-455 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
                        Passwords do not match yet
                      </span>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-300 font-semibold text-sm focus:outline-none"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#151837] hover:bg-[#202450] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-md transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed glow-btn-indigo"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
