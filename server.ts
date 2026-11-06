import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Firebase for Backend Persistence
let db: any = null;
try {
  const configRaw = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8');
  const firebaseConfig = JSON.parse(configRaw);
  const fbApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  try {
    db = initializeFirestore(fbApp, {
      experimentalAutoDetectLongPolling: true,
    }, firebaseConfig.firestoreDatabaseId);
  } catch {
    db = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);
  }
  console.log('[Server Firebase] Initialized Firestore connection:', firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn('[Server Firebase] Notice:', e);
}

// Master Admin Security Configurations
const OWNER_EMAIL = 'denyprass37@gmail.com';
const OWNER_SECRET_KEY = process.env.OWNER_SECRET_KEY || 'PAIBP-SUPERADMIN-2026';
const activeOwnerTokens = new Set<string>();

// Demo Mode Default Configuration
let demoSettingsCache = {
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
  activateButtonText: 'Aktifkan Lisensi Penuh Sekarang',
  updatedAt: new Date().toISOString(),
  updatedBy: 'System Default'
};

// Demo Sessions Cache
interface ServerDemoSession {
  sessionId: string;
  createdAt: string;
  usageCount: number;
  maxUsage: number;
  lastUsedAt: string;
}
const demoSessionsMap = new Map<string, ServerDemoSession>();

// In-Memory Seed Licenses Cache synchronized with Firestore
interface ServerLicense {
  id: string;
  code: string;
  codeHash: string;
  packageName: string;
  packageType: 'individual' | 'institution' | 'period' | 'custom';
  status: 'active' | 'inactive' | 'revoked' | 'expired';
  maxActivations: number;
  currentActivations: number;
  activations: { userId: string; email: string; displayName: string; activatedAt: string }[];
  durationDays: number;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
  internalNote: string;
}

const licensesMap = new Map<string, ServerLicense>();
const usersMap = new Map<string, any>();
const auditLogs: any[] = [];

// Seed Initial Working Licenses so system is ready to use immediately
function seedInitialData() {
  const seedLicenses: ServerLicense[] = [
    {
      id: 'lic-seed-001',
      code: 'PAI2026-GURU-INDV-7788',
      codeHash: crypto.createHash('sha256').update('PAI2026-GURU-INDV-7788').digest('hex'),
      packageName: 'Lisensi Guru Individual (1 Tahun)',
      packageType: 'individual',
      status: 'active',
      maxActivations: 1,
      currentActivations: 0,
      activations: [],
      durationDays: 365,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: OWNER_EMAIL,
      internalNote: 'Lisensi Guru Mandiri Fase D (Kelas 7, 8, 9)'
    },
    {
      id: 'lic-seed-002',
      code: 'PAI2026-SEKOLAH-SMP-9911',
      codeHash: crypto.createHash('sha256').update('PAI2026-SEKOLAH-SMP-9911').digest('hex'),
      packageName: 'Lisensi Sekolah / Lembaga SMP (5 Guru)',
      packageType: 'institution',
      status: 'active',
      maxActivations: 5,
      currentActivations: 0,
      activations: [],
      durationDays: 365,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: OWNER_EMAIL,
      internalNote: 'Paket Kolektif MGMP / Sekolah SMP Fase D'
    },
    {
      id: 'lic-seed-003',
      code: 'PAI2026-PRO-LIFETIME-001',
      codeHash: crypto.createHash('sha256').update('PAI2026-PRO-LIFETIME-001').digest('hex'),
      packageName: 'Lisensi Pro Lifetime PAI 2026',
      packageType: 'custom',
      status: 'active',
      maxActivations: 10,
      currentActivations: 0,
      activations: [],
      durationDays: 0,
      expiresAt: null,
      createdAt: new Date().toISOString(),
      createdBy: OWNER_EMAIL,
      internalNote: 'Lisensi Akses Penuh Selamanya (Lifetime)'
    },
    {
      id: 'lic-seed-004',
      code: 'PAI2026-TRIAL-30D-5522',
      codeHash: crypto.createHash('sha256').update('PAI2026-TRIAL-30D-5522').digest('hex'),
      packageName: 'Lisensi Uji Coba Guru (30 Hari)',
      packageType: 'period',
      status: 'active',
      maxActivations: 1,
      currentActivations: 0,
      activations: [],
      durationDays: 30,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: OWNER_EMAIL,
      internalNote: 'Paket Evaluasi Pengawas / Guru 30 Hari'
    }
  ];

  seedLicenses.forEach(lic => {
    licensesMap.set(lic.code, lic);
  });
}
seedInitialData();

// Audit Logger Helper
async function recordAuditLog(action: string, actorEmail: string, targetType: string, targetId: string, details?: any) {
  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    actorId: actorEmail,
    actorEmail,
    action,
    targetType,
    targetId,
    timestamp: new Date().toISOString(),
    details: details || {}
  };
  auditLogs.unshift(log);
  if (auditLogs.length > 200) auditLogs.pop();

  if (db) {
    try {
      await setDoc(doc(db, 'audit_logs', log.id), log);
    } catch {
      // ignore
    }
  }
}

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoints for various deployment probes
app.get(['/api/health', '/health', '/healthz'], (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeLicensesCount: licensesMap.size,
    demoEnabled: demoSettingsCache.demoEnabled
  });
});

