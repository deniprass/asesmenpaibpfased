export type GradeLevel = 'VII' | 'VIII' | 'IX';
export type Semester = '1' | '2';
export type RombelName = 'A' | 'B' | 'C' | 'D';

export type PaibpElement = 
  | "Al-Qur'an Hadis"
  | "Al-Qur'an dan Hadis"
  | "Akidah"
  | "Akhlak"
  | "Fikih"
  | "Sejarah Peradaban Islam";

export type BloomLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
export type SoloLevel = 'Unistructural' | 'Multistructural' | 'Relational' | 'Extended Abstract';
export type DeepLearningDimension = 'Memahami' | 'Mengaplikasi' | 'Merefleksi' | 'Mentransfer';
export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Sulit' | 'Sangat Sulit';

export type GeneratorMode = 
  | 'cepat'
  | 'profesional'
  | 'deep_learning'
  | 'hots'
  | 'sumatif'
  | 'remedial'
  | 'pengayaan'
  | 'randomizer';

export interface AssessmentIdentity {
  title: string;
  schoolName: string;
  subject: string;
  grade: GradeLevel;
  phase: string;
  semester: Semester;
  academicYear: string;
  teacherName: string;
  timeAllocation: number; // in minutes
  totalQuestions: number;
  dateCreated: string;
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QualityScore {
  tpAlignment: number; // 0-4
  stimulusQuality: number; // 0-4
  bloomPrecision: number; // 0-4
  soloPrecision: number; // 0-4
  optionHomogeneity: number; // 0-4
  distractorQuality: number; // 0-4
  contextuality: number; // 0-4
  cognitiveDepth: number; // 0-4
  total: number; // 0-32
  category: 'Sangat Baik' | 'Baik' | 'Perlu Revisi' | 'Tidak Layak';
}

export interface RubricCriterion {
  score: number;
  label: string;
  description: string;
}

export interface QuestionItem {
  number: number;
  element: PaibpElement | string;
  tema?: string;
  temaCode?: string;
  tp: string;
  materi: string;
  submateri: string;
  indicator: string;
  stimulus: string;
  operationalVerb: string;
  bloomLevel: BloomLevel;
  soloLevel: SoloLevel;
  deepLearningDim: DeepLearningDimension;
  difficulty: DifficultyLevel;
  questionType: 'Pilihan Ganda' | 'Essay' | string;
  questionText: string;
  options: QuestionOption[];
  correctKey: 'A' | 'B' | 'C' | 'D' | string;
  explanation: string;
  distractorExplanation: Record<string, string>;
  islamicValue: string;
  realLifeContext: string;
  dalilReference?: string;
  qualityScore: QualityScore;
  // Khusus Soal Uraian / Essay:
  modelAnswer?: string;
  rubricCriteria?: RubricCriterion[];
  scoringGuide?: string;
  maxScore?: number;
  keywords?: string[];
}

export interface KisiKisiItem {
  number: number;
  cp: string;
  tp: string;
  element: string;
  tema?: string;
  temaCode?: string;
  materi: string;
  submateri: string;
  indicator: string;
  stimulus: string;
  operationalVerb: string;
  bloomLevel: BloomLevel;
  soloLevel: SoloLevel;
  deepLearningDim: DeepLearningDimension;
  difficulty: DifficultyLevel;
  questionType: string;
  questionNumber: number;
  correctKey: 'A' | 'B' | 'C' | 'D' | string;
}

export interface KeyDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
  idealPerOption: number;
  isBalanced: boolean;
  varianceScore: number;
}

export interface DistributionStat {
  count: number;
  percentage: number;
}

export interface ValidationCheckItem {
  id: string;
  label: string;
  passed: boolean;
  notes: string;
}

export interface AssessmentPackage {
  id: string;
  identity: AssessmentIdentity;
  mode: GeneratorMode;
  cp: string;
  tema?: string;
  temaCode?: string;
  tpList: string[];
  materiMapping: {
    element: string;
    tema?: string;
    temaCode?: string;
    materi: string;
    submateri: string;
    percentage: number;
    questionCount: number;
  }[];
  questions: QuestionItem[];
  kisiKisi: KisiKisiItem[];
  keyDistribution: KeyDistribution;
  bloomDistribution: Record<BloomLevel, DistributionStat>;
  soloDistribution: Record<SoloLevel, DistributionStat>;
  difficultyDistribution: Record<DifficultyLevel, DistributionStat>;
  deepLearningDistribution: Record<DeepLearningDimension, DistributionStat>;
  overallQuality: {
    averageScore: number;
    totalPossible: number;
    category: 'Sangat Baik' | 'Baik' | 'Perlu Revisi' | 'Tidak Layak';
    passedValidation: boolean;
  };
  recommendations: string[];
  validationChecklist: ValidationCheckItem[];
}

