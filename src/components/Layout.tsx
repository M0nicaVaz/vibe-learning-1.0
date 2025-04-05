import { Link, useLocation } from 'react-router-dom';
import { UserData } from '../types';
import { useTheme } from '../context/ThemeContext';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
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

interface LayoutProps {
  userData: UserData;
  children: React.ReactNode;
}

export default function Layout({ userData, children }: LayoutProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`flex h-screen overflow-hidden ${
        theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 h-screen ${
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
            className={`block px-4 py-2 rounded-md mb-2 ${
              location.pathname === '/'
                ? theme === 'dark'
                  ? 'bg-teal-300 text-black font-medium'
                  : 'bg-teal-600 text-white font-medium'
                : theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏠 Início
          </Link>

          <div className="mt-4 space-y-1">
            {userData.dictionaries.map((dict) => {
              const sourceInfo = LANGUAGE_MAP[dict.sourceLanguage];
              const targetInfo = LANGUAGE_MAP[dict.targetLanguage];
              return (
                <Link
                  key={dict.id}
                  to={`/dictionary/${dict.id}`}
                  className={`block px-4 py-2 rounded-md ${
                    location.pathname === `/dictionary/${dict.id}`
                      ? theme === 'dark'
                        ? 'bg-teal-300 text-black font-medium'
                        : 'bg-teal-600 text-white font-medium'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      {sourceInfo?.flag} {sourceInfo?.code} → {targetInfo?.flag}{' '}
                      {targetInfo?.code}
                    </div>
                    <span
                      className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      ({dict.words.length})
                    </span>
                  </div>
                </Link>
              );
            })}
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">{children}</div>
      </div>
    </div>
  );
}
