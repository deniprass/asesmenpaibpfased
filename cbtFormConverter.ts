import { QuestionItem, AssessmentPackage } from '../types';

/**
 * 1. Google Forms Apps Script Code Generator
 * Creates a standalone, pasteable Google Apps Script that builds a complete
 * Google Form Quiz automatically with sections, questions, stimulus, options,
 * correct answers, points, and feedback!
 * Supports both Pilihan Ganda and Soal Uraian / Essay.
 */
export function generateGoogleFormsAppScript(pkg: AssessmentPackage): string {
  const formTitle = `${pkg.identity.title} - ${pkg.identity.schoolName}`;
  const formDesc = `Mata Pelajaran: ${pkg.identity.subject} | Kelas: ${pkg.identity.grade} (${pkg.identity.phase}) | Alokasi Waktu: ${pkg.identity.timeAllocation} Menit\\nCapaian Pembelajaran: ${pkg.cp.replace(/"/g, '\\"')}`;

  const questionsJson = JSON.stringify(
    pkg.questions.map(q => ({
      number: q.number,
      isEssay: q.questionType === 'Essay',
      title: `${q.number}. ${q.questionText}`,
      stimulus: q.stimulus || '',
      options: (q.options || []).map(opt => ({
        key: opt.key,
        text: `${opt.key}. ${opt.text}`,
        isCorrect: opt.key === q.correctKey
      })),
      feedback: q.questionType === 'Essay'
        ? `Model Jawaban: ${(q.modelAnswer || q.explanation).replace(/"/g, '\\"')}\\nPedoman Penskoran: ${(q.rubricCriteria || []).map(r => `[Skor ${r.score}: ${r.label}]`).join(' ')}`
        : `Kunci Jawaban: ${q.correctKey}\\nPembahasan: ${q.explanation.replace(/"/g, '\\"')}\\nNilai Karakter: ${q.islamicValue.replace(/"/g, '\\"')}`
    })),
    null,
    2
  );

  return `/**
 * ============================================================================
 * GOOGLE APPS SCRIPT: AUTO-CREATE GOOGLE FORM QUIZ PAIBP DEEP LEARNING 2026
 * ============================================================================
 * CARA MENGGUNAKAN:
 * 1. Buka https://script.google.com di browser Anda.
 * 2. Klik "New project" (Proyek Baru).
 * 3. Hapus semua kode default di editor, lalu PASTE SELURUH KODE INI.
 * 4. Klik ikon Save (Disket), lalu klik tombol "Run" (Jalankan) fungsi 'createPaibpQuiz'.
 * 5. Berikan izin otorisasi Google jika diminta.
 * 6. Buka Google Drive Anda (atau cek Execution Log), Google Form Quiz siap pakai langsung dibuat!
 * ============================================================================
 */

function createPaibpQuiz() {
  const quizTitle = "${formTitle.replace(/"/g, '\\"')}";
  const quizDescription = "${formDesc.replace(/\n/g, '\\n')}";

  // 1. Buat Google Form baru
  const form = FormApp.create(quizTitle);
  form.setDescription(quizDescription);
  form.setIsQuiz(true);
  form.setAllowResponseEdits(false);
  form.setCollectEmail(true);
  form.setLimitOneResponsePerUser(true);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(true);
  form.setShuffleQuestions(false);

  // 2. Bagian Identitas Peserta Didik
  const section1 = form.addSectionHeaderItem();
  section1.setTitle("IDENTITAS PESERTA DIDIK");
  section1.setHelpText("Silakan isi nama lengkap, nomor absen, dan kelas Anda sebelum mengerjakan soal.");

  const nameItem = form.addTextItem();
  nameItem.setTitle("Nama Lengkap Peserta Didik");
  nameItem.setRequired(true);

  const classItem = form.addTextItem();
  classItem.setTitle("Kelas / Rombel (Contoh: ${pkg.identity.grade}-A)");
  classItem.setRequired(true);

  const absentItem = form.addTextItem();
  absentItem.setTitle("Nomor Presensi / Absen");
  absentItem.setRequired(true);

  // 3. Bagian Naskah Soal Ujian
  const section2 = form.addPageBreakItem();
  section2.setTitle("NASKAH SOAL ASESMEN SUMATIF / HOTS");
  section2.setHelpText("Bacalah setiap stimulus kasus dengan saksama, lalu kerjakan soal dengan jujur dan teliti.");

  // Data Soal
  const questionsData = ${questionsJson};
  const pointsPerQuestion = Math.round(100 / (questionsData.length || 1));

  questionsData.forEach(function(q) {
    let promptText = q.title;
    if (q.stimulus && q.stimulus.trim() !== '') {
      promptText = "[STIMULUS KASUS]\\n" + q.stimulus + "\\n\\n[PERTANYAAN]\\n" + q.title;
    }

    if (q.isEssay) {
      // Buat Soal Essay / Paragraph Text
      const essayItem = form.addParagraphTextItem();
      essayItem.setTitle(promptText);
      essayItem.setHelpText("Tuliskan analisis dan penjelasan Anda secara lengkap dan terstruktur.");
      essayItem.setPoints(pointsPerQuestion);
      essayItem.setRequired(true);
    } else {
      // Buat Soal Pilihan Ganda HOTS
      const mcItem = form.addMultipleChoiceItem();
      mcItem.setTitle(promptText);
      mcItem.setPoints(pointsPerQuestion);
      mcItem.setRequired(true);

      const choices = [];
      q.options.forEach(function(opt) {
        if (opt.isCorrect) {
          choices.push(mcItem.createChoice(opt.text, true));
        } else {
          choices.push(mcItem.createChoice(opt.text, false));
        }
      });
      mcItem.setChoices(choices);

      // Tambahkan feedback pembahasan pedagogik
      if (q.feedback) {
        const feedback = FormApp.createFeedback()
          .setText(q.feedback)
          .build();
        mcItem.setFeedbackForCorrect(feedback);
        mcItem.setFeedbackForIncorrect(feedback);
      }
    }
  });

  Logger.log("BERHASIL! Google Form Quiz telah dibuat:");
  Logger.log("Edit URL: " + form.getEditUrl());
  Logger.log("Link Publikasi Peserta: " + form.getPublishedUrl());
}
`;
}

