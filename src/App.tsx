import React from 'react'
import { HashRouter } from 'react-router-dom'
import { IssueSelectingPage } from './pages/IssueSelectingPage'

const App: React.FC = () => {
  return (
    <HashRouter>
      <div
        style={{
          maxWidth: 400,
          minHeight: 700,
          margin: '0 auto',
          backgroundColor: 'white',
        }}
      >
        <IssueSelectingPage />
      </div>
    </HashRouter>
  )
}

export default App
