import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Clock, ChevronRight, MessageSquare, AlertCircle, FileText, CheckCircle, XCircle } from 'lucide-react';

const LeaveRequestsTable = ({ requests, loading }) => {
  const [selectedLetter, setSelectedLetter] = useState(null);
  const { theme } = useTheme();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-300/30 dark:border-emerald-500/20 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-300/30 dark:border-rose-500/20 shadow-sm">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-300/30 dark:border-amber-500/20 shadow-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Loading leave requests history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-555 dark:text-indigo-400" />
            My Requests History
          </h3>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 text-indigo-650 dark:text-indigo-400 px-2.5 py-1 rounded-lg">
            {requests.length} Requests Total
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="h-14 w-14 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7" />
            </div>
            <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-1">No leave requests found</h4>
            <p className="text-slate-500 text-sm max-w-sm">
              Use the form on the left to generate and submit your first leave request letter!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Brief Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">HR Comments</th>
                  <th className="px-6 py-4 text-right">Letter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-300">
                      {req.startDate}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {req.days} {req.days === 1 ? 'day' : 'days'}
                    </td>
                    <td className="px-6 py-4.5 text-sm text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                      {req.briefReason}
                    </td>
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4.5 text-sm max-w-[220px]">
                      {req.hrComments ? (
                        <span className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 p-2 rounded-lg text-xs leading-relaxed">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                          {req.hrComments}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 text-xs italic">No comments</span>
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLetter(req)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-550/5 dark:bg-indigo-500/10 hover:bg-indigo-500/15 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View
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

      {/* Modal for viewing submitted letter */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/60">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-550 dark:text-indigo-400" />
                  Leave Request Letter Details
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Requested starting {selectedLetter.startDate} for {selectedLetter.days} days
                </p>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Handover Plan Card */}
              <div className="p-4.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
                  Handover Plan
                </h5>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {selectedLetter.handoverPlan}
                </p>
              </div>

              {/* Letter Card */}
              <div className="p-4.5 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-900 rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
                  Official Letter Content
                </h5>
                <p className="text-sm text-slate-800 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed bg-white dark:bg-slate-950/30 p-4 border border-slate-200 dark:border-slate-900 rounded-lg">
                  {selectedLetter.aiGeneratedLetter}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestsTable;
