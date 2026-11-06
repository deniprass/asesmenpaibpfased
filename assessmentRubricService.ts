import {
  CurriculumTopic
} from '../data/curriculumData';
import {
  PaibpElement,
  GradeLevel,
  Semester,
  HolisticTpAssessmentGuide,
  RubricAspect,
  DiagnosticAssessmentItem,
  FormativeAssessmentItem,
  SummativeAssessmentSpec,
  AuthenticP5ppraProject
} from '../types';

/**
 * PEDOMAN SPESIFIK 5 ELEMEN PAIBP SESUAI KETENTUAN RESMI
 */
export const ELEMENT_ASSESSMENT_SPECS: Record<
  string,
  {
    elementName: PaibpElement;
    scopeSummary: string;
    keySkillsToAssess: string[];
    defaultCognitiveFocus: string;
    defaultAffectiveFocus: string;
    defaultPsychomotorFocus: string;
  }
> = {
  "Al-Qur'an Hadis": {
    elementName: "Al-Qur'an Hadis",
    scopeSummary:
      "Kemampuan membaca tartil dengan tajwid, menulis ayat dengan kaidah imla, menghafal dalil, menganalisis arti & asbabun nuzul, serta menerapkan kandungan ayat dan hadis dalam kehidupan sehari-hari.",
    keySkillsToAssess: [
      "Membaca ayat dengan fasih sesuai kaidah tajwid dan makharijul huruf",
      "Menulis penggalan ayat dan hadis secara benar dan rapi",
      "Menghafal ayat pilihan beserta artinya secara mutqin",
      "Menganalisis pesan pokok, keterkaitan ayat, dan asbabun nuzul",
      "Menerapkan ajaran Al-Qur'an dan Hadis dalam etika bermasyarakat dan digital"
    ],
    defaultCognitiveFocus: "Pemahaman tafsir ayat, hafalan lafal dalil dan terjemahan, serta penalaran kritis asbabun nuzul.",
    defaultAffectiveFocus: "Kecintaan pada Al-Qur'an, adab membaca kalamullah, sikap toleran dan moderat berlandaskan dalil.",
    defaultPsychomotorFocus: "Keterampilan membaca tartil (tajwid/makhraj), keterampilan kaligrafi/menulis ayat, dan unjuk kerja hafalan (tahfiz)."
  },
  "Al-Qur'an dan Hadis": {
    elementName: "Al-Qur'an dan Hadis",
    scopeSummary:
      "Kemampuan membaca tartil dengan tajwid, menulis ayat dengan kaidah imla, menghafal dalil, menganalisis arti & asbabun nuzul, serta menerapkan kandungan ayat dan hadis dalam kehidupan sehari-hari.",
    keySkillsToAssess: [
      "Membaca ayat dengan fasih sesuai kaidah tajwid dan makharijul huruf",
      "Menulis penggalan ayat dan hadis secara benar dan rapi",
      "Menghafal ayat pilihan beserta artinya secara mutqin",
      "Menganalisis pesan pokok, keterkaitan ayat, dan asbabun nuzul",
      "Menerapkan ajaran Al-Qur'an dan Hadis dalam etika bermasyarakat dan digital"
    ],
    defaultCognitiveFocus: "Pemahaman tafsir ayat, hafalan lafal dalil dan terjemahan, serta penalaran kritis asbabun nuzul.",
    defaultAffectiveFocus: "Kecintaan pada Al-Qur'an, adab membaca kalamullah, sikap toleran dan moderat berlandaskan dalil.",
    defaultPsychomotorFocus: "Keterampilan membaca tartil (tajwid/makhraj), keterampilan kaligrafi/menulis ayat, dan unjuk kerja hafalan (tahfiz)."
  },
  "Akidah": {
    elementName: "Akidah",
    scopeSummary:
      "Pemahaman dan keyakinan mendalam terhadap rukun iman, sifat-sifat Allah Swt., ketauhidan murni, serta benteng diri dari syirik, khurafat, dan tahayul di era modern.",
    keySkillsToAssess: [
      "Memahami esensi dan cabang rukun iman dengan dalil aqli dan naqli",
      "Menganalisis hikmah keimanan terhadap perilaku dan ketenangan batin",
      "Mengidentifikasi bahaya perilaku syirik, takhayul, dan keraguan iman",
      "Merefleksikan ketauhidan dalam ketundukan beribadah dan akhlak tauhid",
      "Meneguhkan keyakinan dalam menghadapi tantangan materialisme dan ateisme terselubung"
    ],
    defaultCognitiveFocus: "Pemahaman rukun iman, sifat Allah, dalil naqli/aqli, dan analisis pemikiran kritis terhadap akidah yang lurus.",
    defaultAffectiveFocus: "Integritas iman, tawakal, keikhlasan niat semata karena Allah Swt., serta keteguhan prinsip di lingkungan pergaulan.",
    defaultPsychomotorFocus: "Demonstrasi ikrar keimanan, penyusunan pohon iman (mind map dalil), dan unjuk kerja presentasi pembuktian dalil naqli."
  },
  "Akhlak": {
    elementName: "Akhlak",
    scopeSummary:
      "Evaluasi pembiasaan moral terpuji (akhlak mahmudah) kepada Allah SWT, diri sendiri, sesama manusia (toleransi, husnuzan, kasih sayang, persaudaraan), serta lingkungan alam (eco-Islamic).",
    keySkillsToAssess: [
      "Menerapkan akhlak mulia kepada Allah Swt. (syukur, ikhlas, taubat, doa)",
      "Membiasakan akhlak kepada diri sendiri (percaya diri, jujur, disiplin, mawas diri)",
      "Menerapkan etika pergaulan sesama (husnuzan, toleransi, empati, pemaaf, silaturahmi)",
      "Melakukan tindakan pelestarian dan kasih sayang kepada alam dan satwa",
      "Menjaga adab bermedia sosial (tabayyun, anti-hoaks, kesantunan bertutur kata)"
    ],
    defaultCognitiveFocus: "Penguasaan konsep nilai akhlak, dalil perintah berakhlak mulia, dan analisis dilema moral etika pergaulan kontemporer.",
    defaultAffectiveFocus: "Penghayatan empati, kejujuran batin, toleransi antar sesama, kesabaran dalam menghadapi cobaan, dan adab santun harian.",
    defaultPsychomotorFocus: "Unjuk kerja bermain peran (role-playing), aksi nyata peduli lingkungan/sosial, dan pembuatan karya advokasi etika digital."
  },
  "Fikih": {
    elementName: "Fikih",
    scopeSummary:
      "Pemahaman dan praktik tata cara hukum Islam, baik ibadah mahdhah (shalat, sujud, jenazah, zakat, haji/umrah, kurban) maupun muamalah dan prinsip rukhsah (kemudahan beribadah).",
    keySkillsToAssess: [
      "Menganalisis syarat, rukun, dan ketentuan syariat dalam ibadah",
      "Mempraktikkan tata cara sujud (syukur, sahwi, tilawah) dan salat dengan benar",
      "Mendemonstrasikan prosedur penyelenggaraan jenazah secara runtut",
      "Menelaah hikmah rukhsah (keringanan) dalam perspektif mazhab fikih",
      "Menerapkan etika muamalah Islam yang adil dan menjauhi riba/penipuan"
    ],
    defaultCognitiveFocus: "Pemahaman hukum fikih, ketentuan rukun dan syarat sah, dalil pensyariatan, serta perbandingan pendapat ulama muktabar.",
    defaultAffectiveFocus: "Kedisiplinan waktu sholat fardu, keikhlasan dalam berkorban/zakat, kesungguhan mematuhi syariat, dan sikap tasamuh dalam perbedaan khilafiyah.",
    defaultPsychomotorFocus: "Praktik langsung tata cara ibadah (simulasi sujud, praktik manasik haji/umrah, peragaan tata cara tajhiz jenazah, dsb.)."
  },
  "Sejarah Peradaban Islam": {
    elementName: "Sejarah Peradaban Islam",
    scopeSummary:
      "Pemahaman kisah teladan Nabi, Khulafaur Rasyidin, dan perkembangan dinasti Islam (Umayyah, Abbasiyah, Fatimiyah, Turki Usmani, Safawi, Mughal) serta pengambilan ibrah bagi kemajuan peradaban masa kini.",
    keySkillsToAssess: [
      "Menganalisis kronologi peristiwa penting dan tokoh pembaharu peradaban Islam",
      "Mengidentifikasi kemajuan ilmu pengetahuan, seni, dan tata kelola pemerintahan dinasti Islam",
      "Menarik ibrah dan pelajaran kepemimpinan dari masa kejayaan dan kemunduran peradaban",
      "Menghubungkan semangat saintifik ilmuwan muslim masa lalu dengan era teknologi masa kini",
      "Menumbuhkan kebanggaan (izzah) terhadap kontribusi Islam bagi sains dan peradaban dunia"
    ],
    defaultCognitiveFocus: "Analisis faktor kejayaan dan keruntuhan dinasti, pengetahuan tokoh dan ilmuwan Islam, serta pemikiran kritis terhadap alur sejarah.",
    defaultAffectiveFocus: "Apresiasi terhadap ilmu pengetahuan, sikap inklusif dan apresiatif terhadap khazanah budaya, serta spirit pantang menyerah.",
    defaultPsychomotorFocus: "Unjuk kerja presentasi tokoh ilmuwan, pembuatan lini masa peradaban (timeline infografis), dan penyusunan esai telaah sejarah."
  }
};

