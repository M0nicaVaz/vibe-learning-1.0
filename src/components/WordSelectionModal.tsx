import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface WordSelectionModalProps {
  dictionaryId: string;
  totalWords: number;
  onClose: () => void;
}

export default function WordSelectionModal({
  dictionaryId,
  totalWords,
  onClose,
}: WordSelectionModalProps) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [wordCount, setWordCount] = useState(totalWords);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set initial word count to total words
    setWordCount(totalWords);
  }, [totalWords]);

  const handleStartTraining = () => {
    if (wordCount <= 0) {
      setError('O número de palavras deve ser maior que zero');
      return;
    }

    if (wordCount > totalWords) {
      setError(`O número máximo de palavras é ${totalWords}`);
      return;
    }

    // Navigate to flashcards with the selected word count
    navigate(`/flashcards/${dictionaryId}?count=${wordCount}`);
    onClose();
  };

  const handleDecrement = () => {
    if (wordCount > 1) {
      setWordCount(wordCount - 1);
      setError('');
    }
  };

  const handleIncrement = () => {
    if (wordCount < totalWords) {
      setWordCount(wordCount + 1);
      setError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setWordCount(value);
      setError('');
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    // Validate the input value
    if (wordCount <= 0) {
      setWordCount(1);
      setError('O número de palavras deve ser maior que zero');
    } else if (wordCount > totalWords) {
      setWordCount(totalWords);
      setError(`O número máximo de palavras é ${totalWords}`);
    }
  };

  const handleNumberClick = () => {
    setIsEditing(true);
    // Focus the input after a short delay to ensure it's visible
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className={`fixed inset-0 ${
          theme === 'dark' ? 'bg-black/70' : 'bg-gray-900/70'
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`relative z-10 w-full max-w-md p-6 rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
        }`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}
        >
          Quantas palavras você quer treinar?
        </h2>
        <p
          className={`mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Selecione o número de palavras para treinar (máximo: {totalWords})
        </p>

        <div className="mb-6">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleDecrement}
              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="text-2xl">-</span>
            </button>

            <div
              className={`mx-4 w-24 h-24 flex items-center justify-center rounded-full cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={handleNumberClick}
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  max={totalWords}
                  value={wordCount}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`w-16 text-center text-3xl font-bold bg-transparent border-none outline-none ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}
                />
              ) : (
                <span className="text-3xl font-bold">{wordCount}</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleIncrement}
              className={`w-12 h-12 flex items-center justify-center rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="text-2xl">+</span>
            </button>
          </div>

          {error && (
            <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${
              theme === 'dark'
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleStartTraining}
            className={`px-4 py-2 rounded-md ${
              theme === 'dark'
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            Começar Treino
          </button>
        </div>
      </div>
    </div>
  );
}
