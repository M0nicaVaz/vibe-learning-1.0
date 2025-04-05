import { useState } from 'react';
import { UserData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface WelcomeProps {
  onUserDataSave: (userData: UserData) => void;
}

export default function Welcome({ onUserDataSave }: WelcomeProps) {
  const [name, setName] = useState('');
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const userData: UserData = {
      name,
      dictionaries: [],
    };

    onUserDataSave(userData);
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
      } flex items-center justify-center`}
    >
      <div className="w-full max-w-md">
        <div
          className={`${
            theme === 'dark'
              ? 'bg-[#2a2a2a] border-gray-700'
              : 'bg-white border-gray-200'
          } p-8 rounded-lg border`}
        >
          <h1
            className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
            } mb-6 text-center`}
          >
            Bem-vindo ao Vibe Learning
          </h1>
          <p
            className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } text-center mb-8`}
          >
            Seu assistente pessoal para aprender novos idiomas
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                } mb-2`}
              >
                Como podemos te chamar?
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder="Seu nome"
                className={`w-full px-4 py-2 ${
                  theme === 'dark'
                    ? 'bg-[#333] border-gray-600 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } border rounded-md focus:outline-none focus:ring-2 ${
                  theme === 'dark'
                    ? 'focus:ring-teal-400'
                    : 'focus:ring-teal-500'
                } focus:border-transparent`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 ${
                theme === 'dark'
                  ? 'bg-teal-400 text-black hover:bg-teal-500'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              } rounded-md focus:outline-none focus:ring-2 ${
                theme === 'dark' ? 'focus:ring-teal-400' : 'focus:ring-teal-500'
              } font-medium`}
            >
              Começar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
