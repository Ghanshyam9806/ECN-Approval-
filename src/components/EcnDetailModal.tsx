import React, { useState } from 'react';
import { EcnRecord, UserProfile, ApprovalState, Department } from '../types';
import { exportEcnsToExcel } from '../utils/excelUtils';
import { 
  X, 
  Link2, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  Box, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileSpreadsheet, 
  Building2, 
  Layers, 
  PenTool, 
  ShieldCheck,
  Printer,
  Bell
} from 'lucide-react';

interface EcnDetailModalProps {
  ecn: EcnRecord | null;
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserProfile;
  onUpdateEcnApproval: (
    ecnId: string, 
    department: string, 
    newStatus: ApprovalState, 
    comments: string, 
    signatureStamp: string,
    updatedFutureDate?: string
  ) => void;
}

const PADGET_12_DEPARTMENTS: { sr: number; name: Department }[] = [
  { sr: 1, name: 'PRODUCTION' },
  { sr: 2, name: 'STORE' },
  { sr: 3, name: 'PPC' },
  { sr: 4, name: 'PURCHASE' },
  { sr: 5, name: 'SMT PQC' },
  { sr: 6, name: 'IE' },
  { sr: 7, name: 'IQC' },
  { sr: 8, name: 'PQC' },
  { sr: 9, name: 'NPI' },
  { sr: 10, name: 'SMT NPI' },
  { sr: 11, name: 'SMT MAINTENANCE' },
  { sr: 12, name: 'IMPLEMENTATION IN SAP' }
];

