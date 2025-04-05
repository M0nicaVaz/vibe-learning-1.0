import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dictionary } from '../types';
import { useTheme } from '../context/ThemeContext';

// Language mapping for flags and codes
const LANGUAGE_MAP: Record<string, { code: string; flag: string }> = {
  Português: { code: 'PT', flag: '🇧🇷' },
  Inglês: { code: 'EN', flag: '🇬🇧' },
  Espanhol: { code: 'ES', flag: '🇪🇸' },
  Francês: { code: 'FR', flag: '🇫🇷' },
  Alemão: { code: 'DE', flag: '🇩🇪' },
  Italiano: { code: 'IT', flag: '🇮🇹' },
  Japonês: { code: 'JP', flag: '🇯🇵' },
  Coreano: { code: 'KR', flag: '🇰🇷' },
  Chinês: { code: 'CN', flag: '🇨🇳' },
  Russo: { code: 'RU', flag: '🇷🇺' },
  Árabe: { code: 'AR', flag: '🇸🇦' },
  Hindi: { code: 'HI', flag: '🇮🇳' },
};

interface NewDictionaryProps {
  onDictionaryCreate: (dictionary: Dictionary) => void;
  userData: {
    dictionaries: Dictionary[];
  };
}

export default function NewDictionary({
  onDictionaryCreate,
  userData,
}: NewDictionaryProps) {
  const navigate = useNavigate();
  const [sourceLanguage, setSourceLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if a dictionary with the same language pair already exists
    const existingDictionary = userData.dictionaries.find(
      (dict) =>
        (dict.sourceLanguage === sourceLanguage &&
          dict.targetLanguage === targetLanguage) ||
        (dict.sourceLanguage === targetLanguage &&
          dict.targetLanguage === sourceLanguage)
    );

    if (existingDictionary) {
      setError(
        'Já existe um dicionário com este par de idiomas. Por favor, escolha outro par.'
      );
      return;
    }

    if (sourceLanguage === targetLanguage) {
      setError('Os idiomas de origem e destino não podem ser iguais.');
      return;
    }

    const newDictionary: Dictionary = {
      id: Date.now().toString(),
      sourceLanguage,
      targetLanguage,
      words: [],
    };

    onDictionaryCreate(newDictionary);
    navigate('/');
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className={`${
            theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
          } p-6 rounded-lg border ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <h1
            className={`text-2xl font-bold mb-6 ${
              theme === 'dark' ? 'text-[#4DE082]' : 'text-teal-600'
            }`}
          >
            Criar Novo Dicionário
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label
                htmlFor="sourceLanguage"
                className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Idioma de Origem
              </label>
              <select
                id="sourceLanguage"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-300'
                    : 'bg-white border-gray-300 text-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              >
                <option value="">Selecione o idioma</option>
                {Object.keys(LANGUAGE_MAP).map((lang) => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_MAP[lang].flag} {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="targetLanguage"
                className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Idioma de Destino
              </label>
              <select
                id="targetLanguage"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-300'
                    : 'bg-white border-gray-300 text-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              >
                <option value="">Selecione o idioma</option>
                {Object.keys(LANGUAGE_MAP).map((lang) => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_MAP[lang].flag} {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <Link
                to="/"
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-[#5AFF91] text-black hover:bg-[#4DE082]'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
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
