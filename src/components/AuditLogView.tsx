import React, { useState, useMemo } from 'react';
import { AuditLog } from '../types';
import { exportAuditLogsToExcel } from '../utils/excelUtils';
import { History, FileSpreadsheet, Search, Filter, ShieldCheck, User, Calendar, Tag } from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.ecnId && log.ecnId.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesAction = selectedAction === 'ALL' || log.action.includes(selectedAction);

      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, selectedAction]);

  const handleExportLogs = () => {
    exportAuditLogsToExcel(filteredLogs, `ECN_Audit_Trail_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> ISO 9001 & IATF 16949 Compliant Audit Trail
            </div>
            <h2 className="text-2xl font-bold tracking-tight">System Activity Audit Logs</h2>
            <p className="text-emerald-100/80 text-xs mt-1 max-w-2xl">
              Immutable logging of all user activities: ECN creation, Excel file imports, department approvals, digital sign-offs, email triggers, and RBAC permission switches.
            </p>
          </div>
          <div>
            <button
              onClick={handleExportLogs}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Audit Log to Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search audit logs by user, email, action, or ECN ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">Action Type:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="Creation">ECN Creation</option>
            <option value="Submission">ECN Submission & Mail</option>
            <option value="Approval">Department Sign-off</option>
            <option value="Export">Excel Export</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Audit Trail Event Logs ({filteredLogs.length} Records)</span>
          </h3>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 px-4">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No Audit Events Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User & Persona</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">ECN ID Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.userEmail}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded border border-slate-200 mb-0.5">
                        {log.department}
                      </span>
                      <div className="text-[10px] text-emerald-700 font-bold">{log.role}</div>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 max-w-md">
                      <p className="line-clamp-2">{log.details}</p>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {log.ecnId || 'N/A'}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
