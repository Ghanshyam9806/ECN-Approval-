import { UserProfile, EcnRecord, AuditLog, NotificationEmail } from '../types';

export const SYSTEM_USERS: UserProfile[] = [
  {
    id: 'usr-mgr',
    name: 'Pankaj Sharma',
    email: 'pankaj.sharma@padget.dixoninfo.com',
    department: 'Engineering & Design',
    role: 'ECN Manager',
    designation: 'ECN Systems & Engineering Manager',
    signatureUrl: 'P. Sharma ECN Manager Sign'
  },
  {
    id: 'usr-1',
    name: 'Ghanshyam Sahu',
    email: 'ghanshyamsahu.padget@dixoninfo.com',
    department: 'NPI',
    role: 'Requester',
    designation: 'Senior NPI Design Engineer',
    signatureUrl: 'Ghanshyam Sahu - Signed 2026'
  },
  {
    id: 'usr-2',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@padget.dixoninfo.com',
    department: 'PQC',
    role: 'Department Approver',
    designation: 'PQC Quality Head',
    signatureUrl: 'R. Sharma PQC Sign'
  },
  {
    id: 'usr-3',
    name: 'Anita Verma',
    email: 'anita.verma@padget.dixoninfo.com',
    department: 'PRODUCTION',
    role: 'Department Approver',
    designation: 'Production Operations Head',
    signatureUrl: 'Anita V. Prod Sign'
  },
  {
    id: 'usr-4',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@padget.dixoninfo.com',
    department: 'PURCHASE',
    role: 'Department Approver',
    designation: 'Purchase & SCM Lead',
    signatureUrl: 'V. Mehta Purchase Sign'
  },
  {
    id: 'usr-5',
    name: 'Sanjeev Kumar',
    email: 'sanjeev.kumar@padget.dixoninfo.com',
    department: 'STORE',
    role: 'Department Approver',
    designation: 'Warehouse & Stores Manager',
    signatureUrl: 'S. Kumar Stores Sign'
  },
  {
    id: 'usr-6',
    name: 'PPC Lead User',
    email: 'ppc.head@padget.dixoninfo.com',
    department: 'PPC',
    role: 'Department Approver',
    designation: 'Production Planning & Control Lead',
    signatureUrl: 'PPC Head Sign'
  },
  {
    id: 'usr-7',
    name: 'Ramesh Gupta',
    email: 'ramesh.gupta@padget.dixoninfo.com',
    department: 'IMPLEMENTATION IN SAP',
    role: 'Department Approver',
    designation: 'SAP Master Data Lead',
    signatureUrl: 'R. Gupta SAP Sign'
  },
  {
    id: 'usr-8',
    name: 'Amitabh Sen',
    email: 'audit.head@dixoninfo.com',
    department: 'IQC',
    role: 'Auditor',
    designation: 'Lead Internal Auditor',
    signatureUrl: 'A. Sen ISO Auditor'
  }
];

