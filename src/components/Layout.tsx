import { Link, useLocation } from 'react-router-dom';
import { UserData } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  moonOutline,
  sunnyOutline,
  menuOutline,
  closeOutline,
} from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useState, useEffect } from 'react';
import WordSelectionModal from './WordSelectionModal';

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

interface LayoutProps {
  userData: UserData;
  children: React.ReactNode;
}

export default function Layout({ userData, children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showWordSelectionModal, setShowWordSelectionModal] = useState(false);
  const [selectedDictionary, setSelectedDictionary] = useState<{
    id: string;
    totalWords: number;
  } | null>(null);

  // Check if the device is mobile or tablet
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTrainWords = (dictionaryId: string, totalWords: number) => {
    setSelectedDictionary({ id: dictionaryId, totalWords });
    setShowWordSelectionModal(true);
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
      }`}
    >
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className={`lg:hidden fixed top-4 right-4 z-50 p-2 rounded-md ${
          theme === 'dark'
            ? 'bg-[#2a2a2a] text-gray-300'
            : 'bg-white text-gray-600'
        }`}
      >
        <IonIcon
          icon={isSidebarOpen ? closeOutline : menuOutline}
          className="text-2xl"
        />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${
          theme === 'dark'
            ? 'bg-[#2a2a2a] border-gray-700'
            : 'bg-white border-gray-200'
        } border-r p-4 flex flex-col`}
      >
        <div className="mb-8">
          <h2
            className={`text-xl font-bold ${
              theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
            } mb-2`}
          >
            Olá, {userData.name}!
          </h2>
          <p
            className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Seus dicionários
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto">
          <Link
            to="/"
            className={`flex items-center px-4 py-2 rounded-md ${
              location.pathname === '/'
                ? theme === 'dark'
                  ? 'bg-teal-400 text-black font-medium'
                  : 'bg-teal-600 text-white font-medium'
                : theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>Início</span>
          </Link>

          <div className="mt-4 space-y-1">
            {userData.dictionaries.map((dict) => (
              <div key={dict.id}>
                <Link
                  to={`/dictionary/${dict.id}`}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    location.pathname === `/dictionary/${dict.id}` ||
                    location.pathname === `/flashcards/${dict.id}`
                      ? theme === 'dark'
                        ? 'bg-teal-400 text-black font-medium'
                        : 'bg-teal-600 text-white font-medium'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span
                    className={`${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                    }`}
                  >
                    {LANGUAGE_MAP[dict.sourceLanguage]?.flag}{' '}
                    {LANGUAGE_MAP[dict.sourceLanguage]?.code}
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
                    {LANGUAGE_MAP[dict.targetLanguage]?.flag}{' '}
                    {LANGUAGE_MAP[dict.targetLanguage]?.code}
                  </span>
                </Link>
                {(location.pathname === `/dictionary/${dict.id}` ||
                  location.pathname === `/flashcards/${dict.id}`) && (
                  <button
                    onClick={() => handleTrainWords(dict.id, dict.words.length)}
                    className={`flex items-center px-4 py-2 ml-4 rounded-md w-full text-left ${
                      location.pathname === `/flashcards/${dict.id}`
                        ? theme === 'dark'
                          ? 'text-teal-400 font-medium'
                          : 'text-teal-600 font-medium'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">📚</span>
                    <span>Treinar palavras</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="mt-4 flex items-center justify-between">
          <IonIcon
            icon={theme === 'dark' ? moonOutline : sunnyOutline}
            className={`text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          />
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              theme === 'dark' ? 'bg-teal-400/80' : 'bg-teal-600/80'
            }`}
            role="switch"
            aria-checked={theme === 'dark'}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 pt-16 lg:pt-4">{children}</div>
      </div>

      {/* Word Selection Modal */}
      {showWordSelectionModal && selectedDictionary && (
        <WordSelectionModal
          dictionaryId={selectedDictionary.id}
          totalWords={selectedDictionary.totalWords}
          onClose={() => {
            setShowWordSelectionModal(false);
            setSelectedDictionary(null);
          }}
        />
      )}
    </div>
  );
}
