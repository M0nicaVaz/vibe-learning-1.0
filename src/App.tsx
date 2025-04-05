import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserData, Dictionary } from './types';
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

  const handleDictionaryDelete = (dictionaryId: string) => {
    if (!userData) return;
    setUserData({
      ...userData,
      dictionaries: userData.dictionaries.filter(
        (dict) => dict.id !== dictionaryId
      ),
    });
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
    words: NonNullable<typeof userData>['dictionaries'][0]['words']
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
                <Home
                  userData={userData}
                  onDictionaryDelete={handleDictionaryDelete}
                />
              }
            />
            <Route
              path="/new-dictionary"
              element={
                <NewDictionary
                  userData={userData}
                  onDictionaryCreate={handleDictionaryCreate}
                />
              }
            />
            <Route
              path="/dictionary/:id"
              element={
                <Dashboard
                  userData={userData}
                  onWordsUpdate={handleWordsUpdate}
                  onDictionaryDelete={handleDictionaryDelete}
                />
              }
            />
            <Route
              path="/flashcards/:id"
              element={<Flashcard userData={userData} />}
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
