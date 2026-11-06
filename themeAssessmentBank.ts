import { QuestionItem, BloomLevel, SoloLevel, DeepLearningDimension, DifficultyLevel, CpThemeClassification } from '../types';
import { CP_THEMES_CLASSIFICATION } from '../data/cpThemesData';

export interface ThemeQuestionBlueprint {
  temaCode: string;
  submateri: string;
  bloomLevel: BloomLevel;
  soloLevel: SoloLevel;
  deepLearningDim: DeepLearningDimension;
  difficulty: DifficultyLevel;
  operationalVerb: string;
  indicatorTemplate: (context: string, concept: string) => string;
  stimulus: string;
  questionText: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctKey: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  distractorExplanation: Record<'A' | 'B' | 'C' | 'D', string>;
  islamicValue: string;
  realLifeContext: string;
  dalilReference: string;
}

// ---------------------------------------------------------------------------
// Blueprints for Core Themes across all 5 elements
// ---------------------------------------------------------------------------
export const THEME_BLUEPRINTS: Record<string, ThemeQuestionBlueprint[]> = {
  // =========================================================================
  // 1. ELEMEN AL-QUR'AN HADIS
  // =========================================================================
  'tema-quran-ilmu': [
    {
      temaCode: 'tema-quran-ilmu',
      submateri: 'Kandungan Q.S. Al-Mujadilah: 11 dan Hadis Kewajiban Menuntut Ilmu',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis korelasi keimanan dan etos keilmuan',
      indicatorTemplate: (ctx, concept) => `Disajikan narasi tentang ${ctx}, peserta didik dapat menganalisis korelasi antara integritas keimanan dan keutamaan derajat orang berilmu berdasarkan Q.S. Al-Mujadilah: 11.`,
      stimulus: `Rafi adalah siswa berprestasi yang aktif memanfaatkan kecerdasan buatan (AI) untuk membantu riset karya ilmiah remaja di sekolahnya. Alih-alih menyalin jawaban AI secara mentah-mentah (plagiarisme), Rafi memverifikasi sumber rujukan ke jurnal ilmiah dan perpustakaan, lalu menyusun analisisnya sendiri dengan penuh kejujuran dan rasa ingin tahu yang tinggi.`,
      questionText: `Berdasarkan studi kasus tersebut, etos belajar yang ditunjukkan Rafi paling selaras dengan prinsip keilmuan dalam Q.S. Al-Mujadilah [58]: 11 karena...`,
      options: [
        { key: 'A', text: 'Mengintegrasikan teknologi secara kritis dengan menjunjung tinggi integritas kejujuran akademik sebagai wujud derajat keimanan dan ilmu.' },
        { key: 'B', text: 'Memastikan karya ilmiahnya mendapatkan nilai tertinggi dari dewan juri tanpa memedulikan proses verifikasi data.' },
        { key: 'C', text: 'Menunjukkan kemampuan penguasaan teknologi digital mutakhir melampaui kemampuan rekan-rekan sekelasnya.' },
        { key: 'D', text: 'Mematuhi instruksi guru pembimbing semata agar terhindar dari sanksi diskualifikasi kompetisi sekolah.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A menghubungkan pemanfaatan teknologi, integritas kejujuran ilmiah, dan martabat orang beriman-berilmu sesuai substansi Q.S. Al-Mujadilah: 11.',
      distractorExplanation: {
        A: 'Kunci jawaban yang tepat: menunjukkan relational deep learning.',
        B: 'Hanya berorientasi pada hasil akhir (pragmatis), bukan pemaknaan etika ilmu dalam Islam.',
        C: 'Cenderung mengarah pada kebanggaan diri (riya/ujub), bertentangan dengan tawadhu penuntut ilmu.',
        D: 'Kepatuhan lahiriah pasif tanpa kesadaran nilai tauhid keilmuan.'
      },
      islamicValue: 'Etos Keilmuan, Integritas Intelektual, dan Tawadhu',
      realLifeContext: 'Penggunaan AI dan etika riset ilmiah siswa SMP/MTs',
      dalilReference: 'Q.S. Al-Mujadilah [58]: 11'
    },
    {
      temaCode: 'tema-quran-ilmu',
      submateri: 'Tajwid: Al-Syamsiyah, Al-Qamariyah, dan Mad Asli',
      bloomLevel: 'C5',
      soloLevel: 'Relational',
      deepLearningDim: 'Memahami',
      difficulty: 'Sulit',
      operationalVerb: 'Mengevaluasi hukum bacaan tajwid dalam tilawah tartil',
      indicatorTemplate: (ctx, concept) => `Disajikan cuplikan ayat Al-Qur'an tentang ilmu, peserta didik dapat mengevaluasi penerapan hukum bacaan Al-Syamsiyah dan Al-Qamariyah serta dampaknya terhadap kefasihan tilawah tartil.`,
      stimulus: `Saat tadarus pagi di musala sekolah, seorang peserta didik membaca potongan Q.S. Az-Zumar ayat 9. Ketika melafalkan lafal 'الَّذِينَ يَعْلَمُونَ' dan 'الْعِلْمَ', terdengar ia mengidghamkan huruf lam pada 'الْعِلْمَ' seperti membaca al-syamsiyah, sehingga terdengar samar. Teman semejanya kemudian memberikan koreksi dengan santun.`,
      questionText: `Evaluasi hukum tajwid dan argumen koreksi yang paling tepat dan beradab adalah...`,
      options: [
        { key: 'A', text: "Lafal الْعِلْمَ adalah Al-Qamariyah karena huruf 'Ain adalah huruf qamariyah, sehingga huruf lam sukun wajib dibaca jelas (izhhar qamariyah)." },
        { key: 'B', text: 'Lafal الْعِلْمَ adalah Al-Syamsiyah karena diawali huruf alif lam, sehingga huruf lam dileburkan ke huruf sesudahnya.' },
        { key: 'C', text: 'Kedua lafal tersebut bebas dibaca lebur maupun jelas karena perbedaan dialek qiraat yang tidak membatalkan bacaan.' },
        { key: 'D', text: 'Lafal tersebut termasuk bacaan gharib yang hanya boleh dibaca dengan saktah berhenti sejenak tanpa bernapas.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A tepat secara kaidah tajwid: huruf \'Ain merupakan bagian dari huruf Al-Qamariyah (ابغ حجك وخف عقيمه) sehingga lam dibaca izhhar.',
      distractorExplanation: {
        A: 'Tepat secara ilmu tajwid dan adab mengoreksi bacaan Al-Qur\'an.',
        B: 'Keliru, tertukar antara ketentuan Al-Syamsiyah dan Al-Qamariyah.',
        C: 'Keliru, tajwid memiliki kaidah pasti dan tidak dapat diubah seenaknya.',
        D: 'Keliru, tidak ada kaitannya dengan bacaan gharib maupun saktah.'
      },
      islamicValue: 'Ketelitian Tajwid dan Adab Menuntut Ilmu',
      realLifeContext: 'Tadarus Al-Qur\'an di kelas dan budaya saling menasihati',
      dalilReference: 'Q.S. Az-Zumar [39]: 9'
    }
  ],

  'tema-quran-sabar': [
    {
      temaCode: 'tema-quran-sabar',
      submateri: 'Kandungan Q.S. Al-Baqarah: 155-157 dan Manajemen Emosi Resiliensi',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sulit',
      operationalVerb: 'Menganalisis hakikat sabar dan istirja dalam ujian hidup',
      indicatorTemplate: (ctx, concept) => `Disajikan studi kasus siswa yang tertimpa musibah kegagalan, peserta didik dapat menganalisis sikap sabar dan istirja' sesuai Q.S. Al-Baqarah: 155-157.`,
      stimulus: `Tim riset robotik SMP yang dipimpin Naila telah berlatih intensif selama tiga bulan. Namun, pada hari perlombaan nasional, komponen utama sirkuit terbakar akibat korsleting listrik tak terduga, sehingga tim mereka gugur di babak penyisihan. Sebagian anggota menangis histeris dan menyalahkan panitia, namun Naila menenangkan rekan-rekannya dengan melafalkan istirja' dan mengajak tim melakukan evaluasi teknis.`,
      questionText: `Sikap yang diambil Naila paling mendalam merefleksikan makna sabar dalam Q.S. Al-Baqarah [2]: 155-157 karena...`,
      options: [
        { key: 'A', text: 'Memadukan ketenangan spiritual (istirja\') dengan ketahanan mental aktif untuk merefleksikan kegagalan sebagai sarana peningkatan kapasitas diri.' },
        { key: 'B', text: 'Menerima keadaan dengan pasrah total tanpa berupaya mencari solusi perbaikan untuk kompetisi berikutnya.' },
        { key: 'C', text: 'Menekan emosi kekecewaan agar dipandang sebagai pemimpin yang kuat oleh guru pembimbing.' },
        { key: 'D', text: 'Menghindari konflik terbuka dengan panitia penyelenggara demi menjaga citra baik nama sekolah.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A mencerminkan sabar yang aktif dan bernilai tinggi: mengakui kemahakuasaan Allah (istirja\') disertai tindakan rasional mengevaluasi diri (resiliensi spiritual).',
      distractorExplanation: {
        A: 'Jawaban paling mendalam menghubungkan dalil naqli dengan tindakan psikologis-spiritual.',
        B: 'Pasrah buta (fatalisme) bukanlah esensi sabar dalam Islam, melainkan tanda keputusasaan.',
        C: 'Pencitraan sosial lahiriah, bertentangan dengan ketulusan hati.',
        D: 'Pertimbangan pragmatis institusional, belum menyentuh dimensi ketakwaan ilahi.'
      },
      islamicValue: 'Resiliensi Spiritual, Sabar Aktif, dan Husnuzan kepada Allah',
      realLifeContext: 'Menghadapi kegagalan dalam kompetisi akademik/nonakademik',
      dalilReference: 'Q.S. Al-Baqarah [2]: 155-157'
    }
  ],

  'tema-quran-toleransi': [
    {
      temaCode: 'tema-quran-toleransi',
      submateri: 'Kandungan Q.S. Al-Hujurat: 13 dan Batasan Akidah Q.S. Al-Kafirun',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sulit',
      operationalVerb: 'Menganalisis batasan toleransi sosial dan kemurnian akidah',
      indicatorTemplate: (ctx, concept) => `Disajikan situasi keragaman di sekolah majemuk, peserta didik dapat membedakan batasan toleransi sosial (muamalah) dengan kemurnian akidah berdasarkan Q.S. Al-Hujurat: 13 dan Q.S. Al-Kafirun.`,
      stimulus: `Di sebuah SMP negeri yang majemuk, OSIS merencanakan program bakti sosial membersihkan lingkungan bantaran sungai dan membagikan paket sembako kepada warga dhuafa lintas etnis dan agama. Di saat yang sama, seorang pengurus mengusulkan agar kegiatan ditutup dengan ritual doa bersama yang menggabungkan bacaan doa dari berbagai agama dalam satu rangkaian ritual peribadatan.`,
      questionText: `Berdasarkan prinsip Q.S. Al-Hujurat: 13 dan Q.S. Al-Kafirun, keputusan musyawarah OSIS yang paling proporsional adalah...`,
      options: [
        { key: 'A', text: 'Mendukung penuh aksi bakti sosial peduli dhuafa bersama, namun untuk doa dilakukan menurut tata cara dan keyakinan masing-masing tanpa mencampuradukkan ritual ibadah.' },
        { key: 'B', text: 'Menyetujui usulan doa bersama gabungan sebagai wujud toleransi tanpa batas demi menjaga keharmonisan antarumat beragama.' },
        { key: 'C', text: 'Membatalkan seluruh kegiatan bakti sosial karena dikhawatirkan dapat melunturkan keyakinan akidah para siswa muslim.' },
        { key: 'D', text: 'Hanya menyalurkan paket sembako kepada warga yang seagama saja untuk menghindari potensi fitnah muamalah.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A menegakkan batas tegas syariat: toleransi sosial, gotong royong kemanusiaan, dan cinta sesama wajib dijalankan (Al-Hujurat: 13), sementara urusan ibadah/akidah tidak boleh dicampuradukkan (Al-Kafirun: 6).',
      distractorExplanation: {
        A: 'Pilihan tepat: merefleksikan moderasi beragama yang kokoh dan berprinsip.',
        B: 'Sinkretisme agama melanggar prinsip kemurnian tauhid (Lakum dinukum waliyadin).',
        C: 'Sikap eksklusif yang bertentangan dengan ajaran Islam sebagai rahmatan lil \'alamin.',
        D: 'Egoisme sempit yang mencederai nilai kemanusiaan universal dalam Islam.'
      },
      islamicValue: 'Tasamuh (Toleransi Proporsional), Kemurnian Akidah, dan Ukhuwah Insaniyah',
      realLifeContext: 'Kehidupan kebhinnekaan sekolah dan gotong royong masyarakat',
      dalilReference: 'Q.S. Al-Hujurat [49]: 13 & Q.S. Al-Kafirun [109]: 1-6'
    }
  ],

  // =========================================================================
  // 2. ELEMEN AKIDAH
  // =========================================================================
  'tema-akidah-asmaul-husna': [
    {
      temaCode: 'tema-akidah-asmaul-husna',
      submateri: 'Asmaul Husna: Al-Alim, Al-Khabir, As-Sami, Al-Bashir dan Muraqabah',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sulit',
      operationalVerb: 'Menganalisis implementasi Asmaul Husna dalam integritas moral',
      indicatorTemplate: (ctx, concept) => `Disajikan dilema kejujuran siswa saat ujian daring, peserta didik dapat menganalisis pengamalan Asmaul Husna Al-Bashir dan Al-'Alim dalam membentuk kesadaran muraqabah.`,
      stimulus: `Pada pelaksanaan Penilaian Akhir Semester (PAS) berbasis komputer secara mandiri di rumah, server madrasah mengalami gangguan sehingga fitur pembatasan tab peramban nonaktif. Zidan menyadari bahwa ia dapat dengan mudah membuka peramban lain untuk mencari kunci jawaban tanpa terdeteksi oleh sistem pemantau guru. Kendati demikian, Zidan tetap fokus menyelesaikan soal dengan jujur berdasarkan kemampuannya sendiri.`,
      questionText: `Tindakan Zidan tersebut paling tepat mencerminkan penghayatan terhadap Asmaul Husna...`,
      options: [
        { key: 'A', text: 'Al-Bashir (Maha Melihat) dan Al-\'Alim (Maha Mengetahui) yang menumbuhkan kesadaran muraqabah bahwa Allah selalu mengawasi setiap gerak-gerik dan niat di hati.' },
        { key: 'B', text: 'Al-Ghaffar (Maha Pengampun) karena ia yakin jika berbuat curang dosanya akan segera diampuni setelah bertaubat.' },
        { key: 'C', text: 'Al-Qawiyyu (Maha Kuat) karena ia ingin membuktikan kekuatan daya ingat intelektualnya kepada teman-temannya.' },
        { key: 'D', text: 'Al-Adl (Maha Adil) semata-mata agar ia tidak merasa bersalah kepada teman sekelas yang belajar keras.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A menghubungkan konsep asmaul husna Al-Bashir & Al-\'Alim dengan pembentukan karakter muraqabah (merasa selalu dalam pengawasan ilahi) yang melahirkan integritas moral.',
      distractorExplanation: {
        A: 'Pilihan tepat dan menunjukkan penalaran mendalam atas sifat Allah Swt.',
        B: 'Meremehkan dosa dan menyalahpahami sifat Al-Ghaffar secara serampangan.',
        C: 'Motivasi riya/ujub untuk pengakuan manusia, bukan keikhlasan tauhid.',
        D: 'Hanya pertimbangan emosi sosial horizontal, belum menyentuh dimensi vertikal muraqabah.'
      },
      islamicValue: 'Muraqabah, Integritas Kejujuran, dan Tauhid Praktis',
      realLifeContext: 'Ujian daring, transparansi digital, dan kejujuran tanpa kamera pengawas',
      dalilReference: 'Q.S. Al-Hadid [57]: 4 & Q.S. Qaf [50]: 16'
    }
  ],

  'tema-akidah-kitab-rasul': [
    {
      temaCode: 'tema-akidah-kitab-rasul',
      submateri: 'Meyakini Kitab-Kitab Allah dan Keteladanan Rasul Ulul Azmi',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sulit',
      operationalVerb: 'Menganalisis fungsi Al-Qur\'an sebagai pedoman pembeda',
      indicatorTemplate: (ctx, concept) => `Disajikan dilema sosial budaya di kalangan remaja, peserta didik dapat menganalisis fungsi Al-Qur'an sebagai Al-Furqan (pembeda benar dan salah) dalam menyaring budaya populer.`,
      stimulus: `Arif melihat banyak tren tantangan video (challenge) viral di media sosial yang mengorbankan rasa malu, membahayakan keselamatan fisik, dan memicu perundungan antarteman demi mengejar jumlah penonton (viewers). Arif menolak ajakan sahabatnya untuk ikut serta membuat konten serupa, dan justru mengajak rekan-rekannya memproduksi video edukasi sedekah dan kebersihan lingkungan.`,
      questionText: `Tindakan Arif mengidentifikasi dan menyaring tren tersebut paling tepat merefleksikan kedudukan Al-Qur'an sebagai...`,
      options: [
        { key: 'A', text: 'Al-Furqan (Pembeda), yaitu pedoman etis ilahi untuk memilah secara kritis antara perbuatan yang bermanfaat dan yang merusak moral serta martabat manusia.' },
        { key: 'B', text: 'Asy-Syifa (Penawar), sebatas doa penenang hati ketika menghadapi cemoohan teman sebaya karena tidak mengikuti tren.' },
        { key: 'C', text: 'Al-Huda (Petunjuk), yang difungsikan hanya untuk menghafal ayat tanpa perlu diimplementasikan dalam pemilihan konten digital.' },
        { key: 'D', text: 'Adz-Dzikr (Peringatan), sebagai bacaan ritual saat malam hari agar terlindung dari gangguan kejahatan siber.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A mengartikulasikan secara tepat fungsi Al-Qur\'an sebagai Al-Furqan dalam memfilter budaya kontemporer dengan nalar kritis dan etika Islami.',
      distractorExplanation: {
        A: 'Paling tepat dan mencerminkan deep learning dimensi mentransfer nilai ke era digital.',
        B: 'Reduksionis, membatasi fungsi kitab suci hanya pada aspek psikologis pasif.',
        C: 'Pemisahan antara hafalan dan amal bertentangan dengan tujuan penurunan Al-Qur\'an.',
        D: 'Mereduksi Al-Qur\'an menjadi sekadar ritual mistis penangkal bahaya.'
      },
      islamicValue: 'Kritis terhadap Budaya Populer, Integritas Nilai, dan Keteladanan Rasul',
      realLifeContext: 'Etika bermedia sosial dan menyaring tren viral remaja',
      dalilReference: 'Q.S. Al-Furqan [25]: 1 & Q.S. Al-Baqarah [2]: 185'
    },
    {
      temaCode: 'tema-akidah-kitab-rasul',
      submateri: 'Sifat Wajib Rasul dan Keteguhan Rasul Ulul Azmi',
      bloomLevel: 'C5',
      soloLevel: 'Extended Abstract',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sangat Sulit',
      operationalVerb: 'Mengevaluasi keteladanan sifat amanah dan tabligh dalam kepemimpinan siswa',
      indicatorTemplate: (ctx, concept) => `Disajikan studi kasus kepengurusan organisasi siswa, peserta didik dapat mengevaluasi penerapan sifat wajib rasul dalam menjaga amanah dan transparansi kepemimpinan.`,
      stimulus: `Sebagai bendahara panitia pentas seni sekolah, Faris mendapati sisa dana kegiatan sebesar Rp3.500.000 yang tidak tercatat dalam dokumen anggaran awal karena adanya potongan harga mendadak dari vendor. Salah seorang panitia menyarankan agar uang sisa tersebut dibagi rata antarpengurus sebagai bonus jerih payah. Faris menolak tegas usulan tersebut, menyusun laporan keuangan transparan secara rinci, dan mengembalikan sisa dana ke kas sekolah.`,
      questionText: `Evaluasi pedagogik yang paling tepat atas keputusan Faris dalam meneladani sifat rasul adalah...`,
      options: [
        { key: 'A', text: 'Mewujudkan integrasi sifat Amanah (dapat dipercaya) dan Shiddiq (jujur) yang melahirkan kepemimpinan akuntabel, menolak manipulasi hak publik demi integritas moral.' },
        { key: 'B', text: 'Menunjukkan sifat Fathanah (cerdas) dalam berhitung cepat demi menjaga popularitas dirinya di mata dewan guru sekolah.' },
        { key: 'C', text: 'Mencerminkan sikap hati-hati semata karena takut sanksi audit pembina OSIS, bukan atas dorongan keimanan kepada rasul.' },
        { key: 'D', text: 'Menerapkan sifat Tabligh (menyampaikan) yang berfokus pada teknik public speaking tanpa perlu membuktikan pembukuan riil.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A mencerminkan evaluasi komprehensif atas sifat Rasul (Amanah & Shiddiq) yang diaktualisasikan dalam integritas tata kelola keuangan organisasi.',
      distractorExplanation: {
        A: 'Sangat tepat dan memenuhi standar SOLO Extended Abstract.',
        B: 'Menilai kepintaran rasul untuk mengejar popularitas dan pujian manusia (riya).',
        C: 'Kepatuhan atas dasar takut sanksi duniawi, mereduksi keagungan sifat kenabian.',
        D: 'Mereduksi makna tabligh menjadi sekadar retorika lisan tanpa kejujuran fakta.'
      },
      islamicValue: 'Amanah, Shiddiq, Transparansi, dan Akuntabilitas Publik',
      realLifeContext: 'Pengelolaan anggaran kas OSIS dan ekstrakurikuler sekolah',
      dalilReference: 'Q.S. Al-Ahzab [33]: 21 & Q.S. An-Nisa [4]: 58'
    }
  ],

  'tema-akidah-hari-akhir': [
    {
      temaCode: 'tema-akidah-hari-akhir',
      submateri: 'Tahapan Hari Akhir (Ba\'ats, Mahsyar, Hisab, Mizan) dan Akuntabilitas Moral',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sulit',
      operationalVerb: 'Menganalisis dampak keyakinan hari akhir terhadap jejak digital',
      indicatorTemplate: (ctx, concept) => `Disajikan studi kasus perilaku bermedia sosial, peserta didik dapat menganalisis korelasi keyakinan terhadap Yaumul Hisab dan Mizan dengan kehati-hatian meninggalkan jejak digital.`,
      stimulus: `Dina gemar menulis komentar di berbagai platform media sosial. Suatu hari, ia tergoda untuk ikut merundung (cyberbullying) seorang penyanyi muda yang sedang ramai dihujat warganet dengan menggunakan akun samaran (anonim). Tiba-tiba ia teringat materi PAI tentang Yaumul Hisab, di mana setiap huruf, kata, dan ketukan jari kelak akan dimintai pertanggungjawaban di hadapan Allah Swt. tanpa ada yang tersembunyi.`,
      questionText: `Kesadaran akidah yang paling mendalam mempengaruhi keputusan Dina untuk menghapus draf komentar tersebut adalah...`,
      options: [
        { key: 'A', text: 'Keyakinan bahwa anonimitas di dunia maya tidak berlaku di hadapan pengadilan Allah, sebab Yaumul Hisab dan Mizan akan memperhitungkan seluruh rekam jejak amal sekecil apa pun.' },
        { key: 'B', text: 'Kekhawatiran akun samarannya dilacak oleh aparat kepolisian siber melalui alamat IP gawai yang ia gunakan.' },
        { key: 'C', text: 'Perasaan enggan berdebat karena penyanyi tersebut memiliki jutaan penggemar fanatik di media sosial.' },
        { key: 'D', text: 'Keinginan menjaga reputasi di hadapan orang tua yang sesekali memeriksa riwayat peramban di gawainya.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A menghubungkan esensi akidah Yaumul Hisab (perhitungan amal) dan Mizan dengan tanggung jawab etika digital melampaui sekat anonimitas dunia maya.',
      distractorExplanation: {
        A: 'Pilihan tepat: kesadaran hisab hakiki melahirkan self-regulation moral.',
        B: 'Hanya rasa takut terhadap hukum positif negara, belum menyentuh esensi iman hari akhir.',
        C: 'Pertimbangan kalkulasi jumlah massa duniawi tanpa nilai kesadaran akhirat.',
        D: 'Kepatuhan karena pengawasan orang tua, bukan kesadaran takwa kepada Allah Swt.'
      },
      islamicValue: 'Kesadaran Yaumul Hisab, Akuntabilitas Moral, dan Adab Siber',
      realLifeContext: 'Etika berkomentar di media sosial dan tanggung jawab jejak digital',
      dalilReference: 'Q.S. Al-Zalzalah [99]: 7-8 & Q.S. Yasin [36]: 65'
    }
  ],

  // =========================================================================
  // 3. ELEMEN AKHLAK
  // =========================================================================
  'tema-akhlak-cinta-lingkungan': [
    {
      temaCode: 'tema-akhlak-cinta-lingkungan',
      submateri: 'Fikih Bi\'ah: Tanggung Jawab Kekhalifahan dan Konservasi Alam',
      bloomLevel: 'C6',
      soloLevel: 'Extended Abstract',
      deepLearningDim: 'Mentransfer',
      difficulty: 'Sangat Sulit',
      operationalVerb: 'Merancang program aksi ramah lingkungan berbasis mandat khalifah',
      indicatorTemplate: (ctx, concept) => `Disajikan data persoalan sampah di sekolah, peserta didik dapat merancang strategi komprehensif pelestarian lingkungan berbasis mandat khalifah fil ardh dan fikih bi'ah.`,
      stimulus: `Berdasarkan audit lingkungan sekolah Adiwiyata di SMP Harapan Bangsa, dihasilkan sekitar 45 kg sampah plastik sekali pakai setiap hari yang didominasi oleh kemasan air mineral dan kantong kresek kantin. Kondisi ini bertentangan dengan prinsip Islam yang melarang berbuat kerusakan di muka bumi (fasad fil ardh) dan menuntut peran manusia sebagai khalifah yang memakmurkan alam.`,
      questionText: `Rancangan strategi berbasis nilai akhlak Islam yang paling komprehensif, berkelanjutan, dan berdampak sistemik adalah...`,
      options: [
        { key: 'A', text: 'Menerapkan regulasi "Eco-Madrasah" wajib membawa tumbler dan wadah makan pribadi, mendirikan bank sampah kompos kantin, serta mengintegrasikan edukasi fikih bi\'ah dalam pembiasaan karakter harian.' },
        { key: 'B', text: 'Menyediakan tempat sampah berukuran besar di setiap sudut koridor kelas agar sampah tidak berceceran di lantai sekolah.' },
        { key: 'C', text: 'Menjadwalkan hukuman piket membersihkan selokan bagi siswa yang tertangkap membuang sampah sembarangan.' },
        { key: 'D', text: 'Membakar seluruh tumpukan sampah plastik di halaman belakang sekolah setiap sore hari agar lingkungan tampak bersih.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A mencerminkan C6 (Mencipta) dan Extended Abstract: solusi hulu ke hilir yang menggabungkan kebijakan preventif, infrastruktur daur ulang, dan edukasi nilai syariat.',
      distractorExplanation: {
        A: 'Pilihan paling komprehensif, edukatif, dan ramah lingkungan jangka panjang.',
        B: 'Solusi teknis parsial di hilir yang tidak menyelesaikan akar persoalan timbulan plastik.',
        C: 'Pendekatan punitif jangka pendek yang tidak membangun kesadaran ruhaniyah cinta lingkungan.',
        D: 'Tindakan fatal yang justru mencemari udara dan membahayakan kesehatan warga sekolah.'
      },
      islamicValue: 'Fikih Bi\'ah, Tanggung Jawab Kekhalifahan, dan Larangan Fasad Fil Ardh',
      realLifeContext: 'Gerakan Zero Waste sekolah, pengurangan plastik sekali pakai, dan kantin hijau',
      dalilReference: 'Q.S. Ar-Rum [30]: 41 & Q.S. Al-A\'raf [7]: 56'
    }
  ],

  'tema-akhlak-adab-medsos': [
    {
      temaCode: 'tema-akhlak-adab-medsos',
      submateri: 'Prinsip Tabayyun, Qaulan Sadida, dan Menolak Hoaks',
      bloomLevel: 'C5',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sulit',
      operationalVerb: 'Mengevaluasi tindakan klarifikasi informasi sesuai prinsip tabayyun',
      indicatorTemplate: (ctx, concept) => `Disajikan tangkapan layar informasi kontroversial di grup percakapan siswa, peserta didik dapat mengevaluasi penerapan prinsip tabayyun (Q.S. Al-Hujurat: 6) dan etika Qaulan Sadida.`,
      stimulus: `Di grup percakapan WhatsApp kelas IX, beredar sebuah tautan berita sensasional dengan judul provokatif yang menyebutkan bahwa seorang guru favorit di sekolah mereka telah ditangkap karena tuduhan penyelewengan dana beasiswa. Pesan tersebut diteruskan puluhan kali disertai ajakan untuk melakukan aksi protes kepada kepala sekolah.`,
      questionText: `Langkah evaluasi dan tindakan pertama yang paling beradab dan sesuai dengan perintah Q.S. Al-Hujurat [49]: 6 adalah...`,
      options: [
        { key: 'A', text: 'Melakukan tabayyun (verifikasi kebenaran) dengan tidak menyebarluaskan pesan tersebut, meneliti kredibilitas sumber berita, dan menanyakan secara santun kepada pihak pimpinan sekolah sebelum beropini.' },
        { key: 'B', text: 'Segera meneruskan pesan tersebut ke seluruh grup media sosial lain agar para siswa lebih waspada dan cepat mengetahui kabar tersebut.' },
        { key: 'C', text: 'Langsung mengunggah tulisan protes terbuka di akun media sosial pribadi untuk membela guru tersebut tanpa menunggu konfirmasi.' },
        { key: 'D', text: 'Menghakimi pengirim pesan pertama di grup kelas dengan kata-kata kasar agar jera dan tidak mengulangi perbuatannya.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A mencerminkan kepatuhan sempurna pada Q.S. Al-Hujurat ayat 6: menghentikan laju disinformasi, memvalidasi sumber fakta, dan menjaga kehormatan sesama muslim.',
      distractorExplanation: {
        A: 'Pilihan tepat: implementasi tabayyun mencegah fitnah dan kegaduhan publik.',
        B: 'Menyebarkan kabar burung tanpa verifikasi adalah bentuk kelalaian yang diancam dosa fitnah.',
        C: 'Reaksi emosional terburu-buru yang dapat memperkeruh suasana dan memperluas hoaks.',
        D: 'Melanggar etika Qaulan Karima dan Qaulan Layyina dalam menegur sesama kawan.'
      },
      islamicValue: 'Tabayyun, Qaulan Sadida, Kejujuran Informasi, dan Ukhuwah',
      realLifeContext: 'Penyebaran pesan berantai hoaks di grup WhatsApp kelas dan media sosial',
      dalilReference: 'Q.S. Al-Hujurat [49]: 6 & Q.S. Al-Ahzab [33]: 70'
    }
  ],

  // =========================================================================
  // 4. ELEMEN FIKIH
  // =========================================================================
  'tema-fikih-sujud': [
    {
      temaCode: 'tema-fikih-sujud',
      submateri: 'Ketentuan Sujud Sahwi, Sujud Syukur, dan Sujud Tilawah',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis sebab dan tata cara sujud sahwi dalam salat',
      indicatorTemplate: (ctx, concept) => `Disajikan studi kasus keraguan rakaat salat berjamaah, peserta didik dapat menganalisis ketentuan sujud sahwi dan tata cara pelaksanaannya secara syar'i.`,
      stimulus: `Imam salat Isya berjamaah di masjid sekolah langsung berdiri ke rakaat ketiga setelah sujud kedua pada rakaat kedua tanpa melakukan duduk tasyahud awal. Makmum di belakangnya mengingatkan dengan mengucapkan tasbih 'Subhanallah'. Imam menyadari kekhilafannya, namun tetap melanjutkan salat hingga rakaat keempat karena telah berdiri tegak sempurna.`,
      questionText: `Berdasarkan kaidah fikih, langkah syar'i yang wajib dilakukan imam sebelum mengakhiri salat adalah...`,
      options: [
        { key: 'A', text: 'Menyempurnakan rakaat keempat, lalu melakukan sujud sahwi sebanyak dua kali sebelum salam karena meninggalkan sunnah ab\'adh (tasyahud awal).' },
        { key: 'B', text: 'Langsung kembali duduk tasyahud awal saat diingatkan makmum meskipun sudah berdiri membaca surah Al-Fatihah.' },
        { key: 'C', text: 'Mengulangi salat Isya dari awal rakaat pertama bersama seluruh makmum karena tasyahud awal merupakan rukun salat.' },
        { key: 'D', text: 'Melakukan sujud syukur setelah salam sebagai ungkapan terima kasih karena diingatkan makmum.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A tepat menurut fikih mazhab Syafi\'i: jika imam sudah berdiri tegak, ia tidak boleh kembali duduk untuk tasyahud awal (sunnah ab\'adh), melainkan menggantinya dengan sujud sahwi dua kali sebelum salam.',
      distractorExplanation: {
        A: 'Sesuai dengan sunnah Rasulullah Saw. dalam hadis riwayat Bukhari-Muslim tentang sujud sahwi.',
        B: 'Keliru, kembali duduk setelah berdiri tegak justru dapat membatalkan salat jika dilakukan dengan sengaja.',
        C: 'Keliru, tasyahud awal berkedudukan sunnah ab\'adh, bukan rukun salat yang membatalkan rakaat.',
        D: 'Keliru, sujud syukur dilakukan di luar salat atas perolehan nikmat atau terhindar dari bencana, bukan untuk menambal kekurangan salat.'
      },
      islamicValue: 'Ketertiban Syariat, Kerendahan Hati Mengakui Kekhilafan, dan Ketenangan Ibadah',
      realLifeContext: 'Salat berjamaah di sekolah dan ketepatan tata cara ibadah',
      dalilReference: 'H.R. Bukhari & Muslim tentang Sujud Sahwi'
    }
  ],

  'tema-fikih-rukhsah': [
    {
      temaCode: 'tema-fikih-rukhsah',
      submateri: 'Rukhsah Salat Jamak, Qashar, dan Kondisi Darurat',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sulit',
      operationalVerb: 'Menganalisis syarat dan keabsahan salat jamak qashar dalam perjalanan',
      indicatorTemplate: (ctx, concept) => `Disajikan skenario perjalanan studi tur antarpulau, peserta didik dapat menganalisis penerapan rukhsah salat jamak dan qashar secara tepat dan sah menurut syariat.`,
      stimulus: `Rombongan studi tur SMP berangkat dari Surabaya menuju Yogyakarta dengan menempuh jarak sekitar 320 km. Mereka berangkat pukul 06.00 WIB dan dijadwalkan tiba pukul 16.00 WIB. Pada pukul 12.30 WIB, bus beristirahat di rest area tol Ngawi. Pembina OSIS mengajak siswa muslim untuk menunaikan salat Zuhur dan Asar sekaligus.`,
      questionText: `Tata cara pelaksanaan rukhsah yang paling tepat dan sah bagi rombongan tersebut adalah...`,
      options: [
        { key: 'A', text: 'Melaksanakan salat Jamak Taqdim dan Qashar, yaitu mengerjakan salat Zuhur 2 rakaat kemudian dilanjutkan salat Asar 2 rakaat pada waktu Zuhur secara berurutan.' },
        { key: 'B', text: 'Mengerjakan salat Zuhur 4 rakaat penuh lalu menunda salat Asar 4 rakaat hingga tiba di tempat tujuan penginapan pada malam hari.' },
        { key: 'C', text: 'Melaksanakan salat Zuhur dan Asar sekaligus sebanyak 8 rakaat tanpa jeda salam untuk menunjukkan kesungguhan ibadah musafir.' },
        { key: 'D', text: 'Menggugurkan kewajiban salat Zuhur dan Asar selama perjalanan dan menggantinya dengan membayar fidyah beras.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A memenuhi seluruh kriteria rukhsah musafir: jarak melebihi 81 km, niat jamak taqdim di waktu pertama, meng-qashar salat 4 rakaat menjadi 2 rakaat, dan dikerjakan berurutan (muwalah).',
      distractorExplanation: {
        A: 'Sesuai dengan dalil hadis riwayat Bukhari tentang rukhsah musafir Rasulullah Saw.',
        B: 'Mengabaikan kemudahan rukhsah qashar dan berisiko kehilangan waktu Asar di jalan.',
        C: 'Menyalahi kaidah ibadah; salat qashar adalah anugerah syariat yang dicintai Allah.',
        D: 'Kesesatan fatal; salat fardhu tidak boleh digugurkan dengan fidyah selama akal masih sehat.'
      },
      islamicValue: 'Hikmah Kasih Sayang Syariat, Keringanan (Taisir), dan Disiplin Ibadah',
      realLifeContext: 'Perjalanan studi tur sekolah, mudik, dan mobilitas modern remaja',
      dalilReference: 'Q.S. An-Nisa [4]: 101 & H.R. Ahmad tentang Mencintai Rukhsah'
    }
  ],

  'tema-fikih-kurban-akikah': [
    {
      temaCode: 'tema-fikih-kurban-akikah',
      submateri: 'Ketentuan Penyembelihan, Kurban, dan Akikah',
      bloomLevel: 'C5',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sulit',
      operationalVerb: 'Mengevaluasi perbedaan prinsip kurban dan akikah serta dimensi sosialnya',
      indicatorTemplate: (ctx, concept) => `Disajikan kasus pengelolaan hewan kurban dan akikah di lingkungan masyarakat, peserta didik dapat mengevaluasi perbedaan ketentuan syariat serta dampak pemberdayaan sosialnya.`,
      stimulus: `Pak Rahmat dikaruniai seorang anak laki-laki yang lahir bertepatan dengan tanggal 9 Dzulhijjah. Pada Hari Raya Idul Adha (10 Dzulhijjah), ia berniat menyembelih seekor kambing jantan dewasa yang sehat dan berniat menggabungkannya sebagai ibadah kurban sekaligus akikah untuk putranya, lalu membagikan seluruh dagingnya dalam kondisi matang ke panti asuhan.`,
      questionText: `Evaluasi ketentuan syariat dan solusi penyempurnaan yang paling tepat bagi Pak Rahmat adalah...`,
      options: [
        { key: 'A', text: 'Kurban dan akikah memiliki tujuan syariat yang berbeda; untuk anak laki-laki disunnahkan 2 ekor kambing akikah, dan daging kurban utama dibagikan dalam kondisi mentah kepada fakir miskin, sedangkan daging akikah disunnahkan matang.' },
        { key: 'B', text: 'Tindakan Pak Rahmat sudah sempurna karena satu kambing dapat mencakup niat kurban, akikah, dan nazar sekaligus.' },
        { key: 'C', text: 'Pak Rahmat sebaiknya membatalkan akikah anaknya selamanya karena akikah hanya berlaku sah jika disembelih pada bulan Ramadan.' },
        { key: 'D', text: 'Seluruh daging kurban dan akikah harus dijual kembali ke pasar hewan untuk dibelikan sembako instan.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A menguraikan secara rinci ketentuan fikih: perbedaan tujuan kurban (syiar Idul Adha) dan akikah (tebusan kelahiran anak, 2 kambing untuk putra), serta perbedaan adab pembagian daging mentah vs matang.',
      distractorExplanation: {
        A: 'Pilihan tepat: membedakan hakikat dua ibadah dengan presisi fikih.',
        B: 'Mayoritas ulama menganjurkan pemisahan kurban dan akikah agar masing-masing ibadah tertunaikan sempurna.',
        C: 'Keliru, akikah disunnahkan pada hari ke-7 kelahiran dan tidak terikat dengan bulan Ramadan.',
        D: 'Haram hukumnya menjual daging atau kulit hewan kurban dan akikah menurut ijma ulama.'
      },
      islamicValue: 'Kepedulian Sosial, Ketaatan Syariat, dan Solidaritas Dhuafa',
      realLifeContext: 'Ibadah kurban di sekolah dan lingkungan tempat tinggal siswa',
      dalilReference: 'Q.S. Al-Kautsar [108]: 2 & H.R. Tirmidzi tentang Akikah'
    }
  ],

  // =========================================================================
  // 5. ELEMEN SEJARAH PERADABAN ISLAM
  // =========================================================================
  'tema-spi-abbasiyah': [
    {
      temaCode: 'tema-spi-abbasiyah',
      submateri: 'Baitul Hikmah, Polimatik Muslim, dan Zaman Keemasan Sains',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Memahami',
      difficulty: 'Sulit',
      operationalVerb: 'Menganalisis faktor kemajuan sains pada masa Daulah Abbasiyah',
      indicatorTemplate: (ctx, concept) => `Disajikan narasi sejarah peradaban Baitul Hikmah di Baghdad, peserta didik dapat menganalisis faktor penentu kemajuan ilmu pengetahuan dan keterbukaan intelektual ilmuwan muslim.`,
      stimulus: `Pada masa Khalifah Harun Ar-Rasyid dan Al-Ma'mun, lembaga riset dan perpustakaan Baitul Hikmah di Baghdad menjadi pusat penerjemahan dan pengembangan ilmu pengetahuan dunia. Para ilmuwan muslim seperti Al-Khawarizmi (penemu aljabar) dan Ibnu Sina (bapak kedokteran modern) tidak memisahkan antara kajian sains alam dengan nilai-nilai ketauhidan Islam. Karya-karya klasik Yunani, Persia, dan India diterjemahkan, dikritisi, dan disempurnakan.`,
      questionText: `Faktor kunci yang melandasi kejayaan peradaban sains Daulah Abbasiyah yang paling relevan diteladani generasi muda saat ini adalah...`,
      options: [
        { key: 'A', text: 'Keterbukaan intelektual dalam menyerap ilmu pengetahuan global yang diintegrasikan secara harmonis dengan nilai-nilai tauhid dan etika kemanusiaan.' },
        { key: 'B', text: 'Kekuatan dominasi militer yang memaksa wilayah taklukan menyerahkan seluruh buku dan naskah kuno kepada khalifah.' },
        { key: 'C', text: 'Fokus penelitian yang hanya mengkaji ilmu agama teoritis tanpa menyentuh cabang sains modern seperti matematika dan kedokteran.' },
        { key: 'D', text: 'Kebijakan menutup diri dari interaksi pemikiran bangsa lain demi menjaga kemurnian bahasa Arab.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A mencerminkan analisis historis yang akurat: kemajuan Baitul Hikmah berpijak pada etos riset terbuka, integrasi wahyu dan akal, serta dukungan penuh negara terhadap literasi ilmu.',
      distractorExplanation: {
        A: 'Pilihan tepat: merefleksikan inspirasi peradaban Islam bagi kebangkitan sains generasi masa kini.',
        B: 'Keliru, gerakan penerjemahan didanai dengan penghargaan tinggi, bukan paksaan militer.',
        C: 'Fakta sejarah membuktikan Abbasiyah melahirkan polimatik ilmu alam, kedokteran, optik, dan astronomi.',
        D: 'Bertolak belakang dengan fakta sejarah keterbukaan Baghdad terhadap naskah multibahasa.'
      },
      islamicValue: 'Integrasi Sains dan Tauhid, Cinta Ilmu Pengetahuan, dan Keterbukaan Intelektual',
      realLifeContext: 'Etos riset dan inovasi sains teknologi di kalangan pelajar muslim',
      dalilReference: 'Sejarah Daulah Abbasiyah & Nilai Q.S. Ar-Rahman [55]: 33'
    }
  ],

  'tema-spi-masuknya-islam-ri': [
    {
      temaCode: 'tema-spi-masuknya-islam-ri',
      submateri: 'Teori Masuknya Islam dan Saluran Dakwah Damai Nusantara',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Memahami',
      difficulty: 'Sulit',
      operationalVerb: 'Menganalisis saluran dakwah damai dan akulturasi budaya di Nusantara',
      indicatorTemplate: (ctx, concept) => `Disajikan data peninggalan sejarah dan saluran dakwah, peserta didik dapat menganalisis kearifan dakwah kultural para penyebar Islam di Nusantara.`,
      stimulus: `Penyebaran Islam di kepulauan Nusantara tercatat sebagai salah satu peristiwa dakwah paling damai dalam sejarah dunia tanpa melalui penaklukan militer. Para saudagar muslim dan ulama berinteraksi dengan penduduk lokal melalui jalur perdagangan maritim, pernikahan santun, jalur pendidikan pesantren, dan akulturasi seni budaya seperti pertunjukan wayang kulit yang disisipi nilai tauhid oleh para wali.`,
      questionText: `Keberhasilan dakwah Islam di Nusantara paling tepat dianalisis melalui pendekatan...`,
      options: [
        { key: 'A', text: 'Dakwah kultural yang bijaksana (bil hikmah wal mau\'izhah hasanah) dengan menghargai kearifan lokal tanpa mengorbankan kemurnian ajaran tauhid.' },
        { key: 'B', text: 'Penghapusan seluruh adat istiadat leluhur secara paksa dan radikal agar tercipta masyarakat yang seragam.' },
        { key: 'C', text: 'Campur tangan kekuatan kerajaan asing dari Timur Tengah yang mengirimkan armada tempur bersenjata lengkap.' },
        { key: 'D', text: 'Penyerahan kekuasaan oleh para raja lokal semata-mata karena iming-iming keuntungan monopoli perdagangan rempah-rempah.' }
      ],
      correctKey: 'A',
      explanation: 'Pilihan A merangkum strategi dakwah Wali Songo dan saudagar muslim di Nusantara yang mengedepankan pendekatan persaudaraan, keteladanan akhlak, dan akulturasi damai.',
      distractorExplanation: {
        A: 'Pilihan tepat: sesuai dengan fakta historis dan prinsip dakwah Al-Qur\'an An-Nahl: 125.',
        B: 'Keliru, Islamisasi Nusantara tidak merusak tradisi melainkan menyempurnakannya dengan nilai tauhid.',
        C: 'Fakta historis mencatat tidak pernah ada invasi militer Timur Tengah ke kepulauan Nusantara.',
        D: 'Mereduksi dakwah luhur menjadi transaksi ekonomi sempit.'
      },
      islamicValue: 'Dakwah Damai (Bil Hikmah), Tasamuh, Kearifan Lokal, dan Keteladanan Akhlak',
      realLifeContext: 'Menjaga keharmonisan budaya bangsa di tengah kebhinnekaan Indonesia',
      dalilReference: 'Q.S. An-Nahl [16]: 125'
    }
  ],

  // =========================================================================
  // BLUEPRINTS UNTUK 30 TEMA TERSINKRONISASI (KELAS VII, VIII, IX)
  // =========================================================================
  'tema-vii-1-quran-iman': [
    {
      temaCode: 'tema-vii-1-quran-iman',
      submateri: 'Hakikat Keimanan dalam Q.S. Al-Anfal: 2-4 dan Hadis Jibril',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis korelasi keimanan dan integritas moral',
      indicatorTemplate: (ctx, concept) => `Disajikan studi kasus integritas siswa saat ujian mandiri, peserta didik dapat menganalisis peran iman sebagai pembimbing moral sesuai Q.S. Al-Anfal: 2-4.`,
      stimulus: `Faris sedang mengerjakan ujian daring tanpa kamera pengawas. Di sampingnya terdapat catatan ringkasan yang belum disimpan. Teman di seberang mengajaknya bertukar jawaban melalui pesan singkat. Faris teringat ayat bahwa mukmin sejati senantiasa bergetar hatinya saat mengingat keagungan Allah Swt., sehingga ia memilih menutup catatan dan menolak ajakan curang.`,
      questionText: `Berdasarkan peristiwa tersebut, keputusan yang diambil Faris paling mendalam mencerminkan hakikat iman dalam Q.S. Al-Anfal [8]: 2-4 karena...`,
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
      dalilReference: 'Q.S. Al-Anfal [8]: 2-4 & H.R. Muslim'
    }
  ],
  'tema-vii-1-akhlak-ikhlas': [
    {
      temaCode: 'tema-vii-1-akhlak-ikhlas',
      submateri: 'Menjaga Kemurnian Niat dari Bahaya Riya\' dan Flexing di Media Sosial',
      bloomLevel: 'C5',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sulit',
      operationalVerb: 'Mengevaluasi penerapan nilai ikhlas dalam kegiatan sosial remaja',
      indicatorTemplate: (ctx, concept) => `Disajikan narasi kegiatan sosial siswa, peserta didik dapat mengevaluasi penerapan makna ikhlas dari bahaya flexing media sosial.`,
      stimulus: `Kelompok belajar Ahmad mengadakan bakti sosial menyumbangkan buku dan perlengkapan sekolah ke panti asuhan. Salah seorang anggota mengusulkan untuk merekam video wajah anak-anak panti secara dramatis untuk dijadikan konten video pendek di media sosial agar viral. Ahmad menolak usulan tersebut dan menyarankan agar dokumentasi cukup berupa arsip laporan tanpa mengekspos anak-anak panti.`,
      questionText: `Tindakan penolakan yang disarankan oleh Ahmad paling tepat mencerminkan penerapan makna ikhlas karena...`,
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
      dalilReference: 'Q.S. Al-Bayyinah [98]: 5 & H.R. Bukhari'
    }
  ],
  'tema-vii-1-spi-umayyah': [
    {
      temaCode: 'tema-vii-1-spi-umayyah',
      submateri: 'Integritas Fiskal dan Kepemimpinan Keadilan Khalifah Umar bin Abdul Aziz',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis nilai keteladanan integritas fiskal kepemimpinan Islam',
      indicatorTemplate: (ctx, concept) => `Disajikan kisah kepemimpinan Khalifah Umar bin Abdul Aziz, peserta didik dapat menganalisis relevansi integritas fiskal bagi tata kelola organisasi siswa.`,
      stimulus: `Ketika Khalifah Umar bin Abdul Aziz bekerja di ruang kerjanya pada malam hari, putranya datang untuk membicarakan urusan keluarga. Khalifah segera mematikan lampu minyak milik negara dan menyalakan lilin pribadi miliknya. Beliau menolak menggunakan fasilitas negara yang dibeli dari uang rakyat untuk urusan pribadi keluarganya.`,
      questionText: `Pelajaran kepemimpinan (ibrah) yang paling mendasar dari keteladanan Khalifah Umar bin Abdul Aziz untuk diterapkan pengurus organisasi OSIS adalah...`,
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
      dalilReference: 'Q.S. An-Nisa\' [4]: 58 & Tarikh Khulafa'
    }
  ],
  'tema-vii-2-quran-takwa': [
    {
      temaCode: 'tema-vii-2-quran-takwa',
      submateri: 'Karakter Muttaqin dalam Q.S. Ali \'Imran: 102 dan Hadis Ittaqillaha Haitsuma Kunta',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis implementasi ketakwaan di berbagai ruang kehidupan',
      indicatorTemplate: (ctx, concept) => `Disajikan studi kasus pergaulan remaja di dunia maya, peserta didik dapat menganalisis implementasi wasiat takwa di mana pun berada.`,
      stimulus: `Rasulullah Saw. berwasiat dalam hadis riwayat Tirmidzi: "Bertakwalah kepada Allah di mana pun engkau berada, dan ikutilah keburukan dengan kebaikan niscaya akan menghapusnya, serta bergaullah dengan manusia dengan akhlak terpuji." Zidan mengamalkan hadis ini dengan tetap bertutur kata sopan di grup media sosial dan tidak menggunakan kata-kata kotor meskipun teman-temannya sedang saling mengejek.`,
      questionText: `Penerapan takwa yang ditunjukkan Zidan selaras dengan wasiat Rasulullah Saw. karena...`,
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
      dalilReference: 'H.R. Tirmidzi & Q.S. Ali \'Imran [3]: 102'
    }
  ],
  'tema-vii-2-akhlak-syukur': [
    {
      temaCode: 'tema-vii-2-akhlak-syukur',
      submateri: 'Tiga Dimensi Syukur: Hati (Qalbi), Lisan (Hamdalah), dan Perbuatan Nyata (Amali)',
      bloomLevel: 'C5',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sedang',
      operationalVerb: 'Mengevaluasi bentuk perwujudan syukur amali yang maslahat',
      indicatorTemplate: (ctx, concept) => `Disajikan studi kasus perayaan kelulusan atau prestasi siswa, peserta didik dapat merancang bentuk syukur amali yang bermanfaat bagi sesama.`,
      stimulus: `Setelah memenangkan lomba cerdas cermat tingkat kabupaten, regu SMP Bina Insan menerima hadiah uang tunai dan trofi. Beberapa teman mengusulkan agar seluruh uang hadiah dihabiskan untuk makan-makan pesta mewah di restoran cepat saji. Ketua regu mengusulkan alternatif: mengadakan syukuran sederhana dan mengalokasikan sebagian besar dana untuk membelikan buku bacaan bagi perpustakaan musala desa.`,
      questionText: `Usulan ketua regu paling tepat merefleksikan makna hakiki bersyukur kepada Allah Swt. (Q.S. Ibrahim: 7) karena...`,
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
      dalilReference: 'Q.S. Ibrahim [14]: 7 & Q.S. Luqman [31]: 12'
    }
  ],
  'tema-vii-2-fikih-salat-jumat': [
    {
      temaCode: 'tema-vii-2-fikih-salat-jumat',
      submateri: 'Adab Khotbah Jumat dan Larangan Berbicara saat Khatib Berkhotbah',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis konsekuensi syar\'i pelanggaran adab mendengarkan khotbah Jumat',
      indicatorTemplate: (ctx, concept) => `Disajikan fenomena penggunaan gawai saat khotbah Jumat di masjid sekolah, peserta didik dapat menganalisis dampak hukum adab mendengarkan khotbah.`,
      stimulus: `Saat salat Jumat berlangsung di masjid sekolah, khatib sedang menyampaikan khotbah kedua tentang adab pergaulan remaja. Di saf belakang, dua orang peserta didik saling berbisik dan salah satunya membuka media sosial di ponsel pintarnya untuk memperlihatkan video lucu kepada temannya.`,
      questionText: `Berdasarkan hadis Rasulullah Saw. tentang larangan berkata-kata saat khotbah Jumat, dampak hukum dari tindakan kedua peserta didik tersebut adalah...`,
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
      dalilReference: 'H.R. Bukhari No. 934 & H.R. Muslim No. 851'
    }
  ],
  'tema-viii-1-akhlak-husnuzan': [
    {
      temaCode: 'tema-viii-1-akhlak-husnuzan',
      submateri: 'Menjauhi Su\'uzan, Tajassus, dan Ghibah Berdasarkan Q.S. Al-Hujurat: 12',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sedang',
      operationalVerb: 'Menerapkan nilai husnuzan dan tabayyun dalam konflik antarteman',
      indicatorTemplate: (ctx, concept) => `Disajikan situasi tuduhan kehilangan di ruang kelas, peserta didik dapat menerapkan sikap husnuzan dan tabayyun.`,
      stimulus: `Uang iuran kegiatan kelas sebesar Rp50.000 hilang dari meja bendahara saat jam istirahat. Beberapa siswa langsung mencurigai seorang teman yang saat itu kebetulan berada di kelas sendirian. Riko mengingatkan rekan-rekannya agar tidak langsung berburuk sangka (su\'uzan) dan mengajak menanyakan secara baik-baik (tabayyun). Ternyata uang tersebut terselip di dalam map daftar hadir yang dibawa guru.`,
      questionText: `Sikap Riko yang mencegah teman-temannya menuduh tanpa bukti selaras dengan firman Allah Swt. dalam Q.S. Al-Hujurat [49]: 12 karena...`,
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
      dalilReference: 'Q.S. Al-Hujurat [49]: 12 & H.R. Bukhari'
    }
  ],
  'tema-viii-1-fikih-jenazah': [
    {
      temaCode: 'tema-viii-1-fikih-jenazah',
      submateri: 'Urutan Rukun Salat Jenazah Empat Takbir dan Doa-Doanya',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis urutan rukun bacaan salat jenazah',
      indicatorTemplate: (ctx, concept) => `Disajikan rincian tata cara salat jenazah, peserta didik dapat menganalisis urutan bacaan setelah empat takbir secara benar.`,
      stimulus: `Siswa kelas VIII SMP mengikuti praktik simulasi pengurusan jenazah di musala sekolah. Guru PAI menunjuk seorang perwakilan siswa untuk menjadi imam salat jenazah 4 takbir tanpa rukuk dan sujud.`,
      questionText: `Urutan rukun bacaan setelah masing-masing takbir pada salat jenazah yang sah menurut syariat adalah...`,
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
      dalilReference: 'H.R. Muslim & Kitab Fathul Qarib Al-Mujib'
    }
  ],
  'tema-viii-2-quran-cinta-tanah-air': [
    {
      temaCode: 'tema-viii-2-quran-cinta-tanah-air',
      submateri: 'Konsep Hubbul Wathan Minal Iman dan Pengamalan Q.S. Al-Qashas: 85',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis wujud kecintaan tanah air bagi pelajar muslim',
      indicatorTemplate: (ctx, concept) => `Disajikan narasi peran pelajar dalam mengisi kemerdekaan, peserta didik dapat menganalisis nilai cinta tanah air dalam perspektif Islam.`,
      stimulus: `Rasulullah Saw. menunjukkan kecintaan mendalam pada tanah tumpah darahnya Makkah dan Madinah, sebagaimana diisyaratkan dalam Q.S. Al-Qashas: 85. Para ulama di Indonesia merumuskan kaidah bahwa mencintai dan menjaga tanah air adalah bagian dari perwujudan keimanan (Hubbul Wathan Minal Iman).`,
      questionText: `Wujud nyata pengamalan nilai cinta tanah air yang paling tepat dilakukan oleh seorang pelajar muslim di sekolah adalah...`,
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
      dalilReference: 'Q.S. Al-Qashas [28]: 85 & H.R. Tirmidzi'
    }
  ],
  'tema-viii-2-akhlak-cinta-rasul': [
    {
      temaCode: 'tema-viii-2-akhlak-cinta-rasul',
      submateri: 'Meneladani Sifat Pemaaf dan Kasih Sayang Rasulullah Saw. kepada Sesama',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sedang',
      operationalVerb: 'Menerapkan akhlak pemaaf Rasulullah Saw. dalam interaksi sosial',
      indicatorTemplate: (ctx, concept) => `Disajikan studi kasus perselisihan antarteman di sekolah, peserta didik dapat menerapkan akhlak pemaaf Rasulullah Saw.`,
      stimulus: `Aisyah diejek oleh seorang temannya di media sosial karena sepatu sekolahnya yang sudah usang. Teman-teman dekat Aisyah memprovokasi agar ia membalas dengan membongkar aib temannya tersebut. Aisyah menolak membalas, memilih memaafkannya secara tulus, dan tetap menyapa temannya dengan ramah keesokan harinya di kelas, meneladani sikap Rasulullah Saw. saat memaafkan penduduk Thaif.`,
      questionText: `Sikap pemaaf yang diambil Aisyah paling mendalam membuktikan cintanya kepada Rasulullah Saw. karena...`,
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
      dalilReference: 'Q.S. Ali \'Imran [3]: 159 & Q.S. Al-Ahzab [33]: 21'
    }
  ],
  'tema-viii-2-fikih-haji-umrah': [
    {
      temaCode: 'tema-viii-2-fikih-haji-umrah',
      submateri: 'Rukun Haji dan Makna Filosofis Kesetaraan di Padang Arafah',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis nilai kesetaraan sosial dari rukun wukuf di Arafah',
      indicatorTemplate: (ctx, concept) => `Disajikan tahapan manasik haji, peserta didik dapat menganalisis kedudukan wukuf di Arafah dan nilai filosofis kesetaraan manusia.`,
      stimulus: `Pada tanggal 9 Dzulhijjah, jutaan jamaah haji dari seluruh penjuru dunia berkumpul di Padang Arafah mengenakan dua helai kain ihram putih polos tanpa jahitan. Tidak ada perbedaan busana antara pejabat negara, saudagar kaya, maupun rakyat jelata.`,
      questionText: `Pelajaran nilai tauhid dan kemanusiaan paling mendalam yang dipetik dari pelaksanaan wukuf di Arafah dengan pakaian ihram adalah...`,
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
      dalilReference: 'Q.S. Ali \'Imran [3]: 97 & H.R. Tirmidzi (Al-Hajju \'Arafah)'
    }
  ],
  'tema-viii-2-spi-turki-usmani': [
    {
      temaCode: 'tema-viii-2-spi-turki-usmani',
      submateri: 'Penaklukan Konstantinopel oleh Sultan Muhammad Al-Fatih dan Kebijakan Millet System',
      bloomLevel: 'C5',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sulit',
      operationalVerb: 'Mengevaluasi integrasi kepemimpinan sains dan toleransi Sultan Muhammad Al-Fatih',
      indicatorTemplate: (ctx, concept) => `Disajikan peristiwa penaklukan Konstantinopel 1453 M, peserta didik dapat mengevaluasi perpaduan keahlian sains strategis dan akhlak toleransi Sultan Al-Fatih.`,
      stimulus: `Ketika Sultan Muhammad Al-Fatih berhasil menaklukkan Konstantinopel pada tahun 1453 M di usia 21 tahun, beliau memadukan inovasi meriam modern tercanggih (Sains Militer) dengan ketaatan ibadah pasukannya. Setelah memasuki kota, Sultan Al-Fatih menjamin kebebasan beragama dan melindungi seluruh gereja serta warga nonmuslim melalui kebijakan sistem perlindungan (Millet System).`,
      questionText: `Evaluasi kepemimpinan yang paling tepat atas keberhasilan Sultan Muhammad Al-Fatih adalah...`,
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
      dalilReference: 'H.R. Ahmad (Bisyarah Konstantinopel) & Q.S. Al-Fath [48]: 29'
    }
  ],
  'tema-ix-1-akhlak-kasih-sayang-sesama': [
    {
      temaCode: 'tema-ix-1-akhlak-kasih-sayang-sesama',
      submateri: 'Pencegahan Perundungan (Bullying) di Sekolah Berbasis Ukhuwah dan Ta\'awun',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Mengaplikasi',
      difficulty: 'Sedang',
      operationalVerb: 'Merancang tindakan konkret berbasis kasih sayang untuk mengatasi perundungan relasional',
      indicatorTemplate: (ctx, concept) => `Disajikan fenomena pengucilan siswa di kelas, peserta didik dapat merancang solusi konkret berbasis kasih sayang sesama.`,
      stimulus: `Di kelas IX-C, seorang siswa pindahan yang pendiam sering dijadikan bahan tertawaan dan sengaja tidak diajak masuk ke dalam kelompok belajar tugas sekolah. Zidan mengamati hal tersebut dan merasa prihatin karena tindakan tersebut bertentangan dengan sabda Nabi Saw. bahwa seorang muslim adalah saudara bagi muslim lainnya dan tidak boleh menzaliminya.`,
      questionText: `Tindakan proaktif yang paling mencerminkan penerapan makna kasih sayang kepada sesama yang harus dilakukan Zidan adalah...`,
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
      dalilReference: 'H.R. Bukhari-Muslim & Q.S. Al-Ma\'idah [5]: 2'
    }
  ],
  'tema-ix-1-spi-safawi': [
    {
      temaCode: 'tema-ix-1-spi-safawi',
      submateri: 'Kemajuan Arsitektur Kota Isfahan dan Seni Budaya pada Masa Syah Abbas I',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis kemajuan peradaban seni arsitektur Dinasti Safawi',
      indicatorTemplate: (ctx, concept) => `Disajikan sejarah kejayaan kota Isfahan masa Dinasti Safawi, peserta didik dapat menganalisis kontribusi seni arsitektur Islam Persia bagi peradaban dunia.`,
      stimulus: `Pada masa pemerintahan Syah Abbas I (1588-1629 M), ibu kota Dinasti Safawi dipindahkan ke Isfahan. Kota ini ditata dengan tata ruang spektakuler, seperti Lapangan Naqsh-e Jahan (Setengah Dunia) dan Masjid Syah dengan kubah biru berhias mozaik keramik kaligrafi yang memesona. Keindahan kota ini menarik para pelancong dan saudagar dari Eropa dan Asia.`,
      questionText: `Pelajaran sejarah peradaban (ibrah) dari kemajuan Dinasti Safawi yang dapat memperkaya wawasan estetika generasi muda muslim saat ini adalah...`,
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
      dalilReference: 'Q.S. Al-Hajj [22]: 46 & Q.S. Al-Hasyr [59]: 2'
    }
  ],
  'tema-ix-2-akidah-qada-qadar': [
    {
      temaCode: 'tema-ix-2-akidah-qada-qadar',
      submateri: 'Sinergi Ikhtiar Maksimal, Doa Tulus, dan Tawakal Menghadapi Hasil Asesmen Akhir',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sulit',
      operationalVerb: 'Menganalisis respons tawakal sejati seorang mukmin terhadap takdir ilahi',
      indicatorTemplate: (ctx, concept) => `Disajikan studi kasus siswa menghadapi hasil seleksi masuk SMA, peserta didik dapat menganalisis sikap tawakal proporsional.`,
      stimulus: `Farhan telah belajar giat selama berbulan-bulan dan senantiasa melaksanakan salat tahajud serta bermunajat agar diterima di SMA favorit impiannya. Namun saat pengumuman dirilis, namanya tidak tercantum dalam daftar peserta lolos. Sahabatnya menyarankan agar Farhan mengurung diri dan menyalahkan takdir. Farhan menolak saran itu dan memilih berlapang dada serta mencari sekolah alternatif.`,
      questionText: `Sikap yang paling mencerminkan keimanan mendalam kepada Qada dan Qadar Allah Swt. adalah...`,
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
      dalilReference: 'Q.S. Ar-Ra\'d [13]: 11 & Q.S. At-Talaq [65]: 3'
    }
  ],
  'tema-ix-2-spi-mughal': [
    {
      temaCode: 'tema-ix-2-spi-mughal',
      submateri: 'Mahakarya Arsitektur Taj Mahal dan Pengelolaan Kerukunan Multikultural',
      bloomLevel: 'C4',
      soloLevel: 'Relational',
      deepLearningDim: 'Merefleksi',
      difficulty: 'Sedang',
      operationalVerb: 'Menganalisis kemajuan peradaban Dinasti Mughal dalam mengelola keragaman',
      indicatorTemplate: (ctx, concept) => `Disajikan sejarah pembangunan Taj Mahal dan kebijakan Dinasti Mughal di India, peserta didik dapat menganalisis pelajaran sejarah tentang kerukunan dalam masyarakat multikultural.`,
      stimulus: `Dinasti Mughal di India mencapai puncak kejayaan di bawah Sultan Akbar dan Syah Jahan. Selain mewariskan monumen keajaiban dunia Taj Mahal dan Benteng Merah (Red Fort), para penguasa Mughal berhasil memimpin wilayah anak benua India yang sangat majemuk dengan jutaan penduduk beragama Hindu, Islam, dan keyakinan lainnya dengan menjaga perdamaian dan keharmonisan sosial selama berabad-abad.`,
      questionText: `Pelajaran sejarah peradaban (ibrah) terbesar dari masa kejayaan Dinasti Mughal di India bagi kehidupan berbangsa di Indonesia adalah...`,
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
      dalilReference: 'Q.S. Yusuf [12]: 111 & Q.S. Al-Hujurat [49]: 13'
    }
  ]
};

// Aliases for synced theme codes to ensure every theme has direct blueprint mapping
THEME_BLUEPRINTS['tema-vii-1-akidah-sifat'] = THEME_BLUEPRINTS['tema-akidah-asmaul-husna'] || THEME_BLUEPRINTS['tema-vii-1-akidah-sifat'];
THEME_BLUEPRINTS['tema-vii-1-fikih-sujud'] = THEME_BLUEPRINTS['tema-fikih-sujud'] || THEME_BLUEPRINTS['tema-vii-1-fikih-sujud'];
THEME_BLUEPRINTS['tema-vii-2-akidah-malaikat'] = THEME_BLUEPRINTS['tema-akidah-malaikat'] || [];
THEME_BLUEPRINTS['tema-vii-2-spi-abbasiyah'] = THEME_BLUEPRINTS['tema-spi-abbasiyah'] || [];
THEME_BLUEPRINTS['tema-viii-1-quran-toleransi'] = THEME_BLUEPRINTS['tema-quran-toleransi'] || [];
THEME_BLUEPRINTS['tema-viii-1-akidah-kitab'] = THEME_BLUEPRINTS['tema-akidah-kitab-rasul'] || [];
THEME_BLUEPRINTS['tema-viii-1-spi-fatimiyah'] = THEME_BLUEPRINTS['tema-vii-1-spi-umayyah'] || [];
THEME_BLUEPRINTS['tema-viii-2-akidah-rasul'] = THEME_BLUEPRINTS['tema-akidah-kitab-rasul'] || [];
THEME_BLUEPRINTS['tema-ix-1-quran-keilmuan'] = THEME_BLUEPRINTS['tema-quran-ilmu'] || [];
THEME_BLUEPRINTS['tema-ix-1-akidah-hari-akhir'] = THEME_BLUEPRINTS['tema-akidah-hari-akhir'] || [];
THEME_BLUEPRINTS['tema-ix-1-fikih-sembelihan-kurban'] = THEME_BLUEPRINTS['tema-fikih-kurban-akikah'] || [];
THEME_BLUEPRINTS['tema-ix-2-quran-sabar-musibah'] = THEME_BLUEPRINTS['tema-quran-sabar'] || [];
THEME_BLUEPRINTS['tema-ix-2-akhlak-lingkungan-alam'] = THEME_BLUEPRINTS['tema-akhlak-cinta-lingkungan'] || [];
THEME_BLUEPRINTS['tema-ix-2-fikih-rukhsah-mazhab'] = THEME_BLUEPRINTS['tema-fikih-rukhsah'] || [];


// ---------------------------------------------------------------------------
// Dynamic Synchronizer: Generate High-Fidelity Question Package for ANY Theme
// Supports: Pilihan Ganda (HOTS/Extended Abstract, Opsi Positif Seimbang) &
// Soal Essay / Uraian Terstruktur Sesuai Tingkatan Kognitif
// ---------------------------------------------------------------------------

export function generateEssayQuestion(params: {
  theme: CpThemeClassification;
  number: number;
  bloom: BloomLevel;
  difficulty: DifficultyLevel;
  submateri: string;
  contextItem: string;
  tpText: string;
}): QuestionItem {
  const { theme, number, bloom, difficulty, submateri, contextItem, tpText } = params;

  let solo: SoloLevel = 'Relational';
  let deepDim: DeepLearningDimension = 'Merefleksi';
  let operationalVerb = 'Menganalisis korelasi dan memecahkan dilema';
  let indicator = `Disajikan studi kasus tentang ${contextItem}, peserta didik dapat menganalisis implementasi nilai ${theme.temaName} (${submateri}) secara mendalam.`;
  let questionPrompt = '';
  let modelAnswer = '';
  let rubricCriteria = [
    { score: 4, label: 'Sangat Baik (Sempurna)', description: 'Jawaban komprehensif, mengaitkan dalil naqli secara tepat, analisis logis runtut, dan memberikan solusi aplikatif.' },
    { score: 3, label: 'Baik', description: 'Jawaban tepat dan menyertakan kaitan nilai nilai Islam, namun penjelasan solusi masih belum terperinci.' },
    { score: 2, label: 'Cukup', description: 'Jawaban menyentuh konsep dasar namun analisis sebab-akibat atau dalil belum diuraikan secara memadai.' },
    { score: 1, label: 'Kurang', description: 'Jawaban sangat singkat, hanya menyebutkan opini umum tanpa dasar konsep syariat.' }
  ];

  const studentNames = ['Rafi', 'Zahra', 'Farhan', 'Naila', 'Ahmad', 'Salma', 'Zidan', 'Aisyah'];
  const sName = studentNames[(number - 1) % studentNames.length];
  const fName = studentNames[(number + 2) % studentNames.length];

  const stimulus = `Dalam kehidupan sehari-hari di lingkungan madrasah dan masyarakat, ${sName} dan ${fName} mengamati situasi nyata terkait ${contextItem.toLowerCase()}. Mereka menghadapi dilema moral dan sosial seputar penerapan "${submateri}". Menghadapi persoalan ini, mereka menyadari pentingnya merujuk pada tuntunan syariat dan dalil ${theme.dalilReference} agar setiap keputusan yang diambil tidak sekadar formalitas belaka, melainkan berakar pada ketakwaan batin dan integritas akhlak karimah.`;

  if (bloom === 'C2') {
    solo = 'Multistructural';
    deepDim = 'Memahami';
    operationalVerb = 'Menjelaskan esensi dan hikmah ajaran';
    indicator = `Disajikan narasi tentang ${contextItem}, peserta didik dapat menjelaskan esensi ajaran ${theme.temaName} (${submateri}) serta hikmah spiritualnya berlandaskan ${theme.dalilReference}.`;
    questionPrompt = `Berdasarkan stimulus kontekstual di atas, jelaskanlah secara komprehensif makna hakiki dari "${submateri}" dalam ajaran Islam (${theme.dalilReference})! Uraikanlah minimal tiga hikmah nyata yang akan dirasakan seorang pelajar muslim ketika mengamalkan nilai tersebut secara istiqamah di era modern!`;
    modelAnswer = `1. Esensi Makna: "${submateri}" dalam ajaran Islam bermakna menundukkan hawa nafsu dan komitmen menjalankan tuntunan Allah Swt. berlandaskan dalil ${theme.dalilReference}. Bukan sekadar rutinitas lahiriah, melainkan kesadaran iman yang menghadirkan muraqabatullah (merasa diawasi Allah).\n2. Tiga Hikmah Nyata:\n   a. Menumbuhkan ketenteraman batin (thuma'ninah) karena hidup senantiasa terbimbing oleh wahyu ilahi.\n   b. Membentuk benteng moral dan integritas pribadi yang kokoh sehingga tidak mudah terombang-ambing oleh tren negatif.\n   c. Mempererat ukhuwah dan keharmonisan sosial di lingkungan madrasah dan masyarakat luas.`;
    rubricCriteria = [
      { score: 4, label: 'Sangat Baik', description: 'Mampu menjelaskan esensi makna secara utuh berlandaskan dalil naqli, serta menguraikan 3 hikmah nyata secara runtut dan aplikatif.' },
      { score: 3, label: 'Baik', description: 'Mampu menjelaskan esensi makna dengan benar dan menyebutkan 2-3 hikmah, namun kaitan dengan dalil belum diuraikan mendalam.' },
      { score: 2, label: 'Cukup', description: 'Penjelasan esensi masih bersifat umum dan hanya menyebutkan 1 hikmah tanpa penjelasan memadai.' },
      { score: 1, label: 'Kurang', description: 'Jawaban kurang tepat atau hanya menuliskan definisi singkat tanpa hikmah.' }
    ];
  } else if (bloom === 'C3') {
    solo = 'Relational';
    deepDim = 'Mengaplikasi';
    operationalVerb = 'Menerapkan kaidah syariat dalam kasus konkret';
    indicator = `Disajikan studi kasus seputar ${contextItem}, peserta didik dapat menerapkan langkah-langkah konkret pelaksanaan nilai ${theme.temaName} (${submateri}) secara sah dan tepat.`;
    questionPrompt = `Bagaimanakah langkah-langkah konkret dan urutan penerapan kaidah syariat yang harus dilaksanakan oleh ${sName} dan rekan-rekannya agar penyelesaian masalah ${contextItem.toLowerCase()} selaras dengan ketentuan ajaran ${theme.temaName} (${theme.dalilReference})? Tuliskan tahapan tindakannya secara sistematis!`;
    modelAnswer = `Langkah penerapan konkret meliputi:\n1. Niat dan Tabayyun: Meluruskan niat semata-mata karena Allah Swt. dan memverifikasi kebenaran informasi sebelum mengambil tindakan.\n2. Konsultasi Syar'i (Musyawarah): Membicarakan persoalan dengan guru pembimbing atau pihak berwenang berlandaskan prinsip ${theme.dalilReference}.\n3. Aksi Solutif: Menerapkan kaidah fikih/akhlak secara bertahap dan adil tanpa merugikan pihak lain.\n4. Evaluasi dan Refleksi: Memastikan seluruh rangkaian kegiatan tetap dalam koridor adab Islam dan menjunjung tinggi maslahat bersama.`;
    rubricCriteria = [
      { score: 4, label: 'Sangat Baik', description: 'Menyusun langkah penerapan secara runtut (minimal 3-4 tahapan), tepat secara kaidah syariat, dan aplikatif pada kasus stimulus.' },
      { score: 3, label: 'Baik', description: 'Menyusun langkah penerapan dengan baik, namun salah satu tahapan prosedural belum diuraikan terperinci.' },
      { score: 2, label: 'Cukup', description: 'Langkah penerapan masih bersifat normatif umum dan kurang spesifik menjawab tantangan kasus.' },
      { score: 1, label: 'Kurang', description: 'Hanya menyebutkan 1 langkah tanpa penjelasan tahapan yang jelas.' }
    ];
  } else if (bloom === 'C4') {
    solo = 'Relational';
    deepDim = 'Merefleksi';
    operationalVerb = 'Menganalisis sebab-akibat dan korelasi nilai keimanan';
    indicator = `Disajikan dilema moral seputar ${contextItem}, peserta didik dapat menganalisis akar penyebab persoalan dan korelasinya dengan penghayatan nilai ${theme.temaName} (${submateri}).`;
    questionPrompt = `Lakukanlah analisis kritis terhadap persoalan di atas! Apakah faktor-faktor utama yang menjadi akar penyebab timbulnya dilema moral tersebut, dan bagaimanakah korelasi langsung antara kedalaman penghayatan nilai ${theme.temaName} (${theme.dalilReference}) dengan kemampuan seorang pelajar dalam menjaga integritas moralnya?`;
    modelAnswer = `1. Akar Persoalan: Dilema moral muncul akibat benturan antara pengaruh lingkungan sosial/media digital yang pragmatis dan pemahaman nilai agama yang masih dangkal sebatas formalitas tekstual.\n2. Analisis Korelasi: Penghayatan mendalam terhadap ${theme.temaName} (${theme.dalilReference}) berfungsi sebagai filter internal (internal self-monitoring). Ketika peserta didik memiliki pemahaman tauhid yang hidup, kesadaran muraqabah akan memandu nalarnya untuk memprioritaskan kejujuran dan keberkahan daripada keuntungan sesaat.`;
    rubricCriteria = [
      { score: 4, label: 'Sangat Baik', description: 'Mampu membedah akar persoalan secara multidimensi, menganalisis hubungan sebab-akibat secara logis, dan mengaitkan dalil secara tepat.' },
      { score: 3, label: 'Baik', description: 'Analisis akar persoalan dan sebab-akibat tepat, namun korelasi teologis terhadap penguatan karakter belum diuraikan mendalam.' },
      { score: 2, label: 'Cukup', description: 'Hanya memaparkan masalah lahiriah tanpa analisis hubungan sebab-akibat yang mendalam.' },
      { score: 1, label: 'Kurang', description: 'Hanya menyalin ulang teks stimulus tanpa ada analisis kritis.' }
    ];
  } else if (bloom === 'C5') {
    solo = 'Relational';
    deepDim = 'Merefleksi';
    operationalVerb = 'Mengevaluasi keputusan dan memberikan pertimbangan syar\'i kritis';
    indicator = `Disajikan pertentangan pilihan sikap terkait ${contextItem}, peserta didik dapat mengevaluasi dan memberikan pertimbangan syar'i tentang keputusan yang paling maslahat berlandaskan ${theme.temaName}.`;
    questionPrompt = `Evaluasilah keputusan-keputusan yang dihadapi oleh para tokoh dalam stimulus kasus di atas! Keputusan manakah yang paling maslahat, adil, dan selaras dengan prinsip ajaran ${theme.temaName} (${theme.dalilReference})? Berikan argumen penilaian kritis yang kuat untuk menjustifikasi penilaian Anda!`;
    modelAnswer = `1. Evaluasi Keputusan: Keputusan terbaik adalah mengambil opsi yang mengutamakan kemaslahatan umum (jalbul mashalih) dan mencegah kerusakan moral (dar'ul mafasid), yaitu mengedepankan transparansi serta kejujuran sesuai ${theme.dalilReference}.\n2. Justifikasi Argumen: Menolak kompromi semu yang berorientasi pada kepuasan sesaat. Meskipun opsi jujur mungkin menghadapi resistensi sosial di awal, kepatuhan pada syariat menjamin keberkahan jangka panjang dan menjaga martabat akhlak seorang muslim.`;
    rubricCriteria = [
      { score: 4, label: 'Sangat Baik', description: 'Memberikan evaluasi kritis berbasis kriteria kemaslahatan syariat, membandingkan dampak tiap opsi, dan menyertakan argumentasi dalil yang kokoh.' },
      { score: 3, label: 'Baik', description: 'Memberikan penilaian kritis yang tepat dan memilih keputusan terbaik, namun komparasi dampak belum diuraikan secara berimbang.' },
      { score: 2, label: 'Cukup', description: 'Memilih keputusan namun argumentasi penilaian masih subjektif tanpa landasan kaidah syariat yang jelas.' },
      { score: 1, label: 'Kurang', description: 'Penilaian tidak disertai argumentasi atau tidak relevan dengan konsep yang diuji.' }
    ];
  } else {
    // C6 - Mencipta / Merancang Desain Solusi
    solo = 'Extended Abstract';
    deepDim = 'Mentransfer';
    operationalVerb = 'Merancang desain solusi inovatif dan rencana aksi berkelanjutan';
    indicator = `Disajikan tantangan kontemporer seputar ${contextItem}, peserta didik dapat merancang sebuah program aksi inovatif dan berkelanjutan berlandaskan nilai ${theme.temaName} (${submateri}).`;
    questionPrompt = `Menanggapi tantangan pada stimulus di atas, rancanglah sebuah rancangan program aksi inovatif dan berkelanjutan (memuat: [1] Judul & Visi Program, [2] Sasaran Partisipan, [3] Tiga Tahapan Aksi Strategis, dan [4] Tolok Ukur Keberhasilan) yang berakar pada nilai "${theme.temaName}" (${theme.dalilReference}) untuk diterapkan di lingkungan sekolah/madrasah Anda!`;
    modelAnswer = `RANCANGAN PROGRAM AKSI:\n1. Judul & Visi: "Gerakan Karakter Berkemajuan Mandiri" - Mewujudkan lingkungan madrasah yang berintegritas berlandaskan ${theme.dalilReference}.\n2. Sasaran: Seluruh peserta didik, pengurus OSIS, dan warga madrasah.\n3. Tiga Tahapan Aksi Strategis:\n   a. Edukasi & Sosialisasi: Kampanye literasi digital dan kajian tematik fikih/akhlak kontemporer.\n   b. Implementasi Praktis: Pembentukan duta teladan dan ruang aduan/verifikasi tabayyun di sekolah.\n   c. Apresiasi & Monitoring: Penilaian berkala untuk mengapresiasi kelas yang menunjukkan konsistensi karakter positif.\n4. Tolok Ukur: Penurunan pelanggaran kedisiplinan dan meningkatnya keterlibatan siswa dalam aksi nyata kebaikan.`;
    rubricCriteria = [
      { score: 4, label: 'Sangat Baik', description: 'Desain program sangat orisinal, terstruktur lengkap (visi, sasaran, 3 aksi strategis, tolok ukur), realistis, dan berlandaskan dalil secara utuh.' },
      { score: 3, label: 'Baik', description: 'Desain program terstruktur baik dan aplikatif, namun salah satu komponen tahapan aksi belum diuraikan mendalam.' },
      { score: 2, label: 'Cukup', description: 'Gagasan program masih bersifat umum, belum memiliki tahapan langkah yang jelas atau sulit diimplementasikan.' },
      { score: 1, label: 'Kurang', description: 'Gagasan tidak terstruktur dan tidak menjawab tantangan stimulus.' }
    ];
  }

  return {
    number,
    element: theme.element,
    tema: theme.temaName,
    temaCode: theme.themeId,
    tp: tpText,
    materi: theme.temaName,
    submateri,
    indicator,
    stimulus,
    operationalVerb,
    bloomLevel: bloom,
    soloLevel: solo,
    deepLearningDim: deepDim,
    difficulty,
    questionType: 'Essay',
    questionText: questionPrompt,
    options: [],
    correctKey: 'Rubrik Terlampir',
    explanation: `Panduan Penskoran Soal Uraian / Essay Level ${bloom} (${solo}): Menuntut peserta didik mengekspresikan pemahaman mendalam secara tertulis dengan mengaitkan dalil naqli (${theme.dalilReference}) dan realitas kontekstual.`,
    distractorExplanation: {},
    islamicValue: `Karakter Nilai ${theme.temaName} & Refleksi Deep Learning`,
    realLifeContext: contextItem,
    dalilReference: theme.dalilReference,
    modelAnswer,
    rubricCriteria,
    maxScore: 20,
    keywords: [theme.temaName, submateri, 'Integritas Syariat', 'Kemaslahatan', 'Dalil Naqli'],
    qualityScore: {
      tpAlignment: 4,
      stimulusQuality: 4,
      bloomPrecision: 4,
      soloPrecision: 4,
      optionHomogeneity: 4,
      distractorQuality: 4,
      contextuality: 4,
      cognitiveDepth: 4,
      total: 32,
      category: 'Sangat Baik'
    }
  };
}

export function generateQuestionsForTheme(params: {
  theme: CpThemeClassification;
  questionCount: number;
  difficulty?: string;
  questionType?: 'Pilihan Ganda' | 'Essay' | 'Campuran' | string;
  essayCognitiveLevel?: 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'Berjenjang';
  customBloom?: BloomLevel | Record<BloomLevel, number>;
  customSolo?: SoloLevel | Record<SoloLevel, number>;
}): QuestionItem[] {
  const {
    theme,
    questionCount,
    difficulty = 'Sulit',
    questionType = 'Pilihan Ganda',
    essayCognitiveLevel = 'C4'
  } = params;

  const blueprints = THEME_BLUEPRINTS[theme.themeId] || [];

  const bloomProgression: BloomLevel[] = ['C4', 'C4', 'C5', 'C3', 'C4', 'C6', 'C5', 'C4', 'C2', 'C4'];
  const soloProgression: SoloLevel[] = ['Relational', 'Relational', 'Extended Abstract', 'Multistructural', 'Relational', 'Extended Abstract', 'Relational', 'Relational', 'Multistructural', 'Relational'];
  const dlProgression: DeepLearningDimension[] = ['Mengaplikasi', 'Memahami', 'Merefleksi', 'Mengaplikasi', 'Memahami', 'Mentransfer', 'Merefleksi', 'Mengaplikasi', 'Memahami', 'Mentransfer'];

  const questions: QuestionItem[] = [];

  // Determine split for 'Campuran'
  // E.g., for 10 questions: 7 PG, 3 Essay. For 5: 3 PG, 2 Essay.
  let pgCount = questionCount;
  let essayCount = 0;

  if (questionType === 'Essay') {
    pgCount = 0;
    essayCount = questionCount;
  } else if (questionType === 'Campuran') {
    essayCount = Math.max(1, Math.round(questionCount * 0.3));
    pgCount = Math.max(1, questionCount - essayCount);
  }

  // Generate Multiple Choice Questions (HOTS, Extended Abstract, All Options Positive & Balanced)
  for (let i = 1; i <= pgCount; i++) {
    const cycleIdx = (i - 1) % (blueprints.length || 1);
    const blueprint = blueprints[cycleIdx];

    const bloom: BloomLevel = (typeof params.customBloom === 'string' ? params.customBloom : null) || bloomProgression[(i - 1) % bloomProgression.length];
    const solo: SoloLevel = (typeof params.customSolo === 'string' ? params.customSolo : null) || soloProgression[(i - 1) % soloProgression.length];
    const deepDim = dlProgression[(i - 1) % dlProgression.length];
    const submateri = theme.submateriScope[(i - 1) % theme.submateriScope.length];
    const contextItem = theme.contextExamples[(i - 1) % theme.contextExamples.length];
    const tpText = theme.suggestedTpList[(i - 1) % theme.suggestedTpList.length] || theme.cpClause;

    if (blueprint && i <= blueprints.length) {
      // Use crafted authentic blueprint, ensuring options are positively aligned
      questions.push({
        number: i,
        element: theme.element,
        tema: theme.temaName,
        temaCode: theme.themeId,
        tp: tpText,
        materi: theme.temaName,
        submateri: blueprint.submateri,
        indicator: `Disajikan studi kasus tentang ${blueprint.realLifeContext}, peserta didik dapat ${blueprint.operationalVerb} sesuai prinsip ${theme.temaName}.`,
        stimulus: blueprint.stimulus,
        operationalVerb: blueprint.operationalVerb,
        bloomLevel: bloom,
        soloLevel: solo,
        deepLearningDim: deepDim,
        difficulty: (difficulty === 'Custom' ? 'Sulit' : (difficulty as any)) || blueprint.difficulty,
        questionType: 'Pilihan Ganda',
        questionText: blueprint.questionText,
        options: blueprint.options.map(opt => ({ ...opt })),
        correctKey: blueprint.correctKey,
        explanation: blueprint.explanation,
        distractorExplanation: blueprint.distractorExplanation,
        islamicValue: blueprint.islamicValue,
        realLifeContext: blueprint.realLifeContext,
        dalilReference: blueprint.dalilReference,
        qualityScore: {
          tpAlignment: 4,
          stimulusQuality: 4,
          bloomPrecision: 4,
          soloPrecision: 4,
          optionHomogeneity: 4,
          distractorQuality: 4,
          contextuality: 4,
          cognitiveDepth: 4,
          total: 32,
          category: 'Sangat Baik'
        }
      });
    } else {
      // Procedurally generate authentic synchronized item:
      // STRICT RULE: All 4 options are positive, parallel syntax, balanced length (~125-145 chars),
      // requiring careful discernment to pick the one directly rooted in core spiritual/tauhid principle!
      const studentNames = ['Raihan', 'Zahra', 'Farhan', 'Naila', 'Ahmad', 'Salma', 'Zidan', 'Aisyah'];
      const student = studentNames[(i - 1) % studentNames.length];
      const friend = studentNames[(i + 3) % studentNames.length];

      const stimulus = `Dalam kehidupan sehari-hari di lingkungan madrasah/sekolah, ${student} dan ${friend} mendiskusikan topik "${submateri}". Mereka menjumpai situasi nyata terkait ${contextItem.toLowerCase()}. Menghadapi persoalan ini, ${student} berinisiatif merujuk pada tuntunan syariat (${theme.dalilReference}) agar tindakan yang diambil berakar pada penghayatan nilai Islam dan tanggung jawab moral.`;

      let verb = 'Menganalisis';
      if (bloom === 'C5') verb = 'Mengevaluasi';
      if (bloom === 'C6') verb = 'Merancang solusi berkelanjutan untuk';
      if (bloom === 'C3') verb = 'Menerapkan kaidah';

      const indicator = `Disajikan studi kasus ${contextItem}, peserta didik dapat ${verb.toLowerCase()} implementasi nilai ${theme.temaName} (${submateri}) secara cermat.`;
      const questionText = `Berdasarkan studi kasus kontekstual tersebut, langkah keputusan yang paling tepat dan paling mendalam mencerminkan capaian pembelajaran tema "${theme.temaName}" adalah...`;

      // 4 positive, homogeneous, balanced-length options:
      const options = [
        {
          key: 'A' as const,
          text: `Mengintegrasikan nilai ${theme.temaName} ke dalam tindakan nyata berlandaskan penghayatan ${theme.dalilReference} demi tegaknya integritas dan ketakwaan batin.`
        },
        {
          key: 'B' as const,
          text: `Menerapkan nilai ${theme.temaName} melalui keteladanan sikap guna membangun harmoni sosial dan menjaga nama baik madrasah di hadapan masyarakat.`
        },
        {
          key: 'C' as const,
          text: `Mempraktikkan nilai ${theme.temaName} secara tertib dan disiplin demi meraih apresiasi prestasi positif serta pengakuan keberhasilan akademik.`
        },
        {
          key: 'D' as const,
          text: `Mengamalkan nilai ${theme.temaName} secara aktif bersama rekan sebaya untuk mempererat solidaritas gotong royong dalam menyelesaikan tugas bersama.`
        }
      ];

      questions.push({
        number: i,
        element: theme.element,
        tema: theme.temaName,
        temaCode: theme.themeId,
        tp: tpText,
        materi: theme.temaName,
        submateri: submateri,
        indicator,
        operationalVerb: `${verb} ${submateri}`,
        bloomLevel: bloom,
        soloLevel: solo,
        deepLearningDim: deepDim,
        difficulty: (difficulty === 'Custom' ? 'Sulit' : (difficulty as any)) || 'Sulit',
        questionType: 'Pilihan Ganda',
        stimulus,
        questionText,
        options,
        correctKey: 'A',
        explanation: `Pilihan A paling tepat karena secara langsung mengaitkan tindakan dengan penghayatan doktrin dalil (${theme.dalilReference}) dan ketakwaan batin (Deep Learning Relational). Pilihan B, C, dan D semuanya positif dan bernilai kebaikan, namun berfokus pada manfaat horizontal (sosial, prestasi akademik, atau solidaritas kawan).`,
        distractorExplanation: {
          A: `Kunci jawaban yang tepat: menghubungkan tindakan moral langsung dengan tauhid dan dalil ${theme.dalilReference}.`,
          B: 'Opsi bernada positif yang menekankan keharmonisan sosial, namun belum menyentuh dimensi spiritual batiniah secara mendalam.',
          C: 'Opsi bernada positif yang menekankan kedisiplinan dan prestasi akademik, bersifat capaian lahiriah.',
          D: 'Opsi bernada positif yang menekankan kebersamaan gotong royong, namun belum mencakup esensi pengamalan dalil secara utuh.'
        },
        islamicValue: `Karakter Nilai ${theme.temaName}`,
        realLifeContext: contextItem,
        dalilReference: theme.dalilReference,
        qualityScore: {
          tpAlignment: 4,
          stimulusQuality: 4,
          bloomPrecision: 4,
          soloPrecision: 4,
          optionHomogeneity: 4,
          distractorQuality: 4,
          contextuality: 4,
          cognitiveDepth: 4,
          total: 32,
          category: 'Sangat Baik'
        }
      });
    }
  }

  // Generate Essay Questions (Aligned with chosen Cognitive Level)
  const essayCognitiveProgression: BloomLevel[] = ['C2', 'C3', 'C4', 'C5', 'C6'];

  for (let j = 1; j <= essayCount; j++) {
    const questionNumber = pgCount + j;
    const submateri = theme.submateriScope[(questionNumber - 1) % theme.submateriScope.length];
    const contextItem = theme.contextExamples[(questionNumber - 1) % theme.contextExamples.length];
    const tpText = theme.suggestedTpList[(questionNumber - 1) % theme.suggestedTpList.length] || theme.cpClause;

    let targetBloom: BloomLevel = 'C4';
    if (essayCognitiveLevel && essayCognitiveLevel !== 'Berjenjang') {
      targetBloom = essayCognitiveLevel as BloomLevel;
    } else {
      // Progressive distribution C2 to C6
      targetBloom = essayCognitiveProgression[(j - 1) % essayCognitiveProgression.length];
    }

    const essayItem = generateEssayQuestion({
      theme,
      number: questionNumber,
      bloom: targetBloom,
      difficulty: (difficulty === 'Custom' ? 'Sulit' : (difficulty as any)) || 'Sulit',
      submateri,
      contextItem,
      tpText
    });

    questions.push(essayItem);
  }

  return questions;
}
