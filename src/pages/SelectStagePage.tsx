import React, { FC } from 'react'
import {
  issues,
  IssueSelectorProvider,
  useIssueSelector,
  issueSelectorThunk,
} from '../aggregates/IssueSelector'

const IssueSelectorView: FC = () => {
  const [issueSelectorState, issueSelectorDispatch] = useIssueSelector()
  const issue = issues[issueSelectorState.numOfSelectedIssues]
  return (
    <div>
      <p>{JSON.stringify(issue)}</p>
      <p>{issueSelectorState.animationState}</p>
      <button
        onClick={() =>
          issueSelectorDispatch(issueSelectorThunk.select(issue.id))
        }
      >
        select
      </button>
      <button
        onClick={() =>
          issueSelectorDispatch(issueSelectorThunk.discard(issue.id))
        }
      >
        discard
      </button>
    </div>
  )
}

export const SelectStagePage: FC = () => {
  return (
    <IssueSelectorProvider deps={{}}>
      <IssueSelectorView />
    </IssueSelectorProvider>
  )
}
