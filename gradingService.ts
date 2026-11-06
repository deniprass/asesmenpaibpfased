import {
  StudentInfo,
  StudentTpGradeRecord,
  GradingConfiguration,
  GradeLevel,
  Semester,
  PaibpElement,
  RombelName,
  FormatifAssessmentRecord,
  SumatifElementScore,
  SumatifAssessmentRecord,
  TeacherBehaviorLog
} from '../types';
import {
  saveGradeRecordsToDatabase,
  saveStudentsToDatabase,
  saveCbtResultToDatabase,
  deleteCbtResultFromDatabase
} from './firebaseDatabaseService';

export const DEFAULT_GRADING_CONFIG: GradingConfiguration = {
  kktp: 75,
  weights: {
    kognitif: 40,
    afektif: 30,
    psikomotorik: 30
  },
  cognitiveOptions: {
    tugas: true,
    diagnostik: true,
    formatif: true,
    sumatif: true
  },
  affectiveOptions: {
    sikap: true,
    keaktifan: true,
    presensi_sholat: true,
    adab_etika: true
  },
  psychomotorOptions: {
    praktik: true,
    unjuk_kerja: true,
    produk_proyek: true
  }
};

export const STUDENTS_BY_GRADE_AND_ROMBEL: Record<GradeLevel, Record<RombelName, StudentInfo[]>> = {
  VII: {
    A: [
      { id: 's-vii-a-01', name: 'Ahmad Fauzi Pratama', nis: '24101', nisn: '0091827361', gender: 'L', classGroup: 'VII-A' },
      { id: 's-vii-a-02', name: 'Aisyah Nur Ramadhani', nis: '24102', nisn: '0091827362', gender: 'P', classGroup: 'VII-A' },
      { id: 's-vii-a-03', name: 'Bilal Hafizh Robbani', nis: '24103', nisn: '0091827363', gender: 'L', classGroup: 'VII-A' },
      { id: 's-vii-a-04', name: 'Dina Khairunnisa', nis: '24104', nisn: '0091827364', gender: 'P', classGroup: 'VII-A' },
      { id: 's-vii-a-05', name: 'Fadhil Ihsan Maulana', nis: '24105', nisn: '0091827365', gender: 'L', classGroup: 'VII-A' },
      { id: 's-vii-a-06', name: 'Fatimah Zahra Wardani', nis: '24106', nisn: '0091827366', gender: 'P', classGroup: 'VII-A' },
      { id: 's-vii-a-07', name: 'Hafiz Al-Ghifari', nis: '24107', nisn: '0091827367', gender: 'L', classGroup: 'VII-A' },
      { id: 's-vii-a-08', name: 'Kayla Azzahra Putri', nis: '24108', nisn: '0091827368', gender: 'P', classGroup: 'VII-A' },
      { id: 's-vii-a-09', name: 'Muhammad Rayyan Akbar', nis: '24109', nisn: '0091827369', gender: 'L', classGroup: 'VII-A' },
      { id: 's-vii-a-10', name: 'Nabila Syakira Anwar', nis: '24110', nisn: '0091827370', gender: 'P', classGroup: 'VII-A' },
      { id: 's-vii-a-11', name: 'Rizky Dwi Kurniawan', nis: '24111', nisn: '0091827371', gender: 'L', classGroup: 'VII-A' },
      { id: 's-vii-a-12', name: 'Zahra Salma Maulida', nis: '24112', nisn: '0091827372', gender: 'P', classGroup: 'VII-A' }
    ],
    B: [
      { id: 's-vii-b-01', name: 'Abdullah Azzam Muttaqin', nis: '24201', nisn: '0092827401', gender: 'L', classGroup: 'VII-B' },
      { id: 's-vii-b-02', name: 'Adinda Lathifah Zahira', nis: '24202', nisn: '0092827402', gender: 'P', classGroup: 'VII-B' },
      { id: 's-vii-b-03', name: 'Arkan Danendra Hanif', nis: '24203', nisn: '0092827403', gender: 'L', classGroup: 'VII-B' },
      { id: 's-vii-b-04', name: 'Dzakiya Thafana Rahma', nis: '24204', nisn: '0092827404', gender: 'P', classGroup: 'VII-B' },
      { id: 's-vii-b-05', name: 'Faris Naufal Hidayat', nis: '24205', nisn: '0092827405', gender: 'L', classGroup: 'VII-B' },
      { id: 's-vii-b-06', name: 'Hanifah Syahidah Putri', nis: '24206', nisn: '0092827406', gender: 'P', classGroup: 'VII-B' },
      { id: 's-vii-b-07', name: 'Ibrahim Khalilurrahman', nis: '24207', nisn: '0092827407', gender: 'L', classGroup: 'VII-B' },
      { id: 's-vii-b-08', name: 'Khansa Naura Azalia', nis: '24208', nisn: '0092827408', gender: 'P', classGroup: 'VII-B' },
      { id: 's-vii-b-09', name: 'Muhammad Fathan Al-Farisi', nis: '24209', nisn: '0092827409', gender: 'L', classGroup: 'VII-B' },
      { id: 's-vii-b-10', name: 'Salwa Marwa Nadhira', nis: '24210', nisn: '0092827410', gender: 'P', classGroup: 'VII-B' },
      { id: 's-vii-b-11', name: 'Tegar Arya Bimasena', nis: '24211', nisn: '0092827411', gender: 'L', classGroup: 'VII-B' },
      { id: 's-vii-b-12', name: 'Yasmin Fairuz Khalila', nis: '24212', nisn: '0092827412', gender: 'P', classGroup: 'VII-B' }
    ],
    C: [
      { id: 's-vii-c-01', name: 'Alif Rahman Hakim', nis: '24301', nisn: '0093827501', gender: 'L', classGroup: 'VII-C' },
      { id: 's-vii-c-02', name: 'Annisa Fitriani Hasan', nis: '24302', nisn: '0093827502', gender: 'P', classGroup: 'VII-C' },
      { id: 's-vii-c-03', name: 'Farhan Dwi Wicaksono', nis: '24303', nisn: '0093827503', gender: 'L', classGroup: 'VII-C' },
      { id: 's-vii-c-04', name: 'Hilya Aulia Rahmah', nis: '24304', nisn: '0093827504', gender: 'P', classGroup: 'VII-C' },
      { id: 's-vii-c-05', name: 'Irfan Maulana Yusuf', nis: '24305', nisn: '0093827505', gender: 'L', classGroup: 'VII-C' },
      { id: 's-vii-c-06', name: 'Laila Munawwarah', nis: '24306', nisn: '0093827506', gender: 'P', classGroup: 'VII-C' },
      { id: 's-vii-c-07', name: 'Muhammad Zaidan Ilham', nis: '24307', nisn: '0093827507', gender: 'L', classGroup: 'VII-C' },
      { id: 's-vii-c-08', name: 'Nisrina Nurul Izzati', nis: '24308', nisn: '0093827508', gender: 'P', classGroup: 'VII-C' },
      { id: 's-vii-c-09', name: 'Rasyid Shidqi Habibi', nis: '24309', nisn: '0093827509', gender: 'L', classGroup: 'VII-C' },
      { id: 's-vii-c-10', name: 'Syifa Fauziyah Zahra', nis: '24310', nisn: '0093827510', gender: 'P', classGroup: 'VII-C' },
      { id: 's-vii-c-11', name: 'Zaki Mubarak Al-Habsyi', nis: '24311', nisn: '0093827511', gender: 'L', classGroup: 'VII-C' },
      { id: 's-vii-c-12', name: 'Zulfa Zakiyah Mumtazah', nis: '24312', nisn: '0093827512', gender: 'P', classGroup: 'VII-C' }
    ],
    D: [
      { id: 's-vii-d-01', name: 'Adam Malik Ibrahim', nis: '24401', nisn: '0094827601', gender: 'L', classGroup: 'VII-D' },
      { id: 's-vii-d-02', name: 'Balqis Al-Kautsar Putri', nis: '24402', nisn: '0094827602', gender: 'P', classGroup: 'VII-D' },
      { id: 's-vii-d-03', name: 'Dimas Aditya Saputra', nis: '24403', nisn: '0094827603', gender: 'L', classGroup: 'VII-D' },
      { id: 's-vii-d-04', name: 'Fitri Ramadhani Syarif', nis: '24404', nisn: '0094827604', gender: 'P', classGroup: 'VII-D' },
      { id: 's-vii-d-05', name: 'Gilang Ramadhan Pratama', nis: '24405', nisn: '0094827605', gender: 'L', classGroup: 'VII-D' },
      { id: 's-vii-d-06', name: 'Hasna Nur Azizah', nis: '24406', nisn: '0094827606', gender: 'P', classGroup: 'VII-D' },
      { id: 's-vii-d-07', name: 'Ihsan Kamil Muttaqin', nis: '24407', nisn: '0094827607', gender: 'L', classGroup: 'VII-D' },
      { id: 's-vii-d-08', name: 'Jihan Talita Zahra', nis: '24408', nisn: '0094827608', gender: 'P', classGroup: 'VII-D' },
      { id: 's-vii-d-09', name: 'Luqman Hakim An-Nawawi', nis: '24409', nisn: '0094827609', gender: 'L', classGroup: 'VII-D' },
      { id: 's-vii-d-10', name: 'Maryam Ulfa Shalihat', nis: '24410', nisn: '0094827610', gender: 'P', classGroup: 'VII-D' },
      { id: 's-vii-d-11', name: 'Naufal Raihan Al-Ghifari', nis: '24411', nisn: '0094827611', gender: 'L', classGroup: 'VII-D' },
      { id: 's-vii-d-12', name: 'Siti Nurhaliza Zahra', nis: '24412', nisn: '0094827612', gender: 'P', classGroup: 'VII-D' }
    ]
  },
  VIII: {
    A: [
      { id: 's-viii-a-01', name: 'Abdullah Azzam Muttaqin', nis: '23101', nisn: '0082736451', gender: 'L', classGroup: 'VIII-A' },
      { id: 's-viii-a-02', name: 'Adinda Lathifah Zahira', nis: '23102', nisn: '0082736452', gender: 'P', classGroup: 'VIII-A' },
      { id: 's-viii-a-03', name: 'Arkan Danendra Hanif', nis: '23103', nisn: '0082736453', gender: 'L', classGroup: 'VIII-A' },
      { id: 's-viii-a-04', name: 'Dzakiya Thafana Rahma', nis: '23104', nisn: '0082736454', gender: 'P', classGroup: 'VIII-A' },
      { id: 's-viii-a-05', name: 'Faris Naufal Hidayat', nis: '23105', nisn: '0082736455', gender: 'L', classGroup: 'VIII-A' },
      { id: 's-viii-a-06', name: 'Hanifah Syahidah Putri', nis: '23106', nisn: '0082736456', gender: 'P', classGroup: 'VIII-A' },
      { id: 's-viii-a-07', name: 'Ibrahim Khalilurrahman', nis: '23107', nisn: '0082736457', gender: 'L', classGroup: 'VIII-A' },
      { id: 's-viii-a-08', name: 'Khansa Naura Azalia', nis: '23108', nisn: '0082736458', gender: 'P', classGroup: 'VIII-A' },
      { id: 's-viii-a-09', name: 'Muhammad Fathan Al-Farisi', nis: '23109', nisn: '0082736459', gender: 'L', classGroup: 'VIII-A' },
      { id: 's-viii-a-10', name: 'Salwa Marwa Nadhira', nis: '23110', nisn: '0082736460', gender: 'P', classGroup: 'VIII-A' },
      { id: 's-viii-a-11', name: 'Tegar Arya Bimasena', nis: '23111', nisn: '0082736461', gender: 'L', classGroup: 'VIII-A' },
      { id: 's-viii-a-12', name: 'Yasmin Fairuz Khalila', nis: '23112', nisn: '0082736462', gender: 'P', classGroup: 'VIII-A' }
    ],
    B: [
      { id: 's-viii-b-01', name: 'Ahmad Fauzi Pratama', nis: '23201', nisn: '0082827401', gender: 'L', classGroup: 'VIII-B' },
      { id: 's-viii-b-02', name: 'Aisyah Nur Ramadhani', nis: '23202', nisn: '0082827402', gender: 'P', classGroup: 'VIII-B' },
      { id: 's-viii-b-03', name: 'Bilal Hafizh Robbani', nis: '23203', nisn: '0082827403', gender: 'L', classGroup: 'VIII-B' },
      { id: 's-viii-b-04', name: 'Dina Khairunnisa', nis: '23204', nisn: '0082827404', gender: 'P', classGroup: 'VIII-B' },
      { id: 's-viii-b-05', name: 'Fadhil Ihsan Maulana', nis: '23205', nisn: '0082827405', gender: 'L', classGroup: 'VIII-B' },
      { id: 's-viii-b-06', name: 'Fatimah Zahra Wardani', nis: '23206', nisn: '0082827406', gender: 'P', classGroup: 'VIII-B' },
      { id: 's-viii-b-07', name: 'Hafiz Al-Ghifari', nis: '23207', nisn: '0082827407', gender: 'L', classGroup: 'VIII-B' },
      { id: 's-viii-b-08', name: 'Kayla Azzahra Putri', nis: '23208', nisn: '0082827408', gender: 'P', classGroup: 'VIII-B' },
      { id: 's-viii-b-09', name: 'Muhammad Rayyan Akbar', nis: '23209', nisn: '0082827409', gender: 'L', classGroup: 'VIII-B' },
      { id: 's-viii-b-10', name: 'Nabila Syakira Anwar', nis: '23210', nisn: '0082827410', gender: 'P', classGroup: 'VIII-B' },
      { id: 's-viii-b-11', name: 'Rizky Dwi Kurniawan', nis: '23211', nisn: '0082827411', gender: 'L', classGroup: 'VIII-B' },
      { id: 's-viii-b-12', name: 'Zahra Salma Maulida', nis: '23212', nisn: '0082827412', gender: 'P', classGroup: 'VIII-B' }
    ],
    C: [
      { id: 's-viii-c-01', name: 'Alif Rahman Hakim', nis: '23301', nisn: '0083827501', gender: 'L', classGroup: 'VIII-C' },
      { id: 's-viii-c-02', name: 'Annisa Fitriani Hasan', nis: '23302', nisn: '0083827502', gender: 'P', classGroup: 'VIII-C' },
      { id: 's-viii-c-03', name: 'Farhan Dwi Wicaksono', nis: '23303', nisn: '0083827503', gender: 'L', classGroup: 'VIII-C' },
      { id: 's-viii-c-04', name: 'Hilya Aulia Rahmah', nis: '23304', nisn: '0083827504', gender: 'P', classGroup: 'VIII-C' },
      { id: 's-viii-c-05', name: 'Irfan Maulana Yusuf', nis: '23305', nisn: '0083827505', gender: 'L', classGroup: 'VIII-C' },
      { id: 's-viii-c-06', name: 'Laila Munawwarah', nis: '23306', nisn: '0083827506', gender: 'P', classGroup: 'VIII-C' },
      { id: 's-viii-c-07', name: 'Muhammad Zaidan Ilham', nis: '23307', nisn: '0083827507', gender: 'L', classGroup: 'VIII-C' },
      { id: 's-viii-c-08', name: 'Nisrina Nurul Izzati', nis: '23308', nisn: '0083827508', gender: 'P', classGroup: 'VIII-C' },
      { id: 's-viii-c-09', name: 'Rasyid Shidqi Habibi', nis: '23309', nisn: '0083827509', gender: 'L', classGroup: 'VIII-C' },
      { id: 's-viii-c-10', name: 'Syifa Fauziyah Zahra', nis: '23310', nisn: '0083827510', gender: 'P', classGroup: 'VIII-C' },
      { id: 's-viii-c-11', name: 'Zaki Mubarak Al-Habsyi', nis: '23311', nisn: '0083827511', gender: 'L', classGroup: 'VIII-C' },
      { id: 's-viii-c-12', name: 'Zulfa Zakiyah Mumtazah', nis: '23312', nisn: '0083827512', gender: 'P', classGroup: 'VIII-C' }
    ],
    D: [
      { id: 's-viii-d-01', name: 'Adam Malik Ibrahim', nis: '23401', nisn: '0084827601', gender: 'L', classGroup: 'VIII-D' },
      { id: 's-viii-d-02', name: 'Balqis Al-Kautsar Putri', nis: '23402', nisn: '0084827602', gender: 'P', classGroup: 'VIII-D' },
      { id: 's-viii-d-03', name: 'Dimas Aditya Saputra', nis: '23403', nisn: '0084827603', gender: 'L', classGroup: 'VIII-D' },
      { id: 's-viii-d-04', name: 'Fitri Ramadhani Syarif', nis: '23404', nisn: '0084827604', gender: 'P', classGroup: 'VIII-D' },
      { id: 's-viii-d-05', name: 'Gilang Ramadhan Pratama', nis: '23405', nisn: '0084827605', gender: 'L', classGroup: 'VIII-D' },
      { id: 's-viii-d-06', name: 'Hasna Nur Azizah', nis: '23406', nisn: '0084827606', gender: 'P', classGroup: 'VIII-D' },
      { id: 's-viii-d-07', name: 'Ihsan Kamil Muttaqin', nis: '23407', nisn: '0084827607', gender: 'L', classGroup: 'VIII-D' },
      { id: 's-viii-d-08', name: 'Jihan Talita Zahra', nis: '23408', nisn: '0084827608', gender: 'P', classGroup: 'VIII-D' },
      { id: 's-viii-d-09', name: 'Luqman Hakim An-Nawawi', nis: '23409', nisn: '0084827609', gender: 'L', classGroup: 'VIII-D' },
      { id: 's-viii-d-10', name: 'Maryam Ulfa Shalihat', nis: '23410', nisn: '0084827610', gender: 'P', classGroup: 'VIII-D' },
      { id: 's-viii-d-11', name: 'Naufal Raihan Al-Ghifari', nis: '23411', nisn: '0084827611', gender: 'L', classGroup: 'VIII-D' },
      { id: 's-viii-d-12', name: 'Siti Nurhaliza Zahra', nis: '23412', nisn: '0084827612', gender: 'P', classGroup: 'VIII-D' }
    ]
  },
  IX: {
    A: [
      { id: 's-ix-a-01', name: 'Alif Rahman Hakim', nis: '22101', nisn: '0073645181', gender: 'L', classGroup: 'IX-A' },
      { id: 's-ix-a-02', name: 'Annisa Fitriani Hasan', nis: '22102', nisn: '0073645182', gender: 'P', classGroup: 'IX-A' },
      { id: 's-ix-a-03', name: 'Farhan Dwi Wicaksono', nis: '22103', nisn: '0073645183', gender: 'L', classGroup: 'IX-A' },
      { id: 's-ix-a-04', name: 'Hilya Aulia Rahmah', nis: '22104', nisn: '0073645184', gender: 'P', classGroup: 'IX-A' },
      { id: 's-ix-a-05', name: 'Irfan Maulana Yusuf', nis: '22105', nisn: '0073645185', gender: 'L', classGroup: 'IX-A' },
      { id: 's-ix-a-06', name: 'Laila Munawwarah', nis: '22106', nisn: '0073645186', gender: 'P', classGroup: 'IX-A' },
      { id: 's-ix-a-07', name: 'Muhammad Zaidan Ilham', nis: '22107', nisn: '0073645187', gender: 'L', classGroup: 'IX-A' },
      { id: 's-ix-a-08', name: 'Nisrina Nurul Izzati', nis: '22108', nisn: '0073645188', gender: 'P', classGroup: 'IX-A' },
      { id: 's-ix-a-09', name: 'Rasyid Shidqi Habibi', nis: '22109', nisn: '0073645189', gender: 'L', classGroup: 'IX-A' },
      { id: 's-ix-a-10', name: 'Syifa Fauziyah Zahra', nis: '22110', nisn: '0073645190', gender: 'P', classGroup: 'IX-A' },
      { id: 's-ix-a-11', name: 'Zaki Mubarak Al-Habsyi', nis: '22111', nisn: '0073645191', gender: 'L', classGroup: 'IX-A' },
      { id: 's-ix-a-12', name: 'Zulfa Zakiyah Mumtazah', nis: '22112', nisn: '0073645192', gender: 'P', classGroup: 'IX-A' }
    ],
    B: [
      { id: 's-ix-b-01', name: 'Abdullah Azzam Muttaqin', nis: '22201', nisn: '0072827401', gender: 'L', classGroup: 'IX-B' },
      { id: 's-ix-b-02', name: 'Adinda Lathifah Zahira', nis: '22202', nisn: '0072827402', gender: 'P', classGroup: 'IX-B' },
      { id: 's-ix-b-03', name: 'Arkan Danendra Hanif', nis: '22203', nisn: '0072827403', gender: 'L', classGroup: 'IX-B' },
      { id: 's-ix-b-04', name: 'Dzakiya Thafana Rahma', nis: '22204', nisn: '0072827404', gender: 'P', classGroup: 'IX-B' },
      { id: 's-ix-b-05', name: 'Faris Naufal Hidayat', nis: '22205', nisn: '0072827405', gender: 'L', classGroup: 'IX-B' },
      { id: 's-ix-b-06', name: 'Hanifah Syahidah Putri', nis: '22206', nisn: '0072827406', gender: 'P', classGroup: 'IX-B' },
      { id: 's-ix-b-07', name: 'Ibrahim Khalilurrahman', nis: '22207', nisn: '0072827407', gender: 'L', classGroup: 'IX-B' },
      { id: 's-ix-b-08', name: 'Khansa Naura Azalia', nis: '22208', nisn: '0072827408', gender: 'P', classGroup: 'IX-B' },
      { id: 's-ix-b-09', name: 'Muhammad Fathan Al-Farisi', nis: '22209', nisn: '0072827409', gender: 'L', classGroup: 'IX-B' },
      { id: 's-ix-b-10', name: 'Salwa Marwa Nadhira', nis: '22210', nisn: '0072827410', gender: 'P', classGroup: 'IX-B' },
      { id: 's-ix-b-11', name: 'Tegar Arya Bimasena', nis: '22211', nisn: '0072827411', gender: 'L', classGroup: 'IX-B' },
      { id: 's-ix-b-12', name: 'Yasmin Fairuz Khalila', nis: '22212', nisn: '0072827412', gender: 'P', classGroup: 'IX-B' }
    ],
    C: [
      { id: 's-ix-c-01', name: 'Ahmad Fauzi Pratama', nis: '22301', nisn: '0071827361', gender: 'L', classGroup: 'IX-C' },
      { id: 's-ix-c-02', name: 'Aisyah Nur Ramadhani', nis: '22302', nisn: '0071827362', gender: 'P', classGroup: 'IX-C' },
      { id: 's-ix-c-03', name: 'Bilal Hafizh Robbani', nis: '22303', nisn: '0071827363', gender: 'L', classGroup: 'IX-C' },
      { id: 's-ix-c-04', name: 'Dina Khairunnisa', nis: '22304', nisn: '0071827364', gender: 'P', classGroup: 'IX-C' },
      { id: 's-ix-c-05', name: 'Fadhil Ihsan Maulana', nis: '22305', nisn: '0071827365', gender: 'L', classGroup: 'IX-C' },
      { id: 's-ix-c-06', name: 'Fatimah Zahra Wardani', nis: '22306', nisn: '0071827366', gender: 'P', classGroup: 'IX-C' },
      { id: 's-ix-c-07', name: 'Hafiz Al-Ghifari', nis: '22307', nisn: '0071827367', gender: 'L', classGroup: 'IX-C' },
      { id: 's-ix-c-08', name: 'Kayla Azzahra Putri', nis: '22308', nisn: '0071827368', gender: 'P', classGroup: 'IX-C' },
      { id: 's-ix-c-09', name: 'Muhammad Rayyan Akbar', nis: '22309', nisn: '0071827369', gender: 'L', classGroup: 'IX-C' },
      { id: 's-ix-c-10', name: 'Nabila Syakira Anwar', nis: '22310', nisn: '0071827370', gender: 'P', classGroup: 'IX-C' },
      { id: 's-ix-c-11', name: 'Rizky Dwi Kurniawan', nis: '22311', nisn: '0071827371', gender: 'L', classGroup: 'IX-C' },
      { id: 's-ix-c-12', name: 'Zahra Salma Maulida', nis: '22312', nisn: '0071827372', gender: 'P', classGroup: 'IX-C' }
    ],
    D: [
      { id: 's-ix-d-01', name: 'Adam Malik Ibrahim', nis: '22401', nisn: '0074827601', gender: 'L', classGroup: 'IX-D' },
      { id: 's-ix-d-02', name: 'Balqis Al-Kautsar Putri', nis: '22402', nisn: '0074827602', gender: 'P', classGroup: 'IX-D' },
      { id: 's-ix-d-03', name: 'Dimas Aditya Saputra', nis: '22403', nisn: '0074827603', gender: 'L', classGroup: 'IX-D' },
      { id: 's-ix-d-04', name: 'Fitri Ramadhani Syarif', nis: '22404', nisn: '0074827604', gender: 'P', classGroup: 'IX-D' },
      { id: 's-ix-d-05', name: 'Gilang Ramadhan Pratama', nis: '22405', nisn: '0074827605', gender: 'L', classGroup: 'IX-D' },
      { id: 's-ix-d-06', name: 'Hasna Nur Azizah', nis: '22406', nisn: '0074827606', gender: 'P', classGroup: 'IX-D' },
      { id: 's-ix-d-07', name: 'Ihsan Kamil Muttaqin', nis: '22407', nisn: '0074827607', gender: 'L', classGroup: 'IX-D' },
      { id: 's-ix-d-08', name: 'Jihan Talita Zahra', nis: '22408', nisn: '0074827608', gender: 'P', classGroup: 'IX-D' },
      { id: 's-ix-d-09', name: 'Luqman Hakim An-Nawawi', nis: '22409', nisn: '0074827609', gender: 'L', classGroup: 'IX-D' },
      { id: 's-ix-d-10', name: 'Maryam Ulfa Shalihat', nis: '22410', nisn: '0074827610', gender: 'P', classGroup: 'IX-D' },
      { id: 's-ix-d-11', name: 'Naufal Raihan Al-Ghifari', nis: '22411', nisn: '0074827611', gender: 'L', classGroup: 'IX-D' },
      { id: 's-ix-d-12', name: 'Siti Nurhaliza Zahra', nis: '22412', nisn: '0074827612', gender: 'P', classGroup: 'IX-D' }
    ]
  }
};

