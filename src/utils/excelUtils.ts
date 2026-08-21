import * as XLSX from 'xlsx';
import { EcnRecord, AuditLog, EcnLineItem, InventoryCheckItem } from '../types';

/**
 * Export ECN Master List and detailed breakdowns to Excel (.xlsx)
 */
export function exportEcnsToExcel(ecns: EcnRecord[], fileName: string = 'Paperless_ECN_Report.xlsx') {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Master Summary
  const masterData = ecns.map(ecn => ({
    'ECN ID': ecn.id,
    'Title': ecn.title,
    'Product Model': ecn.productModel,
    'Change Type': ecn.changeType,
    'Change Reason': ecn.changeReason,
    'Status': ecn.status,
    'Requester Name': ecn.requesterName,
    'Requester Email': ecn.requesterEmail,
    'Date of Stock Check': ecn.dateOfStockCheck,
    'Future Cut-off Date': ecn.futureDate,
    'Created At': ecn.createdAt,
    'Submitted At': ecn.submittedAt || 'N/A',
    'Unique ECN Link': ecn.uniqueLink
  }));
  const wsMaster = XLSX.utils.json_to_sheet(masterData);
  XLSX.utils.book_append_sheet(wb, wsMaster, 'ECN Summary Master');

  // Sheet 2: Inventory Checks (Inventory_Check-1, 2, 3)
  const inventoryRows: any[] = [];
  ecns.forEach(ecn => {
    const checks: InventoryCheckItem[] = [ecn.inventoryCheck1, ecn.inventoryCheck2, ecn.inventoryCheck3];
    checks.forEach(check => {
      inventoryRows.push({
        'ECN ID': ecn.id,
        'ECN Title': ecn.title,
        'Check Reference': check.checkType,
        'Stock Domain': check.label,
        'Physical Location': check.location,
        'Qty On Hand': check.qtyOnHand,
        'Qty Affected': check.qtyAffected,
        'Unit Cost ($)': check.unitCost,
        'Action Required': check.actionRequired,
        'Stock Check Date': ecn.dateOfStockCheck,
        'Future Cutoff Date': ecn.futureDate,
        'Remarks': check.remarks
      });
    });
  });
  const wsInventory = XLSX.utils.json_to_sheet(inventoryRows);
  XLSX.utils.book_append_sheet(wb, wsInventory, 'Inventory Checks');

  // Sheet 3: Line Items Detail
  const lineItemRows: any[] = [];
  ecns.forEach(ecn => {
    ecn.lineItems.forEach(item => {
      lineItemRows.push({
        'ECN ID': ecn.id,
        'Item Code': item.itemCode,
        'Description': item.description,
        'Present Rev': item.presentRev,
        'Proposed Rev': item.proposedRev,
        'Qty Affected': item.qtyAffected,
        'Disposition': item.disposition,
        'Unit Cost ($)': item.unitCost,
        'Total Cost Impact ($)': item.totalCostImpact
      });
    });
  });
  const wsLineItems = XLSX.utils.json_to_sheet(lineItemRows);
  XLSX.utils.book_append_sheet(wb, wsLineItems, 'Change Line Items');

  // Sheet 4: Department Approvals Matrix
  const approvalRows: any[] = [];
  ecns.forEach(ecn => {
    ecn.approvals.forEach(app => {
      approvalRows.push({
        'ECN ID': ecn.id,
        'Department': app.department,
        'Approver Name': app.approverName,
        'Approver Email': app.approverEmail,
        'Approval Status': app.status,
        'Signature Stamp': app.signatureStamp || 'Pending',
        'Updated At': app.updatedAt || 'N/A',
        'Comments': app.comments || ''
      });
    });
  });
  const wsApprovals = XLSX.utils.json_to_sheet(approvalRows);
  XLSX.utils.book_append_sheet(wb, wsApprovals, 'Department Approvals');

  // Write and trigger download
  XLSX.writeFile(wb, fileName);
}

/**
 * Export Audit Logs to Excel (.xlsx)
 */
export function exportAuditLogsToExcel(logs: AuditLog[], fileName: string = 'ECN_System_Audit_Trail.xlsx') {
  const wb = XLSX.utils.book_new();
  const logRows = logs.map(log => ({
    'Log ID': log.id,
    'Timestamp': log.timestamp,
    'User Name': log.userName,
    'User Email': log.userEmail,
    'Role': log.role,
    'Department': log.department,
    'Action Type': log.action,
    'Action Details': log.details,
    'ECN ID Ref': log.ecnId || 'N/A',
    'IP Address': log.ipAddress
  }));

  const ws = XLSX.utils.json_to_sheet(logRows);
  XLSX.utils.book_append_sheet(wb, ws, 'Audit Trail');
  XLSX.writeFile(wb, fileName);
}

/**
 * Generate & download sample Excel template for creating ECNs
 */
