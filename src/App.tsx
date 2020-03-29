import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import { IssueSelectingPage } from './pages/IssueSelectingPage'
import { ConfirmIssuePage } from './pages/ConfirmIssuePage'
import { IssueSelectorProvider } from './contexts/IssueSelectorContext'
import { PledgeSelectingPage } from './pages/PledgeSelectingPage'
import { IntroPage } from './pages/IntroPage'

const App: React.FC = () => {
  return (
    <IssueSelectorProvider deps={{}}>
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
            <Route path="/demo/issues" component={IssueSelectingPage} />
            <Route path="/demo/confirm" component={ConfirmIssuePage} />
            <Route path="/demo/pledge" component={PledgeSelectingPage} />
            <Route exact path="/" component={IntroPage} />
            <Route path="/select" component={IssueSelectingPage} />
            <Route path="/confirm" component={ConfirmIssuePage} />
            <Route path="/pledges" component={PledgeSelectingPage} />
          </Switch>
        </HashRouter>
      </div>
    </IssueSelectorProvider>
  )
}

export default App
