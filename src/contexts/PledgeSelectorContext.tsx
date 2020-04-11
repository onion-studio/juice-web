import React, { useEffect } from 'react'
import { Issue, Pledge } from './entities'
import produce from 'immer'
import ky from 'ky'
import { PageID, usePersistency } from './PersistencyContext'
import { useIssueSelector } from './IssueSelectorContext'
import { deterministicShuffle } from '../utils/sort'
import { useToaster } from './ToasterContext'

interface RequestResult<Data, Error> {
  loading: boolean
  data: Data | null
  error: Error | null
}

export interface Deps {
  selectedIssueIdsWithoutDeduction?: number[]
  selectedIssues: Issue[]
  onComplete: (selectedPledgeIds: number[]) => void
  onExcess: () => void
  token: string
  reset: () => void
}

export type PersonalInfo = {
  isVoter: 1 | 0
  ageStart: number
  ageEnd: number
  gender: 'M' | 'F' | 'O'
  location: string
  nickname: string
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
    sendResult: (personal: PersonalInfo) => Promise<void>
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
export class PledgeSelectorProviderUnbound extends React.Component<
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
    this.loadPledges()
  }

  loadPledges = async () => {
    const issueIds = this.props.selectedIssues.map(item => item.id).join(',')
    try {
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
    } catch (e) {
      if (
        window.confirm('통신 문제가 발생했습니다. 처음으로 돌아가시겠습니까?')
      ) {
        this.props.reset()
      }
    }
  }

  togglePledgeSelection = (id: PledgeId) => {
    this.setState(
      produce(draft => {
        if (draft.selectedPledgeIds.has(id)) {
          draft.selectedPledgeIds.delete(id)
        } else {
          if (draft.selectedPledgeIds.size >= 10) {
            this.props.onExcess()
          } else {
            draft.selectedPledgeIds.add(id)
          }
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

  sendResult = async (personal: PersonalInfo) => {
    try {
      await ky.post('https://api.juice.vote/result', {
        json: {
          token: this.props.token!,
          // TODO: timestamp 없애도 됨
          timestamp: Date.now(),
          selected_issue_ids: this.props.selectedIssues
            .map(item => item.id)
            .join(','),
          issue_ids_without_deduction: this.props.selectedIssueIdsWithoutDeduction?.join(
            ',',
          ),
          selected_pledge_ids: Array.from(this.state.selectedPledgeIds).join(
            ',',
          ),
          personal,
        },
      })
      this.props.onComplete(Array.from(this.state.selectedPledgeIds))
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

export const PledgeSelectorProvider: React.FC = ({ children }) => {
  const persistency = usePersistency()
  const issueSelector = useIssueSelector()
  const toaster = useToaster()

  useEffect(() => {
    issueSelector.action.loadIssues()
  }, [])

  if (!issueSelector.issues) {
    return null
  }

  const selectedIssues = issueSelector.issues.filter(item =>
    issueSelector.selectedIssueIds.has(item.id),
  )

  const shuffledIssues = deterministicShuffle(
    selectedIssues,
    persistency.token!,
    item => item.id.toString(),
  )

  return (
    <PledgeSelectorProviderUnbound
      token={persistency.token!}
      selectedIssueIdsWithoutDeduction={
        persistency.selectedIssueIdsWithoutDeduction
      }
      selectedIssues={shuffledIssues}
      onComplete={selectedPledgeIds =>
        persistency.action.navigate({
          to: PageID.result,
        })
      }
      onExcess={() =>
        toaster.action.pushMessage('앗, 공약은 최대 10개까지 선택 가능해요!')
      }
      reset={() => persistency.action.reset()}
    >
      {children}
    </PledgeSelectorProviderUnbound>
  )
}

export const usePledgeSelector = () => React.useContext(PledgeSelectorContext)