/**
 * 2. Standar AIKEN Format (Compatible with Moodle, Google Form FormApp Add-ons, Quizizz import)
 */
export function generateAikenFormat(pkg: AssessmentPackage): string {
  return pkg.questions
    .map(q => {
      const lines: string[] = [];
      if (q.stimulus && q.stimulus.trim().length > 0) {
        lines.push(`[STIMULUS KASUS]: ${q.stimulus.replace(/\n/g, ' ')}`);
      }

      if (q.questionType === 'Essay') {
        lines.push(`[SOAL URAIAN / ESSAY - Ranah Kognitif: ${q.bloomLevel}]`);
        lines.push(`${q.number}. ${q.questionText.replace(/\n/g, ' ')}`);
        lines.push(`PEDOMAN JAWABAN: ${(q.modelAnswer || q.explanation).replace(/\n/g, ' ')}`);
      } else {
        lines.push(`${q.number}. ${q.questionText.replace(/\n/g, ' ')}`);
        (q.options || []).forEach(opt => {
          lines.push(`${opt.key}. ${opt.text}`);
        });
        lines.push(`ANSWER: ${q.correctKey}`);
      }
      return lines.join('\n');
    })
    .join('\n\n');
}

/**
 * 3. Moodle XML Format
 * Directly importable into Moodle Question Bank category
 */