export interface GenerateAssessmentRequest {
  mode: GeneratorMode;
  grade: GradeLevel;
  semester: Semester;
  element: string;
  tema?: string;
  temaCode?: string;
  cp: string;
  tp: string;
  materi: string;
  submateri: string;
  questionCount: number;
  questionType: 'Pilihan Ganda' | 'Essay' | 'Campuran' | string;
  essayCognitiveLevel?: 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'Berjenjang';
  difficulty: DifficultyLevel | 'Custom';
  customBloom?: Record<BloomLevel, number>;
  customSolo?: Record<SoloLevel, number>;
  customDifficulty?: Record<DifficultyLevel, number>;
  contextType: string;
  allOptionsPositive: boolean;
  balancedPositiveOptions?: boolean;
  highDiscernmentOptions?: boolean;
  noRoteMemorization: boolean;
  schoolName?: string;
  teacherName?: string;
  customPrompt?: string;
}

export interface CpThemeClassification {
  themeId: string;
  element: PaibpElement;
  temaName: string;
  cpClause: string;
  description: string;
  recommendedGrades: GradeLevel[];
  recommendedSemesters: Semester[];
  submateriScope: string[];
  dalilReference: string;
  dalilMeaning?: string;
  suggestedTpList: string[];
  contextExamples: string[];
}

// ============================================================================
// SISTEM PENILAIAN LENGKAP: KOGNITIF, AFEKTIF, PSIKOMOTORIK PER TUJUAN PEMBELAJARAN
// ============================================================================

export type CognitiveAssessmentType = 'tugas' | 'diagnostik' | 'formatif' | 'sumatif';
export type AffectiveAssessmentType = 'sikap' | 'keaktifan' | 'presensi_sholat' | 'adab_etika';
export type PsychomotorAssessmentType = 'praktik' | 'unjuk_kerja' | 'produk_proyek';

export type AssessmentApproachType = 'diagnostik' | 'formatif' | 'sumatif' | 'autentik_p5ppra';
export type AssessmentDomainType = 'kognitif' | 'afektif' | 'psikomotorik';

export interface RubricCriterionLevel {
  level: 'Perlu Bimbingan' | 'Cukup' | 'Mahir' | 'Sangat Mahir';
  scoreRange: string;
  descriptor: string;
}

export interface RubricAspect {
  aspectName: string;
  domain: AssessmentDomainType;
  description: string;
  weight: number;
  levels: RubricCriterionLevel[];
}

export interface DiagnosticAssessmentItem {
  id: string;
  targetAspect: 'Kesiapan Religius (BTQ & Sholat)' | 'Kemampuan Konseptual Awal' | 'Gaya Belajar & Minat';
  questionPrompt: string;
  diagnosticCriteria: {
    ready: string;
    needsSupport: string;
  };
  remedialFollowUp: string;
}

export interface FormativeAssessmentItem {
  id: string;
  activityType: 'Observasi Proses & Karakter' | 'Cek Pemahaman (LKPD/Kuis)' | 'Jurnal Refleksi Diri';
  focusSkill: string;
  feedbackMethod: string;
  growthIndicator: string;
}

export interface SummativeAssessmentSpec {
  tpTarget: string;
  kktpThreshold: number;
  cognitiveLevel: 'C1-C2 (Pemahaman & Hafalan)' | 'C3-C4 (Aplikasi & Analisis)' | 'C5-C6 (Evaluasi & Kreasi)';
  testComponents: {
    multipleChoiceCount: number;
    essayCount: number;
    practicalDemo: string;
  };
}

export interface AuthenticP5ppraProject {
  title: string;
  p5Theme: string; // e.g. "Bhinneka Tunggal Ika", "Bangunlah Jiwa dan Raganya", "Gaya Hidup Berkelanjutan", "Rekayasa dan Teknologi"
  ppraValue: string; // e.g. "Tawassuth (Moderat)", "Tasamuh (Toleransi)", "Qudwah (Keteladanan)", "Muwatanah (Cinta Tanah Air)"
  socialOrDigitalContext: string; // Isu sosial nyata atau etika digital
  outputProduct: 'Kampanye Media Sosial / Video Pendek' | 'Infografis & Aksi Nyata' | 'Portofolio Advokasi Sosial' | 'Dokumentasi Praktik Nyata';
  rubricCriteria: {
    criteria: string;
    sangatBaik: string;
    baik: string;
    cukup: string;
    perluBimbingan: string;
  }[];
}

export interface HolisticTpAssessmentGuide {
  topicId: string;
  grade: GradeLevel;
  semester: Semester;
  element: PaibpElement;
  materi: string;
  tp: string;
  cp: string;
  dalilReference: string;
  
