import React from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'

import { IssueSelectingPage } from './pages/IssueSelectingPage'
import { ConfirmIssuePage } from './pages/ConfirmIssuePage'
import { IssueSelectorProvider } from './contexts/IssueSelectorContext'
import { PledgeSelectingPage } from './pages/PledgeSelectingPage'

const issues = [
  { id: 1, title: '주거 여건', description: '' },
  { id: 2, title: '주거 여건', description: '' },
  { id: 3, title: '주거 여건', description: '' },
  { id: 4, title: '주거 여건', description: '' },
  { id: 5, title: '주거 여건', description: '' },
  { id: 6, title: '주거 여건', description: '' },
  { id: 7, title: '주거 여건', description: '' },
  { id: 8, title: '주거 여건', description: '' },
  { id: 9, title: '주거 여건', description: '' },
  { id: 10, title: '주거 여건', description: '' },
]

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
          <Route
            path="/demo/issues"
            render={() => (
              <IssueSelectorProvider
                deps={{}}
                mockState={{
                  issuesReq: { loading: false, error: null, data: issues },
                  selectedIssueIds: [],
                }}
              >
                <IssueSelectingPage />
              </IssueSelectorProvider>
            )}
          />
          <Route
            path="/demo/confirm"
            render={() => (
              <IssueSelectorProvider
                deps={{}}
                mockState={{
                  issuesReq: { loading: false, error: null, data: issues },
                  selectedIssueIds: [1, 3, 5, 7, 9],
                }}
              >
                <ConfirmIssuePage />
              </IssueSelectorProvider>
            )}
          />
          <Route path="/demo/pledge" render={() => <PledgeSelectingPage />} />
          <Redirect to="/demo/issues" />
        </Switch>
      </HashRouter>
    </div>
  )
}

export default App
