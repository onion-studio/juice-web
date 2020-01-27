import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Intro from './pages/Intro';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Route path="/" component={Intro} />
    </HashRouter>
  );
};

export default App;