/**
 * GENERATOR PANDUAN DAN RUBRIK ASESMEN LENGKAP HOLISTIK
 */
export function generateHolisticAssessmentGuide(
  topic: CurriculumTopic,
  customTp?: string
): HolisticTpAssessmentGuide {
  const tp = customTp || topic.suggestedTpList[0] || `Peserta didik mampu menganalisis dan menerapkan ${topic.materi}`;
  const elementKey = topic.element.includes("Qur'an") ? "Al-Qur'an Hadis" : topic.element;
  const elementSpecs = ELEMENT_ASSESSMENT_SPECS[elementKey] || ELEMENT_ASSESSMENT_SPECS["Akidah"];

  // 1. TIGA RANAH TAKSONOMI LENGKAP
  const cognitiveRubrics: RubricAspect[] = [
    {
      aspectName: "Pemahaman Konsep Keagamaan",
      domain: "kognitif",
      description: `Kemampuan menguasai hakikat makna, hukum, dan konsep esensial materi "${topic.materi}".`,
      weight: 35,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Menguraikan konsep ajaran Islam secara komprehensif, tepat, mendalam, dan mampu mengaitkannya dengan fenomena nyata secara ilmiah dan syar'i."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Menjelaskan konsep keagamaan dengan benar dan runtut, serta memberikan contoh relevan dalam kehidupan sehari-hari."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Memahami sebagian besar konsep, namun masih membutuhkan penegasan pada beberapa istilah atau detail kaidah fikih/akidah."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Belum menguasai konsep dasar materi secara utuh dan mengalami kerancuan pemahaman yang memerlukan remedial terarah."
        }
      ]
    },
    {
      aspectName: "Hafalan & Penguasaan Dalil",
      domain: "kognitif",
      description: `Ketepatan menyebutkan atau merujuk dalil naqli (${topic.dalilReference}) beserta terjemahannya.`,
      weight: 30,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Mampu melafalkan/menuliskan dalil Al-Qur'an/Hadis secara mutqin, fasih, lengkap dengan terjemahan dan penjelasan pesan intinya."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Mengetahui dalil rujukan dan terjemahannya dengan baik serta mampu menyebutkan korelasi dalil terhadap materi."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Mengenal bunyi dalil secara umum dan memahami garis besar terjemahannya dengan sedikit bantuan pengingat."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Belum mampu mengidentifikasi dalil naqli rujukan dan memerlukan bimbingan muroja'ah berkala."
        }
      ]
    },
    {
      aspectName: "Pemikiran Kritis & Penalaran Analitis (HOTS)",
      domain: "kognitif",
      description: "Kemampuan menelaah studi kasus, mengkritisi isu kontemporer, dan mengambil kesimpulan hukum/hikmah secara logis dan Islami.",
      weight: 35,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Mampu memecahkan masalah kontekstual yang rumit, memberikan argumen berbasis nilai Islam yang kokoh, dan merumuskan solusi inovatif."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Mampu menganalisis sebab-akibat suatu kasus moral/fikih dan memberikan solusi alternatif yang sesuai syariat."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Mampu menjawab pertanyaan analitis sederhana namun analisisnya masih dangkal dan terbatas pada tekstual."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Kesulitan mengaitkan konsep dengan masalah nyata dan hanya mampu menghafal tanpa daya nalar analitis."
        }
      ]
    }
  ];

  const affectiveRubrics: RubricAspect[] = [
    {
      aspectName: "Penghayatan Nilai & Akhlak Mulia (Spiritual & Sosial)",
      domain: "afektif",
      description: "Manifestasi sikap jujur, disiplin, tawadhu, amanah, serta rasa takut berbuat dosa dalam kehidupan di kelas maupun di luar kelas.",
      weight: 30,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Konsisten menjadi teladan dalam kejujuran, integritas, kesopanan bertutur kata, serta selalu memancarkan akhlak karimah tanpa perlu diawasi."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Menunjukkan perilaku santun, bertanggung jawab atas tugasnya, dan memiliki integritas moral yang baik dalam pergaulan."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Berperilaku baik dalam kondisi umum, namun terkadang masih perlu diingatkan terkait kedisiplinan dan tata krama."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Sering melanggar tata tertib atau menunjukkan sikap kurang terpuji sehingga membutuhkan bimbingan konseling dan pendampingan wali kelas."
        }
      ]
    },
    {
      aspectName: "Sikap Moderat & Toleransi (Tawassuth & Tasamuh)",
      domain: "afektif",
      description: "Sikap menghargai perbedaan, berpikiran terbuka, anti-kekerasan, tidak mudah mengkafirkan (takfiri), dan bersahabat dengan sesama.",
      weight: 25,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Sangat aktif mempromosikan perdamaian, menghormati perbedaan pendapat/khilafiyah fikih dan suku/agama, serta menjadi jembatan solusi damai."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Menghargai keragaman latar belakang teman, mampu bekerja sama dengan siapa saja, dan tidak memaksakan kehendak."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Bersedia bekerja sama dalam kelompok multikultural namun masih menunjukkan sikap pasif atau canggung terhadap perbedaan."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Menunjukkan sikap fanatisme sempit, eksklusif, atau meremehkan orang lain, memerlukan pembiasaan wawasan moderasi beragama."
        }
      ]
    },
    {
      aspectName: "Presensi Sholat 5 Waktu & Mutaba'ah Yaumiyah",
      domain: "afektif",
      description: "Kedisiplinan melaksanakan sholat fardu 5 waktu, sholat dhuha/tahajud, dan ibadah harian yang dicatat dalam buku mutaba'ah.",
      weight: 25,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Tertib melaksanakan sholat 5 waktu tepat waktu (terbiasa berjamaah di masjid/mushola sekolah) dan rajin mencatat mutaba'ah yaumiyah secara jujur."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Menjaga sholat 5 waktu dengan baik, bersegera menuju mushola saat azan berkumandang, dan aktif mengikuti sholat berjamaah."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Melaksanakan sholat 5 waktu namun terkadang terlambat atau masih membutuhkan dorongan dan pengingat dari guru/orang tua."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Masih sering melalaikan sholat fardu dan membutuhkan program pembinaan sholat khusus bersama guru PAI."
        }
      ]
    },
    {
      aspectName: "Keaktifan dalam Pembelajaran & Kolaborasi",
      domain: "afektif",
      description: "Partisipasi aktif dalam tanya-jawab, diskusi kelompok, gotong royong memecahkan tugas, dan adab menyimak guru.",
      weight: 20,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Antusias mengajukan pertanyaan kritis, berkontribusi aktif memimpin diskusi kelompok, dan sigap membantu rekan yang kesulitan belajar."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Responsif dalam pembelajaran, aktif menyumbang ide saat diskusi, dan menyelesaikan tanggung jawab kelompok dengan baik."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Mengikuti alur pembelajaran dengan tenang namun jarang berbicara atau berinisiatif mengajukan pendapat mandiri."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Pasif, mudah terdistraksi di kelas, dan sering mengandalkan pekerjaan teman sekelompok."
        }
      ]
    }
  ];

  const psychomotorRubrics: RubricAspect[] = [
    {
      aspectName: "Keterampilan Teknis & Praktik Ibadah / Tajwid",
      domain: "psikomotorik",
      description: `Kecakapan motorik dalam mempraktikkan gerakan/bacaan ibadah sesuai syariat atau membaca Al-Qur'an dengan tartil.`,
      weight: 40,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Gerakan dan bacaan sangat sempurna, tartil tanpa cela, thuma'ninah, dan mampu membimbing teman sebaya dalam praktik teknis."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Mempraktikkan rukun gerakan dan bacaan dengan runtut, lancar, dan memenuhi seluruh kriteria sah syariat."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Dapat melakukan praktik ibadah secara garis besar namun masih ada sedikit keraguan atau kekeliruan kecil pada kesempurnaan sunah."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Belum hafal urutan gerakan atau bacaan wajib ibadah, memerlukan drill praktik terbimbing."
        }
      ]
    },
    {
      aspectName: "Unjuk Kerja & Demonstrasi Kinerja (Performance)",
      domain: "psikomotorik",
      description: "Kemampuan mendemonstrasikan pemecahan masalah, presentasi hasil karya, berorasi hikmah, atau simulasi peran sosial Islami.",
      weight: 30,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Presentasi sangat meyakinkan, artikulatif, ekspresif, menguasai panggung, dan mampu menjawab sanggahan audiens dengan lugas dan santun."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Penyampaian terstruktur, percaya diri, menggunakan media visual pendukung dengan baik, dan materi tersampaikan secara jelas."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Menyampaikan presentasi dengan membaca teks, intonasi datar, namun isi pesan pokok masih dapat dipahami audiens."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Gugup, tidak menguasai alur unjuk kerja, atau menolak tampil di depan kelas karena kurang persiapan."
        }
      ]
    },
    {
      aspectName: "Produk & Portofolio Proyek Dakwah Digital / Sosial",
      domain: "psikomotorik",
      description: "Kualitas karya fisik atau digital (infografis dakwah, video kampanye akhlak, laporan aksi sosial, kaligrafi, naskah refleksi).",
      weight: 30,
      levels: [
        {
          level: "Sangat Mahir",
          scoreRange: "91-100",
          descriptor: "Karya orisinal, estetis tinggi, konten sarat pesan edukasi islami yang memikat, rapi, dan siap dipublikasikan di kanal sekolah/media."
        },
        {
          level: "Mahir",
          scoreRange: "80-90",
          descriptor: "Karya menarik, pesan ajaran Islam tersampaikan dengan lugas, desain rapi, dan memenuhi seluruh kriteria penugasan."
        },
        {
          level: "Cukup",
          scoreRange: "70-79",
          descriptor: "Produk selesai tepat waktu namun tata letak atau kedalaman pesan masih standar dan membutuhkan sentuhan estetika."
        },
        {
          level: "Perlu Bimbingan",
          scoreRange: "< 70",
          descriptor: "Karya tidak selesai sesuai batas waktu atau menjiplak tanpa modifikasi kreatif."
        }
      ]
    }
  ];

  // 2. EMPAT PENDEKATAN ASESMEN KURIKULUM MERDEKA

  // A. Asesmen Diagnostik (Awal)
  const diagnosticItems: DiagnosticAssessmentItem[] = [
    {
      id: "diag-01",
      targetAspect: "Kesiapan Religius (BTQ & Sholat)",
      questionPrompt: `Bagaimanakah kelancaran membaca Al-Qur'an (makharijul huruf & tajwid) serta kedisiplinan sholat fardu terkait materi "${topic.materi}"?`,
      diagnosticCriteria: {
        ready: "Peserta didik sudah lancar membaca Al-Qur'an ber-tajwid dan terbiasa melaksanakan sholat fardu secara tertib.",
        needsSupport: "Peserta didik masih terbata-bata mengeja huruf hijaiyah atau belum tertib sholat 5 waktu."
      },
      remedialFollowUp: "Diberikan pendampingan tutor sebaya dalam kelompok talaqqi dan lembar kartu pantau sholat khusus."
    },
    {
      id: "diag-02",
      targetAspect: "Kemampuan Konseptual Awal",
      questionPrompt: `Uji pemahaman dasar: Apa yang kamu ketahui tentang makna inti dari "${topic.tema}" dan mengapa hal ini penting bagi seorang muslim?`,
      diagnosticCriteria: {
        ready: "Mampu menjelaskan gambaran umum konsep dan menyebutkan contoh konkret dalam kehidupan.",
        needsSupport: "Belum pernah mendengar atau keliru mengartikan istilah mendasar materi."
      },
      remedialFollowUp: "Disediakan video pengantar interaktif berdurasi singkat dan glosarium istilah keagamaan sebelum materi inti dimulai."
    },
    {
      id: "diag-03",
      targetAspect: "Gaya Belajar & Minat",
      questionPrompt: "Melalui media apa kamu lebih mudah memahami materi agama: video narasi/visual, mendengarkan ceramah/diskusi, atau praktik/bermain peran langsung?",
      diagnosticCriteria: {
        ready: "Mengenali preferensi belajar mandiri (Visual, Auditori, atau Kinestetik) dan siap bekerja dalam tim.",
        needsSupport: "Belum mengetahui gaya belajar diri dan cenderung mudah bosan saat pembelajaran ceramah panjang."
      },
      remedialFollowUp: "Guru menerapkan pembelajaran berdiferensiasi konten dan produk (infografis visual, podcast audio, dan drama kinestetik)."
    }
  ];

  // B. Asesmen Formatif (Proses)
  const formativeItems: FormativeAssessmentItem[] = [
    {
      id: "form-01",
      activityType: "Cek Pemahaman (LKPD/Kuis)",
      focusSkill: `Menelaah dalil naqli (${topic.dalilReference}) dan memecahkan dilema kasus harian`,
      feedbackMethod: "Umpan balik langsung lisan (constructive feedback) dan review bersama jawaban di papan tulis interaktif.",
      growthIndicator: "Siswa mampu mengoreksi kekeliruan analisisnya dan memperkuat argumen dengan dalil sahih."
    },
    {
      id: "form-02",
      activityType: "Observasi Proses & Karakter",
      focusSkill: "Kerja sama tim, adab bertutur kata saat diskusi, dan sikap saling menghargai ide teman (tasamuh)",
      feedbackMethod: "Catatan anekdotal guru dan checklist sikap afektif selama proses pembelajaran berlangsung.",
      growthIndicator: "Terbentuk budaya saling menyemangati, tidak memotong pembicaraan, dan partisipasi merata dalam kelompok."
    },
    {
      id: "form-03",
      activityType: "Jurnal Refleksi Diri",
      focusSkill: "Merenungkan dampak nilai keagamaan terhadap ketenangan batin dan niat perbaikan ibadah pribadi",
      feedbackMethod: "Guru memberikan apresiasi tertulis dan kata motivasi personal pada buku jurnal siswa.",
      growthIndicator: "Siswa menuliskan komitmen hijrah perilaku nyata (misal: tidak menyebarkan gosip/hoaks di medsos, sholat tepat waktu)."
    }
  ];

  // C. Asesmen Sumatif (Akhir Lingkup Materi / Semester)
  const summativeSpec: SummativeAssessmentSpec = {
    tpTarget: tp,
    kktpThreshold: 75,
    cognitiveLevel: "C3-C4 (Aplikasi & Analisis)",
    testComponents: {
      multipleChoiceCount: 15,
      essayCount: 5,
      practicalDemo: `Unjuk kerja demonstrasi penguasaan materi "${topic.materi}" dengan rubrik analitik 4 level capaian.`
    }
  };

  // D. Penilaian Autentik & Proyek P5PPRA (Isu Sosial / Etika Digital)
  let p5Theme = "Bhinneka Tunggal Ika";
  let ppraValue = "Tasamuh (Toleransi) & Tawassuth (Moderat)";
  let socialOrDigitalContext = "Maraknya polarisasi opini dan ujaran kebencian di media sosial remaja.";
  let projectTitle = `Kampanye Digital Edukatif: Meneguhkan Nilai ${topic.tema} di Kalangan Generasi Muda`;

  if (topic.element === "Akhlak") {
    if (topic.tema.toLowerCase().includes("lingkungan") || topic.materi.toLowerCase().includes("alam")) {
      p5Theme = "Gaya Hidup Berkelanjutan";
      ppraValue = "Tathawwur wa Ibtikar (Dinamis & Inovatif) & Muwatanah";
      socialOrDigitalContext = "Krisis sampah plastik di lingkungan sekolah dan pemborosan energi listrik.";
      projectTitle = "Proyek Aksi Nyata Eco-Islamic: Sedekah Sampah & Penghijauan Sekolah Rahmatan Lil'Alamin";
    } else {
      p5Theme = "Bangunlah Jiwa dan Raganya";
      ppraValue = "I'tidal (Lurus & Tegas) & Qudwah (Keteladanan)";
      socialOrDigitalContext = "Fenomena cyberbullying, flexing, dan penyebaran hoaks di platform TikTok dan Instagram.";
      projectTitle = "Gerakan Cerdas Bermedsos Islami: Advokasi Tabayyun & Budaya Santun Digital";
    }
  } else if (topic.element === "Fikih") {
    p5Theme = "Suara Demokrasi & Gotong Royong";
    ppraValue = "Syura (Musyawarah) & Tawazun (Keseimbangan)";
    socialOrDigitalContext = "Pemberdayaan kaum dhuafa di sekitar madrasah dan pemahaman toleransi mazhab fikih.";
    projectTitle = `Simulasi Terpadu Ibadah Sosial & Filantropi Islam: Menghidupkan Syariat ${topic.materi}`;
  } else if (topic.element === "Sejarah Peradaban Islam") {
    p5Theme = "Rekayasa dan Teknologi";
    ppraValue = "Tathawwur wa Ibtikar (Dinamis & Inovatif)";
    socialOrDigitalContext = "Menurunnya minat literasi sains dan sejarah generasi muda di tengah arus konten instan.";
    projectTitle = `E-Museum Peradaban Islam: Eksplorasi Kejayaan Sains & Spirit Intelektual Dinasti ${topic.materi}`;
  }

  const authenticP5ppra: AuthenticP5ppraProject = {
    title: projectTitle,
    p5Theme,
    ppraValue,
    socialOrDigitalContext,
    outputProduct: "Kampanye Media Sosial / Video Pendek",
    rubricCriteria: [
      {
        criteria: "Kontekstualitas & Kepekaan Isu Sosial/Etika Digital",
        sangatBaik: "Sangat tajam mengangkat realitas masalah digital/sosial terkini dan menghubungkannya secara harmonis dengan nilai ajaran Islam.",
        baik: "Mampu mengaitkan isu sosial dengan dalil materi secara tepat dan masuk akal bagi audiens remaja.",
        cukup: "Isu yang diangkat masih bersifat umum dan hubungan dengan nilai agama belum diuraikan mendalam.",
        perluBimbingan: "Tidak kontekstual dan hanya menyajikan teori agama tanpa sentuhan realitas sosial kekinian."
      },
      {
        criteria: "Penerapan Nilai P5 & Karakter Rahmatan Lil'Alamin (PPRA)",
        sangatBaik: "Menunjukkan internalisasi nilai toleransi (tasamuh), keteladanan (qudwah), dan integritas moderat dalam seluruh alur proyek.",
        baik: "Mencerminkan sikap gotong royong dan kesantunan akhlak dalam tim dan produk yang dihasilkan.",
        cukup: "Nilai karakter tampak dalam produk namun masih terlihat dibuat-buat atau sebatas formalitas.",
        perluBimbingan: "Belum tampak penanaman nilai karakter profil pelajar Pancasila maupun Rahmatan Lil'Alamin."
      },
      {
        criteria: "Kreativitas, Estetika & Kualitas Produk Akhir",
        sangatBaik: "Karya sangat menarik, inovatif, visual/audio berkualitas tinggi, orisinal, serta memiliki daya gugah dakwah yang kuat.",
        baik: "Karya rapi, visual komunikatif, tata bahasa baik, dan pesan tersampaikan dengan efektif kepada target sasaran.",
        cukup: "Karya selesai dengan format standar namun estetika dan daya tarik konten masih perlu ditingkatkan.",
        perluBimbingan: "Produk belum tuntas atau dikerjakan secara terburu-buru tanpa perencanaan matang."
      },
      {
        criteria: "Dampak Aksi Nyata & Kolaborasi Tim",
        sangatBaik: "Seluruh anggota tim berbagi peran seimbang dan produk berhasil memicu aksi perubahan positif di kelas/lingkungan sekolah.",
        baik: "Kerja sama tim berjalan solid dan menghasilkan dampak edukatif yang baik bagi teman sebaya.",
        cukup: "Kerja sama tim didominasi oleh segelintir anggota aktif saja namun proyek dapat terselesaikan.",
        perluBimbingan: "Terjadi konflik dalam kelompok dan proyek gagal mencapai tujuan edukatif yang direncanakan."
      }
    ]
  };

  return {
    topicId: topic.id,
    grade: topic.grade,
    semester: topic.semester,
    element: topic.element,
    materi: topic.materi,
    tp,
    cp: topic.officialCp,
    dalilReference: topic.dalilReference,
    domains: {
      kognitif: {
        subAspects: [
          "Pemahaman Konsep Keagamaan (Fakta, Konsep, Prinsip)",
          "Hafalan & Penguasaan Dalil Naqli (Al-Qur'an & Hadis)",
          "Pemikiran Kritis & Pemecahan Masalah Keagamaan (HOTS)"
        ],
        focusPoints: elementSpecs.defaultCognitiveFocus,
        rubrics: cognitiveRubrics
      },
      afektif: {
        subAspects: [
          "Penghayatan Nilai & Akhlak Mulia (Kejujuran, Disiplin, Tanggung Jawab)",
          "Sikap Moderat & Toleransi (Tawassuth & Tasamuh)",
          "Presensi Sholat 5 Waktu & Mutaba'ah Ibadah Yaumiyah",
          "Keaktifan Pembelajaran & Gotong Royong",
          "Adab & Etika Moral / Etika Digital"
        ],
        focusPoints: elementSpecs.defaultAffectiveFocus,
        rubrics: affectiveRubrics
      },
      psikomotorik: {
        subAspects: [
          "Keterampilan Membaca Tartil (Tajwid) & Menulis / Menghafal Al-Qur'an",
          "Praktik Ibadah Teknis (Sholat, Sujud, Wudhu, Jenazah, dsb.)",
          "Unjuk Kerja & Demonstrasi Kinerja (Performance / Problem Solving)",
          "Produk & Portofolio Proyek Dakwah Digital / Sosial"
        ],
        focusPoints: elementSpecs.defaultPsychomotorFocus,
        rubrics: psychomotorRubrics
      }
    },
    elementGuidelines: {
      elementName: elementSpecs.elementName,
      scopeSummary: elementSpecs.scopeSummary,
      keySkillsToAssess: elementSpecs.keySkillsToAssess
    },
    diagnostic: {
      purpose: "Memetakan kemampuan awal, gaya belajar, serta kesiapan religius peserta didik (BTQ & ibadah) sebelum materi diajarkan.",
      items: diagnosticItems
    },
    formative: {
      purpose: "Memberikan umpan balik (feedback) berkelanjutan selama proses pembelajaran dan memantau pembentukan karakter peserta didik.",
      items: formativeItems
    },
    summative: {
      purpose: "Mengukur ketercapaian hasil belajar peserta didik pada akhir lingkup materi untuk penetapan ketuntasan kriteria (KKTP).",
      spec: summativeSpec
    },
    authenticP5ppra
  };
}

