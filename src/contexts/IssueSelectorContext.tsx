import buildContext from '../contextUtil/buildContext'
import { RequestMixin } from '../contextUtil/RequestMixin'
import ky from 'ky'

interface Issue {
  id: number
  name: string
  summary: string
  tag1: string | null
  tag2: string | null
  tag3: string | null
}

export const {
  Provider: IssueSelectorProvider,
  useThisContext: useIssueSelectorContext,
  actionCreators: issueSelectorAction,
  thunkCreators: issueSelectorThunk,
} = buildContext({
  name: 'IssueSelectorContext',
  logging: true,
})
  .mixins([
    new RequestMixin('issuesReq', RequestMixin.either<Issue[], string>()),
  ])
  .actionCreators({
    selectIssue: (id: number) => ({
      type: 'selectIssue' as const,
      id,
    }),
    discardIssue: (id: number) => ({
      type: 'discardIssue' as const,
      id,
    }),
  })
  .producer({ selectedIssueIds: [] as number[] }, (draft, action) => {
    switch (action.type) {
      case 'selectIssue':
        draft.selectedIssueIds.push(action.id)
        break
      case 'discardIssue':
        const index = draft.selectedIssueIds.findIndex(
          item => item === action.id,
        )
        if (index !== -1) {
          draft.selectedIssueIds.splice(index, 1)
        }
        break
    }
  })
  // FIXME: thunkCreators가 producer보다 앞에 왔을 때 문제 생김 (thunkCreator.loadIssues 없다고 나옴)
  .thunkCreators((a, t) => ({
    loadIssues: () => async dispatch => {
      dispatch(a.issuesReq('start'))
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

      dispatch(a.issuesReq('complete', res.issues))
    },
  }))
  .build()
