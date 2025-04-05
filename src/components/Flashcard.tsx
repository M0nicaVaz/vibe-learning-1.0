import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserData, WordEntry } from '../types';
import {
  chevronBackOutline,
  chevronForwardOutline,
  refreshOutline,
  checkmarkOutline,
} from 'ionicons/icons';
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
  const [userAnswer, setUserAnswer] = useState('');
  const [answerStatus, setAnswerStatus] = useState<
    'correct' | 'incorrect' | null
  >(null);

  useEffect(() => {
    const currentDictionary = userData.dictionaries.find((d) => d.id === id);
    if (currentDictionary) {
      setDictionary(currentDictionary);
      setWords(currentDictionary.words);
      setCurrentIndex(0);
      setIsFlipped(false);
      setUserAnswer('');
      setAnswerStatus(null);
    }
  }, [id, userData.dictionaries]);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setUserAnswer('');
      setAnswerStatus(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setUserAnswer('');
      setAnswerStatus(null);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setUserAnswer('');
    setAnswerStatus(null);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const correctTranslation = words[currentIndex]?.translation || '';
    const isCorrect =
      userAnswer.trim().toLowerCase() === correctTranslation.toLowerCase();

    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    setIsFlipped(true);
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
                theme === 'dark' ? 'text-gray-200' : 'text-teal-600'
              }`}
            >
              {dictionary && LANGUAGE_MAP[dictionary.sourceLanguage]?.flag}{' '}
              {dictionary.sourceLanguage} → {dictionary.targetLanguage}{' '}
              {dictionary && LANGUAGE_MAP[dictionary.targetLanguage]?.flag}
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
          <div className="max-w-2xl w-full mx-auto">
            <div className={`flashcard ${isFlipped ? 'flipped' : ''} w-full`}>
              <div className="flashcard-inner w-full">
                <div
                  className={`flashcard-front ${
                    theme === 'dark'
                      ? 'bg-[#2a2a2a] text-white'
                      : 'bg-white text-gray-800'
                  } shadow-lg w-full`}
                >
                  <div className="flex flex-col items-center p-6">
                    <div className="text-4xl mb-4">
                      {dictionary &&
                        LANGUAGE_MAP[dictionary.targetLanguage]?.flag}
                    </div>
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
                  } shadow-lg w-full`}
                >
                  <div className="flex flex-col items-center p-6">
                    <div className="text-4xl mb-4">
                      {dictionary &&
                        LANGUAGE_MAP[dictionary.sourceLanguage]?.flag}
                    </div>
                    <div className="text-2xl font-medium">
                      {words[currentIndex]?.translation ||
                        'Nenhuma tradução disponível'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer input form - moved outside the flashcard */}
            <div className="mt-8">
              <form onSubmit={handleAnswerSubmit} className="w-full">
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Digite a tradução..."
                    className={`w-full px-4 py-3 rounded-md mb-3 ${
                      theme === 'dark'
                        ? 'bg-[#212121] text-white border-gray-700'
                        : 'bg-gray-50 text-gray-800 border-gray-200'
                    } border focus:outline-none focus:ring-2 ${
                      theme === 'dark'
                        ? 'focus:ring-teal-400'
                        : 'focus:ring-teal-500'
                    } text-lg`}
                  />
                  <button
                    type="submit"
                    className={`px-6 py-3 rounded-md flex items-center text-lg font-medium ${
                      theme === 'dark'
                        ? 'bg-teal-400 text-black hover:bg-teal-500'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    <IonIcon icon={checkmarkOutline} className="mr-2 text-xl" />
                    Verificar resposta
                  </button>
                </div>
              </form>

              {/* Answer feedback */}
              {answerStatus && (
                <div
                  className={`mt-4 p-4 rounded-md w-full text-center text-lg ${
                    answerStatus === 'correct'
                      ? theme === 'dark'
                        ? 'bg-green-800 text-green-200'
                        : 'bg-green-100 text-green-800'
                      : theme === 'dark'
                      ? 'bg-red-800 text-red-200'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {answerStatus === 'correct' ? (
                    <p className="flex items-center justify-center">
                      <span className="text-2xl mr-2">🎉</span> Parabéns! Você
                      acertou! <span className="text-2xl ml-2">🎉</span>
                    </p>
                  ) : (
                    <p className="flex flex-col items-center">
                      <span className="text-2xl mb-2">😕</span>
                      <span>Ops! A tradução correta é:</span>
                      <span className="font-medium mt-1">
                        {words[currentIndex]?.translation}
                      </span>
                    </p>
                  )}
                </div>
              )}
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
