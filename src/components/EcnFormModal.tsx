import React, { useState, useEffect } from 'react';
import { EcnRecord, UserProfile, Department, InventoryCheckItem, EcnLineItem, DepartmentApproval } from '../types';
import { parseEcnExcelFile, downloadSampleEcnTemplate } from '../utils/excelUtils';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Plus, 
  Trash2, 
  Calendar, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Box,
  Layers,
  Sparkles,
  Link2,
  UserCheck
} from 'lucide-react';

interface EcnFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserProfile;
  users: UserProfile[];
  onSubmitEcn: (newEcn: EcnRecord) => void;
}

export const EcnFormModal: React.FC<EcnFormModalProps> = ({
  isOpen,
  onClose,
  activeUser,
  users,
  onSubmitEcn
}) => {
  if (!isOpen) return null;

  // Basic Header Fields
  const [title, setTitle] = useState('');
  const [productModel, setProductModel] = useState('');
  const [changeType, setChangeType] = useState<EcnRecord['changeType']>('Design Change');
  const [changeReason, setChangeReason] = useState<EcnRecord['changeReason']>('Quality Issue');
  const [description, setDescription] = useState('');
  const [beforeChange, setBeforeChange] = useState('');
  const [afterChange, setAfterChange] = useState('');

  // 3 Inventory Check Line Items & Dates requested
  const [dateOfStockCheck, setDateOfStockCheck] = useState<string>(new Date().toISOString().split('T')[0]);
  const [futureDate, setFutureDate] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const [invCheck1, setInvCheck1] = useState<InventoryCheckItem>({
    id: 'inv-1',
    checkType: 'Inventory_Check-1',
    label: 'Raw Material & Component Stock (Stores)',
    location: 'Central Store Bin A-12',
    qtyOnHand: 2500,
    qtyAffected: 500,
    unitCost: 2.50,
    actionRequired: 'Purge & Replace',
    remarks: 'Return affected component batch to vendor.'
  });

  const [invCheck2, setInvCheck2] = useState<InventoryCheckItem>({
    id: 'inv-2',
    checkType: 'Inventory_Check-2',
    label: 'Work In Progress (WIP) Line Stock (Assembly)',
    location: 'SMT Line 2 Feeder 6',
    qtyOnHand: 400,
    qtyAffected: 400,
    unitCost: 2.50,
    actionRequired: 'Rework',
    remarks: 'Inline rework scheduled for SMT Line 2.'
  });

  const [invCheck3, setInvCheck3] = useState<InventoryCheckItem>({
    id: 'inv-3',
    checkType: 'Inventory_Check-3',
    label: 'Finished Goods (FG) Warehouse Stock',
    location: 'FG Bay 05 Pallet 3',
    qtyOnHand: 600,
    qtyAffected: 600,
    unitCost: 110.00,
    actionRequired: 'Use As-Is',
    remarks: 'Tested FG units comply with safety threshold.'
  });

  // Line Items
  const [lineItems, setLineItems] = useState<EcnLineItem[]>([
    {
      id: 'item-101',
      itemCode: 'IC-MCU-32BIT',
      description: '32-Bit Microcontroller High Density Package',
      presentRev: 'A1',
      proposedRev: 'A2',
      qtyAffected: 500,
      disposition: 'Scrap',
      unitCost: 4.80,
      totalCostImpact: 2400.00
    }
  ]);

  // Selected Approver Person IDs for Workflow
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (users && users.length > 0) {
      setSelectedUserIds(users.map(u => u.id));
    }
  }, [users, isOpen]);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Handle Excel Sheet Import
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess('');
    try {
      const parsed = await parseEcnExcelFile(file);
      if (parsed.header) {
        if (parsed.header.title) setTitle(parsed.header.title);
        if (parsed.header.productModel) setProductModel(parsed.header.productModel);
        if (parsed.header.changeType) setChangeType(parsed.header.changeType);
        if (parsed.header.changeReason) setChangeReason(parsed.header.changeReason);
        if (parsed.header.description) setDescription(parsed.header.description);
        if (parsed.header.beforeChange) setBeforeChange(parsed.header.beforeChange);
        if (parsed.header.afterChange) setAfterChange(parsed.header.afterChange);
      }

      if (parsed.dateOfStockCheck) setDateOfStockCheck(parsed.dateOfStockCheck);
      if (parsed.futureDate) setFutureDate(parsed.futureDate);

      if (parsed.inventory1) setInvCheck1(prev => ({ ...prev, ...parsed.inventory1 }));
      if (parsed.inventory2) setInvCheck2(prev => ({ ...prev, ...parsed.inventory2 }));
      if (parsed.inventory3) setInvCheck3(prev => ({ ...prev, ...parsed.inventory3 }));

      if (parsed.lineItems && parsed.lineItems.length > 0) {
        setLineItems(parsed.lineItems);
      }

      setUploadSuccess(`Successfully extracted ${parsed.lineItems.length} line items and Inventory Check data from Excel file!`);
    } catch (err) {
      alert('Error reading Excel file. Please ensure it is a valid .xlsx or .csv format.');
    } finally {
      setIsUploading(false);
    }
  };

  // Quick Pre-fill sample button
  const handlePrefillSample = () => {
    setTitle('SMT Microcontroller Component Pin-Compatibility Upgrade');
    setProductModel('Industrial IoT Controller Panel V4');
    setChangeType('Engineering Change' as any);
    setChangeReason('Component Obsolescence');
    setDescription('Upgrading MCU from STM32F407VGT6 to STM32F407VET6 due to global supply chain shortage.');
    setBeforeChange('Standard STM32F407VGT6 1MB Flash LQFP100.');
    setAfterChange('Pin-compatible STM32F407VET6 512KB Flash LQFP100 with firmware optimization.');
    setDateOfStockCheck('2026-08-08');
    setFutureDate('2026-08-30');

    setInvCheck1({
      id: 'inv-1',
      checkType: 'Inventory_Check-1',
      label: 'Raw Material & Component Stock (Stores)',
      location: 'Central Store Bin R-05',
      qtyOnHand: 1200,
      qtyAffected: 400,
      unitCost: 12.50,
      actionRequired: 'Return to Vendor',
      remarks: 'Supplier agreed to swap under warranty credit'
    });

    setInvCheck2({
      id: 'inv-2',
      checkType: 'Inventory_Check-2',
      label: 'Work In Progress (WIP) Line Stock (Assembly)',
      location: 'Line 2 SMT Station B',
      qtyOnHand: 250,
      qtyAffected: 250,
      unitCost: 12.50,
      actionRequired: 'Rework',
      remarks: 'Desolder MCU and reflow new revision'
    });

    setInvCheck3({
      id: 'inv-3',
      checkType: 'Inventory_Check-3',
      label: 'Finished Goods (FG) Warehouse Stock',
      location: 'Warehouse Bay 4',
      qtyOnHand: 180,
      qtyAffected: 180,
      unitCost: 160.00,
      actionRequired: 'Use As-Is',
      remarks: 'Existing batch fully passed flash check'
    });

    setLineItems([
      {
        id: 'item-1',
        itemCode: 'MCU-STM32F4-100',
        description: 'Microcontroller LQFP100 1MB Flash',
        presentRev: 'Rev A',
        proposedRev: 'Rev B',
        qtyAffected: 400,
        disposition: 'Return to Vendor',
        unitCost: 12.50,
        totalCostImpact: 5000.00
      },
      {
        id: 'item-2',
        itemCode: 'XTAL-8MHZ-SMD',
        description: '8MHz Crystal Oscillator 3225 SMD',
        presentRev: 'Rev 1.0',
        proposedRev: 'Rev 1.1',
        qtyAffected: 400,
        disposition: 'Use As-Is',
        unitCost: 0.45,
        totalCostImpact: 0.00
      }
    ]);
  };

  // Add new Line Item row
  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: `item-${Date.now()}`,
        bomType: 'Main BOM',
        parentPartNumber: '365-PL-8890',
        parentPartName: productModel || 'Smart Model',
        preVersion: 'A0',
        currentVersion: 'A1',
        action: 'REPLACE',
        findNumber: `00${lineItems.length + 1}`,
        childPartNumber: '',
        childPartName: '',
        preQuantity: 1,
        currentQuantity: 1,
        unit: 'Pcs',
        mainChildPart: 'YES',
        
        // standard fallback fields
        itemCode: '',
        description: '',
        presentRev: 'A0',
        proposedRev: 'A1',
        qtyAffected: 1,
        disposition: 'Use As-Is',
        unitCost: 0,
        totalCostImpact: 0
      }
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof EcnLineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'childPartNumber') updated.itemCode = value;
        if (field === 'itemCode') updated.childPartNumber = value;
        if (field === 'childPartName') updated.description = value;
        if (field === 'description') updated.childPartName = value;
        if (field === 'preVersion') updated.presentRev = value;
        if (field === 'presentRev') updated.preVersion = value;
        if (field === 'currentVersion') updated.proposedRev = value;
        if (field === 'proposedRev') updated.currentVersion = value;
        if (field === 'currentQuantity') updated.qtyAffected = Number(value);
        if (field === 'qtyAffected') updated.currentQuantity = Number(value);
        
        if (field === 'qtyAffected' || field === 'unitCost') {
          updated.totalCostImpact = Number(updated.qtyAffected || 0) * Number(updated.unitCost || 0);
        }
        return updated;
      }
      return item;
    }));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !productModel) {
      alert('Please fill in required fields: Title and Product Model.');
      return;
    }

    const ecnNumber = `ECN-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    const uniqueLink = `${window.location.origin}/?ecnId=${ecnNumber}`;

    // Build Approvals List from selected user persons
    const assignedUsers = users.filter(u => selectedUserIds.includes(u.id));
    const finalApproverPersons = assignedUsers.length > 0 ? assignedUsers : users;

    const approvals: DepartmentApproval[] = finalApproverPersons.map((usr, idx) => {
      const isRequester = usr.email.toLowerCase() === activeUser.email.toLowerCase() || usr.id === activeUser.id;
      
      return {
        id: `app-${idx + 1}`,
        department: usr.department,
        approverName: usr.name,
        approverEmail: usr.email,
        status: isRequester ? 'Approved' : 'Pending',
        comments: isRequester ? 'Initiated & Approved by Requester' : undefined,
        updatedAt: isRequester ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : undefined,
        signatureStamp: isRequester ? `${usr.name} - ${usr.department} Signed` : undefined
      };
    });

    const newEcn: EcnRecord = {
      id: ecnNumber,
      title,
      productModel,
      changeType,
      changeReason,
      description,
      beforeChange,
      afterChange,
      docNo: 'PAD/QA/QS/C/F/19',
      issueNoDate: '02 / 13-12-2022',
      revNoDate: '01 / 13-12-2022',
      inventoryCheck1: invCheck1,
      inventoryCheck2: invCheck2,
      inventoryCheck3: invCheck3,
      dateOfStockCheck,
      futureDate,
      reminderSent1DayBefore: false,
      lineItems,
      requesterName: activeUser.name,
      requesterEmail: activeUser.email,
      requesterDepartment: activeUser.department,
      approvals,
      status: 'In Review',
      createdAt: new Date().toLocaleDateString('en-US'),
      submittedAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      uniqueLink
    };

    onSubmitEcn(newEcn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col my-auto overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Create New Paperless ECN Request</h3>
              <p className="text-xs text-slate-400">Import Excel BOM or fill line items & 3 Inventory Checks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          
          {/* Top Section: Excel Import Banner */}
          <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Upload Excel Sheet (.xlsx / .csv)</h4>
                <p className="text-xs text-slate-500">Automatically fetch and populate line items, stock check dates & inventory checks</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow transition">
                <FileSpreadsheet className="w-4 h-4" />
                <span>{isUploading ? 'Parsing Excel...' : 'Choose Excel File'}</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>

              <button
                type="button"
                onClick={downloadSampleEcnTemplate}
                className="inline-flex items-center space-x-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Download Sample Template</span>
              </button>

              <button
                type="button"
                onClick={handlePrefillSample}
                className="inline-flex items-center space-x-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Sample Fill</span>
              </button>
            </div>
          </div>

          {uploadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {/* ECN Header Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ECN Title / Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PCB Mainboard Component Upgrade"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Model / Project <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smart LED TV 55-Inch (Model ST-55X)"
                value={productModel}
                onChange={(e) => setProductModel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Change Type</label>
              <select
                value={changeType}
                onChange={(e) => setChangeType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Design Change">Design Change</option>
                <option value="Material Substitution">Material Substitution</option>
                <option value="BOM Update">BOM Update</option>
                <option value="Process Revision">Process Revision</option>
                <option value="Software/Firmware">Software/Firmware</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Change Reason</label>
              <select
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Quality Issue">Quality Issue</option>
                <option value="Cost Reduction">Cost Reduction</option>
                <option value="Component Obsolescence">Component Obsolescence</option>
                <option value="Customer Request">Customer Request</option>
                <option value="Safety & Compliance">Safety & Compliance</option>
              </select>
            </div>
          </div>

          {/* Description & Before/After */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description of Change</label>
              <textarea
                rows={3}
                placeholder="Explain engineering rationale..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Before Change State</label>
              <textarea
                rows={3}
                placeholder="Old rev configuration..."
                value={beforeChange}
                onChange={(e) => setBeforeChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">After Change State</label>
              <textarea
                rows={3}
                placeholder="Proposed rev configuration..."
                value={afterChange}
                onChange={(e) => setAfterChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Dates Section (Date of Stock Check & Future Date) */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Stock Check & Implementation Cutoff Dates</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Date of Stock Check <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateOfStockCheck}
                  onChange={(e) => setDateOfStockCheck(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">Date physical stock count was verified</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">
                  Future Cutoff Date (Effectivity) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={futureDate}
                  onChange={(e) => setFutureDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-indigo-400 rounded-lg text-xs font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">Date when new ECN revision takes effect in assembly line</p>
              </div>
            </div>
          </div>

          {/* SPECIFIC REQUESTED 3 INVENTORY CHECKS SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-600" />
                <span>3 Line Items for Stock Verification (Inventory_Check-1, 2, 3)</span>
              </h4>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Department-wise Audit Mandatory
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Inventory_Check-1 */}
              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <span className="text-xs font-bold text-amber-900">Inventory_Check-1</span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">
                    Stores & Raw Material
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inventory Qty</label>
                  <input
                    type="number"
                    value={invCheck1.qtyOnHand}
                    onChange={(e) => setInvCheck1({ ...invCheck1, qtyOnHand: Number(e.target.value), qtyAffected: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-amber-900 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Remarks</label>
                  <input
                    type="text"
                    placeholder="Enter stock check remarks..."
                    value={invCheck1.remarks}
                    onChange={(e) => setInvCheck1({ ...invCheck1, remarks: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Inventory_Check-2 */}
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                  <span className="text-xs font-bold text-blue-900">Inventory_Check-2</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-200/60 px-1.5 py-0.5 rounded">
                    WIP Line Stock
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inventory Qty</label>
                  <input
                    type="number"
                    value={invCheck2.qtyOnHand}
                    onChange={(e) => setInvCheck2({ ...invCheck2, qtyOnHand: Number(e.target.value), qtyAffected: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Remarks</label>
                  <input
                    type="text"
                    placeholder="Enter WIP stock remarks..."
                    value={invCheck2.remarks}
                    onChange={(e) => setInvCheck2({ ...invCheck2, remarks: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Inventory_Check-3 */}
              <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-purple-200/80 pb-2">
                  <span className="text-xs font-bold text-purple-900">Inventory_Check-3</span>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-200/60 px-1.5 py-0.5 rounded">
                    Finished Goods (FG)
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inventory Qty</label>
                  <input
                    type="number"
                    value={invCheck3.qtyOnHand}
                    onChange={(e) => setInvCheck3({ ...invCheck3, qtyOnHand: Number(e.target.value), qtyAffected: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-purple-900 outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Remarks</label>
                  <input
                    type="text"
                    placeholder="Enter FG stock remarks..."
                    value={invCheck3.remarks}
                    onChange={(e) => setInvCheck3({ ...invCheck3, remarks: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Change Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>BOM & Change Line Items</span>
              </h4>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Row</span>
              </button>
            </div>

            <div className="border border-slate-300 rounded-xl overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
                <thead>
                  <tr className="bg-indigo-100/80 text-indigo-950 font-bold uppercase border-b border-indigo-200 divide-x divide-indigo-200/80">
                    <th className="py-2 px-2.5">BOM Type</th>
                    <th className="py-2 px-2.5">Parent Part Number</th>
                    <th className="py-2 px-2.5">Parent Part Name</th>
                    <th className="py-2 px-2.5">Pre Version</th>
                    <th className="py-2 px-2.5">Current Version</th>
                    <th className="py-2 px-2.5">Action</th>
                    <th className="py-2 px-2.5">Find Number</th>
                    <th className="py-2 px-2.5">Child Part Number</th>
                    <th className="py-2 px-2.5">Child Part Name</th>
                    <th className="py-2 px-2.5">Pre Quantity</th>
                    <th className="py-2 px-2.5">Current Quantity</th>
                    <th className="py-2 px-2.5">Unit</th>
                    <th className="py-2 px-2.5">Main Child Part</th>
                    <th className="py-2 px-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs bg-white">
                  {lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 divide-x divide-slate-100">
                      {/* 1. BOM Type */}
                      <td className="py-1.5 px-2 min-w-[110px]">
                        <input
                          type="text"
                          value={item.bomType || 'Main BOM'}
                          onChange={(e) => handleLineItemChange(item.id, 'bomType', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                        />
                      </td>

                      {/* 2. Parent Part Number */}
                      <td className="py-1.5 px-2 min-w-[130px]">
                        <input
                          type="text"
                          value={item.parentPartNumber || '365-PL-8890'}
                          onChange={(e) => handleLineItemChange(item.id, 'parentPartNumber', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                        />
                      </td>

                      {/* 3. Parent Part Name */}
                      <td className="py-1.5 px-2 min-w-[140px]">
                        <input
                          type="text"
                          value={item.parentPartName || productModel || 'Smart Model'}
                          onChange={(e) => handleLineItemChange(item.id, 'parentPartName', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                        />
                      </td>

                      {/* 4. Pre Version */}
                      <td className="py-1.5 px-2 w-20">
                        <input
                          type="text"
                          value={item.preVersion || item.presentRev || 'A0'}
                          onChange={(e) => handleLineItemChange(item.id, 'preVersion', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-center"
                        />
                      </td>

                      {/* 5. Current Version */}
                      <td className="py-1.5 px-2 w-20">
                        <input
                          type="text"
                          value={item.currentVersion || item.proposedRev || 'A1'}
                          onChange={(e) => handleLineItemChange(item.id, 'currentVersion', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-center font-bold text-blue-700"
                        />
                      </td>

                      {/* 6. Action */}
                      <td className="py-1.5 px-2 w-24">
                        <input
                          type="text"
                          value={item.action || 'REPLACE'}
                          onChange={(e) => handleLineItemChange(item.id, 'action', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800"
                        />
                      </td>

                      {/* 7. Find Number */}
                      <td className="py-1.5 px-2 w-20">
                        <input
                          type="text"
                          value={item.findNumber || '001'}
                          onChange={(e) => handleLineItemChange(item.id, 'findNumber', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-center font-mono"
                        />
                      </td>

                      {/* 8. Child Part Number */}
                      <td className="py-1.5 px-2 min-w-[130px]">
                        <input
                          type="text"
                          placeholder="e.g. IC-MCU-32BIT"
                          value={item.childPartNumber || item.itemCode || ''}
                          onChange={(e) => handleLineItemChange(item.id, 'childPartNumber', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold text-indigo-900"
                        />
                      </td>

                      {/* 9. Child Part Name */}
                      <td className="py-1.5 px-2 min-w-[150px]">
                        <input
                          type="text"
                          placeholder="Component Description"
                          value={item.childPartName || item.description || ''}
                          onChange={(e) => handleLineItemChange(item.id, 'childPartName', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                        />
                      </td>

                      {/* 10. Pre Quantity */}
                      <td className="py-1.5 px-2 w-20">
                        <input
                          type="number"
                          value={item.preQuantity ?? 0}
                          onChange={(e) => handleLineItemChange(item.id, 'preQuantity', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-center"
                        />
                      </td>

                      {/* 11. Current Quantity */}
                      <td className="py-1.5 px-2 w-20">
                        <input
                          type="number"
                          value={item.currentQuantity ?? item.qtyAffected ?? 1}
                          onChange={(e) => handleLineItemChange(item.id, 'currentQuantity', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-center font-bold text-slate-900"
                        />
                      </td>

                      {/* 12. Unit */}
                      <td className="py-1.5 px-2 w-20">
                        <input
                          type="text"
                          value={item.unit || 'Pcs'}
                          onChange={(e) => handleLineItemChange(item.id, 'unit', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-center"
                        />
                      </td>

                      {/* 13. Main Child Part */}
                      <td className="py-1.5 px-2 w-24">
                        <input
                          type="text"
                          value={item.mainChildPart || 'YES'}
                          onChange={(e) => handleLineItemChange(item.id, 'mainChildPart', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-center font-semibold"
                        />
                      </td>

                      {/* 14. Delete Action */}
                      <td className="py-1.5 px-2 text-center w-12">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="p-1 hover:bg-rose-100 text-rose-600 rounded transition"
                          title="Remove Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Person Approvers Selection Checklist */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>Assigned Approvers Person Roster (Instant Link & Email Dispatched)</span>
              </h4>
              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedUserIds(users.map(u => u.id))}
                  className="text-[11px] text-purple-700 hover:text-purple-900 font-bold underline"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setSelectedUserIds([activeUser.id])}
                  className="text-[11px] text-slate-500 hover:text-slate-700 font-semibold underline"
                >
                  Clear Others
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {users.map((usr) => {
                const isChecked = selectedUserIds.includes(usr.id);
                return (
                  <label
                    key={usr.id}
                    className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      isChecked
                        ? 'bg-purple-50/90 border-purple-300 text-slate-900 shadow-sm ring-1 ring-purple-200'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUserIds([...selectedUserIds, usr.id]);
                        } else {
                          setSelectedUserIds(selectedUserIds.filter(id => id !== usr.id));
                        }
                      }}
                      className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 truncate">{usr.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0 border border-slate-200">
                          {usr.department}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{usr.email}</p>
                      <p className="text-[10px] text-purple-700 font-semibold">{usr.role}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Requester Sender ID: <strong className="text-slate-800">{activeUser.email}</strong></span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit ECN & Dispatch Approver Emails</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
