import React from 'react'
import { IssueSelectingPage } from './pages/IssueSelectingPage'
import { IssueSelectorProvider } from './contexts/IssueSelectorContext'
import {
  PageID,
  PersistencyProvider,
  usePersistency,
} from './contexts/PersistencyContext'
import { PledgeSelectingPage } from './pages/PledgeSelectingPage'
import { IntroPage } from './pages/IntroPage'
import { ResultPage } from './pages/ResultPage'
import { ConfirmIssuePage } from './pages/ConfirmIssuePage'
import { Toast } from './components/Toast'
import { ToasterProvider } from './contexts/ToasterContext'

const App: React.FC = () => {
  return (
    <ToasterProvider>
      <PersistencyProvider
        storage={localStorage}
        tokenOverride={() =>
          new URLSearchParams(window.location.search).get('token')
        }
      >
        <IssueSelectorProvider>
          <>
            <Router />
            <Toast />
          </>
        </IssueSelectorProvider>
      </PersistencyProvider>
    </ToasterProvider>
  )
}

function Router() {
  const persistency = usePersistency()
  switch (persistency.currentPage) {
    case PageID.intro:
      return <IntroPage />
    case PageID.issueSelector:
      return <IssueSelectingPage />
    case PageID.issueConfirmation:
      return <ConfirmIssuePage />
    case PageID.pledgeSelector:
      return <PledgeSelectingPage />
    case PageID.result:
      return <ResultPage />
    default:
      return <div>ERROR</div>
  }
}

export default App