export const INITIAL_STUDENTS_BY_GRADE: Record<GradeLevel, StudentInfo[]> = {
  VII: STUDENTS_BY_GRADE_AND_ROMBEL.VII.A,
  VIII: STUDENTS_BY_GRADE_AND_ROMBEL.VIII.A,
  IX: STUDENTS_BY_GRADE_AND_ROMBEL.IX.A
};

export function getRosterForGradeAndRombel(grade: GradeLevel, rombel: RombelName = 'A'): StudentInfo[] {
  return STUDENTS_BY_GRADE_AND_ROMBEL[grade]?.[rombel] || STUDENTS_BY_GRADE_AND_ROMBEL.VII.A;
}

// ============================================================================
// FORMAT PENILAIAN BARU: FORMATIF, SUMATIF 5 ELEMEN, DAN PREDIKAT
// ============================================================================

export const PREDICATE_THRESHOLDS = {
  A: 90,
  B: 80,
  C: 70
};

/**
 * A. Format Nilai Formatif
 * Rata-rata = rata-rata nilai Awal, Tengah, Akhir yang terisi (1 desimal).
 */
export function calculateFormatifAverage(awal?: number, tengah?: number, akhir?: number): number {
  const values: number[] = [];
  if (awal !== undefined && !isNaN(awal) && awal !== null) values.push(Number(awal));
  if (tengah !== undefined && !isNaN(tengah) && tengah !== null) values.push(Number(tengah));
  if (akhir !== undefined && !isNaN(akhir) && akhir !== null) values.push(Number(akhir));

  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/**
 * B. Format Nilai Sumatif
 * - Rt elemen = (Kognitif + Sikap) / 2
 * - Rt Sumatif = rata-rata kelima Rt elemen yang terisi
 * - Jml = Rt Sumatif + STS + SAS (komponen kosong dilewati)
 * - Rata-rata = rata-rata Rt Sumatif, STS, SAS yang terisi
 * - Predikat: A >= 90, B >= 80, C >= 70, selain itu D
 */
export function calculateElementAverage(kognitif?: number, sikap?: number): number | undefined {
  const vals: number[] = [];
  if (kognitif !== undefined && !isNaN(kognitif) && kognitif !== null) vals.push(Number(kognitif));
  if (sikap !== undefined && !isNaN(sikap) && sikap !== null) vals.push(Number(sikap));
  if (vals.length === 0) return undefined;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

export function calculateSumatifRecord(
  elements: {
    alQuranHadis: SumatifElementScore;
    akidah: SumatifElementScore;
    akhlak: SumatifElementScore;
    fikih: SumatifElementScore;
    sejarahPeradabanIslam: SumatifElementScore;
  },
  sts?: number,
  sas?: number,
  thresholds = PREDICATE_THRESHOLDS
): SumatifAssessmentRecord {
  const alQuranRt = calculateElementAverage(elements.alQuranHadis.kognitif, elements.alQuranHadis.sikap);
  const akidahRt = calculateElementAverage(elements.akidah.kognitif, elements.akidah.sikap);
  const akhlakRt = calculateElementAverage(elements.akhlak.kognitif, elements.akhlak.sikap);
  const fikihRt = calculateElementAverage(elements.fikih.kognitif, elements.fikih.sikap);
  const spiRt = calculateElementAverage(elements.sejarahPeradabanIslam.kognitif, elements.sejarahPeradabanIslam.sikap);

  const filledElemRts: number[] = [];
  if (alQuranRt !== undefined) filledElemRts.push(alQuranRt);
  if (akidahRt !== undefined) filledElemRts.push(akidahRt);
  if (akhlakRt !== undefined) filledElemRts.push(akhlakRt);
  if (fikihRt !== undefined) filledElemRts.push(fikihRt);
  if (spiRt !== undefined) filledElemRts.push(spiRt);

  const rtSumatif = filledElemRts.length > 0
    ? Math.round((filledElemRts.reduce((a, b) => a + b, 0) / filledElemRts.length) * 10) / 10
    : 0;

  // Jml = Rt Sumatif + STS + SAS (komponen kosong dilewati)
  let sumComps = 0;
  const avgComponents: number[] = [];

  if (filledElemRts.length > 0) {
    sumComps += rtSumatif;
    avgComponents.push(rtSumatif);
  }
  if (sts !== undefined && !isNaN(sts) && sts !== null) {
    sumComps += Number(sts);
    avgComponents.push(Number(sts));
  }
  if (sas !== undefined && !isNaN(sas) && sas !== null) {
    sumComps += Number(sas);
    avgComponents.push(Number(sas));
  }

  const jml = Math.round(sumComps * 10) / 10;
  const rataRata = avgComponents.length > 0
    ? Math.round((avgComponents.reduce((a, b) => a + b, 0) / avgComponents.length) * 10) / 10
    : 0;

  let predikat: 'A' | 'B' | 'C' | 'D' = 'D';
  if (rataRata >= thresholds.A) predikat = 'A';
  else if (rataRata >= thresholds.B) predikat = 'B';
  else if (rataRata >= thresholds.C) predikat = 'C';
  else predikat = 'D';

  return {
    alQuranHadis: { ...elements.alQuranHadis, rt: alQuranRt },
    akidah: { ...elements.akidah, rt: akidahRt },
    akhlak: { ...elements.akhlak, rt: akhlakRt },
    fikih: { ...elements.fikih, rt: fikihRt },
    sejarahPeradabanIslam: { ...elements.sejarahPeradabanIslam, rt: spiRt },
    rtSumatif,
    sts,
    sas,
    jml,
    rataRata,
    predikat
  };
}

// ============================================================================
// PERHITUNGAN NILAI PER DOMAIN & NILAI AKHIR TP
// ============================================================================

export function calculateCognitiveAverage(
  scores: { tugas?: number; diagnostik?: number; formatif?: number; sumatif?: number },
  config: GradingConfiguration
): number {
  const activeValues: number[] = [];
  if (config.cognitiveOptions.tugas && scores.tugas !== undefined && !isNaN(scores.tugas)) {
    activeValues.push(scores.tugas);
  }
  if (config.cognitiveOptions.diagnostik && scores.diagnostik !== undefined && !isNaN(scores.diagnostik)) {
    activeValues.push(scores.diagnostik);
  }
  if (config.cognitiveOptions.formatif && scores.formatif !== undefined && !isNaN(scores.formatif)) {
    activeValues.push(scores.formatif);
  }
  if (config.cognitiveOptions.sumatif && scores.sumatif !== undefined && !isNaN(scores.sumatif)) {
    activeValues.push(scores.sumatif);
  }

  if (activeValues.length === 0) return 0;
  const sum = activeValues.reduce((a, b) => a + b, 0);
  return Math.round((sum / activeValues.length) * 10) / 10;
}

export function calculateAffectiveAverage(
  scores: { sikap?: number; keaktifan?: number; presensiSholat?: number; adabEtika?: number },
  config: GradingConfiguration
): { average: number; predikat: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan' } {
  const activeValues: number[] = [];
  if (config.affectiveOptions.sikap && scores.sikap !== undefined && !isNaN(scores.sikap)) {
    activeValues.push(scores.sikap);
  }
  if (config.affectiveOptions.keaktifan && scores.keaktifan !== undefined && !isNaN(scores.keaktifan)) {
    activeValues.push(scores.keaktifan);
  }
  if (config.affectiveOptions.presensi_sholat && scores.presensiSholat !== undefined && !isNaN(scores.presensiSholat)) {
    activeValues.push(scores.presensiSholat);
  }
  if (config.affectiveOptions.adab_etika && scores.adabEtika !== undefined && !isNaN(scores.adabEtika)) {
    activeValues.push(scores.adabEtika);
  }

  if (activeValues.length === 0) {
    return { average: 0, predikat: 'Cukup' };
  }

  const sum = activeValues.reduce((a, b) => a + b, 0);
  const average = Math.round((sum / activeValues.length) * 10) / 10;

  let predikat: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan' = 'Cukup';
  if (average >= 88) predikat = 'Sangat Baik';
  else if (average >= 78) predikat = 'Baik';
  else if (average >= 65) predikat = 'Cukup';
  else predikat = 'Perlu Bimbingan';

  return { average, predikat };
}

export function calculatePsychomotorAverage(
  scores: { praktik?: number; unjukKerja?: number; produkProyek?: number },
  config: GradingConfiguration
): { average: number; predikat: 'Sangat Mahir' | 'Mahir' | 'Cukup' | 'Perlu Bimbingan' } {
  const activeValues: number[] = [];
  if (config.psychomotorOptions.praktik && scores.praktik !== undefined && !isNaN(scores.praktik)) {
    activeValues.push(scores.praktik);
  }
  if (config.psychomotorOptions.unjuk_kerja && scores.unjukKerja !== undefined && !isNaN(scores.unjukKerja)) {
    activeValues.push(scores.unjukKerja);
  }
  if (config.psychomotorOptions.produk_proyek && scores.produkProyek !== undefined && !isNaN(scores.produkProyek)) {
    activeValues.push(scores.produkProyek);
  }

  if (activeValues.length === 0) {
    return { average: 0, predikat: 'Cukup' };
  }

  const sum = activeValues.reduce((a, b) => a + b, 0);
  const average = Math.round((sum / activeValues.length) * 10) / 10;

  let predikat: 'Sangat Mahir' | 'Mahir' | 'Cukup' | 'Perlu Bimbingan' = 'Cukup';
  if (average >= 88) predikat = 'Sangat Mahir';
  else if (average >= 78) predikat = 'Mahir';
  else if (average >= 65) predikat = 'Cukup';
  else predikat = 'Perlu Bimbingan';

  return { average, predikat };
}

export function calculateFinalTpScore(
  cogAvg: number,
  affAvg: number,
  psyAvg: number,
  config: GradingConfiguration
): { finalScore: number; isTuntas: boolean } {
  const w = config.weights;
  const totalWeight = w.kognitif + w.afektif + w.psikomotorik;

  const weightedSum =
    cogAvg * (w.kognitif / totalWeight) +
    affAvg * (w.afektif / totalWeight) +
    psyAvg * (w.psikomotorik / totalWeight);

  const finalScore = Math.round(weightedSum * 10) / 10;
  const isTuntas = finalScore >= config.kktp;

  return { finalScore, isTuntas };
}

// Generate Narasi Rapor Kurikulum Merdeka (Deskripsi Capaian Kompetensi TP)
export function generateRaportDescription(
  name: string,
  tpText: string,
  element: PaibpElement | string,
  cogAvg: number,
  affPredikat: string,
  psyPredikat: string,
  isTuntas: boolean
): string {
  const firstName = name.split(' ')[0] || name;

  if (isTuntas) {
    let cogPhrase = 'sangat baik dalam memahami dan menganalisis';
    if (cogAvg < 85) cogPhrase = 'baik dalam menelaah dan menguasai';

    let affPhrase = 'menunjukkan akhlak mulia, istiqomah dalam presensi ibadah sholat 5 waktu, serta aktif berpartisipasi';
    if (affPredikat === 'Baik') affPhrase = 'memiliki sikap santun, tertib dalam presensi ibadah harian, dan responsif dalam pembelajaran';

    let psyPhrase = 'serta sangat terampil mempraktikkan unjuk kerja syariat';
    if (psyPredikat === 'Mahir') psyPhrase = 'serta terampil dalam unjuk kerja dan demonstrasi praktik';

    return `Ananda ${firstName} menunjukkan penguasaan ${cogPhrase} ${tpText}. Dalam keseharian ${affPhrase}, ${psyPhrase} pada elemen ${element}.`;
  } else {
    return `Ananda ${firstName} cukup dalam mengikuti pembelajaran ${tpText}, namun masih memerlukan pendampingan dan pembiasaan lebih lanjut pada ketuntasan pemahaman materi, kedisiplinan presensi sholat harian, dan ketelitian praktik ibadah elemen ${element}.`;
  }
}

// Recalculate complete student record
export function recalculateStudentRecord(
  record: StudentTpGradeRecord,
  config: GradingConfiguration
): StudentTpGradeRecord {
  const cogAvg = calculateCognitiveAverage(record.kognitif, config);
  const aff = calculateAffectiveAverage(record.afektif, config);
  const psy = calculatePsychomotorAverage(record.psikomotorik, config);
  const { finalScore, isTuntas } = calculateFinalTpScore(cogAvg, aff.average, psy.average, config);

  const deskripsi = generateRaportDescription(
    record.studentName,
    record.tpText,
    record.element,
    cogAvg,
    aff.predikat,
    psy.predikat,
    isTuntas
  );

  const formatifData: FormatifAssessmentRecord = record.formatifData
    ? {
        ...record.formatifData,
        rataRata: calculateFormatifAverage(
          record.formatifData.awal,
          record.formatifData.tengah,
          record.formatifData.akhir
        )
      }
    : {
        awal: record.kognitif?.diagnostik || 78,
        tengah: record.kognitif?.formatif || 82,
        akhir: record.kognitif?.sumatif || 85,
        rataRata: calculateFormatifAverage(
          record.kognitif?.diagnostik || 78,
          record.kognitif?.formatif || 82,
          record.kognitif?.sumatif || 85
        ),
        catatan: 'Pemahaman konsep dasar dan keterlibatan diskusi baik.'
      };

  const sumatifData: SumatifAssessmentRecord = record.sumatifData
    ? calculateSumatifRecord(
        {
          alQuranHadis: record.sumatifData.alQuranHadis || { kognitif: 82, sikap: 85 },
          akidah: record.sumatifData.akidah || { kognitif: 80, sikap: 84 },
          akhlak: record.sumatifData.akhlak || { kognitif: 85, sikap: 88 },
          fikih: record.sumatifData.fikih || { kognitif: 82, sikap: 84 },
          sejarahPeradabanIslam: record.sumatifData.sejarahPeradabanIslam || { kognitif: 80, sikap: 82 }
        },
        record.sumatifData.sts,
        record.sumatifData.sas
      )
    : calculateSumatifRecord(
        {
          alQuranHadis: { kognitif: Math.min(100, (record.kognitif?.tugas || 80) + 2), sikap: record.afektif?.sikap || 85 },
          akidah: { kognitif: record.kognitif?.formatif || 82, sikap: record.afektif?.keaktifan || 84 },
          akhlak: { kognitif: Math.min(100, (record.kognitif?.sumatif || 80) + 3), sikap: record.afektif?.adabEtika || 88 },
          fikih: { kognitif: record.psikomotorik?.praktik || 82, sikap: record.afektif?.presensiSholat || 85 },
          sejarahPeradabanIslam: { kognitif: record.psikomotorik?.unjukKerja || 80, sikap: record.afektif?.sikap || 84 }
        },
        record.kognitif?.sumatif || 82,
        Math.min(100, (record.kognitif?.sumatif || 80) + 4)
      );

  return {
    ...record,
    kognitif: {
      ...record.kognitif,
      rataRata: cogAvg
    },
    afektif: {
      ...record.afektif,
      rataRata: aff.average,
      predikat: aff.predikat
    },
    psikomotorik: {
      ...record.psikomotorik,
      rataRata: psy.average,
      predikat: psy.predikat
    },
    nilaiAkhir: finalScore,
    isTuntas,
    deskripsiCapaian: deskripsi,
    formatifData,
    sumatifData
  };
}

// ============================================================================
// CATATAN SIKAP / JURNAL SIKAP GURU
// ============================================================================

export const INITIAL_BEHAVIOR_LOGS: TeacherBehaviorLog[] = [
  {
    id: 'log-01',
    date: '30/10/2026',
    studentId: 's-vii-a-01',
    studentName: 'Ahmad Fauzi Pratama',
    classGroup: 'VII-A',
    incident: 'Membuang sampah pada tempatnya dan tertib sholat dhuha',
    followUp: 'Diapresiasi dan dijadikan teladan kelas',
    predicate: 'A',
    notes: 'Karakter peduli lingkungan & religius'
  },
  {
    id: 'log-02',
    date: '29/10/2026',
    studentId: 's-vii-a-02',
    studentName: 'Aisyah Nur Ramadhani',
    classGroup: 'VII-A',
    incident: 'Tepat waktu memimpin tadarus Al-Qur\'an sebelum KBM dimulai',
    followUp: 'Diberikan apresiasi dan motivasi istiqomah',
    predicate: 'A',
    notes: 'Kedisiplinan ibadah yaumiyah'
  },
  {
    id: 'log-03',
    date: '28/10/2026',
    studentId: 's-vii-a-03',
    studentName: 'Bilal Hafizh Robbani',
    classGroup: 'VII-A',
    incident: 'Membantu teman sebangku melafalkan tajwid hukum nun mati',
    followUp: 'Ditunjuk sebagai tutor sebaya halaqoh Al-Qur\'an',
    predicate: 'A',
    notes: 'Kerjasama & kepedulian sosial'
  }
];

const BEHAVIOR_LOGS_STORAGE_KEY = 'paibp_teacher_behavior_logs_v1';

export function loadBehaviorLogsFromStorage(): TeacherBehaviorLog[] {
  try {
    const raw = localStorage.getItem(BEHAVIOR_LOGS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_BEHAVIOR_LOGS;
}

export function saveBehaviorLogsToStorage(logs: TeacherBehaviorLog[]): void {
  try {
    localStorage.setItem(BEHAVIOR_LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.warn('Gagal menyimpan catatan sikap:', e);
  }
}

// Generate realistic baseline scores for an entire class roster
export function generateInitialScoresForRoster(
  students: StudentInfo[],
  tpId: string,
  tpText: string,
  element: PaibpElement | string,
  grade: GradeLevel,
  semester: Semester,
  config: GradingConfiguration,
  rombel: RombelName = 'A'
): StudentTpGradeRecord[] {
  // Deterministic seed for consistency
  return students.map((s, idx) => {
    // Detect rombel from classGroup if available (e.g. VII-B -> B)
    let assignedRombel: RombelName = rombel;
    if (s.classGroup) {
      const match = s.classGroup.match(/[-_\s]([A-Da-d])($|\b)/);
      if (match) assignedRombel = match[1].toUpperCase() as RombelName;
    }

    // Generate realistic grades between 72 and 96
    const baseVariance = (idx * 7) % 19; // 0 to 18
    const base = 78 + (baseVariance - 5); // 73 to 91

    const tugas = Math.min(100, Math.max(68, base + ((idx * 3) % 10) - 2));
    const diagnostik = Math.min(100, Math.max(65, base - 4 + ((idx * 5) % 8)));
    const formatif = Math.min(100, Math.max(70, base + ((idx * 2) % 11) - 3));
    const sumatif = Math.min(100, Math.max(68, base + ((idx * 4) % 12) - 4));

    const sikap = Math.min(100, Math.max(75, 82 + ((idx * 3) % 15)));
    const keaktifan = Math.min(100, Math.max(70, 80 + ((idx * 4) % 17) - 3));
    const presensiSholat = Math.min(100, Math.max(80, 85 + ((idx * 2) % 14)));
    const adabEtika = Math.min(100, Math.max(78, 84 + ((idx * 5) % 13)));

    const praktik = Math.min(100, Math.max(70, base + ((idx * 3) % 12) - 1));
    const unjukKerja = Math.min(100, Math.max(72, base + ((idx * 2) % 10)));
    const produkProyek = Math.min(100, Math.max(74, base + ((idx * 4) % 11) - 2));

    const rombelDigit = assignedRombel === 'A' ? '1' : assignedRombel === 'B' ? '2' : assignedRombel === 'C' ? '3' : '4';

    const record: StudentTpGradeRecord = {
      studentId: s.id,
      studentName: s.name,
      nis: s.nis || `24${rombelDigit}${(idx + 1).toString().padStart(2, '0')}`,
      nisn: s.nisn,
      classGroup: s.classGroup || `${grade}-${assignedRombel}`,
      rombel: assignedRombel,
      gender: s.gender,
      tpId,
      tpText,
      element,
      grade,
      semester,
      kognitif: { tugas, diagnostik, formatif, sumatif, rataRata: 0 },
      afektif: { sikap, keaktifan, presensiSholat, adabEtika, rataRata: 0, predikat: 'Baik' },
      psikomotorik: { praktik, unjukKerja, produkProyek, rataRata: 0, predikat: 'Mahir' },
      nilaiAkhir: 0,
      isTuntas: false,
      deskripsiCapaian: ''
    };

    return recalculateStudentRecord(record, config);
  });
}

// Local Storage Keys
const STORAGE_PREFIX = 'paibp_assessment_gradebook_v2_';

export function saveGradebookToStorage(key: string, data: StudentTpGradeRecord[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('Gagal menyimpan gradebook ke localStorage:', e);
  }

  // Otomatis sinkronkan dan simpan ke Cloud Database Firestore agar data tidak pernah terhapus
  if (data && data.length > 0) {
    saveGradeRecordsToDatabase(data, key).catch(err => {
      console.warn('[Cloud Database] Gagal menyimpan rekap nilai ke Firestore:', err);
    });

    // Ekstrak data siswa ke tabel master siswa agar nama, NIS, dan kelas tersimpan permanen
    const studentList: StudentInfo[] = data.map((d, idx) => ({
      id: d.studentId || `s-${d.grade.toLowerCase()}-${d.nis || idx + 1}`,
      name: d.studentName,
      nis: d.nis,
      nisn: d.nisn || '',
      classGroup: d.classGroup || `${d.grade}-A`,
      gender: d.gender
    }));
    saveStudentsToDatabase(studentList, data[0].grade).catch(err => {
      console.warn('[Cloud Database] Gagal menyimpan master siswa ke Firestore:', err);
    });
  }
}

export function loadGradebookFromStorage(key: string): StudentTpGradeRecord[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

const escapeCsv = (val: string | number | undefined) => `"${String(val ?? '').replace(/"/g, '""')}"`;

export function exportGradebookToCsv(
  records: StudentTpGradeRecord[],
  element: string,
  tpText: string,
  grade: string,
  semester: string,
  config: GradingConfiguration
): void {
  const headers = [
    'No',
    'NIS',
    'NISN',
    'Nama Peserta Didik',
    'Kelas',
    'L/P',
    'Tugas (Kognitif)',
    'Diagnostik (Kognitif)',
    'Formatif (Kognitif)',
    'Sumatif (Kognitif)',
    'Rata-rata Kognitif',
    'Nilai Sikap (Afektif)',
    'Keaktifan Belajar (Afektif)',
    'Presensi Sholat 5 Waktu (Afektif)',
    'Adab & Etika Digital (Afektif)',
    'Rata-rata Afektif',
    'Predikat Afektif',
    'Nilai Praktik (Psikomotorik)',
    'Unjuk Kerja (Psikomotorik)',
    'Produk / Proyek (Psikomotorik)',
    'Rata-rata Psikomotorik',
    'Predikat Psikomotorik',
    'NILAI AKHIR TP',
    'STATUS KKTP (>= ' + config.kktp + ')',
    'DESKRIPSI CAPAIAN KOMPETENSI RAPOR'
  ];

  const rows = records.map((r, idx) => {
    return [
      idx + 1,
      escapeCsv(r.nis || ''),
      escapeCsv(r.nisn),
      escapeCsv(r.studentName),
      escapeCsv(r.classGroup || `${grade}-A`),
      escapeCsv(r.gender),
      r.kognitif.tugas ?? '',
      r.kognitif.diagnostik ?? '',
      r.kognitif.formatif ?? '',
      r.kognitif.sumatif ?? '',
      r.kognitif.rataRata,
      r.afektif.sikap ?? '',
      r.afektif.keaktifan ?? '',
      r.afektif.presensiSholat ?? '',
      r.afektif.adabEtika ?? '',
      r.afektif.rataRata,
      escapeCsv(r.afektif.predikat),
      r.psikomotorik.praktik ?? '',
      r.psikomotorik.unjukKerja ?? '',
      r.psikomotorik.produkProyek ?? '',
      r.psikomotorik.rataRata,
      escapeCsv(r.psikomotorik.predikat),
      r.nilaiAkhir,
      escapeCsv(r.isTuntas ? 'TUNTAS' : 'REMEDIAL'),
      escapeCsv(r.deskripsiCapaian)
    ].join(',');
  });

  const metadataHeader = [
    `"BUKU PENILAIAN LENGKAP PAIBP (KOGNITIF, AFEKTIF, PSIKOMOTORIK)"`,
    `"Mata Pelajaran: Pendidikan Agama Islam dan Budi Pekerti"`,
    `"Kelas: ${grade} | Semester: ${semester} | Elemen: ${element}"`,
    `"Tujuan Pembelajaran: ${tpText.replace(/"/g, '""')}"`,
    `"Standar KKTP: ${config.kktp} | Bobot: Kognitif ${config.weights.kognitif}%, Afektif ${config.weights.afektif}%, Psikomotorik ${config.weights.psikomotorik}%"`,
    `"Tanggal Ekspor: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}"`,
    ''
  ].join('\n');

  const csvContent = '\ufeff' + metadataHeader + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rekap_Nilai_Lengkap_PAIBP_${grade}_Sem${semester}_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printOfficialGradebook(
  records: StudentTpGradeRecord[],
  element: string,
  tpText: string,
  grade: string,
  semester: string,
  schoolName: string,
  teacherName: string,
  config: GradingConfiguration
): void {
  const content = `
    <html>
    <head>
      <title>Buku Penilaian Lengkap PAIBP - ${grade} - ${element}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 9pt; color: #1e293b; margin: 20px; line-height: 1.3; }
        .kop { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px; }
        .kop h2 { margin: 0; font-size: 14pt; text-transform: uppercase; color: #0f172a; }
        .kop h3 { margin: 3px 0; font-size: 11pt; font-weight: 600; color: #0284c7; }
        .meta-grid { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 8.5pt; }
        .meta-col { width: 48%; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 8pt; }
        th, td { border: 1px solid #cbd5e1; padding: 4px 6px; }
        th { background-color: #f1f5f9; text-align: center; font-weight: bold; }
        .th-kognitif { background-color: #e0f2fe; color: #0369a1; }
        .th-afektif { background-color: #fef3c7; color: #92400e; }
        .th-psikomotorik { background-color: #f3e8ff; color: #7e22ce; }
        .th-final { background-color: #dcfce7; color: #166534; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .tuntas { color: #15803d; font-weight: bold; }
        .remedial { color: #b91c1c; font-weight: bold; }
        .signature-row { display: flex; justify-content: space-between; margin-top: 30px; font-size: 9pt; }
        .signature-box { text-align: center; width: 220px; }
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="kop">
        <h2>${schoolName || 'LEMBAGA PENDIDIKAN SMP / MTs'}</h2>
        <h3>BUKU PENILAIAN LENGKAP PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI</h3>
        <p style="margin: 2px 0; font-size: 8.5pt; color: #64748b;">Kurikulum Merdeka 2026 • Penilaian Ranah Kognitif, Afektif, dan Psikomotorik per Tujuan Pembelajaran</p>
      </div>

      <div class="meta-grid">
        <div class="meta-col">
          <div><strong>Fase / Kelas / Semester:</strong> Fase D / Kelas ${grade} / Semester ${semester}</div>
          <div><strong>Elemen Capaian:</strong> ${element}</div>
          <div><strong>Tujuan Pembelajaran (TP):</strong> ${tpText}</div>
        </div>
        <div class="meta-col" style="text-align: right;">
          <div><strong>Kriteria Ketercapaian (KKTP):</strong> ${config.kktp} Poin</div>
          <div><strong>Bobot Penilaian:</strong> Kognitif (${config.weights.kognitif}%) • Afektif (${config.weights.afektif}%) • Psikomotorik (${config.weights.psikomotorik}%)</div>
          <div><strong>Tanggal Cetak:</strong> ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th rowspan="2" style="width: 25px;">No</th>
            <th rowspan="2" style="width: 60px;">NIS</th>
            <th rowspan="2" style="width: 130px;">Nama Siswa</th>
            <th rowspan="2" style="width: 45px;">Kelas</th>
            <th rowspan="2" style="width: 30px;">L/P</th>
            <th colspan="5" class="th-kognitif">RANAH KOGNITIF (PENGETAHUAN)</th>
            <th colspan="5" class="th-afektif">RANAH AFEKTIF (SIKAP & IBADAH)</th>
            <th colspan="4" class="th-psikomotorik">RANAH PSIKOMOTORIK (KETERAMPILAN)</th>
            <th colspan="2" class="th-final">NILAI AKHIR</th>
            <th rowspan="2">Deskripsi Rapor Kurikulum Merdeka</th>
          </tr>
          <tr>
            <th class="th-kognitif">Tgs</th>
            <th class="th-kognitif">Diag</th>
            <th class="th-kognitif">Form</th>
            <th class="th-kognitif">Sum</th>
            <th class="th-kognitif">Rata</th>
            
            <th class="th-afektif">Sikap</th>
            <th class="th-afektif">Aktif</th>
            <th class="th-afektif">Sholat</th>
            <th class="th-afektif">Adab</th>
            <th class="th-afektif">Pred</th>
            
            <th class="th-psikomotorik">Praktik</th>
            <th class="th-psikomotorik">Kinerja</th>
            <th class="th-psikomotorik">Produk</th>
            <th class="th-psikomotorik">Pred</th>

            <th class="th-final">NA</th>
            <th class="th-final">KKTP</th>
          </tr>
        </thead>
        <tbody>
          ${records.map((r, i) => `
            <tr>
              <td class="center">${i + 1}</td>
              <td class="center" style="font-family: monospace;">${r.nis || '-'}</td>
              <td class="bold">${r.studentName}</td>
              <td class="center">${r.classGroup || grade + '-A'}</td>
              <td class="center">${r.gender}</td>
              <td class="center">${r.kognitif.tugas ?? '-'}</td>
              <td class="center">${r.kognitif.diagnostik ?? '-'}</td>
              <td class="center">${r.kognitif.formatif ?? '-'}</td>
              <td class="center">${r.kognitif.sumatif ?? '-'}</td>
              <td class="center bold">${r.kognitif.rataRata}</td>

              <td class="center">${r.afektif.sikap ?? '-'}</td>
              <td class="center">${r.afektif.keaktifan ?? '-'}</td>
              <td class="center bold">${r.afektif.presensiSholat ?? '-'}</td>
              <td class="center">${r.afektif.adabEtika ?? '-'}</td>
              <td class="center">${r.afektif.predikat}</td>

              <td class="center">${r.psikomotorik.praktik ?? '-'}</td>
              <td class="center">${r.psikomotorik.unjukKerja ?? '-'}</td>
              <td class="center">${r.psikomotorik.produkProyek ?? '-'}</td>
              <td class="center">${r.psikomotorik.predikat}</td>

              <td class="center bold" style="font-size: 9pt;">${r.nilaiAkhir}</td>
              <td class="center ${r.isTuntas ? 'tuntas' : 'remedial'}">${r.isTuntas ? 'Tuntas' : 'Remedial'}</td>
              <td style="font-size: 7.5pt; font-style: italic;">${r.deskripsiCapaian}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="signature-row">
        <div class="signature-box">
          <p>Mengetahui,<br/>Kepala Sekolah / Madrasah</p>
          <div style="height: 45px;"></div>
          <p style="font-weight: bold; text-decoration: underline;">Dr. H. Ahmad Dahlan, M.Pd.I</p>
          <p style="font-size: 8pt; color: #64748b;">NIP. 19780512 200312 1 002</p>
        </div>
        <div class="signature-box">
          <p>Guru Pengampu PAIBP</p>
          <div style="height: 45px;"></div>
          <p style="font-weight: bold; text-decoration: underline;">${teacherName || 'Guru Pengampu PAIBP'}</p>
          <p style="font-size: 8pt; color: #64748b;">NIP. 19850920 201101 2 005</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}

// ==========================================
// CBT (COMPUTER BASED TEST) STORAGE & SYNC
// ==========================================
const CBT_STORAGE_KEY = 'paibp_cbt_student_results_v1';

export function saveCbtResult(result: import('../types').CbtStudentResult): void {
  try {
    const existing = loadCbtResults();
    // Filter out previous result for the same student on this exam to update
    const filtered = existing.filter(r => !(r.studentName === result.studentName && r.examTitle === result.examTitle));
    filtered.unshift(result);
    localStorage.setItem(CBT_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Gagal menyimpan hasil CBT:', e);
  }

  // Simpan secara permanen ke Cloud Database Firestore
  saveCbtResultToDatabase(result).catch(err => {
    console.warn('[Cloud Database] Gagal menyimpan hasil CBT ke Firestore:', err);
  });
}

export function loadCbtResults(): import('../types').CbtStudentResult[] {
  try {
    const raw = localStorage.getItem(CBT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function deleteCbtResult(id: string): void {
  try {
    const existing = loadCbtResults().filter(r => r.id !== id);
    localStorage.setItem(CBT_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Gagal menghapus hasil CBT:', e);
  }

  // Hapus juga dari Cloud Database Firestore
  deleteCbtResultFromDatabase(id).catch(err => {
    console.warn('[Cloud Database] Gagal menghapus hasil CBT dari Firestore:', err);
  });
}

export function syncCbtScoreToStudentGradebook(
  studentName: string,
  nis: string,
  score: number,
  grade: GradeLevel,
  semester: Semester,
  assessmentType: 'sumatif' | 'formatif' | 'tugas' = 'sumatif'
): boolean {
  try {
    let foundAndUpdated = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const subKey = key.replace(STORAGE_PREFIX, '');
        // Match keys with rombel categorization e.g. VIII_rombelA_1_...
        const matchGrade = subKey.startsWith(`${grade}_`) || subKey.startsWith(`${grade}-`);
        const matchSemester = subKey.includes(`_${semester}_`) || subKey.endsWith(`_${semester}`);

        if (matchGrade && matchSemester) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const records: StudentTpGradeRecord[] = JSON.parse(raw);
            let modified = false;
            const updated = records.map(r => {
              const isMatch = (r.studentName.toLowerCase().trim() === studentName.toLowerCase().trim()) ||
                (nis && r.nis && r.nis.trim() === nis.trim());
              if (isMatch) {
                modified = true;
                foundAndUpdated = true;
                const copy = { ...r };
                copy.kognitif = { ...copy.kognitif, [assessmentType]: score };
                return recalculateStudentRecord(copy, DEFAULT_GRADING_CONFIG);
              }
              return r;
            });
            if (modified) {
              saveGradebookToStorage(subKey, updated); // Persists to BOTH localStorage and Firestore!
            }
          }
        }
      }
    }
    return foundAndUpdated;
  } catch (e) {
    console.warn('Gagal sinkronisasi skor CBT ke buku nilai:', e);
    return false;
  }
}

export function exportCbtResultsToCsv(results: import('../types').CbtStudentResult[]): void {
  const headers = [
    'No',
    'NIS',
    'Nama Peserta Didik',
    'Kelas',
    'Judul Ujian CBT',
    'Nilai Akhir (0-100)',
    'Benar',
    'Salah',
    'Total Soal',
    'Durasi Pengerjaan',
    'Waktu Selesai',
    'Status Capaian'
  ];

  const rows = results.map((r, idx) => {
    const minutes = Math.floor(r.timeSpentSeconds / 60);
    const seconds = r.timeSpentSeconds % 60;
    const timeFormatted = `${minutes}m ${seconds}s`;
    const predikat = r.score >= 85 ? 'Sangat Mahir' : r.score >= 75 ? 'Mahir' : r.score >= 65 ? 'Cakap' : 'Perlu Bimbingan';

    return [
      idx + 1,
      escapeCsv(r.nis || '-'),
      escapeCsv(r.studentName),
      escapeCsv(r.classGroup || '-'),
      escapeCsv(r.examTitle),
      r.score,
      r.correctCount,
      r.wrongCount,
      r.totalQuestions,
      escapeCsv(timeFormatted),
      escapeCsv(r.submittedAt),
      escapeCsv(predikat)
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_CBT_PAIBP_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printCbtStudentCertificate(
  result: import('../types').CbtStudentResult,
  schoolName: string = 'SMP Negeri 1 Nusantara',
  teacherName: string = 'Guru Pengampu PAIBP'
): void {
  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;
  const predikat = result.score >= 85 ? 'SANGAT MAHIR' : result.score >= 75 ? 'MAHIR' : result.score >= 65 ? 'CAKAP' : 'PERLU BIMBINGAN';
  const isTuntas = result.score >= 75;

  const content = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Kartu Hasil Ujian CBT - ${result.studentName}</title>
      <style>
        @page { size: A4 portrait; margin: 15mm; }
        body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #111; line-height: 1.4; padding: 10px; }
        .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 15px; }
        .kop h2 { margin: 0; font-size: 14pt; text-transform: uppercase; letter-spacing: 0.5px; }
        .kop h1 { margin: 2px 0; font-size: 16pt; font-weight: bold; }
        .kop p { margin: 1px 0; font-size: 9pt; color: #333; }
        .title-box { text-align: center; margin: 15px 0; }
        .title-box h3 { margin: 0; font-size: 13pt; text-decoration: underline; text-transform: uppercase; letter-spacing: 1px; }
        .title-box span { font-size: 9.5pt; color: #555; }
        table.meta { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 10.5pt; }
        table.meta td { padding: 4px 6px; }
        .score-banner { border: 2px solid #0f172a; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0; background: #f8fafc; }
        .score-number { font-size: 42pt; font-weight: bold; color: ${isTuntas ? '#047857' : '#b91c1c'}; margin: 0; line-height: 1; }
        .score-badge { display: inline-block; padding: 4px 12px; font-weight: bold; font-size: 11pt; border-radius: 4px; margin-top: 8px;
          background: ${isTuntas ? '#d1fae5' : '#fee2e2'}; color: ${isTuntas ? '#065f46' : '#991b1b'}; }
        table.detail { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 10pt; }
        table.detail th, table.detail td { border: 1px solid #333; padding: 6px 10px; }
        table.detail th { background: #e2e8f0; font-weight: bold; text-align: left; }
        .signature-row { display: flex; justify-content: space-between; margin-top: 35px; }
        .signature-box { width: 42%; text-align: center; }
      </style>
    </head>
    <body>
      <div class="kop">
        <h2>PEMERINTAH KABUPATEN / KOTA • DINAS PENDIDIKAN</h2>
        <h1>${schoolName}</h1>
        <p>Layanan Ujian Berbasis Komputer (CBT Online) • Kurikulum Merdeka 2026</p>
      </div>

      <div class="title-box">
        <h3>LEMBAR KARTU HASIL UJIAN CBT SISWA</h3>
        <span>Nomor Dokumen: CBT/PAIBP/${result.grade}/${result.id.slice(-6).toUpperCase()}</span>
      </div>

      <table class="meta">
        <tr>
          <td style="width: 20%;"><strong>Nama Peserta</strong></td>
          <td style="width: 2%;">:</td>
          <td style="width: 40%; font-weight: bold; text-transform: uppercase;">${result.studentName}</td>
          <td style="width: 18%;"><strong>Kelas / Fase</strong></td>
          <td style="width: 2%;">:</td>
          <td>${result.classGroup || `Kelas ${result.grade}`} (Fase D)</td>
        </tr>
        <tr>
          <td><strong>NIS / NISN</strong></td>
          <td>:</td>
          <td>${result.nis || '-'}</td>
          <td><strong>Semester</strong></td>
          <td>:</td>
          <td>Semester ${result.semester}</td>
        </tr>
        <tr>
          <td><strong>Mata Pelajaran</strong></td>
          <td>:</td>
          <td>Pendidikan Agama Islam dan Budi Pekerti</td>
          <td><strong>Waktu Selesai</strong></td>
          <td>:</td>
          <td>${result.submittedAt}</td>
        </tr>
        <tr>
          <td><strong>Judul Asesmen</strong></td>
          <td>:</td>
          <td colspan="4">${result.examTitle}</td>
        </tr>
      </table>

      <div class="score-banner">
        <p style="margin: 0 0 5px 0; font-size: 11pt; color: #475569; text-transform: uppercase; font-weight: bold;">Skor Akhir Capaian Ujian CBT</p>
        <div class="score-number">${result.score}</div>
        <div class="score-badge">${predikat} (${isTuntas ? 'MEMENUHI KKTP' : 'REMEDIAL'})</div>
      </div>

      <table class="detail">
        <thead>
          <tr>
            <th>Parameter Evaluasi</th>
            <th style="text-align: center; width: 25%;">Hasil Pencapaian</th>
            <th style="width: 45%;">Keterangan & Catatan Guru</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Jumlah Soal Terjawab Benar</strong></td>
            <td style="text-align: center; font-weight: bold; color: #047857;">${result.correctCount} Butir</td>
            <td>Penguasaan konsep dan dalil terbukti tepat</td>
          </tr>
          <tr>
            <td><strong>Jumlah Soal Keliru / Salah</strong></td>
            <td style="text-align: center; font-weight: bold; color: #b91c1c;">${result.wrongCount} Butir</td>
            <td>Perlu penguatan pada distraktor pemahaman</td>
          </tr>
          <tr>
            <td><strong>Soal Tidak Dijawab / Kosong</strong></td>
            <td style="text-align: center;">${result.unansweredCount} Butir</td>
            <td>Manajemen waktu pengerjaan</td>
          </tr>
          <tr>
            <td><strong>Total Butir Soal Ujian</strong></td>
            <td style="text-align: center; font-weight: bold;">${result.totalQuestions} Butir</td>
            <td>Standar Taksonomi Bloom C1–C6</td>
          </tr>
          <tr>
            <td><strong>Durasi Pengerjaan</strong></td>
            <td style="text-align: center;">${minutes} menit ${seconds} detik</td>
            <td>Pengerjaan mandiri melalui CBT Online</td>
          </tr>
        </tbody>
      </table>

      <div class="signature-row">
        <div class="signature-box">
          <p>Peserta Didik,</p>
          <div style="height: 45px;"></div>
          <p style="font-weight: bold; text-decoration: underline;">${result.studentName}</p>
          <p style="font-size: 9pt; color: #64748b;">NIS. ${result.nis || '-'}</p>
        </div>
        <div class="signature-box">
          <p>Guru Pengampu PAIBP,</p>
          <div style="height: 45px;"></div>
          <p style="font-weight: bold; text-decoration: underline;">${teacherName}</p>
          <p style="font-size: 9pt; color: #64748b;">NIP. 19850920 201101 2 005</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
