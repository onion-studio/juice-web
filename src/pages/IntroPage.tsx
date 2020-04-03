import React, { FC, useEffect, useRef } from 'react'
import ky from 'ky'
import { PageID, usePersistency } from '../contexts/PersistencyContext'
import { FullModal } from '../components/FullModal'
import coverIntro from './cover-intro.png'
import cover from './cover-issue.png'

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
      <FullModal
        label="JUICE"
        title={
          <div style={{ marginTop: -10 }}>
            나랑 어울리는 정당을 찾아주는
            <br /> <span style={{ fontSize: 28 }}>공약쥬스</span>
          </div>
        }
        description={<div>쉽고 편하게 투표할 정당을 정해 보세요!</div>}
        spacerInner={
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: `url('${coverIntro}')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50% 70%',
              backgroundSize: '90%',
            }}
          />
        }
        dismissLabel="시작하기"
        onDismiss={() => {
          if (tokenRef.current) {
            persistency.action.navigate({
              to: PageID.issueSelector,
              token: tokenRef.current,
            })
          }
        }}
      />
    </div>
  )
}
