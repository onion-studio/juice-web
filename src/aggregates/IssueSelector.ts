import buildContext from '../contextUtil/buildContext'
import { delay } from '../utils/async'

interface Issue {
  id: number
  /// 제목
  title: string
  /// markdown string
  description: string
  /// tags
  tags: string[]
}

export const issues: Issue[] = [
  {
    id: 1,
    title: '1 코로나19 바이러스 공포',
    description: `지금 중국이랑 한국, 비상이 걸렸어요.
중국 ‘우한 폐렴’의 확진 환자가 우리나라에서도 나왔거든요. 이게 코로나 바이러스의 일종인데, 치료제는 없고 전염성은 강해서 자칫하면 집단으로 감염될 수 있어요.`,
    tags: ['질병', '감염병', '출입국관리'],
  },
  {
    id: 2,
    title: '2 코로나19 바이러스 공포',
    description: `지금 중국이랑 한국, 비상이 걸렸어요.
중국 ‘우한 폐렴’의 확진 환자가 우리나라에서도 나왔거든요. 이게 코로나 바이러스의 일종인데, 치료제는 없고 전염성은 강해서 자칫하면 집단으로 감염될 수 있어요.`,
    tags: ['질병', '감염병', '출입국관리'],
  },
]

enum AnimationState {
  idle = 'idle',
  leftSlide = 'leftSlide',
  rightSlide = 'rightSlide',
  appearing = 'appearing',
}

interface State {
  animationState: AnimationState
  numOfSelectedIssues: number
  selectedIssueIds: number[]
  discardedIssueIds: number[]
}

enum Action {
  selectingStarted = 'selectingStarted',
  discardingStarted = 'discardingStarted',
  selectingFinished = 'selectingFinished',
  discardingFinished = 'discardingFinished',
  appearingFinished = 'appearingFinished',
}

export const {
  useThisContext: useIssueSelector,
  Provider: IssueSelectorProvider,
  thunkCreators: issueSelectorThunk,
} = buildContext({
  name: 'IssueSelector',
})
  .actionCreators({
    selectingStarted: (id: number) => ({
      type: Action.selectingStarted as const,
      id,
    }),
    selectingFinished: () => ({ type: Action.selectingFinished as const }),
    discardingStarted: (id: number) => ({
      type: Action.discardingStarted as const,
      id,
    }),
    discardingFinished: () => ({ type: Action.discardingFinished as const }),
    appearingFinished: () => ({ type: Action.appearingFinished as const }),
  })
  .producer<State>(
    {
      animationState: AnimationState.idle,
      numOfSelectedIssues: 0,
      selectedIssueIds: [],
      discardedIssueIds: [],
    },
    (draft, action) => {
      switch (action.type) {
        case Action.selectingStarted:
          draft.animationState = AnimationState.rightSlide
          draft.numOfSelectedIssues += 1
          draft.selectedIssueIds.push(action.id)
          break
        case Action.discardingStarted:
          draft.animationState = AnimationState.leftSlide
          draft.numOfSelectedIssues += 1
          draft.discardedIssueIds.push(action.id)
          break
        case Action.discardingFinished:
        case Action.selectingFinished:
          draft.animationState = AnimationState.appearing
          break
        case Action.appearingFinished:
          draft.animationState = AnimationState.idle
          break
        default:
          throw new Error('no matching branch')
      }
    },
  )
  .thunkCreators((a, t) => ({
    select: (id: number) => async dispatch => {
      dispatch(a.selectingStarted(id))
      await delay(500)
      dispatch(a.selectingFinished())
      await delay(500)
      dispatch(a.appearingFinished())
    },
    discard: (id: number) => async dispatch => {
      dispatch(a.discardingStarted(id))
      await delay(500)
      dispatch(a.discardingFinished())
      await delay(500)
      dispatch(a.appearingFinished())
    },
  }))
  .build()