export const INITIAL_ECN_RECORDS: EcnRecord[] = [
  {
    id: 'ECN-2026-08-001',
    title: 'PCB Mainboard Voltage Regulator Component Upgrade',
    productModel: 'Smart LED TV 55-Inch (Model ST-55X)',
    changeType: 'Material Substitution',
    changeReason: 'Component Obsolescence',
    description: 'Replacing end-of-life capacitor C402 with high-grade Automotive X7R ceramic capacitor to prevent power ripple failure during high power surges.',
    beforeChange: 'Using Capacitor Part #CAP-470UF-16V (Rev A1). High thermal failure rate reported in field thermal chamber tests.',
    afterChange: 'Upgraded to Automotive Grade Part #CAP-470UF-25V-AUTO (Rev B0) with expanded operating temp range -55°C to 125°C.',
    dateOfStockCheck: '2026-08-01',
    futureDate: '2026-08-25',
    inventoryCheck1: {
      id: 'inv-101',
      checkType: 'Inventory_Check-1',
      label: 'Raw Material & Component Stock (Stores)',
      location: 'Central Warehouse Bin A-14',
      qtyOnHand: 4500,
      qtyAffected: 1200,
      unitCost: 0.85,
      actionRequired: 'Purge & Replace',
      remarks: 'Return 1,200 obsolete Rev A1 components to supplier for credit adjustment.'
    },
    inventoryCheck2: {
      id: 'inv-102',
      checkType: 'Inventory_Check-2',
      label: 'Work In Progress (WIP) Line Stock (Assembly)',
      location: 'SMT Line #3 Feeder Station 4',
      qtyOnHand: 350,
      qtyAffected: 350,
      unitCost: 0.85,
      actionRequired: 'Scrap',
      remarks: 'Quarantine 350 pcs loaded in feeders; issue engineering scrap note.'
    },
    inventoryCheck3: {
      id: 'inv-103',
      checkType: 'Inventory_Check-3',
      label: 'Finished Goods (FG) Warehouse Stock',
      location: 'FG Bay 08 - Pallet 12 to 18',
      qtyOnHand: 820,
      qtyAffected: 820,
      unitCost: 145.00,
      actionRequired: 'Rework',
      remarks: '820 assembled TV PCBA sets scheduled for inline rework and re-testing before dispatch.'
    },
    lineItems: [
      {
        id: 'item-1',
        itemCode: 'CAP-470UF-16V',
        description: 'Capacitor 470uF 16V SMD 20% (Old Standard)',
        presentRev: 'A1',
        proposedRev: 'B0',
        qtyAffected: 1550,
        disposition: 'Scrap',
        unitCost: 0.85,
        totalCostImpact: 1317.50
      },
      {
        id: 'item-2',
        itemCode: 'RES-10K-0805',
        description: 'Resistor 10K Ohm 1/8W 1% SMD (Associated Pull-up)',
        presentRev: 'A0',
        proposedRev: 'A1',
        qtyAffected: 1550,
        disposition: 'Use As-Is',
        unitCost: 0.05,
        totalCostImpact: 0.00
      },
      {
        id: 'item-3',
        itemCode: 'PCB-55X-MB',
        description: 'Mainboard Motherboard Bare PCB Layout',
        presentRev: 'V2.1',
        proposedRev: 'V2.2',
        qtyAffected: 820,
        disposition: 'Rework',
        unitCost: 18.50,
        totalCostImpact: 15170.00
      }
    ],
    requesterName: 'Ghanshyam Sahu',
    requesterEmail: 'ghanshyamsahu.padget@dixoninfo.com',
    requesterDepartment: 'Engineering & Design',
    approvals: [
      {
        id: 'app-1',
        department: 'Engineering & Design',
        approverName: 'Ghanshyam Sahu',
        approverEmail: 'ghanshyamsahu.padget@dixoninfo.com',
        status: 'Approved',
        comments: 'Design simulation and thermal stress verification completed successfully.',
        updatedAt: '2026-08-05 10:15 AM',
        signatureStamp: 'G. Sahu - Eng Approval'
      },
      {
        id: 'app-2',
        department: 'Quality Assurance',
        approverName: 'Rajesh Sharma',
        approverEmail: 'rajesh.sharma@dixoninfo.com',
        status: 'Approved',
        comments: 'Reliability tests passed 1,000 hrs burn-in without voltage spikes.',
        updatedAt: '2026-08-06 02:30 PM',
        signatureStamp: 'R. Sharma - QA Verified'
      },
      {
        id: 'app-3',
        department: 'Production & Assembly',
        approverName: 'Anita Verma',
        approverEmail: 'anita.verma@dixoninfo.com',
        status: 'Pending',
        comments: 'Awaiting SMT feeder re-tooling schedule setup for Line 3.',
        updatedAt: '2026-08-06 02:35 PM'
      },
      {
        id: 'app-4',
        department: 'Supply Chain & Purchase',
        approverName: 'Vikram Mehta',
        approverEmail: 'vikram.mehta@dixoninfo.com',
        status: 'Pending',
        comments: 'Vendor PO placed for 10,000 units of Rev B0 capacitors. Delivery expected Aug 20.'
      },
      {
        id: 'app-5',
        department: 'Stores & Inventory',
        approverName: 'Sanjeev Kumar',
        approverEmail: 'sanjeev.kumar@dixoninfo.com',
        status: 'Pending'
      },
      {
        id: 'app-6',
        department: 'Finance & Accounts',
        approverName: 'Priya Patel',
        approverEmail: 'priya.patel@dixoninfo.com',
        status: 'Pending'
      }
    ],
    status: 'In Review',
    createdAt: '2026-08-05 09:30 AM',
    submittedAt: '2026-08-05 10:15 AM',
    updatedAt: '2026-08-06 02:30 PM',
    uniqueLink: `${window.location.origin}/?ecnId=ECN-2026-08-001`
  },
  {
    id: 'ECN-2026-08-002',
    title: 'Enclosure Back-Cover Fastener & Gasket Material Revision',
    productModel: 'Outdoor Smart Meter Display Panel (Model SM-OD-100)',
    changeType: 'Design Change',
    changeReason: 'Safety & Compliance',
    description: 'Updated back-housing silicone gasket to IP67 ingress rating to resolve outdoor water condensation issues reported during monsoon field trials.',
    beforeChange: 'Standard EPDM rubber foam strip gasket (Rev 1.0). IP65 rating.',
    afterChange: 'Molded liquid silicone rubber (LSR) continuous perimeter ring (Rev 2.0). IP67 certified.',
    dateOfStockCheck: '2026-08-03',
    futureDate: '2026-09-01',
    inventoryCheck1: {
      id: 'inv-201',
      checkType: 'Inventory_Check-1',
      label: 'Raw Material & Component Stock (Stores)',
      location: 'Warehouse Bin C-09',
      qtyOnHand: 2200,
      qtyAffected: 2200,
      unitCost: 1.20,
      actionRequired: 'Use As-Is',
      remarks: 'Use remaining EPDM stock for indoor model variants (SM-ID-50).'
    },
    inventoryCheck2: {
      id: 'inv-202',
      checkType: 'Inventory_Check-2',
      label: 'Work In Progress (WIP) Line Stock (Assembly)',
      location: 'Assembly Line #1 Table B',
      qtyOnHand: 150,
      qtyAffected: 150,
      unitCost: 1.20,
      actionRequired: 'Rework',
      remarks: 'Swap gaskets on 150 in-line sub-assemblies before final screw torqueing.'
    },
    inventoryCheck3: {
      id: 'inv-203',
      checkType: 'Inventory_Check-3',
      label: 'Finished Goods (FG) Warehouse Stock',
      location: 'FG Bay 02 - Rack 4',
      qtyOnHand: 410,
      qtyAffected: 410,
      unitCost: 98.00,
      actionRequired: 'Rework',
      remarks: '410 FG units in stock require opening back cover, installing LSR gasket, and re-torquing.'
    },
    lineItems: [
      {
        id: 'item-201',
        itemCode: 'GSK-EPDM-01',
        description: 'EPDM Foam Strip Gasket IP65',
        presentRev: '1.0',
        proposedRev: '2.0',
        qtyAffected: 2200,
        disposition: 'Phase Out',
        unitCost: 1.20,
        totalCostImpact: 2640.00
      },
      {
        id: 'item-202',
        itemCode: 'GSK-LSR-02',
        description: 'Molded Liquid Silicone Rubber Gasket IP67',
        presentRev: '0.0',
        proposedRev: '1.0',
        qtyAffected: 5000,
        disposition: 'Use As-Is',
        unitCost: 2.10,
        totalCostImpact: 10500.00
      }
    ],
    requesterName: 'Ghanshyam Sahu',
    requesterEmail: 'ghanshyamsahu.padget@dixoninfo.com',
    requesterDepartment: 'Engineering & Design',
    approvals: [
      {
        id: 'app-201',
        department: 'Engineering & Design',
        approverName: 'Ghanshyam Sahu',
        approverEmail: 'ghanshyamsahu.padget@dixoninfo.com',
        status: 'Approved',
        comments: 'CAD drawings updated and FEA pressure sealing validated.',
        updatedAt: '2026-08-04 11:00 AM',
        signatureStamp: 'G. Sahu - Approved'
      },
      {
        id: 'app-202',
        department: 'Quality Assurance',
        approverName: 'Rajesh Sharma',
        approverEmail: 'rajesh.sharma@dixoninfo.com',
        status: 'Approved',
        comments: 'IP67 water immersion test passed (1 meter depth for 30 minutes).',
        updatedAt: '2026-08-04 03:20 PM',
        signatureStamp: 'R. Sharma - QA Sign'
      },
      {
        id: 'app-203',
        department: 'Production & Assembly',
        approverName: 'Anita Verma',
        approverEmail: 'anita.verma@dixoninfo.com',
        status: 'Approved',
        comments: 'Tooling jig modified for automated gasket insertion.',
        updatedAt: '2026-08-05 09:10 AM',
        signatureStamp: 'Anita V. Approved'
      },
      {
        id: 'app-204',
        department: 'Supply Chain & Purchase',
        approverName: 'Vikram Mehta',
        approverEmail: 'vikram.mehta@dixoninfo.com',
        status: 'Approved',
        comments: 'Supplier tooling approved. Unit pricing negotiated at $2.10.',
        updatedAt: '2026-08-05 01:45 PM',
        signatureStamp: 'V. Mehta SCM OK'
      },
      {
        id: 'app-205',
        department: 'Stores & Inventory',
        approverName: 'Sanjeev Kumar',
        approverEmail: 'sanjeev.kumar@dixoninfo.com',
        status: 'Approved',
        comments: 'Bin allocations completed in ERP for GSK-LSR-02.',
        updatedAt: '2026-08-05 04:00 PM',
        signatureStamp: 'S. Kumar Stores OK'
      },
      {
        id: 'app-206',
        department: 'Finance & Accounts',
        approverName: 'Priya Patel',
        approverEmail: 'priya.patel@dixoninfo.com',
        status: 'Approved',
        comments: 'Cost increase of $0.90 per unit approved under Product Improvement Budget.',
        updatedAt: '2026-08-06 10:00 AM',
        signatureStamp: 'P. Patel Finance Sign'
      }
    ],
    status: 'Approved',
    createdAt: '2026-08-04 10:00 AM',
    submittedAt: '2026-08-04 11:00 AM',
    updatedAt: '2026-08-06 10:00 AM',
    uniqueLink: `${window.location.origin}/?ecnId=ECN-2026-08-002`
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-05 09:30:12 AM',
    userName: 'Ghanshyam Sahu',
    userEmail: 'ghanshyamsahu.padget@dixoninfo.com',
    role: 'Requester',
    department: 'Engineering & Design',
    action: 'ECN Creation',
    details: 'Created draft ECN-2026-08-001 with 3 inventory check line items and imported BOM sheet.',
    ecnId: 'ECN-2026-08-001',
    ipAddress: '10.24.180.45'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-05 10:15:00 AM',
    userName: 'Ghanshyam Sahu',
    userEmail: 'ghanshyamsahu.padget@dixoninfo.com',
    role: 'Requester',
    department: 'Engineering & Design',
    action: 'ECN Submission & Mail Dispatch',
    details: 'Submitted ECN-2026-08-001. Generated direct unique link and dispatched notification emails to 6 department approvers.',
    ecnId: 'ECN-2026-08-001',
    ipAddress: '10.24.180.45'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-06 02:30:44 PM',
    userName: 'Rajesh Sharma',
    userEmail: 'rajesh.sharma@dixoninfo.com',
    role: 'Department Approver',
    department: 'Quality Assurance',
    action: 'Department Approval Sign-off',
    details: 'Approved Quality Assurance review stage for ECN-2026-08-001. Signature stamp applied.',
    ecnId: 'ECN-2026-08-001',
    ipAddress: '10.24.180.88'
  }
];