export const EcnDetailModal: React.FC<EcnDetailModalProps> = ({
  ecn,
  isOpen,
  onClose,
  activeUser,
  onUpdateEcnApproval
}) => {
  if (!isOpen || !ecn) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [futureDateInput, setFutureDateInput] = useState(ecn.futureDate || '');
  const [viewMode, setViewMode] = useState<'standard' | 'padget_template'>('padget_template');

  // Check if active user can approve
  const userApprovableDept = ecn.approvals.find(
    a => a.department === activeUser.department || activeUser.role === 'ECN Coordinator' || activeUser.role === 'ECN Manager'
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ecn.uniqueLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportSingleEcn = () => {
    exportEcnsToExcel([ecn], `${ecn.id}_Padget_Official_Report.xlsx`);
  };

  const handleApprovalAction = (status: ApprovalState) => {
    if (!userApprovableDept) return;
    const signature = `${activeUser.name} - ${activeUser.department} Stamp`;
    onUpdateEcnApproval(
      ecn.id, 
      userApprovableDept.department, 
      status, 
      commentText, 
      signature,
      futureDateInput
    );
    setCommentText('');
    alert(`Approval sign-off recorded for ${userApprovableDept.department}. Automated 1-day pre-cutoff reminder scheduled for concern team.`);
  };

  const totalCostImpact = ecn.lineItems.reduce((acc, curr) => acc + (curr.totalCostImpact || 0), 0);

  const getDepartmentApproval = (deptName: Department) => {
    return ecn.approvals.find(a => a.department === deptName || a.department.toUpperCase() === deptName.toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col my-auto overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 bg-indigo-600 text-white font-mono font-bold text-xs rounded-lg">
              {ecn.id}
            </span>
            <div>
              <h3 className="text-base font-bold line-clamp-1">{ecn.title}</h3>
              <p className="text-xs text-slate-400">Padget Form Doc No: PAD/QA/QS/C/F/19 • Rev: 01 / 13-12-2022</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-slate-800 p-1 rounded-xl flex items-center space-x-1 text-xs">
              <button
                onClick={() => setViewMode('padget_template')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  viewMode === 'padget_template' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Padget Official Template
              </button>
              <button
                onClick={() => setViewMode('standard')}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  viewMode === 'standard' ? 'bg-indigo-600 text-white shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Standard Matrix
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-900">
          
          {/* Shareable Link Banner */}
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Link2 className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold text-indigo-950">Unique Shareable ECN Link Generated</p>
                <p className="font-mono text-indigo-700 break-all text-[11px]">{ecn.uniqueLink}</p>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow transition shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* 1-DAY AUTOMATED REMINDER NOTIFICATION BANNER */}
          {ecn.futureDate && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-amber-600 animate-bounce shrink-0" />
                <div>
                  <p className="font-bold text-amber-950">Automated 1-Day Pre-Cutoff Email Reminder System Active</p>
                  <p className="text-[11px] text-amber-800">
                    Cutoff Date: <strong>{ecn.futureDate}</strong> • Pre-cutoff notification triggers 1 day prior to concern teams for pending approvals.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                1-Day Auto Notification
              </span>
            </div>
          )}

          {/* VIEW MODE 1: PADGET OFFICIAL TEMPLATE (Matching PDF PAD/QA/QS/C/F/19 Exactly) */}
          {viewMode === 'padget_template' && (
            <div className="bg-white border-2 border-slate-900 rounded-xl p-5 space-y-5 text-slate-900 shadow-md font-sans">
              
              {/* PADGET HEADER TABLE */}
              <div className="border border-slate-900 rounded overflow-hidden">
                <div className="grid grid-cols-12 divide-x divide-slate-900 border-b border-slate-900">
                  <div className="col-span-3 p-3 flex flex-col justify-center items-center bg-slate-50">
                    <span className="text-xl font-black tracking-widest text-slate-900">PADGET</span>
                    <span className="text-[9px] font-semibold text-slate-600 uppercase">Electronics Pvt. Ltd.</span>
                  </div>
                  <div className="col-span-6 p-3 flex items-center justify-center text-center bg-slate-100">
                    <h2 className="text-lg font-black tracking-wider uppercase text-slate-900">
                      ENGINEERING CHANGE NOTE
                    </h2>
                  </div>
                  <div className="col-span-3 p-2 text-[10px] space-y-1 font-semibold text-slate-800 bg-slate-50">
                    <p><span className="text-slate-500">Doc No:</span> PAD/QA/QS/C/F/19</p>
                    <p><span className="text-slate-500">Issue No / Date:</span> 02 / 13-12-2022</p>
                    <p><span className="text-slate-500">Rev No / Date:</span> 01 / 13-12-2022</p>
                  </div>
                </div>

                <div className="grid grid-cols-12 divide-x divide-slate-900 text-xs font-semibold bg-slate-50">
                  <div className="col-span-3 p-2">
                    <span className="text-slate-500 block text-[10px]">ECN NO:</span>
                    <span className="font-mono font-bold text-indigo-900 text-sm">{ecn.id}</span>
                  </div>
                  <div className="col-span-3 p-2">
                    <span className="text-slate-500 block text-[10px]">DATE:</span>
                    <span className="font-bold">{ecn.createdAt || ecn.dateOfStockCheck}</span>
                  </div>
                  <div className="col-span-3 p-2">
                    <span className="text-slate-500 block text-[10px]">MODEL / PRODUCT:</span>
                    <span className="font-bold">{ecn.productModel}</span>
                  </div>
                  <div className="col-span-3 p-2">
                    <span className="text-slate-500 block text-[10px]">FUTURE CUTOFF DATE:</span>
                    <span className="font-bold text-amber-700">{ecn.futureDate}</span>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION & CHANGE REASON */}
              <div className="border border-slate-900 rounded p-3 bg-slate-50/50 space-y-2 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-bold text-slate-900 uppercase block mb-1">Change Type & Reason:</span>
                    <p className="text-slate-800"><strong>Type:</strong> {ecn.changeType} | <strong>Reason:</strong> {ecn.changeReason}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 uppercase block mb-1">Description of Change:</span>
                    <p className="text-slate-800 leading-relaxed">{ecn.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-300">
                  <div>
                    <span className="font-bold text-slate-900 uppercase block mb-1">Before Change:</span>
                    <p className="text-slate-700">{ecn.beforeChange}</p>
                  </div>
                  <div>
                    <span className="font-bold text-indigo-900 uppercase block mb-1">After Change (Proposed):</span>
                    <p className="text-indigo-950 font-medium">{ecn.afterChange}</p>
                  </div>
                </div>
              </div>

              {/* BOM LINE ITEMS TABLE (Matching 13 Padget BOM Columns) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>BOM Line Items Table (Padget Template Standard)</span>
                </h4>

                <div className="border border-slate-900 rounded overflow-x-auto text-[10px]">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-800 text-white font-bold uppercase divide-x divide-slate-700">
                        <th className="p-2">BOM Type</th>
                        <th className="p-2">Parent Part No</th>
                        <th className="p-2">Parent Name</th>
                        <th className="p-2">Pre Ver</th>
                        <th className="p-2">Cur Ver</th>
                        <th className="p-2">Action</th>
                        <th className="p-2">Find No</th>
                        <th className="p-2">Child Part No</th>
                        <th className="p-2">Child Name</th>
                        <th className="p-2">Pre Qty</th>
                        <th className="p-2">Cur Qty</th>
                        <th className="p-2">Unit</th>
                        <th className="p-2">Main Child Part</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium">
                      {ecn.lineItems.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50 divide-x divide-slate-200">
                          <td className="p-2 font-bold">{item.bomType || 'Main BOM'}</td>
                          <td className="p-2 font-mono">{item.parentPartNumber || '365-PL-8890'}</td>
                          <td className="p-2">{item.parentPartName || ecn.productModel}</td>
                          <td className="p-2 font-semibold">{item.preVersion || item.presentRev}</td>
                          <td className="p-2 font-bold text-indigo-700">{item.currentVersion || item.proposedRev}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-900 rounded font-bold">
                              {item.action || 'REPLACE'}
                            </span>
                          </td>
                          <td className="p-2 font-mono">{item.findNumber || `00${idx + 1}`}</td>
                          <td className="p-2 font-mono font-bold text-indigo-900">{item.childPartNumber || item.itemCode}</td>
                          <td className="p-2">{item.childPartName || item.description}</td>
                          <td className="p-2">{item.preQuantity ?? item.qtyAffected}</td>
                          <td className="p-2 font-bold">{item.currentQuantity ?? item.qtyAffected}</td>
                          <td className="p-2">{item.unit || 'Pcs'}</td>
                          <td className="p-2">{item.mainChildPart || 'YES'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 12 DEPARTMENT APPROVALS TABLE (Padget 12 Dept Layout) */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <span>Padget 12 Department Sign-Off Matrix</span>
                </h4>

                <div className="border border-slate-900 rounded overflow-x-auto text-[10px]">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold uppercase divide-x divide-slate-800">
                        <th className="p-2 w-12 text-center">SR NO.</th>
                        <th className="p-2 w-48">DEPARTMENT</th>
                        <th className="p-2 w-44">SIGNATURE & STAMP</th>
                        <th className="p-2 w-28">LIABILITY</th>
                        <th className="p-2">REMARKS / COMMENTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium">
                      {PADGET_12_DEPARTMENTS.map((dept) => {
                        const app = getDepartmentApproval(dept.name);
                        const isApproved = app?.status === 'Approved';
                        const isRejected = app?.status === 'Rejected';
                        const isRevision = app?.status === 'Revision Requested';

                        return (
                          <tr key={dept.sr} className="hover:bg-slate-50 divide-x divide-slate-200">
                            <td className="p-2 text-center font-bold text-slate-700">{dept.sr}</td>
                            <td className="p-2 font-bold text-slate-900">{dept.name}</td>
                            <td className="p-2">
                              {isApproved && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  {app?.signatureStamp || `${app?.approverName} SIGNED`}
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-900 rounded font-bold">
                                  REJECTED BY {app?.approverName}
                                </span>
                              )}
                              {isRevision && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-900 rounded font-bold">
                                  REVISION REQUESTED
                                </span>
                              )}
                              {(!app || app.status === 'Pending') && (
                                <span className="text-slate-400 italic">Pending Sign-off</span>
                              )}
                            </td>
                            <td className="p-2">{app?.liability || 'N/A'}</td>
                            <td className="p-2 text-slate-700 italic">{app?.comments || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* INVENTORY TRACKER FOR RUNNING ECN (Exact Padget 3 Inventory Checks) */}
              <div className="space-y-2 border-t-2 border-slate-900 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-amber-600" />
                  <span>INVENTORY TRACKER FOR RUNNING ECN</span>
                </h4>

                <div className="border border-slate-900 rounded overflow-x-auto text-[10px]">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-amber-900 text-white font-bold uppercase divide-x divide-amber-800">
                        <th className="p-2 w-12 text-center">SR NO.</th>
                        <th className="p-2 w-48">INVENTORY CHECK</th>
                        <th className="p-2">LOCATION / BIN</th>
                        <th className="p-2">STOCK (QTY)</th>
                        <th className="p-2">STOCK CHECK DATE</th>
                        <th className="p-2">FUTURE DATE</th>
                        <th className="p-2">SIGN-NPI/PPC/PURCHASE</th>
                        <th className="p-2">REMARKS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300 font-medium">
                      
                      {/* Inventory Check 1 */}
                      <tr className="divide-x divide-slate-200 hover:bg-amber-50/50">
                        <td className="p-2 text-center font-bold">1</td>
                        <td className="p-2 font-bold text-amber-950">INVENTORY CHECK 1. (Stores/Raw)</td>
                        <td className="p-2">{ecn.inventoryCheck1.location}</td>
                        <td className="p-2 font-bold">{ecn.inventoryCheck1.qtyOnHand} pcs</td>
                        <td className="p-2">{ecn.dateOfStockCheck}</td>
                        <td className="p-2 font-bold text-amber-700">{ecn.futureDate}</td>
                        <td className="p-2 font-bold text-emerald-800">{ecn.inventoryCheck1.signNpiPpcPurchase || 'NPI/PPC SIGNED'}</td>
                        <td className="p-2 text-slate-700">{ecn.inventoryCheck1.remarks}</td>
                      </tr>

                      {/* Inventory Check 2 */}
                      <tr className="divide-x divide-slate-200 hover:bg-blue-50/50">
                        <td className="p-2 text-center font-bold">2</td>
                        <td className="p-2 font-bold text-blue-950">INVENTORY CHECK 2. (WIP Line)</td>
                        <td className="p-2">{ecn.inventoryCheck2.location}</td>
                        <td className="p-2 font-bold">{ecn.inventoryCheck2.qtyOnHand} pcs</td>
                        <td className="p-2">{ecn.dateOfStockCheck}</td>
                        <td className="p-2 font-bold text-indigo-700">{ecn.futureDate}</td>
                        <td className="p-2 font-bold text-emerald-800">{ecn.inventoryCheck2.signNpiPpcPurchase || 'PPC SIGNED'}</td>
                        <td className="p-2 text-slate-700">{ecn.inventoryCheck2.remarks}</td>
                      </tr>

                      {/* Inventory Check 3 */}
                      <tr className="divide-x divide-slate-200 hover:bg-purple-50/50">
                        <td className="p-2 text-center font-bold">3</td>
                        <td className="p-2 font-bold text-purple-950">INVENTORY CHECK 3. (Finished Goods)</td>
                        <td className="p-2">{ecn.inventoryCheck3.location}</td>
                        <td className="p-2 font-bold">{ecn.inventoryCheck3.qtyOnHand} pcs</td>
                        <td className="p-2">{ecn.dateOfStockCheck}</td>
                        <td className="p-2 font-bold text-purple-700">{ecn.futureDate}</td>
                        <td className="p-2 font-bold text-emerald-800">{ecn.inventoryCheck3.signNpiPpcPurchase || 'PURCHASE SIGNED'}</td>
                        <td className="p-2 text-slate-700">{ecn.inventoryCheck3.remarks}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>

                {/* MANDATORY PADGET TEMPLATE NOTES */}
                <div className="p-3 bg-slate-100 rounded border border-slate-300 text-[11px] space-y-1 text-slate-800 font-semibold">
                  <p className="text-slate-900 font-bold uppercase">Padget Mandatory Implementation Guidelines:</p>
                  <p>1- Inventory check points fill up mandatory for future ECN's before 48 hours of implementation/cut off date.</p>
                  <p>2- Proactively SCM team will notify to ECN team in case any risk from material point of view.</p>
                </div>
              </div>

            </div>
          )}

          {/* VIEW MODE 2: STANDARD MATRIX */}
          {viewMode === 'standard' && (
            <div className="space-y-6">
              {/* Core Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Change Type:</span>
                  <span className="font-bold text-slate-800">{ecn.changeType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Change Reason:</span>
                  <span className="font-bold text-slate-800">{ecn.changeReason}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Date of Stock Check:
                  </span>
                  <span className="font-bold text-slate-800">{ecn.dateOfStockCheck}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Future Cutoff Date:
                  </span>
                  <span className="font-bold text-amber-700">{ecn.futureDate}</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Line Items & Cost Impact</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[10px] font-bold uppercase text-slate-600 border-b border-slate-200">
                        <th className="py-2.5 px-3">Item Code</th>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Present Rev</th>
                        <th className="py-2.5 px-3">Proposed Rev</th>
                        <th className="py-2.5 px-3">Qty Affected</th>
                        <th className="py-2.5 px-3 text-right">Cost Impact ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ecn.lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-800">{item.itemCode}</td>
                          <td className="py-2.5 px-3">{item.description}</td>
                          <td className="py-2.5 px-3 font-semibold">{item.presentRev}</td>
                          <td className="py-2.5 px-3 font-bold text-indigo-600">{item.proposedRev}</td>
                          <td className="py-2.5 px-3 font-semibold">{item.qtyAffected}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            ${(item.totalCostImpact || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* APPROVER ACTION PANEL */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PenTool className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold">Approver Sign-Off Panel (Active Persona: {activeUser.name})</h4>
              </div>
              <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded text-indigo-300 font-medium border border-slate-700">
                Department: {activeUser.department}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Review Remarks / Liability Comments:</label>
                <textarea
                  rows={2}
                  placeholder="Enter approval remarks, test verification results, or liability observations..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-300 mb-1">Confirm Implementation Future Cutoff Date:</label>
                <input
                  type="date"
                  value={futureDateInput}
                  onChange={(e) => setFutureDateInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-amber-300 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">Updates future cutoff date & triggers 1-day pre-cutoff automated email</p>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              <p className="text-[11px] text-slate-400">
                Signing off applies digital stamp & dispatches automated 1-day pre-cutoff reminder to concern teams.
              </p>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleApprovalAction('Rejected')}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Reject ECN
                </button>
                <button
                  type="button"
                  onClick={() => handleApprovalAction('Revision Requested')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => handleApprovalAction('Approved')}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Apply Digital Stamp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <button
              onClick={handleExportSingleEcn}
              className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Official Padget ECN to Excel</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
