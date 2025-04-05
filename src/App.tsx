import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { UserData, Dictionary, WordEntry } from './types';
import Layout from './components/Layout';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import NewDictionary from './components/NewDictionary';
import Welcome from './components/Welcome';
import Flashcard from './components/Flashcard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [userData, setUserData] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

  const handleUserDataSave = (data: UserData) => {
    setUserData(data);
  };

  const handleDictionarySave = (dictionary: Dictionary) => {
    if (!userData) return;
    setUserData({
      ...userData,
      dictionaries: [...userData.dictionaries, dictionary],
    });
  };

  const handleDictionaryDelete = (dictionaryId: string) => {
    if (!userData) return;
    setUserData({
      ...userData,
      dictionaries: userData.dictionaries.filter(
        (dict) => dict.id !== dictionaryId
      ),
    });
  };

  const handleWordUpdate = (
    dictionaryId: string,
    words: (typeof userData.dictionaries)[0]['words']
  ) => {
    if (!userData) return;
    setUserData({
      ...userData,
      dictionaries: userData.dictionaries.map((dict) =>
        dict.id === dictionaryId ? { ...dict, words } : dict
      ),
    });
  };

  const handleNameSubmit = (name: string) => {
    // Implementation of handleNameSubmit
  };

  const handleDictionaryCreate = (dictionary: Dictionary) => {
    if (!userData) return;
    setUserData({
      ...userData,
      dictionaries: [...userData.dictionaries, dictionary],
    });
  };

  const handleWordsUpdate = (
    dictionaryId: string,
    words: (typeof userData.dictionaries)[0]['words']
  ) => {
    if (!userData) return;
    setUserData({
      ...userData,
      dictionaries: userData.dictionaries.map((dict) =>
        dict.id === dictionaryId ? { ...dict, words } : dict
      ),
    });
  };

  if (!userData) {
    return (
      <ThemeProvider>
        <Welcome onUserDataSave={handleUserDataSave} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <Layout userData={userData}>
          <Routes>
            <Route
              path="/"
              element={
                userData ? (
                  <Home
                    userData={userData}
                    onDictionaryDelete={handleDictionaryDelete}
                  />
                ) : (
                  <Welcome onNameSubmit={handleNameSubmit} />
                )
              }
            />
            <Route
              path="/new-dictionary"
              element={
                userData ? (
                  <NewDictionary
                    userData={userData}
                    onDictionaryCreate={handleDictionaryCreate}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/dictionary/:id"
              element={
                userData ? (
                  <Dashboard
                    userData={userData}
                    onWordsUpdate={handleWordsUpdate}
                    onDictionaryDelete={handleDictionaryDelete}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/flashcards/:id"
              element={
                userData ? (
                  <Flashcard userData={userData} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
