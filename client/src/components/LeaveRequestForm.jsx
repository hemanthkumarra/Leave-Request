import React, { useState } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { Sparkles, Send, FileText, Calendar, Clock, HelpCircle, Briefcase, RefreshCw } from 'lucide-react';

const LeaveRequestForm = ({ onRequestSubmitted }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    days: 1,
    briefReason: '',
    handoverPlan: '',
  });

  const [aiLetter, setAiLetter] = useState('');
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'days' ? parseInt(value) || 1 : value,
    }));
  };

  const handleGenerateLetter = async () => {
    const { startDate, days, briefReason, handoverPlan } = formData;
    
    // Field validations
    if (!startDate || !briefReason || !handoverPlan) {
      toast.error('Please complete all form fields first!');
      return;
    }
    if (days < 1) {
      toast.error('Duration must be at least 1 day.');
      return;
    }

    setGenerating(true);
    const loadToast = toast.loading('Gemini is writing your formal request...');
    
    try {
      const response = await api.post('/leaves/generate-preview', {
        startDate,
        days,
        briefReason,
        handoverPlan,
      });

      setAiLetter(response.data.letter);
      setShowLetterModal(true);
      toast.success('AI Request Letter successfully generated!', { id: loadToast });
    } catch (error) {
      toast.error('Failed to generate AI letter. Please try again.', { id: loadToast });
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!aiLetter) {
      toast.error('Please generate your professional letter first!');
      return;
    }

    setSubmitting(true);
    const loadToast = toast.loading('Submitting leave request...');

    try {
      await api.post('/leaves', {
        ...formData,
        aiGeneratedLetter: aiLetter,
      });

      toast.success('Leave request submitted successfully!', { id: loadToast });
      
      // Reset form & close modal
      setFormData({
        startDate: '',
        days: 1,
        briefReason: '',
        handoverPlan: '',
      });
      setAiLetter('');
      setShowLetterModal(false);
      
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }
    } catch (error) {
      toast.error('Submission failed. Please try again.', { id: loadToast });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Main Form UI (Scoped in its own Glass Card) */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2.5">
          <span className="p-2 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 rounded-lg">
            <Calendar className="w-5 h-5" />
          </span>
          New Leave Request Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Start Date and Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-55 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Duration (Days)
              </label>
              <input
                type="number"
                name="days"
                min="1"
                value={formData.days}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-55 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all"
              />
            </div>
          </div>

          {/* Reason for leave */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Brief Reason for Leave
            </label>
            <input
              type="text"
              name="briefReason"
              value={formData.briefReason}
              onChange={handleInputChange}
              placeholder="e.g. Family wedding, Medical procedure, Annual vacation"
              required
              className="w-full bg-slate-55 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all"
            />
          </div>

          {/* Handover plan */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Task Handover Plan
            </label>
            <textarea
              name="handoverPlan"
              rows="3"
              value={formData.handoverPlan}
              onChange={handleInputChange}
              placeholder="e.g. Pre-recorded briefing for team; Alice will handle high-priority user alerts during my leave; all client boards updated."
              required
              className="w-full bg-slate-55 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-200 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 glow-input transition-all"
            />
          </div>

          {/* AI Letter Generator Button */}
          <button
            type="button"
            onClick={handleGenerateLetter}
            disabled={generating || submitting}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-650 via-indigo-550 to-violet-650 dark:from-indigo-600 dark:via-indigo-500 dark:to-violet-600 hover:from-indigo-550 hover:to-violet-550 dark:hover:from-indigo-500 dark:hover:to-violet-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 glow-btn-indigo disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {generating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            )}
            {aiLetter ? 'Regenerate Formal AI Letter' : 'Generate Professional AI Letter'}
          </button>

          {/* Button to re-open the draft modal if it's already generated but closed */}
          {aiLetter && (
            <button
              type="button"
              onClick={() => setShowLetterModal(true)}
              className="w-full py-3.5 bg-indigo-55 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-550/20 text-indigo-650 dark:text-indigo-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
            >
              <FileText className="w-4 h-4" />
              Open & Edit Generated AI Letter
            </button>
          )}
        </form>
      </div>

      {/* Spacious Full Screen Popup Dialog for Editing AI Letter (Sibling to card, not nested inside it) */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/60">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
                  Edit Generated AI Leave Letter
                </h4>
                <p className="text-xs text-slate-505 dark:text-slate-400 mt-1">
                  Please review, refine, and finalize your formal letter before official submission.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLetterModal(false)}
                className="text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Close Preview
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-900 rounded-xl p-5 shadow-inner">
                <textarea
                  value={aiLetter}
                  onChange={(e) => setAiLetter(e.target.value)}
                  rows="14"
                  className="w-full bg-transparent text-slate-800 dark:text-slate-300 text-sm font-mono leading-relaxed focus:outline-none resize-none"
                  placeholder="Review and adjust your generated letter here..."
                />
              </div>
              <p className="text-[11px] text-slate-550 dark:text-slate-400 italic">
                * Note: You can customize or edit any section of the letter directly inside the text box above. Your changes are saved as a draft.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => setShowLetterModal(false)}
                className="px-5 py-2.5 bg-slate-150 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-250 dark:border-slate-750 transition-all duration-300"
              >
                Keep Draft & Close
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-650/20 disabled:opacity-50 transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                Submit Official Leave Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveRequestForm;