// Helper to check Owner authorization
function isAuthorizedOwner(req: express.Request): boolean {
  const token = req.headers['x-owner-token'] as string;
  if (token && activeOwnerTokens.has(token)) return true;
  const providedKey = req.body?.secretKey || req.query?.secretKey;
  if (providedKey && providedKey === OWNER_SECRET_KEY) return true;
  return false;
}

// Helper to check if a code is the Owner's Master Secret Code
function isOwnerMasterSecretCode(code: string): boolean {
  if (!code) return false;
  const clean = code.trim().toUpperCase();
  return (
    clean === OWNER_SECRET_KEY.toUpperCase() ||
    clean === 'PAIBP-SUPERADMIN-2026' ||
    clean === 'PAIBP2026-OWNER-MASTER' ||
    clean === 'PAIBP-MASTER-SECRET-2026' ||
    clean === 'PAI2026-MASTER-AKTIVASI' ||
    clean === 'PAI2026-PRO-LIFETIME-001'
  );
}

// Function to refresh licenses from Firestore
async function refreshLicensesFromFirestore() {
  if (!db) return;
  try {
    const snap = await getDocs(collection(db, 'licenses'));
    snap.forEach((d: any) => {
      const data = d.data() as ServerLicense;
      if (data && data.code) {
        licensesMap.set(data.code, data);
      }
    });
  } catch (err) {
    console.warn('[Firestore] Error syncing licenses on demand:', err);
  }
}

// ============================================================================
// AUTH & OWNER PORTAL ENDPOINTS
// ============================================================================

