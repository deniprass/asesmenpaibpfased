import {
  LicenseRecord,
  DemoSettings,
  SystemStats,
  UserAccount,
  LicensePackageType,
  AuditLog
} from '../types';
import { getOwnerToken, setUserSession } from './authService';

// List of Owner Master Secret Codes and Seed Licenses for offline / published fallback
const OWNER_SECRET_CODES = [
  'PAIBP-SUPERADMIN-2026',
  'PAIBP2026-OWNER-MASTER',
  'PAIBP-MASTER-SECRET-2026',
  'PAI2026-MASTER-AKTIVASI',
  'PAI2026-PRO-LIFETIME-001',
  'PAI2026-GURU-INDV-7788',
  'PAI2026-SEKOLAH-SMP-9911',
  'PAI2026-TRIAL-30D-5522'
];

function isLocalMasterCode(code: string): boolean {
  return OWNER_SECRET_CODES.includes(code.trim().toUpperCase());
}

/**
 * Validasi kode lisensi di server tanpa mengaktifkannya
 */
export async function validateLicenseCode(code: string): Promise<{
  valid: boolean;
  message?: string;
  isMasterSecret?: boolean;
  license?: {
    id: string;
    code: string;
    packageName: string;
    packageType: LicensePackageType;
    durationDays: number;
    maxActivations: number;
    currentActivations: number;
    expiresAt: string | null;
  };
}> {
  const cleanCode = code.trim().toUpperCase();

  try {
    const res = await fetch('/api/license/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: cleanCode })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error: any) {
    console.warn('API validation unreachable, checking local fallback:', error);
  }

  // Fallback for Master Secret Codes from Owner in case of network issue / static publish
  if (isLocalMasterCode(cleanCode)) {
    return {
      valid: true,
      isMasterSecret: true,
      license: {
        id: 'lic-owner-master-vip',
        code: cleanCode,
        packageName: cleanCode.includes('GURU')
          ? 'Lisensi Guru Individual (1 Tahun)'
          : cleanCode.includes('SEKOLAH')
          ? 'Lisensi Sekolah / Lembaga SMP (5 Guru)'
          : 'Lisensi VIP Master Akses Penuh (Kode Rahasia Owner)',
        packageType: 'custom',
        durationDays: 0,
        maxActivations: 999999,
        currentActivations: 0,
        expiresAt: null
      }
    };
  }

  return { valid: false, message: 'Kode lisensi tidak ditemukan. Pastikan Anda memasukkan kode lisensi resmi atau kode rahasia dari Owner.' };
}

/**
 * Aktivasi kode lisensi untuk guru
 */
export async function activateLicense(payload: {
  code: string;
  name: string;
  email: string;
  schoolName: string;
}): Promise<{
  success: boolean;
  message?: string;
  user?: UserAccount;
}> {
  const cleanCode = payload.code.trim().toUpperCase();

  try {
    const res = await fetch('/api/license/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleanCode,
        name: payload.name.trim(),
        email: payload.email.trim(),
        schoolName: payload.schoolName.trim()
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        setUserSession(data.user);
      }
      return data;
    }
  } catch (error: any) {
    console.warn('API activation unreachable, checking local fallback:', error);
  }

  // Fallback for Master Secret Codes if server is offline or static publish
  if (isLocalMasterCode(cleanCode)) {
    const isOwnerEmail = payload.email.trim().toLowerCase() === 'denyprass37@gmail.com';
    const userId = `usr_vip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const userAccount: UserAccount = {
      uid: userId,
      email: payload.email.trim() || (isOwnerEmail ? 'denyprass37@gmail.com' : `guru_${Math.random().toString(36).substring(2, 6)}@sekolah.id`),
      displayName: payload.name.trim(),
      role: isOwnerEmail ? 'owner' : 'licensed',
      status: 'active',
      schoolName: payload.schoolName.trim() || 'SMP / MTs',
      licenseId: 'lic-owner-master-vip',
      licenseCode: cleanCode,
      packageName: 'Lisensi VIP Master Akses Penuh (Kode Rahasia Owner)',
      packageType: 'custom',
      expiresAt: null,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      workspaceId: `workspace_${userId}`
    };

    setUserSession(userAccount);
    return {
      success: true,
      message: `Selamat datang, ${payload.name}! Seluruh fitur lengkap PAIBP berhasil diaktifkan dengan Kode Rahasia Owner.`,
      user: userAccount
    };
  }

  return { success: false, message: 'Gagal melakukan aktivasi lisensi. Pastikan kode benar atau hubungi Owner.' };
}

/**
 * Ambil daftar lisensi (Owner Only)
 */
export async function fetchLicenses(filter?: { search?: string; status?: string; packageType?: string }): Promise<{
  success: boolean;
  licenses: LicenseRecord[];
  message?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (filter?.search) params.append('search', filter.search);
    if (filter?.status && filter.status !== 'all') params.append('status', filter.status);
    if (filter?.packageType && filter.packageType !== 'all') params.append('packageType', filter.packageType);

    const res = await fetch(`/api/license/list?${params.toString()}`, {
      headers: { 'x-owner-token': getOwnerToken() }
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, licenses: [], message: error.message };
  }
}

/**
 * Buat satu kode lisensi baru (Owner Only)
 */
export async function createLicense(payload: {
  code?: string;
  packageName: string;
  packageType: LicensePackageType;
  durationDays: number;
  maxActivations: number;
  internalNote?: string;
}): Promise<{ success: boolean; license?: LicenseRecord; message?: string }> {
  try {
    const res = await fetch('/api/license/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': getOwnerToken()
      },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * Buat banyak kode lisensi sekaligus (Bulk Create - Owner Only)
 */
export async function bulkCreateLicenses(payload: {
  count: number;
  packageName: string;
  packageType: LicensePackageType;
  durationDays: number;
  maxActivations: number;
  prefix?: string;
  internalNote?: string;
}): Promise<{ success: boolean; count?: number; licenses?: LicenseRecord[]; message?: string }> {
  try {
    const res = await fetch('/api/license/bulk-create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': getOwnerToken()
      },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * Update status lisensi (Owner Only)
 */
export async function updateLicense(
  id: string,
  updates: Partial<LicenseRecord>
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/license/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': getOwnerToken()
      },
      body: JSON.stringify(updates)
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * Cabut atau Hapus lisensi (Owner Only)
 */
export async function revokeLicense(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/license/${id}/revoke`, {
      method: 'POST',
      headers: { 'x-owner-token': getOwnerToken() }
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * Ambil Pengaturan Mode Demo
 */
export async function fetchDemoSettings(): Promise<DemoSettings> {
  const fallbackSettings: DemoSettings = {
    demoEnabled: true,
    allowedFeatures: [
      'generator_pg_preview',
      'generator_essay_preview',
      'curriculum_cp_tp_preview',
      'bloom_solo_preview',
      'cbt_simulation_preview'
    ],
    maxQuestionsPerGeneration: 5,
    maxGenerationsPerSession: 2,
    dailyLimit: 10,
    exportEnabled: false,
    persistenceEnabled: false,
    demoMessage: 'Selamat datang di PAIBP FASE D SMART LEARNING PRO 2026. Anda sedang mencoba Mode Demo dengan fitur terbatas (Maks 5 soal, 2x generasi). Aktifkan Lisensi Guru untuk menikmati akses penuh tanpa batas.',
    activateButtonText: 'Aktifkan Lisensi Penuh Sekarang'
  };

  try {
    const res = await fetch('/api/demo/settings');
    const data = await res.json();
    if (data.success && data.settings) {
      return data.settings;
    }
  } catch (e) {
    console.warn('Failed to fetch demo settings, using defaults:', e);
  }
  return fallbackSettings;
}

/**
 * Simpan Pengaturan Mode Demo (Owner Only)
 */
export async function updateDemoSettings(settings: Partial<DemoSettings>): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/demo/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': getOwnerToken()
      },
      body: JSON.stringify(settings)
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * Ambil statistik sistem (Owner Only)
 */
export async function fetchSystemStats(): Promise<{ success: boolean; stats: SystemStats }> {
  const fallbackStats: SystemStats = {
    totalUsers: 0,
    activeLicenses: 0,
    expiredLicenses: 0,
    revokedLicenses: 0,
    demoUsersCount: 0,
    totalGenerations: 0,
    activeToday: 0
  };

  try {
    const res = await fetch('/api/stats/summary', {
      headers: { 'x-owner-token': getOwnerToken() }
    });
    const data = await res.json();
    if (data.success && data.stats) {
      return { success: true, stats: data.stats };
    }
  } catch (e) {
    console.warn('Failed to fetch stats, using fallback:', e);
  }
  return { success: true, stats: fallbackStats };
}

/**
 * Ambil daftar pengguna terdaftar (Owner Only)
 */
export async function fetchUsersList(search?: string): Promise<{ success: boolean; users: UserAccount[] }> {
  try {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`/api/users/list${params}`, {
      headers: { 'x-owner-token': getOwnerToken() }
    });
    const data = await res.json();
    return { success: data.success, users: data.users || [] };
  } catch (e) {
    return { success: false, users: [] };
  }
}

/**
 * Update status user (Owner Only)
 */
export async function updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/users/${userId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-owner-token': getOwnerToken()
      },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

/**
 * Ambil log audit (Owner Only)
 */
export async function fetchAuditLogs(): Promise<{ success: boolean; logs: AuditLog[] }> {
  try {
    const res = await fetch('/api/audit-logs', {
      headers: { 'x-owner-token': getOwnerToken() }
    });
    const data = await res.json();
    return { success: data.success, logs: data.logs || [] };
  } catch (e) {
    return { success: false, logs: [] };
  }
}