export function downloadSampleEcnTemplate() {
  const wb = XLSX.utils.book_new();

  // Template Sheet 1: ECN Header & Inventory Check Info
  const headerTemplate = [{
    'Title': 'SMT Microcontroller Component Pin-Compatibility Upgrade',
    'ProductModel': 'Industrial IoT Controller Panel V4',
    'ChangeType': 'Engineering Change',
    'ChangeReason': 'Component Obsolescence',
    'Description': 'Upgrading MCU from STM32F407VGT6 to STM32F407VET6 due to global supply chain shortage.',
    'BeforeChange': 'Standard STM32F407VGT6 1MB Flash LQFP100.',
    'AfterChange': 'Pin-compatible STM32F407VET6 512KB Flash LQFP100 with firmware optimization.',
    'DateOfStockCheck': '2026-08-10',
    'FutureCutoffDate': '2026-09-15',
    'Check1_RawMaterial_Location': 'Central Store Bin R-05',
    'Check1_RawMaterial_QtyOnHand': 1200,
    'Check1_RawMaterial_QtyAffected': 400,
    'Check1_RawMaterial_UnitCost': 12.50,
    'Check1_RawMaterial_Action': 'Return to Vendor',
    'Check1_RawMaterial_Remarks': 'Supplier agreed to swap under warranty credit',
    'Check2_WIP_Location': 'Line 2 SMT Station B',
    'Check2_WIP_QtyOnHand': 250,
    'Check2_WIP_QtyAffected': 250,
    'Check2_WIP_UnitCost': 12.50,
    'Check2_WIP_Action': 'Rework',
    'Check2_WIP_Remarks': 'Desolder MCU and reflow new revision',
    'Check3_FG_Location': 'Warehouse Bay 4',
    'Check3_FG_QtyOnHand': 180,
    'Check3_FG_QtyAffected': 180,
    'Check3_FG_UnitCost': 160.00,
    'Check3_FG_Action': 'Use As-Is',
    'Check3_FG_Remarks': 'Existing batch fully passed flash check'
  }];
  const wsHeader = XLSX.utils.json_to_sheet(headerTemplate);
  XLSX.utils.book_append_sheet(wb, wsHeader, 'ECN Header & Inventory');

  // Template Sheet 2: Line Items
  const lineItemsTemplate = [
    {
      'ItemCode': 'MCU-STM32F4-100',
      'Description': 'Microcontroller LQFP100 1MB Flash',
      'PresentRev': 'Rev A',
      'ProposedRev': 'Rev B',
      'QtyAffected': 400,
      'Disposition': 'Return to Vendor',
      'UnitCost': 12.50
    },
    {
      'ItemCode': 'XTAL-8MHZ-SMD',
      'Description': '8MHz Crystal Oscillator 3225 SMD',
      'PresentRev': 'Rev 1.0',
      'ProposedRev': 'Rev 1.1',
      'QtyAffected': 400,
      'Disposition': 'Use As-Is',
      'UnitCost': 0.45
    }
  ];
  const wsLineItems = XLSX.utils.json_to_sheet(lineItemsTemplate);
  XLSX.utils.book_append_sheet(wb, wsLineItems, 'Line Items');

  XLSX.writeFile(wb, 'Sample_ECN_Upload_Template.xlsx');
}

/**
 * Parse an uploaded Excel file (.xlsx, .csv) into structured ECN Form data
 */
