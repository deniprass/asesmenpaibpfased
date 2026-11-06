import { GradeLevel, Semester, PaibpElement } from '../types';
export { 
  CP_THEMES_CLASSIFICATION,
  OFFICIAL_CP_CLAUSES,
  getThemesByElement,
  getThemeById,
  getThemesByGrade,
  searchThemes
} from './cpThemesData';

export interface CurriculumTopic {
  id: string;
  grade: GradeLevel;
  semester: Semester;
  element: PaibpElement;
  tema: string;
  temaCode: string;
  materi: string;
  submateriList: string[];
  officialCp: string;
  suggestedTpList: string[];
  dalilReference: string;
  dalilText?: string;
  dalilMeaning?: string;
  contextExamples: string[];
}

export const OFFICIAL_REGULATION_INFO = {
  decreeNumber: "Keputusan Kepala Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP) Kemendikbudristek / Kemenag RI",
  phase: "Fase D",
  targetGrades: "Kelas VII, VIII, dan IX SMP/MTs/SMPLB atau Program Paket B",
  subject: "Pendidikan Agama Islam dan Budi Pekerti (PAIBP)"
};

export const OFFICIAL_CP_PAIBP_FASED: Record<string, string> = {
  "Al-Qur'an Hadis": "Membaca, menghafal, menulis, dan menjelaskan ayat Al-Qur'an tentang pentingnya iman, takwa, toleransi, cinta tanah air, semangat keilmuan, dan sabar dalam menghadapi musibah dan ujian beserta hadis terkait.",
  "Al-Qur'an dan Hadis": "Membaca, menghafal, menulis, dan menjelaskan ayat Al-Qur'an tentang pentingnya iman, takwa, toleransi, cinta tanah air, semangat keilmuan, dan sabar dalam menghadapi musibah dan ujian beserta hadis terkait.",
  "Akidah": "Meyakini dan merefleksikan rukun iman serta hal-hal yang dapat meneguhkan iman.",
  "Akhlak": "Menerapkan makna ikhlas, bersyukur kepada Allah Swt., cinta rasul, cinta ilmu, cinta lingkungan, serta cinta diri sendiri dan sesama.",
  "Fikih": "Menerapkan ketentuan sujud di luar rukun salat, rukhsah dalam ibadah, kewajiban terhadap jenazah, haji dan umrah, penyembelihan hewan, kurban, akikah, dan wakaf.",
  "Sejarah Peradaban Islam": "Merefleksikan sejarah dan peran Kekhalifahan Islam pasca Khulafaur Rasyidin serta sejarah masuknya Islam di Indonesia."
};

/**
 * DAFTAR 30 TOPIK KURIKULUM & ALUR TUJUAN PEMBELAJARAN (ATP) LENGKAP PAIBP FASE D
 * Tersinkronisasi presisi per Kelas (VII, VIII, IX), Semester (1 & 2), dan 5 Elemen PAIBP
 */
