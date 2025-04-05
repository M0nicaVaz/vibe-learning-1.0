import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dictionary, UserData } from '../types';

interface NewDictionaryProps {
  onSave: (dictionary: Dictionary) => void;
  userData: UserData;
}

const COMMON_LANGUAGES = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'Inglês' },
  { code: 'es', name: 'Espanhol' },
  { code: 'fr', name: 'Francês' },
  { code: 'de', name: 'Alemão' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: 'Japonês' },
  { code: 'ko', name: 'Coreano' },
  { code: 'zh', name: 'Chinês' },
  { code: 'ru', name: 'Russo' },
  { code: 'ar', name: 'Árabe' },
  { code: 'hi', name: 'Hindi' },
] as const;

export default function NewDictionary({
  onSave,
  userData,
}: NewDictionaryProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sourceLanguage: '',
    targetLanguage: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sourceLanguage || !formData.targetLanguage) return;

    const sourceName = COMMON_LANGUAGES.find(
      (lang) => lang.code === formData.sourceLanguage
    )?.name;
    const targetName = COMMON_LANGUAGES.find(
      (lang) => lang.code === formData.targetLanguage
    )?.name;

    if (!sourceName || !targetName) return;

    // Check if a dictionary with these languages already exists
    const existingDictionary = userData.dictionaries.find(
      (dict) =>
        (dict.sourceLanguage === sourceName &&
          dict.targetLanguage === targetName) ||
        (dict.sourceLanguage === targetName &&
          dict.targetLanguage === sourceName)
    );

    if (existingDictionary) {
      setError('Você já tem um dicionário com esses idiomas');
      return;
    }

    const newDictionary: Dictionary = {
      id: Date.now().toString(),
      sourceLanguage: sourceName,
      targetLanguage: targetName,
      words: [],
    };

    onSave(newDictionary);
    navigate(`/dictionary/${newDictionary.id}`);
  };

  return (
    <div className="min-h-screen p-4 bg-[#212121]">
      <div className="max-w-xl mx-auto">
        <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
          <h1 className="text-2xl font-bold text-[#4DE082] mb-6">
            Novo Dicionário
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <div>
              <label
                htmlFor="sourceLanguage"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Idioma de Origem
              </label>
              <select
                id="sourceLanguage"
                required
                className="w-full px-4 py-2 bg-[#333] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4DE082] focus:border-transparent"
                value={formData.sourceLanguage}
                onChange={(e) => {
                  setFormData({ ...formData, sourceLanguage: e.target.value });
                  setError(null);
                }}
              >
                <option value="">Selecione o idioma</option>
                {COMMON_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="targetLanguage"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Idioma de Destino
              </label>
              <select
                id="targetLanguage"
                required
                className="w-full px-4 py-2 bg-[#333] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4DE082] focus:border-transparent"
                value={formData.targetLanguage}
                onChange={(e) => {
                  setFormData({ ...formData, targetLanguage: e.target.value });
                  setError(null);
                }}
              >
                <option value="">Selecione o idioma</option>
                {COMMON_LANGUAGES.filter(
                  (lang) => lang.code !== formData.sourceLanguage
                ).map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#4DE082] text-black rounded-md hover:bg-[#44C975] focus:outline-none focus:ring-2 focus:ring-[#4DE082] font-medium"
              >
                Criar Dicionário
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
