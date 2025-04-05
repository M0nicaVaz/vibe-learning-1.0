import { Link, useLocation } from 'react-router-dom';
import { UserData } from '../types';

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
            {userData.dictionaries.map((dict) => (
              <Link
                key={dict.id}
                to={`/dictionary/${dict.id}`}
                className={`block px-4 py-2 rounded-md ${
                  location.pathname === `/dictionary/${dict.id}`
                    ? 'bg-[#5AFF91] text-black font-medium'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {dict.sourceLanguage.toUpperCase()} →{' '}
                {dict.targetLanguage.toUpperCase()}
                <span className="text-xs ml-2 text-gray-500">
                  ({dict.words.length})
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Add Dictionary Button */}
        <Link
          to="/new-dictionary"
          className="mt-4 px-4 py-2 bg-[#4DE082] text-black rounded-md hover:bg-[#44C975] focus:outline-none focus:ring-2 focus:ring-[#4DE082] font-medium text-center"
        >
          Novo Dicionário
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4">{children}</div>
      </div>
    </div>
  );
}
