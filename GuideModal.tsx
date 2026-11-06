import React from 'react';
import { X, BookOpen, Brain, Layers, CheckCircle2, Award, Sparkles } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full p-6 text-slate-800 shadow-xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
        <button
          id="btn-close-guide"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Buku Panduan Guru: Standar Asesmen Deep Learning PAIBP 2026
            </h3>
            <p className="text-xs text-slate-500">
              Berdasarkan Keputusan Kepala Badan Kebijakan Pendidikan Dasar dan Menengah No. 020 Tahun 2026 (Fase D: SMP/MTs)
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 0: Standar CP Resmi 2026 */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-sky-800">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              Capaian Pembelajaran (CP) Resmi Fase D (Keputusan No. 020 Tahun 2026)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-slate-900">1. Al-Qur'an Hadis:</span> Membaca, menghafal, menulis, dan menjelaskan ayat Al-Qur'an tentang iman, takwa, toleransi, cinta tanah air, semangat keilmuan, dan sabar menghadapi musibah/ujian beserta hadis terkait.
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-slate-900">2. Akidah:</span> Meyakini dan merefleksikan rukun iman serta hal-hal yang dapat meneguhkan iman.
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-slate-900">3. Akhlak:</span> Menerapkan makna ikhlas, bersyukur kepada Allah Swt., cinta rasul, cinta ilmu, cinta lingkungan, serta cinta diri sendiri dan sesama.
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-slate-900">4. Fikih:</span> Menerapkan ketentuan sujud di luar rukun salat, rukhsah dalam ibadah, kewajiban terhadap jenazah, haji dan umrah, penyembelihan hewan, kurban, akikah, dan wakaf.
              </div>
              <div className="bg-white p-2 rounded border border-slate-200 md:col-span-2">
                <span className="font-bold text-slate-900">5. Sejarah Peradaban Islam:</span> Merefleksikan sejarah dan peran Kekhalifahan Islam pasca Khulafaur Rasyidin serta sejarah masuknya Islam di Indonesia.
              </div>
            </div>
          </div>

          {/* Section 1: Deep Learning Core */}
          <div className="bg-sky-50/70 p-4 rounded-lg border border-sky-200/80">
            <h4 className="font-bold text-sky-950 text-sm mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-sky-700" />
              1. Framework Deep Learning dalam PAIBP
            </h4>
            <p className="mb-2">
              Soal tidak lagi menanyakan sekadar "apa pengertian ayat?" atau "sebutkan tanggal peristiwa sejarah", melainkan menguji bagaimana prinsip syariat dan tauhid digunakan dalam mengambil keputusan hidup nyata:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-medium">
              <div className="bg-white p-2.5 rounded-md border border-sky-200 text-slate-800">
                <strong>A. Memahami:</strong> Siswa menginterpretasikan hikmah di balik dalil & konsep.
              </div>
              <div className="bg-white p-2.5 rounded-md border border-sky-200 text-slate-800">
                <strong>B. Mengaplikasi:</strong> Siswa memecahkan masalah fikih & moral sehari-hari.
              </div>
              <div className="bg-white p-2.5 rounded-md border border-sky-200 text-slate-800">
                <strong>C. Merefleksi:</strong> Siswa mengevaluasi motif niat batin & etika digital.
              </div>
              <div className="bg-white p-2.5 rounded-md border border-sky-200 text-slate-800">
                <strong>D. Mentransfer:</strong> Siswa membawa nilai tauhid ke dalam inovasi masa depan.
              </div>
            </div>
          </div>

          {/* Section 2: Bloom vs SOLO Mapping */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              2. Integrasi Taksonomi Bloom Revisi & Taksonomi SOLO
            </h4>
            <table className="w-full border-collapse border border-slate-200 bg-white rounded-md overflow-hidden text-center text-[11px]">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-800">
                  <th className="p-2 border border-slate-200">Level Bloom</th>
                  <th className="p-2 border border-slate-200">Level SOLO</th>
                  <th className="p-2 border border-slate-200 text-left">Karakteristik Tuntutan Kognitif</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold text-slate-700">C1 Mengingat</td>
                  <td className="p-2 border border-slate-200">Unistructural</td>
                  <td className="p-2 border border-slate-200 text-left">Mengenali satu istilah atau definisi secara tunggal.</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold text-slate-700">C2 Memahami</td>
                  <td className="p-2 border border-slate-200">Multistructural</td>
                  <td className="p-2 border border-slate-200 text-left">Mengidentifikasi beberapa rukun/syarat tanpa kaitan sebab-akibat.</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold text-slate-700">C3 Menerapkan</td>
                  <td className="p-2 border border-slate-200">Multistructural / Relational</td>
                  <td className="p-2 border border-slate-200 text-left">Menghitung zakat atau memilih rukhsah salat dalam situasi perjalanan.</td>
                </tr>
                <tr className="bg-sky-50/50">
                  <td className="p-2 border border-slate-200 font-bold text-sky-900">C4 Menganalisis</td>
                  <td className="p-2 border border-slate-200 font-bold text-sky-900">Relational</td>
                  <td className="p-2 border border-slate-200 text-left">Menghubungkan iman hari hisab dengan integritas saat tidak diawasi manusia.</td>
                </tr>
                <tr className="bg-sky-50/50">
                  <td className="p-2 border border-slate-200 font-bold text-sky-900">C5 Mengevaluasi</td>
                  <td className="p-2 border border-slate-200 font-bold text-sky-900">Relational / Ext. Abstract</td>
                  <td className="p-2 border border-slate-200 text-left">Menimbang keputusan etika komunikasi digital tabayyun vs spekulasi.</td>
                </tr>
                <tr className="bg-sky-50/50">
                  <td className="p-2 border border-slate-200 font-bold text-sky-900">C6 Mencipta</td>
                  <td className="p-2 border border-slate-200 font-bold text-sky-900">Extended Abstract</td>
                  <td className="p-2 border border-slate-200 text-left">Merancang strategi komprehensif pelestarian alam atau kepemimpinan OSIS Islami.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Homogeneous Options & Key Distribution */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              3. Aturan Mutu Khusus: Opsi Homogen & Distribusi Kunci
            </h4>
            <p>
              <strong>Aturan Khusus Pilihan Ganda Sulit (Aturan 13 & 34):</strong> Seluruh opsi dibuat bersikap positif dan masuk akal. Jawaban yang benar bukan satu-satunya pilihan yang baik, melainkan pilihan yang <em>paling komprehensif, paling berlandaskan tauhid, dan paling menyelesaikan akar masalah secara berkelanjutan</em>.
            </p>
            <p>
              <strong>Distribusi Kunci:</strong> Sistem memastikan perbandingan proporsional kunci A, B, C, dan D (rata-rata 25% per opsi) tanpa pola monoton yang dapat ditebak siswa.
            </p>
          </div>

          {/* Section 4: Rubrik Skor 0-32 */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              4. Rubrik Penilaian Mutu Soal (Skor 0–32 Poin)
            </h4>
            <p>
              Setiap butir soal dinilai otomatis menggunakan 8 parameter (0–4 poin per parameter):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
              <div className="bg-white p-2 rounded border border-slate-200">1. Keselarasan TP (0-4)</div>
              <div className="bg-white p-2 rounded border border-slate-200">2. Kualitas Stimulus (0-4)</div>
              <div className="bg-white p-2 rounded border border-slate-200">3. Ketepatan Bloom (0-4)</div>
              <div className="bg-white p-2 rounded border border-slate-200">4. Ketepatan SOLO (0-4)</div>
              <div className="bg-white p-2 rounded border border-slate-200">5. Kualitas Opsi (0-4)</div>
              <div className="bg-white p-2 rounded border border-slate-200">6. Kualitas Pengecoh (0-4)</div>
              <div className="bg-white p-2 rounded border border-slate-200">7. Kontekstualitas (0-4)</div>
              <div className="bg-white p-2 rounded border border-slate-200">8. Kedalaman Berpikir (0-4)</div>
            </div>
            <div className="flex gap-2 text-xs font-semibold mt-2">
              <span className="text-sky-700">28–32: Sangat Baik</span> |
              <span className="text-blue-700">23–27: Baik</span> |
              <span className="text-amber-700">18–22: Perlu Revisi</span> |
              <span className="text-rose-700">&lt;18: Tidak Layak</span>
            </div>
          </div>

          {/* Section 5: Buku Penilaian Lengkap 3 Ranah */}
          <div className="bg-emerald-50/70 p-4 rounded-lg border border-emerald-200 space-y-2">
            <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              5. Standar Buku Penilaian Lengkap 3 Ranah (Kurikulum Merdeka 2026)
            </h4>
            <p>
              Penilaian dilakukan secara otentik pada setiap Tujuan Pembelajaran (TP) mencakup 3 domain esensial:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="font-bold text-sky-900 block mb-1">A. Ranah Kognitif (Pengetahuan)</span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                  <li><strong>Nilai Tugas:</strong> Tugas mandiri, terstruktur & LKPD.</li>
                  <li><strong>Asesmen Diagnostik:</strong> Pemetaan kesiapan awal TP.</li>
                  <li><strong>Asesmen Formatif:</strong> Kuis berkala & umpan balik.</li>
                  <li><strong>Asesmen Sumatif:</strong> Tes akhir lingkup materi TP.</li>
                </ul>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="font-bold text-amber-900 block mb-1">B. Ranah Afektif (Sikap & Ibadah)</span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                  <li><strong>Nilai Sikap:</strong> Integritas, kejujuran & tanggung jawab.</li>
                  <li><strong>Keaktifan:</strong> Partisipasi aktif diskusi kelas.</li>
                  <li><strong>Presensi Sholat 5 Waktu:</strong> Mutaba'ah ibadah yaumiyah.</li>
                  <li><strong>Adab & Etika Digital:</strong> Tabayyun & akhlak bermedsos.</li>
                </ul>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                <span className="font-bold text-purple-900 block mb-1">C. Ranah Psikomotorik (Keterampilan)</span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                  <li><strong>Nilai Praktik:</strong> Wudhu, Sholat Jenazah/Fardhu, Tajwid.</li>
                  <li><strong>Unjuk Kerja:</strong> Demonstrasi peran & pemecahan masalah.</li>
                  <li><strong>Produk / Proyek:</strong> Poster dakwah digital & infografis.</li>
                </ul>
              </div>
            </div>
            <p className="text-[11px] text-emerald-900 pt-1">
              <strong>Sistem Rapor Otomatis:</strong> Nilai akhir dihitung berdasarkan bobot ideal (misal Kognitif 40%, Afektif 30%, Psikomotorik 30%) dan dilengkapi generator deskripsi narasi capaian kompetensi siap salin ke e-Rapor.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            id="btn-understand-guide"
            onClick={onClose}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-5 py-2 rounded-md text-xs"
          >
            Mengerti & Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
