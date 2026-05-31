import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Calendar, User, FileText, Check, X, ShieldAlert, ArrowRight, MessageCircle, Mail, Phone } from 'lucide-react';

const Modal = ({ request, onClose, onResolve, resolving }) => {
  const [comments, setComments] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    if (request) {
      setComments(request.hrComments || '');
    }
  }, [request]);

  if (!request) return null;

  const handleAction = (status) => {
    onResolve(request.id, status, comments);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">
                Reviewing Leave Request
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Submitted by <span className="text-slate-700 dark:text-slate-300 font-semibold">{request.employeeName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
          >
            Cancel
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-550 dark:text-slate-400">Employee Name</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-300">{request.employeeName}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-550 dark:text-slate-400">Start Date</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-300">{request.startDate}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-555 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-550 dark:text-slate-400">Duration (Days)</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-300">{request.days} {request.days === 1 ? 'Day' : 'Days'}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-3 overflow-hidden">
              <Mail className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-550 dark:text-slate-400">Email Address</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-300 truncate" title={request.employeeEmail}>{request.employeeEmail || 'N/A'}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-3">
              <Phone className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-550 dark:text-slate-400">Phone Number</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-300">{request.employeePhone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" /> Brief Reason for Leave
            </h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-750 dark:text-slate-300 text-sm font-medium">
              {request.briefReason}
            </div>
          </div>

          {/* Handover Plan Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" /> Task Handover Plan
            </h4>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-750 dark:text-slate-300 text-sm leading-relaxed">
              {request.handoverPlan}
            </div>
          </div>

          {/* AI generated letter display */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Official AI-Generated Letter
            </h4>
            <div className="p-5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl shadow-inner font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
              {request.aiGeneratedLetter}
            </div>
          </div>

          {/* HR Comments input section */}
          <div className="space-y-2 border-t border-slate-200 dark:border-slate-800/80 pt-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-indigo-550 dark:text-indigo-400" /> HR Comments & Feedback (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="e.g. Leave approved. Please complete the handovers as discussed. / Rejected due to critical release window scheduled that week."
              rows="3"
              disabled={resolving || request.status !== 'PENDING'}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all placeholder-slate-400 dark:placeholder-slate-650 disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Modal Footer / Action controls or Read-only Status banner */}
        {request.status !== 'PENDING' ? (
          <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Decision Recorded:</span>
              {request.status === 'ACCEPTED' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-300/20 dark:border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" /> Approved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-300/20 dark:border-rose-500/20">
                  <X className="w-3.5 h-3.5" /> Rejected
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-250 dark:border-slate-750 transition-all duration-300"
            >
              Close Review
            </button>
          </div>
        ) : (
          <div className="px-6 py-4.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAction('REJECTED')}
              disabled={resolving}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/10 transition-all duration-300"
            >
              <X className="w-4 h-4" />
              Reject Request
            </button>

            <button
              onClick={() => handleAction('ACCEPTED')}
              disabled={resolving}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 transition-all duration-300"
            >
              <Check className="w-4 h-4" />
              Approve Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