  // 1. Tiga Ranah Taksonomi Holistik
  domains: {
    kognitif: {
      subAspects: string[];
      focusPoints: string;
      rubrics: RubricAspect[];
    };
    afektif: {
      subAspects: string[];
      focusPoints: string;
      rubrics: RubricAspect[];
    };
    psikomotorik: {
      subAspects: string[];
      focusPoints: string;
      rubrics: RubricAspect[];
    };
  };

  // 2. Elemen Materi Ajar Spesifik Guidelines
  elementGuidelines: {
    elementName: PaibpElement;
    scopeSummary: string;
    keySkillsToAssess: string[];
  };

  // 3. Empat Pendekatan Asesmen Kurikulum Merdeka
  diagnostic: {
    purpose: string;
    items: DiagnosticAssessmentItem[];
  };
  formative: {
    purpose: string;
    items: FormativeAssessmentItem[];
  };
  summative: {
    purpose: string;
    spec: SummativeAssessmentSpec;
  };
  authenticP5ppra: AuthenticP5ppraProject;
}

export interface StudentInfo {
  id: string;
  name: string;
  nis?: string;
  nisn: string;
  gender: 'L' | 'P';
  classGroup: string; // e.g. "VII-A", "VIII-B", "IX-C"
}

export interface StudentCognitiveScore {
  tugas?: number;
  diagnostik?: number;
  formatif?: number;
  sumatif?: number;
  rataRata: number;
}

export interface StudentAffectiveScore {
  sikap?: number;          // 0-100 (Integritas, Jujur, Tawadhu, Disiplin)
  keaktifan?: number;      // 0-100 (Partisipasi diskusi, kolaborasi)
  presensiSholat?: number; // 0-100 (Sholat 5 waktu & Mutaba'ah yaumiyah)
  adabEtika?: number;      // 0-100 (Adab berguru, etika digital/tabayyun)
  rataRata: number;
  predikat: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
}

export interface StudentPsychomotorScore {
  praktik?: number;        // 0-100 (Praktik ibadah, wudhu, sholat jenazah, makhorijul huruf/tajwid)
  unjukKerja?: number;     // 0-100 (Presentasi, demonstrasi pemecahan masalah)
  produkProyek?: number;   // 0-100 (Infografis/karya dakwah, rancangan program sosial)
  rataRata: number;
  predikat: 'Sangat Mahir' | 'Mahir' | 'Cukup' | 'Perlu Bimbingan';
}

// ============================================================================
// FORMAT PENILAIAN BARU: FORMATIF, SUMATIF 5 ELEMEN, DAN CATATAN SIKAP GURU
// ============================================================================

export interface FormatifAssessmentRecord {
  awal?: number;
  tengah?: number;
  akhir?: number;
  rataRata?: number;
  catatan?: string;
}

export interface SumatifElementScore {
  kognitif?: number;
  sikap?: number;
  rt?: number;
}

export interface SumatifAssessmentRecord {
  alQuranHadis: SumatifElementScore;
  akidah: SumatifElementScore;
  akhlak: SumatifElementScore;
  fikih: SumatifElementScore;
  sejarahPeradabanIslam: SumatifElementScore;
  rtSumatif: number;
  sts?: number;
  sas?: number;
  jml: number;
  rataRata: number;
  predikat: 'A' | 'B' | 'C' | 'D';
}

export interface TeacherBehaviorLog {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  classGroup: string;
  incident: string;
  followUp: string;
  predicate: 'A' | 'B' | 'C' | 'D';
  notes?: string;
}

export interface StudentTpGradeRecord {
  studentId: string;
  studentName: string;
  nis?: string;
  nisn: string;
  classGroup?: string;
  rombel?: RombelName;
  gender: 'L' | 'P';
  tpId: string;
  tpText: string;
  element: PaibpElement | string;
  grade: GradeLevel;
  semester: Semester;
  kognitif: StudentCognitiveScore;
  afektif: StudentAffectiveScore;
  psikomotorik: StudentPsychomotorScore;
  nilaiAkhir: number;
  isTuntas: boolean;
  deskripsiCapaian: string;

  // Format Penilaian Baru (Backward-compatible extensions)
  formatifData?: FormatifAssessmentRecord;
  sumatifData?: SumatifAssessmentRecord;
}

export interface GradingConfiguration {
  kktp: number; // default 75
  weights: {
    kognitif: number;    // default 40%
    afektif: number;     // default 30%
    psikomotorik: number;// default 30%
  };
  cognitiveOptions: {
    tugas: boolean;
    diagnostik: boolean;
    formatif: boolean;
    sumatif: boolean;
  };
  affectiveOptions: {
    sikap: boolean;
    keaktifan: boolean;
    presensi_sholat: boolean;
    adab_etika: boolean;
  };
  psychomotorOptions: {
    praktik: boolean;
    unjuk_kerja: boolean;
    produk_proyek: boolean;
  };
}

