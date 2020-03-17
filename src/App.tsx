import React from 'react'
import { HashRouter } from 'react-router-dom'
// import { PledgeSelectingPage } from './pages/PledgeSelectingPage'
import { IssueSelectingPage } from './pages/IssueSelectingPage'
import { TopNavBar } from './components/TopNavBar'

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
        <TopNavBar title="제목" progress={0.3} />
        <IssueSelectingPage />
      </div>
    </HashRouter>
  )
}

export default App