export async function parseEcnExcelFile(file: File): Promise<{
  header?: Partial<EcnRecord>;
  lineItems: EcnLineItem[];
  inventory1?: Partial<InventoryCheckItem>;
  inventory2?: Partial<InventoryCheckItem>;
  inventory3?: Partial<InventoryCheckItem>;
  dateOfStockCheck?: string;
  futureDate?: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        let parsedHeader: Partial<EcnRecord> = {};
        let parsedLineItems: EcnLineItem[] = [];
        let inv1: Partial<InventoryCheckItem> = {};
        let inv2: Partial<InventoryCheckItem> = {};
        let inv3: Partial<InventoryCheckItem> = {};
        let stockDate = '';
        let cutOffDate = '';

        // Read Sheet 1 or First Sheet
        const firstSheetName = workbook.SheetNames[0];
        const sheet1 = workbook.Sheets[firstSheetName];
        const rows1: any[] = XLSX.utils.sheet_to_json(sheet1);

        if (rows1 && rows1.length > 0) {
          const row = rows1[0];
          parsedHeader.title = row['Title'] || row['title'] || row['ECN Title'] || 'Imported Excel ECN Notice';
          parsedHeader.productModel = row['ProductModel'] || row['productModel'] || row['Product Model'] || 'General Assembly Line';
          parsedHeader.changeType = (row['ChangeType'] || row['Change Type'] || 'Design Change') as any;
          parsedHeader.changeReason = (row['ChangeReason'] || row['Change Reason'] || 'Quality Issue') as any;
          parsedHeader.description = row['Description'] || row['description'] || 'ECN imported from Excel file.';
          parsedHeader.beforeChange = row['BeforeChange'] || row['Before Change'] || 'Previous configuration';
          parsedHeader.afterChange = row['AfterChange'] || row['After Change'] || 'New proposed configuration';

          stockDate = row['DateOfStockCheck'] || row['Date of Stock Check'] || new Date().toISOString().split('T')[0];
          cutOffDate = row['FutureCutoffDate'] || row['Future Cutoff Date'] || row['Future Date'] || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

          inv1 = {
            checkType: 'Inventory_Check-1',
            label: 'Raw Material & Component Stock (Stores)',
            location: row['Check1_RawMaterial_Location'] || row['Check 1 Location'] || 'Central Stores Bin 1',
            qtyOnHand: Number(row['Check1_RawMaterial_QtyOnHand'] || row['Check 1 Qty On Hand'] || 1000),
            qtyAffected: Number(row['Check1_RawMaterial_QtyAffected'] || row['Check 1 Qty Affected'] || 200),
            unitCost: Number(row['Check1_RawMaterial_UnitCost'] || row['Check 1 Unit Cost'] || 5.00),
            actionRequired: (row['Check1_RawMaterial_Action'] || 'Purge & Replace') as any,
            remarks: row['Check1_RawMaterial_Remarks'] || 'Imported via Excel'
          };

          inv2 = {
            checkType: 'Inventory_Check-2',
            label: 'Work In Progress (WIP) Line Stock (Assembly)',
            location: row['Check2_WIP_Location'] || row['Check 2 Location'] || 'SMT Assembly Line 1',
            qtyOnHand: Number(row['Check2_WIP_QtyOnHand'] || row['Check 2 Qty On Hand'] || 150),
            qtyAffected: Number(row['Check2_WIP_QtyAffected'] || row['Check 2 Qty Affected'] || 150),
            unitCost: Number(row['Check2_WIP_UnitCost'] || row['Check 2 Unit Cost'] || 5.00),
            actionRequired: (row['Check2_WIP_Action'] || 'Rework') as any,
            remarks: row['Check2_WIP_Remarks'] || 'Imported via Excel'
          };

          inv3 = {
            checkType: 'Inventory_Check-3',
            label: 'Finished Goods (FG) Warehouse Stock',
            location: row['Check3_FG_Location'] || row['Check 3 Location'] || 'FG Bay 01',
            qtyOnHand: Number(row['Check3_FG_QtyOnHand'] || row['Check 3 Qty On Hand'] || 300),
            qtyAffected: Number(row['Check3_FG_QtyAffected'] || row['Check 3 Qty Affected'] || 300),
            unitCost: Number(row['Check3_FG_UnitCost'] || row['Check 3 Unit Cost'] || 120.00),
            actionRequired: (row['Check3_FG_Action'] || 'Use As-Is') as any,
            remarks: row['Check3_FG_Remarks'] || 'Imported via Excel'
          };
        }

        // Read Sheet 2 if exists or parse rows from sheet 1
        const lineItemSheetName = workbook.SheetNames.find(name => name.toLowerCase().includes('line') || name.toLowerCase().includes('item')) || workbook.SheetNames[1];
        if (lineItemSheetName && workbook.Sheets[lineItemSheetName]) {
          const itemRows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[lineItemSheetName]);
          parsedLineItems = itemRows.map((r, index) => ({
            id: `excel-item-${index + 1}`,
            itemCode: r['ItemCode'] || r['Item Code'] || r['Part Number'] || `PART-${index + 101}`,
            description: r['Description'] || r['Item Description'] || 'Component Description',
            presentRev: r['PresentRev'] || r['Present Rev'] || r['Old Rev'] || 'A0',
            proposedRev: r['ProposedRev'] || r['Proposed Rev'] || r['New Rev'] || 'B0',
            qtyAffected: Number(r['QtyAffected'] || r['Qty Affected'] || r['Quantity'] || 100),
            disposition: (r['Disposition'] || r['Action'] || 'Scrap') as any,
            unitCost: Number(r['UnitCost'] || r['Unit Cost'] || 1.50),
            totalCostImpact: Number(r['QtyAffected'] || 100) * Number(r['UnitCost'] || 1.50)
          }));
        } else if (rows1 && rows1.length > 1) {
          // If all items are in sheet 1
          parsedLineItems = rows1.map((r, index) => ({
            id: `excel-item-${index + 1}`,
            itemCode: r['ItemCode'] || r['Part Number'] || `PART-${index + 101}`,
            description: r['Description'] || r['Title'] || 'Component Item',
            presentRev: r['PresentRev'] || 'Rev A',
            proposedRev: r['ProposedRev'] || 'Rev B',
            qtyAffected: Number(r['QtyAffected'] || 50),
            disposition: 'Rework',
            unitCost: Number(r['UnitCost'] || 2.00),
            totalCostImpact: Number(r['QtyAffected'] || 50) * Number(r['UnitCost'] || 2.00)
          }));
        }

        resolve({
          header: parsedHeader,
          lineItems: parsedLineItems,
          inventory1: inv1,
          inventory2: inv2,
          inventory3: inv3,
          dateOfStockCheck: stockDate,
          futureDate: cutOffDate
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
