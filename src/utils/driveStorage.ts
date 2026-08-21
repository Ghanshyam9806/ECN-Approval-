import { EcnRecord, AuditLog, NotificationEmail } from '../types';

export interface DriveSyncStatus {
  isConnected: boolean;
  lastSyncedAt: string | null;
  fileId: string | null;
  fileName: string;
  isSyncing: boolean;
  error?: string;
}

export interface FullDatabaseBackup {
  app: string;
  version: string;
  exportedAt: string;
  ecns: EcnRecord[];
  auditLogs: AuditLog[];
  emails: NotificationEmail[];
}

const DRIVE_FILE_NAME = 'ECN_System_Database_Master.json';

// Local storage key for drive connection config
const DRIVE_STORAGE_KEY = 'paperless_ecn_drive_sync_config_v1';

export function getStoredDriveConfig(): { fileId: string | null; lastSyncedAt: string | null } {
  try {
    const raw = localStorage.getItem(DRIVE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load drive config', e);
  }
  return { fileId: 'drive-db-ecn-master-2026', lastSyncedAt: new Date().toLocaleTimeString() };
}

export function saveDriveConfig(fileId: string | null, lastSyncedAt: string | null): void {
  try {
    localStorage.setItem(DRIVE_STORAGE_KEY, JSON.stringify({ fileId, lastSyncedAt }));
  } catch (e) {
    console.error('Failed to save drive config', e);
  }
}

/**
 * Downloads a complete JSON snapshot of all system ECN data for saving into Google Drive
 */
export function generateDriveDatabaseSnapshot(
  ecns: EcnRecord[],
  auditLogs: AuditLog[],
  emails: NotificationEmail[]
): FullDatabaseBackup {
  return {
    app: 'Padget / Dixon Electronics Paperless ECN Approval System',
    version: '2.6.0-Bento-DriveDB',
    exportedAt: new Date().toISOString(),
    ecns,
    auditLogs,
    emails
  };
}

/**
 * Trigger browser file save formatted for Google Drive
 */
export function downloadDriveDatabaseBackup(
  ecns: EcnRecord[],
  auditLogs: AuditLog[],
  emails: NotificationEmail[]
): void {
  const snapshot = generateDriveDatabaseSnapshot(ecns, auditLogs, emails);
  const jsonStr = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = DRIVE_FILE_NAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  saveDriveConfig('drive-doc-master-json', new Date().toLocaleTimeString());
}

/**
 * Read and validate imported Google Drive DB JSON
 */
export function parseDriveDatabaseBackup(jsonString: string): FullDatabaseBackup | null {
  try {
    const data = JSON.parse(jsonString);
    if (data && Array.isArray(data.ecns)) {
      return data as FullDatabaseBackup;
    }
  } catch (e) {
    console.error('Invalid Drive DB JSON file', e);
  }
  return null;
}
