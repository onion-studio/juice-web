import React, { useContext } from 'react'
import ky from 'ky'
import { usePersistency } from './PersistencyContext'
import produce from 'immer'

interface Issue {
  id: number
  name: string
  summary: string
  tag1: string | null
  tag2: string | null
  tag3: string | null
}

interface Deps {
  selectedIssueIds: number[] | null
  reset: () => void
}

interface ContextValue {
  issues: Issue[] | null
  selectedIssueIds: Set<number>
  action: {
    loadIssues: () => Promise<void>
    selectIssue: (id: number) => void
    discardIssue: (id: number) => void
  }
}

const IssueSelectorContext = React.createContext<ContextValue>(null as any)

export class IssueSelectorProviderUnbound extends React.Component<
  Deps,
  ContextValue
> {
  constructor(props: Deps) {
    super(props)
    this.state = {
      issues: null,
      selectedIssueIds: props.selectedIssueIds
        ? new Set(props.selectedIssueIds)
        : new Set(),
      action: {
        loadIssues: this.loadIssues,
        selectIssue: this.selectIssue,
        discardIssue: this.discardIssue,
      },
    }
  }

  loadIssues = async () => {
    if (this.state.issues) {
      return
    }
    try {
      const res: {
        issues: {
          id: number
          name: string
          summary: string
          tag1: string | null
          tag2: string | null
          tag3: string | null
        }[]
      } = await ky.get('https://api.juice.vote/issues').json()
      this.setState(
        produce(draft => {
          draft.issues = res.issues
        }),
      )
    } catch (e) {
      if (
        window.confirm('통신 문제가 발생했습니다. 처음으로 돌아가시겠습니까?')
      ) {
        this.props.reset()
      }
    }
  }

  selectIssue = (id: number) => {
    this.setState(
      produce(draft => {
        draft.selectedIssueIds.add(id)
      }),
    )
  }

  discardIssue = (id: number) => {
    this.setState(
      produce(draft => {
        draft.selectedIssueIds.delete(id)
      }),
    )
  }

  render() {
    return (
      <IssueSelectorContext.Provider value={this.state}>
        {this.props.children}
      </IssueSelectorContext.Provider>
    )
  }
}

export const IssueSelectorProvider: React.FC = ({ children }) => {
  const persistency = usePersistency()
  return (
    <IssueSelectorProviderUnbound
      selectedIssueIds={persistency.selectedIssueIds ?? null}
      reset={() => persistency.action.reset()}
    >
      {children}
    </IssueSelectorProviderUnbound>
  )
}

export const useIssueSelector = () => useContext(IssueSelectorContext)
