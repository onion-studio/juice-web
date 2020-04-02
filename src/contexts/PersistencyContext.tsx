import React, { useContext } from 'react'

interface Storage {
  setItem: (key: string, value: string) => void
  getItem: (key: string) => string | null
  removeItem: (key: string) => void
}

interface Deps {
  storage: Storage
  tokenOverride: () => string | null
}

export enum PageID {
  intro = 'intro',
  issueSelector = 'issueSelector',
  issueConfirmation = 'issueConfirmation',
  pledgeSelector = 'pledgeSelector',
  result = 'result',
}

export type NavigateCommand =
  | {
      to: PageID.issueSelector
      token: string
    }
  | { to: PageID.issueConfirmation }
  | {
      to: PageID.pledgeSelector
      selectedIssueIds: number[]
    }
  | {
      to: PageID.result
    }

interface PersistedState {
  currentPage: PageID
  token?: string
  selectedIssueIds?: number[]
  selectedPledgeIds?: number[]
}

interface ContextValue extends PersistedState {
  action: {
    navigate: (command: NavigateCommand) => void
    goBack: () => void
    reset: () => void
  }
}

const PersistencyContext = React.createContext<ContextValue>(null as any)

/**
 * 중간 저장을 위한 기능 모음
 * 중간 저장은 페이지를 넘어가는 순간에만 수행한다.
 */
export class PersistencyProvider extends React.Component<Deps, ContextValue> {
  constructor(props: Deps) {
    super(props)
    const action = {
      goBack: this.goBack,
      navigate: this.navigate,
      reset: this.reset,
    }
    const token = props.tokenOverride()
    if (token) {
      this.state = {
        token,
        currentPage: PageID.result,
        action,
      }
      return
    }
    const storageItem = props.storage.getItem('state')
    const override = storageItem
      ? (JSON.parse(storageItem) as PersistedState)
      : {}
    this.state = {
      currentPage: PageID.intro,
      action,
      ...override,
    }
  }

  goBack = () => {
    switch (this.state.currentPage) {
      case PageID.issueSelector:
        this.setState({ currentPage: PageID.intro })
        break
      case PageID.pledgeSelector:
        this.setState({ currentPage: PageID.issueSelector })
        break
      default:
        throw new Error('Cannot go back')
    }
  }

  navigate = (command: NavigateCommand) => {
    console.log('navigate', command)
    switch (command.to) {
      case PageID.issueSelector:
        this.setState(
          {
            currentPage: command.to,
            token: command.token,
          },
          this.persist,
        )
        break
      case PageID.issueConfirmation:
        this.setState(
          {
            currentPage: command.to,
          },
          this.persist,
        )
        break
      case PageID.pledgeSelector:
        this.setState(
          {
            currentPage: command.to,
            selectedIssueIds: command.selectedIssueIds,
          },
          this.persist,
        )
        break
      case PageID.result:
        this.setState(
          {
            currentPage: command.to,
          },
          this.persist,
        )
    }
  }

  persist = () => {
    const state: PersistedState = {
      currentPage: this.state.currentPage,
      token: this.state.token,
      selectedIssueIds: this.state.selectedIssueIds,
      selectedPledgeIds: this.state.selectedPledgeIds,
    }
    this.props.storage.setItem('state', JSON.stringify(state))
  }

  reset = () => {
    this.props.storage.removeItem('state')
    this.setState({
      currentPage: PageID.intro,
      selectedPledgeIds: undefined,
      selectedIssueIds: undefined,
      token: undefined,
    })
  }

  setToken = (token: string) => {
    this.setState({
      token,
    })
  }

  render() {
    return (
      <PersistencyContext.Provider value={this.state}>
        {this.props.children}
      </PersistencyContext.Provider>
    )
  }
}

export const usePersistency = () => useContext(PersistencyContext)
