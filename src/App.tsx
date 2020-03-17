import React from 'react'
import { HashRouter } from 'react-router-dom'
import { PledgeSelectingPage } from './pages/PledgeSelectingPage'
// import { IssueSelectingPage } from './pages/IssueSelectingPage'

const App: React.FC = () => {
  return (
    <HashRouter>
      <div
        style={{
          maxWidth: 400,
          minHeight: 700,
          margin: '0 auto',
        }}
      >
        <PledgeSelectingPage />
      </div>
    </HashRouter>
  )
}

export default App
