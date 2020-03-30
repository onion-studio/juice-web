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

const App: React.FC = () => {
  return (
    <PersistencyProvider storage={localStorage}>
      <IssueSelectorProvider>
        <div
          style={{
            position: 'relative',
            maxWidth: 600,
            minHeight: 700,
            margin: '0 auto',
            backgroundColor: '#fff6da',
          }}
        >
          <Router />
        </div>
      </IssueSelectorProvider>
    </PersistencyProvider>
  )
}

function PersonalInfo() {
  const persistency = usePersistency()
  return (
    <div>
      <button
        onClick={() => {
          persistency.action.navigate({
            to: PageID.result,
          })
        }}
      >
        고고
      </button>
    </div>
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
    case PageID.personalInfo:
      return <PersonalInfo />
    case PageID.result:
      return <ResultPage />
    default:
      return <div>ERROR</div>
  }
}

export default App