/**
 * FUNGSI CETAK DOKUMEN INSTRUMEN & RUBRIK ASESMEN LENGKAP
 */
export function printHolisticAssessmentDocument(
  guide: HolisticTpAssessmentGuide,
  schoolName: string = "SMP Negeri 1 Nusantara",
  teacherName: string = "Guru Pengampu PAIBP"
): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Pop-up terblokir. Izinkan pop-up peramban untuk mencetak instrumen asesmen.");
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Instrumen & Rubrik Asesmen PAIBP - ${guide.materi}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #111; line-height: 1.4; margin: 0; }
    .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 15px; }
    .kop h2 { margin: 0; font-size: 14pt; text-transform: uppercase; letter-spacing: 0.5px; }
    .kop h3 { margin: 2px 0; font-size: 12pt; font-weight: normal; }
    .kop p { margin: 2px 0; font-size: 9pt; font-style: italic; color: #444; }
    .title { text-align: center; margin: 12px 0 16px; }
    .title h4 { margin: 0; font-size: 12pt; text-transform: uppercase; text-decoration: underline; }
    .title p { margin: 3px 0; font-size: 10pt; font-weight: bold; }
    table.meta { width: 100%; margin-bottom: 15px; font-size: 10pt; border-collapse: collapse; }
    table.meta td { padding: 3px 6px; vertical-align: top; }
    h5.section-title { font-size: 11pt; margin: 16px 0 6px; text-transform: uppercase; background: #eee; padding: 4px 8px; border-left: 4px solid #0284c7; }
    table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 9.5pt; }
    table.data-table th, table.data-table td { border: 1px solid #333; padding: 5px 7px; vertical-align: top; }
    table.data-table th { background: #f2f2f2; font-weight: bold; text-align: center; }
    .badge { display: inline-block; padding: 1px 5px; font-size: 8pt; font-weight: bold; background: #e0f2fe; color: #0369a1; border-radius: 3px; }
    .sign-area { margin-top: 30px; width: 100%; }
    .sign-table { width: 100%; border: none; font-size: 10.5pt; }
    .sign-table td { width: 50%; text-align: center; vertical-align: top; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div class="kop">
    <h2>PEMERINTAH KOTA / KABUPATEN DINAS PENDIDIKAN</h2>
    <h2>${schoolName.toUpperCase()}</h2>
    <h3>PERANGKAT ASESMEN PEMBELAJARAN PAI DAN BUDI PEKERTI</h3>
    <p>Kurikulum Merdeka Fase D • Standar Asesmen Holistik 3 Ranah & P5PPRA 2026</p>
  </div>

  <div class="title">
    <h4>DOKUMEN PANDUAN, INSTRUMEN & RUBRIK ASESMEN LENGKAP</h4>
    <p>Mata Pelajaran: Pendidikan Agama Islam dan Budi Pekerti (PAIBP)</p>
  </div>

  <table class="meta">
    <tr>
      <td width="20%"><strong>Satuan Pendidikan</strong></td>
      <td width="30%">: ${schoolName}</td>
      <td width="20%"><strong>Kelas / Semester</strong></td>
      <td width="30%">: Kelas ${guide.grade} / Semester ${guide.semester}</td>
    </tr>
    <tr>
      <td><strong>Elemen PAIBP</strong></td>
      <td>: ${guide.element}</td>
      <td><strong>Alokasi Waktu</strong></td>
      <td>: Terintegrasi dalam Alur TP</td>
    </tr>
    <tr>
      <td><strong>Materi Pokok</strong></td>
      <td>: ${guide.materi}</td>
      <td><strong>Rujukan Dalil</strong></td>
      <td>: ${guide.dalilReference}</td>
    </tr>
    <tr>
      <td><strong>Tujuan Pembelajaran (TP)</strong></td>
      <td colspan="3">: <em>${guide.tp}</em></td>
    </tr>
  </table>

  <!-- BAGIAN 1: RANAH KOGNITIF -->
  <h5 class="section-title">I. RANAH KOGNITIF (PENGETAHUAN): KONSEP, DALIL & PEMIKIRAN KRITIS</h5>
  <p style="font-size: 9.5pt; margin: 4px 0 8px;"><strong>Fokus Asesmen:</strong> ${guide.domains.kognitif.focusPoints}</p>
  <table class="data-table">
    <thead>
      <tr>
        <th width="20%">Aspek yang Dinilai</th>
        <th width="20%">Perlu Bimbingan (&lt;70)</th>
        <th width="20%">Cukup (70-79)</th>
        <th width="20%">Mahir (80-90)</th>
        <th width="20%">Sangat Mahir (91-100)</th>
      </tr>
    </thead>
    <tbody>
      ${guide.domains.kognitif.rubrics
        .map(
          r => `
      <tr>
        <td><strong>${r.aspectName}</strong><br><small style="color:#555;">(Bobot: ${r.weight}%)</small></td>
        <td>${r.levels.find(l => l.level === 'Perlu Bimbingan')?.descriptor || '-'}</td>
        <td>${r.levels.find(l => l.level === 'Cukup')?.descriptor || '-'}</td>
        <td>${r.levels.find(l => l.level === 'Mahir')?.descriptor || '-'}</td>
        <td>${r.levels.find(l => l.level === 'Sangat Mahir')?.descriptor || '-'}</td>
      </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <!-- BAGIAN 2: RANAH AFEKTIF -->
  <h5 class="section-title">II. RANAH AFEKTIF (SIKAP & BUDI PEKERTI): AKHLAK, MODERASI & SHOLAT 5 WAKTU</h5>
  <p style="font-size: 9.5pt; margin: 4px 0 8px;"><strong>Fokus Asesmen:</strong> ${guide.domains.afektif.focusPoints}</p>
  <table class="data-table">
    <thead>
      <tr>
        <th width="20%">Aspek yang Dinilai</th>
        <th width="20%">Perlu Bimbingan (&lt;70)</th>
        <th width="20%">Cukup (70-79)</th>
        <th width="20%">Mahir (80-90)</th>
        <th width="20%">Sangat Mahir (91-100)</th>
      </tr>
    </thead>
    <tbody>
      ${guide.domains.afektif.rubrics
        .map(
          r => `
      <tr>
        <td><strong>${r.aspectName}</strong><br><small style="color:#555;">(Bobot: ${r.weight}%)</small></td>
        <td>${r.levels.find(l => l.level === 'Perlu Bimbingan')?.descriptor || '-'}</td>
        <td>${r.levels.find(l => l.level === 'Cukup')?.descriptor || '-'}</td>
        <td>${r.levels.find(l => l.level === 'Mahir')?.descriptor || '-'}</td>
        <td>${r.levels.find(l => l.level === 'Sangat Mahir')?.descriptor || '-'}</td>
      </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- BAGIAN 3: RANAH PSIKOMOTORIK -->
  <h5 class="section-title">III. RANAH PSIKOMOTORIK (KETERAMPILAN & PRAKTIK): IBADAH, TAJWID & KINERJA</h5>
  <p style="font-size: 9.5pt; margin: 4px 0 8px;"><strong>Fokus Asesmen:</strong> ${guide.domains.psikomotorik.focusPoints}</p>
  <table class="data-table">
    <thead>
      <tr>
        <th width="20%">Aspek yang Dinilai</th>
        <th width="20%">Perlu Bimbingan (&lt;70)</th>
        <th width="20%">Cukup (70-79)</th>
        <th width="20%">Mahir (80-90)</th>
        <th width="20%">Sangat Mahir (91-100)</th>
      </tr>
    </thead>
    <tbody>
      ${guide.domains.psikomotorik.rubrics
        .map(
          r => `
      <tr>
        <td><strong>${r.aspectName}</strong><br><small style="color:#555;">(Bobot: ${r.weight}%)</small></td>
        <td>${r.levels.find(l => l.level === 'Perlu Bimbingan')?.descriptor || '-'}</td>
        <td>${r.levels.find(l => l.level === 'Cukup')?.descriptor || '-'}</td>
        <td>${r.levels.find(l => l.level === 'Mahir')?.descriptor || '-'}</td>
        <td>${r.levels.find(l => l.level === 'Sangat Mahir')?.descriptor || '-'}</td>
      </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <!-- BAGIAN 4: EMPAT PENDEKATAN ASESMEN KURIKULUM MERDEKA -->
  <h5 class="section-title">IV. PENDEKATAN ASESMEN KURIKULUM MERDEKA (DIAGNOSTIK, FORMATIF, SUMATIF & P5PPRA)</h5>
  
  <p style="margin: 6px 0 2px;"><strong>A. Instrumen Asesmen Diagnostik Awal (Pemetaan Kesiapan & Religius)</strong></p>
  <table class="data-table">
    <thead>
      <tr>
        <th width="25%">Aspek Pemetaan</th>
        <th width="35%">Pertanyaan / Instrumen Cek</th>
        <th width="20%">Kriteria Siap</th>
        <th width="20%">Tindak Lanjut Remedial</th>
      </tr>
    </thead>
    <tbody>
      ${guide.diagnostic.items
        .map(
          item => `
      <tr>
        <td><strong>${item.targetAspect}</strong></td>
        <td>${item.questionPrompt}</td>
        <td>${item.diagnosticCriteria.ready}</td>
        <td>${item.remedialFollowUp}</td>
      </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <p style="margin: 8px 0 2px;"><strong>B. Instrumen Asesmen Formatif (Umpan Balik & Observasi Berkelanjutan)</strong></p>
  <table class="data-table">
    <thead>
      <tr>
        <th width="25%">Bentuk Kegiatan</th>
        <th width="35%">Fokus Pengamatan</th>
        <th width="20%">Metode Feedback Guru</th>
        <th width="20%">Indikator Pertumbuhan</th>
      </tr>
    </thead>
    <tbody>
      ${guide.formative.items
        .map(
          item => `
      <tr>
        <td><strong>${item.activityType}</strong></td>
        <td>${item.focusSkill}</td>
        <td>${item.feedbackMethod}</td>
        <td>${item.growthIndicator}</td>
      </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <p style="margin: 8px 0 2px;"><strong>C. Spesifikasi Asesmen Sumatif (KKTP: ${guide.summative.spec.kktpThreshold})</strong></p>
  <p style="font-size: 9.5pt; margin: 2px 0 6px;">
    Tes tertulis terstandar memadukan ${guide.summative.spec.testComponents.multipleChoiceCount} Soal Pilihan Ganda Berbasis Stimulus, ${guide.summative.spec.testComponents.essayCount} Soal Uraian Berjenjang Bloom, serta unjuk kerja: <em>${guide.summative.spec.testComponents.practicalDemo}</em>
  </p>

  <p style="margin: 8px 0 2px;"><strong>D. Penilaian Autentik & Proyek P5PPRA (${guide.authenticP5ppra.p5Theme})</strong></p>
  <p style="font-size: 9.5pt; margin: 2px 0 6px;">
    <strong>Judul Proyek:</strong> ${guide.authenticP5ppra.title}<br>
    <strong>Nilai PPRA:</strong> ${guide.authenticP5ppra.ppraValue} | <strong>Isu Nyata / Etika Digital:</strong> ${guide.authenticP5ppra.socialOrDigitalContext}
  </p>
  <table class="data-table">
    <thead>
      <tr>
        <th width="25%">Kriteria Autentik</th>
        <th width="25%">Perlu Bimbingan</th>
        <th width="25%">Cukup</th>
        <th width="25%">Sangat Baik</th>
      </tr>
    </thead>
    <tbody>
      ${guide.authenticP5ppra.rubricCriteria
        .map(
          rc => `
      <tr>
        <td><strong>${rc.criteria}</strong></td>
        <td>${rc.perluBimbingan}</td>
        <td>${rc.cukup}</td>
        <td>${rc.sangatBaik}</td>
      </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="sign-area">
    <table class="sign-table">
      <tr>
        <td>
          Mengetahui,<br>
          Kepala ${schoolName}<br><br><br><br>
          <strong>( .................................................... )</strong><br>
          NIP. ...................................................
        </td>
        <td>
          Nusantara, ................................. 2026<br>
          Guru Pengampu PAIBP,<br><br><br><br>
          <strong>${teacherName}</strong><br>
          NIP. 19850612 201101 1 003
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 400);
}