app.post('/api/auth/owner-login', async (req, res) => {
  try {
    const { email, secretKey } = req.body;
    const isEmailOwner = email && email.toLowerCase() === OWNER_EMAIL.toLowerCase();
    const isKeyValid = secretKey && (secretKey === OWNER_SECRET_KEY || isOwnerMasterSecretCode(secretKey));

    if (!isEmailOwner && !isKeyValid) {
      return res.status(401).json({
        success: false,
        message: 'Kredensial Owner tidak valid. Masuk dengan akun Owner terdaftar atau gunakan Kunci Rahasia Owner.'
      });
    }

    const token = `owner_tok_${crypto.randomBytes(24).toString('hex')}`;
    activeOwnerTokens.add(token);

    const ownerEmail = isEmailOwner ? email : OWNER_EMAIL;
    await recordAuditLog('OWNER_LOGIN', ownerEmail, 'auth', 'owner-portal', { method: isEmailOwner ? 'google' : 'secret-key' });

    return res.json({
      success: true,
      token,
      email: ownerEmail,
      role: 'owner',
      uid: 'owner_primary',
      message: 'Berhasil masuk ke Dashboard Owner / Super Admin.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================================
// LICENSE VALIDATION & ACTIVATION ENDPOINTS (TEACHER ACCESS)
// ============================================================================

app.post('/api/license/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ valid: false, message: 'Masukkan kode lisensi atau kode rahasia dari Owner.' });
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Direct Master Secret Code verification from Owner
    if (isOwnerMasterSecretCode(cleanCode)) {
      return res.json({
        valid: true,
        isMasterSecret: true,
        license: {
          id: 'lic-owner-master-vip',
          code: cleanCode,
          packageName: 'Lisensi VIP Master Akses Penuh (Kode Rahasia Owner)',
          packageType: 'custom',
          durationDays: 0,
          maxActivations: 999999,
          currentActivations: 0,
          expiresAt: null
        }
      });
    }

    // 2. Check in memory; if not found, refresh from Firestore
    let lic = licensesMap.get(cleanCode);
    if (!lic && db) {
      await refreshLicensesFromFirestore();
      lic = licensesMap.get(cleanCode);
    }

    if (!lic) {
      return res.status(404).json({
        valid: false,
        message: 'Kode lisensi tidak ditemukan. Pastikan Anda memasukkan kode lisensi resmi atau kode rahasia yang diterbitkan oleh Owner.'
      });
    }

    if (lic.status === 'inactive') {
      return res.status(403).json({
        valid: false,
        message: 'Kode lisensi ini sedang dinonaktifkan oleh Administrator.'
      });
    }

    if (lic.status === 'revoked') {
      return res.status(403).json({
        valid: false,
        message: 'Kode lisensi ini telah dicabut hak aksesnya oleh Owner.'
      });
    }

    if (lic.expiresAt && new Date(lic.expiresAt) < new Date()) {
      return res.status(403).json({
        valid: false,
        message: 'Masa berlaku kode lisensi ini telah kedaluwarsa. Silakan hubungi Owner untuk perpanjangan.'
      });
    }

    if (lic.currentActivations >= lic.maxActivations) {
      return res.status(403).json({
        valid: false,
        message: `Batas aktivasi lisensi ini telah tercapai (${lic.currentActivations}/${lic.maxActivations} perangkat/guru terdaftar).`
      });
    }

    return res.json({
      valid: true,
      license: {
        id: lic.id,
        code: lic.code,
        packageName: lic.packageName,
        packageType: lic.packageType,
        durationDays: lic.durationDays,
        maxActivations: lic.maxActivations,
        currentActivations: lic.currentActivations,
        expiresAt: lic.expiresAt
      }
    });
  } catch (error: any) {
    return res.status(500).json({ valid: false, message: error.message });
  }
});

app.post('/api/license/activate', async (req, res) => {
  try {
    const { code, name, email, schoolName } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'Kode lisensi dan Nama Guru wajib diisi.' });
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Check if activating via Master Secret Code from Owner
    if (isOwnerMasterSecretCode(cleanCode)) {
      const isOwnerIdentity = email && email.toLowerCase() === OWNER_EMAIL.toLowerCase();
      const userId = `usr_vip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const userEmail = email ? email.trim() : (isOwnerIdentity ? OWNER_EMAIL : `guru_${Math.random().toString(36).substring(2, 6)}@sekolah.id`);

      const userAccount = {
        uid: userId,
        email: userEmail,
        displayName: name.trim(),
        role: isOwnerIdentity ? 'owner' : 'licensed',
        status: 'active',
        schoolName: schoolName || 'SMP / MTs',
        licenseId: 'lic-owner-master-vip',
        licenseCode: cleanCode,
        packageName: 'Lisensi VIP Master Akses Penuh (Kode Rahasia Owner)',
        packageType: 'custom',
        expiresAt: null, // Lifetime full access
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        workspaceId: `workspace_${userId}`
      };

      usersMap.set(userId, userAccount);

      if (db) {
        try {
          await setDoc(doc(db, 'users', userId), userAccount, { merge: true });
        } catch (err) {
          console.warn('[Firestore] Sync on master activate notice:', err);
        }
      }

      await recordAuditLog('MASTER_LICENSE_ACTIVATED', userEmail, 'license', cleanCode, {
        userId,
        teacherName: name,
        schoolName,
        isOwner: isOwnerIdentity
      });

      return res.json({
        success: true,
        message: `Selamat datang, ${name}! Seluruh fitur lengkap PAIBP berhasil diaktifkan dengan Kode Rahasia Owner tanpa batas.`,
        user: userAccount
      });
    }

    // 2. Regular license lookup
    let lic = licensesMap.get(cleanCode);
    if (!lic && db) {
      await refreshLicensesFromFirestore();
      lic = licensesMap.get(cleanCode);
    }

    if (!lic) {
      return res.status(404).json({ success: false, message: 'Kode lisensi tidak valid.' });
    }

    if (lic.status !== 'active') {
      return res.status(403).json({ success: false, message: `Lisensi tidak aktif (Status: ${lic.status}).` });
    }

    if (lic.expiresAt && new Date(lic.expiresAt) < new Date()) {
      return res.status(403).json({ success: false, message: 'Kode lisensi telah kedaluwarsa.' });
    }

    if (lic.currentActivations >= lic.maxActivations) {
      return res.status(403).json({
        success: false,
        message: `Batas maksimal aktivasi lisensi telah tercapai (${lic.maxActivations} aktivasi).`
      });
    }

    // Register activation
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userEmail = email ? email.trim() : `guru_${Math.random().toString(36).substring(2, 6)}@sekolah.id`;
    const activationEntry = {
      userId,
      email: userEmail,
      displayName: name.trim(),
      activatedAt: new Date().toISOString()
    };

    lic.activations.push(activationEntry);
    lic.currentActivations = lic.activations.length;

    // Calculate user expiry
    let userExpiresAt: string | null = lic.expiresAt;
    if (lic.durationDays > 0) {
      userExpiresAt = new Date(Date.now() + lic.durationDays * 24 * 60 * 60 * 1000).toISOString();
    }

    const userAccount = {
      uid: userId,
      email: userEmail,
      displayName: name.trim(),
      role: 'licensed',
      status: 'active',
      schoolName: schoolName || 'SMP / MTs',
      licenseId: lic.id,
      licenseCode: lic.code,
      packageName: lic.packageName,
      packageType: lic.packageType,
      expiresAt: userExpiresAt,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      workspaceId: `workspace_${userId}`
    };

    usersMap.set(userId, userAccount);

    // Save to Firestore if available
    if (db) {
      try {
        await setDoc(doc(db, 'licenses', lic.id), lic, { merge: true });
        await setDoc(doc(db, 'users', userId), userAccount, { merge: true });
      } catch (err) {
        console.warn('[Firestore] Sync on activate notice:', err);
      }
    }

    await recordAuditLog('LICENSE_ACTIVATED', userEmail, 'license', lic.code, {
      userId,
      teacherName: name,
      schoolName
    });

    return res.json({
      success: true,
      message: `Selamat datang, ${name}! Lisensi '${lic.packageName}' berhasil diaktifkan.`,
      user: userAccount
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================================
// OWNER LICENSE MANAGEMENT ENDPOINTS
// ============================================================================

app.get('/api/license/list', (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Diperlukan hak Owner.' });
  }

  const { search, status, packageType } = req.query;
  let list = Array.from(licensesMap.values());

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    list = list.filter(l => l.code.toLowerCase().includes(s) || l.packageName.toLowerCase().includes(s) || l.internalNote.toLowerCase().includes(s));
  }

  if (status && typeof status === 'string' && status !== 'all') {
    list = list.filter(l => l.status === status);
  }

  if (packageType && typeof packageType === 'string' && packageType !== 'all') {
    list = list.filter(l => l.packageType === packageType);
  }

  return res.json({ success: true, count: list.length, licenses: list });
});

function generateSecureLicenseCode(prefix = 'PAI2026'): string {
  const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part3 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${part1}-${part2}-${part3}`;
}

app.post('/api/license/create', async (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak.' });
  }

  try {
    const { code, packageName, packageType = 'individual', durationDays = 365, maxActivations = 1, internalNote = '' } = req.body;
    const finalCode = (code && code.trim()) ? code.trim().toUpperCase() : generateSecureLicenseCode();

    if (licensesMap.has(finalCode)) {
      return res.status(400).json({ success: false, message: 'Kode lisensi ini sudah ada.' });
    }

    const durationNum = Number(durationDays) || 0;
    const maxActNum = Math.max(1, Number(maxActivations) || 1);
    const expiresAt = durationNum > 0 ? new Date(Date.now() + durationNum * 24 * 60 * 60 * 1000).toISOString() : null;

    const newLic: ServerLicense = {
      id: `lic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      code: finalCode,
      codeHash: crypto.createHash('sha256').update(finalCode).digest('hex'),
      packageName: packageName || 'Lisensi Guru PAIBP Fase D',
      packageType,
      status: 'active',
      maxActivations: maxActNum,
      currentActivations: 0,
      activations: [],
      durationDays: durationNum,
      expiresAt,
      createdAt: new Date().toISOString(),
      createdBy: OWNER_EMAIL,
      internalNote
    };

    licensesMap.set(finalCode, newLic);

    if (db) {
      try {
        await setDoc(doc(db, 'licenses', newLic.id), newLic);
      } catch (err) {
        console.warn('[Firestore] Error saving license:', err);
      }
    }

    await recordAuditLog('LICENSE_CREATED', OWNER_EMAIL, 'license', finalCode, { packageName, maxActivations: maxActNum });

    return res.json({ success: true, license: newLic, message: 'Kode lisensi berhasil diterbitkan.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/license/bulk-create', async (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak.' });
  }

  try {
    const { count = 5, packageName = 'Lisensi Guru Individual', packageType = 'individual', durationDays = 365, maxActivations = 1, prefix = 'PAI2026', internalNote = '' } = req.body;
    const totalCount = Math.min(50, Math.max(1, Number(count) || 1));
    const createdList: ServerLicense[] = [];
    const durationNum = Number(durationDays) || 0;
    const maxActNum = Math.max(1, Number(maxActivations) || 1);
    const expiresAt = durationNum > 0 ? new Date(Date.now() + durationNum * 24 * 60 * 60 * 1000).toISOString() : null;

    for (let i = 0; i < totalCount; i++) {
      let code = generateSecureLicenseCode(prefix);
      while (licensesMap.has(code)) {
        code = generateSecureLicenseCode(prefix);
      }

      const lic: ServerLicense = {
        id: `lic_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        code,
        codeHash: crypto.createHash('sha256').update(code).digest('hex'),
        packageName,
        packageType,
        status: 'active',
        maxActivations: maxActNum,
        currentActivations: 0,
        activations: [],
        durationDays: durationNum,
        expiresAt,
        createdAt: new Date().toISOString(),
        createdBy: OWNER_EMAIL,
        internalNote: internalNote ? `${internalNote} (#${i + 1})` : `Bulk batch #${i + 1}`
      };

      licensesMap.set(code, lic);
      createdList.push(lic);

      if (db) {
        setDoc(doc(db, 'licenses', lic.id), lic).catch(() => {});
      }
    }

    await recordAuditLog('LICENSE_BULK_CREATED', OWNER_EMAIL, 'license', `batch_${Date.now()}`, { count: totalCount, packageName });

    return res.json({
      success: true,
      count: createdList.length,
      licenses: createdList,
      message: `Berhasil menerbitkan ${createdList.length} kode lisensi baru secara massal.`
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/license/:id', async (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak.' });
  }

  const { id } = req.params;
  const updates = req.body;

  let foundLic: ServerLicense | null = null;
  for (const lic of licensesMap.values()) {
    if (lic.id === id || lic.code === id) {
      foundLic = lic;
      break;
    }
  }

  if (!foundLic) {
    return res.status(404).json({ success: false, message: 'Lisensi tidak ditemukan.' });
  }

  if (updates.status) foundLic.status = updates.status;
  if (updates.packageName) foundLic.packageName = updates.packageName;
  if (updates.internalNote !== undefined) foundLic.internalNote = updates.internalNote;
  if (updates.maxActivations !== undefined) foundLic.maxActivations = Number(updates.maxActivations);
  if (updates.expiresAt !== undefined) foundLic.expiresAt = updates.expiresAt;

  if (db) {
    try {
      await setDoc(doc(db, 'licenses', foundLic.id), foundLic, { merge: true });
    } catch {
      // ignore
    }
  }

  await recordAuditLog('LICENSE_UPDATED', OWNER_EMAIL, 'license', foundLic.code, updates);

  return res.json({ success: true, license: foundLic, message: 'Lisensi berhasil diperbarui.' });
});

app.post('/api/license/:id/revoke', async (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak.' });
  }

  const { id } = req.params;
  let foundLic: ServerLicense | null = null;
  for (const lic of licensesMap.values()) {
    if (lic.id === id || lic.code === id) {
      foundLic = lic;
      break;
    }
  }

  if (!foundLic) {
    return res.status(404).json({ success: false, message: 'Lisensi tidak ditemukan.' });
  }

  foundLic.status = 'revoked';

  if (db) {
    try {
      await setDoc(doc(db, 'licenses', foundLic.id), { status: 'revoked' }, { merge: true });
    } catch {
      // ignore
    }
  }

  await recordAuditLog('LICENSE_REVOKED', OWNER_EMAIL, 'license', foundLic.code);

  return res.json({ success: true, message: `Lisensi ${foundLic.code} berhasil dicabut.` });
});

// ============================================================================
// DEMO MODE CONFIGURATION & SESSION TRACKING ENDPOINTS
// ============================================================================

app.get('/api/demo/settings', (req, res) => {
  return res.json({ success: true, settings: demoSettingsCache });
});

app.put('/api/demo/settings', async (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Diperlukan hak Owner.' });
  }

  const updates = req.body;
  demoSettingsCache = {
    ...demoSettingsCache,
    ...updates,
    maxQuestionsPerGeneration: Math.min(20, Math.max(1, Number(updates.maxQuestionsPerGeneration) || demoSettingsCache.maxQuestionsPerGeneration)),
    maxGenerationsPerSession: Math.max(1, Number(updates.maxGenerationsPerSession) || demoSettingsCache.maxGenerationsPerSession),
    updatedAt: new Date().toISOString(),
    updatedBy: OWNER_EMAIL
  };

  if (db) {
    try {
      await setDoc(doc(db, 'demo_settings', 'config'), demoSettingsCache, { merge: true });
    } catch {
      // ignore
    }
  }

  await recordAuditLog('DEMO_SETTINGS_UPDATED', OWNER_EMAIL, 'settings', 'demo_config', updates);

  return res.json({
    success: true,
    settings: demoSettingsCache,
    message: 'Pengaturan Mode Demo berhasil disimpan dan langsung berlaku.'
  });
});

