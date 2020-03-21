import React from 'react'
import { HashRouter } from 'react-router-dom'
// import { PledgeSelectingPage } from './pages/PledgeSelectingPage'
import { IssueSelectingPage } from './pages/IssueSelectingPage'

const App: React.FC = () => {
  return (
    <HashRouter>
      <div
        style={{
          position: 'relative',
          maxWidth: 400,
          minHeight: 700,
          margin: '0 auto',
          backgroundColor: '#fff6da',
        }}
      >
        <IssueSelectingPage />
      </div>
    </HashRouter>
  )
}

export default App
