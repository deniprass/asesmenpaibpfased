import { CpThemeClassification, PaibpElement } from '../types';

export const OFFICIAL_CP_CLAUSES: Record<PaibpElement, string> = {
  "Al-Qur'an Hadis": "Membaca, menghafal, menulis, dan menjelaskan ayat Al-Qur'an tentang pentingnya iman, takwa, toleransi, cinta tanah air, semangat keilmuan, dan sabar dalam menghadapi musibah dan ujian beserta hadis terkait.",
  "Al-Qur'an dan Hadis": "Membaca, menghafal, menulis, dan menjelaskan ayat Al-Qur'an tentang pentingnya iman, takwa, toleransi, cinta tanah air, semangat keilmuan, dan sabar dalam menghadapi musibah dan ujian beserta hadis terkait.",
  "Akidah": "Meyakini dan merefleksikan rukun iman serta hal-hal yang dapat meneguhkan iman.",
  "Akhlak": "Menerapkan makna ikhlas, bersyukur kepada Allah Swt., cinta rasul, cinta ilmu, cinta lingkungan, serta cinta diri sendiri dan sesama.",
  "Fikih": "Menerapkan ketentuan sujud di luar rukun salat, rukhsah dalam ibadah, kewajiban terhadap jenazah, haji dan umrah, penyembelihan hewan, kurban, akikah, dan wakaf.",
  "Sejarah Peradaban Islam": "Merefleksikan sejarah dan peran Kekhalifahan Islam pasca Khulafaur Rasyidin serta sejarah masuknya Islam di Indonesia."
};

/**
 * KLASIFIKASI 30 TEMA CAPAIAN PEMBELAJARAN (CP) & ATP PAIBP FASE D (KELAS VII, VIII, IX)
 * Tersinkronisasi presisi sesuai breakdown materi per jenjang kelas dan semester
 */
