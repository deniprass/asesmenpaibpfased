import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Key,
  Sliders,
  BarChart3,
  Search,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  LogOut,
  Layers,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Ban,
  Activity,
  Calendar,
  School,
  ExternalLink,
  Laptop
} from 'lucide-react';
import {
  LicenseRecord,
  UserAccount,
  DemoSettings,
  SystemStats,
  AuditLog,
  LicensePackageType,
  LicenseStatus
} from '../types';
import {
  fetchLicenses,
  createLicense,
  bulkCreateLicenses,
  updateLicense,
  revokeLicense,
  fetchDemoSettings,
  updateDemoSettings,
  fetchSystemStats,
  fetchUsersList,
  updateUserStatus,
  fetchAuditLogs
} from '../services/licenseService';

interface OwnerDashboardProps {
  currentOwner: UserAccount;
  onLogout: () => void;
  onSwitchToTeacherWorkspace: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  currentOwner,
  onLogout,
  onSwitchToTeacherWorkspace
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'licenses' | 'users' | 'demo' | 'audit'>('stats');

  // Stats state
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeLicenses: 0,
    expiredLicenses: 0,
    revokedLicenses: 0,
    demoUsersCount: 0,
    totalGenerations: 0,
    activeToday: 0
  });

  // Licenses state
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [searchLicense, setSearchLicense] = useState<string>('');
  const [filterLicenseStatus, setFilterLicenseStatus] = useState<string>('all');
  const [filterPackageType, setFilterPackageType] = useState<string>('all');
  const [isLoadingLicenses, setIsLoadingLicenses] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New License Modal states
  const [showCreateSingleModal, setShowCreateSingleModal] = useState<boolean>(false);
  const [showBulkCreateModal, setShowBulkCreateModal] = useState<boolean>(false);

  // Single License Form
  const [newLicPackageName, setNewLicPackageName] = useState<string>('Lisensi Guru Individual (1 Tahun)');
  const [newLicType, setNewLicType] = useState<LicensePackageType>('individual');
  const [newLicDurationDays, setNewLicDurationDays] = useState<number>(365);
  const [newLicMaxActivations, setNewLicMaxActivations] = useState<number>(1);
  const [newLicCustomCode, setNewLicCustomCode] = useState<string>('');
  const [newLicInternalNote, setNewLicInternalNote] = useState<string>('');

  // Bulk License Form
  const [bulkCount, setBulkCount] = useState<number>(5);
  const [bulkPackageName, setBulkPackageName] = useState<string>('Lisensi Guru Individual (1 Tahun)');
  const [bulkType, setBulkType] = useState<LicensePackageType>('individual');
  const [bulkDurationDays, setBulkDurationDays] = useState<number>(365);
  const [bulkMaxActivations, setBulkMaxActivations] = useState<number>(1);
  const [bulkPrefix, setBulkPrefix] = useState<string>('PAI2026');
  const [bulkInternalNote, setBulkInternalNote] = useState<string>('');

  // Users state
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchUser, setSearchUser] = useState<string>('');
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  // Demo Settings state
  const [demoSettings, setDemoSettings] = useState<DemoSettings>({
    demoEnabled: true,
    allowedFeatures: [],
    maxQuestionsPerGeneration: 5,
    maxGenerationsPerSession: 2,
    dailyLimit: 10,
    exportEnabled: false,
    persistenceEnabled: false,
    demoMessage: '',
    activateButtonText: ''
  });
  const [isSavingDemo, setIsSavingDemo] = useState<boolean>(false);
  const [demoSaveFeedback, setDemoSaveFeedback] = useState<string>('');

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Load initial data
  const loadAllData = async () => {
    // Stats
    const statsRes = await fetchSystemStats();
    if (statsRes.success) setStats(statsRes.stats);

    // Licenses
    setIsLicensesLoading(true);
    const licRes = await fetchLicenses({
      search: searchLicense,
      status: filterLicenseStatus,
      packageType: filterPackageType
    });
    if (licRes.success) setLicenses(licRes.licenses);
    setIsLicensesLoading(false);

    // Users
    const usersRes = await fetchUsersList();
    if (usersRes.success) setUsers(usersRes.users);

    // Demo Settings
    const demoRes = await fetchDemoSettings();
    setDemoSettings(demoRes);

    // Audit Logs
    const auditRes = await fetchAuditLogs();
    if (auditRes.success) setAuditLogs(auditRes.logs);
  };

  const setIsLicensesLoading = (val: boolean) => setIsLoadingLicenses(val);

  useEffect(() => {
    loadAllData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createLicense({
      code: newLicCustomCode.trim().toUpperCase() || undefined,
      packageName: newLicPackageName,
      packageType: newLicType,
      durationDays: newLicDurationDays,
      maxActivations: newLicMaxActivations,
      internalNote: newLicInternalNote
    });

    if (res.success) {
      setShowCreateSingleModal(false);
      setNewLicCustomCode('');
      setNewLicInternalNote('');
      loadAllData();
    } else {
      alert(res.message || 'Gagal menerbitkan lisensi.');
    }
  };

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await bulkCreateLicenses({
      count: bulkCount,
      packageName: bulkPackageName,
      packageType: bulkType,
      durationDays: bulkDurationDays,
      maxActivations: bulkMaxActivations,
      prefix: bulkPrefix.trim().toUpperCase() || 'PAI2026',
      internalNote: bulkInternalNote
    });

    if (res.success) {
      setShowBulkCreateModal(false);
      setBulkInternalNote('');
      loadAllData();
    } else {
      alert(res.message || 'Gagal menerbitkan lisensi massal.');
    }
  };

  const handleToggleLicenseStatus = async (lic: LicenseRecord) => {
    const nextStatus: LicenseStatus = lic.status === 'active' ? 'inactive' : 'active';
    await updateLicense(lic.id, { status: nextStatus });
    loadAllData();
  };

  const handleRevokeLicense = async (lic: LicenseRecord) => {
    if (confirm(`Apakah Anda yakin ingin mencabut lisensi ${lic.code}? Pengguna yang terhubung tidak akan dapat menggunakannya lagi.`)) {
      await revokeLicense(lic.id);
      loadAllData();
    }
  };

  const handleSaveDemoSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDemo(true);
    setDemoSaveFeedback('');
    try {
      const res = await updateDemoSettings(demoSettings);
      if (res.success) {
        setDemoSaveFeedback('Pengaturan Mode Demo berhasil disimpan!');
        setTimeout(() => setDemoSaveFeedback(''), 3000);
      } else {
        setDemoSaveFeedback(res.message || 'Gagal menyimpan pengaturan.');
      }
    } finally {
      setIsSavingDemo(false);
    }
  };

  const handleExportCsv = () => {
    if (licenses.length === 0) return;
    const headers = ['Kode Lisensi', 'Nama Paket', 'Tipe Paket', 'Status', 'Masa Berlaku (Hari)', 'Batas Aktivasi', 'Aktivasi Saat Ini', 'Catatan Internal', 'Dibuat Pada'];
    const rows = licenses.map(l => [
      `"${l.code}"`,
      `"${l.packageName}"`,
      `"${l.packageType}"`,
      `"${l.status}"`,
      l.durationDays === 0 ? '"Lifetime"' : l.durationDays,
      l.maxActivations,
      l.currentActivations,
      `"${l.internalNote || ''}"`,
      `"${new Date(l.createdAt).toLocaleDateString('id-ID')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Kode_Lisensi_PAIBP_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Owner Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-amber-500/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm tracking-tight text-white uppercase">
                  DASHBOARD OWNER / SUPER ADMIN
                </span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                  Sistem Multi-User
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                PAIBP FASE D SMART LEARNING PRO 2026 • Administrator: <span className="text-amber-300 font-medium">{currentOwner.email || 'denyprass37@gmail.com'}</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onSwitchToTeacherWorkspace}
              className="px-3 py-1.5 bg-linear-to-r from-emerald-900 to-teal-900 hover:from-emerald-800 hover:to-teal-800 text-emerald-200 hover:text-white rounded-lg border border-emerald-500/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Pratinjau modul pembuatan soal sebagai guru"
            >
              <Laptop className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Buka Ruang Kerja Guru</span>
              <span className="sm:hidden">Guru App</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2.5">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Ringkasan & Statistik</span>
            </button>

            <button
              onClick={() => setActiveTab('licenses')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'licenses'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Manajemen Kode Lisensi</span>
              <span className="bg-slate-800 px-1.5 py-0.2 rounded text-[10px] text-amber-300">
                {licenses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Pengguna Terdaftar</span>
              <span className="bg-slate-800 px-1.5 py-0.2 rounded text-[10px] text-sky-300">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Pengaturan Mode Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Audit Log Sistem</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: RINGKASAN & STATISTIK */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Total Pengguna</span>
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{stats.totalUsers}</span>
                  <span className="text-[11px] text-slate-400">Guru terdaftar</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-300 font-semibold">Lisensi Aktif</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Key className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">{stats.activeLicenses}</span>
                  <span className="text-[11px] text-slate-400">Kode dapat digunakan</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Sesi Pengguna Demo</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400">{stats.demoUsersCount}</span>
                  <span className="text-[11px] text-slate-400">Sesi evaluasi gratis</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Total Asesmen Digenerate</span>
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-purple-300">{stats.totalGenerations}</span>
                  <span className="text-[11px] text-slate-400">Paket soal PAIBP</span>
                </div>
              </div>
            </div>

            {/* Quick Status and System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span>Status Hak Akses & Distribusi Paket Lisensi</span>
                  </h3>
                  <button
                    onClick={loadAllData}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Segarkan</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Paket Guru Individual:</span>
                    <span className="text-lg font-bold text-sky-400">
                      {licenses.filter(l => l.packageType === 'individual').length}
                    </span>
                    <span className="text-[11px] text-slate-500 block">Kode diterbitkan</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Paket Sekolah / Lembaga:</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {licenses.filter(l => l.packageType === 'institution').length}
                    </span>
                    <span className="text-[11px] text-slate-500 block">Multi-guru (5+ user)</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Lisensi Dicabut / Expired:</span>
                    <span className="text-lg font-bold text-red-400">
                      {licenses.filter(l => l.status === 'revoked' || (l.expiresAt && new Date(l.expiresAt) < new Date())).length}
                    </span>
                    <span className="text-[11px] text-slate-500 block">Akses dinonaktifkan</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Kebijakan Sistem Multi-User & Isolasi Data:
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Setiap guru yang mengaktifkan kode lisensi resmi memperoleh <strong className="text-slate-200">Ruang Kerja Mandiri (Workspace)</strong>. Kisi-kisi, bank soal, naskah asesmen, buku nilai rombel A-D, dan data hasil CBT siswa antar-guru terisolasi secara aman menggunakan partition key sehingga data tidak bercampur.
                  </p>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Aksi Cepat Owner</span>
                </h3>

                <div className="space-y-2.5">
                  <button
                    onClick={() => { setActiveTab('licenses'); setShowCreateSingleModal(true); }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Terbitkan 1 Kode Lisensi</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('licenses'); setShowBulkCreateModal(true); }}
                    className="w-full py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Terbitkan Lisensi Massal (Bulk)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('demo')}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>Atur Kuota Mode Demo</span>
                  </button>

                  <button
                    onClick={onSwitchToTeacherWorkspace}
                    className="w-full py-2.5 bg-purple-950 hover:bg-purple-900 text-purple-200 rounded-xl text-xs font-semibold border border-purple-500/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Laptop className="w-4 h-4 text-purple-400" />
                    <span>Buka Ruang Kerja Guru</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAJEMEN KODE LISENSI */}
        {activeTab === 'licenses' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchLicense}
                    onChange={(e) => setSearchLicense(e.target.value)}
                    placeholder="Cari kode lisensi, nama paket, atau catatan..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <select
                  value={filterLicenseStatus}
                  onChange={(e) => setFilterLicenseStatus(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                  <option value="revoked">Dicabut</option>
                </select>

                <select
                  value={filterPackageType}
                  onChange={(e) => setFilterPackageType(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                >
                  <option value="all">Semua Paket</option>
                  <option value="individual">Individual</option>
                  <option value="institution">Sekolah/Lembaga</option>
                  <option value="custom">Custom / Pro</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Unduh daftar lisensi ke file CSV"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden md:inline">Ekspor CSV</span>
                </button>

                <button
                  onClick={() => setShowBulkCreateModal(true)}
                  className="px-3 py-2 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Massal (Bulk)</span>
                </button>

                <button
                  onClick={() => setShowCreateSingleModal(true)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Terbitkan 1 Lisensi</span>
                </button>
              </div>
            </div>

            {/* License Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Kode Lisensi</th>
                      <th className="py-3 px-4">Nama Paket & Tipe</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Aktivasi / Slot</th>
                      <th className="py-3 px-4">Masa Berlaku</th>
                      <th className="py-3 px-4">Catatan Internal</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {licenses.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-500">
                          Belum ada kode lisensi yang cocok dengan filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      licenses
                        .filter(l => {
                          const s = searchLicense.toLowerCase();
                          const matchSearch = !s || l.code.toLowerCase().includes(s) || l.packageName.toLowerCase().includes(s) || l.internalNote.toLowerCase().includes(s);
                          const matchStatus = filterLicenseStatus === 'all' || l.status === filterLicenseStatus;
                          const matchType = filterPackageType === 'all' || l.packageType === filterPackageType;
                          return matchSearch && matchStatus && matchType;
                        })
                        .map(lic => {
                          const isExpired = lic.expiresAt && new Date(lic.expiresAt) < new Date();
                          return (
                            <tr key={lic.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-amber-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                    {lic.code}
                                  </span>
                                  <button
                                    onClick={() => handleCopyCode(lic.code)}
                                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    title="Salin Kode Lisensi"
                                  >
                                    {copiedCode === lic.code ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold block text-white">{lic.packageName}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{lic.packageType}</span>
                              </td>
                              <td className="py-3 px-4">
                                {lic.status === 'revoked' ? (
                                  <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/30">
                                    Dicabut
                                  </span>
                                ) : isExpired ? (
                                  <span className="bg-orange-500/20 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/30">
                                    Kedaluwarsa
                                  </span>
                                ) : lic.status === 'active' ? (
                                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                                    Aktif
                                  </span>
                                ) : (
                                  <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded">
                                    Nonaktif
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-white">{lic.currentActivations}</span>
                                  <span className="text-slate-400">/ {lic.maxActivations} akun</span>
                                </div>
                                {lic.activations && lic.activations.length > 0 && (
                                  <span className="text-[10px] text-emerald-400 block truncate max-w-[140px]">
                                    {lic.activations[0].displayName}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {lic.durationDays === 0 ? (
                                  <span className="text-purple-300 font-semibold">Selamanya (Lifetime)</span>
                                ) : (
                                  <div>
                                    <span>{lic.durationDays} Hari</span>
                                    {lic.expiresAt && (
                                      <span className="text-[10px] text-slate-400 block">
                                        s/d {new Date(lic.expiresAt).toLocaleDateString('id-ID')}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4 max-w-[180px] truncate text-slate-400 text-[11px]">
                                {lic.internalNote || '-'}
                              </td>
                              <td className="py-3 px-4 text-right space-x-1.5">
                                <button
                                  onClick={() => handleToggleLicenseStatus(lic)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                                  title={lic.status === 'active' ? 'Nonaktifkan Lisensi' : 'Aktifkan Lisensi'}
                                >
                                  {lic.status === 'active' ? 'Matikan' : 'Aktifkan'}
                                </button>

                                {lic.status !== 'revoked' && (
                                  <button
                                    onClick={() => handleRevokeLicense(lic)}
                                    className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 text-red-300 text-[11px] font-medium border border-red-500/30 transition-colors cursor-pointer"
                                    title="Cabut Lisensi Permanen"
                                  >
                                    Cabut
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DAFTAR PENGGUNA TERDAFTAR */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="Cari guru berdasarkan nama, email, sekolah, atau kode lisensi..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadAllData}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Segarkan</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Nama Guru & Email</th>
                      <th className="py-3 px-4">Peran (Role)</th>
                      <th className="py-3 px-4">Asal Sekolah</th>
                      <th className="py-3 px-4">Kode Lisensi & Paket</th>
                      <th className="py-3 px-4">Status Akun</th>
                      <th className="py-3 px-4">Ruang Kerja (Workspace)</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-500">
                          Belum ada pengguna berlisensi yang terdaftar. Kode lisensi yang telah diterbitkan siap untuk diaktivasi.
                        </td>
                      </tr>
                    ) : (
                      users
                        .filter(u => {
                          const s = searchUser.toLowerCase();
                          return !s ||
                            u.displayName.toLowerCase().includes(s) ||
                            (u.email && u.email.toLowerCase().includes(s)) ||
                            (u.schoolName && u.schoolName.toLowerCase().includes(s)) ||
                            (u.licenseCode && u.licenseCode.toLowerCase().includes(s));
                        })
                        .map(u => (
                          <tr key={u.uid} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-bold text-white block">{u.displayName}</span>
                              <span className="text-[11px] text-slate-400">{u.email || 'Tanpa Email'}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              {u.schoolName || '-'}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono text-amber-300 font-bold block">{u.licenseCode || '-'}</span>
                              <span className="text-[10px] text-slate-400">{u.packageName || '-'}</span>
                            </td>
                            <td className="py-3 px-4">
                              {u.status === 'active' ? (
                                <span className="text-emerald-400 font-semibold">Aktif</span>
                              ) : (
                                <span className="text-red-400 font-semibold">Suspended</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                              {u.workspaceId}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={async () => {
                                  const next = u.status === 'active' ? 'suspended' : 'active';
                                  await updateUserStatus(u.uid, next);
                                  loadAllData();
                                }}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                {u.status === 'active' ? 'Tangguhkan' : 'Aktifkan'}
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PENGATURAN MODE DEMO */}
        {activeTab === 'demo' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <span>Konfigurasi Dinamis Mode Demo Gratis</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Atur batasan uji coba pengguna tanpa kode lisensi secara terpusat di server tanpa perlu mengubah kode sumber.
                </p>
              </div>

              {demoSaveFeedback && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{demoSaveFeedback}</span>
                </div>
              )}

              <form onSubmit={handleSaveDemoSettings} className="space-y-5">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Status Mode Demo</span>
                    <span className="text-[11px] text-slate-400">
                      Jika dinonaktifkan, seluruh pengguna wajib menggunakan kode lisensi untuk mengakses aplikasi.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={demoSettings.demoEnabled}
                      onChange={(e) => setDemoSettings({ ...demoSettings, demoEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {/* Quota Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      Maksimal Soal per Generasi (Default: 5)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={demoSettings.maxQuestionsPerGeneration}
                      onChange={(e) => setDemoSettings({ ...demoSettings, maxQuestionsPerGeneration: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-500 font-bold"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Batas butir soal per satu kali proses generate</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                      Maksimal Generasi per Sesi (Default: 2)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={demoSettings.maxGenerationsPerSession}
                      onChange={(e) => setDemoSettings({ ...demoSettings, maxGenerationsPerSession: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-500 font-bold"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Setelah kuota habis, pengguna diminta mengaktifkan lisensi</span>
                  </div>
                </div>

                {/* Permissions Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Izinkan Ekspor Dokumen</span>
                      <span className="text-[10px] text-slate-500">Download PDF & Word pada mode demo</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={demoSettings.exportEnabled}
                      onChange={(e) => setDemoSettings({ ...demoSettings, exportEnabled: e.target.checked })}
                      className="rounded border-slate-700 text-amber-600 focus:ring-0 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block">Penyimpanan Cloud Permanen</span>
                      <span className="text-[10px] text-slate-500">Simpan bank soal permanen di database</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={demoSettings.persistenceEnabled}
                      onChange={(e) => setDemoSettings({ ...demoSettings, persistenceEnabled: e.target.checked })}
                      className="rounded border-slate-700 text-amber-600 focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Promotional Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Pesan Sambutan & Penawaran Lisensi Mode Demo
                  </label>
                  <textarea
                    rows={3}
                    value={demoSettings.demoMessage}
                    onChange={(e) => setDemoSettings({ ...demoSettings, demoMessage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-amber-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Teks Tombol Aksi Lisensi (CTA)
                  </label>
                  <input
                    type="text"
                    value={demoSettings.activateButtonText}
                    onChange={(e) => setDemoSettings({ ...demoSettings, activateButtonText: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-amber-500 font-semibold"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingDemo}
                    className="w-full py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingDemo ? 'Menyimpan...' : 'Simpan Konfigurasi Mode Demo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOG SISTEM */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Riwayat Aktivitas & Keamanan Sistem</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Mencatat penerbitan lisensi, aktivasi akun guru, perubahan konfigurasi, dan login Owner.
                </p>
              </div>

              <button
                onClick={loadAllData}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Segarkan Log</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4">Aksi / Event</th>
                      <th className="py-3 px-4">Aktor / Email</th>
                      <th className="py-3 px-4">Target / Resource</th>
                      <th className="py-3 px-4">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-slate-500">
                          Belum ada aktivitas baru tercatat.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                            {new Date(log.timestamp).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-amber-300 font-mono text-[11px]">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white">
                            {log.actorEmail}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400">
                            {log.targetType}: {log.targetId}
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate font-mono">
                            {JSON.stringify(log.details || {})}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: TERBITKAN 1 KODE LISENSI */}
      {showCreateSingleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowCreateSingleModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <span>Terbitkan 1 Kode Lisensi Baru</span>
            </h3>

            <form onSubmit={handleCreateSingle} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Nama Paket Lisensi</label>
                <input
                  type="text"
                  value={newLicPackageName}
                  onChange={(e) => setNewLicPackageName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Tipe Paket</label>
                  <select
                    value={newLicType}
                    onChange={(e) => setNewLicType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="individual">Guru Individual</option>
                    <option value="institution">Sekolah / Lembaga</option>
                    <option value="period">Berjangka</option>
                    <option value="custom">Custom / Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Masa Berlaku (Hari)</label>
                  <input
                    type="number"
                    min={0}
                    value={newLicDurationDays}
                    onChange={(e) => setNewLicDurationDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="0 = Selamanya"
                  />
                  <span className="text-[10px] text-slate-400">0 = Lifetime</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Batas Maksimal Akun (Slot Aktivasi)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newLicMaxActivations}
                  onChange={(e) => setNewLicMaxActivations(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Kode Kustom (Opsional, Kosongkan untuk Acak)</label>
                <input
                  type="text"
                  value={newLicCustomCode}
                  onChange={(e) => setNewLicCustomCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: PAI2026-MGMP-KOTA-01"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Catatan Internal Owner</label>
                <input
                  type="text"
                  value={newLicInternalNote}
                  onChange={(e) => setNewLicInternalNote(e.target.value)}
                  placeholder="Untuk: MGMP SMPN 1 Bandung..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan Lisensi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TERBITKAN LISENSI MASSAL (BULK CREATE) */}
      {showBulkCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowBulkCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Terbitkan Lisensi Massal (Bulk Generate)</span>
            </h3>

            <form onSubmit={handleBulkCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Jumlah Kode (1 - 50)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Prefix Kode</label>
                  <input
                    type="text"
                    value={bulkPrefix}
                    onChange={(e) => setBulkPrefix(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                    placeholder="PAI2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Nama Paket</label>
                <input
                  type="text"
                  value={bulkPackageName}
                  onChange={(e) => setBulkPackageName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Masa Berlaku (Hari)</label>
                  <input
                    type="number"
                    min={0}
                    value={bulkDurationDays}
                    onChange={(e) => setBulkDurationDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-400">0 = Lifetime</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Slot per Kode</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={bulkMaxActivations}
                    onChange={(e) => setBulkMaxActivations(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Catatan Batch</label>
                <input
                  type="text"
                  value={bulkInternalNote}
                  onChange={(e) => setBulkInternalNote(e.target.value)}
                  placeholder="Contoh: Distribusi Workshop PAI Fase D..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Layers className="w-4 h-4" />
                  <span>Generate {bulkCount} Kode Lisensi Sekaligus</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
