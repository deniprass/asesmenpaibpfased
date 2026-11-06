import { UserAccount, UserRole, DemoSession } from '../types';
import { signInWithGoogle, signOutUser, auth } from './firebase';

const USER_SESSION_KEY = 'paibp_user_session';
const DEMO_SESSION_KEY = 'paibp_demo_session';
const OWNER_TOKEN_KEY = 'paibp_owner_token';

// Default initial state
let currentUser: UserAccount | null = null;
let currentDemoSession: DemoSession | null = null;

const authSubscribers: ((user: UserAccount | null) => void)[] = [];

export function subscribeToUser(listener: (user: UserAccount | null) => void) {
  authSubscribers.push(listener);
  listener(currentUser);
  return () => {
    const idx = authSubscribers.indexOf(listener);
    if (idx !== -1) authSubscribers.splice(idx, 1);
  };
}

function notifySubscribers() {
  authSubscribers.forEach(cb => cb(currentUser ? { ...currentUser } : null));
}

/**
 * Inisialisasi sesi pengguna dari localStorage dan periksa status
 */
export function initializeUserSession(): UserAccount | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (raw) {
      const parsed: UserAccount = JSON.parse(raw);
      currentUser = parsed;
      notifySubscribers();
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse user session:', e);
  }
  currentUser = null;
  notifySubscribers();
  return null;
}

/**
 * Simpan sesi pengguna
 */
export function setUserSession(user: UserAccount): void {
  currentUser = user;
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to save user session:', e);
  }
  notifySubscribers();
}

/**
 * Logout pengguna
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOutUser();
  } catch {
    // Ignore firebase signout error if any
  }
  currentUser = null;
  try {
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(OWNER_TOKEN_KEY);
  } catch (e) {
    console.warn('Error clearing session:', e);
  }
  notifySubscribers();
}

/**
 * Masuk Mode Demo Gratis
 */
export async function startDemoSession(): Promise<{ user: UserAccount; session: DemoSession }> {
  let sessionId = '';
  try {
    const stored = localStorage.getItem(DEMO_SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      sessionId = parsed.sessionId || '';
    }
  } catch {
    // ignore
  }

  // Call server to initialize or fetch demo session
  let demoData: any = null;
  try {
    const res = await fetch('/api/demo/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    demoData = await res.json();
  } catch (e) {
    console.warn('Server demo session fetch fallback:', e);
  }

  const activeSessionId = demoData?.session?.sessionId || sessionId || `demo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const usageCount = demoData?.session?.usageCount ?? 0;
  const maxUsage = demoData?.session?.maxUsage ?? 2;

  const sessionObj: DemoSession = {
    sessionId: activeSessionId,
    createdAt: new Date().toISOString(),
    usageCount,
    maxUsage,
    lastUsedAt: new Date().toISOString()
  };

  currentDemoSession = sessionObj;
  try {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(sessionObj));
  } catch {
    // ignore
  }

  const demoUser: UserAccount = {
    uid: activeSessionId,
    email: null,
    displayName: 'Pengguna Demo PAIBP',
    role: 'demo',
    status: 'active',
    schoolName: 'SMP / MTs (Mode Demo)',
    packageName: 'Paket Uji Coba Demo Gratis',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    workspaceId: `workspace_demo_${activeSessionId}`
  };

  setUserSession(demoUser);
  return { user: demoUser, session: sessionObj };
}

/**
 * Update kuota demo setelah generasi
 */
export function updateDemoSessionUsage(newUsageCount: number): void {
  if (currentDemoSession) {
    currentDemoSession.usageCount = newUsageCount;
    currentDemoSession.lastUsedAt = new Date().toISOString();
    try {
      localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(currentDemoSession));
    } catch {
      // ignore
    }
  }
}

/**
 * Dapatkan sesi demo saat ini
 */
export function getDemoSession(): DemoSession | null {
  if (currentDemoSession) return currentDemoSession;
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (raw) {
      currentDemoSession = JSON.parse(raw);
      return currentDemoSession;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Login sebagai Owner dengan Google Auth atau Master Secret Key
 */
export async function loginAsOwner(method: 'google' | 'key', secretKey?: string): Promise<{ success: boolean; user?: UserAccount; message?: string }> {
  try {
    let email = '';
    let displayName = 'Super Admin / Owner';

    if (method === 'google') {
      const gUser = await signInWithGoogle();
      if (!gUser) throw new Error('Google Sign-in dibatalkan');
      email = gUser.email || '';
      displayName = gUser.displayName || 'Owner PAIBP';
    }

    const res = await fetch('/api/auth/owner-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, secretKey })
    });

    const data = await res.json();
    if (!data.success) {
      return { success: false, message: data.message || 'Autentikasi Owner ditolak.' };
    }

    const ownerUser: UserAccount = {
      uid: data.uid || `owner_${Date.now()}`,
      email: data.email || 'denyprass37@gmail.com',
      displayName: displayName || 'Owner / Super Admin',
      role: 'owner',
      status: 'active',
      packageName: 'Owner / Super Administrator',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      workspaceId: 'workspace_owner_root'
    };

    if (data.token) {
      localStorage.setItem(OWNER_TOKEN_KEY, data.token);
    }
    setUserSession(ownerUser);
    return { success: true, user: ownerUser };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal login sebagai owner' };
  }
}

/**
 * Dapatkan token Owner untuk header otorisasi API
 */
export function getOwnerToken(): string {
  try {
    return localStorage.getItem(OWNER_TOKEN_KEY) || '';
  } catch {
    return '';
  }
}
