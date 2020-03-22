import buildContext from '../contextUtil/buildContext'
import { RequestMixin } from '../contextUtil/RequestMixin'

interface Issue {
  id: number
  title: string
  description: string
}

export const {
  Provider: IssueSelectorProvider,
  useThisContext: useIssueSelectorContext,
  actionCreators: issueSelectorAction,
} = buildContext({
  name: 'SelectorContext',
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
  .thunkCreators((a, t) => ({}))
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
  .build()
