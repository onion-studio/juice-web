import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
// import { PledgeSelectingPage } from './pages/PledgeSelectingPage'
import { IssueSelectingPage } from './pages/IssueSelectingPage'
import { ConfirmIssuePage } from './pages/ConfirmIssuePage'

const App: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 600,
        minHeight: 700,
        margin: '0 auto',
        backgroundColor: '#fff6da',
      }}
    >
      <HashRouter>
        <Switch>
          <Route path="/demo/issues" render={() => <IssueSelectingPage />} />
          <Route path="/demo/confirm" render={() => <ConfirmIssuePage />} />
        </Switch>
      </HashRouter>
    </div>
  )
}

export default App
