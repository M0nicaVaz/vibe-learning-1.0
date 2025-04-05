import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserData } from '../types';
import { trashOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

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

interface DeleteDialogProps {
  dictionary: {
    id: string;
    sourceLanguage: string;
    targetLanguage: string;
    words: { length: number };
  };
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteDialog({ dictionary, onConfirm, onCancel }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2a2a2a] p-6 rounded-lg w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-[#4DE082]">
          Excluir Dicionário
        </h2>
        <p className="text-gray-300 mb-6">
          Tem certeza que deseja excluir o dicionário{' '}
          {dictionary.sourceLanguage} → {dictionary.targetLanguage}? Esta ação
          irá remover permanentemente todas as {dictionary.words.length}{' '}
          {dictionary.words.length === 1
            ? 'palavra cadastrada'
            : 'palavras cadastradas'}
          .
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home({ userData, onDictionaryDelete }: HomeProps) {
  const allWords = userData.dictionaries.flatMap((dict) => dict.words);
  const totalWords = allWords.length;
  const [dictionaryToDelete, setDictionaryToDelete] = useState<string | null>(
    null
  );

  const handleDeleteClick = (dictionaryId: string) => {
    setDictionaryToDelete(dictionaryId);
  };

  const handleDeleteConfirm = () => {
    if (dictionaryToDelete) {
      onDictionaryDelete(dictionaryToDelete);
      setDictionaryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDictionaryToDelete(null);
  };

  return (
    <div className="min-h-screen p-4 bg-[#212121]">
      <div className="max-w-4xl mx-auto">
        {/* Header with Stats */}
        <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#4DE082] border-opacity-20 mb-8">
          <h1 className="text-2xl font-bold text-[#4DE082] mb-4">
            Olá, {userData.name}! 👋
          </h1>
          <div className="text-gray-200">
            {totalWords === 0 ? (
              <p>
                Você ainda não adicionou nenhuma palavra. Que tal começar
                criando seu primeiro dicionário? 🚀
              </p>
            ) : (
              <p>
                Você já aprendeu{' '}
                <span className="text-[#5AFF91] font-bold text-xl">
                  {totalWords}
                </span>{' '}
                {totalWords === 1 ? 'palavra' : 'palavras'} em{' '}
                <span className="text-[#5AFF91] font-bold text-xl">
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
                  ? '👏 Ótimo progresso!'
                  : '💪 Continue assim!'}
              </p>
            )}
          </div>
        </div>

        {/* Dictionaries Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-200">
              Seus Dicionários
            </h2>
            <Link
              to="/new-dictionary"
              className="px-4 py-2 bg-[#4DE082] text-black rounded-md hover:bg-[#44C975] focus:outline-none focus:ring-2 focus:ring-[#4DE082] font-medium"
            >
              Novo Dicionário
            </Link>
          </div>

          {userData.dictionaries.length === 0 ? (
            <div className="bg-[#2a2a2a] p-6 rounded-lg text-center">
              <p className="text-gray-300 mb-4">
                Você ainda não tem nenhum dicionário
              </p>
              <Link
                to="/new-dictionary"
                className="text-[#4DE082] hover:text-[#44C975]"
              >
                Criar meu primeiro dicionário →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {userData.dictionaries.map((dictionary) => (
                <div
                  key={dictionary.id}
                  className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 hover:border-[#4DE082] transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Link
                      to={`/dictionary/${dictionary.id}`}
                      className="text-lg font-bold text-[#5AFF91] hover:text-[#4DE082] flex items-center"
                    >
                      <span className="text-gray-200">
                        {LANGUAGE_MAP[dictionary.sourceLanguage]?.flag}{' '}
                        {LANGUAGE_MAP[dictionary.sourceLanguage]?.code}
                      </span>
                      <span className="text-gray-400 mx-1">→</span>
                      <span className="text-gray-200">
                        {LANGUAGE_MAP[dictionary.targetLanguage]?.flag}{' '}
                        {LANGUAGE_MAP[dictionary.targetLanguage]?.code}
                      </span>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(dictionary.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      <IonIcon icon={trashOutline} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-400">
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

        {/* Recent Words Section */}
        {allWords.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-200 mb-6">
              Palavras Recentes
            </h2>
            <div className="space-y-4">
              {allWords
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
                )
                .slice(0, 5)
                .map((word) => {
                  const dictionary = userData.dictionaries.find(
                    (d) => d.id === word.dictionaryId
                  )!;
                  return (
                    <div
                      key={word.id}
                      className="bg-[#2a2a2a] p-4 rounded-lg border border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-bold text-[#5AFF91]">
                              {word.word}
                            </span>
                            <span className="text-sm text-gray-400 flex items-center">
                              {LANGUAGE_MAP[dictionary.sourceLanguage]?.flag}{' '}
                              {LANGUAGE_MAP[dictionary.sourceLanguage]?.code} →{' '}
                              {LANGUAGE_MAP[dictionary.targetLanguage]?.flag}{' '}
                              {LANGUAGE_MAP[dictionary.targetLanguage]?.code}
                            </span>
                          </div>
                          <p className="text-gray-300">{word.translation}</p>
                        </div>
                        <Link
                          to={`/dictionary/${dictionary.id}`}
                          className="text-sm text-[#4DE082] hover:text-[#44C975]"
                        >
                          Ver dicionário →
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {dictionaryToDelete && (
          <DeleteDialog
            dictionary={
              userData.dictionaries.find((d) => d.id === dictionaryToDelete)!
            }
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        )}
      </div>
    </div>
  );
}
