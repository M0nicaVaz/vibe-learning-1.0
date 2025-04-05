import { useState } from 'react';
import { UserData } from '../types';

interface WelcomeProps {
  onUserDataSave: (userData: UserData) => void;
}

export default function Welcome({ onUserDataSave }: WelcomeProps) {
  const [name, setName] = useState('');

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
    <div className="min-h-screen p-4 bg-[#212121] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-[#2a2a2a] p-8 rounded-lg border border-gray-700">
          <h1 className="text-3xl font-bold text-[#4DE082] mb-6 text-center">
            Bem-vindo ao Vibe Learning
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Seu assistente pessoal para aprender novos idiomas
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Como podemos te chamar?
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder="Seu nome"
                className="w-full px-4 py-2 bg-[#333] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4DE082] focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#4DE082] text-black rounded-md hover:bg-[#44C975] focus:outline-none focus:ring-2 focus:ring-[#4DE082] font-medium"
            >
              Começar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
