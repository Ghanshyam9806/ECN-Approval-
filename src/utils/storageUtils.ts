import { EcnRecord, AuditLog, NotificationEmail, UserProfile } from '../types';
import { INITIAL_ECN_RECORDS, INITIAL_AUDIT_LOGS, INITIAL_EMAILS, SYSTEM_USERS } from '../data/initialData';

const STORAGE_KEYS = {
  ECNS: 'paperless_ecn_records_v1',
  LOGS: 'paperless_ecn_audit_logs_v1',
  EMAILS: 'paperless_ecn_email_outbox_v1',
  ACTIVE_USER: 'paperless_ecn_active_user_v1',
  USERS: 'paperless_ecn_users_v1'
};

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SYSTEM_USERS));
      return SYSTEM_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return SYSTEM_USERS;
  }
}

export function saveUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save user roster', e);
  }
}

export function getStoredEcns(): EcnRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ECNS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ECNS, JSON.stringify(INITIAL_ECN_RECORDS));
      return INITIAL_ECN_RECORDS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ECN_RECORDS;
  }
}

export function saveEcns(ecns: EcnRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ECNS, JSON.stringify(ecns));
  } catch (e) {
    console.error('Failed to save ECNs to storage', e);
  }
}

export function getStoredLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditLog(
  user: UserProfile,
  action: string,
  details: string,
  ecnId?: string
): AuditLog {
  const logs = getStoredLogs();
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    userName: user.name,
    userEmail: user.email,
    role: user.role,
    department: user.department,
    action,
    details,
    ecnId,
    ipAddress: '10.24.180.45'
  };

  const updated = [newLog, ...logs];
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save audit log', e);
  }
  return newLog;
}

export function getStoredEmails(): NotificationEmail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(INITIAL_EMAILS));
      return INITIAL_EMAILS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EMAILS;
  }
}

export function saveEmailNotification(email: NotificationEmail): void {
  const emails = getStoredEmails();
  const updated = [email, ...emails];
  try {
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save email notification', e);
  }
}

export function getStoredActiveUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return SYSTEM_USERS[0]; // Default Ghanshyam Sahu (Requester)
}

export function saveActiveUser(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save active user', e);
  }
}