export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  // =========================================================================
  // 1. KELAS VII - SEMESTER 1
  // =========================================================================
  {
    id: 'vii-1-quran',
    grade: 'VII',
    semester: '1',
    element: "Al-Qur'an Hadis",
    tema: "Pentingnya Iman dalam Kehidupan Seorang Muslim",
    temaCode: "tema-vii-1-quran-iman",
    materi: "Ayat Al-Qur'an dan Hadis terkait Pentingnya Iman dalam Kehidupan Seorang Muslim",
    submateriList: [
      "Membaca dan Menelaah Ayat Al-Qur'an dan Hadis tentang Hakikat Keimanan (Q.S. Al-Anfal [8]: 2-4)",
      "Rukun Iman dan Perwujudan Iman dalam Niat, Ucapan Lisan, dan Perbuatan Nyata",
      "Peran Iman sebagai Fondasi Moral, Pembimbing Perilaku, dan Keteguhan Mental Pelajar",
      "Karakteristik Muslim Beriman dalam Menghadapi Godaan Lingkungan dan Era Digital"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Al-Qur'an Hadis"],
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya iman dalam kehidupan seorang Muslim",
      "Menelaah ciri-ciri mukmin sejati berdasarkan Q.S. Al-Anfal: 2-4 dalam membangun integritas diri di sekolah.",
      "Merancang komitmen pengamalan rukun iman dalam perkataan dan perbuatan sehari-hari."
    ],
    dalilReference: "Q.S. Al-Anfal [8]: 2-4 & H.R. Muslim (Hadis Jibril)",
    dalilMeaning: "Sesungguhnya orang-orang yang beriman adalah mereka yang apabila disebut nama Allah gemetar hatinya, dan apabila dibacakan ayat-ayat-Nya bertambah iman mereka...",
    contextExamples: [
      "Menjaga konsistensi kejujuran saat ujian daring mandiri",
      "Keteguhan memegang prinsip keimanan di tengah pergaulan bebas",
      "Menolak ajakan perbuatan tercela di media sosial karena kesadaran iman",
      "Menjadikan iman sebagai motivasi berprestasi dan berbuat kebajikan"
    ]
  },
  {
    id: 'vii-1-akidah',
    grade: 'VII',
    semester: '1',
    element: "Akidah",
    tema: "Makna Iman kepada Allah Swt. dan Peneguh Keimanan",
    temaCode: "tema-vii-1-akidah-sifat",
    materi: "Makna Iman kepada Allah Swt. melalui Sifat-Sifat-Nya dan Hal-Hal yang Meneguhkan Iman",
    submateriList: [
      "Mengenal Allah Swt. melalui Sifat Wajib, Sifat Mustahil, dan Sifat Jaiz bagi Allah",
      "Meneladani Asmaul Husna (Al-'Alim, Al-Khabir, As-Sami', Al-Bashir) dalam Membangun Karakter",
      "Hal-Hal yang Meneguhkan Iman: Konsistensi Ibadah (Istiqamah), Dzikirullah, dan Berteman dengan Orang Saleh",
      "Membentengi Diri dari Keraguan dan Pengaruh Negatif yang Melemahkan Iman"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akidah"],
    suggestedTpList: [
      "Menganalisis makna iman kepada Allah Swt. melalui sifat-sifat-Nya dan hal-hal yang dapat meneguhkan iman",
      "Mengevaluasi pengamalan Asmaul Husna Al-Bashir dan Al-'Alim dalam menjaga kejujuran saat ujian tanpa pengawasan.",
      "Menyusun peta kebiasaan spiritual harian (istiqamah dzikir dan shalat) sebagai peneguh keimanan remaja."
    ],
    dalilReference: "Q.S. Al-A'raf [7]: 180 & Q.S. Ar-Ra'd [13]: 28",
    dalilMeaning: "Hanya milik Allah Asmaul Husna, maka bermohonlah kepada-Nya dengan menyebut Asmaul Husna itu... Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    contextExamples: [
      "Menjaga amanah dana kas kelas tanpa ada yang melihat",
      "Menenangkan hati dengan dzikir saat cemas menghadapi ujian",
      "Memilih teman pergaulan yang saling mengingatkan dalam kebaikan",
      "Meyakini pengawasan Allah Swt. di ruang privat maupun publik"
    ]
  },
  {
    id: 'vii-1-akhlak',
    grade: 'VII',
    semester: '1',
    element: "Akhlak",
    tema: "Menerapkan Makna Ikhlas",
    temaCode: "tema-vii-1-akhlak-ikhlas",
    materi: "Penerapan Makna Ikhlas dalam Niat, Ibadah, dan Amal Keseharian",
    submateriList: [
      "Hakikat Ikhlas: Memurnikan Niat Semata-mata karena Allah Swt. (Lillahi Ta'ala)",
      "Bahaya Perusak Amal: Riya' (Pamer), Sum'ah (Mencari Pujian), dan Ujub (Bangga Diri)",
      "Ciri-ciri Pribadi yang Ikhlas dalam Belajar, Berorganisasi OSIS, dan Membantu Teman",
      "Menghindari Budaya Flexing Amal Kebaikan di Media Sosial"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akhlak"],
    suggestedTpList: [
      "Menerapkan makna ikhlas",
      "Menganalisis kemurnian niat dalam kegiatan sosial kesiswaan agar terbebas dari dorongan riya dan flexing.",
      "Merancang aksi kepedulian sosial di sekolah berbasis keikhlasan tanpa mengharapkan imbalan pujian."
    ],
    dalilReference: "Q.S. Al-Bayyinah [98]: 5 & H.R. Bukhari (Innamal A'malu bin Niyyat)",
    dalilMeaning: "Padahal mereka tidak disuruh kecuali supaya menyembah Allah dengan memurnikan ketaatan kepada-Nya dalam (menjalankan) agama dengan lurus...",
    contextExamples: [
      "Menolong teman yang terjatuh tanpa mendokumentasikan untuk konten media sosial",
      "Menerima keputusan musyawarah kelas dengan lapang dada",
      "Membersihkan lingkungan kelas tanpa menunggu disuruh atau dipuji guru",
      "Menjaga kerahasiaan sedekah dan bantuan kemanusiaan"
    ]
  },
  {
    id: 'vii-1-fikih',
    grade: 'VII',
    semester: '1',
    element: "Fikih",
    tema: "Ketentuan Macam-Macam Sujud",
    temaCode: "tema-vii-1-fikih-sujud",
    materi: "Ketentuan Macam-Macam Sujud (Sujud Syukur, Sujud Sahwi, dan Sujud Tilawah)",
    submateriList: [
      "Ketentuan, Sebab, dan Tata Cara Sujud Syukur atas Nikmat Besar atau Terhindar Musibah",
      "Ketentuan, Sebab, Bacaan, dan Tata Cara Sujud Sahwi saat Lupa atau Ragu Rakaat Salat",
      "Ketentuan, Sebab, Ayat-Ayat Sajdah, dan Tata Cara Sujud Tilawah di Luar dan di Dalam Salat",
      "Perbandingan Rukun, Syarat, dan Praktik Ketiga Macam Sujud dalam Kehidupan Sehari-hari"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Fikih"],
    suggestedTpList: [
      "Menganalisis ketentuan macam-macam sujud (sujud syukur, sahwi, dan tilawah)",
      "Membedakan sebab-sebab pelaksanaan sujud syukur, sujud sahwi, dan sujud tilawah serta tata caranya secara tepat.",
      "Mendemonstrasikan praktik sujud sahwi dalam menyelesaikan kasus keraguan jumlah rakaat salat berjamaah."
    ],
    dalilReference: "H.R. Abu Dawud, Tirmidzi & H.R. Muslim",
    dalilMeaning: "Dari Abu Bakrah: Apabila datang kepada Nabi kabar gembira atau hal yang menggembirakan, beliau tersungkur sujud bersyukur kepada Allah.",
    contextExamples: [
      "Sujud syukur spontan saat mendengar kelulusan atau kemenangan tim sekolah",
      "Imam lupa tasyahud awal pada salat Isya lalu melakukan sujud sahwi sebelum salam",
      "Mendengar ayat sajdah saat membaca Surah Al-Alaq lalu melakukan sujud tilawah",
      "Menyelesaikan keraguan rakaat salat fardhu dengan mengambil jumlah terkecil"
    ]
  },
  {
    id: 'vii-1-spi',
    grade: 'VII',
    semester: '1',
    element: "Sejarah Peradaban Islam",
    tema: "Peradaban Daulah Bani Umayyah",
    temaCode: "tema-vii-1-spi-umayyah",
    materi: "Sejarah dan Analisis Kemajuan Peradaban Daulah Bani Umayyah di Damaskus dan Andalusia",
    submateriList: [
      "Latar Belakang Berdirinya Daulah Bani Umayyah dan Fase Pemerintahan di Damaskus serta Andalusia",
      "Keteladanan Integritas dan Keadilan Fiskal Khalifah Umar bin Abdul Aziz",
      "Kemajuan Administrasi Pemerintahan, Arsitektur Masjid Damaskus/Cordoba, dan Ilmu Pengetahuan",
      "Ibrah Kepemimpinan, Keadilan Hukum, dan Semangat Membangun Peradaban bagi Pelajar"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Sejarah Peradaban Islam"],
    suggestedTpList: [
      "Menganalisis peradaban Bani Umayyah",
      "Menganalisis kemajuan administrasi, seni arsitektur, dan perluasan peradaban pada masa Bani Umayyah.",
      "Menyusun refleksi keteladanan keadilan Khalifah Umar bin Abdul Aziz dalam kepemimpinan organisasi kesiswaan."
    ],
    dalilReference: "Q.S. An-Nisa' [4]: 58 & Q.S. Yusuf [12]: 111",
    dalilMeaning: "Sungguh, Allah menyuruhmu menyampaikan amanat kepada yang berhak menerimanya, dan apabila kamu menetapkan hukum di antara manusia hendaknya kamu menetapkan dengan adil.",
    contextExamples: [
      "Menjaga transparansi anggaran kepengurusan OSIS dan kelas",
      "Meneladani kesederhanaan pemimpin berintegritas tinggi",
      "Menghargai warisan keilmuan dan arsitektur peradaban Islam",
      "Menerapkan kedisiplinan dan profesionalitas dalam tugas organisasi"
    ]
  },

  // =========================================================================
  // 2. KELAS VII - SEMESTER 2
  // =========================================================================
  {
    id: 'vii-2-quran',
    grade: 'VII',
    semester: '2',
    element: "Al-Qur'an Hadis",
    tema: "Pentingnya Takwa kepada Allah Swt.",
    temaCode: "tema-vii-2-quran-takwa",
    materi: "Ayat Al-Qur'an dan Hadis terkait Pentingnya Takwa kepada Allah Swt.",
    submateriList: [
      "Kandungan Q.S. Ali 'Imran [3]: 102 tentang Perintah Bertakwa Sebenar-Benar Takwa",
      "Kandungan Q.S. Al-Hujurat [49]: 13 tentang Standar Kemuliaan Manusia di Sisi Allah Swt.",
      "Hadis Riwayat Tirmidzi tentang Berwasiat Takwa di Mana Pun Berada (Ittaqillaha Haitsuma Kunta)",
      "Ciri-ciri Pribadi Bertakwa: Menjalankan Perintah, Menjauhi Larangan, dan Mawas Diri di Era Modern"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Al-Qur'an Hadis"],
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya takwa kepada Allah Swt.",
      "Menelaah indikator karakter muttaqin dalam Q.S. Ali 'Imran: 102 dan relevansinya bagi integritas remaja.",
      "Merancang komitmen perilaku bertakwa di lingkungan keluarga, madrasah, dan ruang digital."
    ],
    dalilReference: "Q.S. Ali 'Imran [3]: 102 & H.R. Tirmidzi",
    dalilMeaning: "Wahai orang-orang yang beriman! Bertakwalah kepada Allah sebenar-benar takwa kepada-Nya dan janganlah sekali-kali kamu mati melainkan dalam keadaan beragama Islam.",
    contextExamples: [
      "Konsistensi menjalankan salat fardhu lima waktu tepat waktu",
      "Menahan diri dari perbuatan dosa saat sendirian di kamar",
      "Berbicara jujur dan santun saat menghadapi situasi sulit",
      "Menjadikan takwa sebagai kompas moral dalam mengambil keputusan"
    ]
  },
  {
    id: 'vii-2-akidah',
    grade: 'VII',
    semester: '2',
    element: "Akidah",
    tema: "Iman kepada Malaikat-Malaikat Allah Swt.",
    temaCode: "tema-vii-2-akidah-malaikat",
    materi: "Makna Iman kepada Malaikat-Malaikat Allah Swt. dan Pengawasan Moral",
    submateriList: [
      "Hakikat, Penciptaan dari Cahaya (Nur), Sifat, dan Ketaatan Mutlak Malaikat Allah Swt.",
      "Sepuluh Malaikat Wajib beserta Tugas-Tugasnya dalam Kehidupan dan Semesta",
      "Menumbuhkan Sikap Muraqabah (Kesadaran Diawasi Malaikat Raqib dan Atid) dalam Berkata dan Berbuat",
      "Korelasi Iman kepada Malaikat dengan Penjagaan Jejak Digital dan Kejujuran Akademik"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akidah"],
    suggestedTpList: [
      "Menganalisis makna iman kepada malaikat-malaikat Allah Swt.",
      "Mengevaluasi pengaruh keimanan kepada malaikat Raqib dan Atid terhadap pengendalian diri dari kecurangan.",
      "Menyusun refleksi personal tentang pembiasaan muraqabah dalam aktivitas sehari-hari."
    ],
    dalilReference: "Q.S. Qaf [50]: 16-18 & Q.S. Al-Infithar [82]: 10-12",
    dalilMeaning: "Tiada suatu ucapan pun yang diucapkannya melainkan ada di dekatnya malaikat pengawas yang selalu hadir (Raqib dan Atid).",
    contextExamples: [
      "Menghindari mengetik ujaran kebencian di kolom komentar akun anonim",
      "Menjaga kejujuran saat berbelanja di kantin kejujuran sekolah",
      "Meyakini catatan malaikat tidak pernah luput dari amal sekecil apa pun",
      "Membiasakan perbuatan baik sembunyi-sembunyi agar dicatat malaikat"
    ]
  },
  {
    id: 'vii-2-akhlak',
    grade: 'VII',
    semester: '2',
    element: "Akhlak",
    tema: "Menerapkan Makna Bersyukur kepada Allah Swt.",
    temaCode: "tema-vii-2-akhlak-syukur",
    materi: "Penerapan Makna Bersyukur kepada Allah Swt. dalam Sikap dan Perbuatan",
    submateriList: [
      "Hakikat Bersyukur atas Segala Rahmat, Kesehatan, Akal, dan Karunia Allah Swt.",
      "Tiga Dimensi Bersyukur: Syukur dengan Hati (Qalbi), Lisan (Tahmid), dan Perbuatan Nyata (Amali)",
      "Bahaya Penyakit Kufur Nikmat, Selalu Mengeluh, dan Perilaku Boros (Tabzir/Israf)",
      "Mengoptimalkan Nikmat Waktu Muda dan Fasilitas Belajar untuk Meraih Prestasi yang Berkah"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akhlak"],
    suggestedTpList: [
      "Menerapkan makna bersyukur kepada Allah Swt.",
      "Menganalisis tiga dimensi rasa syukur (hati, lisan, perbuatan) dan implementasinya dalam mengatasi stres akademik.",
      "Merancang aksi syukur amali melalui kegiatan berbagi rezeki dan pendampingan teman sebaya."
    ],
    dalilReference: "Q.S. Ibrahim [14]: 7 & Q.S. Luqman [31]: 12",
    dalilMeaning: "Sesungguhnya jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu, tetapi jika kamu mengingkari (nikmat-Ku), maka pasti azab-Ku sangat pedih.",
    contextExamples: [
      "Mengucapkan hamdalah dan sujud syukur saat meraih hasil ujian baik",
      "Memanfaatkan gawai dan kuota internet untuk belajar bukan untuk hal sia-sia",
      "Menghindari membuang-buang makanan dan air wudhu",
      "Berbagi bekal makanan dengan teman yang tidak membawa uang jajan"
    ]
  },
  {
    id: 'vii-2-fikih',
    grade: 'VII',
    semester: '2',
    element: "Fikih",
    tema: "Ketentuan Salat Jumat",
    temaCode: "tema-vii-2-fikih-salat-jumat",
    materi: "Ketentuan, Syarat, Rukun, dan Adab Penyelenggaraan Salat Jumat",
    submateriList: [
      "Kedudukan Hukum Salat Jumat bagi Laki-Laki Muslim dan Dalil Kewajibannya",
      "Syarat Wajib dan Syarat Sah Salat Jumat serta Macam-Macam Udzur Syar'i yang Membolehkan Tidak Hadir",
      "Rukun, Syarat, dan Adab Khotbah Jumat (Mendengarkan dengan Tenang tanpa Berbicara atau Main HP)",
      "Amalan Sunnah Hari Jumat: Mandi Jumat, Memotong Kuku, Memakai Wewangian, Membaca Al-Kahfi, dan Perbanyak Shalawat"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Fikih"],
    suggestedTpList: [
      "Menganalisis ketentuan salat Jumat",
      "Menganalisis rukun khotbah dan syarat sah salat Jumat serta adab mendengarkan nasihat khatib secara khidmat.",
      "Merancang panduan adab dan ketertiban pelaksanaan salat Jumat di masjid sekolah."
    ],
    dalilReference: "Q.S. Al-Jumu'ah [62]: 9-10 & H.R. Abu Dawud",
    dalilMeaning: "Wahai orang-orang yang beriman! Apabila diseru untuk melaksanakan salat pada hari Jumat, maka segeralah kamu mengingat Allah dan tinggalkanlah jual beli...",
    contextExamples: [
      "Segera berwudhu dan menuju masjid ketika azan Jumat berkumandang",
      "Menonaktifkan gawai dan tidak mengobrol saat khatib sedang berkhutbah",
      "Mempraktikkan sunnah mandi dan memakai pakaian rapi/bersih pada hari Jumat",
      "Mengambil saf terdepan yang masih kosong dengan tertib"
    ]
  },
  {
    id: 'vii-2-spi',
    grade: 'VII',
    semester: '2',
    element: "Sejarah Peradaban Islam",
    tema: "Peradaban Daulah Bani Abbasiyah",
    temaCode: "tema-vii-2-spi-abbasiyah",
    materi: "Sejarah dan Analisis Kemajuan Peradaban Daulah Bani Abbasiyah (The Golden Age of Islam)",
    submateriList: [
      "Kelahiran Daulah Abbasiyah di Baghdad dan Kepemimpinan Khalifah Harun Al-Rasyid serta Al-Ma'mun",
      "Peran Lembaga Riset Baitul Hikmah dan Gerakan Penerjemahan Karya Sains Global Lintas Bangsa",
      "Kemajuan Ilmu Agama (Imam Mazhab, Muhadditsin) dan Sains (Ibnu Sina, Al-Khawarizmi, Jabir bin Hayyan)",
      "Ibrah Semangat Intelektual Muslim dalam Membangun Kemajuan Sains, Literasi, dan Karakter Pelajar"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Sejarah Peradaban Islam"],
    suggestedTpList: [
      "Menganalisis peradaban Bani Abbasiyah",
      "Menganalisis faktor pendorong zaman keemasan ilmu pengetahuan dan peran Baitul Hikmah pada masa Daulah Abbasiyah.",
      "Menyusun gagasan inovasi literasi sains dan riset madrasah yang terinspirasi oleh kejayaan intelektual Abbasiyah."
    ],
    dalilReference: "Q.S. Al-'Alaq [96]: 1-5 & Q.S. Az-Zumar [39]: 9",
    dalilMeaning: "Bacalah dengan (menyebut) nama Tuhanmu Yang menciptakan... Katakanlah: Adakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui?",
    contextExamples: [
      "Mengembangkan budaya membaca buku dan riset ilmiah di perpustakaan sekolah",
      "Mengapresiasi penemuan algoritma dan aljabar warisan Al-Khawarizmi",
      "Mengharmonisasikan pemahaman ilmu agama dan teknologi modern",
      "Membangun rasa percaya diri generasi muda muslim dalam kompetisi sains global"
    ]
  },

  // =========================================================================
  // 3. KELAS VIII - SEMESTER 1
  // =========================================================================
  {
    id: 'viii-1-quran',
    grade: 'VIII',
    semester: '1',
    element: "Al-Qur'an Hadis",
    tema: "Pentingnya Toleransi dalam Keragaman",
    temaCode: "tema-viii-1-quran-toleransi",
    materi: "Ayat Al-Qur'an dan Hadis terkait Pentingnya Toleransi (Tasamuh)",
    submateriList: [
      "Kandungan Q.S. Al-Hujurat [49]: 13 tentang Keragaman Suku Bangsa sebagai Sunnatullah untuk Saling Mengenal",
      "Kandungan Q.S. Al-Kafirun [109]: 1-6 tentang Batasan Tegas Akidah dan Menghargai Kebebasan Beragama",
      "Hadis tentang Sikap Samhah (Lapang Dada dan Toleran) dalam Hubungan Muamalah Sosial",
      "Prinsip Moderasi Beragama (Wasathiyah), Menolak Ekstremisme, dan Merawat Persaudaraan Sebangsa"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Al-Qur'an Hadis"],
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya toleransi",
      "Membedakan batas toleransi sosial-kebangsaan dengan penjagaan kemurnian akidah ibadah.",
      "Merancang proyek kolaborasi kesiswaan lintas latar belakang untuk memperkuat kerukunan di sekolah."
    ],
    dalilReference: "Q.S. Al-Hujurat [49]: 13 & Q.S. Al-Kafirun [109]: 1-6 & H.R. Bukhari",
    dalilMeaning: "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal...",
    contextExamples: [
      "Bekerja sama dalam kerja bakti lingkungan dengan tetangga yang berbeda keyakinan",
      "Menghormati teman yang sedang beribadah tanpa mengganggu atau mengejek",
      "Menjaga batas akidah tanpa bersikap kasar atau mencaci keyakinan orang lain",
      "Menolak penyebaran ujaran kebencian berbau SARA di grup media sosial"
    ]
  },
  {
    id: 'viii-1-akidah',
    grade: 'VIII',
    semester: '1',
    element: "Akidah",
    tema: "Iman kepada Kitab-Kitab Allah Swt.",
    temaCode: "tema-viii-1-akidah-kitab",
    materi: "Makna Iman kepada Kitab-Kitab Allah Swt. dan Al-Qur'an sebagai Pedoman Hidup",
    submateriList: [
      "Mengenal 4 Kitab Suci Allah (Taurat, Zabur, Injil, Al-Qur'an) beserta Nabi Penerima dan Suhuf",
      "Kedudukan Al-Qur'an sebagai Kitab Terakhir, Penyempurna, Penjaga (Muhaimin), dan Pembeda (Al-Furqan)",
      "Cara Beriman kepada Kitab Sebelum Al-Qur'an dan Kewajiban Membaca, Mentadabburi, serta Mengamalkan Al-Qur'an",
      "Menjadikan Nilai Al-Qur'an sebagai Filter Menghadapi Dampak Negatif Budaya Global Populer"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akidah"],
    suggestedTpList: [
      "Menganalisis makna iman kepada kitab-kitab Allah Swt.",
      "Menganalisis fungsi Al-Qur'an sebagai Al-Furqan dalam memvalidasi kebenaran informasi dan tren budaya masa kini.",
      "Merancang program pembiasaan tilawah dan tadabbur Al-Qur'an mandiri bagi pelajar."
    ],
    dalilReference: "Q.S. Al-Baqarah [2]: 136 & Q.S. Al-Ma'idah [5]: 48",
    dalilMeaning: "Katakanlah: 'Kami beriman kepada Allah dan apa yang diturunkan kepada kami... dan kami tidak membeda-bedakan seorang pun di antara mereka...'",
    contextExamples: [
      "Mengklarifikasi nilai-nilai tren viral dengan ajaran Al-Qur'an sebelum mengikutinya",
      "Rutin tadarus Al-Qur'an setiap pagi sebelum memulai pelajaran sekolah",
      "Menghormati kitab-kitab suci yang pernah Allah turunkan kepada para nabi terdahulu",
      "Mengamalkan akhlak Qur'ani dalam tutur kata santun kepada guru dan orang tua"
    ]
  },
  {
    id: 'viii-1-akhlak',
    grade: 'VIII',
    semester: '1',
    element: "Akhlak",
    tema: "Menerapkan Makna Husnuzan (Prasangka Baik)",
    temaCode: "tema-viii-1-akhlak-husnuzan",
    materi: "Penerapan Makna Husnuzan kepada Allah Swt., Diri Sendiri, dan Sesama",
    submateriList: [
      "Pengertian dan Hakikat Husnuzan serta Bahaya Penyakit Hati Su'uzan (Buruk Sangka)",
      "Tiga Dimensi Husnuzan: kepada Allah Swt. (Ketetapan Takdir), Diri Sendiri (Optimis), dan Sesama (Berdamai)",
      "Bahaya Ghibah, Mencari Kesalahan Orang Lain (Tajassus), dan Fitnah di Lingkungan Sekolah serta Medsos",
      "Membiasakan Budaya Tabayyun (Verifikasi) dan Berpikir Positif dalam Menghadapi Kesalahpahaman"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akhlak"],
    suggestedTpList: [
      "Menerapkan makna husnuzan (prasangka baik)",
      "Menganalisis kasus tuduhan tanpa bukti di media sosial dan merumuskan respons etis berbasis husnuzan dan tabayyun.",
      "Merancang komitmen kelas bebas dari ghibah, fitnah, dan pergunjingan antarsiswa."
    ],
    dalilReference: "Q.S. Al-Hujurat [49]: 12 & Hadis Qudsi H.R. Bukhari",
    dalilMeaning: "Wahai orang-orang yang beriman! Jauhilah banyak dari prasangka, sesungguhnya sebagian prasangka itu dosa dan janganlah kamu mencari-cari kesalahan orang lain...",
    contextExamples: [
      "Tidak langsung menuduh teman mencuri saat kehilangan barang sebelum memeriksa dengan teliti",
      "Tetap berprasangka baik pada ketetapan Allah saat menghadapi kegagalan lomba",
      "Melakukan klarifikasi langsung (tabayyun) saat mendengar desas-desus tentang sahabat",
      "Menolak ikut bergosip atau menyebarkan tangkapan layar obrolan pribadi di grup kelas"
    ]
  },
  {
    id: 'viii-1-fikih',
    grade: 'VIII',
    semester: '1',
    element: "Fikih",
    tema: "Perintah Agama terhadap Penyelenggaraan Jenazah",
    temaCode: "tema-viii-1-fikih-jenazah",
    materi: "Ketentuan dan Analisis Perintah Agama terhadap Penyelenggaraan Jenazah (Fardhu Kifayah)",
    submateriList: [
      "Hukum Fardhu Kifayah dan Empat Kewajiban Muslim terhadap Jenazah: Memandikan, Mengafani, Menyalatkan, Menguburkan",
      "Tata Cara Memandikan dan Mengafani Jenazah dengan Menjaga Kehormatan serta Kerahasiaan Aib Mayit",
      "Tata Cara, Rukun, Bacaan Niat, Doa, dan Rangkaian Salat Jenazah 4 Takbir",
      "Tata Cara Pemakaman yang Syar'i serta Adab Takziyah dan Ziarah Kubur yang Menghibur Keluarga Duka"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Fikih"],
    suggestedTpList: [
      "Menganalisis perintah agama terhadap penyelenggaraan jenazah",
      "Mendemonstrasikan bacaan, rukun, dan tata cara salat jenazah 4 takbir secara tertib dan benar.",
      "Menyusun panduan adab takziyah syar'i yang menghibur keluarga yang berduka tanpa tradisi meratap."
    ],
    dalilReference: "H.R. Muslim & H.R. Tirmidzi tentang Hak Jenazah Muslim",
    dalilMeaning: "Hak seorang muslim atas muslim lainnya ada lima... salah satunya adalah mengiringi dan mengurus jenazahnya.",
    contextExamples: [
      "Mengikuti salat jenazah berjamaah di masjid lingkungan tempat tinggal",
      "Simulasi memandikan dan mengafani di laboratorium keagamaan sekolah",
      "Bertakziyah dengan mendoakan almarhum dan membawakan makanan bagi keluarga berduka",
      "Mengingat kematian sebagai pengingat agar senantiasa berbuat kebajikan"
    ]
  },
  {
    id: 'viii-1-spi',
    grade: 'VIII',
    semester: '1',
    element: "Sejarah Peradaban Islam",
    tema: "Peradaban Dinasti Fatimiyah",
    temaCode: "tema-viii-1-spi-fatimiyah",
    materi: "Sejarah, Perkembangan, dan Analisis Kemajuan Peradaban Dinasti Fatimiyah di Mesir",
    submateriList: [
      "Latar Belakang Berdirinya Dinasti Fatimiyah di Afrika Utara dan Pemindahan Ibu Kota ke Kairo (Mesir)",
      "Khalifah-Khalifah Terkemuka (Al-Mahdi, Al-Mu'izz Lidinillah, Al-Aziz) dan Kebijakannya",
      "Kemajuan Peradaban: Pendirian Universitas Al-Azhar, Perpustakaan Darul Hikmah, Sains, Arsitektur, dan Astronomi",
      "Ibrah Kemajuan Pendidikan Tinggi Islam, Pengaruh Al-Azhar bagi Dunia, dan Sikap Menghargai Keragaman"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Sejarah Peradaban Islam"],
    suggestedTpList: [
      "Menganalisis peradaban Dinasti Fatimiyah",
      "Menganalisis peran strategis pendirian Universitas Al-Azhar Kairo dalam transmisi keilmuan Islam lintas zaman.",
      "Menyusun refleksi nilai keteladanan kecintaan pada ilmu pengetahuan dari peradaban Dinasti Fatimiyah."
    ],
    dalilReference: "Q.S. Al-Mujadilah [58]: 11 & Q.S. Ali 'Imran [3]: 137",
    dalilMeaning: "Sesungguhnya telah berlalu sebelum kamu sunnah-sunnah (Allah); karena itu berjalanlah kamu di (muka) bumi dan perhatikanlah bagaimana akibat orang-orang yang mendustakan.",
    contextExamples: [
      "Menghargai warisan Universitas Al-Azhar sebagai mercusuar pendidikan moderasi Islam dunia",
      "Mengagumi arsitektur kota Kairo dan teknologi observatorium astronomi masa Fatimiyah",
      "Mengambil ibrah pentingnya perpustakaan umum dalam memfasilitasi riset masyarakat",
      "Mempelajari sejarah dengan sikap kritis dan objektif"
    ]
  },

  // =========================================================================
  // 4. KELAS VIII - SEMESTER 2
  // =========================================================================
  {
    id: 'viii-2-quran',
    grade: 'VIII',
    semester: '2',
    element: "Al-Qur'an Hadis",
    tema: "Pentingnya Cinta Tanah Air dalam Islam",
    temaCode: "tema-viii-2-quran-cinta-tanah-air",
    materi: "Ayat Al-Qur'an dan Hadis terkait Pentingnya Cinta Tanah Air dan Tanggung Jawab Kebangsaan",
    submateriList: [
      "Kajian Q.S. Al-Qashas [28]: 85 tentang Kerinduan Rasulullah Saw. kepada Tanah Airnya",
      "Hadis tentang Doa dan Kecintaan Nabi Muhammad Saw. kepada Negeri Makkah dan Madinah",
      "Konsep Hubbul Wathan Minal Iman: Kewajiban Menjaga Kedamaian, Persatuan, dan Kemakmuran Bangsa",
      "Peran Aktif Generasi Muda Muslim dalam Mengisi Kemerdekaan, Bela Negara, dan Menangkal Radikalisme"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Al-Qur'an Hadis"],
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya cinta tanah air",
      "Menganalisis dalil cinta tanah air dan peran aktif pelajar dalam menjaga keutuhan Negara Kesatuan Republik Indonesia.",
      "Merancang aksi nyata bela negara melalui prestasi akademik, disiplin, dan pengabdian masyarakat."
    ],
    dalilReference: "Q.S. Al-Qashas [28]: 85 & H.R. Tirmidzi",
    dalilMeaning: "Sesungguhnya Yang mewajibkan atasmu Al-Qur'an, benar-benar akan mengembalikan kamu ke tanah airmu...",
    contextExamples: [
      "Mengikuti upacara bendera hari Senin dengan khidmat sebagai bentuk syukur kemerdekaan",
      "Merawat fasilitas umum sekolah dan fasilitas publik lingkungan rumah",
      "Melestarikan kekayaan budaya nusantara yang selaras dengan nilai-nilai syariat",
      "Menangkal hoaks dan ujaran perpecahan politik yang mengancam persatuan bangsa"
    ]
  },
  {
    id: 'viii-2-akidah',
    grade: 'VIII',
    semester: '2',
    element: "Akidah",
    tema: "Iman kepada Rasul-Rasul Allah Swt.",
    temaCode: "tema-viii-2-akidah-rasul",
    materi: "Makna Iman kepada Rasul-Rasul Allah Swt. dan Keteladanan Ulul Azmi",
    submateriList: [
      "Pengertian Nabi dan Rasul, Dalil Kewajiban Beriman, dan Perbedaan Keduanya",
      "Sifat Wajib Rasul (Shiddiq, Amanah, Tabligh, Fathanah), Sifat Mustahil, dan Sifat Jaiz",
      "Mengenal 25 Nabi dan Rasul serta Keteladanan 5 Rasul Ulul Azmi (Nuh, Ibrahim, Musa, Isa, Muhammad Saw.)",
      "Mengimplementasikan Keteladanan Kejujuran, Kesabaran, dan Kegigihan Rasul dalam Kehidupan Pelajar"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akidah"],
    suggestedTpList: [
      "Menganalisis makna iman kepada rasul-rasul Allah Swt.",
      "Mengevaluasi implementasi sifat wajib rasul (terutama amanah dan fathanah) dalam kepengurusan kelas dan kegiatan belajar.",
      "Menyusun refleksi keteguhan hati rasul Ulul Azmi dalam menghadapi kegagalan dan tantangan hidup."
    ],
    dalilReference: "Q.S. An-Nisa' [4]: 136 & Q.S. Al-Ahqaf [46]: 35",
    dalilMeaning: "Maka bersabarlah engkau (Muhammad) sebagaimana kesabaran rasul-rasul yang memiliki keteguhan hati (Ulul Azmi)...",
    contextExamples: [
      "Meneladani sifat Shiddiq dengan berkata jujur meski dalam keadaan terjepit",
      "Meneladani sifat Fathanah dengan bersungguh-sungguh mengasah kecerdasan intelektual",
      "Meneladani kesabaran Nabi Nuh saat menghadapi ejekan dan penolakan dalam berbuat baik",
      "Menjaga amanah tugas kelompok dengan menyelesaikannya tepat waktu"
    ]
  },
  {
    id: 'viii-2-akhlak',
    grade: 'VIII',
    semester: '2',
    element: "Akhlak",
    tema: "Menerapkan Rasa Cinta kepada Rasulullah Muhammad Saw.",
    temaCode: "tema-viii-2-akhlak-cinta-rasul",
    materi: "Penerapan Rasa Cinta kepada Rasulullah Muhammad Saw. melalui Meneladani Akhlak Mulia dan Sunnah",
    submateriList: [
      "Hakikat Mencintai Rasulullah Saw. Melampaui Klaim Lisan dan Melebihi Cinta kepada Harta Benda",
      "Membiasakan Bershalawat, Mempelajari Sirah Nabawiyah, dan Menghidupkan Sunnah Harian",
      "Meneladani Akhlak Mulia Nabi Saw.: Menyantuni Anak Yatim, Lemah Lembut, Pemaaf, dan Teguh Membela Keadilan",
      "Menjaga Kemuliaan Ajaran Rasulullah Saw. dalam Interaksi Remaja di Era Modern"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akhlak"],
    suggestedTpList: [
      "Menerapkan rasa cinta kepada Rasulullah Muhammad saw.",
      "Menganalisis wujud nyata cinta kepada Rasulullah Saw. melalui sikap santun, adab makan/minum, dan pembelaan kaum lemah.",
      "Merancang panduan keteladanan akhlak Nabi Muhammad Saw. dalam bergaul dengan sesama teman di sekolah."
    ],
    dalilReference: "Q.S. Al-Ahzab [33]: 21 & Q.S. Ali 'Imran [3]: 31 & H.R. Bukhari",
    dalilMeaning: "Sungguh, telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu (yaitu) bagi orang yang mengharap (rahmat) Allah dan (kedatangan) hari kiamat dan dia banyak mengingat Allah.",
    contextExamples: [
      "Membiasakan memperbanyak membaca shalawat atas Nabi Muhammad Saw.",
      "Mempraktikkan adab makan dan minum sesuai sunnah (duduk, tangan kanan, basmalah)",
      "Meniru sikap Nabi yang tidak mendendam dan memaafkan orang yang bersalah",
      "Menyayangi dan membantu adik kelas serta anak-anak yatim piatu"
    ]
  },
  {
    id: 'viii-2-fikih',
    grade: 'VIII',
    semester: '2',
    element: "Fikih",
    tema: "Ketentuan Haji dan Umrah",
    temaCode: "tema-viii-2-fikih-haji-umrah",
    materi: "Ketentuan, Syarat, Rukun, Wajib, dan Rangkaian Manasik Haji serta Umrah",
    submateriList: [
      "Pengertian, Hukum, Dalil Kewajiban, dan Syarat Istitha'ah (Kemampuan Finansial, Fisik, Keamanan) Haji dan Umrah",
      "Rukun Haji (Ihram, Wukuf di Arafah, Tawaf Ifadhah, Sa'i, Tahallul, Tertib) dan Rukun Umrah",
      "Wajib Haji (Miqat Zamani & Makani, Mabit di Muzdalifah & Mina, Lempar Jumrah, Tawaf Wada') dan Dam",
      "Nilai Spiritual dan Sosial: Persaudaraan Universal Umat Islam dan Kesetaraan Manusia di Hadapan Allah Swt."
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Fikih"],
    suggestedTpList: [
      "Menganalisis ketentuan haji dan umrah",
      "Menganalisis tahapan manasik haji Tamattu', Ifrad, dan Qiran secara runtut serta pemenuhan rukun dan wajibnya.",
      "Merancang simulasi manasik haji terpadu di sekolah yang mengedepankan penghayatan nilai kesetaraan sosial."
    ],
    dalilReference: "Q.S. Ali 'Imran [3]: 97 & Q.S. Al-Baqarah [2]: 196",
    dalilMeaning: "Mengerjakan haji adalah kewajiban manusia terhadap Allah, yaitu bagi orang yang sanggup mengadakan perjalanan ke sana... Dan sempurnakanlah ibadah haji dan umrah karena Allah.",
    contextExamples: [
      "Menghayati filosofi pakaian ihram putih polos tanpa jahitan lambang kesetaraan manusia",
      "Menabung sejak dini dari uang saku untuk niat menunaikan ibadah ke Baitullah",
      "Mengikuti praktik peragaan manasik haji di lapangan sekolah",
      "Memahami nilai persatuan jutaan manusia dari berbagai benua di Padang Arafah"
    ]
  },
  {
    id: 'viii-2-spi',
    grade: 'VIII',
    semester: '2',
    element: "Sejarah Peradaban Islam",
    tema: "Peradaban Dinasti Turki Usmani",
    temaCode: "tema-viii-2-spi-turki-usmani",
    materi: "Sejarah, Masa Kejayaan, dan Kemajuan Peradaban Dinasti Turki Usmani",
    submateriList: [
      "Latar Belakang Berdirinya Dinasti Turki Usmani oleh Usman I dan Ekspansi Wilayah ke Tiga Benua",
      "Peristiwa Bersejarah Penaklukan Konstantinopel oleh Sultan Muhammad Al-Fatih (1453 M)",
      "Kemajuan Peradaban: Sistem Hukum Kanun Sultan Sulaiman Al-Qanuni, Militer Janissary, Arsitektur Masjid Biru, dan Sains",
      "Ibrah Kepemimpinan Visioner, Disiplin Belajar, dan Perlindungan Hak Warga Lintas Agama (Millet System)"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Sejarah Peradaban Islam"],
    suggestedTpList: [
      "Menganalisis peradaban Dinasti Turki Usmani",
      "Mengevaluasi strategi inovatif Sultan Muhammad Al-Fatih dalam memadukan keunggulan sains teknologi dan ketakwaan spiritual.",
      "Menyusun refleksi kepemimpinan muda berwawasan global yang memadukan keahlian strategis dan ketaatan ibadah."
    ],
    dalilReference: "H.R. Ahmad (Bisyarah Konstantinopel) & Q.S. Al-Fath [48]: 29",
    dalilMeaning: "Konstantinopel benar-benar akan ditaklukkan. Sebaik-baik pemimpin adalah pemimpinnya dan sebaik-baik pasukan adalah pasukan itu.",
    contextExamples: [
      "Meneladani kedisiplinan belajar Muhammad Al-Fatih yang menguasai banyak bahasa asing sejak belia",
      "Menjunjung tinggi etika toleransi perlindungan tempat ibadah agama lain sebagaimana dilakukan Sultan Al-Fatih",
      "Mempersiapkan diri dengan ilmu pengetahuan dan teknologi demi cita-cita besar",
      "Menghargai keindahan karya seni arsitektur Masjid Biru dan Hagia Sophia"
    ]
  },

  // =========================================================================
  // 5. KELAS IX - SEMESTER 1
  // =========================================================================
  {
    id: 'ix-1-quran',
    grade: 'IX',
    semester: '1',
    element: "Al-Qur'an Hadis",
    tema: "Pentingnya Semangat Keilmuan",
    temaCode: "tema-ix-1-quran-keilmuan",
    materi: "Ayat Al-Qur'an dan Hadis terkait Pentingnya Semangat Keilmuan dan Riset",
    submateriList: [
      "Kajian Q.S. Al-Mujadilah [58]: 11 dan Q.S. Az-Zumar [39]: 9 tentang Pengangkatan Derajat Orang Berilmu",
      "Hadis Riwayat Ibnu Majah tentang Kewajiban Menuntut Ilmu bagi Setiap Muslim (Thalabul 'Ilmi Faridhatun)",
      "Menjunjung Tinggi Integritas Kejujuran Akademik, Menolak Plagiarisme, dan Menghindari Joki Tugas di Era AI",
      "Peran Ilmu Pengetahuan dan Literasi Riset Remaja dalam Memberikan Kemanfaatan bagi Umat Manusia"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Al-Qur'an Hadis"],
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya semangat keilmuan",
      "Menganalisis kandungan Q.S. Al-Mujadilah: 11 dan menghubungkannya dengan etos riset mandiri di era digital.",
      "Merancang program aksi literasi keagamaan dan sains di sekolah berbasis inspirasi Al-Qur'an."
    ],
    dalilReference: "Q.S. Al-Mujadilah [58]: 11 & H.R. Ibnu Majah",
    dalilMeaning: "Allah akan mengangkat (derajat) orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu beberapa derajat. Dan Allah Mahateliti apa yang kamu kerjakan.",
    contextExamples: [
      "Pemanfaatan kecerdasan buatan (AI) secara kritis dan beretika tanpa melakukan plagiarisme",
      "Bersungguh-sungguh membaca jurnal ilmiah dan buku di perpustakaan sekolah",
      "Menghormati hak kekayaan intelektual karya orang lain dengan menyertakan sitasi rujukan",
      "Mendedikasikan ilmu yang dipelajari untuk kemaslahatan masyarakat banyak"
    ]
  },
  {
    id: 'ix-1-akidah',
    grade: 'IX',
    semester: '1',
    element: "Akidah",
    tema: "Iman kepada Hari Akhir",
    temaCode: "tema-ix-1-akidah-hari-akhir",
    materi: "Makna Iman kepada Hari Akhir dan Akuntabilitas Moral dalam Kehidupan",
    submateriList: [
      "Pengertian Kiamat Sugra dan Kubra serta Tanda-Tandanya Berdasarkan Dalil Naqli Al-Qur'an dan Hadis",
      "Tahapan Peristiwa Hari Kiamat: Alam Barzakh, Yaumul Ba'ats, Mahsyar, Hisab, Mizan, Sirath, hingga Surga dan Neraka",
      "Korelasi Iman kepada Hari Akhir dengan Rasa Tanggung Jawab Moral dan Akuntabilitas Diri",
      "Senantiasa Melakukan Muhasabah (Introspeksi Diri) atas Perbuatan Nyata dan Jejak Digital"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akidah"],
    suggestedTpList: [
      "Menganalisis makna iman kepada hari akhir",
      "Menganalisis hubungan antara keyakinan terhadap Hari Hisab dan Mizan dengan kebiasaan menjaga integritas moral.",
      "Merancang konsep muhasabah harian yang mentransformasi kebiasaan buruk menjadi kebajikan produktif."
    ],
    dalilReference: "Q.S. Al-Zalzalah [99]: 7-8 & Q.S. Al-Qari'ah [101]: 6-9",
    dalilMeaning: "Barangsiapa mengerjakan kebaikan seberat zarrah, dia akan melihat balasannya. Dan barangsiapa mengerjakan kejahatan seberat zarrah, dia akan melihat balasannya pula.",
    contextExamples: [
      "Sadar bahwa setiap ketikan dan unggahan di internet akan dihisab di akhirat",
      "Menolak kecurangan akademik dan manipulasi data tugas sekolah",
      "Mengorientasikan cita-cita hidup untuk kebahagiaan duniawi dan keselamatan akhirat",
      "Mempersiapkan bekal amal shalih sebanyak mungkin selagi masih diberi kesempatan hidup"
    ]
  },
  {
    id: 'ix-1-akhlak',
    grade: 'IX',
    semester: '1',
    element: "Akhlak",
    tema: "Menerapkan Makna Kasih Sayang kepada Sesama",
    temaCode: "tema-ix-1-akhlak-kasih-sayang-sesama",
    materi: "Penerapan Makna Kasih Sayang kepada Sesama, Empati Sosial, dan Menolak Perundungan",
    submateriList: [
      "Hakikat Sifat Kasih Sayang (Rahmah) sebagai Refleksi Asmaul Husna Ar-Rahman dan Ar-Rahim",
      "Prinsip Persaudaraan: Ukhuwah Islamiyah, Ukhuwah Wathaniyah, dan Ukhuwah Insaniyah dalam Pergaulan",
      "Mencegah Segala Bentuk Perundungan (Bullying Fisik, Verbal, dan Cyberbullying) di Lingkungan Madrasah",
      "Membiasakan Sikap Tolong-Menolong (Ta'awun), Berempati, Memaafkan, dan Menyantuni Kaum Lemah"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akhlak"],
    suggestedTpList: [
      "Menerapkan makna kasih sayang kepada sesama",
      "Menganalisis akar penyebab perundungan di kalangan remaja dan merumuskan respons akhlak Islami untuk mengatasinya.",
      "Merancang deklarasi 'Madrasah Ramah Anak Bebas Bullying' berbasis nilai kasih sayang dan ukhuwah."
    ],
    dalilReference: "H.R. Bukhari-Muslim tentang Persaudaraan & Q.S. Al-Ma'idah [5]: 2",
    dalilMeaning: "Tidak beriman salah seorang di antara kamu hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri... Dan tolong-menolonglah kamu dalam kebajikan dan takwa...",
    contextExamples: [
      "Menemani dan membela teman yang menjadi korban pengucilan di kelas",
      "Menggalang donasi sukarela untuk teman sekelas yang tertimpa musibah",
      "Menyelesaikan perselisihan teman dengan musyawarah yang damai dan saling memaafkan",
      "Menghindari panggilan ejekan bernada merendahkan fisik atau nama orang tua"
    ]
  },
  {
    id: 'ix-1-fikih',
    grade: 'IX',
    semester: '1',
    element: "Fikih",
    tema: "Ketentuan Penyembelihan Hewan, Kurban, dan Akikah",
    temaCode: "tema-ix-1-fikih-sembelihan-kurban",
    materi: "Ketentuan Syar'i Penyembelihan Hewan secara Ihsan, Ibadah Kurban, dan Akikah",
    submateriList: [
      "Ketentuan Syar'i Penyembelihan Hewan: Syarat Penyembelih, Hewan Halal, Alat Tajam, dan Prinsip Ihsan",
      "Ibadah Kurban (Udh-hiyah): Hukum, Syarat Hewan Bebas Cacat, Waktu Pelaksanaan Hari Raya Idul Adha & Tasyrik",
      "Ibadah Akikah: Hukum, Waktu Utama (Hari ke-7), Ketentuan Hewan Anak Laki-Laki dan Perempuan, serta Hikmahnya",
      "Perbandingan Pokok Tujuan, Kondisi Daging Dibagikan, dan Nilai Sosial-Spiritual Kurban vs Akikah"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Fikih"],
    suggestedTpList: [
      "Menganalisis ketentuan penyembelihan hewan, kurban, dan akikah",
      "Menganalisis prosedur penyembelihan hewan halal yang memenuhi kriteria syariat dan prinsip ihsan perlindungan hewan.",
      "Merancang kepanitiaan penyembelihan hewan kurban di sekolah yang higienis dan ramah lingkungan (eco-qurban)."
    ],
    dalilReference: "H.R. Muslim (Prinsip Ihsan) & Q.S. Al-Kautsar [108]: 2 & H.R. Tirmidzi",
    dalilMeaning: "Sesungguhnya Allah mewajibkan berbuat ihsan atas segala sesuatu. Jika kamu menyembelih, sembelihlah dengan cara yang baik dan pertajamlah pisaumu serta buatlah tenang sembelihanmu.",
    contextExamples: [
      "Memastikan pisau yang digunakan untuk menyembelih benar-benar tajam agar hewan tidak tersiksa",
      "Memilih hewan kurban yang sehat, cukup umur, dan tidak cacat fisik",
      "Mendistribusikan daging kurban kepada warga fakir miskin di sekitar sekolah",
      "Menggunakan wadah besek bambu alami ramah lingkungan pengganti kantong plastik sekali pakai"
    ]
  },
  {
    id: 'ix-1-spi',
    grade: 'IX',
    semester: '1',
    element: "Sejarah Peradaban Islam",
    tema: "Peradaban Dinasti Safawi",
    temaCode: "tema-ix-1-spi-safawi",
    materi: "Sejarah, Perkembangan, dan Analisis Kemajuan Seni Budaya Peradaban Dinasti Safawi di Persia",
    submateriList: [
      "Asal-Usul Dinasti Safawi dari Gerakan Tarekat Safawiyah di Ardabil hingga Berdirinya Kerajaan oleh Syah Ismail I",
      "Masa Keemasan di Bawah Kepemimpinan Syah Abbas I dan Pemindahan Ibu Kota ke Kota Indah Isfahan",
      "Kemajuan Peradaban: Arsitektur Spektakuler Masjid Syah, Lapangan Naqsh-e Jahan, Seni Karpet Persia, dan Perdagangan Internasional",
      "Ibrah Interaksi Antar-Peradaban, Perkembangan Estetika Arsitektur Islam, dan Faktor Kemunduran Dinasti"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Sejarah Peradaban Islam"],
    suggestedTpList: [
      "Memahami peradaban Dinasti Safawi",
      "Menganalisis peran kepemimpinan Syah Abbas I dalam membawa Dinasti Safawi mencapai puncak kemajuan arsitektur dan seni.",
      "Menyusun analisis kritis faktor pendukung kejayaan dan penyebab kemunduran Dinasti Safawi sebagai pelajaran sejarah."
    ],
    dalilReference: "Q.S. Al-Hajj [22]: 46 & Q.S. Al-Hasyr [59]: 2",
    dalilMeaning: "Maka tidakkah mereka berjalan di bumi lalu mempunyai akal yang dengan itu mereka dapat memahami... Maka ambillah pelajaran, wahai orang-orang yang mempunyai pandangan!",
    contextExamples: [
      "Mengapresiasi keindahan karya arsitektur dan tata kota Isfahan yang harmonis",
      "Meneladani semangat memajukan perdagangan dan kerajinan industri kreatif lokal",
      "Mengambil ibrah bahaya konflik internal dan perpecahan terhadap kelangsungan peradaban",
      "Memperluas wawasan sejarah bahwa peradaban Islam memiliki keragaman budaya yang kaya"
    ]
  },

  // =========================================================================
  // 6. KELAS IX - SEMESTER 2
  // =========================================================================
  {
    id: 'ix-2-quran',
    grade: 'IX',
    semester: '2',
    element: "Al-Qur'an Hadis",
    tema: "Pentingnya Sabar dalam Menghadapi Musibah dan Ujian",
    temaCode: "tema-ix-2-quran-sabar-musibah",
    materi: "Ayat Al-Qur'an dan Hadis terkait Pentingnya Sabar dalam Menghadapi Musibah dan Ujian",
    submateriList: [
      "Kajian Q.S. Al-Baqarah [2]: 155-157 tentang Hakikat Ujian Kehidupan dan Kalimat Istirja' (Inna Lillahi wa Inna Ilaihi Raji'un)",
      "Kajian Q.S. Al-Baqarah [2]: 45-46 tentang Menjadikan Sabar dan Salat sebagai Penolong dalam Menghadapi Kesulitan",
      "Hadis Riwayat Muslim tentang Keutamaan Mengagumkan Orang Beriman: Sabar saat Diuji dan Syukur saat Diberi Nikmat",
      "Membentuk Ketahanan Mental (Resiliensi Spiritual), Manajemen Emosi, dan Menghadapi Tekanan Ujian Menjelang Kelulusan"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Al-Qur'an Hadis"],
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya sabar dalam menghadapi musibah dan ujian",
      "Menganalisis pesan moral Q.S. Al-Baqarah: 155-157 dalam membentuk ketahanan mental saat menghadapi kegagalan atau musibah.",
      "Merancang konsep manajemen emosi dan spiritual remaja dalam menyikapi tekanan hidup dan ujian sekolah."
    ],
    dalilReference: "Q.S. Al-Baqarah [2]: 155-157 & H.R. Muslim",
    dalilMeaning: "Dan sungguh akan Kami berikan cobaan kepadamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa dan buah-buahan. Dan berikanlah berita gembira kepada orang-orang yang sabar.",
    contextExamples: [
      "Menghadapi kegagalan dalam seleksi masuk sekolah lanjutan dengan ikhlas dan terus berikhtiar",
      "Menyikapi musibah bencana alam dengan empati, doa, dan gotong royong memberikan bantuan",
      "Mengatasi kecemasan akademik melalui salat malam, doa, dan belajar tekun",
      "Mendampingi dan menghibur sahabat yang sedang berduka karena kehilangan anggota keluarga"
    ]
  },
  {
    id: 'ix-2-akidah',
    grade: 'IX',
    semester: '2',
    element: "Akidah",
    tema: "Iman kepada Qada dan Qadar",
    temaCode: "tema-ix-2-akidah-qada-qadar",
    materi: "Makna Iman kepada Qada dan Qadar serta Tawakal Proporsional",
    submateriList: [
      "Pengertian Qada dan Qadar, Dalil Kewajiban Beriman, dan Perbedaan Takdir Mubram serta Takdir Mu'allaq",
      "Hubungan Harmonis antara Ikhtiar Maksimal Manusia, Doa yang Tulus, dan Tawakal Pasrah kepada Allah Swt.",
      "Menghindari Sikap Fatalisme (Kepasrahan Buta tanpa Usaha) dan Kesombongan Intelektual atas Keberhasilan Diri",
      "Membangun Sikap Mental Tangguh, Pantang Menyerah, dan Optimis dalam Meraih Masa Depan serta Kelulusan"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akidah"],
    suggestedTpList: [
      "Menganalisis makna iman kepada qada dan qadar",
      "Menganalisis hubungan komplementer antara ikhtiar manusiawi, doa, dan kepasrahan tawakal kepada takdir ilahi.",
      "Merancang peta rencana cita-cita masa depan dengan memadukan kerja keras, doa, dan tawakal."
    ],
    dalilReference: "Q.S. Ar-Ra'd [13]: 11 & Q.S. At-Talaq [65]: 3 & H.R. Muslim",
    dalilMeaning: "Sesungguhnya Allah tidak mengubah keadaan suatu kaum sehingga mereka mengubah keadaan yang ada pada diri mereka sendiri... Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.",
    contextExamples: [
      "Belajar sungguh-sungguh menghadapi asesmen akhir jenjang lalu bertawakal menyerahkan hasil kepada Allah",
      "Tidak putus asa saat rencana belum terwujud dan mengambil hikmah positif di balik kegagalan",
      "Tetap rendah hati dan tidak menyombongkan diri saat meraih nilai tertinggi",
      "Menolak percaya pada ramalan nasib atau zodiak yang bertentangan dengan keimanan qada dan qadar"
    ]
  },
  {
    id: 'ix-2-akhlak',
    grade: 'IX',
    semester: '2',
    element: "Akhlak",
    tema: "Menerapkan Makna Kasih Sayang kepada Lingkungan Alam",
    temaCode: "tema-ix-2-akhlak-lingkungan-alam",
    materi: "Penerapan Makna Kasih Sayang kepada Lingkungan Alam dan Tanggung Jawab Ekologis Pelajar",
    submateriList: [
      "Mandat Manusia sebagai Khalifah fil Ardh (Pemakmur Bumi) dan Larangan Merusak Ekosistem Alam Semesta",
      "Tuntunan Islam dalam Menjaga Alam: Penghijauan (Menanam Pohon), Hemat Air Wudhu, dan Menyayangi Flora serta Fauna",
      "Aksi Nyata Menghadapi Krisis Iklim: Diet Sampah Plastik, Pengelolaan Sampah Sekolah (Adiwiyata), dan Hemat Energi",
      "Tanggung Jawab Etis dan Moral Generasi Muda Muslim dalam Mewariskan Bumi yang Lestari bagi Generasi Mendatang"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Akhlak"],
    suggestedTpList: [
      "Menerapkan makna kasih sayang kepada lingkungan alam",
      "Mengevaluasi dampak pemborosan sumber daya dan pencemaran sampah plastik terhadap krisis ekologi dari perspektif Islam.",
      "Merancang gerakan 'Green Madrasah / Eco-School' berbasis akhlak pelestarian lingkungan hidup."
    ],
    dalilReference: "Q.S. Ar-Rum [30]: 41 & Q.S. Al-A'raf [7]: 56 & H.R. Bukhari-Muslim",
    dalilMeaning: "Telah tampak kerusakan di darat dan di laut disebabkan karena perbuatan tangan manusia, agar Allah merasakan kepada mereka sebagian dari (akibat) perbuatan mereka, agar mereka kembali...",
    contextExamples: [
      "Membawa tempat makan dan tumbler minum sendiri untuk meminimalisasi timbulan sampah plastik",
      "Menghemat penggunaan air saat berwudhu di tempat wudhu sekolah",
      "Aktif merawat tanaman dan ikut kegiatan menanam pohon di lingkungan sekitar",
      "Mematikan lampu dan kipas angin kelas saat ruangan tidak digunakan"
    ]
  },
  {
    id: 'ix-2-fikih',
    grade: 'IX',
    semester: '2',
    element: "Fikih",
    tema: "Ketentuan Rukhsah dalam Perspektif Mazhab Fikih",
    temaCode: "tema-ix-2-fikih-rukhsah-mazhab",
    materi: "Ketentuan Rukhsah (Keringanan Ibadah) dalam Perspektif Mazhab Fikih",
    submateriList: [
      "Konsep dan Hakikat Rukhsah: Wujud Kasih Sayang Syariat Islam berlandaskan Kaidah 'Al-Masyaqqatu Tajlibut Taisir'",
      "Ketentuan Salat Jamak Taqdim dan Jamak Ta'khir serta Salat Qashar bagi Musafir menurut Perspektif Mazhab Fikih",
      "Rukhsah bagi Orang Sakit (Tata Cara Salat Duduk/Berbaring) dan Keringanan Puasa Ramadhan bagi Kondisi Khusus",
      "Menumbuhkan Sikap Bijaksana, Lapang Dada, dan Menghargai Perbedaan Pandangan antar Mazhab Fikih"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Fikih"],
    suggestedTpList: [
      "Menganalisis ketentuan rukhsah (kemudahan) dalam perspektif mazhab fikih",
      "Menganalisis skenario perjalanan jauh atau kondisi darurat dan menentukan kombinasi rukhsah salat yang sah.",
      "Merancang bagan alur penentuan rukhsah ibadah salat bagi musafir dan orang sakit sesuai ketentuan mazhab."
    ],
    dalilReference: "Q.S. Al-Baqarah [2]: 185 & Q.S. An-Nisa' [4]: 101",
    dalilMeaning: "Allah menghendaki kemudahan bagimu, dan tidak menghendaki kesukaran bagimu... Dan apabila kamu bepergian di bumi, maka tidaklah mengapa kamu men-qashar salat...",
    contextExamples: [
      "Melaksanakan salat jamak qashar saat kegiatan perkemahan pramuka di luar kota",
      "Menjalankan salat dengan posisi duduk saat sedang sakit kaki atau dirawat di rumah sakit",
      "Menghormati teman yang mengambil rukhsah salat jamak saat perjalanan darat lintas provinsi",
      "Tidak memaksakan diri beribadah melebihi kemampuan saat kondisi darurat"
    ]
  },
  {
    id: 'ix-2-spi',
    grade: 'IX',
    semester: '2',
    element: "Sejarah Peradaban Islam",
    tema: "Peradaban Dinasti Mughal",
    temaCode: "tema-ix-2-spi-mughal",
    materi: "Sejarah, Masa Kejayaan, dan Kemajuan Peradaban Dinasti Mughal di India",
    submateriList: [
      "Sejarah Berdirinya Dinasti Mughal di India oleh Zahiruddin Babur dan Perkembangannya",
      "Masa Kejayaan di Bawah Kepemimpinan Sultan Akbar, Jahangir, dan Syah Jahan",
      "Kemajuan Peradaban dan Mahakarya Arsitektur Dunia: Taj Mahal, Benteng Merah (Red Fort), dan Masjid Jama Delhi",
      "Ibrah Pengelolaan Keragaman Multikultural, Kemajuan Ekonomi Agraris, dan Pelajaran dari Runtuhnya Kerajaan"
    ],
    officialCp: OFFICIAL_CP_PAIBP_FASED["Sejarah Peradaban Islam"],
    suggestedTpList: [
      "Menganalisis peradaban Dinasti Mughal",
      "Menganalisis mahakarya seni arsitektur Taj Mahal dan peradaban Dinasti Mughal dalam sejarah peradaban Islam dunia.",
      "Menyusun pelajaran sejarah tentang pengelolaan kerukunan multikultural pada masa Dinasti Mughal di India."
    ],
    dalilReference: "Q.S. Yusuf [12]: 111 & Q.S. Al-Hujurat [49]: 13",
    dalilMeaning: "Sungguh, pada kisah-kisah mereka itu terdapat pelajaran bagi orang-orang yang mempunyai akal sehat...",
    contextExamples: [
      "Mengagumi keajaiban dunia Taj Mahal sebagai simbol keagungan arsitektur Islam di India",
      "Mengambil ibrah pentingnya kepemimpinan yang adil dan mengayomi masyarakat majemuk",
      "Menyadari pentingnya menjaga persatuan agar kekuasaan dan kejayaan peradaban tidak runtuh",
      "Mengembangkan apresiasi terhadap warisan sejarah dan seni budaya global"
    ]
  }
];