export const INITIAL_EMAILS: NotificationEmail[] = [
  {
    id: 'mail-1',
    ecnId: 'ECN-2026-08-001',
    ecnTitle: 'PCB Mainboard Voltage Regulator Component Upgrade',
    fromEmail: 'ghanshyamsahu.padget@dixoninfo.com',
    fromName: 'Ghanshyam Sahu (Requester - Eng)',
    toEmail: 'rajesh.sharma@dixoninfo.com',
    toDepartment: 'Quality Assurance',
    subject: '[ECN ACTION REQUIRED] New Engineering Change Notice ECN-2026-08-001',
    body: 'Dear Rajesh Sharma,\n\nA new Engineering Change Notice (ECN-2026-08-001) has been created and requires your review and approval for Quality Assurance.\n\nSummary:\n- Title: PCB Mainboard Voltage Regulator Component Upgrade\n- Product Model: Smart LED TV 55-Inch (Model ST-55X)\n- Date of Stock Check: 2026-08-01\n- Future Implementation Date: 2026-08-25\n\nPlease click the secure direct access link below to open the paperless ECN, review Inventory_Check-1, 2, & 3 items, and provide your sign-off.\n\nDirect Link: ',
    uniqueLink: `${window.location.origin}/?ecnId=ECN-2026-08-001`,
    sentAt: '2026-08-05 10:15:00 AM',
    status: 'Delivered'
  },
  {
    id: 'mail-2',
    ecnId: 'ECN-2026-08-001',
    ecnTitle: 'PCB Mainboard Voltage Regulator Component Upgrade',
    fromEmail: 'ghanshyamsahu.padget@dixoninfo.com',
    fromName: 'Ghanshyam Sahu (Requester - Eng)',
    toEmail: 'anita.verma@dixoninfo.com',
    toDepartment: 'Production & Assembly',
    subject: '[ECN ACTION REQUIRED] New Engineering Change Notice ECN-2026-08-001',
    body: 'Dear Anita Verma,\n\nA new Engineering Change Notice (ECN-2026-08-001) has been created and requires your review and approval for Production & Assembly.\n\nSummary:\n- Title: PCB Mainboard Voltage Regulator Component Upgrade\n- Product Model: Smart LED TV 55-Inch (Model ST-55X)\n- Date of Stock Check: 2026-08-01\n- Future Implementation Date: 2026-08-25\n\nPlease click the secure direct access link below to open the paperless ECN, review Inventory_Check-1, 2, & 3 items, and provide your sign-off.\n\nDirect Link: ',
    uniqueLink: `${window.location.origin}/?ecnId=ECN-2026-08-001`,
    sentAt: '2026-08-05 10:15:00 AM',
    status: 'Delivered'
  }
];
