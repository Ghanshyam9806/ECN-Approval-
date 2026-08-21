import React, { useState } from 'react';
import { UserProfile, Department, UserRole } from '../types';
import { Mail, KeyRound, CheckCircle2, UserPlus, ShieldCheck, ArrowRight, X, AlertCircle, Building2, User } from 'lucide-react';

interface EmailLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  activeUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterUser: (newUser: UserProfile) => void;
}

export const EmailLoginModal: React.FC<EmailLoginModalProps> = ({
  isOpen,
  onClose,
  users,
  activeUser,
  onLoginSuccess,
  onRegisterUser,
}) => {
  if (!isOpen) return null;

  const [emailInput, setEmailInput] = useState('');
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify' | 'register'>('input');
  const [errorMsg, setErrorMsg] = useState('');

  // Form state for registering new account
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDepartment, setRegDepartment] = useState<Department>('NPI');
  const [regRole, setRegRole] = useState<UserRole>('Requester');
  const [regDesignation, setRegDesignation] = useState('Senior Engineer');

  const DEPARTMENTS: Department[] = [
    'NPI',
    'PQC',
    'PRODUCTION',
    'PURCHASE',
    'STORE',
    'PPC',
    'IMPLEMENTATION IN SAP',
    'IQC',
    'SMT NPI',
    'SMT PQC',
    'SMT MAINTENANCE',
    'IE',
    'Engineering & Design',
    'Quality Assurance',
    'Production & Assembly',
    'Supply Chain & Purchase',
    'Stores & Inventory',
    'Finance & Accounts'
  ];

  const handleSearchEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = emailInput.trim().toLowerCase();
    
    if (!cleanEmail) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      setMatchedUser(found);
      setStep('verify');
    } else {
      setRegEmail(cleanEmail);
      setStep('register');
    }
  };

  const handleQuickSelectUser = (user: UserProfile) => {
    setEmailInput(user.email);
    setMatchedUser(user);
    setStep('verify');
    setErrorMsg('');
  };

  const handleConfirmLogin = () => {
    if (matchedUser) {
      onLoginSuccess(matchedUser);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      department: regDepartment,
      role: regRole,
      designation: regDesignation.trim() || 'Team Member',
      signatureUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(regName)}`
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Work Email Portal Authentication</h3>
              <p className="text-xs text-slate-400">Padget / Dixon ECN System • Requester & Approver Login</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Email or Pick from Roster */}
          {step === 'input' && (
            <div className="space-y-4">
              <form onSubmit={handleSearchEmail} className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Enter Work Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. ghanshyamsahu.padget@dixoninfo.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
                  >
                    Authenticate
                  </button>
                </div>
              </form>

              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Active Roster Accounts ({users.length}) — Click to Login:
                </p>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {users.map((u) => {
                    const isActive = u.id === activeUser.id;
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleQuickSelectUser(u)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                          isActive
                            ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                            u.role === 'Requester' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            u.role === 'Department Approver' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {u.role}
                          </span>
                          <span className="text-[10px] text-slate-600 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                            {u.department}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Verify Matched Profile & Login */}
          {step === 'verify' && matchedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {matchedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{matchedUser.name}</h4>
                    <p className="text-xs font-mono text-slate-600">{matchedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-indigo-200/80">
                  <div>
                    <span className="text-slate-500 text-[10px] block">DEPARTMENT</span>
                    <span className="font-bold text-slate-800">{matchedUser.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">ROLE</span>
                    <span className="font-bold text-indigo-700">{matchedUser.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">DESIGNATION</span>
                    <span className="font-semibold text-slate-700">{matchedUser.designation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">SYSTEM PERMISSION</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authorized
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Simulated Email One-Time Code / PIN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter 4-digit code (e.g. 1234)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-center tracking-widest outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogin}
                  className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Login as {matchedUser.name}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Register New Account for Unknown Email */}
          {step === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-amber-700" /> New Email Registration
                </p>
                <p className="text-[11px] text-amber-800">
                  The email <strong className="font-mono">{regEmail}</strong> is not registered in the Padget ECN system roster. Complete your details below to register and sign in.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ghanshyam Sahu"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                    <select
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value as Department)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">System Role *</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Requester">Requester (Create ECN)</option>
                      <option value="Department Approver">Department Approver (Sign-Off)</option>
                      <option value="ECN Coordinator">ECN Coordinator / Manager</option>
                      <option value="Auditor">Auditor (View Only)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Executive / Lead Engineer"
                    value={regDesignation}
                    onChange={(e) => setRegDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Sign In</span>
                </button>
              </div>
            </form>
          )}

        </div>

        <div className="bg-slate-50 p-3 text-center border-t border-slate-200 text-[11px] text-slate-500">
          Padget ECN Role-Based Access Control • Requesters & Department Approvers
        </div>

      </div>
    </div>
  );
};