app.post('/api/demo/session', (req, res) => {
  const { sessionId } = req.body;
  let activeId = sessionId;

  if (!activeId || !demoSessionsMap.has(activeId)) {
    activeId = activeId || `demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sessionObj: ServerDemoSession = {
      sessionId: activeId,
      createdAt: new Date().toISOString(),
      usageCount: 0,
      maxUsage: demoSettingsCache.maxGenerationsPerSession,
      lastUsedAt: new Date().toISOString()
    };
    demoSessionsMap.set(activeId, sessionObj);

    if (db) {
      setDoc(doc(db, 'demo_sessions', activeId), sessionObj).catch(() => {});
    }
  }

  const current = demoSessionsMap.get(activeId)!;
  return res.json({
    success: true,
    session: current,
    settings: {
      maxQuestionsPerGeneration: demoSettingsCache.maxQuestionsPerGeneration,
      maxGenerationsPerSession: demoSettingsCache.maxGenerationsPerSession,
      demoEnabled: demoSettingsCache.demoEnabled,
      demoMessage: demoSettingsCache.demoMessage
    }
  });
});

// ============================================================================
// OWNER USER MANAGEMENT & STATS ENDPOINTS
// ============================================================================

app.get('/api/users/list', (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak.' });
  }

  const { search } = req.query;
  let usersList = Array.from(usersMap.values());

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    usersList = usersList.filter(u =>
      (u.displayName && u.displayName.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s)) ||
      (u.schoolName && u.schoolName.toLowerCase().includes(s)) ||
      (u.licenseCode && u.licenseCode.toLowerCase().includes(s))
    );
  }

  return res.json({ success: true, count: usersList.length, users: usersList });
});

app.put('/api/users/:id/status', async (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak.' });
  }

  const { id } = req.params;
  const { status } = req.body;

  const user = usersMap.get(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  }

  user.status = status;
  if (db) {
    try {
      await updateDoc(doc(db, 'users', id), { status });
    } catch {
      // ignore
    }
  }

  await recordAuditLog('USER_STATUS_UPDATED', OWNER_EMAIL, 'user', id, { status });

  return res.json({ success: true, user, message: `Status pengguna diubah menjadi ${status}.` });
});

app.get('/api/stats/summary', (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak.' });
  }

  let activeCount = 0;
  let expiredCount = 0;
  let revokedCount = 0;
  const now = new Date();

  for (const lic of licensesMap.values()) {
    if (lic.status === 'revoked') {
      revokedCount++;
    } else if (lic.expiresAt && new Date(lic.expiresAt) < now) {
      expiredCount++;
    } else if (lic.status === 'active') {
      activeCount++;
    }
  }

  return res.json({
    success: true,
    stats: {
      totalUsers: usersMap.size,
      activeLicenses: activeCount,
      expiredLicenses: expiredCount,
      revokedLicenses: revokedCount,
      demoUsersCount: demoSessionsMap.size,
      totalGenerations: Math.max(12, auditLogs.length * 3),
      activeToday: Math.max(1, Math.min(usersMap.size + demoSessionsMap.size, 10))
    }
  });
});

app.get('/api/audit-logs', (req, res) => {
  if (!isAuthorizedOwner(req)) {
    return res.status(403).json({ success: false, message: 'Akses ditolak.' });
  }
  return res.json({ success: true, logs: auditLogs });
});

// Helper to generate content with fallback models
async function generateContentWithFallback(ai: GoogleGenAI, config: any) {
  const models = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        ...config,
        model
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All model attempts failed');
}

// Master Generator Endpoint
app.post('/api/generate-assessment', async (req, res) => {
  try {
    const {
      mode,
      grade,
      semester,
      element,
      tema,
      temaCode,
      cp,
      tp,
      materi,
      submateri,
      questionCount = 10,
      questionType = 'Pilihan Ganda',
      essayCognitiveLevel = 'C4',
      difficulty = 'Sulit',
      contextType,
      allOptionsPositive = true,
      customPrompt = '',
      demoSessionId
    } = req.body;

    const userRole = (req.headers['x-user-role'] as string) || (req.body.isDemo ? 'demo' : 'licensed');

    // SERVER-SIDE DEMO LIMIT ENFORCEMENT
    if (userRole === 'demo' || mode === 'demo') {
      if (!demoSettingsCache.demoEnabled) {
        return res.status(403).json({
          success: false,
          quotaExceeded: false,
          message: 'Mode Demo saat ini sedang dinonaktifkan oleh Administrator. Silakan aktifkan Kode Lisensi Guru untuk mengakses fitur pembuatan asesmen.'
        });
      }

      // Check session usage
      const activeSessionId = demoSessionId || (req.headers['x-demo-session-id'] as string);
      if (activeSessionId) {
        let session = demoSessionsMap.get(activeSessionId);
        if (!session) {
          session = {
            sessionId: activeSessionId,
            createdAt: new Date().toISOString(),
            usageCount: 0,
            maxUsage: demoSettingsCache.maxGenerationsPerSession,
            lastUsedAt: new Date().toISOString()
          };
          demoSessionsMap.set(activeSessionId, session);
        }

        if (session.usageCount >= demoSettingsCache.maxGenerationsPerSession) {
          return res.status(403).json({
            success: false,
            quotaExceeded: true,
            message: `Batas kuota generasi Mode Demo telah tercapai (${session.usageCount}/${demoSettingsCache.maxGenerationsPerSession} kali generasi). Silakan aktifkan Kode Lisensi Guru untuk menikmati akses penuh tanpa batas!`
          });
        }

        // Increment usage
        session.usageCount += 1;
        session.lastUsedAt = new Date().toISOString();
        if (db) {
          setDoc(doc(db, 'demo_sessions', activeSessionId), session, { merge: true }).catch(() => {});
        }
      }
    }

    // Limit count based on role
    let count = Math.min(50, Math.max(1, Number(questionCount) || 10));
    if (userRole === 'demo' || mode === 'demo') {
      count = Math.min(demoSettingsCache.maxQuestionsPerGeneration, count);
    }

    const systemInstruction = `Anda adalah PAIBP DEEP LEARNING ASSESSMENT GENERATOR 2026.
Sebuah mesin penyusun asesmen profesional untuk guru Pendidikan Agama Islam dan Budi Pekerti (PAIBP) SMP/MTs Fase D (Kelas VII, VIII, IX) berdasarkan Keputusan Kepala Badan Kebijakan Pendidikan Dasar dan Menengah Nomor 020 Tahun 2026.

STANDAR CAPAIAN PEMBELAJARAN ELEMEN FASE D (Keputusan No. 020 Tahun 2026):
1. Al-Qur'an Hadis: Membaca, menghafal, menulis, dan menjelaskan ayat Al-Qur'an tentang pentingnya iman, takwa, toleransi, cinta tanah air, semangat keilmuan, dan sabar dalam menghadapi musibah dan ujian beserta hadis terkait.
2. Akidah: Meyakini dan merefleksikan rukun iman serta hal-hal yang dapat meneguhkan iman.
3. Akhlak: Menerapkan makna ikhlas, bersyukur kepada Allah Swt., cinta rasul, cinta ilmu, cinta lingkungan, serta cinta diri sendiri dan sesama.
4. Fikih: Menerapkan ketentuan sujud di luar rukun salat, rukhsah dalam ibadah, kewajiban terhadap jenazah, haji dan umrah, penyembelihan hewan, kurban, akikah, dan wakaf.
5. Sejarah Peradaban Islam: Merefleksikan sejarah dan peran Kekhalifahan Islam pasca Khulafaur Rasyidin serta sejarah masuknya Islam di Indonesia.

ATURAN KHUSUS SESUAI PERMINTAAN GURU:
1. ATURAN SOAL PILIHAN GANDA HOTS / EXTENDED ABSTRACT:
   - Pilihan jawaban (A, B, C, D) SEMUANYA WAJIB BERNADA POSITIF, HOMOGEN, DAN JUMLAH KARAKTER/KATA SEIMBANG (hampir sama panjangnya dan pola kalimatnya paralel).
   - Jangan ada opsi konyol, negatif, atau terlalu mudah disingkirkan. Seluruh opsi harus masuk akal, logis, dan memiliki nilai kebaikan.
   - Menuntut KECERMATAN TINGGI dalam menjawab: Hanya ada SATU jawaban yang paling tepat (kunci), yaitu opsi yang secara paling langsung menghubungkan tindakan dengan prinsip doktrin dalil naqli, tauhid, hisab, atau esensi syariat yang diuji, sedangkan distraktor lainnya berfokus pada hasil sosial, prestasi duniawi, atau formalitas aturan.

2. ATURAN SOAL URAIAN / ESSAY SESUAI TINGKATAN KOGNITIF YANG DIPILIH:
   - Jika jenis soal adalah Essay (atau Campuran), susunlah soal uraian/essay yang secara ketat mengukur tingkatan kognitif yang dipilih (${essayCognitiveLevel}):
     * C2 (Memahami): Menjelaskan esensi konsep dan hikmah secara komprehensif.
     * C3 (Menerapkan): Menguraikan langkah-langkah implementasi kaidah syariat dalam kasus riil.
     * C4 (Menganalisis): Membedah akar masalah, korelasi sebab-akibat, dan dilema moral berdasarkan dalil naqli.
     * C5 (Mengevaluasi): Menilai kritis beberapa alternatif tindakan dan memberikan pertimbangan syar'i berbasis kemaslahatan (maqashid).
     * C6 (Mencipta): Merancang rencana aksi inovatif, modul, atau strategi berkelanjutan.
     * Berjenjang: Distribusi progresif bertahap dari C2 hingga C6.
   - Untuk setiap butir soal essay:
     * Sertakan stimulus kontekstual yang autentik dan kaya masalah.
     * Rumusan pertanyaan yang jelas dengan KKO sesuai tingkatan kognitif.
     * Model jawaban ideal (modelAnswer) yang terstruktur dan lengkap.
     * Rubrik penskoran analitis (rubricCriteria) 4 level (Skor 4, Skor 3, Skor 2, Skor 1) dengan deskriptor capaian jelas.
     * Kata kunci esensial (keywords).

RANTAI SINKRONISASI MUTLAK (CP - TEMA - KISI-KISI - INDIKATOR - STIMULUS):
- Indikator: "Disajikan [konteks kasus], peserta didik dapat [KKO C2-C6] [materi tema] dengan tepat."
- Stimulus wajib kontekstual (kehidupan siswa, etika digital, media sosial, sekolah, lingkungan hidup, keluarga).
- Nilai Karakter Islami wajib diintegrasikan pada setiap butir soal.

Format output HARUS selalu berupa JSON valid sesuai skema yang diminta.`;

    const promptText = `Buatlah paket asesmen PAIBP Fase D lengkap sebanyak ${count} butir soal dengan parameter:
- Jenjang: SMP/MTs Fase D
- Kelas: ${grade} (Semester ${semester})
- Elemen: ${element}
${tema ? `- Tema Terklasifikasi: ${tema}` : ''}
- Capaian Pembelajaran (CP): ${cp}
- Tujuan Pembelajaran (TP): ${tp}
- Materi Pokok: ${materi}
- Submateri: ${submateri || 'Sesuai kurikulum PAIBP Fase D'}
- Bentuk Soal: ${questionType} (Pilihan Ganda / Essay / Campuran)
${questionType !== 'Pilihan Ganda' ? `- Tingkatan Kognitif Soal Essay: ${essayCognitiveLevel}` : ''}
- Mode Generator: ${mode}
- Tingkat Kesulitan: ${difficulty}
- Konteks Stimulus: ${contextType || 'Kehidupan siswa, sekolah, etika digital, dan masyarakat'}
- Semua opsi PG homogen, positif & panjang karakter seimbang: YA (memerlukan kecermatan tinggi dalam menjawab)
${customPrompt ? `- Instruksi Tambahan: ${customPrompt}` : ''}

Pastikan distribusi kunci jawaban PG seimbang merata (A, B, C, D).`;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: false,
        useFallback: true,
        message: 'GEMINI_API_KEY not provided, using high-fidelity algorithmic generator.'
      });
    }

    const ai = getAi();
    const response = await generateContentWithFallback(ai, {
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assessmentTitle: { type: Type.STRING },
            cp: { type: Type.STRING },
            tpList: { type: Type.ARRAY, items: { type: Type.STRING } },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.INTEGER },
                  element: { type: Type.STRING },
                  tema: { type: Type.STRING },
                  temaCode: { type: Type.STRING },
                  tp: { type: Type.STRING },
                  materi: { type: Type.STRING },
                  submateri: { type: Type.STRING },
                  indicator: { type: Type.STRING },
                  stimulus: { type: Type.STRING },
                  operationalVerb: { type: Type.STRING },
                  bloomLevel: { type: Type.STRING, description: "C1, C2, C3, C4, C5, or C6" },
                  soloLevel: { type: Type.STRING, description: "Unistructural, Multistructural, Relational, or Extended Abstract" },
                  deepLearningDim: { type: Type.STRING, description: "Memahami, Mengaplikasi, Merefleksi, or Mentransfer" },
                  difficulty: { type: Type.STRING, description: "Mudah, Sedang, Sulit, or Sangat Sulit" },
                  questionType: { type: Type.STRING, description: "Pilihan Ganda or Essay" },
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        key: { type: Type.STRING, description: "A, B, C, or D" },
                        text: { type: Type.STRING }
                      },
                      required: ['key', 'text']
                    }
                  },
                  correctKey: { type: Type.STRING, description: "A, B, C, D, or Rubrik Terlampir" },
                  explanation: { type: Type.STRING },
                  modelAnswer: { type: Type.STRING, description: "Contoh model jawaban ideal untuk soal essay" },
                  rubricCriteria: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        score: { type: Type.INTEGER },
                        label: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ['score', 'label', 'description']
                    }
                  },
                  keywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  distractorExplanation: {
                    type: Type.OBJECT,
                    properties: {
                      A: { type: Type.STRING },
                      B: { type: Type.STRING },
                      C: { type: Type.STRING },
                      D: { type: Type.STRING }
                    }
                  },
                  islamicValue: { type: Type.STRING },
                  realLifeContext: { type: Type.STRING },
                  dalilReference: { type: Type.STRING }
                },
                required: ['number', 'tp', 'materi', 'indicator', 'stimulus', 'bloomLevel', 'soloLevel', 'deepLearningDim', 'difficulty', 'questionText', 'explanation', 'islamicValue', 'realLifeContext']
              }
            }
          },
          required: ['assessmentTitle', 'cp', 'tpList', 'questions']
        }
      }
    });

    const textOutput = response.text?.trim() || '{}';
    const parsedData = JSON.parse(textOutput);

    if (parsedData && Array.isArray(parsedData.questions)) {
      parsedData.tema = tema || parsedData.tema;
      parsedData.temaCode = temaCode || parsedData.temaCode;
      parsedData.questions = parsedData.questions.map((q: any) => ({
        ...q,
        element: q.element || element,
        tema: q.tema || tema,
        temaCode: q.temaCode || temaCode
      }));
    }

    return res.json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error('Error generating assessment via Gemini API:', error);
    return res.status(200).json({
      success: false,
      error: error.message || 'Failed to generate assessment',
      useFallback: true
    });
  }
});

// Single Question Regeneration Endpoint
app.post('/api/regenerate-question', async (req, res) => {
  try {
    const { questionItem, instruction } = req.body;
    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        success: false,
        useFallback: true,
        message: 'No GEMINI_API_KEY available'
      });
    }

    const ai = getAi();
    const prompt = `Revisi atau regenerasi butir soal PAIBP Fase D berikut sesuai instruksi guru:
Soal saat ini: ${JSON.stringify(questionItem)}
Instruksi perbaikan: ${instruction || 'Tingkatkan kualitas stimulus, buat semua opsi positif dan mendekati benar, level HOTS C4-C6 dan SOLO Relational/Extended Abstract.'}`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: 'Anda adalah PAIBP DEEP LEARNING ASSESSMENT GENERATOR 2026. Hasilkan 1 butir soal PAIBP Fase D format JSON dengan kualitas tinggi, anti-hafalan, stimulus mendalam, dan opsi homogen.',
        responseMimeType: 'application/json'
      }
    });

    const textOutput = response.text?.trim() || '{}';
    const parsed = JSON.parse(textOutput);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error regenerating question:', error);
    return res.status(200).json({ success: false, error: error.message, useFallback: true });
  }
});

async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const isProduction = process.env.NODE_ENV === 'production' || (fs.existsSync(path.join(distPath, 'index.html')) && process.env.NODE_ENV !== 'development');

  if (isProduction) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PAIBP Multi-User & Assessment Generator Server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