// ==========================================
// CBT (COMPUTER BASED TEST) DIRECT EXAM TYPES
// ==========================================
export type TabSwitchAction = 'warn' | 'lock' | 'autosubmit';

export interface CbtExamConfig {
  token: string;
  requireToken: boolean;
  durationMinutes: number;
  minimumDurationMinutes: number; // Waktu minimal pengerjaan sebelum boleh submit
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showInstantScore: boolean;
  showReview: boolean;
  allowPrintCertificate: boolean;
  kktpTarget: number;
  examInstructions: string;
  // Pengaturan Buka Tab Lain (Anti-Curang)
  antiCheatWarning: boolean;
  detectTabSwitch: boolean;
  maxTabSwitchAllowed: number; // Batas toleransi buka tab (misal 1x, 2x, 3x)
  tabSwitchAction: TabSwitchAction; // 'warn' (peringatan), 'lock' (kunci layar), 'autosubmit' (kumpulkan otomatis)
  // Pemilihan Soal Berdasarkan Tema atau TP
  questionSelectionMode: 'all' | 'topic' | 'tp' | 'custom';
  selectedTopicFilter?: string;
  selectedTpFilter?: string;
  selectedQuestionIds?: number[];
  maxQuestionsLimit?: number;
}

export interface CbtStudentIdentity {
  nis: string;
  name: string;
  classGroup: string;
}

export interface CbtStudentResult {
  id: string;
  nis: string;
  studentName: string;
  classGroup: string;
  examTitle: string;
  grade: GradeLevel;
  semester: Semester;
  element: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  essayCount: number;
  answers: Record<number, string>;
  doubtfuls: number[];
  timeSpentSeconds: number;
  submittedAt: string;
  bloomAnalysis?: Record<string, { total: number; correct: number }>;
  elementAnalysis?: Record<string, { total: number; correct: number }>;
  tabSwitchViolations?: number;
  syncedToGradebook?: boolean;
}

export interface PublishedCbtExam {
  id: string;
  code: string;
  title: string;
  grade: GradeLevel;
  semester: Semester;
  element: string;
  tema?: string;
  schoolName: string;
  teacherName: string;
  durationMinutes: number;
  minimumDurationMinutes: number;
  token: string;
  requireToken: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showInstantScore: boolean;
  showReview: boolean;
  allowPrintCertificate: boolean;
  kktpTarget: number;
  instructions: string;
  antiCheatWarning: boolean;
  detectTabSwitch: boolean;
  maxTabSwitchAllowed: number;
  tabSwitchAction: TabSwitchAction;
  questions: QuestionItem[];
  publishedAt: string;
  submissionsCount?: number;
}

// ==========================================
// MULTI-USER, LICENSE & DEMO MODE TYPES
// ==========================================

export type UserRole = 'owner' | 'licensed' | 'demo';
export type UserStatus = 'active' | 'suspended' | 'expired';
export type LicensePackageType = 'individual' | 'institution' | 'period' | 'custom';
export type LicenseStatus = 'active' | 'inactive' | 'revoked' | 'expired';

export interface UserAccount {
  uid: string;
  email: string | null;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  schoolName?: string;
  licenseId?: string;
  licenseCode?: string;
  packageName?: string;
  packageType?: LicensePackageType;
  expiresAt?: string | null;
  createdAt: string;
  lastLoginAt: string;
  workspaceId: string;
}

export interface LicenseActivationEntry {
  userId: string;
  email: string;
  displayName: string;
  activatedAt: string;
}

export interface LicenseRecord {
  id: string;
  code: string;
  codeHash?: string;
  packageName: string;
  packageType: LicensePackageType;
  status: LicenseStatus;
  maxActivations: number;
  currentActivations: number;
  activations: LicenseActivationEntry[];
  durationDays: number; // 0 = Lifetime, e.g. 30, 90, 365
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
  internalNote: string;
}

export interface DemoSettings {
  demoEnabled: boolean;
  allowedFeatures: string[];
  maxQuestionsPerGeneration: number;
  maxGenerationsPerSession: number;
  dailyLimit: number;
  exportEnabled: boolean;
  persistenceEnabled: boolean;
  demoMessage: string;
  activateButtonText: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface DemoSession {
  sessionId: string;
  createdAt: string;
  usageCount: number;
  maxUsage: number;
  lastUsedAt: string;
  deviceInfo?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface SystemStats {
  totalUsers: number;
  activeLicenses: number;
  expiredLicenses: number;
  revokedLicenses: number;
  demoUsersCount: number;
  totalGenerations: number;
  activeToday: number;
}

