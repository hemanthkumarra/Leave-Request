import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { ShieldAlert, Users, Hourglass, CheckCircle2, XCircle, Search, AlertCircle, FileText, ChevronRight } from 'lucide-react';

const HrDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [resolving, setResolving] = useState(false);
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchAllRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/hr/leaves');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to load employee leaves.', error);
      toast.error('Could not fetch employee leave requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRequests();
  }, [fetchAllRequests]);

  const handleResolveLeave = async (id, status, hrComments) => {
    setResolving(true);
    const loadToast = toast.loading('Recording decision...');
    
    try {
      await api.put(`/hr/leaves/${id}/status`, { status, hrComments });
      toast.success(`Request successfully ${status === 'ACCEPTED' ? 'Approved' : 'Rejected'}!`, { id: loadToast });
      setSelectedRequest(null);
      fetchAllRequests(); // Reload listings
    } catch (error) {
      toast.error('Failed to record leave decision.', { id: loadToast });
    } finally {
      setResolving(false);
    }
  };

  // Compute metrics
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'ACCEPTED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;

  // Filter & Search logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.briefReason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-300/20 dark:border-emerald-500/20';
      case 'REJECTED':
        return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-300/20 dark:border-rose-500/20';
      default:
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-300/20 dark:border-amber-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Dashboard Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3 tracking-tight">
          <span className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </span>
          HR Manager Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Review, analyze, and manage official employee leave applications with AI letter validation.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 flex items-center gap-4">
          <div className="h-11 w-11 bg-indigo-500/10 border border-indigo-300/20 dark:border-indigo-500/20 text-indigo-650 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-450">Total Leaves</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">{totalCount}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 flex items-center gap-4">
          <div className="h-11 w-11 bg-amber-500/10 border border-amber-300/20 dark:border-amber-500/20 text-amber-650 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold">
            <Hourglass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-455">Pending</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">{pendingCount}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 flex items-center gap-4">
          <div className="h-11 w-11 bg-emerald-500/10 border border-emerald-300/20 dark:border-emerald-500/20 text-emerald-650 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-455">Approved</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">{approvedCount}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 flex items-center gap-4">
          <div className="h-11 w-11 bg-rose-500/10 border border-rose-300/20 dark:border-rose-500/20 text-rose-650 dark:text-rose-400 rounded-xl flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-455">Rejected</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">{rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* Main Request Registry Table Grid */}
      <div className="space-y-5">
        
        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800/60 p-4.5 rounded-2xl">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Employee or Reason..."
              className="w-full bg-white dark:bg-white border border-slate-250 dark:border-slate-300 rounded-xl pl-9 pr-4 py-2 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/40 glow-input"
            />
          </div>

          {/* Tab Filters */}
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  statusFilter === filter
                    ? 'bg-indigo-600 text-white border-indigo-650 shadow-sm'
                    : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800'
                }`}
              >
                {filter === 'ALL' ? 'All Requests' : filter.charAt(0) + filter.substring(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="glass-card rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center">
              <div className="h-9 w-9 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Retrieving registry requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="h-14 w-14 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h4 className="text-slate-700 dark:text-slate-350 font-bold mb-1">No leave requests match the filters</h4>
              <p className="text-slate-500 text-xs max-w-xs">
                No matching entries were found. Try adjusting your search query or selecting a different status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Start Date</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8.5 w-8.5 bg-slate-100 dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 font-bold rounded-lg flex items-center justify-center text-xs">
                            {req.employeeName.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{req.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {req.startDate}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {req.days} {req.days === 1 ? 'day' : 'days'}
                      </td>
                      <td className="px-6 py-4.5 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                        {req.briefReason}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-inner ${getBadgeStyle(req.status)}`}>
                          {req.status.charAt(0) + req.status.substring(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            req.status === 'PENDING'
                              ? 'text-indigo-650 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-350/20 hover:border-indigo-350/30 dark:border-indigo-500/20 dark:hover:border-indigo-500/30'
                              : 'text-slate-600 dark:text-slate-450 hover:text-slate-850 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 border-slate-250 dark:border-slate-800'
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {req.status === 'PENDING' ? 'Review & Resolve' : 'View Decision'}
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal Dialog */}
      {selectedRequest && (
        <Modal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onResolve={handleResolveLeave}
          resolving={resolving}
        />
      )}
    </div>
  );
};

export default HrDashboard;
