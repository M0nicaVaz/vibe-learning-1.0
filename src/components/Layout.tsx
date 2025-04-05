import { Link, useLocation } from 'react-router-dom';
import { UserData } from '../types';

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

  return (
    <div className="flex min-h-screen bg-[#212121]">
      {/* Sidebar */}
      <div className="w-64 bg-[#2a2a2a] border-r border-gray-700 p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#4DE082] mb-2">
            Olá, {userData.name}!
          </h2>
          <p className="text-sm text-gray-400">Seus dicionários</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <Link
            to="/"
            className={`block px-4 py-2 rounded-md mb-2 ${
              location.pathname === '/'
                ? 'bg-[#5AFF91] text-black font-medium'
                : 'text-gray-300 hover:bg-gray-800'
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
                      ? 'bg-[#5AFF91] text-black font-medium'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      {sourceInfo?.flag} {sourceInfo?.code} → {targetInfo?.flag}{' '}
                      {targetInfo?.code}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({dict.words.length})
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4">{children}</div>
      </div>
    </div>
  );
}
