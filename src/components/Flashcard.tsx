import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserData } from '../types';
import { useTheme } from '../context/ThemeContext';
import TrainingSummary from './TrainingSummary';

interface FlashcardProps {
  userData: UserData;
}

export default function Flashcard({ userData }: FlashcardProps) {
  const { id } = useParams();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const dictionary = userData.dictionaries.find((d) => d.id === id);
  const words = dictionary?.words || [];

  useEffect(() => {
    if (id && userData.dictionaries) {
      setCurrentIndex(0);
      setUserAnswer('');
      setIsCorrect(null);
      setCorrectCount(0);
      setIncorrectCount(0);
      setShowSummary(false);
    }
  }, [id, userData.dictionaries]);

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const currentWord = words[currentIndex];
    const isAnswerCorrect =
      userAnswer.toLowerCase().trim() ===
      currentWord.translation.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setIncorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      // Show summary when all words have been trained
      setShowSummary(true);
    }
  };

  if (!dictionary) {
    return null;
  }

  if (showSummary) {
    return (
      <TrainingSummary
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        totalWords={words.length}
        dictionaryId={dictionary.id}
      />
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Palavra {currentIndex + 1} de {words.length}
            </span>
            <span
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {Math.round(((currentIndex + 1) / words.length) * 100)}%
            </span>
          </div>
          <div
            className={`h-2 rounded-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <div
              className={`h-full rounded-full ${
                theme === 'dark' ? 'bg-teal-400' : 'bg-teal-600'
              }`}
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div
          className={`mb-8 p-8 rounded-lg ${
            theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
          } shadow-lg`}
        >
          <div className="text-center mb-6">
            <h2
              className={`text-3xl font-bold ${
                theme === 'dark' ? 'text-teal-300' : 'text-teal-600'
              }`}
            >
              {currentWord.word}
            </h2>
            {currentWord.phonetics && (
              <p
                className={`mt-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                /{currentWord.phonetics}/
              </p>
            )}
          </div>

          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Digite a tradução..."
                className={`w-full px-4 py-3 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-[#1a1a1a] text-white border-gray-700'
                    : 'bg-white text-gray-900 border-gray-300'
                } border focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'focus:ring-teal-400'
                    : 'focus:ring-teal-500'
                }`}
                disabled={isCorrect !== null}
              />
            </div>
            <button
              type="submit"
              disabled={!userAnswer.trim() || isCorrect !== null}
              className={`w-full py-3 rounded-lg ${
                !userAnswer.trim() || isCorrect !== null
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-400'
                  : theme === 'dark'
                  ? 'bg-teal-400 text-black hover:bg-teal-500'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              } font-medium transition-colors`}
            >
              Verificar
            </button>
          </form>

          {isCorrect !== null && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                isCorrect
                  ? theme === 'dark'
                    ? 'bg-teal-400/20 text-teal-300'
                    : 'bg-teal-100 text-teal-700'
                  : theme === 'dark'
                  ? 'bg-red-400/20 text-red-300'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <div className="text-center">
                <p className="text-lg font-medium mb-2">
                  {isCorrect ? '🎉 Correto!' : '❌ Incorreto'}
                </p>
                <p className="text-sm">
                  {isCorrect
                    ? 'Parabéns! Você acertou a tradução.'
                    : `A tradução correta é: ${currentWord.translation}`}
                </p>
              </div>
            </div>
          )}

          {isCorrect !== null && (
            <button
              onClick={handleNext}
              className={`mt-4 w-full py-3 rounded-lg ${
                theme === 'dark'
                  ? 'bg-teal-400 text-black hover:bg-teal-500'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              } font-medium transition-colors`}
            >
              {currentIndex < words.length - 1
                ? 'Próxima Palavra'
                : 'Ver Resultados'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
