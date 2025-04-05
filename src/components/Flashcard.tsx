import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { UserData, WordEntry } from '../types';
import { useTheme } from '../context/ThemeContext';
import TrainingSummary from './TrainingSummary';

interface FlashcardProps {
  userData: UserData;
}

export default function Flashcard({ userData }: FlashcardProps) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [trainingWords, setTrainingWords] = useState<WordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dictionary = userData.dictionaries.find((d) => d.id === id);
  const allWords = dictionary?.words || [];

  // Get the number of words to train from the URL query parameter
  const wordCountParam = searchParams.get('count');
  const wordCount = wordCountParam ? parseInt(wordCountParam) : allWords.length;

  useEffect(() => {
    if (id && userData.dictionaries) {
      // Reset state
      setCurrentIndex(0);
      setUserAnswer('');
      setIsCorrect(null);
      setCorrectCount(0);
      setIncorrectCount(0);
      setShowSummary(false);
      setIsLoading(true);

      // Select random words for training
      const selectedWords = [...allWords]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(wordCount, allWords.length));

      setTrainingWords(selectedWords);
      setIsLoading(false);
    }
  }, [id, userData.dictionaries, wordCount, allWords]);

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const currentWord = trainingWords[currentIndex];
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
    if (currentIndex < trainingWords.length - 1) {
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

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
        }`}
      >
        <div
          className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
          }`}
        >
          <p
            className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Carregando...
          </p>
        </div>
      </div>
    );
  }

  if (trainingWords.length === 0) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
        }`}
      >
        <div
          className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
          }`}
        >
          <p
            className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Nenhuma palavra disponível para treinar.
          </p>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <TrainingSummary
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        totalWords={trainingWords.length}
        dictionaryId={dictionary.id}
      />
    );
  }

  const currentWord = trainingWords[currentIndex];

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
              Palavra {currentIndex + 1} de {trainingWords.length}
            </span>
            <span
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {Math.round(((currentIndex + 1) / trainingWords.length) * 100)}%
            </span>
          </div>
          <div
            className={`h-2 rounded-full overflow-hidden ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <div
              className={`h-full ${
                theme === 'dark' ? 'bg-teal-400' : 'bg-teal-600'
              }`}
              style={{
                width: `${((currentIndex + 1) / trainingWords.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Word Card */}
        <div
          className={`p-6 rounded-lg shadow-md mb-6 ${
            theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            {currentWord.word}
          </h2>
          {currentWord.phonetics && (
            <p
              className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {currentWord.phonetics}
            </p>
          )}
        </div>

        {/* Answer Form */}
        {isCorrect === null ? (
          <form onSubmit={handleAnswerSubmit}>
            <div className="mb-4">
              <label
                htmlFor="translation"
                className={`block mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Digite a tradução:
              </label>
              <input
                type="text"
                id="translation"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className={`w-full p-3 border rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="Digite a tradução..."
                autoFocus
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-md ${
                theme === 'dark'
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Verificar
            </button>
          </form>
        ) : (
          <div>
            <div
              className={`p-4 rounded-md mb-4 ${
                isCorrect
                  ? theme === 'dark'
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-green-100 text-green-800'
                  : theme === 'dark'
                  ? 'bg-red-900/30 text-red-400'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <p className="font-medium">
                {isCorrect ? 'Correto!' : 'Incorreto!'}
              </p>
              {!isCorrect && (
                <p className="mt-1">
                  A tradução correta é:{' '}
                  <strong>{currentWord.translation}</strong>
                </p>
              )}
            </div>
            <button
              onClick={handleNext}
              className={`w-full py-3 rounded-md cursor-pointer ${
                theme === 'dark'
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {currentIndex < trainingWords.length - 1
                ? 'Próxima Palavra'
                : 'Ver Resultados'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
