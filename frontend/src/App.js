import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './styles/GlobalStyles';
import Header from './components/Header';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          {/* Outras rotas serão adicionadas depois */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