export function generateMoodleXml(pkg: AssessmentPackage): string {
  const escapeXml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const questionNodes = pkg.questions.map(q => {
    const fullQuestionText = `${q.stimulus ? `<p><strong>[STIMULUS]</strong> ${escapeXml(q.stimulus)}</p>` : ''}<p>${escapeXml(q.questionText)}</p>`;
    
    if (q.questionType === 'Essay') {
      return `
  <!-- Question ${q.number} (Essay) -->
  <question type="essay">
    <name>
      <text>${escapeXml(pkg.identity.subject)} - Soal ${q.number} [Essay - ${escapeXml(q.bloomLevel)}] (${escapeXml(q.materi)})</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[${fullQuestionText}]]></text>
    </questiontext>
    <generalfeedback format="html">
      <text><![CDATA[<p><strong>Model Jawaban:</strong> ${escapeXml(q.modelAnswer || q.explanation)}</p><p><strong>Rubrik:</strong> ${(q.rubricCriteria || []).map(r => `[Skor ${r.score}: ${escapeXml(r.label)} - ${escapeXml(r.description)}]`).join('<br/>')}</p>]]></text>
    </generalfeedback>
    <defaultgrade>${q.maxScore || 20}.0000000</defaultgrade>
    <penalty>0.0000000</penalty>
    <hidden>0</hidden>
    <responseformat>editor</responseformat>
    <responserequired>1</responserequired>
    <responsefieldlines>15</responsefieldlines>
    <attachments>0</attachments>
    <graderinfo format="html">
      <text><![CDATA[<p>Gunakan rubrik analitis untuk menilai penalaran dan argumentasi dalil peserta didik.</p>]]></text>
    </graderinfo>
  </question>`;
    }

    const answersXml = (q.options || []).map(opt => {
      const isCorrect = opt.key === q.correctKey;
      const fraction = isCorrect ? '100' : '0';
      const feedbackText = isCorrect 
        ? escapeXml(q.explanation)
        : escapeXml(q.distractorExplanation?.[opt.key] || 'Pilihan kurang tepat.');

      return `
    <answer fraction="${fraction}" format="html">
      <text><![CDATA[${opt.key}. ${opt.text}]]></text>
      <feedback format="html">
        <text><![CDATA[${feedbackText}]]></text>
      </feedback>
    </answer>`;
    }).join('\n');

    return `
  <!-- Question ${q.number} (PG) -->
  <question type="multichoice">
    <name>
      <text>${escapeXml(pkg.identity.subject)} - Soal ${q.number} (${escapeXml(q.materi)})</text>
    </name>
    <questiontext format="html">
      <text><![CDATA[${fullQuestionText}]]></text>
    </questiontext>
    <generalfeedback format="html">
      <text><![CDATA[<p><strong>Pembahasan:</strong> ${escapeXml(q.explanation)}</p><p><strong>Nilai Karakter:</strong> ${escapeXml(q.islamicValue)}</p>]]></text>
    </generalfeedback>
    <defaultgrade>1.0000000</defaultgrade>
    <penalty>0.3333333</penalty>
    <hidden>0</hidden>
    <single>true</single>
    <shuffleanswers>true</shuffleanswers>
    <answernumbering>abc</answernumbering>
    ${answersXml}
  </question>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
  <!-- Category -->
  <question type="category">
    <category>
      <text>$course$/PAIBP/${escapeXml(pkg.identity.grade)}/${escapeXml(pkg.identity.subject)}</text>
    </category>
    <info format="html">
      <text>Bank Soal Asesmen Deep Learning 2026</text>
    </info>
  </question>
  ${questionNodes}
</quiz>`;
}

/**
 * 4. Candy CBT / BeeSMART / Javaclass / Ujian Online CSV Format
 * Standard Indonesian School CBT column layout:
 * No, Jenis Soal (1=PG, 2=Essay), Soal, Opsi A, Opsi B, Opsi C, Opsi D, Kunci, Bobot, Pembahasan
 */
export function generateCandyCbtCsv(pkg: AssessmentPackage): string {
  const escapeCsv = (val: string | number) => `"${String(val || '').replace(/"/g, '""')}"`;
  
  const headers = [
    'NO',
    'JENIS_SOAL',
    'PERTANYAAN',
    'OPSI_A',
    'OPSI_B',
    'OPSI_C',
    'OPSI_D',
    'KUNCI_JAWABAN',
    'BOBOT',
    'PEMBAHASAN'
  ];

  const rows = pkg.questions.map(q => {
    const isEssay = q.questionType === 'Essay';
    const fullQuestion = `${q.stimulus ? `<p><strong>[STIMULUS]</strong> ${q.stimulus}</p><br/>` : ''}<p>${q.questionText}</p>`;
    const optA = isEssay ? '' : (q.options?.find(o => o.key === 'A')?.text || '');
    const optB = isEssay ? '' : (q.options?.find(o => o.key === 'B')?.text || '');
    const optC = isEssay ? '' : (q.options?.find(o => o.key === 'C')?.text || '');
    const optD = isEssay ? '' : (q.options?.find(o => o.key === 'D')?.text || '');

    const keyOrModel = isEssay ? (q.modelAnswer || 'Rubrik Terlampir') : q.correctKey;
    const pembahasanText = isEssay
      ? `[MODEL JAWABAN] ${q.modelAnswer || q.explanation} | [RUBRIK] ${(q.rubricCriteria || []).map(r => `Skor ${r.score}: ${r.label}`).join('; ')}`
      : `${q.explanation} (Nilai Karakter: ${q.islamicValue})`;

    return [
      q.number,
      isEssay ? '2' : '1', // 1 = PG, 2 = Essay (Candy CBT standard)
      escapeCsv(fullQuestion),
      escapeCsv(optA),
      escapeCsv(optB),
      escapeCsv(optC),
      escapeCsv(optD),
      escapeCsv(keyOrModel),
      isEssay ? String(q.maxScore || 20) : '1',
      escapeCsv(pembahasanText)
    ].join(',');
  });

  return '\ufeff' + [headers.join(','), ...rows].join('\n');
}

/**
 * 5. Quizizz Spreadsheet Import Format (Excel-friendly CSV)
 * Question Text, Question Type, Option 1, Option 2, Option 3, Option 4, Correct Answer, Time in seconds
 */
export function generateQuizizzCsv(pkg: AssessmentPackage): string {
  const escapeCsv = (val: string | number) => `"${String(val || '').replace(/"/g, '""')}"`;
  
  const headers = [
    'Question Text',
    'Question Type',
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5',
    'Correct Answer',
    'Time in seconds'
  ];

  const rows = pkg.questions.map(q => {
    const isEssay = q.questionType === 'Essay';
    const fullQuestion = `${q.stimulus ? `[STIMULUS: ${q.stimulus}]\n\n` : ''}${q.questionText}`;

    if (isEssay) {
      return [
        escapeCsv(fullQuestion),
        'Open-Ended',
        '',
        '',
        '',
        '',
        '',
        escapeCsv(q.modelAnswer || q.explanation),
        '180' // 3 minutes for essay
      ].join(',');
    }

    const optA = q.options?.find(o => o.key === 'A')?.text || '';
    const optB = q.options?.find(o => o.key === 'B')?.text || '';
    const optC = q.options?.find(o => o.key === 'C')?.text || '';
    const optD = q.options?.find(o => o.key === 'D')?.text || '';
    
    // Quizizz uses 1, 2, 3, 4 for multiple choice index
    const correctIndex = q.correctKey === 'A' ? '1' : q.correctKey === 'B' ? '2' : q.correctKey === 'C' ? '3' : '4';

    return [
      escapeCsv(fullQuestion),
      'Multiple Choice',
      escapeCsv(optA),
      escapeCsv(optB),
      escapeCsv(optC),
      escapeCsv(optD),
      '', // Option 5
      correctIndex,
      '60' // 60 seconds per HOTS question
    ].join(',');
  });

  return '\ufeff' + [headers.join(','), ...rows].join('\n');
}

/**
 * 6. Google Forms Question-by-Question Formatted Text (Easy Copy-Paste)
 */
export function generateGoogleFormsFormattedText(pkg: AssessmentPackage): string {
  return `=== FORMAT IMPORT GOOGLE FORMS MANUAL / FORM RECYCLER ===
JUDUL FORM: ${pkg.identity.title}
DESKRIPSI: ${pkg.identity.subject} Kelas ${pkg.identity.grade} - Kurikulum Merdeka 2026

${pkg.questions.map(q => {
  const isEssay = q.questionType === 'Essay';
  if (isEssay) {
    return `--------------------------------------------------
SOAL NOMOR ${q.number} (Uraian / Essay [${q.bloomLevel}] - Skor: ${q.maxScore || 20})
${q.stimulus ? `[STIMULUS]\n${q.stimulus}\n\n` : ''}[PERTANYAAN ESSAY]
${q.questionText}

MODEL JAWABAN IDEAL GURU:
${q.modelAnswer || q.explanation}

RUBRIK PENSKORAN ANALITIS:
${(q.rubricCriteria || []).map(r => `• Skor ${r.score} (${r.label}): ${r.description}`).join('\n')}
--------------------------------------------------`;
  }

  return `--------------------------------------------------
SOAL NOMOR ${q.number} (Pilihan Ganda [${q.bloomLevel}] - Skor: ${Math.round(100 / pkg.questions.length)})
${q.stimulus ? `[STIMULUS]\n${q.stimulus}\n\n` : ''}[PERTANYAAN]
${q.questionText}

PILIHAN JAWABAN:
${(q.options || []).map(o => `(${o.key === q.correctKey ? '✓ KUNCI' : ' '}) ${o.key}. ${o.text}`).join('\n')}

KUNCI JAWABAN: ${q.correctKey}
FEEDBACK/PEMBAHASAN: ${q.explanation}
--------------------------------------------------`;
}).join('\n\n')}
`;
}

