import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserData } from '../types';
import { trashOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
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

interface HomeProps {
  userData: UserData;
  onDictionaryDelete: (dictionaryId: string) => void;
}

export default function Home({ userData, onDictionaryDelete }: HomeProps) {
  const allWords = userData.dictionaries.flatMap((dict) => dict.words);
  const totalWords = allWords.length;
  const [dictionaryToDelete, setDictionaryToDelete] = useState<string | null>(
    null
  );
  const { theme } = useTheme();

  const handleDeleteClick = (dictionaryId: string) => {
    setDictionaryToDelete(dictionaryId);
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with Stats */}
        <div
          className={`${
            theme === 'dark'
              ? 'bg-[#2a2a2a] border-teal-400'
              : 'bg-white border-teal-500'
          } p-6 rounded-lg border border-opacity-20 mb-8`}
        >
          <h1
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
            } mb-4`}
          >
            Olá, {userData.name}! 👋
          </h1>
          <div
            className={`${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            {totalWords === 0 ? (
              <p>
                Você ainda não adicionou nenhuma palavra. Que tal começar
                criando seu primeiro dicionário? 🚀
              </p>
            ) : (
              <p>
                Você já aprendeu{' '}
                <span
                  className={`${
                    theme === 'dark' ? 'text-teal-300' : 'text-teal-500'
                  } font-bold text-xl`}
                >
                  {totalWords}
                </span>{' '}
                {totalWords === 1 ? 'palavra' : 'palavras'} em{' '}
                <span
                  className={`${
                    theme === 'dark' ? 'text-teal-300' : 'text-teal-500'
                  } font-bold text-xl`}
                >
                  {userData.dictionaries.length}
                </span>{' '}
                {userData.dictionaries.length === 1
                  ? 'dicionário'
                  : 'dicionários'}
                !{' '}
                {totalWords >= 100
                  ? '🎉 Incrível! Você é imparável!'
                  : totalWords >= 50
                  ? '🌟 Muito bem! Continue assim!'
                  : totalWords >= 10
                  ? '💪 Você está no caminho certo!'
                  : '🌱 Você está começando sua jornada!'}
              </p>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {dictionaryToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`${
                theme === 'dark'
                  ? 'bg-[#2a2a2a] border-gray-700'
                  : 'bg-white border-gray-200'
              } p-6 rounded-lg w-full max-w-md border`}
            >
              <h2
                className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                } mb-4`}
              >
                Confirmar Exclusão
              </h2>
              <p
                className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                } mb-6`}
              >
                Tem certeza que deseja excluir este dicionário? Esta ação não
                pode ser desfeita.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDictionaryToDelete(null)}
                  className={`px-4 py-2 rounded-md cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (dictionaryToDelete) {
                      onDictionaryDelete(dictionaryToDelete);
                      setDictionaryToDelete(null);
                    }
                  }}
                  className={`px-4 py-2 rounded-md cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dictionaries Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-xl font-bold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Seus Dicionários
            </h2>
            <Link
              to="/new-dictionary"
              className={`px-4 py-2 ${
                theme === 'dark'
                  ? 'bg-teal-400 text-black hover:bg-teal-500'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              } rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark' ? 'focus:ring-teal-400' : 'focus:ring-teal-500'
              } font-medium`}
            >
              Novo Dicionário
            </Link>
          </div>

          {userData.dictionaries.length === 0 ? (
            <div
              className={`${
                theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
              } p-6 rounded-lg text-center`}
            >
              <p
                className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                } mb-4`}
              >
                Você ainda não tem nenhum dicionário
              </p>
              <Link
                to="/new-dictionary"
                className={`${
                  theme === 'dark'
                    ? 'text-teal-400 hover:text-teal-500'
                    : 'text-teal-600 hover:text-teal-700'
                }`}
              >
                Criar meu primeiro dicionário →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {userData.dictionaries.map((dictionary) => (
                <div
                  key={dictionary.id}
                  className={`${
                    theme === 'dark'
                      ? 'bg-[#2a2a2a] border-gray-700 hover:border-teal-400'
                      : 'bg-white border-gray-200 hover:border-teal-500'
                  } p-6 rounded-lg border transition-colors`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <Link
                      to={`/dictionary/${dictionary.id}`}
                      className={`text-lg font-bold ${
                        theme === 'dark'
                          ? 'text-teal-400 hover:text-teal-500'
                          : 'text-teal-600 hover:text-teal-700'
                      } flex items-center`}
                    >
                      <span
                        className={`${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                        }`}
                      >
                        {LANGUAGE_MAP[dictionary.sourceLanguage]?.flag}{' '}
                        {LANGUAGE_MAP[dictionary.sourceLanguage]?.code}
                      </span>
                      <span
                        className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        →
                      </span>
                      <span
                        className={`${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                        }`}
                      >
                        {LANGUAGE_MAP[dictionary.targetLanguage]?.flag}{' '}
                        {LANGUAGE_MAP[dictionary.targetLanguage]?.code}
                      </span>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(dictionary.id)}
                      className={`p-2 rounded-md cursor-pointer ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-red-900/30'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <IonIcon icon={trashOutline} className="text-xl" />
                    </button>
                  </div>
                  <div
                    className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {dictionary.words.length}{' '}
                    {dictionary.words.length === 1 ? 'palavra' : 'palavras'}
                    <br />
                    Última atualização:{' '}
                    {dictionary.words[0]?.timestamp ||
                      'Nenhuma palavra adicionada'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
