import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserData, WordEntry } from '../types';
import {
  chevronBackOutline,
  chevronForwardOutline,
  refreshOutline,
} from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useTheme } from '../context/ThemeContext';

interface FlashcardProps {
  userData: UserData;
}

export default function Flashcard({ userData }: FlashcardProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [dictionary, setDictionary] = useState<{
    id: string;
    sourceLanguage: string;
    targetLanguage: string;
  } | null>(null);

  useEffect(() => {
    const currentDictionary = userData.dictionaries.find((d) => d.id === id);
    if (currentDictionary) {
      setDictionary(currentDictionary);
      setWords(currentDictionary.words);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [id, userData.dictionaries]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!dictionary) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
        }`}
      >
        <div
          className={`${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          } text-center`}
        >
          <p className="text-xl mb-4">Dicionário não encontrado</p>
          <button
            onClick={() => navigate('/')}
            className={`px-4 py-2 rounded-md ${
              theme === 'dark'
                ? 'bg-teal-400 text-black hover:bg-teal-500'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            Voltar para o início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <div
        className={`${
          theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
        } p-4 shadow-sm`}
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/dictionary/${dictionary.id}`)}
              className={`mr-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <IonIcon icon={chevronBackOutline} className="text-xl" />
            </button>
            <h1
              className={`text-xl font-bold ${
                theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
              }`}
            >
              Flashcards: {dictionary.sourceLanguage} →{' '}
              {dictionary.targetLanguage}
            </h1>
          </div>
          <div className="flex items-center">
            <span
              className={`${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              } mr-4`}
            >
              {currentIndex + 1} de {words.length}
            </span>
            <button
              onClick={handleShuffle}
              className={`p-2 rounded-full ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              title="Embaralhar cartões"
            >
              <IonIcon icon={refreshOutline} className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Flashcard Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {words.length === 0 ? (
          <div
            className={`${
              theme === 'dark'
                ? 'bg-[#2a2a2a] text-gray-300'
                : 'bg-white text-gray-700'
            } p-8 rounded-lg shadow-md max-w-md w-full text-center`}
          >
            <p className="text-xl mb-4">
              Nenhuma palavra cadastrada neste dicionário ainda.
            </p>
            <button
              onClick={() => navigate(`/dictionary/${dictionary.id}`)}
              className={`px-4 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-teal-400 text-black hover:bg-teal-500'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Adicionar palavras
            </button>
          </div>
        ) : (
          <div className="max-w-2xl w-full">
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
              <div className="flashcard-inner">
                <div
                  className={`flashcard-front ${
                    theme === 'dark'
                      ? 'bg-[#2a2a2a] text-white'
                      : 'bg-white text-gray-800'
                  } shadow-lg`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-medium mb-2">
                      {words[currentIndex]?.word ||
                        'Nenhuma palavra disponível'}
                    </div>
                    {words[currentIndex]?.phonetics && (
                      <div
                        className={`text-lg ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        /{words[currentIndex].phonetics}/
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`flashcard-back ${
                    theme === 'dark'
                      ? 'bg-[#2a2a2a] text-white'
                      : 'bg-white text-gray-800'
                  } shadow-lg`}
                >
                  <div className="text-2xl font-medium">
                    {words[currentIndex]?.translation ||
                      'Nenhuma tradução disponível'}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`p-3 rounded-full ${
                  currentIndex === 0
                    ? theme === 'dark'
                      ? 'text-gray-600'
                      : 'text-gray-300'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <IonIcon icon={chevronBackOutline} className="text-2xl" />
              </button>
              <button
                onClick={handleFlip}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-teal-400 text-black hover:bg-teal-500'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {isFlipped ? 'Ver palavra' : 'Ver tradução'}
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === words.length - 1}
                className={`p-3 rounded-full ${
                  currentIndex === words.length - 1
                    ? theme === 'dark'
                      ? 'text-gray-600'
                      : 'text-gray-300'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <IonIcon icon={chevronForwardOutline} className="text-2xl" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
