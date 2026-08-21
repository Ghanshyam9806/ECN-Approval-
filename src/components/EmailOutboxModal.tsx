import React from 'react';
import { NotificationEmail } from '../types';
import { X, Mail, Link2, Copy, CheckCircle2, ArrowUpRight, Send } from 'lucide-react';

interface EmailOutboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: NotificationEmail[];
  onOpenEcnById: (ecnId: string) => void;
}

export const EmailOutboxModal: React.FC<EmailOutboxModalProps> = ({
  isOpen,
  onClose,
  emails,
  onOpenEcnById
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col my-auto overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 rounded-lg text-slate-950">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold">Mail Outbox & ECN Link Dispatch Log</h3>
              <p className="text-xs text-slate-400">Immediate email notifications sent from Requester's ID to Department Approvers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {emails.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Emails Dispatched Yet</p>
              <p className="text-xs text-slate-400">Submit an ECN request to automatically generate and send email notifications to approvers.</p>
            </div>
          ) : (
            emails.map((mail) => (
              <div
                key={mail.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-blue-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{mail.subject}</span>
                    <span className="text-[11px] text-slate-500">
                      From: <strong className="text-slate-800">{mail.fromEmail}</strong> ({mail.fromName})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Delivered ({mail.sentAt})
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    <strong className="text-slate-800">To Approver:</strong> {mail.toEmail} ({mail.toDepartment})
                  </p>
                  <p className="whitespace-pre-line bg-white p-2.5 rounded border border-slate-200 text-slate-700 text-[11px] font-mono leading-relaxed">
                    {mail.body}
                  </p>
                </div>

                {/* Direct Link Trigger Box */}
                <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-1 text-xs font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 truncate max-w-md">
                    <Link2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{mail.uniqueLink}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(mail.uniqueLink);
                        alert(`Link copied to clipboard!\n${mail.uniqueLink}`);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded border border-slate-300 transition inline-flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Link</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenEcnById(mail.ecnId);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow transition inline-flex items-center space-x-1"
                    >
                      <span>Open ECN</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
          >
            Close Outbox
          </button>
        </div>

      </div>
    </div>
  );
};
