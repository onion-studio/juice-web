import buildContext from '../contextUtil/buildContext'

export const {
  Provider: SelectorProvider,
  useThisContext: useSelectorContext,
} = buildContext({
  name: 'SelectorContext',
  logging: true,
})
  .mixins([])
  .actionCreators({})
  .thunkCreators((a, t) => ({}))
  .producer({}, draft => {})
  .build()
