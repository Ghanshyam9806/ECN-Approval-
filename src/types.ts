export type Department = 
  | 'PRODUCTION'
  | 'STORE'
  | 'PPC'
  | 'PURCHASE'
  | 'SMT PQC'
  | 'IE'
  | 'IQC'
  | 'PQC'
  | 'NPI'
  | 'SMT NPI'
  | 'SMT MAINTENANCE'
  | 'IMPLEMENTATION IN SAP'
  | 'Engineering & Design'
  | 'Quality Assurance'
  | 'Production & Assembly'
  | 'Supply Chain & Purchase'
  | 'Stores & Inventory'
  | 'Finance & Accounts';

export type UserRole = 
  | 'Requester'
  | 'Department Approver'
  | 'ECN Coordinator'
  | 'Auditor'
  | 'ECN Manager';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  department: Department;
  role: UserRole;
  designation: string;
  signatureUrl?: string;
  phone?: string;
}

export type ApprovalState = 'Pending' | 'Approved' | 'Rejected' | 'Revision Requested';

export interface DepartmentApproval {
  id: string;
  department: Department;
  approverName: string;
  approverEmail: string;
  status: ApprovalState;
  comments?: string;
  updatedAt?: string;
  signatureStamp?: string;
  liability?: string;
}

export interface InventoryCheckItem {
  id: string;
  checkType: 'Inventory_Check-1' | 'Inventory_Check-2' | 'Inventory_Check-3';
  label: string; // e.g. "Raw Material & Component Stock", "Work In Progress (WIP) Line Stock", "Finished Goods (FG) Warehouse Stock"
  location: string;
  qtyOnHand: number;
  qtyAffected: number;
  unitCost: number;
  actionRequired: 'Scrap' | 'Rework' | 'Use As-Is' | 'Return to Vendor' | 'Purge & Replace';
  remarks: string;
  signNpiPpcPurchase?: string;
}

export interface EcnLineItem {
  id: string;
  bomType?: string; // e.g. "Main BOM", "Sub BOM"
  parentPartNumber?: string;
  parentPartName?: string;
  preVersion?: string;
  currentVersion?: string;
  action?: string; // e.g. "ADD", "MODIFY", "DELETE", "REPLACE"
  findNumber?: string;
  childPartNumber?: string;
  childPartName?: string;
  preQuantity?: number;
  currentQuantity?: number;
  unit?: string; // e.g. "Pcs", "Mtr", "Set"
  mainChildPart?: string;
  
  // Standard compatibility fields
  itemCode: string;
  description: string;
  presentRev: string;
  proposedRev: string;
  qtyAffected: number;
  disposition: 'Scrap' | 'Rework' | 'Use As-Is' | 'Phase Out';
  unitCost: number;
  totalCostImpact: number;
}

export type EcnOverallStatus = 'Draft' | 'Submitted' | 'In Review' | 'Approved' | 'Rejected' | 'Revision Needed';

export interface EcnRecord {
  id: string; // e.g., ECN-2026-08-001
  title: string;
  productModel: string;
  changeType: 'Design Change' | 'Material Substitution' | 'BOM Update' | 'Process Revision' | 'Software/Firmware';
  changeReason: 'Quality Issue' | 'Cost Reduction' | 'Component Obsolescence' | 'Customer Request' | 'Safety & Compliance';
  description: string;
  beforeChange: string;
  afterChange: string;
  
  // Padget Header Metadata
  docNo?: string; // "PAD/QA/QS/C/F/19"
  issueNoDate?: string; // "02 / 13-12-2022"
  revNoDate?: string; // "01 / 13-12-2022"

  // Specific inventory check metadata
  inventoryCheck1: InventoryCheckItem;
  inventoryCheck2: InventoryCheckItem;
  inventoryCheck3: InventoryCheckItem;
  dateOfStockCheck: string; // Date of physical inventory count
  futureDate: string; // Future implementation / stock cut-off date
  reminderSent1DayBefore?: boolean; // True if 1-day pre-cutoff automated email was dispatched

  // Line items (imported from Excel or created manually)
  lineItems: EcnLineItem[];

  // Requester Info
  requesterName: string;
  requesterEmail: string;
  requesterDepartment: Department;

  // Department Approvals
  approvals: DepartmentApproval[];

  // Meta
  status: EcnOverallStatus;
  createdAt: string;
  submittedAt?: string;
  updatedAt: string;
  uniqueLink: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  role: UserRole;
  department: Department;
  action: string;
  details: string;
  ecnId?: string;
  ipAddress: string;
}

export interface NotificationEmail {
  id: string;
  ecnId: string;
  ecnTitle: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  toDepartment: Department;
  subject: string;
  body: string;
  uniqueLink: string;
  sentAt: string;
  status: 'Delivered' | 'Pending';
}
