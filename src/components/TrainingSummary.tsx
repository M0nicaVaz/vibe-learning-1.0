import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface TrainingSummaryProps {
  correctCount: number;
  incorrectCount: number;
  totalWords: number;
  dictionaryId: string;
}

export default function TrainingSummary({
  correctCount,
  incorrectCount,
  totalWords,
  dictionaryId,
}: TrainingSummaryProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Save stats to localStorage
  React.useEffect(() => {
    const stats = {
      correctCount,
      incorrectCount,
      totalWords,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(
      `dictionary_stats_${dictionaryId}`,
      JSON.stringify(stats)
    );
  }, [correctCount, incorrectCount, totalWords, dictionaryId]);

  // Prepare data for the chart
  const data = [
    { name: 'Corretos', value: correctCount },
    { name: 'Incorretos', value: incorrectCount },
  ];

  // Colors for the chart
  const COLORS =
    theme === 'dark'
      ? ['#2dd4bf', '#fb7185'] // teal-400, rose-400 for dark mode
      : ['#0d9488', '#e11d48']; // teal-600, rose-600 for light mode

  // Calculate percentage
  const correctPercentage = Math.round((correctCount / totalWords) * 100);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === 'dark' ? 'bg-[#212121]' : 'bg-gray-50'
      }`}
    >
      <div className="flex-1 flex items-center justify-center p-4">
        <div
          className={`${
            theme === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
          } p-8 rounded-xl shadow-lg max-w-2xl w-full`}
        >
          <h2
            className={`text-2xl font-bold mb-6 text-center ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            Resumo do Treino
          </h2>

          {/* Chart */}
          <div className="h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({
                    name,
                    percent,
                  }: {
                    name: string;
                    percent: number;
                  }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} palavras`, '']}
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#2a2a2a' : 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    boxShadow:
                      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                  labelStyle={{
                    color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Text summary */}
          <div
            className={`text-center mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <p className="text-xl mb-2">
              Você acertou{' '}
              <span className="font-bold text-teal-400">{correctCount}</span>{' '}
              palavras e errou{' '}
              <span className="font-bold text-rose-400">{incorrectCount}</span>{' '}
              palavras.
            </p>
            <p className="text-lg">
              Taxa de acerto:{' '}
              <span className="font-bold">{correctPercentage}%</span>
            </p>
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/')}
              className={`px-6 py-3 rounded-md flex items-center text-lg font-medium cursor-pointer ${
                theme === 'dark'
                  ? 'bg-teal-400 text-black hover:bg-teal-500'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Voltar para o início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
