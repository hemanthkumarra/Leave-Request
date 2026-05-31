import React, { useState, useEffect, useCallback } from 'react';
import LeaveRequestForm from '../components/LeaveRequestForm';
import LeaveRequestsTable from '../components/LeaveRequestsTable';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, CheckCircle2, Hourglass } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/leaves/my-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to retrieve leave history', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  // Compute simple statistics
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'ACCEPTED').length;
  const totalDays = requests.filter(r => r.status === 'ACCEPTED').reduce((sum, r) => sum + r.days, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3 tracking-tight">
            <span className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <LayoutDashboard className="w-6 h-6" />
            </span>
            Employee Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Generate formal AI leave requests, track submission statuses, and view feedback.
          </p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 flex items-center gap-4.5">
          <div className="h-12 w-12 bg-amber-500/10 border border-amber-350/20 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold shadow-sm shadow-amber-500/5">
            <Hourglass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Pending Requests</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-200 mt-0.5">{pendingCount}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 flex items-center gap-4.5">
          <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-350/20 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold shadow-sm shadow-emerald-500/5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Approved Leaves</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-200 mt-0.5">{approvedCount}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 flex items-center gap-4.5">
          <div className="h-12 w-12 bg-indigo-500/10 border border-indigo-350/20 dark:border-indigo-500/20 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold shadow-sm shadow-indigo-500/5">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Days Approved</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-200 mt-0.5">{totalDays} Days</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on left, history on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <LeaveRequestForm onRequestSubmitted={fetchMyRequests} />
        </div>
        <div className="lg:col-span-7">
          <LeaveRequestsTable requests={requests} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
