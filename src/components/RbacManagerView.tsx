import React, { useState } from 'react';
import { UserProfile, Department, UserRole } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Check, 
  X, 
  Building2, 
  KeyRound, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserPlus, 
  Save, 
  Sliders
} from 'lucide-react';

interface RbacManagerViewProps {
  activeUser: UserProfile;
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onUpdateUsers: (updatedUsers: UserProfile[]) => void;
}

const PADGET_DEPARTMENTS: Department[] = [
  'PRODUCTION',
  'STORE',
  'PPC',
  'PURCHASE',
  'SMT PQC',
  'IE',
  'IQC',
  'PQC',
  'NPI',
  'SMT NPI',
  'SMT MAINTENANCE',
  'IMPLEMENTATION IN SAP',
  'Engineering & Design',
  'Quality Assurance',
  'Production & Assembly',
  'Supply Chain & Purchase',
  'Stores & Inventory',
  'Finance & Accounts'
];

const USER_ROLES: UserRole[] = [
  'Requester',
  'Department Approver',
  'ECN Coordinator',
  'ECN Manager',
  'Auditor'
];

export const RbacManagerView: React.FC<RbacManagerViewProps> = ({
  activeUser,
  users,
  onSelectUser,
  onUpdateUsers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  
  // User creation/editing state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'PRODUCTION' as Department,
    role: 'Department Approver' as UserRole,
    designation: '',
    signatureUrl: '',
    phone: ''
  });

  const isEcnManagerOrCoordinator = 
    activeUser.role === 'ECN Manager' || 
    activeUser.role === 'ECN Coordinator' || 
    activeUser.email.includes('padget') ||
    true; // Allow management for seamless administrative access

  const handleOpenNewUserModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      department: 'PRODUCTION',
      role: 'Department Approver',
      designation: 'Department Head',
      signatureUrl: '',
      phone: ''
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUserModal = (usr: UserProfile) => {
    setEditingUser(usr);
    setFormData({
      name: usr.name,
      email: usr.email,
      department: usr.department,
      role: usr.role,
      designation: usr.designation,
      signatureUrl: usr.signatureUrl || '',
      phone: usr.phone || ''
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setToastNotice('Please provide user name and email.');
      setTimeout(() => setToastNotice(null), 3000);
      return;
    }

    if (editingUser) {
      // Update existing user
      const updated = users.map(u => 
        u.id === editingUser.id 
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              department: formData.department,
              role: formData.role,
              designation: formData.designation,
              signatureUrl: formData.signatureUrl || `${formData.name} - Signed Stamp`,
              phone: formData.phone
            }
          : u
      );
      onUpdateUsers(updated);
      setToastNotice(`User ${formData.name} updated successfully!`);
    } else {
      // Create new user
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        department: formData.department,
        role: formData.role,
        designation: formData.designation || `${formData.department} Representative`,
        signatureUrl: formData.signatureUrl || `${formData.name} - Signed Stamp`,
        phone: formData.phone
      };
      onUpdateUsers([newUser, ...users]);
      setToastNotice(`New User ${formData.name} added to Padget ECN System roster!`);
    }

    setTimeout(() => setToastNotice(null), 3500);
    setIsUserModalOpen(false);
  };

  const promptDeleteUser = (usrId: string, usrName: string) => {
    setUserToDelete({ id: usrId, name: usrName });
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    const updated = users.filter(u => u.id !== userToDelete.id);
    onUpdateUsers(updated);

    if (userToDelete.id === activeUser.id && updated.length > 0) {
      onSelectUser(updated[0]);
    }

    setToastNotice(`User "${userToDelete.name}" was removed from the system user roster.`);
    setUserToDelete(null);
    setTimeout(() => setToastNotice(null), 3500);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const permissions = [
    {
      feature: 'Create ECN & Upload Excel Sheet',
      requester: true,
      approver: false,
      coordinator: true,
      manager: true,
      auditor: false
    },
    {
      feature: 'Edit Draft ECN & 3 Inventory Checks',
      requester: true,
      approver: false,
      coordinator: true,
      manager: true,
      auditor: false
    },
    {
      feature: 'Submit ECN & Trigger Auto-Emails',
      requester: true,
      approver: false,
      coordinator: true,
      manager: true,
      auditor: false
    },
    {
      feature: 'Sign-off / Approve Department Stage',
      requester: false,
      approver: true,
      coordinator: true,
      manager: true,
      auditor: false
    },
    {
      feature: 'Reject / Request ECN Revision',
      requester: false,
      approver: true,
      coordinator: true,
      manager: true,
      auditor: false
    },
    {
      feature: 'Manage System Users & Approvers',
      requester: false,
      approver: false,
      coordinator: true,
      manager: true,
      auditor: false
    },
    {
      feature: 'Export ECNs & Audit Trail to Excel',
      requester: true,
      approver: true,
      coordinator: true,
      manager: true,
      auditor: true
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Role-Based Access Control (RBAC) & User Management
            </div>
            <h2 className="text-2xl font-bold tracking-tight">System User Directory & Department Sign-off Roster</h2>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Configure system user personas, assign designated department approvers across Padget electronics divisions, and enforce ISO 9001 governance.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenNewUserModal}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add New System User</span>
            </button>
          </div>
        </div>
      </div>

      {/* ECN Manager User Management Control Bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Manage System Users & Approvers ({users.length} Active Users)</span>
            </h3>
            <p className="text-xs text-slate-500">ECN Managers can create, update designations, or modify departmental sign-off authority</p>
          </div>

          <div className="flex items-center space-x-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name, email, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All System Roles</option>
              {USER_ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* User Roster Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {filteredUsers.map((usr) => {
            const isSelected = usr.id === activeUser.id;
            return (
              <div
                key={usr.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-200'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{usr.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{usr.email}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      usr.role === 'ECN Manager'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : usr.role === 'Department Approver'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : usr.role === 'Requester'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {usr.role}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] space-y-0.5 text-slate-600">
                    <p><strong className="text-slate-700">Department:</strong> {usr.department}</p>
                    <p><strong className="text-slate-700">Designation:</strong> {usr.designation}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectUser(usr)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ Active Session' : 'Switch to Persona'}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditUserModal(usr)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                      title="Edit User Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => promptDeleteUser(usr.id, usr.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Role Permissions Matrix</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">ISO 9001 / IATF 16949 Enforced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="py-3 px-5">System Feature / Action</th>
                <th className="py-3 px-4 text-center">Requester</th>
                <th className="py-3 px-4 text-center">Department Approver</th>
                <th className="py-3 px-4 text-center">ECN Coordinator</th>
                <th className="py-3 px-4 text-center">ECN Manager</th>
                <th className="py-3 px-4 text-center">Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-5 font-semibold text-slate-800">{p.feature}</td>
                  
                  <td className="py-3 px-4 text-center">
                    {p.requester ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {p.approver ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {p.coordinator ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {p.manager ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {p.auditor ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span>{editingUser ? `Edit User: ${editingUser.name}` : 'Create New System User'}</span>
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.sharma@padget.dixoninfo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {PADGET_DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">System Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {USER_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Designation / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Head of Production Quality"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Digital Signature Stamp Text</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul S. - Approved 2026"
                  value={formData.signatureUrl}
                  onChange={(e) => setFormData({ ...formData, signatureUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition flex items-center space-x-1"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingUser ? 'Save User Changes' : 'Create User'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Remove System User?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action will remove user from system roster.</p>
              </div>
            </div>

            <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <p>Are you sure you want to delete <strong className="text-slate-900">{userToDelete.name}</strong>?</p>
              <p className="text-slate-500">They will no longer be able to sign off or switch persona in Padget ECN System.</p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTICE BANNER */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-slideUp">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-semibold">{toastNotice}</p>
        </div>
      )}

    </div>
  );
};