export const CP_THEMES_CLASSIFICATION: CpThemeClassification[] = [
  // =========================================================================
  // KELAS VII - SEMESTER 1 (5 TEMA)
  // =========================================================================
  {
    themeId: 'tema-vii-1-quran-iman',
    element: "Al-Qur'an Hadis",
    temaName: "Pentingnya Iman dalam Kehidupan Seorang Muslim",
    cpClause: "Membaca, menghafal, menulis, dan menjelaskan ayat Al-Qur'an dan hadis terkait pentingnya iman dalam kehidupan seorang Muslim.",
    description: "Kajian mendalam tentang hakikat keimanan, enam rukun iman, dan peran iman sebagai kompas moral dan keteguhan jiwa pelajar.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Membaca dan Menelaah Ayat Al-Qur'an dan Hadis tentang Hakikat Keimanan (Q.S. Al-Anfal [8]: 2-4)",
      "Rukun Iman dan Perwujudan Iman dalam Niat, Ucapan Lisan, dan Perbuatan Nyata",
      "Peran Iman sebagai Fondasi Moral, Pembimbing Perilaku, dan Keteguhan Mental Pelajar",
      "Karakteristik Muslim Beriman dalam Menghadapi Godaan Lingkungan dan Era Digital"
    ],
    dalilReference: "Q.S. Al-Anfal [8]: 2-4 & H.R. Muslim (Hadis Jibril)",
    dalilMeaning: "Sesungguhnya orang-orang yang beriman adalah mereka yang apabila disebut nama Allah gemetar hatinya, dan apabila dibacakan ayat-ayat-Nya bertambah iman mereka...",
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya iman dalam kehidupan seorang Muslim",
      "Menelaah ciri-ciri mukmin sejati berdasarkan Q.S. Al-Anfal: 2-4 dalam membangun integritas diri di sekolah.",
      "Merancang komitmen pengamalan rukun iman dalam perkataan dan perbuatan sehari-hari."
    ],
    contextExamples: [
      "Menjaga konsistensi kejujuran saat ujian mandiri tanpa pengawas",
      "Keteguhan memegang prinsip keimanan di tengah pergaulan bebas",
      "Menolak ajakan perbuatan tercela di media sosial karena kesadaran iman",
      "Menjadikan iman sebagai motivasi berprestasi dan berbuat kebajikan"
    ]
  },
  {
    themeId: 'tema-vii-1-akidah-sifat',
    element: "Akidah",
    temaName: "Makna Iman kepada Allah Swt. dan Peneguh Keimanan",
    cpClause: "Menganalisis makna iman kepada Allah Swt. melalui sifat-sifat-Nya dan hal-hal yang dapat meneguhkan iman.",
    description: "Mengenal sifat wajib, mustahil, jaiz bagi Allah, meneladani Asmaul Husna, serta mengamalkan faktor-faktor peneguh keimanan.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Mengenal Allah Swt. melalui Sifat Wajib, Sifat Mustahil, dan Sifat Jaiz bagi Allah",
      "Meneladani Asmaul Husna (Al-'Alim, Al-Khabir, As-Sami', Al-Bashir) dalam Membangun Karakter",
      "Hal-Hal yang Meneguhkan Iman: Konsistensi Ibadah (Istiqamah), Dzikirullah, dan Berteman dengan Orang Saleh",
      "Membentengi Diri dari Keraguan dan Pengaruh Negatif yang Melemahkan Iman"
    ],
    dalilReference: "Q.S. Al-A'raf [7]: 180 & Q.S. Ar-Ra'd [13]: 28",
    dalilMeaning: "Hanya milik Allah Asmaul Husna, maka bermohonlah kepada-Nya dengan menyebut Asmaul Husna itu... Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    suggestedTpList: [
      "Menganalisis makna iman kepada Allah Swt. melalui sifat-sifat-Nya dan hal-hal yang dapat meneguhkan iman",
      "Mengevaluasi pengamalan Asmaul Husna Al-Bashir dan Al-'Alim dalam menjaga kejujuran saat ujian tanpa pengawasan.",
      "Menyusun peta kebiasaan spiritual harian (istiqamah dzikir dan shalat) sebagai peneguh keimanan remaja."
    ],
    contextExamples: [
      "Menjaga amanah dana kas kelas tanpa ada yang melihat",
      "Menenangkan hati dengan dzikir saat cemas menghadapi ujian",
      "Memilih teman pergaulan yang saling mengingatkan dalam kebaikan",
      "Meyakini pengawasan Allah Swt. di ruang privat maupun publik"
    ]
  },
  {
    themeId: 'tema-vii-1-akhlak-ikhlas',
    element: "Akhlak",
    temaName: "Menerapkan Makna Ikhlas",
    cpClause: "Menerapkan makna ikhlas dalam niat, ibadah, dan kehidupan sehari-hari.",
    description: "Hakikat keikhlasan lillahi ta'ala, menghindari riya, sum'ah, ujub, serta mengamalkan ketulusan tanpa pamrih dalam pergaulan sosial.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Hakikat Ikhlas: Memurnikan Niat Semata-mata karena Allah Swt. (Lillahi Ta'ala)",
      "Bahaya Perusak Amal: Riya' (Pamer), Sum'ah (Mencari Pujian), dan Ujub (Bangga Diri)",
      "Ciri-ciri Pribadi yang Ikhlas dalam Belajar, Berorganisasi OSIS, dan Membantu Teman",
      "Menghindari Budaya Flexing Amal Kebaikan di Media Sosial"
    ],
    dalilReference: "Q.S. Al-Bayyinah [98]: 5 & H.R. Bukhari (Innamal A'malu bin Niyyat)",
    dalilMeaning: "Padahal mereka tidak disuruh kecuali supaya menyembah Allah dengan memurnikan ketaatan kepada-Nya dalam (menjalankan) agama dengan lurus...",
    suggestedTpList: [
      "Menerapkan makna ikhlas",
      "Menganalisis kemurnian niat dalam kegiatan sosial kesiswaan agar terbebas dari dorongan riya dan flexing.",
      "Merancang aksi kepedulian sosial di sekolah berbasis keikhlasan tanpa mengharapkan imbalan pujian."
    ],
    contextExamples: [
      "Menolong teman yang terjatuh tanpa mendokumentasikan untuk konten media sosial",
      "Menerima keputusan musyawarah kelas dengan lapang dada",
      "Membersihkan lingkungan kelas tanpa menunggu disuruh atau dipuji guru",
      "Menjaga kerahasiaan sedekah dan bantuan kemanusiaan"
    ]
  },
  {
    themeId: 'tema-vii-1-fikih-sujud',
    element: "Fikih",
    temaName: "Ketentuan Macam-Macam Sujud",
    cpClause: "Menganalisis ketentuan macam-macam sujud (sujud syukur, sahwi, dan tilawah).",
    description: "Syarat, rukun, sebab, bacaan, dan tata cara pelaksanaan sujud syukur, sujud sahwi, dan sujud tilawah secara tertib.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Ketentuan, Sebab, dan Tata Cara Sujud Syukur atas Nikmat Besar atau Terhindar Musibah",
      "Ketentuan, Sebab, Bacaan, dan Tata Cara Sujud Sahwi saat Lupa atau Ragu Rakaat Salat",
      "Ketentuan, Sebab, Ayat-Ayat Sajdah, dan Tata Cara Sujud Tilawah di Luar dan di Dalam Salat",
      "Perbandingan Rukun, Syarat, dan Praktik Ketiga Macam Sujud dalam Kehidupan Sehari-hari"
    ],
    dalilReference: "H.R. Abu Dawud, Tirmidzi & H.R. Muslim",
    dalilMeaning: "Dari Abu Bakrah: Apabila datang kepada Nabi kabar gembira atau hal yang menggembirakan, beliau tersungkur sujud bersyukur kepada Allah.",
    suggestedTpList: [
      "Menganalisis ketentuan macam-macam sujud (sujud syukur, sahwi, dan tilawah)",
      "Membedakan sebab-sebab pelaksanaan sujud syukur, sujud sahwi, dan sujud tilawah serta tata caranya secara tepat.",
      "Mendemonstrasikan praktik sujud sahwi dalam menyelesaikan kasus keraguan jumlah rakaat salat berjamaah."
    ],
    contextExamples: [
      "Sujud syukur spontan saat mendengar kelulusan atau kemenangan tim sekolah",
      "Imam lupa tasyahud awal pada salat Isya lalu melakukan sujud sahwi sebelum salam",
      "Mendengar ayat sajdah saat membaca Surah Al-Alaq lalu melakukan sujud tilawah",
      "Menyelesaikan keraguan rakaat salat fardhu dengan mengambil jumlah terkecil"
    ]
  },
  {
    themeId: 'tema-vii-1-spi-umayyah',
    element: "Sejarah Peradaban Islam",
    temaName: "Peradaban Daulah Bani Umayyah",
    cpClause: "Menganalisis sejarah dan kemajuan peradaban Bani Umayyah.",
    description: "Sejarah berdirinya Bani Umayyah di Damaskus dan Andalusia, kemajuan administrasi, arsitektur, sains, serta keteladanan Khalifah Umar bin Abdul Aziz.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Latar Belakang Berdirinya Daulah Bani Umayyah dan Fase Pemerintahan di Damaskus serta Andalusia",
      "Keteladanan Integritas dan Keadilan Fiskal Khalifah Umar bin Abdul Aziz",
      "Kemajuan Administrasi Pemerintahan, Arsitektur Masjid Damaskus/Cordoba, dan Ilmu Pengetahuan",
      "Ibrah Kepemimpinan, Keadilan Hukum, dan Semangat Membangun Peradaban bagi Pelajar"
    ],
    dalilReference: "Q.S. An-Nisa' [4]: 58 & Q.S. Yusuf [12]: 111",
    dalilMeaning: "Sungguh, Allah menyuruhmu menyampaikan amanat kepada yang berhak menerimanya, dan apabila kamu menetapkan hukum di antara manusia hendaknya kamu menetapkan dengan adil.",
    suggestedTpList: [
      "Menganalisis peradaban Bani Umayyah",
      "Menganalisis kemajuan administrasi, seni arsitektur, dan perluasan peradaban pada masa Bani Umayyah.",
      "Menyusun refleksi keteladanan keadilan Khalifah Umar bin Abdul Aziz dalam kepemimpinan organisasi kesiswaan."
    ],
    contextExamples: [
      "Menjaga transparansi anggaran kepengurusan OSIS dan kelas",
      "Meneladani kesederhanaan pemimpin berintegritas tinggi",
      "Menghargai warisan keilmuan dan arsitektur peradaban Islam",
      "Menerapkan kedisiplinan dan profesionalitas dalam tugas organisasi"
    ]
  },

  // =========================================================================
  // KELAS VII - SEMESTER 2 (5 TEMA)
  // =========================================================================
  {
    themeId: 'tema-vii-2-quran-takwa',
    element: "Al-Qur'an Hadis",
    temaName: "Pentingnya Takwa kepada Allah Swt.",
    cpClause: "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya takwa kepada Allah Swt.",
    description: "Kajian esensi takwa, ciri-ciri muttaqin (Q.S. Ali 'Imran: 102 & H.R. Tirmidzi), dan penerapannya sebagai integritas moral remaja.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Kandungan Q.S. Ali 'Imran [3]: 102 tentang Perintah Bertakwa Sebenar-Benar Takwa",
      "Kandungan Q.S. Al-Hujurat [49]: 13 tentang Standar Kemuliaan Manusia di Sisi Allah Swt.",
      "Hadis Riwayat Tirmidzi tentang Berwasiat Takwa di Mana Pun Berada (Ittaqillaha Haitsuma Kunta)",
      "Ciri-ciri Pribadi Bertakwa: Menjalankan Perintah, Menjauhi Larangan, dan Mawas Diri di Era Modern"
    ],
    dalilReference: "Q.S. Ali 'Imran [3]: 102 & H.R. Tirmidzi",
    dalilMeaning: "Wahai orang-orang yang beriman! Bertakwalah kepada Allah sebenar-benar takwa kepada-Nya dan janganlah sekali-kali kamu mati melainkan dalam keadaan beragama Islam.",
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya takwa kepada Allah Swt.",
      "Menelaah indikator karakter muttaqin dalam Q.S. Ali 'Imran: 102 dan relevansinya bagi integritas remaja.",
      "Merancang komitmen perilaku bertakwa di lingkungan keluarga, madrasah, dan ruang digital."
    ],
    contextExamples: [
      "Konsistensi menjalankan salat fardhu lima waktu tepat waktu",
      "Menahan diri dari perbuatan dosa saat sendirian di kamar",
      "Berbicara jujur dan santun saat menghadapi situasi sulit",
      "Menjadikan takwa sebagai kompas moral dalam mengambil keputusan"
    ]
  },
  {
    themeId: 'tema-vii-2-akidah-malaikat',
    element: "Akidah",
    temaName: "Iman kepada Malaikat-Malaikat Allah Swt.",
    cpClause: "Menganalisis makna iman kepada malaikat-malaikat Allah Swt.",
    description: "Hakikat dan tugas 10 malaikat, pengawasan malaikat Raqib dan Atid, serta penanaman kesadaran muraqabah di ruang nyata dan maya.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Hakikat, Penciptaan dari Cahaya (Nur), Sifat, dan Ketaatan Mutlak Malaikat Allah Swt.",
      "Sepuluh Malaikat Wajib beserta Tugas-Tugasnya dalam Kehidupan dan Semesta",
      "Menumbuhkan Sikap Muraqabah (Kesadaran Diawasi Malaikat Raqib dan Atid) dalam Berkata dan Berbuat",
      "Korelasi Iman kepada Malaikat dengan Penjagaan Jejak Digital dan Kejujuran Akademik"
    ],
    dalilReference: "Q.S. Qaf [50]: 16-18 & Q.S. Al-Infithar [82]: 10-12",
    dalilMeaning: "Tiada suatu ucapan pun yang diucapkannya melainkan ada di dekatnya malaikat pengawas yang selalu hadir (Raqib dan Atid).",
    suggestedTpList: [
      "Menganalisis makna iman kepada malaikat-malaikat Allah Swt.",
      "Mengevaluasi pengaruh keimanan kepada malaikat Raqib dan Atid terhadap pengendalian diri dari kecurangan.",
      "Menyusun refleksi personal tentang pembiasaan muraqabah dalam aktivitas sehari-hari."
    ],
    contextExamples: [
      "Menghindari mengetik ujaran kebencian di kolom komentar akun anonim",
      "Menjaga kejujuran saat berbelanja di kantin kejujuran sekolah",
      "Meyakini catatan malaikat tidak pernah luput dari amal sekecil apa pun",
      "Membiasakan perbuatan baik sembunyi-sembunyi agar dicatat malaikat"
    ]
  },
  {
    themeId: 'tema-vii-2-akhlak-syukur',
    element: "Akhlak",
    temaName: "Menerapkan Makna Bersyukur kepada Allah Swt.",
    cpClause: "Menerapkan makna bersyukur kepada Allah Swt.",
    description: "Hakikat syukur nikmat, tiga dimensi syukur (hati, lisan, perbuatan), menghindari kufur nikmat dan gaya hidup konsumtif/flexing.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Hakikat Bersyukur atas Segala Rahmat, Kesehatan, Akal, dan Karunia Allah Swt.",
      "Tiga Dimensi Bersyukur: Syukur dengan Hati (Qalbi), Lisan (Tahmid), dan Perbuatan Nyata (Amali)",
      "Bahaya Penyakit Kufur Nikmat, Selalu Mengeluh, dan Perilaku Boros (Tabzir/Israf)",
      "Mengoptimalkan Nikmat Waktu Muda dan Fasilitas Belajar untuk Meraih Prestasi yang Berkah"
    ],
    dalilReference: "Q.S. Ibrahim [14]: 7 & Q.S. Luqman [31]: 12",
    dalilMeaning: "Sesungguhnya jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu, tetapi jika kamu mengingkari (nikmat-Ku), maka pasti azab-Ku sangat pedih.",
    suggestedTpList: [
      "Menerapkan makna bersyukur kepada Allah Swt.",
      "Menganalisis tiga dimensi rasa syukur (hati, lisan, perbuatan) dan implementasinya dalam mengatasi stres akademik.",
      "Merancang aksi syukur amali melalui kegiatan berbagi rezeki dan pendampingan teman sebaya."
    ],
    contextExamples: [
      "Mengucapkan hamdalah dan sujud syukur saat meraih hasil ujian baik",
      "Memanfaatkan gawai dan kuota internet untuk belajar bukan untuk hal sia-sia",
      "Menghindari membuang-buang makanan dan air wudhu",
      "Berbagi bekal makanan dengan teman yang tidak membawa uang jajan"
    ]
  },
  {
    themeId: 'tema-vii-2-fikih-salat-jumat',
    element: "Fikih",
    temaName: "Ketentuan Salat Jumat",
    cpClause: "Menganalisis ketentuan salat Jumat.",
    description: "Ketentuan hukum, syarat wajib, syarat sah, rukun dan adab khotbah Jumat, serta amalan-amalan sunnah pada hari Jumat.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Kedudukan Hukum Salat Jumat bagi Laki-Laki Muslim dan Dalil Kewajibannya",
      "Syarat Wajib dan Syarat Sah Salat Jumat serta Macam-Macam Udzur Syar'i yang Membolehkan Tidak Hadir",
      "Rukun, Syarat, dan Adab Khotbah Jumat (Mendengarkan dengan Tenang tanpa Berbicara atau Main HP)",
      "Amalan Sunnah Hari Jumat: Mandi Jumat, Memotong Kuku, Memakai Wewangian, Membaca Al-Kahfi, dan Perbanyak Shalawat"
    ],
    dalilReference: "Q.S. Al-Jumu'ah [62]: 9-10 & H.R. Abu Dawud",
    dalilMeaning: "Wahai orang-orang yang beriman! Apabila diseru untuk melaksanakan salat pada hari Jumat, maka segeralah kamu mengingat Allah dan tinggalkanlah jual beli...",
    suggestedTpList: [
      "Menganalisis ketentuan salat Jumat",
      "Menganalisis rukun khotbah dan syarat sah salat Jumat serta adab mendengarkan nasihat khatib secara khidmat.",
      "Merancang panduan adab dan ketertiban pelaksanaan salat Jumat di masjid sekolah."
    ],
    contextExamples: [
      "Segera berwudhu dan menuju masjid ketika azan Jumat berkumandang",
      "Menonaktifkan gawai dan tidak mengobrol saat khatib sedang berkhutbah",
      "Mempraktikkan sunnah mandi dan memakai pakaian rapi/bersih pada hari Jumat",
      "Mengambil saf terdepan yang masih kosong dengan tertib"
    ]
  },
  {
    themeId: 'tema-vii-2-spi-abbasiyah',
    element: "Sejarah Peradaban Islam",
    temaName: "Peradaban Daulah Bani Abbasiyah",
    cpClause: "Menganalisis peradaban Bani Abbasiyah.",
    description: "Zaman keemasan Islam (The Golden Age), peran Baitul Hikmah, integrasi sains dan agama oleh para ilmuwan muslim, serta hikmah bagi peradaban.",
    recommendedGrades: ['VII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Kelahiran Daulah Abbasiyah di Baghdad dan Kepemimpinan Khalifah Harun Al-Rasyid serta Al-Ma'mun",
      "Peran Lembaga Riset Baitul Hikmah dan Gerakan Penerjemahan Karya Sains Global Lintas Bangsa",
      "Kemajuan Ilmu Agama (Imam Mazhab, Muhadditsin) dan Sains (Ibnu Sina, Al-Khawarizmi, Jabir bin Hayyan)",
      "Ibrah Semangat Intelektual Muslim dalam Membangun Kemajuan Sains, Literasi, dan Karakter Pelajar"
    ],
    dalilReference: "Q.S. Al-'Alaq [96]: 1-5 & Q.S. Az-Zumar [39]: 9",
    dalilMeaning: "Bacalah dengan (menyebut) nama Tuhanmu Yang menciptakan... Katakanlah: Adakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui?",
    suggestedTpList: [
      "Menganalisis peradaban Bani Abbasiyah",
      "Menganalisis faktor pendorong zaman keemasan ilmu pengetahuan dan peran Baitul Hikmah pada masa Daulah Abbasiyah.",
      "Menyusun gagasan inovasi literasi sains dan riset madrasah yang terinspirasi oleh kejayaan intelektual Abbasiyah."
    ],
    contextExamples: [
      "Mengembangkan budaya membaca buku dan riset ilmiah di perpustakaan sekolah",
      "Mengapresiasi penemuan algoritma dan aljabar warisan Al-Khawarizmi",
      "Mengharmonisasikan pemahaman ilmu agama dan teknologi modern",
      "Membangun rasa percaya diri generasi muda muslim dalam kompetisi sains global"
    ]
  },

  // =========================================================================
  // KELAS VIII - SEMESTER 1 (5 TEMA)
  // =========================================================================
  {
    themeId: 'tema-viii-1-quran-toleransi',
    element: "Al-Qur'an Hadis",
    temaName: "Pentingnya Toleransi dalam Keragaman",
    cpClause: "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya toleransi.",
    description: "Moderasi beragama, prinsip tasamuh dalam masyarakat majemuk (Q.S. Al-Hujurat: 13 & Q.S. Al-Kafirun: 1-6), serta batas akidah dan muamalah.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Kandungan Q.S. Al-Hujurat [49]: 13 tentang Keragaman Suku Bangsa sebagai Sunnatullah untuk Saling Mengenal",
      "Kandungan Q.S. Al-Kafirun [109]: 1-6 tentang Batasan Tegas Akidah dan Menghargai Kebebasan Beragama",
      "Hadis tentang Sikap Samhah (Lapang Dada dan Toleran) dalam Hubungan Muamalah Sosial",
      "Prinsip Moderasi Beragama (Wasathiyah), Menolak Ekstremisme, dan Merawat Persaudaraan Sebangsa"
    ],
    dalilReference: "Q.S. Al-Hujurat [49]: 13 & Q.S. Al-Kafirun [109]: 1-6 & H.R. Bukhari",
    dalilMeaning: "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal...",
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya toleransi",
      "Membedakan batas toleransi sosial-kebangsaan dengan penjagaan kemurnian akidah ibadah.",
      "Merancang proyek kolaborasi kesiswaan lintas latar belakang untuk memperkuat kerukunan di sekolah."
    ],
    contextExamples: [
      "Bekerja sama dalam kerja bakti lingkungan dengan tetangga yang berbeda keyakinan",
      "Menghormati teman yang sedang beribadah tanpa mengganggu atau mengejek",
      "Menjaga batas akidah tanpa bersikap kasar atau mencaci keyakinan orang lain",
      "Menolak penyebaran ujaran kebencian berbau SARA di grup media sosial"
    ]
  },
  {
    themeId: 'tema-viii-1-akidah-kitab',
    element: "Akidah",
    temaName: "Iman kepada Kitab-Kitab Allah Swt.",
    cpClause: "Menganalisis makna iman kepada kitab-kitab Allah Swt.",
    description: "Meyakini empat kitab suci dan suhuf, memfungsikan Al-Qur'an sebagai pedoman (Huda) dan pembeda (Al-Furqan) dalam menyaring arus informasi.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Mengenal 4 Kitab Suci Allah (Taurat, Zabur, Injil, Al-Qur'an) beserta Nabi Penerima dan Suhuf",
      "Kedudukan Al-Qur'an sebagai Kitab Terakhir, Penyempurna, Penjaga (Muhaimin), dan Pembeda (Al-Furqan)",
      "Cara Beriman kepada Kitab Sebelum Al-Qur'an dan Kewajiban Membaca, Mentadabburi, serta Mengamalkan Al-Qur'an",
      "Menjadikan Nilai Al-Qur'an sebagai Filter Menghadapi Dampak Negatif Budaya Global Populer"
    ],
    dalilReference: "Q.S. Al-Baqarah [2]: 136 & Q.S. Al-Ma'idah [5]: 48",
    dalilMeaning: "Katakanlah: 'Kami beriman kepada Allah dan apa yang diturunkan kepada kami... dan kami tidak membeda-bedakan seorang pun di antara mereka...'",
    suggestedTpList: [
      "Menganalisis makna iman kepada kitab-kitab Allah Swt.",
      "Menganalisis fungsi Al-Qur'an sebagai Al-Furqan dalam memvalidasi kebenaran informasi dan tren budaya masa kini.",
      "Merancang program pembiasaan tilawah dan tadabbur Al-Qur'an mandiri bagi pelajar."
    ],
    contextExamples: [
      "Mengklarifikasi nilai-nilai tren viral dengan ajaran Al-Qur'an sebelum mengikutinya",
      "Rutin tadarus Al-Qur'an setiap pagi sebelum memulai pelajaran sekolah",
      "Menghormati kitab-kitab suci yang pernah Allah turunkan kepada para nabi terdahulu",
      "Mengamalkan akhlak Qur'ani dalam tutur kata santun kepada guru dan orang tua"
    ]
  },
  {
    themeId: 'tema-viii-1-akhlak-husnuzan',
    element: "Akhlak",
    temaName: "Menerapkan Makna Husnuzan (Prasangka Baik)",
    cpClause: "Menerapkan makna husnuzan (prasangka baik).",
    description: "Penerapan husnuzan kepada Allah, diri sendiri, dan sesama, menjauhi su'uzan, ghibah, dan tajassus, serta membiasakan tabayyun.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Pengertian dan Hakikat Husnuzan serta Bahaya Penyakit Hati Su'uzan (Buruk Sangka)",
      "Tiga Dimensi Husnuzan: kepada Allah Swt. (Ketetapan Takdir), Diri Sendiri (Optimis), dan Sesama (Berdamai)",
      "Bahaya Ghibah, Mencari Kesalahan Orang Lain (Tajassus), dan Fitnah di Lingkungan Sekolah serta Medsos",
      "Membiasakan Budaya Tabayyun (Verifikasi) dan Berpikir Positif dalam Menghadapi Kesalahpahaman"
    ],
    dalilReference: "Q.S. Al-Hujurat [49]: 12 & Hadis Qudsi H.R. Bukhari",
    dalilMeaning: "Wahai orang-orang yang beriman! Jauhilah banyak dari prasangka, sesungguhnya sebagian prasangka itu dosa dan janganlah kamu mencari-cari kesalahan orang lain...",
    suggestedTpList: [
      "Menerapkan makna husnuzan (prasangka baik)",
      "Menganalisis kasus tuduhan tanpa bukti di media sosial dan merumuskan respons etis berbasis husnuzan dan tabayyun.",
      "Merancang komitmen kelas bebas dari ghibah, fitnah, dan pergunjingan antarsiswa."
    ],
    contextExamples: [
      "Tidak langsung menuduh teman mencuri saat kehilangan barang sebelum memeriksa dengan teliti",
      "Tetap berprasangka baik pada ketetapan Allah saat menghadapi kegagalan lomba",
      "Melakukan klarifikasi langsung (tabayyun) saat mendengar desas-desus tentang sahabat",
      "Menolak ikut bergosip atau menyebarkan tangkapan layar obrolan pribadi di grup kelas"
    ]
  },
  {
    themeId: 'tema-viii-1-fikih-jenazah',
    element: "Fikih",
    temaName: "Perintah Agama terhadap Penyelenggaraan Jenazah",
    cpClause: "Menganalisis perintah agama terhadap penyelenggaraan jenazah.",
    description: "Kewajiban fardhu kifayah memandikan, mengafani, menyalatkan 4 takbir, menguburkan jenazah, serta adab takziyah dan ziarah kubur.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Hukum Fardhu Kifayah dan Empat Kewajiban Muslim terhadap Jenazah: Memandikan, Mengafani, Menyalatkan, Menguburkan",
      "Tata Cara Memandikan dan Mengafani Jenazah dengan Menjaga Kehormatan serta Kerahasiaan Aib Mayit",
      "Tata Cara, Rukun, Bacaan Niat, Doa, dan Rangkaian Salat Jenazah 4 Takbir",
      "Tata Cara Pemakaman yang Syar'i serta Adab Takziyah dan Ziarah Kubur yang Menghibur Keluarga Duka"
    ],
    dalilReference: "H.R. Muslim & H.R. Tirmidzi tentang Hak Jenazah Muslim",
    dalilMeaning: "Hak seorang muslim atas muslim lainnya ada lima... salah satunya adalah mengiringi dan mengurus jenazahnya.",
    suggestedTpList: [
      "Menganalisis perintah agama terhadap penyelenggaraan jenazah",
      "Mendemonstrasikan bacaan, rukun, dan tata cara salat jenazah 4 takbir secara tertib dan benar.",
      "Menyusun panduan adab takziyah syar'i yang menghibur keluarga yang berduka tanpa tradisi meratap."
    ],
    contextExamples: [
      "Mengikuti salat jenazah berjamaah di masjid lingkungan tempat tinggal",
      "Simulasi memandikan dan mengafani di laboratorium keagamaan sekolah",
      "Bertakziyah dengan mendoakan almarhum dan membawakan makanan bagi keluarga berduka",
      "Mengingat kematian sebagai pengingat agar senantiasa berbuat kebajikan"
    ]
  },
  {
    themeId: 'tema-viii-1-spi-fatimiyah',
    element: "Sejarah Peradaban Islam",
    temaName: "Peradaban Dinasti Fatimiyah",
    cpClause: "Menganalisis peradaban Dinasti Fatimiyah.",
    description: "Sejarah Dinasti Fatimiyah di Kairo Mesir, pendirian Universitas Al-Azhar, kemajuan perpustakaan Darul Hikmah, arsitektur, dan toleransi keilmuan.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Latar Belakang Berdirinya Dinasti Fatimiyah di Afrika Utara dan Pemindahan Ibu Kota ke Kairo (Mesir)",
      "Khalifah-Khalifah Terkemuka (Al-Mahdi, Al-Mu'izz Lidinillah, Al-Aziz) dan Kebijakannya",
      "Kemajuan Peradaban: Pendirian Universitas Al-Azhar, Perpustakaan Darul Hikmah, Sains, Arsitektur, dan Astronomi",
      "Ibrah Kemajuan Pendidikan Tinggi Islam, Pengaruh Al-Azhar bagi Dunia, dan Sikap Menghargai Keragaman"
    ],
    dalilReference: "Q.S. Al-Mujadilah [58]: 11 & Q.S. Ali 'Imran [3]: 137",
    dalilMeaning: "Sesungguhnya telah berlalu sebelum kamu sunnah-sunnah (Allah); karena itu berjalanlah kamu di (muka) bumi dan perhatikanlah bagaimana akibat orang-orang yang mendustakan.",
    suggestedTpList: [
      "Menganalisis peradaban Dinasti Fatimiyah",
      "Menganalisis peran strategis pendirian Universitas Al-Azhar Kairo dalam transmisi keilmuan Islam lintas zaman.",
      "Menyusun refleksi nilai keteladanan kecintaan pada ilmu pengetahuan dari peradaban Dinasti Fatimiyah."
    ],
    contextExamples: [
      "Menghargai warisan Universitas Al-Azhar sebagai mercusuar pendidikan moderasi Islam dunia",
      "Mengagumi arsitektur kota Kairo dan teknologi observatorium astronomi masa Fatimiyah",
      "Mengambil ibrah pentingnya perpustakaan umum dalam memfasilitasi riset masyarakat",
      "Mempelajari sejarah dengan sikap kritis dan objektif"
    ]
  },

  // =========================================================================
  // KELAS VIII - SEMESTER 2 (5 TEMA)
  // =========================================================================
  {
    themeId: 'tema-viii-2-quran-cinta-tanah-air',
    element: "Al-Qur'an Hadis",
    temaName: "Pentingnya Cinta Tanah Air dalam Islam",
    cpClause: "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya cinta tanah air.",
    description: "Kajian konsep Hubbul Wathan Minal Iman, dalil cinta tanah air (Q.S. Al-Qashas: 85), menjaga persatuan NKRI, dan menolak disintegrasi bangsa.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Kajian Q.S. Al-Qashas [28]: 85 tentang Kerinduan Rasulullah Saw. kepada Tanah Airnya",
      "Hadis tentang Doa dan Kecintaan Nabi Muhammad Saw. kepada Negeri Makkah dan Madinah",
      "Konsep Hubbul Wathan Minal Iman: Kewajiban Menjaga Kedamaian, Persatuan, dan Kemakmuran Bangsa",
      "Peran Aktif Generasi Muda Muslim dalam Mengisi Kemerdekaan, Bela Negara, dan Menangkal Radikalisme"
    ],
    dalilReference: "Q.S. Al-Qashas [28]: 85 & H.R. Tirmidzi",
    dalilMeaning: "Sesungguhnya Yang mewajibkan atasmu Al-Qur'an, benar-benar akan mengembalikan kamu ke tanah airmu...",
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya cinta tanah air",
      "Menganalisis dalil cinta tanah air dan peran aktif pelajar dalam menjaga keutuhan Negara Kesatuan Republik Indonesia.",
      "Merancang aksi nyata bela negara melalui prestasi akademik, disiplin, dan pengabdian masyarakat."
    ],
    contextExamples: [
      "Mengikuti upacara bendera hari Senin dengan khidmat sebagai bentuk syukur kemerdekaan",
      "Merawat fasilitas umum sekolah dan fasilitas publik lingkungan rumah",
      "Melestarikan kekayaan budaya nusantara yang selaras dengan nilai-nilai syariat",
      "Menangkal hoaks dan ujaran perpecahan politik yang mengancam persatuan bangsa"
    ]
  },
  {
    themeId: 'tema-viii-2-akidah-rasul',
    element: "Akidah",
    temaName: "Iman kepada Rasul-Rasul Allah Swt.",
    cpClause: "Menganalisis makna iman kepada rasul-rasul Allah Swt.",
    description: "Sifat wajib rasul (Shiddiq, Amanah, Tabligh, Fathanah), keteladanan lima rasul Ulul Azmi, dan implementasinya dalam kejujuran serta etos belajar.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Pengertian Nabi dan Rasul, Dalil Kewajiban Beriman, dan Perbedaan Keduanya",
      "Sifat Wajib Rasul (Shiddiq, Amanah, Tabligh, Fathanah), Sifat Mustahil, dan Sifat Jaiz",
      "Mengenal 25 Nabi dan Rasul serta Keteladanan 5 Rasul Ulul Azmi (Nuh, Ibrahim, Musa, Isa, Muhammad Saw.)",
      "Mengimplementasikan Keteladanan Kejujuran, Kesabaran, dan Kegigihan Rasul dalam Kehidupan Pelajar"
    ],
    dalilReference: "Q.S. An-Nisa' [4]: 136 & Q.S. Al-Ahqaf [46]: 35",
    dalilMeaning: "Maka bersabarlah engkau (Muhammad) sebagaimana kesabaran rasul-rasul yang memiliki keteguhan hati (Ulul Azmi)...",
    suggestedTpList: [
      "Menganalisis makna iman kepada rasul-rasul Allah Swt.",
      "Mengevaluasi implementasi sifat wajib rasul (terutama amanah dan fathanah) dalam kepengurusan kelas dan kegiatan belajar.",
      "Menyusun refleksi keteguhan hati rasul Ulul Azmi dalam menghadapi kegagalan dan tantangan hidup."
    ],
    contextExamples: [
      "Meneladani sifat Shiddiq dengan berkata jujur meski dalam keadaan terjepit",
      "Meneladani sifat Fathanah dengan bersungguh-sungguh mengasah kecerdasan intelektual",
      "Meneladani kesabaran Nabi Nuh saat menghadapi ejekan dan penolakan dalam berbuat baik",
      "Menjaga amanah tugas kelompok dengan menyelesaikannya tepat waktu"
    ]
  },
  {
    themeId: 'tema-viii-2-akhlak-cinta-rasul',
    element: "Akhlak",
    temaName: "Menerapkan Rasa Cinta kepada Rasulullah Muhammad Saw.",
    cpClause: "Menerapkan rasa cinta kepada Rasulullah Muhammad saw.",
    description: "Perwujudan cinta Nabi Muhammad Saw. melalui memperbanyak shalawat, sirah nabawiyah, meneladani akhlakul karimah, dan menghidupkan sunnah.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Hakikat Mencintai Rasulullah Saw. Melampaui Klaim Lisan dan Melebihi Cinta kepada Harta Benda",
      "Membiasakan Bershalawat, Mempelajari Sirah Nabawiyah, dan Menghidupkan Sunnah Harian",
      "Meneladani Akhlak Mulia Nabi Saw.: Menyantuni Anak Yatim, Lemah Lembut, Pemaaf, dan Teguh Membela Keadilan",
      "Menjaga Kemuliaan Ajaran Rasulullah Saw. dalam Interaksi Remaja di Era Modern"
    ],
    dalilReference: "Q.S. Al-Ahzab [33]: 21 & Q.S. Ali 'Imran [3]: 31 & H.R. Bukhari",
    dalilMeaning: "Sungguh, telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu (yaitu) bagi orang yang mengharap (rahmat) Allah dan (kedatangan) hari kiamat dan dia banyak mengingat Allah.",
    suggestedTpList: [
      "Menerapkan rasa cinta kepada Rasulullah Muhammad saw.",
      "Menganalisis wujud nyata cinta kepada Rasulullah Saw. melalui sikap santun, adab makan/minum, dan pembelaan kaum lemah.",
      "Merancang panduan keteladanan akhlak Nabi Muhammad Saw. dalam bergaul dengan sesama teman di sekolah."
    ],
    contextExamples: [
      "Membiasakan memperbanyak membaca shalawat atas Nabi Muhammad Saw.",
      "Mempraktikkan adab makan dan minum sesuai sunnah (duduk, tangan kanan, basmalah)",
      "Meniru sikap Nabi yang tidak mendendam dan memaafkan orang yang bersalah",
      "Menyayangi dan membantu adik kelas serta anak-anak yatim piatu"
    ]
  },
  {
    themeId: 'tema-viii-2-fikih-haji-umrah',
    element: "Fikih",
    temaName: "Ketentuan Haji dan Umrah",
    cpClause: "Menganalisis ketentuan haji dan umrah.",
    description: "Syarat istitha'ah, rukun, wajib, larangan, dam, dan rangkaian manasik haji serta umrah beserta nilai filosofis kesetaraan umat.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Pengertian, Hukum, Dalil Kewajiban, dan Syarat Istitha'ah (Kemampuan Finansial, Fisik, Keamanan) Haji dan Umrah",
      "Rukun Haji (Ihram, Wukuf di Arafah, Tawaf Ifadhah, Sa'i, Tahallul, Tertib) dan Rukun Umrah",
      "Wajib Haji (Miqat Zamani & Makani, Mabit di Muzdalifah & Mina, Lempar Jumrah, Tawaf Wada') dan Dam",
      "Nilai Spiritual dan Sosial: Persaudaraan Universal Umat Islam dan Kesetaraan Manusia di Hadapan Allah Swt."
    ],
    dalilReference: "Q.S. Ali 'Imran [3]: 97 & Q.S. Al-Baqarah [2]: 196",
    dalilMeaning: "Mengerjakan haji adalah kewajiban manusia terhadap Allah, yaitu bagi orang yang sanggup mengadakan perjalanan ke sana... Dan sempurnakanlah ibadah haji dan umrah karena Allah.",
    suggestedTpList: [
      "Menganalisis ketentuan haji dan umrah",
      "Menganalisis tahapan manasik haji Tamattu', Ifrad, dan Qiran secara runtut serta pemenuhan rukun dan wajibnya.",
      "Merancang simulasi manasik haji terpadu di sekolah yang mengedepankan penghayatan nilai kesetaraan sosial."
    ],
    contextExamples: [
      "Menghayati filosofi pakaian ihram putih polos tanpa jahitan lambang kesetaraan manusia",
      "Menabung sejak dini dari uang saku untuk niat menunaikan ibadah ke Baitullah",
      "Mengikuti praktik peragaan manasik haji di lapangan sekolah",
      "Memahami nilai persatuan jutaan manusia dari berbagai benua di Padang Arafah"
    ]
  },
  {
    themeId: 'tema-viii-2-spi-turki-usmani',
    element: "Sejarah Peradaban Islam",
    temaName: "Peradaban Dinasti Turki Usmani",
    cpClause: "Menganalisis peradaban Dinasti Turki Usmani.",
    description: "Kejayaan Turki Usmani, penaklukan Konstantinopel oleh Sultan Muhammad Al-Fatih, hukum Kanun Sulaiman, militer Janissary, dan Millet System.",
    recommendedGrades: ['VIII'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Latar Belakang Berdirinya Dinasti Turki Usmani oleh Usman I dan Ekspansi Wilayah ke Tiga Benua",
      "Peristiwa Bersejarah Penaklukan Konstantinopel oleh Sultan Muhammad Al-Fatih (1453 M)",
      "Kemajuan Peradaban: Sistem Hukum Kanun Sultan Sulaiman Al-Qanuni, Militer Janissary, Arsitektur Masjid Biru, dan Sains",
      "Ibrah Kepemimpinan Visioner, Disiplin Belajar, dan Perlindungan Hak Warga Lintas Agama (Millet System)"
    ],
    dalilReference: "H.R. Ahmad (Bisyarah Konstantinopel) & Q.S. Al-Fath [48]: 29",
    dalilMeaning: "Konstantinopel benar-benar akan ditaklukkan. Sebaik-baik pemimpin adalah pemimpinnya dan sebaik-baik pasukan adalah pasukan itu.",
    suggestedTpList: [
      "Menganalisis peradaban Dinasti Turki Usmani",
      "Mengevaluasi strategi inovatif Sultan Muhammad Al-Fatih dalam memadukan keunggulan sains teknologi dan ketakwaan spiritual.",
      "Menyusun refleksi kepemimpinan muda berwawasan global yang memadukan keahlian strategis dan ketaatan ibadah."
    ],
    contextExamples: [
      "Meneladani kedisiplinan belajar Muhammad Al-Fatih yang menguasai banyak bahasa asing sejak belia",
      "Menjunjung tinggi etika toleransi perlindungan tempat ibadah agama lain sebagaimana dilakukan Sultan Al-Fatih",
      "Mempersiapkan diri dengan ilmu pengetahuan dan teknologi demi cita-cita besar",
      "Menghargai keindahan karya seni arsitektur Masjid Biru dan Hagia Sophia"
    ]
  },

  // =========================================================================
  // KELAS IX - SEMESTER 1 (5 TEMA)
  // =========================================================================
  {
    themeId: 'tema-ix-1-quran-keilmuan',
    element: "Al-Qur'an Hadis",
    temaName: "Pentingnya Semangat Keilmuan",
    cpClause: "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya semangat keilmuan.",
    description: "Kajian Q.S. Al-Mujadilah: 11, etos menuntut ilmu, budaya riset mandiri, kejujuran akademik di era AI, dan pemuliaan derajat orang berilmu.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Kajian Q.S. Al-Mujadilah [58]: 11 dan Q.S. Az-Zumar [39]: 9 tentang Pengangkatan Derajat Orang Berilmu",
      "Hadis Riwayat Ibnu Majah tentang Kewajiban Menuntut Ilmu bagi Setiap Muslim (Thalabul 'Ilmi Faridhatun)",
      "Menjunjung Tinggi Integritas Kejujuran Akademik, Menolak Plagiarisme, dan Menghindari Joki Tugas di Era AI",
      "Peran Ilmu Pengetahuan dan Literasi Riset Remaja dalam Memberikan Kemanfaatan bagi Umat Manusia"
    ],
    dalilReference: "Q.S. Al-Mujadilah [58]: 11 & H.R. Ibnu Majah",
    dalilMeaning: "Allah akan mengangkat (derajat) orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu beberapa derajat. Dan Allah Mahateliti apa yang kamu kerjakan.",
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya semangat keilmuan",
      "Menganalisis kandungan Q.S. Al-Mujadilah: 11 dan menghubungkannya dengan etos riset mandiri di era digital.",
      "Merancang program aksi literasi keagamaan dan sains di sekolah berbasis inspirasi Al-Qur'an."
    ],
    contextExamples: [
      "Pemanfaatan kecerdasan buatan (AI) secara kritis dan beretika tanpa melakukan plagiarisme",
      "Bersungguh-sungguh membaca jurnal ilmiah dan buku di perpustakaan sekolah",
      "Menghormati hak kekayaan intelektual karya orang lain dengan menyertakan sitasi rujukan",
      "Mendedikasikan ilmu yang dipelajari untuk kemaslahatan masyarakat banyak"
    ]
  },
  {
    themeId: 'tema-ix-1-akidah-hari-akhir',
    element: "Akidah",
    temaName: "Iman kepada Hari Akhir",
    cpClause: "Menganalisis makna iman kepada hari akhir.",
    description: "Kiamat sugra dan kubra, tahapan yaumul hisab dan mizan, korelasi iman hari akhir dengan akuntabilitas moral, dan muhasabah perbuatan.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Pengertian Kiamat Sugra dan Kubra serta Tanda-Tandanya Berdasarkan Dalil Naqli Al-Qur'an dan Hadis",
      "Tahapan Peristiwa Hari Kiamat: Alam Barzakh, Yaumul Ba'ats, Mahsyar, Hisab, Mizan, Sirath, hingga Surga dan Neraka",
      "Korelasi Iman kepada Hari Akhir dengan Rasa Tanggung Jawab Moral dan Akuntabilitas Diri",
      "Senantiasa Melakukan Muhasabah (Introspeksi Diri) atas Perbuatan Nyata dan Jejak Digital"
    ],
    dalilReference: "Q.S. Al-Zalzalah [99]: 7-8 & Q.S. Al-Qari'ah [101]: 6-9",
    dalilMeaning: "Barangsiapa mengerjakan kebaikan seberat zarrah, dia akan melihat balasannya. Dan barangsiapa mengerjakan kejahatan seberat zarrah, dia akan melihat balasannya pula.",
    suggestedTpList: [
      "Menganalisis makna iman kepada hari akhir",
      "Menganalisis hubungan antara keyakinan terhadap Hari Hisab dan Mizan dengan kebiasaan menjaga integritas moral.",
      "Merancang konsep muhasabah harian yang mentransformasi kebiasaan buruk menjadi kebajikan produktif."
    ],
    contextExamples: [
      "Sadar bahwa setiap ketikan dan unggahan di internet akan dihisab di akhirat",
      "Menolak kecurangan akademik dan manipulasi data tugas sekolah",
      "Mengorientasikan cita-cita hidup untuk kebahagiaan duniawi dan keselamatan akhirat",
      "Mempersiapkan bekal amal shalih sebanyak mungkin selagi masih diberi kesempatan hidup"
    ]
  },
  {
    themeId: 'tema-ix-1-akhlak-kasih-sayang-sesama',
    element: "Akhlak",
    temaName: "Menerapkan Makna Kasih Sayang kepada Sesama",
    cpClause: "Menerapkan makna kasih sayang kepada sesama.",
    description: "Sifat rahmah, ukhuwah Islamiyah/Wathaniyah/Insaniyah, ta'awun, gerakan anti-bullying di sekolah, dan empati sosial bagi kaum duafa.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Hakikat Sifat Kasih Sayang (Rahmah) sebagai Refleksi Asmaul Husna Ar-Rahman dan Ar-Rahim",
      "Prinsip Persaudaraan: Ukhuwah Islamiyah, Ukhuwah Wathaniyah, dan Ukhuwah Insaniyah dalam Pergaulan",
      "Mencegah Segala Bentuk Perundungan (Bullying Fisik, Verbal, dan Cyberbullying) di Lingkungan Madrasah",
      "Membiasakan Sikap Tolong-Menolong (Ta'awun), Berempati, Memaafkan, dan Menyantuni Kaum Lemah"
    ],
    dalilReference: "H.R. Bukhari-Muslim tentang Persaudaraan & Q.S. Al-Ma'idah [5]: 2",
    dalilMeaning: "Tidak beriman salah seorang di antara kamu hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri... Dan tolong-menolonglah kamu dalam kebajikan dan takwa...",
    suggestedTpList: [
      "Menerapkan makna kasih sayang kepada sesama",
      "Menganalisis akar penyebab perundungan di kalangan remaja dan merumuskan respons akhlak Islami untuk mengatasinya.",
      "Merancang deklarasi 'Madrasah Ramah Anak Bebas Bullying' berbasis nilai kasih sayang dan ukhuwah."
    ],
    contextExamples: [
      "Menemani dan membela teman yang menjadi korban pengucilan di kelas",
      "Menggalang donasi sukarela untuk teman sekelas yang tertimpa musibah",
      "Menyelesaikan perselisihan teman dengan musyawarah yang damai dan saling memaafkan",
      "Menghindari panggilan ejekan bernada merendahkan fisik atau nama orang tua"
    ]
  },
  {
    themeId: 'tema-ix-1-fikih-sembelihan-kurban',
    element: "Fikih",
    temaName: "Ketentuan Penyembelihan Hewan, Kurban, dan Akikah",
    cpClause: "Menganalisis ketentuan penyembelihan hewan, kurban, dan akikah.",
    description: "Prinsip ihsan penyembelihan halal, syarat hewan dan waktu ibadah kurban (udh-hiyah), ketentuan akikah hari ke-7, dan nilai kepedulian sosial.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Ketentuan Syar'i Penyembelihan Hewan: Syarat Penyembelih, Hewan Halal, Alat Tajam, dan Prinsip Ihsan",
      "Ibadah Kurban (Udh-hiyah): Hukum, Syarat Hewan Bebas Cacat, Waktu Pelaksanaan Hari Raya Idul Adha & Tasyrik",
      "Ibadah Akikah: Hukum, Waktu Utama (Hari ke-7), Ketentuan Hewan Anak Laki-Laki dan Perempuan, serta Hikmahnya",
      "Perbandingan Pokok Tujuan, Kondisi Daging Dibagikan, dan Nilai Sosial-Spiritual Kurban vs Akikah"
    ],
    dalilReference: "H.R. Muslim (Prinsip Ihsan) & Q.S. Al-Kautsar [108]: 2 & H.R. Tirmidzi",
    dalilMeaning: "Sesungguhnya Allah mewajibkan berbuat ihsan atas segala sesuatu. Jika kamu menyembelih, sembelihlah dengan cara yang baik dan pertajamlah pisaumu serta buatlah tenang sembelihanmu.",
    suggestedTpList: [
      "Menganalisis ketentuan penyembelihan hewan, kurban, dan akikah",
      "Menganalisis prosedur penyembelihan hewan halal yang memenuhi kriteria syariat dan prinsip ihsan perlindungan hewan.",
      "Merancang kepanitiaan penyembelihan hewan kurban di sekolah yang higienis dan ramah lingkungan (eco-qurban)."
    ],
    contextExamples: [
      "Memastikan pisau yang digunakan untuk menyembelih benar-benar tajam agar hewan tidak tersiksa",
      "Memilih hewan kurban yang sehat, cukup umur, dan tidak cacat fisik",
      "Mendistribusikan daging kurban kepada warga fakir miskin di sekitar sekolah",
      "Menggunakan wadah besek bambu alami ramah lingkungan pengganti kantong plastik sekali pakai"
    ]
  },
  {
    themeId: 'tema-ix-1-spi-safawi',
    element: "Sejarah Peradaban Islam",
    temaName: "Peradaban Dinasti Safawi",
    cpClause: "Memahami peradaban Dinasti Safawi.",
    description: "Sejarah Dinasti Safawi di Persia, kepemimpinan Syah Abbas I, kemegahan seni arsitektur kota Isfahan, industri karpet, dan ibrah sejarah kemundurannya.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['1'],
    submateriScope: [
      "Asal-Usul Dinasti Safawi dari Gerakan Tarekat Safawiyah di Ardabil hingga Berdirinya Kerajaan oleh Syah Ismail I",
      "Masa Keemasan di Bawah Kepemimpinan Syah Abbas I dan Pemindahan Ibu Kota ke Kota Indah Isfahan",
      "Kemajuan Peradaban: Arsitektur Spektakuler Masjid Syah, Lapangan Naqsh-e Jahan, Seni Karpet Persia, dan Perdagangan Internasional",
      "Ibrah Interaksi Antar-Peradaban, Perkembangan Estetika Arsitektur Islam, dan Faktor Kemunduran Dinasti"
    ],
    dalilReference: "Q.S. Al-Hajj [22]: 46 & Q.S. Al-Hasyr [59]: 2",
    dalilMeaning: "Maka tidakkah mereka berjalan di bumi lalu mempunyai akal yang dengan itu mereka dapat memahami... Maka ambillah pelajaran, wahai orang-orang yang mempunyai pandangan!",
    suggestedTpList: [
      "Memahami peradaban Dinasti Safawi",
      "Menganalisis peran kepemimpinan Syah Abbas I dalam membawa Dinasti Safawi mencapai puncak kemajuan arsitektur dan seni.",
      "Menyusun analisis kritis faktor pendukung kejayaan dan penyebab kemunduran Dinasti Safawi sebagai pelajaran sejarah."
    ],
    contextExamples: [
      "Mengapresiasi keindahan karya arsitektur dan tata kota Isfahan yang harmonis",
      "Meneladani semangat memajukan perdagangan dan kerajinan industri kreatif lokal",
      "Mengambil ibrah bahaya konflik internal dan perpecahan terhadap kelangsungan peradaban",
      "Memperluas wawasan sejarah bahwa peradaban Islam memiliki keragaman budaya yang kaya"
    ]
  },

  // =========================================================================
  // KELAS IX - SEMESTER 2 (5 TEMA)
  // =========================================================================
  {
    themeId: 'tema-ix-2-quran-sabar-musibah',
    element: "Al-Qur'an Hadis",
    temaName: "Pentingnya Sabar dalam Menghadapi Musibah dan Ujian",
    cpClause: "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya sabar dalam menghadapi musibah dan ujian.",
    description: "Kajian Q.S. Al-Baqarah: 155-157, ketahanan mental (resiliensi spiritual), mengendalikan emosi, menghadapi tekanan hidup, dan kalimat istirja'.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Kajian Q.S. Al-Baqarah [2]: 155-157 tentang Hakikat Ujian Kehidupan dan Kalimat Istirja' (Inna Lillahi wa Inna Ilaihi Raji'un)",
      "Kajian Q.S. Al-Baqarah [2]: 45-46 tentang Menjadikan Sabar dan Salat sebagai Penolong dalam Menghadapi Kesulitan",
      "Hadis Riwayat Muslim tentang Keutamaan Mengagumkan Orang Beriman: Sabar saat Diuji dan Syukur saat Diberi Nikmat",
      "Membentuk Ketahanan Mental (Resiliensi Spiritual), Manajemen Emosi, dan Menghadapi Tekanan Ujian Menjelang Kelulusan"
    ],
    dalilReference: "Q.S. Al-Baqarah [2]: 155-157 & H.R. Muslim",
    dalilMeaning: "Dan sungguh akan Kami berikan cobaan kepadamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa dan buah-buahan. Dan berikanlah berita gembira kepada orang-orang yang sabar.",
    suggestedTpList: [
      "Menganalisis ayat Al-Qur'an dan hadis terkait pentingnya sabar dalam menghadapi musibah dan ujian",
      "Menganalisis pesan moral Q.S. Al-Baqarah: 155-157 dalam membentuk ketahanan mental saat menghadapi kegagalan atau musibah.",
      "Merancang konsep manajemen emosi dan spiritual remaja dalam menyikapi tekanan hidup dan ujian sekolah."
    ],
    contextExamples: [
      "Menghadapi kegagalan dalam seleksi masuk sekolah lanjutan dengan ikhlas dan terus berikhtiar",
      "Menyikapi musibah bencana alam dengan empati, doa, dan gotong royong memberikan bantuan",
      "Mengatasi kecemasan akademik melalui salat malam, doa, dan belajar tekun",
      "Mendampingi dan menghibur sahabat yang sedang berduka karena kehilangan anggota keluarga"
    ]
  },
  {
    themeId: 'tema-ix-2-akidah-qada-qadar',
    element: "Akidah",
    temaName: "Iman kepada Qada dan Qadar",
    cpClause: "Menganalisis makna iman kepada qada dan qadar.",
    description: "Meyakini takdir mubram dan mu'allaq, sinergi ikhtiar maksimal, doa tulus, dan tawakal total, serta menolak fatalisme.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Pengertian Qada dan Qadar, Dalil Kewajiban Beriman, dan Perbedaan Takdir Mubram serta Takdir Mu'allaq",
      "Hubungan Harmonis antara Ikhtiar Maksimal Manusia, Doa yang Tulus, dan Tawakal Pasrah kepada Allah Swt.",
      "Menghindari Sikap Fatalisme (Kepasrahan Buta tanpa Usaha) dan Kesombongan Intelektual atas Keberhasilan Diri",
      "Membangun Sikap Mental Tangguh, Pantang Menyerah, dan Optimis dalam Meraih Masa Depan serta Kelulusan"
    ],
    dalilReference: "Q.S. Ar-Ra'd [13]: 11 & Q.S. At-Talaq [65]: 3 & H.R. Muslim",
    dalilMeaning: "Sesungguhnya Allah tidak mengubah keadaan suatu kaum sehingga mereka mengubah keadaan yang ada pada diri mereka sendiri... Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya.",
    suggestedTpList: [
      "Menganalisis makna iman kepada qada dan qadar",
      "Menganalisis hubungan komplementer antara ikhtiar manusiawi, doa, dan kepasrahan tawakal kepada takdir ilahi.",
      "Merancang peta rencana cita-cita masa depan dengan memadukan kerja keras, doa, dan tawakal."
    ],
    contextExamples: [
      "Belajar sungguh-sungguh menghadapi asesmen akhir jenjang lalu bertawakal menyerahkan hasil kepada Allah",
      "Tidak putus asa saat rencana belum terwujud dan mengambil hikmah positif di balik kegagalan",
      "Tetap rendah hati dan tidak menyombongkan diri saat meraih nilai tertinggi",
      "Menolak percaya pada ramalan nasib atau zodiak yang bertentangan dengan keimanan qada dan qadar"
    ]
  },
  {
    themeId: 'tema-ix-2-akhlak-lingkungan-alam',
    element: "Akhlak",
    temaName: "Menerapkan Makna Kasih Sayang kepada Lingkungan Alam",
    cpClause: "Menerapkan makna kasih sayang kepada lingkungan alam.",
    description: "Mandat khalifah fil ardh, konservasi air wudhu, menanam pohon, pengurangan sampah plastik, dan pencegahan krisis ekologis.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Mandat Manusia sebagai Khalifah fil Ardh (Pemakmur Bumi) dan Larangan Merusak Ekosistem Alam Semesta",
      "Tuntunan Islam dalam Menjaga Alam: Penghijauan (Menanam Pohon), Hemat Air Wudhu, dan Menyayangi Flora serta Fauna",
      "Aksi Nyata Menghadapi Krisis Iklim: Diet Sampah Plastik, Pengelolaan Sampah Sekolah (Adiwiyata), dan Hemat Energi",
      "Tanggung Jawab Etis dan Moral Generasi Muda Muslim dalam Mewariskan Bumi yang Lestari bagi Generasi Mendatang"
    ],
    dalilReference: "Q.S. Ar-Rum [30]: 41 & Q.S. Al-A'raf [7]: 56 & H.R. Bukhari-Muslim",
    dalilMeaning: "Telah tampak kerusakan di darat dan di laut disebabkan karena perbuatan tangan manusia, agar Allah merasakan kepada mereka sebagian dari (akibat) perbuatan mereka, agar mereka kembali...",
    suggestedTpList: [
      "Menerapkan makna kasih sayang kepada lingkungan alam",
      "Mengevaluasi dampak pemborosan sumber daya dan pencemaran sampah plastik terhadap krisis ekologi dari perspektif Islam.",
      "Merancang gerakan 'Green Madrasah / Eco-School' berbasis akhlak pelestarian lingkungan hidup."
    ],
    contextExamples: [
      "Membawa tempat makan dan tumbler minum sendiri untuk meminimalisasi timbulan sampah plastik",
      "Menghemat penggunaan air saat berwudhu di tempat wudhu sekolah",
      "Aktif merawat tanaman dan ikut kegiatan menanam pohon di lingkungan sekitar",
      "Mematikan lampu dan kipas angin kelas saat ruangan tidak digunakan"
    ]
  },
  {
    themeId: 'tema-ix-2-fikih-rukhsah-mazhab',
    element: "Fikih",
    temaName: "Ketentuan Rukhsah dalam Perspektif Mazhab Fikih",
    cpClause: "Menganalisis ketentuan rukhsah (kemudahan) dalam perspektif mazhab fikih.",
    description: "Prinsip kemudahan syariat (Al-Masyaqqatu Tajlibut Taisir), salat jamak-qashar, salat orang sakit, serta toleransi keragaman mazhab fikih.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Konsep dan Hakikat Rukhsah: Wujud Kasih Sayang Syariat Islam berlandaskan Kaidah 'Al-Masyaqqatu Tajlibut Taisir'",
      "Ketentuan Salat Jamak Taqdim dan Jamak Ta'khir serta Salat Qashar bagi Musafir menurut Perspektif Mazhab Fikih",
      "Rukhsah bagi Orang Sakit (Tata Cara Salat Duduk/Berbaring) dan Keringanan Puasa Ramadhan bagi Kondisi Khusus",
      "Menumbuhkan Sikap Bijaksana, Lapang Dada, dan Menghargai Perbedaan Pandangan antar Mazhab Fikih"
    ],
    dalilReference: "Q.S. Al-Baqarah [2]: 185 & Q.S. An-Nisa' [4]: 101",
    dalilMeaning: "Allah menghendaki kemudahan bagimu, dan tidak menghendaki kesukaran bagimu... Dan apabila kamu bepergian di bumi, maka tidaklah mengapa kamu men-qashar salat...",
    suggestedTpList: [
      "Menganalisis ketentuan rukhsah (kemudahan) dalam perspektif mazhab fikih",
      "Menganalisis skenario perjalanan jauh atau kondisi darurat dan menentukan kombinasi rukhsah salat yang sah.",
      "Merancang bagan alur penentuan rukhsah ibadah salat bagi musafir dan orang sakit sesuai ketentuan mazhab."
    ],
    contextExamples: [
      "Melaksanakan salat jamak qashar saat kegiatan perkemahan pramuka di luar kota",
      "Menjalankan salat dengan posisi duduk saat sedang sakit kaki atau dirawat di rumah sakit",
      "Menghormati teman yang mengambil rukhsah salat jamak saat perjalanan darat lintas provinsi",
      "Tidak memaksakan diri beribadah melebihi kemampuan saat kondisi darurat"
    ]
  },
  {
    themeId: 'tema-ix-2-spi-mughal',
    element: "Sejarah Peradaban Islam",
    temaName: "Peradaban Dinasti Mughal",
    cpClause: "Menganalisis peradaban Dinasti Mughal.",
    description: "Sejarah Dinasti Mughal di India, kepemimpinan Sultan Akbar dan Syah Jahan, mahakarya arsitektur Taj Mahal dan Red Fort, serta kerukunan multikultural.",
    recommendedGrades: ['IX'],
    recommendedSemesters: ['2'],
    submateriScope: [
      "Sejarah Berdirinya Dinasti Mughal di India oleh Zahiruddin Babur dan Perkembangannya",
      "Masa Kejayaan di Bawah Kepemimpinan Sultan Akbar, Jahangir, dan Syah Jahan",
      "Kemajuan Peradaban dan Mahakarya Arsitektur Dunia: Taj Mahal, Benteng Merah (Red Fort), dan Masjid Jama Delhi",
      "Ibrah Pengelolaan Keragaman Multikultural, Kemajuan Ekonomi Agraris, dan Pelajaran dari Runtuhnya Kerajaan"
    ],
    dalilReference: "Q.S. Yusuf [12]: 111 & Q.S. Al-Hujurat [49]: 13",
    dalilMeaning: "Sungguh, pada kisah-kisah mereka itu terdapat pelajaran bagi orang-orang yang mempunyai akal sehat...",
    suggestedTpList: [
      "Menganalisis peradaban Dinasti Mughal",
      "Menganalisis mahakarya seni arsitektur Taj Mahal dan peradaban Dinasti Mughal dalam sejarah peradaban Islam dunia.",
      "Menyusun pelajaran sejarah tentang pengelolaan kerukunan multikultural pada masa Dinasti Mughal di India."
    ],
    contextExamples: [
      "Mengagumi keajaiban dunia Taj Mahal sebagai simbol keagungan arsitektur Islam di India",
      "Mengambil ibrah pentingnya kepemimpinan yang adil dan mengayomi masyarakat majemuk",
      "Menyadari pentingnya menjaga persatuan agar kekuasaan dan kejayaan peradaban tidak runtuh",
      "Mengembangkan apresiasi terhadap warisan sejarah dan seni budaya global"
    ]
  }
];

// Helper functions for filtering and lookup
export function getThemesByElement(element: PaibpElement): CpThemeClassification[] {
  return CP_THEMES_CLASSIFICATION.filter(
    t => t.element === element || (element.includes("Qur'an") && t.element.includes("Qur'an"))
  );
}

export function getThemeById(themeId: string): CpThemeClassification | undefined {
  return CP_THEMES_CLASSIFICATION.find(t => t.themeId === themeId);
}

export function getThemesByGrade(grade: string): CpThemeClassification[] {
  return CP_THEMES_CLASSIFICATION.filter(t => t.recommendedGrades.includes(grade as any));
}

export function searchThemes(keyword: string): CpThemeClassification[] {
  const kw = keyword.toLowerCase().trim();
  if (!kw) return CP_THEMES_CLASSIFICATION;
  return CP_THEMES_CLASSIFICATION.filter(t => 
    t.temaName.toLowerCase().includes(kw) ||
    t.description.toLowerCase().includes(kw) ||
    t.cpClause.toLowerCase().includes(kw) ||
    t.submateriScope.some(s => s.toLowerCase().includes(kw)) ||
    t.element.toLowerCase().includes(kw) ||
    t.suggestedTpList.some(tp => tp.toLowerCase().includes(kw))
  );
}
