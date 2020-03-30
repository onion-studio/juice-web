import React from 'react'
import { Issue, Pledge } from './entities'
import produce from 'immer'
import ky from 'ky'

interface RequestResult<Data, Error> {
  loading: boolean
  data: Data | null
  error: Error | null
}

interface History {
  push(url: string): void
}

export interface Deps {
  history: History
  selectedIssues: Issue[]
}

type PledgeId = Pledge['id']

export interface ContextValue {
  selectedIssues: Issue[]
  currentIssueId: Issue['id']
  pledgesResult: RequestResult<Pledge[], string>
  selectedPledgeIds: Set<PledgeId>
  unfoldedPledgeIds: Set<PledgeId>
  action: {
    loadPledges: () => Promise<void>
    togglePledgeSelection: (id: PledgeId) => void
    togglePledgeFolding: (id: PledgeId) => void
    selectIssue: (id: Issue['id']) => void
    sendResult: () => Promise<void>
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
  constructor(props: Deps) {
    super(props)
    this.state = {
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
        sendResult: this.sendResult,
      },
    }
  }

  componentDidMount() {
    this.createToken()
    this.loadPledges()
  }

  loadPledges = async () => {
    const issueIds = this.props.selectedIssues.map(item => item.id).join(',')
    const res: {
      pledges: {
        id: number
        title: string
        summary: string
        issue_id: number
      }[]
    } = await ky
      .get('https://api.juice.vote/pledges', {
        searchParams: {
          issue_ids: issueIds,
        },
      })
      .json()

    const pledges = res.pledges.map(item => ({
      ...item,
      issueId: item.issue_id,
    }))

    this.setState(
      produce(draft => {
        draft.pledgesResult.loading = false
        draft.pledgesResult.data = pledges
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

  // TODO: 더 앞에서 해야 함
  createToken = async () => {
    const { token } = await ky.post('https://api.juice.vote/init').json()
    localStorage.setItem('token', token)
  }

  sendResult = async () => {
    try {
      await ky.post('https://api.juice.vote/result', {
        json: {
          // TODO: 분리해야
          token: localStorage.getItem('token'),
          // TODO: timestamp 없애도 됨
          timestamp: Date.now(),
          selected_issue_ids: this.props.selectedIssues
            .map(item => item.id)
            .join(','),
          selected_pledge_ids: Array.from(this.state.selectedPledgeIds).join(
            ',',
          ),
          personal: {
            isVoter: 1,
            ageStart: 10,
            ageEnd: 20,
            gender: 'O', // 'M', 'F', 'O'
            location: '서울특별시',
            nickname: '테스트',
          },
        },
      })
      this.props.history.push('/result')
    } catch (e) {
      // TODO: 에러 토스트
      alert('통신 에러')
      throw e
    }
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
