import React, { useState, useMemo } from 'react';
import { EcnRecord, UserProfile, Department, ApprovalState } from '../types';
import { exportEcnsToExcel } from '../utils/excelUtils';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Download, 
  Search, 
  Eye, 
  Calendar, 
  Box, 
  Sparkles,
  Link2,
  FileSpreadsheet,
  Building2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  History,
  Layers,
  HardDrive
} from 'lucide-react';

interface DashboardProps {
  ecns: EcnRecord[];
  activeUser: UserProfile;
  onViewEcn: (ecn: EcnRecord) => void;
  onOpenNewEcnModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  ecns,
  activeUser,
  onViewEcn,
  onOpenNewEcnModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Filtered ECN list
  const filteredEcns = useMemo(() => {
    return ecns.filter((ecn) => {
      const matchesSearch = 
        ecn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ecn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ecn.productModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ecn.requesterName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === 'ALL' || ecn.approvals.some(a => a.department === selectedDept);
      const matchesStatus = selectedStatus === 'ALL' || ecn.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [ecns, searchTerm, selectedDept, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = ecns.length;
    const pending = ecns.filter(e => e.status === 'In Review' || e.status === 'Submitted').length;
    const approved = ecns.filter(e => e.status === 'Approved').length;
    const rejected = ecns.filter(e => e.status === 'Rejected' || e.status === 'Revision Needed').length;
    
    let totalCostImpact = 0;
    ecns.forEach(e => {
      e.lineItems.forEach(i => totalCostImpact += (i.totalCostImpact || 0));
    });

    return { total, pending, approved, rejected, totalCostImpact };
  }, [ecns]);

  // Current Featured ECN (first one or in-review)
  const featuredEcn = ecns[0] || null;

  const handleExportExcel = () => {
    exportEcnsToExcel(filteredEcns, `ECN_Approval_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      case 'In Review':
      case 'Submitted':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3.5 h-3.5 animate-pulse" /> In Review</span>;
      case 'Revision Needed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-200"><AlertCircle className="w-3.5 h-3.5" /> Revision Needed</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">Draft</span>;
    }
  };

  const getDeptStatusPill = (status: ApprovalState) => {
    switch (status) {
      case 'Approved':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" title="Approved" />;
      case 'Rejected':
        return <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100" title="Rejected" />;
      case 'Revision Requested':
        return <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-orange-100" title="Revision Requested" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-slate-300" title="Pending Sign-off" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Bento Grid Top Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (8 cols): Highlighted ECN Card & 3 Inventory Checks */}
        <div className="lg:col-span-8 flex flex-col space-y-5">
          
          {/* Main Hero Bento Tile */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Active Focus ECN
                  </span>
                  <span className="text-xs text-slate-400">• ISO 9001 / IATF 16949</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {featuredEcn ? featuredEcn.id : 'No Active ECN'}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {featuredEcn ? `${featuredEcn.title} — ${featuredEcn.productModel}` : 'Create an ECN to initiate engineering workflow'}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenNewEcnModal}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition active:scale-95 flex items-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>+ New ECN</span>
                </button>
              </div>
            </div>

            {featuredEcn ? (
              <div className="space-y-5">
                {/* 3 Inventory Check Bento Grid Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Inventory_Check-1 (Raw Material)
                      </p>
                      <p className="text-xl font-mono font-bold text-indigo-950">
                        {featuredEcn.inventoryCheck1.qtyAffected} Pcs
                      </p>
                    </div>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-3 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{featuredEcn.inventoryCheck1.actionRequired}</span>
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Inventory_Check-2 (WIP Area)
                      </p>
                      <p className="text-xl font-mono font-bold text-indigo-950">
                        {featuredEcn.inventoryCheck2.qtyAffected} Pcs
                      </p>
                    </div>
                    <p className="text-[11px] text-amber-600 font-semibold mt-3 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredEcn.inventoryCheck2.actionRequired}</span>
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Inventory_Check-3 (Finished Goods)
                      </p>
                      <p className="text-xl font-mono font-bold text-indigo-950">
                        {featuredEcn.inventoryCheck3.qtyAffected} Pcs
                      </p>
                    </div>
                    <p className="text-[11px] text-purple-600 font-semibold mt-3 flex items-center gap-1">
                      <Box className="w-3.5 h-3.5" />
                      <span>{featuredEcn.inventoryCheck3.actionRequired}</span>
                    </p>
                  </div>

                </div>

                {/* Effectivity Dates & Description Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-700">Stock Check Date</span>
                      <p className="text-xs font-bold text-indigo-950 mt-0.5">{featuredEcn.dateOfStockCheck || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-700">Future Cutoff Date</span>
                      <p className="text-xs font-bold text-indigo-950 mt-0.5">{featuredEcn.futureDate || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">Requester</span>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{featuredEcn.requesterName}</p>
                    </div>
                    <button
                      onClick={() => onViewEcn(featuredEcn)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Full View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <p className="text-xs text-slate-600 italic line-clamp-2">
                    <strong className="not-italic text-slate-800">Reason / Scope:</strong> {featuredEcn.reasonForChange || 'ECN documentation and Engineering change execution.'}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

        </div>

        {/* Right Column (4 cols): Approval Pipeline Dark Bento Tile */}
        <div className="lg:col-span-4 flex flex-col space-y-5">
          
          <div className="bg-slate-900 p-6 rounded-2xl shadow-lg flex-1 text-white flex flex-col justify-between border border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Approval Pipeline</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  6-Stage
                </span>
              </div>

              {featuredEcn ? (
                <div className="space-y-4">
                  {featuredEcn.approvals.map((app, idx) => (
                    <div key={app.id} className="flex items-start space-x-3 text-xs">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                        app.status === 'Approved'
                          ? 'bg-emerald-500 text-white'
                          : app.status === 'Rejected'
                          ? 'bg-rose-500 text-white'
                          : app.status === 'Revision Requested'
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {app.status === 'Approved' ? '✓' : idx + 1}
                      </div>
                      <div className="flex-1 border-b border-slate-800/80 pb-2">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-slate-200">{app.department}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            app.status === 'Approved'
                              ? 'text-emerald-400 bg-emerald-950/50'
                              : app.status === 'Rejected'
                              ? 'text-rose-400 bg-rose-950/50'
                              : 'text-amber-400 bg-amber-950/50'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{app.approverName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-xs text-center py-8">
                  No approval pipeline loaded
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={onOpenNewEcnModal}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold shadow transition active:scale-98 text-center"
              >
                Initiate New Department Sign-off
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* KPI Bento Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total ECNs</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
          <p className="text-[10px] text-slate-400 mt-1">Total in repository</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">In Review</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{stats.pending}</p>
          <p className="text-[10px] text-slate-400 mt-1">Pending dept sign-offs</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Approved</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{stats.approved}</p>
          <p className="text-[10px] text-slate-400 mt-1">All stages verified</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Rejections</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{stats.rejected}</p>
          <p className="text-[10px] text-slate-400 mt-1">Revision / Action required</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Cost Impact</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">${stats.totalCostImpact.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-slate-400 mt-1">Scrap & BOM revision</p>
        </div>

      </div>

      {/* Toolbar & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search ECN ID, Title, Product Model, Requester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
            <Building2 className="w-3.5 h-3.5" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering & Design">Engineering & Design</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Production & Assembly">Production & Assembly</option>
              <option value="Supply Chain & Purchase">Supply Chain & Purchase</option>
              <option value="Stores & Inventory">Stores & Inventory</option>
              <option value="Finance & Accounts">Finance & Accounts</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 text-xs text-slate-500 font-medium">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="In Review">In Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Revision Needed">Revision Needed</option>
            </select>
          </div>

          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>

      </div>

      {/* Master ECN Bento Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Engineering Change Notice Master Ledger</h3>
            <p className="text-xs text-slate-500">Live tracker with 3 Inventory Check status, cutoff dates & approval state</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {filteredEcns.length} ECN Records
          </span>
        </div>

        {filteredEcns.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">No ECN Records Match Filters</p>
            <button
              onClick={onOpenNewEcnModal}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow"
            >
              + Create New ECN
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-5">ECN Ref ID</th>
                  <th className="py-3 px-5">Title & Product Model</th>
                  <th className="py-3 px-5">Check & Cutoff Date</th>
                  <th className="py-3 px-5">Inventory Checks (1, 2, 3)</th>
                  <th className="py-3 px-5">Dept Sign-off Pipeline</th>
                  <th className="py-3 px-5">Cost Impact</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredEcns.map((ecn) => {
                  const totalImpact = ecn.lineItems.reduce((acc, curr) => acc + (curr.totalCostImpact || 0), 0);
                  
                  return (
                    <tr key={ecn.id} className="hover:bg-slate-50/80 transition group">
                      
                      {/* ECN ID */}
                      <td className="py-3.5 px-5 font-mono font-bold text-indigo-700">
                        <div className="flex items-center space-x-1">
                          <span>{ecn.id}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(ecn.uniqueLink);
                              alert(`Direct share link copied!\n\n${ecn.uniqueLink}`);
                            }}
                            className="p-1 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded transition"
                            title="Copy Share Link"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                          {ecn.requesterName}
                        </div>
                      </td>

                      {/* Title & Model */}
                      <td className="py-3.5 px-5 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition">
                          {ecn.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1">
                          <Box className="w-3 h-3 text-slate-400" />
                          <span className="line-clamp-1">{ecn.productModel}</span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-5">
                        <div className="text-[11px] font-medium text-slate-800 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-indigo-500" />
                          <span>Check: {ecn.dateOfStockCheck || 'N/A'}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-indigo-700 flex items-center space-x-1 mt-0.5">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          <span>Cutoff: {ecn.futureDate || 'N/A'}</span>
                        </div>
                      </td>

                      {/* 3 Inventory Checks Badges */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-1 text-[10px]">
                          <div className="flex items-center justify-between gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            <span className="font-semibold text-slate-600">Check-1 (Raw):</span>
                            <span className="font-bold text-indigo-900">{ecn.inventoryCheck1.qtyAffected} Pcs</span>
                          </div>
                          <div className="flex items-center justify-between gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            <span className="font-semibold text-slate-600">Check-2 (WIP):</span>
                            <span className="font-bold text-indigo-900">{ecn.inventoryCheck2.qtyAffected} Pcs</span>
                          </div>
                          <div className="flex items-center justify-between gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            <span className="font-semibold text-slate-600">Check-3 (FG):</span>
                            <span className="font-bold text-indigo-900">{ecn.inventoryCheck3.qtyAffected} Pcs</span>
                          </div>
                        </div>
                      </td>

                      {/* Department Approval Matrix */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          {ecn.approvals.map((app) => (
                            <div
                              key={app.id}
                              className="flex items-center space-x-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[10px] font-medium text-slate-600"
                              title={`${app.department}: ${app.status}`}
                            >
                              {getDeptStatusPill(app.status)}
                              <span className="truncate max-w-[60px]">{app.department.split(' ')[0]}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Cost Impact */}
                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        ${totalImpact.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {getStatusBadge(ecn.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => onViewEcn(ecn)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition border border-indigo-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

