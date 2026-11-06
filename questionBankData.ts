import { QuestionItem, BloomLevel, SoloLevel, DeepLearningDimension, DifficultyLevel, PaibpElement } from '../types';

export interface BankQuestionRecord extends QuestionItem {
  id: string;
  grade: 'VII' | 'VIII' | 'IX';
  semester: '1' | '2';
  temaId: string;
  source: 'Kurikulum Merdeka 2026' | 'Kemdikbudristek' | 'Kemenag RI' | 'MGMP PAIBP SMP';
}

/**
 * BANK SOAL LENGKAP PAIBP SMP/MTs FASE D (KELAS VII, VIII, IX)
 * Tersinkronisasi presisi sesuai Alur Tujuan Pembelajaran (ATP) dan Breakdown Materi
 */
export const COMPREHENSIVE_QUESTION_BANK: BankQuestionRecord[] = [
  // =========================================================================
  // 1. KELAS VII - SEMESTER 1
  // =========================================================================
  {
    id: 'bank-q-vii-1-quran-iman',
    number: 1,
    grade: 'VII',
    semester: '1',
    element: "Al-Qur'an Hadis",
    temaId: 'tema-vii-1-quran-iman',
    tema: 'Pentingnya Iman dalam Kehidupan Seorang Muslim',
    tp: 'Menganalisis ayat Al-Qur\'an dan hadis terkait pentingnya iman dalam kehidupan seorang Muslim',
    materi: 'Ayat Al-Qur\'an dan Hadis terkait Pentingnya Iman dalam Kehidupan Seorang Muslim',
    submateri: 'Hakikat Keimanan dalam Q.S. Al-Anfal: 2-4 dan Hadis Jibril',
    indicator: 'Disajikan studi kasus integritas siswa saat ujian mandiri, peserta didik dapat menganalisis peran iman sebagai pembimbing moral sesuai Q.S. Al-Anfal: 2-4.',
    stimulus: 'Faris sedang mengerjakan ujian daring tanpa kamera pengawas. Di sampingnya terdapat catatan ringkasan yang belum disimpan. Teman di seberang mengajaknya bertukar jawaban melalui pesan singkat. Faris teringat ayat bahwa mukmin sejati senantiasa bergetar hatinya saat mengingat keagungan Allah Swt., sehingga ia memilih menutup catatan dan menolak ajakan curang.',
    operationalVerb: 'Menganalisis korelasi keimanan dan integritas moral',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Berdasarkan peristiwa tersebut, keputusan yang diambil Faris paling mendalam mencerminkan hakikat iman dalam Q.S. Al-Anfal [8]: 2-4 karena...',
    options: [
      { key: 'A', text: 'Mewujudkan keyakinan hati dalam tindakan nyata dengan mengutamakan kejujuran sebagai bukti getaran ketakwaan kepada Allah Swt.' },
      { key: 'B', text: 'Menghindari risiko sanksi pengurangan nilai dari guru pengawas sekolah jika percakapan pesan singkatnya terbongkar.' },
      { key: 'C', text: 'Mempertahankan reputasi sebagai siswa teladan di kelas agar tetap mendapatkan apresiasi dari teman-temannya.' },
      { key: 'D', text: 'Meyakini kemampuan intelektual pribadi lebih unggul sehingga tidak memerlukan bantuan orang lain.' }
    ],
    correctKey: 'A',
    explanation: 'Pilihan A menghubungkan keyakinan hati (iman batin) dengan integritas perilaku nyata sesuai hakikat Q.S. Al-Anfal ayat 2-4.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: menunjukkan relational deep learning.',
      B: 'Orientasi lahiriah pragmatis karena takut sanksi, bukan kesadaran iman.',
      C: 'Sikap riya/pencitraan yang bertentangan dengan keikhlasan iman.',
      D: 'Sikap ujub/kesombongan intelektual.'
    },
    islamicValue: 'Integritas Iman, Muraqabah, dan Kejujuran Akademik',
    realLifeContext: 'Ujian mandiri tanpa pengawas dan godaan kecurangan digital',
    dalilReference: 'Q.S. Al-Anfal [8]: 2-4 & H.R. Muslim',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-vii-1-akidah-sifat',
    number: 2,
    grade: 'VII',
    semester: '1',
    element: 'Akidah',
    temaId: 'tema-vii-1-akidah-sifat',
    tema: 'Makna Iman kepada Allah Swt. dan Peneguh Keimanan',
    tp: 'Menganalisis makna iman kepada Allah Swt. melalui sifat-sifat-Nya dan hal-hal yang dapat meneguhkan iman',
    materi: 'Makna Iman kepada Allah Swt. melalui Sifat-Sifat-Nya dan Hal-Hal yang Meneguhkan Iman',
    submateri: 'Pengamalan Asmaul Husna Al-Bashir dan Al-\'Alim dalam Kehidupan Sehari-hari',
    indicator: 'Disajikan situasi pengelolaan kas kelas, peserta didik dapat menganalisis pengamalan Asmaul Husna Al-Bashir dalam menjaga amanah.',
    stimulus: 'Salma diamanahi menjadi bendahara kelas VII-A. Suatu hari setelah kegiatan bazar sekolah, terkumpul sisa uang kas sejumlah Rp150.000 yang belum sempat dicatat dalam buku kas resmi. Saat teman-temannya sudah pulang dan ia sendirian di kelas, Salma tetap mencatat uang tersebut secara teliti tanpa mengambil sedikit pun.',
    operationalVerb: 'Menganalisis penerapan Asmaul Husna Al-Bashir dalam menjaga amanah',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Tindakan Salma yang teliti dan jujur mencatat seluruh sisa kas kelas paling selaras dengan penghayatan Asmaul Husna Al-Bashir karena...',
    options: [
      { key: 'A', text: 'Meyakini secara teguh bahwa Allah Swt. Maha Melihat setiap amal perbuatan manusia baik yang tampak maupun tersembunyi.' },
      { key: 'B', text: 'Menghindari rasa malu jika suatu saat ada pengurus kelas lain yang menanyakan rincian uang sisa bazar.' },
      { key: 'C', text: 'Menunjukkan keterampilan pembukuan administrasi yang rapi demi memperoleh pujian dari wali kelas.' },
      { key: 'D', text: 'Menjalankan kewajiban bendahara sekadar formalitas peraturan organisasi kesiswaan sekolah.' }
    ],
    correctKey: 'A',
    explanation: 'Asmaul Husna Al-Bashir bermakna Allah Maha Melihat segala sesuatu. Kesadaran bahwa Allah senantiasa mengawasi mendorong Salma bersikap jujur dan amanah.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: integrasi akidah tauhid dalam tindakan konkret.',
      B: 'Motivasi rasa takut pada manusia, bukan ketakwaan ilahi.',
      C: 'Dorongan mencari pujian (riya\') yang merusak keikhlasan.',
      D: 'Ketaatan formalistis tanpa penghayatan nilai spiritual.'
    },
    islamicValue: 'Amanah, Meneladani Asmaul Husna, dan Tanggung Jawab Moral',
    realLifeContext: 'Pengelolaan dana kas kelas dan kejujuran bendahara',
    dalilReference: 'Q.S. Al-Hadid [57]: 4 & Q.S. Al-A\'raf [7]: 180',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-vii-1-akhlak-ikhlas',
    number: 3,
    grade: 'VII',
    semester: '1',
    element: 'Akhlak',
    temaId: 'tema-vii-1-akhlak-ikhlas',
    tema: 'Menerapkan Makna Ikhlas',
    tp: 'Menerapkan makna ikhlas',
    materi: 'Penerapan Makna Ikhlas dalam Niat, Ibadah, dan Perilaku Keseharian',
    submateri: 'Menjaga Kemurnian Niat dari Bahaya Riya\' dan Flexing di Media Sosial',
    indicator: 'Disajikan narasi kegiatan sosial siswa, peserta didik dapat mengevaluasi penerapan makna ikhlas dari bahaya flexing media sosial.',
    stimulus: 'Kelompok belajar Ahmad mengadakan bakti sosial menyumbangkan buku dan perlengkapan sekolah ke panti asuhan. Salah seorang anggota mengusulkan untuk merekam video wajah anak-anak panti secara dramatis untuk dijadikan konten video pendek di media sosial agar mendapatkan banyak "likes". Ahmad menolak usulan tersebut dan menyarankan agar dokumentasi cukup berupa arsip laporan tanpa mengekspos anak-anak panti.',
    operationalVerb: 'Mengevaluasi penerapan nilai ikhlas dalam kegiatan filantropi remaja',
    bloomLevel: 'C5',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sulit',
    questionType: 'Pilihan Ganda',
    questionText: 'Tindakan penolakan yang disarankan oleh Ahmad paling tepat mencerminkan penerapan makna ikhlas karena...',
    options: [
      { key: 'A', text: 'Menjaga kemurnian niat lillahi ta\'ala serta menghormati martabat penerima bantuan dari motif flexing popularitas di media sosial.' },
      { key: 'B', text: 'Menghemat waktu dan kuota internet yang diperlukan untuk mengunggah video ke platform media sosial.' },
      { key: 'C', text: 'Menghindari teguran guru pembimbing yang mungkin tidak menyetujui pembuatan konten video sekolah.' },
      { key: 'D', text: 'Menyimpan dokumentasi secara rahasia agar kelompok lain tidak dapat meniru program kerja bakti sosial tersebut.' }
    ],
    correctKey: 'A',
    explanation: 'Ikhlas bermakna memurnikan amal semata-mata karena Allah Swt. Menolak mengeksploitasi anak panti demi likes media sosial menjaga kemurnian niat dari penyakit riya dan sum\'ah serta menjaga kehormatan kaum dhuafa.',
    distractorExplanation: {
      A: 'Pilihan tepat: mengaitkan hakikat ikhlas dengan etika sosial Islami.',
      B: 'Alasan teknis hemat kuota yang tidak relevan dengan konsep ikhlas.',
      C: 'Kepatuhan lahiriah karena takut teguran, bukan kesadaran tauhid.',
      D: 'Sikap egois yang bertentangan dengan semangat fastabiqul khairat.'
    },
    islamicValue: 'Ikhlas Lillahi Ta\'ala, Menghindari Riya\', dan Menjaga Martabat Sesama',
    realLifeContext: 'Kegiatan bakti sosial pelajar dan godaan konten flexing media sosial',
    dalilReference: 'Q.S. Al-Bayyinah [98]: 5 & H.R. Bukhari',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-vii-1-fikih-sujud',
    number: 4,
    grade: 'VII',
    semester: '1',
    element: 'Fikih',
    temaId: 'tema-vii-1-fikih-sujud',
    tema: 'Ketentuan Macam-Macam Sujud',
    tp: 'Menganalisis ketentuan macam-macam sujud (sujud syukur, sahwi, dan tilawah)',
    materi: 'Ketentuan Macam-Macam Sujud (Sujud Syukur, Sujud Sahwi, dan Sujud Tilawah)',
    submateri: 'Sebab dan Tata Cara Sujud Sahwi saat Terjadi Keraguan Rakaat Salat',
    indicator: 'Disajikan studi kasus keraguan salat berjamaah, peserta didik dapat menentukan tindakan sujud sahwi yang sah menurut fikih.',
    stimulus: 'Pada pelaksanaan salat Isya berjamaah di musala sekolah, imam lupa tidak melakukan duduk tasyahud awal dan langsung berdiri ke rakaat ketiga. Makmum sempat mengingatkan dengan tasbih "Subhanallah", namun imam telah berdiri tegak dan melanjutkan salat hingga rakaat keempat. Menjelang salam, imam melakukan sujud sahwi.',
    operationalVerb: 'Menganalisis prosedur sujud sahwi dalam salat berjamaah',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Tindakan imam dan makmum yang paling tepat dan sah sesuai ketentuan fikih sujud sahwi adalah...',
    options: [
      { key: 'A', text: 'Imam meneruskan salat sampai selesai lalu melakukan dua kali sujud sahwi sebelum salam, dan makmum wajib mengikuti sujud sahwi imam.' },
      { key: 'B', text: 'Imam wajib kembali duduk tasyahud awal saat diingatkan makmum meskipun sudah berdiri tegak membaca Al-Fatihah.' },
      { key: 'C', text: 'Salat berjamaah batal seketika dan seluruh jamaah wajib mengulang salat Isya dari awal rakaat pertama.' },
      { key: 'D', text: 'Imam tidak perlu melakukan sujud sahwi karena tasyahud awal hanyalah sunnah hai\'at yang tidak perlu diganti.' }
    ],
    correctKey: 'A',
    explanation: 'Tasyahud awal adalah sunnah ab\'adh. Jika imam sudah berdiri tegak, ia tidak boleh kembali duduk. Kekurangan tersebut diganti dengan melakukan dua kali sujud sahwi sebelum salam, dan makmum wajib mengikutinya.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat sesuai kaidah fikih mazhab Syafi\'i.',
      B: 'Keliru, kembali duduk setelah berdiri tegak justru dapat membatalkan salat jika disengaja.',
      C: 'Keliru, meninggalkan sunnah ab\'adh tidak membatalkan salat.',
      D: 'Keliru, tasyahud awal adalah sunnah ab\'adh, bukan sunnah hai\'at.'
    },
    islamicValue: 'Disiplin Ibadah, Ketertiban Berjamaah, dan Pemahaman Fikih yang Shahih',
    realLifeContext: 'Salat berjamaah di sekolah dan kasus keraguan imam/makmum',
    dalilReference: 'H.R. Muslim & Kitab Fathul Qarib Al-Mujib',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-vii-1-spi-umayyah',
    number: 5,
    grade: 'VII',
    semester: '1',
    element: 'Sejarah Peradaban Islam',
    temaId: 'tema-vii-1-spi-umayyah',
    tema: 'Peradaban Daulah Bani Umayyah',
    tp: 'Menganalisis peradaban Bani Umayyah',
    materi: 'Sejarah dan Analisis Kemajuan Peradaban Daulah Bani Umayyah di Damaskus dan Andalusia',
    submateri: 'Integritas Fiskal dan Kepemimpinan Keadilan Khalifah Umar bin Abdul Aziz',
    indicator: 'Disajikan kisah kepemimpinan Khalifah Umar bin Abdul Aziz, peserta didik dapat menganalisis relevansi integritas fiskal bagi tata kelola organisasi siswa.',
    stimulus: 'Ketika Khalifah Umar bin Abdul Aziz bekerja di ruang kerjanya pada malam hari, putranya datang untuk membicarakan urusan keluarga. Khalifah segera mematikan lampu minyak milik negara dan menyalakan lilin pribadi miliknya. Beliau menolak menggunakan fasilitas negara yang dibeli dari uang rakyat untuk urusan pribadi keluarganya.',
    operationalVerb: 'Menganalisis nilai keteladanan integritas fiskal kepemimpinan Islam',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Pelajaran kepemimpinan (ibrah) yang paling mendasar dari keteladanan Khalifah Umar bin Abdul Aziz untuk diterapkan pengurus organisasi OSIS adalah...',
    options: [
      { key: 'A', text: 'Memisahkan secara tegas antara aset organisasi dengan kepentingan pribadi serta menjaga transparansi amanah dana bersama.' },
      { key: 'B', text: 'Menolak menggunakan fasilitas listrik sekolah selama menjalankan kegiatan rapat kepengurusan OSIS.' },
      { key: 'C', text: 'Melarang anggota keluarga hadir atau berkunjung ke lingkungan sekolah saat jam pelajaran berlangsung.' },
      { key: 'D', text: 'Membebankan seluruh pengeluaran kegiatan kesiswaan kepada kas pribadi ketua organisasi.' }
    ],
    correctKey: 'A',
    explanation: 'Keteladanan Khalifah Umar bin Abdul Aziz mengajarkan integritas tinggi dalam membedakan harta negara/publik dengan urusan pribadi (akuntabilitas dan transparansi moral).',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: abstraksi nilai integritas ke konteks modern.',
      B: 'Penerapan harfiah keliru yang menghambat efektivitas organisasi.',
      C: 'Tindakan berlebihan yang tidak sesuai esensi keteladanan.',
      D: 'Keliru, organisasi harus dikelola dengan anggaran yang sehat dan transparan.'
    },
    islamicValue: 'Integritas Kepemimpinan, Akuntabilitas Fiskal, dan Keadilan Amanah',
    realLifeContext: 'Pengelolaan anggaran kas OSIS dan pemanfaatan fasilitas sekolah',
    dalilReference: 'Q.S. An-Nisa\' [4]: 58 & Tarikh Khulafa',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },

  // =========================================================================
  // 2. KELAS VII - SEMESTER 2
  // =========================================================================
  {
    id: 'bank-q-vii-2-quran-takwa',
    number: 6,
    grade: 'VII',
    semester: '2',
    element: "Al-Qur'an Hadis",
    temaId: 'tema-vii-2-quran-takwa',
    tema: 'Pentingnya Takwa kepada Allah Swt.',
    tp: 'Menganalisis ayat Al-Qur\'an dan hadis terkait pentingnya takwa kepada Allah Swt.',
    materi: 'Ayat Al-Qur\'an dan Hadis terkait Pentingnya Takwa kepada Allah Swt.',
    submateri: 'Karakter Muttaqin dalam Q.S. Ali \'Imran: 102 dan Hadis Ittaqillaha Haitsuma Kunta',
    indicator: 'Disajikan studi kasus pergaulan remaja di dunia maya, peserta didik dapat menganalisis implementasi wasiat takwa di mana pun berada.',
    stimulus: 'Rasulullah Saw. berwasiat dalam hadis riwayat Tirmidzi: "Bertakwalah kepada Allah di mana pun engkau berada, dan ikutilah keburukan dengan kebaikan niscaya akan menghapusnya, serta bergaullah dengan manusia dengan akhlak terpuji." Zidan mengamalkan hadis ini dengan tetap bertutur kata sopan di grup media sosial dan tidak menggunakan kata-kata kotor meskipun teman-temannya sedang saling mengejek.',
    operationalVerb: 'Menganalisis implementasi ketakwaan di berbagai ruang kehidupan',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Penerapan takwa yang ditunjukkan Zidan selaras dengan wasiat Rasulullah Saw. karena...',
    options: [
      { key: 'A', text: 'Konsisten menjaga kepatuhan syariat dan adab lisan di ruang digital sebagaimana di ruang nyata karena meyakini takwa tidak dibatasi tempat.' },
      { key: 'B', text: 'Menghindari debat daring semata-mata agar tidak dikeluarkan dari keanggotaan grup percakapan teman sekolah.' },
      { key: 'C', text: 'Menunjukkan kepada teman sekelas bahwa dirinya lebih menguasai tata krama komunikasi dibandingkan anggota lainnya.' },
      { key: 'D', text: 'Menunggu arahan dari guru PAI sebelum berani mengekspresikan pendapat di ruang percakapan media sosial.' }
    ],
    correctKey: 'A',
    explanation: 'Wasiat "Ittaqillaha haitsuma kunta" (Bertakwalah di mana pun berada) mencakup ruang nyata dan ruang digital. Takwa sejati adalah konsistensi menjaga adab tanpa terpengaruh lingkungan.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: menunjukkan esensi takwa universal.',
      B: 'Motivasi pragmatis takut dikeluarkan grup.',
      C: 'Sikap ujub yang merusak nilai ketakwaan.',
      D: 'Ketergantungan pasif tanpa inisiatif kesadaran mandiri.'
    },
    islamicValue: 'Konsistensi Takwa, Menjaga Lisan, dan Akhlak Digital',
    realLifeContext: 'Etika berkomunikasi di grup WhatsApp kelas dan media sosial',
    dalilReference: 'H.R. Tirmidzi & Q.S. Ali \'Imran [3]: 102',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-vii-2-akidah-malaikat',
    number: 7,
    grade: 'VII',
    semester: '2',
    element: 'Akidah',
    temaId: 'tema-vii-2-akidah-malaikat',
    tema: 'Iman kepada Malaikat-Malaikat Allah Swt.',
    tp: 'Menganalisis makna iman kepada malaikat-malaikat Allah Swt.',
    materi: 'Makna Iman kepada Malaikat-Malaikat Allah Swt. dan Pengawasan Moral',
    submateri: 'Tugas Malaikat Raqib dan Atid serta Penanaman Karakter Muraqabah',
    indicator: 'Disajikan situasi transaksi kantin kejujuran, peserta didik dapat menganalisis kesadaran pengawasan malaikat Raqib-Atid dalam mengendalikan diri.',
    stimulus: 'Di kantin kejujuran sekolah, makanan diletakkan di meja tanpa penjaga dan siswa memasukkan uang pembayaran ke kotak yang tersedia. Seorang siswa melihat uang kembalian berlebih di kotak karena ada pembeli sebelumnya yang salah meletakkan uang. Siswa tersebut tidak mengambil uang berlebih itu, melainkan hanya mengambil haknya dan mencatat kekurangan kas di buku catatan kantin.',
    operationalVerb: 'Menganalisis dampak iman kepada malaikat Raqib dan Atid',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Sikap siswa tersebut paling tepat menggambarkan dampak keimanan kepada malaikat Allah Swt. karena...',
    options: [
      { key: 'A', text: 'Menghadirkan kesadaran muraqabah bahwa malaikat Raqib dan Atid mencatat seluruh perbuatan secara teliti tanpa ada yang terlewatkan.' },
      { key: 'B', text: 'Khawatir terdapat kamera pengawas CCTV tersembunyi yang merekam tindakannya saat berada di kantin.' },
      { key: 'C', text: 'Menginginkan pujian dari pengelola kantin sekolah sebagai siswa yang paling berintegritas.' },
      { key: 'D', text: 'Merasa nilai uang tersebut terlalu kecil untuk diambil sehingga tidak sebanding dengan risikonya.' }
    ],
    correctKey: 'A',
    explanation: 'Iman kepada malaikat Raqib dan Atid menumbuhkan muraqabah: keyakinan bahwa setiap perbuatan diawasi dan dicatat oleh malaikat Allah, menahan diri dari kecurangan lahir batin.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: menunjukkan kesadaran iman eskatologis.',
      B: 'Takut pada pengawasan teknologi kamera duniawi.',
      C: 'Mencari pujian manusia (riya\').',
      D: 'Perhitungan materi sempit tanpa dasar nilai agama.'
    },
    islamicValue: 'Muraqabah, Integritas Kejujuran, dan Iman kepada Malaikat',
    realLifeContext: 'Transaksi di kantin kejujuran sekolah',
    dalilReference: 'Q.S. Qaf [50]: 16-18 & Q.S. Al-Infithar [82]: 10-12',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-vii-2-akhlak-syukur',
    number: 8,
    grade: 'VII',
    semester: '2',
    element: 'Akhlak',
    temaId: 'tema-vii-2-akhlak-syukur',
    tema: 'Menerapkan Makna Bersyukur kepada Allah Swt.',
    tp: 'Menerapkan makna bersyukur kepada Allah Swt.',
    materi: 'Penerapan Makna Bersyukur kepada Allah Swt. dalam Sikap dan Perbuatan',
    submateri: 'Tiga Dimensi Syukur: Hati (Qalbi), Lisan (Hamdalah), dan Perbuatan Nyata (Amali)',
    indicator: 'Disajikan studi kasus perayaan kelulusan atau prestasi siswa, peserta didik dapat merancang bentuk syukur amali yang bermanfaat bagi sesama.',
    stimulus: 'Setelah memenangkan lomba cerdas cermat tingkat kabupaten, regu SMP Bina Insan menerima hadiah uang tunai dan trofi. Beberapa teman mengusulkan agar seluruh uang hadiah dihabiskan untuk makan-makan pesta mewah di restoran cepat saji. Ketua regu mengusulkan alternatif: mengadakan syukuran sederhana dan mengalokasikan sebagian besar dana untuk membelikan buku bacaan bagi perpustakaan musala desa.',
    operationalVerb: 'Mengevaluasi bentuk perwujudan syukur amali yang maslahat',
    bloomLevel: 'C5',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Usulan ketua regu paling tepat merefleksikan makna hakiki bersyukur kepada Allah Swt. (Q.S. Ibrahim: 7) karena...',
    options: [
      { key: 'A', text: 'Mentransformasikan nikmat keberhasilan ke dalam amal kebaikan yang berkelanjutan (syukur amali) agar membawa keberkahan ilmu bagi umat.' },
      { key: 'B', text: 'Menghindari rasa iri hati dari regu sekolah lain yang tidak berhasil memenangkan perlombaan cerdas cermat.' },
      { key: 'C', text: 'Menghemat pengeluaran konsumsi semata agar uang hadiah dapat disimpan di tabungan ketua regu.' },
      { key: 'D', text: 'Mematuhi instruksi resmi dari dewan juri perlombaan tentang aturan penggunaan uang hadiah.' }
    ],
    correctKey: 'A',
    explanation: 'Syukur sejati tidak hanya lisan, melainkan syukur amali: menggunakan nikmat yang diberikan Allah untuk ketaatan dan kemaslahatan sesama, menjauhi pemborosan (israf).',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: integrasi syukur qalbi, lisani, dan amali.',
      B: 'Pertimbangan sosial horizontal sekadar menghindari iri.',
      C: 'Tindakan egois untuk kepentingan pribadi ketua regu.',
      D: 'Kepatuhan administratif tanpa kesadaran nilai spiritual.'
    },
    islamicValue: 'Syukur Amali, Filantropi Keilmuan, dan Menghindari Tabzir',
    realLifeContext: 'Perayaan kemenangan lomba dan pengelolaan hadiah kesiswaan',
    dalilReference: 'Q.S. Ibrahim [14]: 7 & Q.S. Luqman [31]: 12',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-vii-2-fikih-salat-jumat',
    number: 9,
    grade: 'VII',
    semester: '2',
    element: 'Fikih',
    temaId: 'tema-vii-2-fikih-salat-jumat',
    tema: 'Ketentuan Salat Jumat',
    tp: 'Menganalisis ketentuan salat Jumat',
    materi: 'Ketentuan, Syarat, Rukun, dan Adab Penyelenggaraan Salat Jumat',
    submateri: 'Adab Khotbah Jumat dan Larangan Berbicara saat Khatib Berkhotbah',
    indicator: 'Disajikan fenomena penggunaan gawai saat khotbah Jumat di masjid sekolah, peserta didik dapat menganalisis dampak hukum adab mendengarkan khotbah.',
    stimulus: 'Saat salat Jumat berlangsung di masjid sekolah, khatib sedang menyampaikan khotbah kedua tentang adab pergaulan remaja. Di saf belakang, dua orang peserta didik saling berbisik dan salah satunya membuka media sosial di ponsel pintarnya untuk memperlihatkan video lucu kepada temannya.',
    operationalVerb: 'Menganalisis konsekuensi syar\'i pelanggaran adab mendengarkan khotbah Jumat',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Berdasarkan hadis Rasulullah Saw. tentang larangan berkata-kata saat khotbah Jumat, dampak hukum dari tindakan kedua peserta didik tersebut adalah...',
    options: [
      { key: 'A', text: 'Tindakan berbicara dan bermain gawai menggugurkan keutamaan pahala salat Jumat (lagha), sehingga salatnya hanya bernilai seperti salat Dzuhur biasa.' },
      { key: 'B', text: 'Salat Jumat mereka batal seketika dan wajib keluar saf untuk mengulang wudhu dan salat Dzuhur 4 rakaat sendiri.' },
      { key: 'C', text: 'Tidak ada konsekuensi apa pun selama mereka tidak bersuara keras yang mengganggu jamaah di saf paling depan.' },
      { key: 'D', text: 'Mereka dikenakan denda dam membayar fidyah berupa satu mud beras kepada fakir miskin di sekitar masjid.' }
    ],
    correctKey: 'A',
    explanation: 'Rasulullah Saw. bersabda: "Jika kamu berkata kepada temanmu pada hari Jumat \'diamlah\' saat imam sedang berkhutbah, maka kamu telah berbuat lagha (sia-sia pahala Jumatmu)." Bermain HP dan berbisik menghilangkan pahala Jumat.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat sesuai hadis riwayat Bukhari dan Muslim.',
      B: 'Keliru, salatnya tidak otomatis batal secara fikih lahiriah namun gugur pahalanya.',
      C: 'Keliru, hadis melarang bahkan sekadar ucapan mengingatkan teman.',
      D: 'Keliru, tidak ada denda dam/fidyah dalam salat Jumat.'
    },
    islamicValue: 'Khidmat Beribadah, Menjaga Adab Masjid, dan Mendengarkan Nasihat Agama',
    realLifeContext: 'Pelaksanaan salat Jumat di masjid sekolah dan gangguan ponsel pintar',
    dalilReference: 'H.R. Bukhari No. 934 & H.R. Muslim No. 851',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-vii-2-spi-abbasiyah',
    number: 10,
    grade: 'VII',
    semester: '2',
    element: 'Sejarah Peradaban Islam',
    temaId: 'tema-vii-2-spi-abbasiyah',
    tema: 'Peradaban Daulah Bani Abbasiyah',
    tp: 'Menganalisis peradaban Bani Abbasiyah',
    materi: 'Sejarah dan Analisis Kemajuan Peradaban Daulah Bani Abbasiyah (The Golden Age of Islam)',
    submateri: 'Peran Lembaga Baitul Hikmah dan Integrasi Sains Global pada Masa Abbasiyah',
    indicator: 'Disajikan sejarah Baitul Hikmah di Baghdad, peserta didik dapat menganalisis faktor pendorong kemajuan riset sains masa keemasan Islam.',
    stimulus: 'Pada masa Khalifah Harun Al-Rasyid dan Al-Ma\'mun, Daulah Abbasiyah mendirikan Baitul Hikmah (House of Wisdom) di Baghdad. Lembaga ini tidak hanya menjadi perpustakaan raksasa, tetapi juga pusat penerjemahan karya-karya ilmiah dari Yunani, Persia, dan India ke bahasa Arab. Para ilmuwan muslim seperti Al-Khawarizmi dan Al-Kindi digaji tinggi untuk melakukan riset matematika, kedokteran, dan astronomi tanpa membeda-bedakan latar belakang agama atau suku asal penerjemah.',
    operationalVerb: 'Menganalisis faktor kunci zaman keemasan ilmu pengetahuan Islam',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Faktor utama yang mendorong kemajuan peradaban sains pada masa Daulah Abbasiyah yang paling relevan untuk diteladani dunia pendidikan saat ini adalah...',
    options: [
      { key: 'A', text: 'Keterbukaan intelektual, dukungan penuh pendanaan riset dari pemerintah, dan integrasi antara etika agama dengan pengembangan sains global.' },
      { key: 'B', text: 'Kekuatan armada militer yang memaksa wilayah taklukan menyerahkan naskah kuno kepada kekhalifahan.' },
      { key: 'C', text: 'Penutupan akses informasi bagi bangsa asing agar rahasia teknologi penemuan tidak ditiru oleh kerajaan lain.' },
      { key: 'D', text: 'Pembatasan kajian ilmiah semata-mata pada bidang ilmu agama tradisional tanpa mempelajari sains alam.' }
    ],
    correctKey: 'A',
    explanation: 'Zaman keemasan Daulah Abbasiyah lahir dari keterbukaan pemikiran ilmiah, penghargaan tinggi khalifah terhadap riset, dan keyakinan bahwa sains adalah sarana mentadabburi ayat kauniyah Allah.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: merefleksikan esensi The Golden Age of Islam.',
      B: 'Keliru, gerakan keilmuan Abbasiyah digerakkan oleh apresiasi ilmu, bukan pemaksaan senjata.',
      C: 'Bertentangan dengan fakta historis keterbukaan Baitul Hikmah lintas bangsa.',
      D: 'Keliru, Abbasiyah memadukan ilmu agama dan sains alam (kedokteran, aljabar, optik).'
    },
    islamicValue: 'Keterbukaan Intelektual, Etos Riset Sains, dan Apresiasi Keilmuan',
    realLifeContext: 'Pengembangan laboratorium sains sekolah dan budaya membaca buku',
    dalilReference: 'Q.S. Al-\'Alaq [96]: 1-5 & Q.S. Ar-Rahman [55]: 33',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },

  // =========================================================================
  // 3. KELAS VIII - SEMESTER 1
  // =========================================================================
  {
    id: 'bank-q-viii-1-quran-toleransi',
    number: 11,
    grade: 'VIII',
    semester: '1',
    element: "Al-Qur'an Hadis",
    temaId: 'tema-viii-1-quran-toleransi',
    tema: 'Pentingnya Toleransi dalam Keragaman',
    tp: 'Menganalisis ayat Al-Qur\'an dan hadis terkait pentingnya toleransi',
    materi: 'Ayat Al-Qur\'an dan Hadis terkait Pentingnya Toleransi (Tasamuh)',
    submateri: 'Kandungan Q.S. Al-Hujurat: 13 dan Batasan Tegas Akidah Q.S. Al-Kafirun',
    indicator: 'Disajikan studi kasus perayaan hari besar keagamaan di sekolah multikultural, peserta didik dapat menganalisis sikap toleransi proporsional.',
    stimulus: 'Di sebuah SMP negeri yang majemuk, OSIS merencanakan kerja sama proyek membersihkan lingkungan sekolah dan pasar tradisional menjelang hari libur keagamaan. Beberapa siswa berdiskusi mengenai batas toleransi: mereka sepakat bekerja sama secara penuh dalam aksi sosial kemanusiaan, namun saling menghormati dan tidak mencampuradukkan ritual peribadatan masing-masing.',
    operationalVerb: 'Menganalisis batas toleransi sosial dan akidah',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sulit',
    questionType: 'Pilihan Ganda',
    questionText: 'Sikap yang disepakati para siswa tersebut selaras dengan prinsip Al-Qur\'an (Q.S. Al-Hujurat: 13 dan Q.S. Al-Kafirun: 1-6) karena...',
    options: [
      { key: 'A', text: 'Memadukan komitmen kerja sama kemanusiaan dalam muamalah sosial dengan penjagaan keteguhan kemurnian akidah ibadah masing-masing.' },
      { key: 'B', text: 'Menolak semua bentuk interaksi dengan penganut agama lain demi menjaga kesucian keyakinan pribadi.' },
      { key: 'C', text: 'Menggabungkan bacaan doa dari berbagai ritual ibadat ke dalam satu prosesi demi mewujudkan persatuan mutlak.' },
      { key: 'D', text: 'Menghindari kegiatan sosial bersama karena takut dicap kurang memiliki kepedulian terhadap kelompok sendiri.' }
    ],
    correctKey: 'A',
    explanation: 'Islam mengajarkan toleransi seluas-luasnya dalam ranah sosial (Al-Hujurat: 13), namun berprinsip tegas tidak berkompromi dalam urusan akidah dan ibadah (Al-Kafirun: 6: Lakum dinukum waliyadin).',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: moderasi beragama yang kokoh.',
      B: 'Eksklusivisme ekstrem yang bertentangan dengan prinsip rahmatan lil \'alamin.',
      C: 'Sinkretisme agama yang merusak kemurnian tauhid.',
      D: 'Sikap apatis yang mencederai kohesi sosial kebangsaan.'
    },
    islamicValue: 'Tasamuh Proporsional, Moderasi Beragama, dan Kemurnian Akidah',
    realLifeContext: 'Interaksi sosial antarpelajar di sekolah majemuk',
    dalilReference: 'Q.S. Al-Hujurat [49]: 13 & Q.S. Al-Kafirun [109]: 1-6',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-viii-1-akidah-kitab',
    number: 12,
    grade: 'VIII',
    semester: '1',
    element: 'Akidah',
    temaId: 'tema-viii-1-akidah-kitab',
    tema: 'Iman kepada Kitab-Kitab Allah Swt.',
    tp: 'Menganalisis makna iman kepada kitab-kitab Allah Swt.',
    materi: 'Makna Iman kepada Kitab-Kitab Allah Swt. dan Al-Qur\'an sebagai Pedoman Hidup',
    submateri: 'Fungsi Al-Qur\'an sebagai Al-Furqan dalam Memfilter Informasi di Era Digital',
    indicator: 'Disajikan fenomena maraknya informasi hoaks dan tren budaya populer, peserta didik dapat menganalisis fungsi Al-Qur\'an sebagai Al-Furqan.',
    stimulus: 'Di media sosial sering beredar konten viral mengenai gaya hidup hedonis dan ajaran-ajaran yang bertentangan dengan norma syariat Islam. Naila selalu memverifikasi kebenaran setiap konten yang ia jumpai dengan bertanya kepada guru ngaji dan merujuk pada prinsip-prinsip moral Al-Qur\'an sebelum mempercayai atau membagikan kembali postingan tersebut.',
    operationalVerb: 'Menganalisis fungsi Al-Qur\'an sebagai Al-Furqan dalam kehidupan modern',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Tindakan yang dilakukan Naila mencerminkan fungsi Al-Qur\'an sebagai Al-Furqan karena...',
    options: [
      { key: 'A', text: 'Menjadikan petunjuk wahyu Al-Qur\'an sebagai standar pembeda antara yang benar (haq) dan yang salah (bathil) dalam menyaring arus informasi.' },
      { key: 'B', text: 'Memanfaatkan ayat-ayat Al-Qur\'an untuk mendebat teman sekelas demi membuktikan keunggulan argumennya.' },
      { key: 'C', text: 'Menghafalkan surah-surah Al-Qur\'an semata-mata untuk mendapatkan sertifikat kelulusan tahfiz sekolah.' },
      { key: 'D', text: 'Menghindari pemanfaatan media sosial sama sekali karena takut terjerumus ke dalam dosa informasi.' }
    ],
    correctKey: 'A',
    explanation: 'Al-Furqan bermakna pembeda. Beriman kepada Al-Qur\'an berarti memfungsikannya sebagai filter penyaring nilai kehidupan mana yang haq dan mana yang batil di era digital.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: menunjukkan penerapan fungsi Al-Furqan.',
      B: 'Tujuan berdebat yang dilarang dalam etika Islam.',
      C: 'Orientasi formalitas administratif sertifikat.',
      D: 'Sikap isolasi diri pasif tanpa kemampuan literasi kritis.'
    },
    islamicValue: 'Al-Qur\'an Pedoman Hidup, Tabayyun, dan Literasi Digital Qur\'ani',
    realLifeContext: 'Menyaring tren media sosial dan berita hoaks digital',
    dalilReference: 'Q.S. Al-Furqan [25]: 1 & Q.S. Al-Baqarah [2]: 185',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-viii-1-akhlak-husnuzan',
    number: 13,
    grade: 'VIII',
    semester: '1',
    element: 'Akhlak',
    temaId: 'tema-viii-1-akhlak-husnuzan',
    tema: 'Menerapkan Makna Husnuzan (Prasangka Baik)',
    tp: 'Menerapkan makna husnuzan (prasangka baik)',
    materi: 'Penerapan Makna Husnuzan kepada Allah Swt., Diri Sendiri, dan Sesama',
    submateri: 'Menjauhi Su\'uzan, Tajassus, dan Ghibah Berdasarkan Q.S. Al-Hujurat: 12',
    indicator: 'Disajikan situasi tuduhan kehilangan di ruang kelas, peserta didik dapat menerapkan sikap husnuzan dan tabayyun.',
    stimulus: 'Uang iuran kegiatan kelas sebesar Rp50.000 hilang dari meja bendahara saat jam istirahat. Beberapa siswa langsung mencurigai seorang teman yang saat itu kebetulan berada di kelas sendirian. Riko mengingatkan rekan-rekannya agar tidak langsung berburuk sangka (su\'uzan) dan mengajak menanyakan secara baik-baik (tabayyun). Ternyata uang tersebut terselip di dalam map daftar hadir yang dibawa guru.',
    operationalVerb: 'Menerapkan nilai husnuzan dan tabayyun dalam konflik antarteman',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Sikap Riko yang mencegah teman-temannya menuduh tanpa bukti selaras dengan firman Allah Swt. dalam Q.S. Al-Hujurat [49]: 12 karena...',
    options: [
      { key: 'A', text: 'Menghindarkan diri dari dosa berprasangka buruk dan mencegah rusaknya tali persaudaraan (ukhuwah) akibat fitnah tanpa bukti.' },
      { key: 'B', text: 'Membela temannya tersebut karena memiliki hubungan kekerabatan yang sangat dekat di luar sekolah.' },
      { key: 'C', text: 'Mengalihkan perhatian kelas agar bendahara tidak merasa bersalah atas kelalaian menyimpan uang kas.' },
      { key: 'D', text: 'Menganggap masalah uang kas kelas adalah urusan kecil yang tidak perlu diselidiki sama sekali.' }
    ],
    correctKey: 'A',
    explanation: 'Q.S. Al-Hujurat ayat 12 memerintahkan menjauhi sebagian besar prasangka karena sebagian prasangka adalah dosa. Mengedepankan husnuzan dan tabayyun mencegah fitnah dan menjaga ukhuwah.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: sesuai dalil naqli dan adab pergaulan.',
      B: 'Sikap nepotisme/favoritisme, bukan keadilan moral.',
      C: 'Pembenaran atas kelalaian administrasi.',
      D: 'Sikap meremehkan amanah dana bersama.'
    },
    islamicValue: 'Husnuzan, Tabayyun, Menjaga Ukhuwah, dan Menghindari Fitnah',
    realLifeContext: 'Penyelesaian tuduhan kehilangan barang di ruang kelas',
    dalilReference: 'Q.S. Al-Hujurat [49]: 12 & H.R. Bukhari',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-viii-1-fikih-jenazah',
    number: 14,
    grade: 'VIII',
    semester: '1',
    element: 'Fikih',
    temaId: 'tema-viii-1-fikih-jenazah',
    tema: 'Perintah Agama terhadap Penyelenggaraan Jenazah',
    tp: 'Menganalisis perintah agama terhadap penyelenggaraan jenazah',
    materi: 'Ketentuan dan Analisis Perintah Agama terhadap Penyelenggaraan Jenazah (Fardhu Kifayah)',
    submateri: 'Urutan Rukun Salat Jenazah Empat Takbir dan Doa-Doanya',
    indicator: 'Disajikan rincian tata cara salat jenazah, peserta didik dapat menganalisis urutan bacaan setelah empat takbir secara benar.',
    stimulus: 'Siswa kelas VIII SMP mengikuti praktik simulasi pengurusan jenazah di musala sekolah. Guru PAI menunjuk seorang perwakilan siswa untuk menjadi imam salat jenazah 4 takbir tanpa rukuk dan sujud.',
    operationalVerb: 'Menganalisis urutan rukun bacaan salat jenazah',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Urutan rukun bacaan setelah masing-masing takbir pada salat jenazah yang sah menurut syariat adalah...',
    options: [
      { key: 'A', text: 'Takbir 1 membaca Surah Al-Fatihah, Takbir 2 membaca Shalawat Nabi, Takbir 3 membaca Doa untuk Jenazah, Takbir 4 membaca Doa kaum muslimin lalu salam.' },
      { key: 'B', text: 'Takbir 1 membaca Doa Iftitah, Takbir 2 membaca Surah Al-Fatihah, Takbir 3 membaca Shalawat Nabi, Takbir 4 sujud syukur lalu salam.' },
      { key: 'C', text: 'Takbir 1 membaca Surah Pendek, Takbir 2 membaca Doa Jenazah, Takbir 3 membaca Shalawat Nabi, Takbir 4 membaca Tahiyat akhir.' },
      { key: 'D', text: 'Takbir 1 membaca Shalawat Nabi, Takbir 2 membaca Surah Al-Fatihah, Takbir 3 membaca Doa Qunut, Takbir 4 rukuk lalu salam.' }
    ],
    correctKey: 'A',
    explanation: 'Urutan rukun salat jenazah: Takbir 1 membaca Al-Fatihah; Takbir 2 membaca Shalawat kepada Nabi; Takbir 3 mendoakan jenazah; Takbir 4 mendoakan keluarga/kaum muslimin, diakhiri salam.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat sesuai fikih mazhab empat.',
      B: 'Keliru, salat jenazah tidak menggunakan doa iftitah dan sujud.',
      C: 'Urutan takbir dan rukun bacaan tertukar.',
      D: 'Keliru, salat jenazah tidak memiliki rukun rukuk.'
    },
    islamicValue: 'Pemenuhan Fardhu Kifayah, Penghormatan Jenazah, dan Kepedulian Sosial',
    realLifeContext: 'Praktik salat jenazah di lingkungan masyarakat',
    dalilReference: 'H.R. Muslim & Kitab Fathul Qarib Al-Mujib',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-viii-1-spi-fatimiyah',
    number: 15,
    grade: 'VIII',
    semester: '1',
    element: 'Sejarah Peradaban Islam',
    temaId: 'tema-viii-1-spi-fatimiyah',
    tema: 'Peradaban Dinasti Fatimiyah',
    tp: 'Menganalisis peradaban Dinasti Fatimiyah',
    materi: 'Sejarah, Perkembangan, dan Analisis Kemajuan Peradaban Dinasti Fatimiyah di Mesir',
    submateri: 'Pendirian Universitas Al-Azhar dan Kemajuan Peradaban Dinasti Fatimiyah',
    indicator: 'Disajikan sejarah pendirian Al-Azhar di Kairo, peserta didik dapat menganalisis peran strategisnya bagi transmisi keilmuan Islam dunia.',
    stimulus: 'Pada tahun 970 M, Panglima Jauhar Al-Shiqilli di bawah perintah Khalifah Al-Mu\'izz Lidinillah dari Dinasti Fatimiyah mendirikan Masjid Jami\' Al-Azhar di Kairo. Masjid ini segera berkembang menjadi universitas tertua di dunia yang mengkaji ilmu agama, astronomi, kedokteran, dan filsafat. Lembaga ini tetap tegak melintasi pergantian dinasti hingga hari ini.',
    operationalVerb: 'Menganalisis peran peradaban Dinasti Fatimiyah dalam pendidikan tinggi Islam',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Pelajaran sejarah peradaban (ibrah) terbesar dari warisan Dinasti Fatimiyah bagi perkembangan dunia Islam kontemporer adalah...',
    options: [
      { key: 'A', text: 'Pentingnya pelembagaan pendidikan tinggi dan perpustakaan sebagai benteng pelestarian ilmu pengetahuan dan moderasi peradaban.' },
      { key: 'B', text: 'Kekuatan sebuah dinasti semata-mata ditentukan oleh kemegahan istana dan arsitektur benteng pertahanan militer.' },
      { key: 'C', text: 'Lembaga keilmuan Islam seharusnya hanya menerima mahasiswa dari satu suku bangsa tertentu saja.' },
      { key: 'D', text: 'Pendidikan tinggi masa lampau tidak memiliki kaitan apa pun dengan kemajuan sains dan teknologi masa kini.' }
    ],
    correctKey: 'A',
    explanation: 'Warisan terbesar Fatimiyah adalah Universitas Al-Azhar dan Darul Hikmah, membuktikan bahwa investasi pada institusi pendidikan tinggi dan perpustakaan memberikan dampak peradaban yang abadi melintasi zaman.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: menunjukkan relational deep learning.',
      B: 'Pandangan sempit yang mengabaikan pilar ilmu pengetahuan.',
      C: 'Bertentangan dengan watak Al-Azhar yang kosmopolit dan inklusif.',
      D: 'Pernyataan keliru yang menafikan kontribusi sejarah.'
    },
    islamicValue: 'Kecintaan pada Ilmu Pengetahuan, Ketahanan Peradaban, dan Moderasi Intelektual',
    realLifeContext: 'Peran perguruan tinggi Islam dalam mencetak cendekiawan berakhlak',
    dalilReference: 'Q.S. Al-Mujadilah [58]: 11 & Tarikhul Umam',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },

  // =========================================================================
  // 4. KELAS VIII - SEMESTER 2
  // =========================================================================
  {
    id: 'bank-q-viii-2-quran-cinta-tanah-air',
    number: 16,
    grade: 'VIII',
    semester: '2',
    element: "Al-Qur'an Hadis",
    temaId: 'tema-viii-2-quran-cinta-tanah-air',
    tema: 'Pentingnya Cinta Tanah Air dalam Islam',
    tp: 'Menganalisis ayat Al-Qur\'an dan hadis terkait pentingnya cinta tanah air',
    materi: 'Ayat Al-Qur\'an dan Hadis terkait Pentingnya Cinta Tanah Air dan Tanggung Jawab Kebangsaan',
    submateri: 'Konsep Hubbul Wathan Minal Iman dan Pengamalan Q.S. Al-Qashas: 85',
    indicator: 'Disajikan narasi peran pelajar dalam mengisi kemerdekaan, peserta didik dapat menganalisis nilai cinta tanah air dalam perspektif Islam.',
    stimulus: 'Rasulullah Saw. menunjukkan kecintaan mendalam pada tanah tumpah darahnya Makkah dan Madinah, sebagaimana diisyaratkan dalam Q.S. Al-Qashas: 85. Para ulama di Indonesia merumuskan kaidah bahwa mencintai dan menjaga tanah air adalah bagian dari perwujudan keimanan (Hubbul Wathan Minal Iman).',
    operationalVerb: 'Menganalisis wujud kecintaan tanah air bagi pelajar muslim',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Wujud nyata pengamalan nilai cinta tanah air yang paling tepat dilakukan oleh seorang pelajar muslim di sekolah adalah...',
    options: [
      { key: 'A', text: 'Belajar sungguh-sungguh untuk mengukir prestasi, merawat fasilitas umum, dan menjaga persatuan bangsa dari ancaman perpecahan.' },
      { key: 'B', text: 'Membanggakan daerah asalnya secara berlebihan dengan merendahkan budaya daerah suku bangsa lain di Indonesia.' },
      { key: 'C', text: 'Menganggap upacara bendera hari Senin sebagai kegiatan seremonial biasa yang tidak memiliki makna nilai keagamaan.' },
      { key: 'D', text: 'Menolak mempelajari bahasa asing karena dianggap dapat melunturkan jiwa nasionalisme kebangsaan.' }
    ],
    correctKey: 'A',
    explanation: 'Cinta tanah air dalam Islam diwujudkan melalui amal produktif: meraih prestasi untuk bangsa, merawat keharmonisan sosial, dan menjaga kedaulatan serta persatuan NKRI.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: integrasi iman dan nasionalisme religius.',
      B: 'Etnosentrisme sempit yang memicu disintegrasi bangsa.',
      C: 'Sikap abai terhadap simbol penghormatan kemerdekaan.',
      D: 'Pandangan tertutup yang bertentangan dengan semangat menuntut ilmu.'
    },
    islamicValue: 'Hubbul Wathan Minal Iman, Nasionalisme Religius, dan Persatuan Bangsa',
    realLifeContext: 'Upacara bendera di sekolah dan peran pelajar dalam merawat NKRI',
    dalilReference: 'Q.S. Al-Qashas [28]: 85 & H.R. Tirmidzi',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-viii-2-akidah-rasul',
    number: 17,
    grade: 'VIII',
    semester: '2',
    element: 'Akidah',
    temaId: 'tema-viii-2-akidah-rasul',
    tema: 'Iman kepada Rasul-Rasul Allah Swt.',
    tp: 'Menganalisis makna iman kepada rasul-rasul Allah Swt.',
    materi: 'Makna Iman kepada Rasul-Rasul Allah Swt. dan Keteladanan Ulul Azmi',
    submateri: 'Sifat Wajib Rasul (Shiddiq, Amanah, Tabligh, Fathanah) dan Keteladanan Ulul Azmi',
    indicator: 'Disajikan studi kasus kepemimpinan ketua regu pramuka, peserta didik dapat menganalisis implementasi sifat Fathanah dan Amanah.',
    stimulus: 'Saat kegiatan perkemahan sabtu-minggu (Persami), regu Farhan menghadapi tantangan jalur lintas alam yang rumit dan cuaca hujan deras. Sebagai pemimpin regu, Farhan menggunakan kecerdasannya membaca kompas dan peta secara cermat (Fathanah) serta memastikan seluruh anggota regu dan perlengkapan tiba di pos akhir dengan selamat tanpa ada yang tertinggal (Amanah).',
    operationalVerb: 'Menganalisis implementasi sifat wajib rasul dalam kepemimpinan remaja',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Tindakan kepemimpinan yang ditunjukkan Farhan paling tepat mencerminkan implementasi sifat wajib rasul karena...',
    options: [
      { key: 'A', text: 'Memadukan kecerdasan strategi pemecahan masalah (Fathanah) dengan tanggung jawab penuh menjaga keselamatan anggota (Amanah).' },
      { key: 'B', text: 'Menuntut seluruh anggota regu mematuhi keputusannya tanpa memberi ruang untuk berpendapat.' },
      { key: 'C', text: 'Berambisi agar regunya menjadi yang tercepat demi meraih piala juara umum tanpa memedulikan kondisi kawan.' },
      { key: 'D', text: 'Menyerahkan penentuan arah jalan kepada panitia pos penjaga semata karena takut disalahkan.' }
    ],
    correctKey: 'A',
    explanation: 'Fathanah adalah kecerdasan intelektual dan taktis, sedangkan Amanah adalah kejujuran dan tanggung jawab memegang mandat. Keduanya adalah sifat wajib rasul yang menjadi pilar kepemimpinan Islami.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: keterpaduan Fathanah dan Amanah.',
      B: 'Gaya kepemimpinan otoriter yang bertentangan dengan syura nabawiyah.',
      C: 'Ambisi hasil lahiriah yang mengabaikan keselamatan dan empati.',
      D: 'Sikap lepas tangan dari tanggung jawab pemimpin.'
    },
    islamicValue: 'Keteladanan Sifat Wajib Rasul, Kepemimpinan Amanah, dan Fathanah',
    realLifeContext: 'Kepemimpinan regu pramuka dan organisasi kesiswaan',
    dalilReference: 'Q.S. Al-Ahzab [33]: 21 & Q.S. An-Nisa\' [4]: 136',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-viii-2-akhlak-cinta-rasul',
    number: 18,
    grade: 'VIII',
    semester: '2',
    element: 'Akhlak',
    temaId: 'tema-viii-2-akhlak-cinta-rasul',
    tema: 'Menerapkan Rasa Cinta kepada Rasulullah Muhammad Saw.',
    tp: 'Menerapkan rasa cinta kepada Rasulullah Muhammad saw.',
    materi: 'Penerapan Rasa Cinta kepada Rasulullah Muhammad Saw. melalui Meneladani Akhlak Mulia dan Sunnah',
    submateri: 'Meneladani Sifat Pemaaf dan Kasih Sayang Rasulullah Saw. kepada Sesama',
    indicator: 'Disajikan studi kasus perselisihan antarteman di sekolah, peserta didik dapat menerapkan akhlak pemaaf Rasulullah Saw.',
    stimulus: 'Aisyah diejek oleh seorang temannya di media sosial karena sepatu sekolahnya yang sudah usang. Teman-teman dekat Aisyah memprovokasi agar ia membalas dengan membongkar aib temannya tersebut. Aisyah menolak membalas, memilih memaafkannya secara tulus, dan tetap menyapa temannya dengan ramah keesokan harinya di kelas, meneladani sikap Rasulullah Saw. saat memaafkan penduduk Thaif.',
    operationalVerb: 'Menerapkan akhlak pemaaf Rasulullah Saw. dalam interaksi sosial',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Sikap pemaaf yang diambil Aisyah paling mendalam membuktikan cintanya kepada Rasulullah Saw. karena...',
    options: [
      { key: 'A', text: 'Meneladani akhlak mulia Nabi Muhammad Saw. yang membalas keburukan dengan kebaikan dan tidak menuruti hawa nafsu dendam.' },
      { key: 'B', text: 'Merasa dirinya lemah sehingga tidak memiliki daya untuk membalas perbuatan temannya.' },
      { key: 'C', text: 'Berharap temannya tersebut merasa bersalah dan membelikan sepatu baru sebagai ganti ejekannya.' },
      { key: 'D', text: 'Menghindari teguran guru BK semata agar nilai sikap budi pekertinya di rapor tidak tercoreng.' }
    ],
    correctKey: 'A',
    explanation: 'Cinta sejati kepada Rasulullah Saw. dibuktikan dengan meneladani akhlaknya yang pemaaf, lemah lembut, dan tidak mendendam (Q.S. Ali \'Imran: 159).',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: wujud otentik cinta Rasulullah Saw.',
      B: 'Sikap inferior pasrah karena ketakutan, bukan ketulusan moral.',
      C: 'Pamrih materiil duniawi yang merusak ketulusan akhlak.',
      D: 'Motivasi formalistis nilai rapor.'
    },
    islamicValue: 'Cinta Rasulullah Saw., Pemaaf (Al-\'Afwu), dan Akhlak Mulia',
    realLifeContext: 'Menyikapi ejekan teman sebaya di sekolah tanpa membalas dendam',
    dalilReference: 'Q.S. Ali \'Imran [3]: 159 & Q.S. Al-Ahzab [33]: 21',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-viii-2-fikih-haji-umrah',
    number: 19,
    grade: 'VIII',
    semester: '2',
    element: 'Fikih',
    temaId: 'tema-viii-2-fikih-haji-umrah',
    tema: 'Ketentuan Haji dan Umrah',
    tp: 'Menganalisis ketentuan haji dan umrah',
    materi: 'Ketentuan, Syarat, Rukun, Wajib, dan Rangkaian Manasik Haji serta Umrah',
    submateri: 'Rukun Haji dan Makna Filosofis Kesetaraan di Padang Arafah',
    indicator: 'Disajikan tahapan manasik haji, peserta didik dapat menganalisis kedudukan wukuf di Arafah dan nilai filosofis kesetaraan manusia.',
    stimulus: 'Pada tanggal 9 Dzulhijjah, jutaan jamaah haji dari seluruh penjuru dunia berkumpul di Padang Arafah mengenakan dua helai kain ihram putih polos tanpa jahitan. Tidak ada perbedaan busana antara pejabat negara, saudagar kaya, maupun rakyat jelata.',
    operationalVerb: 'Menganalisis nilai kesetaraan sosial dari rukun wukuf di Arafah',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Pelajaran nilai tauhid dan kemanusiaan paling mendalam yang dipetik dari pelaksanaan wukuf di Arafah dengan pakaian ihram adalah...',
    options: [
      { key: 'A', text: 'Menegaskan kesetaraan hakiki seluruh umat manusia di hadapan Allah Swt. di mana kemuliaan hanya diukur dari derajat ketakwaan batin.' },
      { key: 'B', text: 'Menunjukkan keunggulan status sosial ekonomi jamaah yang mampu membiayai perjalanan mahal ke tanah suci.' },
      { key: 'C', text: 'Mempromosikan budaya pakaian khas tradisional bangsa Arab ke panggung pergaulan internasional.' },
      { key: 'D', text: 'Menghabiskan waktu untuk beristirahat fisik di dalam tenda perkemahan setelah perjalanan jauh.' }
    ],
    correctKey: 'A',
    explanation: 'Wukuf di Arafah adalah puncak rukun haji (Al-Hajju \'Arafah) dan miniatur padang Mahsyar. Pakaian ihram melambangkan pelepasan sekat kasta duniawi: semua setara di hadapan Allah kecuali ketakwaannya.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: menghubungkan rukun haji dengan prinsip kesetaraan tauhid.',
      B: 'Sombong/riya status sosial yang bertentangan dengan esensi haji mabrur.',
      C: 'Miskonsepsi menyamakan ihram dengan busana adat etnis tertentu.',
      D: 'Reduksi makna spiritual menjadi sekadar istirahat fisik.'
    },
    islamicValue: 'Kesetaraan Derajat Manusia (Egalitarianisme Islam), Ketakwaan, dan Tawadhu',
    realLifeContext: 'Praktik manasik haji sekolah dan penghayatan nilai anti-diskriminasi',
    dalilReference: 'Q.S. Ali \'Imran [3]: 97 & H.R. Tirmidzi (Al-Hajju \'Arafah)',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-viii-2-spi-turki-usmani',
    number: 20,
    grade: 'VIII',
    semester: '2',
    element: 'Sejarah Peradaban Islam',
    temaId: 'tema-viii-2-spi-turki-usmani',
    tema: 'Peradaban Dinasti Turki Usmani',
    tp: 'Menganalisis peradaban Dinasti Turki Usmani',
    materi: 'Sejarah, Masa Kejayaan, dan Kemajuan Peradaban Dinasti Turki Usmani',
    submateri: 'Penaklukan Konstantinopel oleh Sultan Muhammad Al-Fatih dan Kebijakan Millet System',
    indicator: 'Disajikan peristiwa penaklukan Konstantinopel 1453 M, peserta didik dapat mengevaluasi perpaduan keahlian sains strategis dan akhlak toleransi Sultan Al-Fatih.',
    stimulus: 'Ketika Sultan Muhammad Al-Fatih berhasil menaklukkan Konstantinopel pada tahun 1453 M di usia 21 tahun, beliau memadukan inovasi meriam modern tercanggih (Sains Militer) dengan ketaatan ibadah pasukannya. Setelah memasuki kota, Sultan Al-Fatih menjamin kebebasan beragama dan melindungi seluruh gereja serta warga nonmuslim melalui kebijakan sistem perlindungan (Millet System).',
    operationalVerb: 'Mengevaluasi integrasi kepemimpinan sains dan toleransi Sultan Muhammad Al-Fatih',
    bloomLevel: 'C5',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sulit',
    questionType: 'Pilihan Ganda',
    questionText: 'Evaluasi kepemimpinan yang paling tepat atas keberhasilan Sultan Muhammad Al-Fatih adalah...',
    options: [
      { key: 'A', text: 'Keberhasilan beliau ditopang oleh integrasi kecakapan sains teknologi modern, disiplin spiritual, dan keteladanan akhlak toleransi yang melindungi kaum minoritas.' },
      { key: 'B', text: 'Kemenangannya semata-mata karena keberuntungan jumlah pasukan yang jauh lebih besar daripada pasukan bertahan kota.' },
      { key: 'C', text: 'Beliau memusnahkan seluruh warisan peradaban masa lalu agar tidak ada lagi peninggalan bangsa Romawi yang tersisa.' },
      { key: 'D', text: 'Kebijakan toleransinya merupakan bentuk kelemahan militer yang terpaksa diambil karena kekurangan perbekalan perang.' }
    ],
    correctKey: 'A',
    explanation: 'Sultan Al-Fatih adalah prototipe pemimpin muslim ideal: menguasai sains dan bahasa internasional, teguh spiritualitasnya, serta menjunjung tinggi hak asasi manusia dan toleransi beragama pasca-kemenangan.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: evaluasi komprehensif kepemimpinan visioner.',
      B: 'Menafikan keunggulan teknologi meriam Basilica dan taktik perahu di atas bukit.',
      C: 'Bertentangan dengan fakta historis perlindungan gereja dan hak hidup warga.',
      D: 'Analisis keliru yang bertolak belakang dengan fakta ketegasan diplomatik Sultan.'
    },
    islamicValue: 'Kepemimpinan Visioner, Penguasaan Sains Teknologi, dan Perlindungan Hak Warga',
    realLifeContext: 'Mempersiapkan generasi muda berwawasan global yang bertakwa',
    dalilReference: 'H.R. Ahmad (Bisyarah Konstantinopel) & Q.S. Al-Fath [48]: 29',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },

  // =========================================================================
  // 5. KELAS IX - SEMESTER 1
  // =========================================================================
  {
    id: 'bank-q-ix-1-quran-keilmuan',
    number: 21,
    grade: 'IX',
    semester: '1',
    element: "Al-Qur'an Hadis",
    temaId: 'tema-ix-1-quran-keilmuan',
    tema: 'Pentingnya Semangat Keilmuan',
    tp: 'Menganalisis ayat Al-Qur\'an dan hadis terkait pentingnya semangat keilmuan',
    materi: 'Ayat Al-Qur\'an dan Hadis terkait Pentingnya Semangat Keilmuan dan Riset',
    submateri: 'Kandungan Q.S. Al-Mujadilah: 11 dan Integritas Kejujuran Ilmiah di Era AI',
    indicator: 'Disajikan studi kasus pemanfaatan AI oleh pelajar kelas IX, peserta didik dapat menganalisis integrasi teknologi dengan kejujuran akademik sesuai Q.S. Al-Mujadilah: 11.',
    stimulus: 'Rafi sedang menyusun laporan karya ilmiah biologi untuk ujian akhir jenjang. Alih-alih menyalin jawaban AI generatif secara mentah (plagiarisme), Rafi meneliti ulang fakta ke perpustakaan, menguji kebenaran referensi ke jurnal ilmiah, lalu menyusun analisisnya sendiri dengan penuh rasa tanggung jawab moral.',
    operationalVerb: 'Menganalisis korelasi etos keilmuan dan kejujuran akademik',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Berdasarkan kasus tersebut, etos belajar yang ditunjukkan Rafi paling mencerminkan pengamalan Q.S. Al-Mujadilah [58]: 11 karena...',
    options: [
      { key: 'A', text: 'Mengintegrasikan teknologi secara kritis dengan menjunjung tinggi integritas kejujuran akademik sebagai wujud derajat keimanan dan keluhuran ilmu.' },
      { key: 'B', text: 'Memastikan laporan ilmiahnya disukai guru agar mendapatkan peringkat pertama di kelas tanpa perlu repot menulis.' },
      { key: 'C', text: 'Membuktikan kepada teman sekelas bahwa dirinya lebih menguasai aplikasi komputer modern dibandingkan siswa lainnya.' },
      { key: 'D', text: 'Menghindari sanksi akademik sekolah semata tanpa dilandasi oleh kecintaan sejati pada proses menuntut ilmu.' }
    ],
    correctKey: 'A',
    explanation: 'Q.S. Al-Mujadilah: 11 menegaskan Allah mengangkat derajat orang beriman dan berilmu. Menuntut ilmu dengan menjunjung kejujuran akademik mencerminkan ketinggian derajat tersebut.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: menunjukkan relational deep learning.',
      B: 'Orientasi pragmatis hasil akhir tanpa pemaknaan etika ilmu.',
      C: 'Sikap berbangga diri (riya/ujub) yang bertentangan dengan tawadhu.',
      D: 'Kepatuhan lahiriah pasif karena takut sanksi.'
    },
    islamicValue: 'Etos Keilmuan, Kejujuran Intelektual, dan Tawadhu',
    realLifeContext: 'Penggunaan AI generatif dan etika riset ilmiah siswa SMP/MTs',
    dalilReference: 'Q.S. Al-Mujadilah [58]: 11 & H.R. Ibnu Majah',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-ix-1-akidah-hari-akhir',
    number: 22,
    grade: 'IX',
    semester: '1',
    element: 'Akidah',
    temaId: 'tema-ix-1-akidah-hari-akhir',
    tema: 'Iman kepada Hari Akhir',
    tp: 'Menganalisis makna iman kepada hari akhir',
    materi: 'Makna Iman kepada Hari Akhir dan Akuntabilitas Moral dalam Kehidupan',
    submateri: 'Pertanggungjawaban Amal di Yaumul Hisab dan Mizan serta Jejak Digital',
    indicator: 'Disajikan studi kasus penyebaran fitnah melalui akun anonim, peserta didik dapat menganalisis kesadaran hari akhir dalam mencegah cyberbullying.',
    stimulus: 'Di era digital, seseorang dapat membuat akun media sosial anonim palsu untuk mencaci, memfitnah, dan menyebarkan aib orang lain tanpa takut diketahui identitasnya di dunia nyata. Namun, orang yang beriman kepada Hari Akhir menyadari bahwa pada Yaumul Hisab kelak seluruh anggota tubuh dan tangan akan bersaksi atas apa yang diketiknya di ponsel pintar.',
    operationalVerb: 'Menganalisis korelasi iman hari akhir dengan pengendalian perilaku di dunia digital',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sulit',
    questionType: 'Pilihan Ganda',
    questionText: 'Berdasarkan firman Allah Swt. dalam Q.S. Yasin [36]: 65 dan Q.S. Al-Zalzalah [99]: 7-8, refleksi akidah yang paling mendalam terkait fenomena akun anonim adalah...',
    options: [
      { key: 'A', text: 'Anonimitas digital hanyalah ilusi duniawi yang semu, sebab di hadapan pengadilan Allah kelak seluruh jejak perbuatan dan ketikan tangan akan dihisab tanpa ada yang tersembunyi.' },
      { key: 'B', text: 'Penggunaan akun anonim diperbolehkan asalkan tujuannya untuk mengkritik kekurangan fisik teman sekelas secara terus terang.' },
      { key: 'C', text: 'Pertanggungjawaban amal hanya berlaku bagi ucapan lisan yang bersuara nyata, bukan pada tulisan atau teks di ruang digital.' },
      { key: 'D', text: 'Seseorang terbebas dari catatan dosa di akhirat selama identitas aslinya tidak terlacak oleh aparat kepolisian siber.' }
    ],
    correctKey: 'A',
    explanation: 'Q.S. Yasin: 65 dan Al-Zalzalah: 7-8 menegaskan bahwa sekecil apapun amal akan diperlihatkan balasannya, dan tangan akan bersaksi di hadapan Allah. Anonimitas duniawi tidak berlaku di Yaumul Hisab.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: akuntabilitas eskatologis moral.',
      B: 'Pembenaran atas kezaliman cyberbullying yang dilarang syariat.',
      C: 'Miskonsepsi fatal membatasi hisab hanya pada suara lisan.',
      D: 'Pandangan sekuler yang menafikan pengawasan Allah Swt.'
    },
    islamicValue: 'Akuntabilitas Eskatologis, Kesadaran Yaumul Hisab, dan Adab Digital',
    realLifeContext: 'Fenomena akun palsu anonim dan cyberbullying di kalangan remaja',
    dalilReference: 'Q.S. Yasin [36]: 65 & Q.S. Al-Zalzalah [99]: 7-8',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-ix-1-akhlak-kasih-sayang-sesama',
    number: 23,
    grade: 'IX',
    semester: '1',
    element: 'Akhlak',
    temaId: 'tema-ix-1-akhlak-kasih-sayang-sesama',
    tema: 'Menerapkan Makna Kasih Sayang kepada Sesama',
    tp: 'Menerapkan makna kasih sayang kepada sesama',
    materi: 'Penerapan Makna Kasih Sayang kepada Sesama, Empati Sosial, dan Menolak Perundungan',
    submateri: 'Pencegahan Perundungan (Bullying) di Sekolah Berbasis Ukhuwah dan Ta\'awun',
    indicator: 'Disajikan fenomena pengucilan siswa di kelas, peserta didik dapat merancang solusi konkret berbasis kasih sayang sesama.',
    stimulus: 'Di kelas IX-C, seorang siswa pindahan yang pendiam sering dijadikan bahan tertawaan dan sengaja tidak diajak masuk ke dalam kelompok belajar tugas sekolah. Zidan mengamati hal tersebut dan merasa prihatin karena tindakan tersebut bertentangan dengan sabda Nabi Saw. bahwa seorang muslim adalah saudara bagi muslim lainnya dan tidak boleh menzaliminya.',
    operationalVerb: 'Merancang tindakan konkret berbasis kasih sayang untuk mengatasi perundungan relasional',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Tindakan proaktif yang paling mencerminkan penerapan makna kasih sayang kepada sesama yang harus dilakukan Zidan adalah...',
    options: [
      { key: 'A', text: 'Mengajak siswa pindahan tersebut bergabung ke dalam kelompok belajarnya secara hangat dan mengingatkan teman sekelas dengan santun agar menghentikan pengucilan.' },
      { key: 'B', text: 'Ikut mendiamkan situasi tersebut agar tidak menjadi sasaran ejekan baru oleh kelompok mayoritas kelas.' },
      { key: 'C', text: 'Membalas mengejek teman-teman yang melakukan pengucilan agar mereka merasakan hal yang sama.' },
      { key: 'D', text: 'Menyarankan siswa pindahan tersebut untuk segera pindah ke sekolah lain yang lebih ramah.' }
    ],
    correctKey: 'A',
    explanation: 'Kasih sayang kepada sesama diwujudkan dengan merangkul yang lemah, membela korban pengucilan, dan menghentikan kezaliman perundungan secara damai dan santun.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: aksi nyata ukhuwah dan kasih sayang.',
      B: 'Sikap bystander pasif yang membiarkan kezaliman berlangsung.',
      C: 'Membalas kezaliman dengan kezaliman baru yang memperkeruh suasana.',
      D: 'Solusi melarikan diri tanpa menyelesaikan akar permasalahan kelas.'
    },
    islamicValue: 'Kasih Sayang (Rahmah), Ukhuwah Islamiyah, Anti-Bullying, dan Empati Sosial',
    realLifeContext: 'Mengatasi pengucilan teman sekelas di lingkungan madrasah',
    dalilReference: 'H.R. Bukhari-Muslim & Q.S. Al-Ma\'idah [5]: 2',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-ix-1-fikih-sembelihan-kurban',
    number: 24,
    grade: 'IX',
    semester: '1',
    element: 'Fikih',
    temaId: 'tema-ix-1-fikih-sembelihan-kurban',
    tema: 'Ketentuan Penyembelihan Hewan, Kurban, dan Akikah',
    tp: 'Menganalisis ketentuan penyembelihan hewan, kurban, dan akikah',
    materi: 'Ketentuan Syar\'i Penyembelihan Hewan secara Ihsan, Ibadah Kurban, dan Akikah',
    submateri: 'Prinsip Ihsan dalam Penyembelihan Hewan Halal Menurut Hadis Riwayat Muslim',
    indicator: 'Disajikan praktik penyembelihan hewan kurban di sekolah, peserta didik dapat menganalisis penerapan prinsip ihsan syar\'i.',
    stimulus: 'Pada hari raya Idul Adha di sekolah, panitia kurban mempersiapkan penyembelihan tiga ekor sapi. Juru sembelih memastikan pisau yang digunakan benar-benar tajam dan mengasahnya di tempat tertutup agar tidak terlihat oleh hewan yang akan disembelih, merebahkan hewan dengan lembut menghadap kiblat, serta mempercepat proses pemotongan tiga saluran leher.',
    operationalVerb: 'Menganalisis penerapan prinsip ihsan dalam penyembelihan hewan kurban',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Penerapan prosedur oleh juru sembelih tersebut paling tepat selaras dengan prinsip syariat Islam karena...',
    options: [
      { key: 'A', text: 'Menjalankan kewajiban berbuat ihsan sebagaimana diperintahkan Rasulullah Saw. agar hewan sembelihan tidak tersiksa dan daging yang dihasilkan halal lagi thayyib.' },
      { key: 'B', text: 'Mempercepat waktu kerja panitia semata agar pembagian daging kurban dapat selesai sebelum salat Dzuhur.' },
      { key: 'C', text: 'Menghindari biaya tambahan untuk membeli peralatan pemingsan hewan modern.' },
      { key: 'D', text: 'Menunjukkan keahlian memotong di hadapan para siswa penonton bazar kurban.' }
    ],
    correctKey: 'A',
    explanation: 'Rasulullah Saw. bersabda (H.R. Muslim): "Sesungguhnya Allah mewajibkan berlaku ihsan atas segala sesuatu. Jika kamu menyembelih, sembelihlah dengan baik, tajamkan pisaumu, dan tenangkan sembelihanmu."',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: sesuai hadis sahih tentang ihsan penyembelihan.',
      B: 'Orientasi efisiensi waktu semata tanpa penghayatan nilai syariat.',
      C: 'Pertimbangan biaya finansial sempit.',
      D: 'Sikap pamer keahlian yang merusak kesakralan ibadah kurban.'
    },
    islamicValue: 'Prinsip Ihsan, Kesejahteraan Hewan (Animal Welfare Syar\'i), dan Halalan Thayyiban',
    realLifeContext: 'Penyelenggaraan penyembelihan hewan kurban di madrasah/sekolah',
    dalilReference: 'H.R. Muslim No. 1955 & Q.S. Al-Kautsar [108]: 2',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-ix-1-spi-safawi',
    number: 25,
    grade: 'IX',
    semester: '1',
    element: 'Sejarah Peradaban Islam',
    temaId: 'tema-ix-1-spi-safawi',
    tema: 'Peradaban Dinasti Safawi',
    tp: 'Memahami peradaban Dinasti Safawi',
    materi: 'Sejarah, Perkembangan, dan Analisis Kemajuan Seni Budaya Peradaban Dinasti Safawi di Persia',
    submateri: 'Kemajuan Arsitektur Kota Isfahan dan Seni Budaya pada Masa Syah Abbas I',
    indicator: 'Disajikan sejarah kejayaan kota Isfahan masa Dinasti Safawi, peserta didik dapat menganalisis kontribusi seni arsitektur Islam Persia bagi peradaban dunia.',
    stimulus: 'Pada masa pemerintahan Syah Abbas I (1588-1629 M), ibu kota Dinasti Safawi dipindahkan ke Isfahan. Kota ini ditata dengan tata ruang spektakuler, seperti Lapangan Naqsh-e Jahan (Setengah Dunia) dan Masjid Syah dengan kubah biru berhias mozaik keramik kaligrafi yang memesona. Keindahan kota ini menarik para pelancong dan saudagar dari Eropa dan Asia.',
    operationalVerb: 'Menganalisis kemajuan peradaban seni arsitektur Dinasti Safawi',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Pelajaran sejarah peradaban (ibrah) dari kemajuan Dinasti Safawi yang dapat memperkaya wawasan estetika generasi muda muslim saat ini adalah...',
    options: [
      { key: 'A', text: 'Peradaban Islam memiliki kekayaan estetika seni arsitektur dan tata kota bernilai tinggi yang memadukan nilai spiritualitas tauhid dengan keindahan karya budaya lokal.' },
      { key: 'B', text: 'Pembangunan monumen mewah merupakan satu-satunya ukuran keberhasilan sebuah kerajaan tanpa memerlukan stabilitas politik.' },
      { key: 'C', text: 'Seni arsitektur masa lampau tidak relevan lagi untuk dipelajari di era desain arsitektur modern.' },
      { key: 'D', text: 'Kejayaan suatu bangsa hanya dapat dipertahankan melalui perang berkepanjangan tanpa diplomasi perdagangan.' }
    ],
    correctKey: 'A',
    explanation: 'Dinasti Safawi membuktikan bahwa Islam mendorong berkembangnya seni arsitektur dan kebudayaan tinggi yang harmonis dengan nilai spiritualitas tauhid (Isfahan nisf-e jahan).',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: menunjukkan apresiasi kebudayaan Islam tinggi.',
      B: 'Pandangan keliru yang mengabaikan pilar stabilitas ekonomi dan politik.',
      C: 'Sikap mengabaikan warisan sejarah peradaban.',
      D: 'Keliru, Syah Abbas I justru memajukan perdagangan dan diplomasi internasional.'
    },
    islamicValue: 'Apresiasi Seni Islam, Estetika Tauhid, dan Pelajaran Sejarah Kebudayaan',
    realLifeContext: 'Mempelajari warisan arsitektur dan tata kota peradaban Islam dunia',
    dalilReference: 'Q.S. Al-Hajj [22]: 46 & Q.S. Al-Hasyr [59]: 2',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },

  // =========================================================================
  // 6. KELAS IX - SEMESTER 2
  // =========================================================================
  {
    id: 'bank-q-ix-2-quran-sabar-musibah',
    number: 26,
    grade: 'IX',
    semester: '2',
    element: "Al-Qur'an Hadis",
    temaId: 'tema-ix-2-quran-sabar-musibah',
    tema: 'Pentingnya Sabar dalam Menghadapi Musibah dan Ujian',
    tp: 'Menganalisis ayat Al-Qur\'an dan hadis terkait pentingnya sabar dalam menghadapi musibah dan ujian',
    materi: 'Ayat Al-Qur\'an dan Hadis terkait Pentingnya Sabar dalam Menghadapi Musibah dan Ujian',
    submateri: 'Kandungan Q.S. Al-Baqarah: 155-157 dan Ketahanan Resiliensi Spiritual Remaja',
    indicator: 'Disajikan studi kasus siswa yang menghadapi musibah atau kegagalan ujian, peserta didik dapat menganalisis sikap sabar aktif dan istirja\'.',
    stimulus: 'Tim karya ilmiah remaja SMP yang dipimpin Naila telah berlatih intensif selama tiga bulan. Namun, pada hari perlombaan nasional, laptop berisi berkas presentasi rusak mendadak sehingga mereka gagal meraih gelar juara. Naila menenangkan rekan-rekannya dengan melafalkan istirja\' (Inna Lillahi wa Inna Ilaihi Raji\'un), mengajak tim bersabar, dan segera menyusun rencana perbaikan untuk kompetisi berikutnya.',
    operationalVerb: 'Menganalisis hakikat sabar aktif dalam menghadapi kegagalan',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sulit',
    questionType: 'Pilihan Ganda',
    questionText: 'Sikap yang diambil Naila paling mendalam merefleksikan makna sabar dalam Q.S. Al-Baqarah [2]: 155-157 karena...',
    options: [
      { key: 'A', text: 'Memadukan ketenangan spiritual (istirja\') dengan ketahanan mental aktif untuk merefleksikan kegagalan sebagai sarana peningkatan kapasitas diri.' },
      { key: 'B', text: 'Menerima keadaan dengan pasrah total tanpa berupaya mencari solusi perbaikan untuk kompetisi berikutnya.' },
      { key: 'C', text: 'Menekan emosi kekecewaan agar dipandang sebagai pemimpin yang kuat oleh guru pembimbing.' },
      { key: 'D', text: 'Menghindari konflik terbuka dengan panitia penyelenggara demi menjaga citra baik nama sekolah.' }
    ],
    correctKey: 'A',
    explanation: 'Sabar dalam Islam bukanlah kepasrahan buta, melainkan resiliensi aktif: berserah diri kepada ketetapan Allah (istirja\') diiringi ikhtiar rasional bangkit memperbaiki diri.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: menunjukkan sabar aktif dan resiliensi spiritual.',
      B: 'Fatalisme/pasrah putus asa bukanlah ajaran sabar Islam.',
      C: 'Pencitraan sosial lahiriah yang semu.',
      D: 'Pertimbangan pragmatis sempit tanpa nilai ketakwaan.'
    },
    islamicValue: 'Resiliensi Spiritual, Sabar Aktif, Istirja\', dan Husnuzan kepada Allah',
    realLifeContext: 'Menghadapi kegagalan dalam perlombaan sekolah dan ujian kelulusan',
    dalilReference: 'Q.S. Al-Baqarah [2]: 155-157 & H.R. Muslim',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-ix-2-akidah-qada-qadar',
    number: 27,
    grade: 'IX',
    semester: '2',
    element: 'Akidah',
    temaId: 'tema-ix-2-akidah-qada-qadar',
    tema: 'Iman kepada Qada dan Qadar',
    tp: 'Menganalisis makna iman kepada qada dan qadar',
    materi: 'Makna Iman kepada Qada dan Qadar serta Tawakal Proporsional',
    submateri: 'Sinergi Ikhtiar Maksimal, Doa Tulus, dan Tawakal Menghadapi Hasil Asesmen Akhir',
    indicator: 'Disajikan studi kasus siswa menghadapi hasil seleksi masuk SMA, peserta didik dapat menganalisis sikap tawakal proporsional.',
    stimulus: 'Farhan telah belajar giat selama berbulan-bulan dan senantiasa melaksanakan salat tahajud serta bermunajat agar diterima di SMA favorit impiannya. Namun saat pengumuman dirilis, namanya tidak tercantum dalam daftar peserta lolos. Sahabatnya menyarankan agar Farhan mengurung diri dan menyalahkan takdir. Farhan menolak saran itu dan memilih berlapang dada serta mencari sekolah alternatif.',
    operationalVerb: 'Menganalisis respons tawakal sejati seorang mukmin terhadap takdir ilahi',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sulit',
    questionType: 'Pilihan Ganda',
    questionText: 'Sikap yang paling mencerminkan keimanan mendalam kepada Qada dan Qadar Allah Swt. adalah...',
    options: [
      { key: 'A', text: 'Menerima ketetapan tersebut dengan lapang dada (ridha), meyakini ada hikmah terbaik yang belum tersingkap, serta segera berikhtiar mencari peluang di sekolah lain dengan semangat baru.' },
      { key: 'B', text: 'Menyalahkan diri sendiri dan berhenti berikhtiar karena meyakini masa depannya sudah tertutup oleh kegagalan tersebut.' },
      { key: 'C', text: 'Melakukan protes keras kepada panitia seleksi dengan prasangka buruk bahwa telah terjadi kecurangan manipulasi nilai.' },
      { key: 'D', text: 'Bersikap acuh tak acuh dan menganggap doa serta kerja keras tidak pernah memiliki pengaruh apa pun dalam kehidupan.' }
    ],
    correctKey: 'A',
    explanation: 'Iman kepada qada dan qadar mengajarkan seorang mukmin untuk tidak berputus asa saat gagal dan tidak sombong saat berhasil. Ikhtiar adalah kewajiban manusiawi, sedangkan hasil adalah hak prerogatif Allah yang pasti mengandung hikmah kebaikan (Q.S. Al-Baqarah: 216).',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: kedewasaan spiritual dan resiliensi mukmin.',
      B: 'Keputusasaan (su\'uzhan pada takdir) yang dilarang dalam Islam.',
      C: 'Tuduhan tanpa bukti yang menabrak adab tabayyun.',
      D: 'Fatalisme keliru yang memutus korelasi ikhtiar dan ketetapan Allah.'
    },
    islamicValue: 'Ridha Terhadap Takdir, Tawakal Total, Husnuzan kepada Allah, dan Resiliensi Mental',
    realLifeContext: 'Menghadapi pengumuman kelulusan dan seleksi masuk jenjang SMA/MA',
    dalilReference: 'Q.S. Ar-Ra\'d [13]: 11 & Q.S. At-Talaq [65]: 3',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-ix-2-akhlak-lingkungan-alam',
    number: 28,
    grade: 'IX',
    semester: '2',
    element: 'Akhlak',
    temaId: 'tema-ix-2-akhlak-lingkungan-alam',
    tema: 'Menerapkan Makna Kasih Sayang kepada Lingkungan Alam',
    tp: 'Menerapkan makna kasih sayang kepada lingkungan alam',
    materi: 'Penerapan Makna Kasih Sayang kepada Lingkungan Alam dan Tanggung Jawab Ekologis Pelajar',
    submateri: 'Mandat Khalifah Fil Ardh dan Gerakan Madrasah Hijau Bebas Sampah Plastik',
    indicator: 'Disajikan data timbulan sampah plastik di kantin sekolah, peserta didik dapat merancang strategi berkelanjutan berbasis mandat khalifah fil ardh.',
    stimulus: 'Data sekolah Adiwiyata menunjukkan setiap hari kantin sekolah menghasilkan lebih dari 500 botol dan gelas plastik sekali pakai yang mencemari lingkungan serta menyumbat saluran pembuangan air. Tindakan membuang dan menumpuk sampah ini bertentangan dengan firman Allah Swt. dalam Q.S. Ar-Rum: 41 tentang larangan berbuat kerusakan di muka bumi.',
    operationalVerb: 'Merancang strategi berkelanjutan pengurangan sampah berbasis nilai Islam',
    bloomLevel: 'C6',
    soloLevel: 'Extended Abstract',
    deepLearningDim: 'Mentransfer',
    difficulty: 'Sangat Sulit',
    questionType: 'Pilihan Ganda',
    questionText: 'Rancangan aksi nyata berbasis nilai akhlak Islam yang paling sistemik dan berkelanjutan untuk mengatasi krisis sampah tersebut adalah...',
    options: [
      { key: 'A', text: 'Meluncurkan kebijakan "Gerakan Madrasah Zero-Waste": mewajibkan seluruh warga membawa tumbler & wadah makan mandiri, mendirikan unit sedekah kompos kantin, dan membiasakan fikih bi\'ah sebagai bagian dari karakter takwa harian.' },
      { key: 'B', text: 'Menambah jumlah tempat sampah plastik di setiap koridor kelas tanpa mengubah kebiasaan membeli kemasan sekali pakai.' },
      { key: 'C', text: 'Menghukum siswa yang membuang sampah sembarangan dengan denda uang tunai yang dimasukkan ke kas OSIS.' },
      { key: 'D', text: 'Membakar seluruh sampah plastik setiap sore di halaman belakang madrasah agar tidak terlihat menumpuk.' }
    ],
    correctKey: 'A',
    explanation: 'Level C6 (Mencipta) menuntut solusi integratif: menyentuh regulasi hulu (mengurangi konsumsi kemasan plastik), infrastruktur daur ulang (kompos), serta edukasi akhlak spiritual (fikih bi\'ah) agar berkelanjutan.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: solusi sistemik, holistik, dan ramah lingkungan.',
      B: 'Solusi hilir pasif yang tidak menyelesaikan akar persoalan timbulan plastik.',
      C: 'Pendekatan punitif sementara tanpa membangun kesadaran kesalehan ekologis.',
      D: 'Tindakan fatal yang menimbulkan polusi udara berbahaya (fasad fil ardh baru).'
    },
    islamicValue: 'Mandat Khalifah Fil Ardh, Konservasi Alam, Fikih Bi\'ah, dan Tanggung Jawab Ekologis',
    realLifeContext: 'Program sekolah Adiwiyata dan penanganan krisis sampah plastik',
    dalilReference: 'Q.S. Ar-Rum [30]: 41 & Q.S. Al-A\'raf [7]: 56',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-ix-2-fikih-rukhsah-mazhab',
    number: 29,
    grade: 'IX',
    semester: '2',
    element: 'Fikih',
    temaId: 'tema-ix-2-fikih-rukhsah-mazhab',
    tema: 'Ketentuan Rukhsah dalam Perspektif Mazhab Fikih',
    tp: 'Menganalisis ketentuan rukhsah (kemudahan) dalam perspektif mazhab fikih',
    materi: 'Ketentuan Rukhsah (Keringanan Ibadah) dalam Perspektif Mazhab Fikih',
    submateri: 'Ketentuan Salat Jamak dan Qashar bagi Musafir Menurut Mazhab Fikih',
    indicator: 'Disajikan skenario perjalanan studi wisata antarkota, peserta didik dapat menentukan ketentuan salat jamak-qashar yang sah menurut mazhab fikih.',
    stimulus: 'Rombongan siswa SMP mengadakan studi wisata dari Surabaya ke Yogyakarta dengan jarak tempuh lebih dari 300 km. Mereka berangkat pukul 06.00 WIB. Saat waktu Dzuhur tiba, bus berhenti di tempat peristirahatan jalan tol. Guru pembimbing mengajak seluruh siswa melaksanakan salat jamak qashar taqdim untuk salat Dzuhur dan Ashar.',
    operationalVerb: 'Menganalisis ketentuan pelaksanaan salat jamak qashar bagi musafir',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Mengaplikasi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Pelaksanaan salat jamak taqdim dan qashar yang benar dan sah sesuai kaidah fikih adalah...',
    options: [
      { key: 'A', text: 'Melaksanakan salat Dzuhur 2 rakaat terlebih dahulu, setelah salam segera berdiri melaksanakan salat Ashar 2 rakaat tanpa diselingi jeda waktu yang lama.' },
      { key: 'B', text: 'Menggabungkan salat Dzuhur dan Ashar dalam satu kali niat dan satu kali salam sebanyak 4 rakaat sekaligus.' },
      { key: 'C', text: 'Melaksanakan salat Ashar 2 rakaat terlebih dahulu baru kemudian melaksanakan salat Dzuhur 2 rakaat.' },
      { key: 'D', text: 'Melaksanakan salat Dzuhur 4 rakaat sempurna kemudian salat Ashar 4 rakaat sempurna di waktu Dzuhur.' }
    ],
    correctKey: 'A',
    explanation: 'Ketentuan jamak taqdim qashar: tertib (mendahulukan salat yang empunya waktu, yaitu Dzuhur), qashar (menjadi 2 rakaat), muwalat (berkesinambungan tanpa jeda lama antara dua salat), dan berniat jamak.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat sesuai kaidah fikih mazhab Syafi\'i.',
      B: 'Keliru, dua salat fardhu tidak boleh digabung dalam satu kali salam sekaligus.',
      C: 'Keliru, jamak taqdim wajib mendahulukan salat pertama (tertib).',
      D: 'Ini adalah jamak tamam (tidak di-qashar), bukan jamak qashar.'
    },
    islamicValue: 'Kemudahan Syariat (Rukhsah), Disiplin Ibadah Musafir, dan Toleransi Mazhab',
    realLifeContext: 'Perjalanan studi wisata sekolah atau mudik luar kota',
    dalilReference: 'Q.S. An-Nisa\' [4]: 101 & Q.S. Al-Baqarah [2]: 185',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  },
  {
    id: 'bank-q-ix-2-spi-mughal',
    number: 30,
    grade: 'IX',
    semester: '2',
    element: 'Sejarah Peradaban Islam',
    temaId: 'tema-ix-2-spi-mughal',
    tema: 'Peradaban Dinasti Mughal',
    tp: 'Menganalisis peradaban Dinasti Mughal',
    materi: 'Sejarah, Masa Kejayaan, dan Kemajuan Peradaban Dinasti Mughal di India',
    submateri: 'Mahakarya Arsitektur Taj Mahal dan Pengelolaan Kerukunan Multikultural',
    indicator: 'Disajikan sejarah pembangunan Taj Mahal dan kebijakan Dinasti Mughal di India, peserta didik dapat menganalisis pelajaran sejarah tentang kerukunan dalam masyarakat multikultural.',
    stimulus: 'Dinasti Mughal di India mencapai puncak kejayaan di bawah Sultan Akbar dan Syah Jahan. Selain mewariskan monumen keajaiban dunia Taj Mahal dan Benteng Merah (Red Fort), para penguasa Mughal berhasil memimpin wilayah anak benua India yang sangat majemuk dengan jutaan penduduk beragama Hindu, Islam, dan keyakinan lainnya dengan menjaga perdamaian dan keharmonisan sosial selama berabad-abad.',
    operationalVerb: 'Menganalisis kemajuan peradaban Dinasti Mughal dalam mengelola keragaman',
    bloomLevel: 'C4',
    soloLevel: 'Relational',
    deepLearningDim: 'Merefleksi',
    difficulty: 'Sedang',
    questionType: 'Pilihan Ganda',
    questionText: 'Pelajaran sejarah peradaban (ibrah) terbesar dari masa kejayaan Dinasti Mughal di India bagi kehidupan berbangsa di Indonesia adalah...',
    options: [
      { key: 'A', text: 'Kemampuan memadukan kemajuan seni arsitektur bernilai estetika dunia dengan kepemimpinan yang adil dan mengayomi masyarakat multikultural majemuk.' },
      { key: 'B', text: 'Membangun monumen megah dengan mengorbankan kesejahteraan ekonomi rakyat jelata.' },
      { key: 'C', text: 'Menghapuskan seluruh tradisi budaya lokal demi memaksakan satu corak budaya tunggal.' },
      { key: 'D', text: 'Mengisolasi negara dari perdagangan internasional agar tidak terpengaruh bangsa asing.' }
    ],
    correctKey: 'A',
    explanation: 'Kejayaan Dinasti Mughal mengajarkan bahwa peradaban besar ditopang oleh kepemimpinan adil yang mampu merawat kerukunan di tengah keberagaman multikultural, disertai pencapaian karya arsitektur spektakuler.',
    distractorExplanation: {
      A: 'Kunci jawaban yang tepat: sintesis nilai ibrah historis bagi kebangsaan Indonesia.',
      B: 'Kritik negatif yang menafikan kemajuan peradaban yang dicapai.',
      C: 'Bertentangan dengan fakta akulturasi budaya Mughal-India (seni lukis dan arsitektur Indo-Islam).',
      D: 'Keliru, Mughal adalah salah satu pusat perdagangan sutra dan rempah tersibuk.'
    },
    islamicValue: 'Kepemimpinan Adil, Kerukunan Multikultural, dan Mahakarya Peradaban Islam',
    realLifeContext: 'Menjaga persatuan dan toleransi dalam masyarakat majemuk Indonesia',
    dalilReference: 'Q.S. Yusuf [12]: 111 & Q.S. Al-Hujurat [49]: 13',
    source: 'Kurikulum Merdeka 2026',
    qualityScore: {
      tpAlignment: 4, stimulusQuality: 4, bloomPrecision: 4, soloPrecision: 4,
      optionHomogeneity: 4, distractorQuality: 4, contextuality: 4, cognitiveDepth: 4,
      total: 32, category: 'Sangat Baik'
    }
  }
];
