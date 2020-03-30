import React, { FC, useEffect, useRef } from 'react'
import ky from 'ky'
import { PageID, usePersistency } from '../contexts/PersistencyContext'

export const IntroPage: FC = () => {
  const persistency = usePersistency()
  let tokenRef = useRef<string | null>(null)
  useEffect(() => {
    async function init() {
      const res: any = await ky.post('https://api.juice.vote/init').json()
      tokenRef.current = res.token
    }
    init()
  }, [])
  return (
    <div>
      <h1>INTRO</h1>
      <div
        onClick={() => {
          if (tokenRef.current) {
            persistency.action.navigate({
              to: PageID.issueSelector,
              token: tokenRef.current,
            })
          }
        }}
      >
        시작
      </div>
    </div>
  )
}
