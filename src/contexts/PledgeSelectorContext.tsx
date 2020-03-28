import React from 'react'
import { Issue, Pledge } from './entities'
import produce from 'immer'

interface RequestResult<Data, Error> {
  loading: boolean
  data: Data | null
  error: Error | null
}

export interface Deps {
  selectedIssues: Issue[]
}

type PledgeId = Pledge['id']

export interface ContextValue extends Deps {
  currentIssueId: Issue['id']
  pledgesResult: RequestResult<Pledge[], string>
  selectedPledgeIds: Set<PledgeId>
  unfoldedPledgeIds: Set<PledgeId>
  action: {
    loadPledges: () => Promise<void>
    togglePledgeSelection: (id: PledgeId) => void
    togglePledgeFolding: (id: PledgeId) => void
    selectIssue: (id: Issue['id']) => void
  }
}

const PledgeSelectorContext = React.createContext<ContextValue>(null as any)

/*
 * - !! 이슈 목록은 위에서 주입받음
 * - 이슈별 공약 목록을 서버에서 불러오기
 * - 선택된 이슈가 변경되면, 다른 공약 목록을 보여주기
 * - 공약 선택 내역 저장하기
 * - 스토리북
 * -
 *
 * */
export class PledgeSelectorProvider extends React.Component<
  Deps,
  ContextValue
> {
  componentDidMount() {
    this.loadPledges()
  }

  loadPledges = async () => {
    // const issueIds = this.props.selectedIssues.map(item => item.id)
    this.setState(
      produce(draft => {
        draft.pledgesResult.loading = false
        draft.pledgesResult.data = [
          {
            id: 1,
            title: '1난나난나',
            issueId: 1,
            summary: '눈누눈누 '.repeat(10),
          },
          {
            id: 2,
            title: '1난나난나',
            issueId: 1,
            summary: '눈누눈누 '.repeat(10),
          },
          {
            id: 3,
            title: '1난나난나',
            issueId: 1,
            summary: '눈누눈누 '.repeat(10),
          },
          {
            id: 4,
            title: '1난나난나',
            issueId: 1,
            summary: '눈누눈누 '.repeat(10),
          },
          {
            id: 5,
            title: '1난나난나',
            issueId: 1,
            summary: '눈누눈누 '.repeat(10),
          },
          {
            id: 6,
            title: '2난나난나',
            issueId: 2,
            summary: '눈누눈누 '.repeat(10),
          },
          {
            id: 7,
            title: '2난나난나',
            issueId: 2,
            summary: '눈누눈누 '.repeat(10),
          },
          {
            id: 8,
            title: '2난나난나',
            issueId: 2,
            summary: '눈누눈누 '.repeat(10),
          },
          {
            id: 9,
            title: '2난나난나',
            issueId: 2,
            summary: '눈누눈누 '.repeat(10),
          },
          {
            id: 10,
            title: '2난나난나',
            issueId: 2,
            summary: '눈누눈누 '.repeat(10),
          },
        ]
      }),
    )
  }

  togglePledgeSelection = (id: PledgeId) => {
    this.setState(
      produce(draft => {
        if (draft.selectedPledgeIds.has(id)) {
          draft.selectedPledgeIds.delete(id)
        } else {
          draft.selectedPledgeIds.add(id)
        }
      }),
    )
  }

  togglePledgeFolding = (id: PledgeId) => {
    this.setState(
      produce(draft => {
        if (draft.unfoldedPledgeIds.has(id)) {
          draft.unfoldedPledgeIds.delete(id)
        } else {
          draft.unfoldedPledgeIds.add(id)
        }
      }),
    )
  }

  selectIssue = (id: Issue['id']) => {
    this.setState(
      produce(draft => {
        draft.currentIssueId = id
      }),
    )
  }

  state = {
    currentIssueId: this.props.selectedIssues[0].id,
    selectedIssues: this.props.selectedIssues,
    pledgesResult: {
      loading: true,
      data: null,
      error: null,
    },
    selectedPledgeIds: new Set<PledgeId>(),
    unfoldedPledgeIds: new Set<PledgeId>(),
    action: {
      loadPledges: this.loadPledges,
      togglePledgeSelection: this.togglePledgeSelection,
      togglePledgeFolding: this.togglePledgeFolding,
      selectIssue: this.selectIssue,
    },
  }

  render() {
    return (
      <PledgeSelectorContext.Provider value={this.state}>
        {this.props.children}
      </PledgeSelectorContext.Provider>
    )
  }
}

export const usePledgeSelector = () => React.useContext(PledgeSelectorContext)
