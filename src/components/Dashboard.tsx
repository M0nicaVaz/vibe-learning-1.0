import { useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { UserData, WordEntry } from '../types';
import { trashOutline, addOutline, pencilOutline } from 'ionicons/icons';
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

interface DashboardProps {
  userData: UserData;
  onWordsUpdate: (dictionaryId: string, words: WordEntry[]) => void;
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

interface DeleteWordDialogProps {
  word: WordEntry;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteDialog({ dictionary, onConfirm, onCancel }: DeleteDialogProps) {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          theme === 'dark'
            ? 'bg-[#2a2a2a] border-gray-700'
            : 'bg-white border-gray-200'
        } p-6 rounded-lg w-full max-w-md border`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
          }`}
        >
          Excluir Dicionário
        </h2>
        <p
          className={`${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          } mb-6`}
        >
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

function DeleteWordDialog({
  word,
  onConfirm,
  onCancel,
}: DeleteWordDialogProps) {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div
        className={`${
          theme === 'dark'
            ? 'bg-[#2a2a2a] border-gray-700'
            : 'bg-white border-gray-200'
        } p-6 rounded-lg w-full max-w-md border`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
          }`}
        >
          Excluir Palavra
        </h2>
        <p
          className={`${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          } mb-6`}
        >
          Tem certeza que deseja excluir a palavra "{word.word}"?
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

export default function Dashboard({
  userData,
  onWordsUpdate,
  onDictionaryDelete,
}: DashboardProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const dictionary = userData.dictionaries.find((d) => d.id === id);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<WordEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [wordToDelete, setWordToDelete] = useState<WordEntry | null>(null);
  const [formData, setFormData] = useState({
    word: '',
    translation: '',
    phonetics: '',
  });
  const { theme } = useTheme();

  if (!dictionary) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word || !formData.translation) return;

    const newWord: WordEntry = {
      id: editingWord?.id || Date.now().toString(),
      word: formData.word,
      translation: formData.translation,
      phonetics: formData.phonetics || undefined,
      dictionaryId: dictionary.id,
      timestamp: new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      }),
    };

    let newWords: WordEntry[];
    if (editingWord) {
      newWords = dictionary.words.map((w) =>
        w.id === editingWord.id ? newWord : w
      );
    } else {
      newWords = [newWord, ...dictionary.words];
    }

    onWordsUpdate(dictionary.id, newWords);
    setFormData({
      word: '',
      translation: '',
      phonetics: '',
    });
    setEditingWord(null);
    setIsFormOpen(false);
  };

  const handleEdit = (word: WordEntry) => {
    setEditingWord(word);
    setFormData({
      word: word.word,
      translation: word.translation,
      phonetics: word.phonetics || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = (word: WordEntry) => {
    setWordToDelete(word);
  };

  const handleDeleteConfirm = () => {
    if (wordToDelete) {
      const newWords = dictionary.words.filter((w) => w.id !== wordToDelete.id);
      onWordsUpdate(dictionary.id, newWords);
      setWordToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setWordToDelete(null);
  };

  const handleDictionaryDelete = () => {
    onDictionaryDelete(dictionary.id);
    navigate('/');
  };

  const filteredWords = dictionary.words.filter((word) =>
    word.word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={`${
            theme === 'dark'
              ? 'bg-[#2a2a2a] border-teal-400'
              : 'bg-white border-teal-500'
          } p-6 rounded-lg border border-opacity-20 mb-8`}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1
                className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-teal-300' : 'text-teal-600'
                }`}
              >
                <span
                  className={`${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                  }`}
                >
                  {LANGUAGE_MAP[dictionary.sourceLanguage]?.flag}{' '}
                  {dictionary.sourceLanguage}
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
                  {dictionary.targetLanguage}
                </span>
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(true)}
                className={`p-1.5 ${
                  theme === 'dark'
                    ? 'text-red-300 hover:text-red-400'
                    : 'text-red-300 hover:text-red-400'
                } rounded-md focus:outline-none`}
              >
                <IonIcon icon={trashOutline} className="text-lg" />
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className={`px-3 py-1.5 ${
                  theme === 'dark'
                    ? 'bg-teal-400 text-black hover:bg-teal-500'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                } rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'focus:ring-teal-400'
                    : 'focus:ring-teal-500'
                } font-medium flex items-center gap-2`}
              >
                <IonIcon icon={addOutline} className="text-lg" /> Nova Palavra
              </button>
            </div>
          </div>
          <div
            className={`${
              theme === 'dark'
                ? 'bg-[#2a2a2a] p-4 rounded-lg border border-gray-700'
                : 'bg-white p-4 rounded-lg border border-gray-200'
            } mt-4`}
          >
            <p
              className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              } text-center`}
            >
              {dictionary.words.length === 0 ? (
                <>Você ainda não adicionou nada, que tal começar? 🚀</>
              ) : (
                <>
                  Você já adicionou{' '}
                  <span
                    className={`${
                      theme === 'dark'
                        ? 'text-teal-300 font-bold text-xl'
                        : 'text-teal-600 font-bold text-xl'
                    }`}
                  >
                    {dictionary.words.length}
                  </span>{' '}
                  {dictionary.words.length === 1 ? 'palavra' : 'palavras'} até
                  agora! Continue assim! 🎉
                </>
              )}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Buscar palavra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-3 ${
              theme === 'dark'
                ? 'bg-[#2a2a2a] text-white border-gray-700'
                : 'bg-white text-gray-900 border-gray-300'
            } rounded-lg focus:outline-none focus:ring-2 ${
              theme === 'dark' ? 'focus:ring-teal-400' : 'focus:ring-teal-500'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              ×
            </button>
          )}
        </div>

        {/* Word List */}
        <div className="space-y-4">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className={`${
                theme === 'dark'
                  ? 'bg-[#2a2a2a] border-gray-700'
                  : 'bg-white border-gray-200'
              } p-4 rounded-lg border`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className={`${
                        theme === 'dark'
                          ? 'text-xl font-bold text-teal-300'
                          : 'text-teal-600'
                      }`}
                    >
                      {word.word}
                    </h3>
                  </div>
                  <p
                    className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } text-lg`}
                  >
                    {word.translation}
                  </p>
                  {word.phonetics && (
                    <p
                      className={`${
                        theme === 'dark'
                          ? 'text-gray-400 mt-1 font-mono text-sm'
                          : 'text-gray-500 mt-2'
                      }`}
                    >
                      /{word.phonetics}/
                    </p>
                  )}
                  <p
                    className={`${
                      theme === 'dark'
                        ? 'text-xs text-gray-500 mt-2'
                        : 'text-xs text-gray-500 mt-2'
                    }`}
                  >
                    {word.timestamp}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(word)}
                    className={`${
                      theme === 'dark'
                        ? 'text-teal-400 hover:text-teal-500'
                        : 'text-teal-600 hover:text-teal-700'
                    } p-2 text-sm`}
                  >
                    <IonIcon icon={pencilOutline} className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(word)}
                    className={`${
                      theme === 'dark'
                        ? 'text-red-500 hover:text-red-400'
                        : 'text-red-500 hover:text-red-400'
                    } p-2 text-sm`}
                  >
                    <IonIcon icon={trashOutline} className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Word Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div
              className={`${
                theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
              } p-6 rounded-lg w-full max-w-md`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                }`}
              >
                {editingWord ? 'Editar Palavra' : 'Nova Palavra'}
              </h2>
              <form
                onSubmit={handleSubmit}
                className={`space-y-4 ${
                  theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
                }`}
              >
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-1`}
                  >
                    Palavra
                  </label>
                  <input
                    type="text"
                    maxLength={240}
                    required
                    className={`w-full px-4 py-2 ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2a] text-white border-gray-700'
                        : 'bg-white text-gray-900 border-gray-300'
                    } rounded-md border focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'focus:ring-teal-400'
                        : 'focus:ring-teal-500'
                    }`}
                    value={formData.word}
                    onChange={(e) =>
                      setFormData({ ...formData, word: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-1`}
                  >
                    Tradução
                  </label>
                  <input
                    type="text"
                    required
                    className={`w-full px-4 py-2 ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2a] text-white border-gray-700'
                        : 'bg-white text-gray-900 border-gray-300'
                    } rounded-md border focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'focus:ring-teal-400'
                        : 'focus:ring-teal-500'
                    }`}
                    value={formData.translation}
                    onChange={(e) =>
                      setFormData({ ...formData, translation: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    } mb-1`}
                  >
                    Fonética (opcional)
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 ${
                      theme === 'dark'
                        ? 'bg-[#2a2a2a] text-white border-gray-700'
                        : 'bg-white text-gray-900 border-gray-300'
                    } rounded-md border focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'focus:ring-teal-400'
                        : 'focus:ring-teal-500'
                    }`}
                    value={formData.phonetics}
                    onChange={(e) =>
                      setFormData({ ...formData, phonetics: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingWord(null);
                      setFormData({
                        word: '',
                        translation: '',
                        phonetics: '',
                      });
                    }}
                    className={`px-4 py-2 ${
                      theme === 'dark'
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'focus:ring-gray-500'
                        : 'focus:ring-gray-400'
                    } font-medium`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 ${
                      theme === 'dark'
                        ? 'bg-teal-400 text-black hover:bg-teal-500'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    } rounded-md focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'focus:ring-teal-400'
                        : 'focus:ring-teal-500'
                    } font-medium`}
                  >
                    {editingWord ? 'Salvar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Dictionary Dialog */}
        {showDeleteDialog && (
          <DeleteDialog
            dictionary={dictionary}
            onConfirm={handleDictionaryDelete}
            onCancel={() => setShowDeleteDialog(false)}
          />
        )}

        {/* Delete Word Dialog */}
        {wordToDelete && (
          <DeleteWordDialog
            word={wordToDelete}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        )}
      </div>
    </div>
  );
}
