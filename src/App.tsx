import React, { useState, useEffect } from 'react';
import { EcnRecord, UserProfile, AuditLog, NotificationEmail, ApprovalState } from './types';
import { 
  getStoredEcns, 
  saveEcns, 
  getStoredLogs, 
  addAuditLog, 
  getStoredEmails, 
  saveEmailNotification, 
  getStoredActiveUser, 
  saveActiveUser,
  getStoredUsers,
  saveUsers
} from './utils/storageUtils';

import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { EcnFormModal } from './components/EcnFormModal';
import { EcnDetailModal } from './components/EcnDetailModal';
import { EmailOutboxModal } from './components/EmailOutboxModal';
import { AuditLogView } from './components/AuditLogView';
import { RbacManagerView } from './components/RbacManagerView';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { EmailLoginModal } from './components/EmailLoginModal';
import { CheckCircle2, Mail, Link2, X } from 'lucide-react';

export default function App() {
  const [ecns, setEcns] = useState<EcnRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [emails, setEmails] = useState<NotificationEmail[]>([]);
  const [activeUser, setActiveUser] = useState<UserProfile>(getStoredActiveUser());
  const [users, setUsers] = useState<UserProfile[]>(() => getStoredUsers());

  const [activeTab, setActiveTab] = useState<'dashboard' | 'audit' | 'rbac'>('dashboard');

  // Modals state
  const [isNewEcnModalOpen, setIsNewEcnModalOpen] = useState(false);
  const [selectedEcnForDetail, setSelectedEcnForDetail] = useState<EcnRecord | null>(null);
  const [isOutboxModalOpen, setIsOutboxModalOpen] = useState(false);
  const [isDriveSyncModalOpen, setIsDriveSyncModalOpen] = useState(false);
  const [isEmailLoginModalOpen, setIsEmailLoginModalOpen] = useState(false);

  // Toast Banner State
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; link?: string } | null>(null);

  // Initial Load & URL Parameter check
  useEffect(() => {
    const loadedEcns = getStoredEcns();
    const loadedLogs = getStoredLogs();
    const loadedEmails = getStoredEmails();

    setEcns(loadedEcns);
    setAuditLogs(loadedLogs);
    setEmails(loadedEmails);

    // Parse URL query parameter e.g. ?ecnId=ECN-2026-08-001
    const params = new URLSearchParams(window.location.search);
    const queryEcnId = params.get('ecnId');
    if (queryEcnId) {
      const match = loadedEcns.find(e => e.id.toLowerCase() === queryEcnId.toLowerCase());
      if (match) {
        setSelectedEcnForDetail(match);
      }
    }
  }, []);

  // Handle active user persona switch
  const handleSelectUser = (user: UserProfile) => {
    setActiveUser(user);
    saveActiveUser(user);
    
    // Log role switch
    const newLog = addAuditLog(
      user,
      'User Persona Switch',
      `Switched active role persona to ${user.name} (${user.role} - ${user.department})`
    );
    setAuditLogs(getStoredLogs());
  };

  // Search or open ECN by ID or URL
  const handleSearchEcnId = (ecnId: string) => {
    const cleanId = ecnId.split('?ecnId=').pop()?.trim() || ecnId.trim();
    const match = ecns.find(e => e.id.toLowerCase() === cleanId.toLowerCase());
    if (match) {
      setSelectedEcnForDetail(match);
    } else {
      alert(`No ECN record found matching "${cleanId}". Please check the ECN ID.`);
    }
  };

  // Create & Submit new ECN
  const handleSubmitNewEcn = (newEcn: EcnRecord) => {
    const updatedEcns = [newEcn, ...ecns];
    setEcns(updatedEcns);
    saveEcns(updatedEcns);

    // 1. Add Audit Log
    addAuditLog(
      activeUser,
      'ECN Submission & Mail Trigger',
      `Submitted ECN ${newEcn.id} (${newEcn.title}). 3 Inventory checks recorded. Generated unique direct link.`,
      newEcn.id
    );
    setAuditLogs(getStoredLogs());

    // 2. Dispatch Email Notifications to assigned department approvers from Requester ID
    newEcn.approvals.forEach((app) => {
      const notification: NotificationEmail = {
        id: `mail-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ecnId: newEcn.id,
        ecnTitle: newEcn.title,
        fromEmail: activeUser.email,
        fromName: `${activeUser.name} (Requester - ${activeUser.department})`,
        toEmail: app.approverEmail,
        toDepartment: app.department,
        subject: `[ECN ACTION REQUIRED] New Engineering Change Notice ${newEcn.id}`,
        body: `Dear ${app.approverName},\n\nA new Engineering Change Notice (${newEcn.id}) has been created by ${activeUser.name} and requires your department sign-off for ${app.department}.\n\nECN Details:\n- Title: ${newEcn.title}\n- Product Model: ${newEcn.productModel}\n- Stock Check Date: ${newEcn.dateOfStockCheck}\n- Future Implementation Date: ${newEcn.futureDate}\n\nPlease click the direct link below to review Inventory_Check-1, 2, & 3 items and sign off:\n\nDirect Link: ${newEcn.uniqueLink}`,
        uniqueLink: newEcn.uniqueLink,
        sentAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered'
      };
      saveEmailNotification(notification);
    });

    setEmails(getStoredEmails());

    // 3. Show Toast Banner
    setToastMessage({
      title: `ECN ${newEcn.id} Submitted Successfully!`,
      desc: `Notifications sent to ${newEcn.approvals.length} department approvers from ${activeUser.email}.`,
      link: newEcn.uniqueLink
    });

    // Auto open detail view for the newly created ECN
    setSelectedEcnForDetail(newEcn);
  };

  // Manage User Roster
  const handleUpdateUsers = (updatedUsers: UserProfile[]) => {
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    // If active user was deleted, switch to first remaining user
    const exists = updatedUsers.some(u => u.id === activeUser.id);
    if (!exists && updatedUsers.length > 0) {
      setActiveUser(updatedUsers[0]);
      saveActiveUser(updatedUsers[0]);
    }

    addAuditLog(
      activeUser,
      'User Management Roster Updated',
      `Active system user roster updated (${updatedUsers.length} total users).`
    );
    setAuditLogs(getStoredLogs());
  };

  // Email Login Success Handler
  const handleEmailLoginSuccess = (user: UserProfile) => {
    setActiveUser(user);
    saveActiveUser(user);
    addAuditLog(
      user,
      'Email Portal Authentication',
      `User ${user.name} logged in via work email portal (${user.email} - ${user.role} - ${user.department}).`
    );
    setAuditLogs(getStoredLogs());
    setToastMessage({
      title: `Logged in as ${user.name}!`,
      desc: `Authenticated as ${user.role} (${user.department}) via ${user.email}`
    });
  };

  // Register new user from Email Login Modal
  const handleRegisterNewUser = (newUser: UserProfile) => {
    const updated = [...users, newUser];
    handleUpdateUsers(updated);
  };

  // Update Department Approval Sign-off
  const handleUpdateApproval = (
    ecnId: string, 
    department: string, 
    newStatus: ApprovalState, 
    comments: string, 
    signatureStamp: string,
    updatedFutureDate?: string
  ) => {
    const updatedEcns = ecns.map((ecn) => {
      if (ecn.id === ecnId) {
        const updatedApprovals = ecn.approvals.map((app) => {
          if (app.department === department) {
            return {
              ...app,
              status: newStatus,
              comments: comments || app.comments,
              signatureStamp,
              updatedAt: new Date().toLocaleString()
            };
          }
          return app;
        });

        // Calculate overall status
        let newOverallStatus = ecn.status;
        const allApproved = updatedApprovals.every(a => a.status === 'Approved');
        const anyRejected = updatedApprovals.some(a => a.status === 'Rejected');
        const anyRevision = updatedApprovals.some(a => a.status === 'Revision Requested');

        if (allApproved) newOverallStatus = 'Approved';
        else if (anyRejected) newOverallStatus = 'Rejected';
        else if (anyRevision) newOverallStatus = 'Revision Needed';
        else newOverallStatus = 'In Review';

        return {
          ...ecn,
          approvals: updatedApprovals,
          status: newOverallStatus,
          futureDate: updatedFutureDate || ecn.futureDate,
          updatedAt: new Date().toLocaleString()
        };
      }
      return ecn;
    });

    setEcns(updatedEcns);
    saveEcns(updatedEcns);

    // Update currently viewed ECN state
    const current = updatedEcns.find(e => e.id === ecnId);
    if (current) setSelectedEcnForDetail(current);

    // Add Audit Log
    addAuditLog(
      activeUser,
      `Department Sign-off (${newStatus})`,
      `${activeUser.name} (${department}) marked approval status as '${newStatus}' for ECN ${ecnId}. Stamp: ${signatureStamp}`,
      ecnId
    );
    setAuditLogs(getStoredLogs());

    // Send Mail Notification to Requester regarding approval status update
    if (current) {
      const updateMail: NotificationEmail = {
        id: `mail-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ecnId: current.id,
        ecnTitle: current.title,
        fromEmail: activeUser.email,
        fromName: `${activeUser.name} (${department} Approver)`,
        toEmail: current.requesterEmail,
        toDepartment: current.requesterDepartment,
        subject: `[ECN UPDATE] ${department} ${newStatus} for ECN ${current.id}`,
        body: `Dear ${current.requesterName},\n\nThe approval status for ${department} on ECN ${current.id} has been updated to '${newStatus}'.\n\nComments: "${comments || 'N/A'}"\nSigned By: ${activeUser.name} (${signatureStamp})\nFuture Cutoff Date: ${current.futureDate || 'N/A'}\n\nView ECN details: ${current.uniqueLink}`,
        uniqueLink: current.uniqueLink,
        sentAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered'
      };
      saveEmailNotification(updateMail);

      // Automated 1-Day Pre-Cutoff Email Trigger if Future Date is Set
      if (current.futureDate) {
        const reminderMail: NotificationEmail = {
          id: `mail-reminder-${Date.now()}`,
          ecnId: current.id,
          ecnTitle: current.title,
          fromEmail: 'automations@padget.dixoninfo.com',
          fromName: 'Padget Automated 1-Day Pre-Cutoff Notification Engine',
          toEmail: 'concerned.teams@padget.dixoninfo.com',
          toDepartment: 'PRODUCTION',
          subject: `[AUTOMATED 1-DAY PRE-CUTOFF REMINDER] Action Required for ECN ${current.id}`,
          body: `AUTOMATED 1-DAY PRE-CUTOFF NOTIFICATION TO CONCERN TEAMS:\n\nAttention Padget ECN Approval Team (Production, Store, PPC, Purchase, SMT PQC, IE, IQC, PQC, NPI, SMT NPI, SMT Maintenance, Implementation in SAP):\n\nThe implementation cutoff date for ECN ${current.id} (${current.title}) is set for ${current.futureDate} (1 day remaining).\n\nPlease verify Inventory_Check-1, Inventory_Check-2, Inventory_Check-3 stock items and submit pending department approvals immediately.\n\nDirect Link: ${current.uniqueLink}`,
          uniqueLink: current.uniqueLink,
          sentAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: 'Delivered'
        };
        saveEmailNotification(reminderMail);
      }

      setEmails(getStoredEmails());
    }

    setToastMessage({
      title: `${department} Stage ${newStatus}!`,
      desc: `Sign-off saved for ${ecnId}. Notification sent to Requester ${current?.requesterEmail}.`
    });
  };

  const handleRestoreDatabase = (
    importedEcns: EcnRecord[],
    importedLogs: AuditLog[],
    importedEmails: NotificationEmail[]
  ) => {
    setEcns(importedEcns);
    saveEcns(importedEcns);
    
    setAuditLogs(importedLogs);
    try {
      localStorage.setItem('paperless_ecn_audit_logs_v1', JSON.stringify(importedLogs));
    } catch {}

    setEmails(importedEmails);
    try {
      localStorage.setItem('paperless_ecn_email_outbox_v1', JSON.stringify(importedEmails));
    } catch {}

    setToastMessage({
      title: 'Database Restored from Google Drive!',
      desc: `Loaded ${importedEcns.length} ECN records & ${importedLogs.length} audit logs into system repository.`
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-200">
      
      {/* Top Fixed Header */}
      <Header
        activeUser={activeUser}
        users={users}
        onSelectUser={handleSelectUser}
        onOpenEmailLoginModal={() => setIsEmailLoginModalOpen(true)}
        onOpenNewEcnModal={() => setIsNewEcnModalOpen(true)}
        onOpenOutboxModal={() => setIsOutboxModalOpen(true)}
        onOpenAuditLogModal={() => setActiveTab('audit')}
        onOpenRbacModal={() => setActiveTab('rbac')}
        onOpenDriveSyncModal={() => setIsDriveSyncModalOpen(true)}
        outboxCount={emails.length}
        onSearchEcnId={handleSearchEcnId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Instant Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-slate-900 text-white px-4 py-3 shadow-xl border-b border-blue-500/50 flex items-center justify-between animate-fadeIn z-20">
          <div className="flex items-center space-x-3 max-w-4xl mx-auto flex-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-300">{toastMessage.title}</p>
              <p className="text-[11px] text-slate-300">{toastMessage.desc}</p>
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            ecns={ecns}
            activeUser={activeUser}
            onViewEcn={(ecn) => setSelectedEcnForDetail(ecn)}
            onOpenNewEcnModal={() => setIsNewEcnModalOpen(true)}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogView logs={auditLogs} />
        )}

        {activeTab === 'rbac' && (
          <RbacManagerView 
            activeUser={activeUser} 
            users={users} 
            onSelectUser={handleSelectUser} 
            onUpdateUsers={handleUpdateUsers} 
          />
        )}
      </main>

      {/* ECN Creation Modal */}
      <EcnFormModal
        isOpen={isNewEcnModalOpen}
        onClose={() => setIsNewEcnModalOpen(false)}
        activeUser={activeUser}
        users={users}
        onSubmitEcn={handleSubmitNewEcn}
      />

      {/* ECN Detailed Review Modal */}
      <EcnDetailModal
        ecn={selectedEcnForDetail}
        isOpen={!!selectedEcnForDetail}
        onClose={() => setSelectedEcnForDetail(null)}
        activeUser={activeUser}
        onUpdateEcnApproval={handleUpdateApproval}
      />

      {/* Email Notifications Outbox Modal */}
      <EmailOutboxModal
        isOpen={isOutboxModalOpen}
        onClose={() => setIsOutboxModalOpen(false)}
        emails={emails}
        onOpenEcnById={handleSearchEcnId}
      />

      {/* Google Drive DB Sync Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveSyncModalOpen}
        onClose={() => setIsDriveSyncModalOpen(false)}
        ecns={ecns}
        auditLogs={auditLogs}
        emails={emails}
        onRestoreDatabase={handleRestoreDatabase}
      />

      {/* Email Login Modal */}
      <EmailLoginModal
        isOpen={isEmailLoginModalOpen}
        onClose={() => setIsEmailLoginModalOpen(false)}
        users={users}
        activeUser={activeUser}
        onLoginSuccess={handleEmailLoginSuccess}
        onRegisterUser={handleRegisterNewUser}
      />

      {/* System Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Paperless ECN Approval System • Dixon / Padget Electronics</p>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Requester: ghanshyamsahu.padget@dixoninfo.com</span>
            <span>•</span>
            <span>Excel Import & Export Engine</span>
            <span>•</span>
            <span>RBAC Protected</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
