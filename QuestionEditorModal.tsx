import React, { useState } from 'react';
import { QuestionItem, BloomLevel, SoloLevel, DeepLearningDimension, DifficultyLevel } from '../types';
import { calculateQualityScore } from '../services/assessmentGenerator';
import { X, Sparkles, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface QuestionEditorModalProps {
  question: QuestionItem;
  onSave: (updatedQuestion: QuestionItem) => void;
  onClose: () => void;
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  question,
  onSave,
  onClose
}) => {
  const [edited, setEdited] = useState<QuestionItem>({ ...question });
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');

  const handleOptionChange = (key: 'A' | 'B' | 'C' | 'D', text: string) => {
    const newOptions = edited.options.map(opt => (opt.key === key ? { ...opt, text } : opt));
    setEdited({ ...edited, options: newOptions });
  };

  const handleAiRefine = async () => {
    setIsAiPolishing(true);
    try {
      const res = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionItem: edited,
          instruction: aiInstruction || 'Tingkatkan kualitas stimulus, buat semua opsi positif dan homogen, Bloom C4-C6 dan SOLO Relational.'
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const aiQ = data.data;
        setEdited(prev => ({
          ...prev,
          stimulus: aiQ.stimulus || prev.stimulus,
          questionText: aiQ.questionText || prev.questionText,
          options: aiQ.options || prev.options,
          correctKey: aiQ.correctKey || prev.correctKey,
          explanation: aiQ.explanation || prev.explanation,
          islamicValue: aiQ.islamicValue || prev.islamicValue,
          bloomLevel: (aiQ.bloomLevel as BloomLevel) || prev.bloomLevel,
          soloLevel: (aiQ.soloLevel as SoloLevel) || prev.soloLevel,
          qualityScore: calculateQualityScore(aiQ)
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiPolishing(false);
    }
  };

  const handleSave = () => {
    const updatedQuality = calculateQualityScore(edited);
    onSave({
      ...edited,
      qualityScore: updatedQuality
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full p-6 text-slate-800 shadow-xl relative max-h-[90vh] overflow-y-auto border border-slate-200">
        <button
          id="btn-close-editor"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm border border-sky-200">
            #{edited.number}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Edit & Sempurnakan Butir Soal</h3>
            <p className="text-xs text-slate-500">
              Elemen: {edited.element} | Skor Mutu: {edited.qualityScore?.total || 32}/32 ({edited.qualityScore?.category || 'Sangat Baik'})
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Metadata Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <label className="block font-medium text-slate-600 mb-1">Bentuk Soal</label>
              <select
                id="select-question-type"
                value={edited.questionType || 'Pilihan Ganda'}
                onChange={(e) => setEdited({ ...edited, questionType: e.target.value as any })}
                className="w-full bg-white border border-slate-200 rounded-md p-1 font-semibold text-slate-800"
              >
                <option value="Pilihan Ganda">Pilihan Ganda</option>
                <option value="Essay">Uraian / Essay</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">Bloom Level</label>
              <select
                id="select-bloom-level"
                value={edited.bloomLevel}
                onChange={(e) => setEdited({ ...edited, bloomLevel: e.target.value as BloomLevel })}
                className="w-full bg-white border border-slate-200 rounded-md p-1 font-semibold text-slate-800"
              >
                <option value="C1">C1 - Mengingat</option>
                <option value="C2">C2 - Memahami</option>
                <option value="C3">C3 - Menerapkan</option>
                <option value="C4">C4 - Menganalisis</option>
                <option value="C5">C5 - Mengevaluasi</option>
                <option value="C6">C6 - Mencipta</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">SOLO Level</label>
              <select
                id="select-solo-level"
                value={edited.soloLevel}
                onChange={(e) => setEdited({ ...edited, soloLevel: e.target.value as SoloLevel })}
                className="w-full bg-white border border-slate-200 rounded-md p-1 font-semibold text-slate-800"
              >
                <option value="Unistructural">Unistructural</option>
                <option value="Multistructural">Multistructural</option>
                <option value="Relational">Relational</option>
                <option value="Extended Abstract">Extended Abstract</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">Dimensi DL</label>
              <select
                id="select-dl-dim"
                value={edited.deepLearningDim}
                onChange={(e) => setEdited({ ...edited, deepLearningDim: e.target.value as DeepLearningDimension })}
                className="w-full bg-white border border-slate-200 rounded-md p-1 font-semibold text-slate-800"
              >
                <option value="Memahami">Memahami</option>
                <option value="Mengaplikasi">Mengaplikasi</option>
                <option value="Merefleksi">Merefleksi</option>
                <option value="Mentransfer">Mentransfer</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-600 mb-1">
                {edited.questionType === 'Essay' ? 'Bobot Nilai' : 'Kunci Jawaban'}
              </label>
              {edited.questionType === 'Essay' ? (
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={edited.maxScore || 20}
                  onChange={(e) => setEdited({ ...edited, maxScore: Number(e.target.value) })}
                  className="w-full bg-purple-50 border border-purple-300 rounded-md p-1 font-bold text-purple-900"
                />
              ) : (
                <select
                  id="select-correct-key"
                  value={edited.correctKey}
                  onChange={(e) => setEdited({ ...edited, correctKey: e.target.value as 'A'|'B'|'C'|'D' })}
                  className="w-full bg-sky-50 border border-sky-300 rounded-md p-1 font-bold text-sky-800"
                >
                  <option value="A">Kunci: A</option>
                  <option value="B">Kunci: B</option>
                  <option value="C">Kunci: C</option>
                  <option value="D">Kunci: D</option>
                </select>
              )}
            </div>
          </div>

          {/* Stimulus */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Stimulus (Kasus Nyata / Dilema Moral / Data Kontekstual)
            </label>
            <textarea
              id="textarea-stimulus"
              rows={3}
              value={edited.stimulus}
              onChange={(e) => setEdited({ ...edited, stimulus: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Pokok Soal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pokok Soal (Stem)
            </label>
            <textarea
              id="textarea-stem"
              rows={2}
              value={edited.questionText}
              onChange={(e) => setEdited({ ...edited, questionText: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Options for PG or Model Answer / Rubric for Essay */}
          {edited.questionType === 'Essay' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-purple-900 mb-1">
                  Model / Contoh Jawaban Ideal Guru (Uraian)
                </label>
                <textarea
                  id="textarea-model-answer"
                  rows={3}
                  value={edited.modelAnswer || edited.explanation}
                  onChange={(e) => setEdited({ ...edited, modelAnswer: e.target.value })}
                  placeholder="Tuliskan model jawaban ideal yang mencakup analisis konsep, dalil pendukung, dan kesimpulan..."
                  className="w-full bg-purple-50/50 border border-purple-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-purple-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rubrik Penskoran Analitis (Tingkat Kognitif: {edited.bloomLevel})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[4, 3, 2, 1].map((sc) => {
                    const criterion = (edited.rubricCriteria || []).find(r => r.score === sc) || {
                      score: sc,
                      label: sc === 4 ? 'Sangat Baik' : sc === 3 ? 'Baik' : sc === 2 ? 'Cukup' : 'Kurang',
                      description: ''
                    };
                    return (
                      <div key={sc} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                        <div className="font-bold text-sky-800 text-[11px] flex justify-between">
                          <span>Skor {sc} — {criterion.label}</span>
                        </div>
                        <textarea
                          rows={2}
                          value={criterion.description}
                          onChange={(e) => {
                            const newDesc = e.target.value;
                            const current = [...(edited.rubricCriteria || [
                              { score: 4, label: 'Sangat Baik', description: '' },
                              { score: 3, label: 'Baik', description: '' },
                              { score: 2, label: 'Cukup', description: '' },
                              { score: 1, label: 'Kurang', description: '' }
                            ])];
                            const idx = current.findIndex(r => r.score === sc);
                            if (idx >= 0) {
                              current[idx] = { ...current[idx], description: newDesc };
                            } else {
                              current.push({ score: sc, label: criterion.label, description: newDesc });
                            }
                            setEdited({ ...edited, rubricCriteria: current });
                          }}
                          placeholder={`Kriteria untuk skor ${sc}...`}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 text-[11px] text-slate-800"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pilihan Jawaban (A, B, C, D) — Pilih radio untuk menentukan kunci (Bernada Positif & Seimbang)
              </label>
              <div className="space-y-2">
                {(['A', 'B', 'C', 'D'] as const).map(key => {
                  const opt = edited.options?.find(o => o.key === key);
                  const isKey = edited.correctKey === key;
                  return (
                    <div
                      key={key}
                      className={`flex items-start space-x-2 p-2 rounded-lg border transition-all ${
                        isKey ? 'bg-sky-50/80 border-sky-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setEdited({ ...edited, correctKey: key })}
                        className={`mt-1 font-bold text-xs px-2 py-0.5 rounded border transition-colors ${
                          isKey
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                        }`}
                        title="Klik untuk jadikan kunci jawaban"
                      >
                        {key} {isKey && '✓'}
                      </button>
                      <textarea
                        rows={2}
                        value={opt?.text || ''}
                        onChange={(e) => handleOptionChange(key, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-sky-500"
                        placeholder={`Teks pilihan ${key}...`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Explanation and Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alasan Kunci Jawaban (Pedagogik)
              </label>
              <textarea
                id="textarea-explanation"
                rows={2}
                value={edited.explanation}
                onChange={(e) => setEdited({ ...edited, explanation: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Karakter & Nilai Islami yang Diuji
              </label>
              <textarea
                id="textarea-islamic-value"
                rows={2}
                value={edited.islamicValue}
                onChange={(e) => setEdited({ ...edited, islamicValue: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* AI Refine Box */}
          <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="flex-1 w-full">
              <input
                id="input-refine-prompt"
                type="text"
                value={aiInstruction}
                onChange={(e) => setAiInstruction(e.target.value)}
                placeholder="Instruksi AI: Contoh 'Buat stimulus lebih tajam dan tingkatkan ke C5'"
                className="w-full bg-white border border-sky-300 rounded-md px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>
            <button
              id="btn-refine-ai"
              type="button"
              onClick={handleAiRefine}
              disabled={isAiPolishing}
              className="w-full sm:w-auto bg-sky-700 hover:bg-sky-800 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isAiPolishing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Sempurnakan via AI</span>
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end space-x-2">
          <button
            id="btn-cancel-edit-modal"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-md text-xs font-semibold text-slate-600"
          >
            Batal
          </button>
          <button
            id="btn-save-edit-modal"
            onClick={handleSave}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
