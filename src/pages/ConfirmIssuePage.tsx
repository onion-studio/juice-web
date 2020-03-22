import React, { FC, useState } from 'react'
import { IssueGridSelector } from '../components/IssueGridSelector'
import { TopNavBar } from '../components/TopNavBar'
import s from './ConfirmIssuePage.module.scss'

const mockItems = [
  { id: 1, title: '주거 여건', selected: true },
  { id: 2, title: '주거 여건', selected: true },
  { id: 3, title: '주거 여건', selected: true },
  { id: 4, title: '주거 여건', selected: true },
  { id: 5, title: '주거 여건', selected: true },
  { id: 6, title: '주거 여건', selected: true },
  { id: 7, title: '주거 여건', selected: true },
  { id: 8, title: '주거 여건', selected: true },
  { id: 9, title: '주거 여건', selected: true },
  { id: 10, title: '주거 여건', selected: true },
]

export const ConfirmIssuePage: FC = () => {
  const [dirty, setDirty] = useState(false)
  const selectedIssueCount = mockItems.filter(item => item.selected).length
  const tooLittle = selectedIssueCount < 3
  const progress = tooLittle ? 0 : 1
  return (
    <div className={s.main}>
      <TopNavBar
        title="관심 주제 고르기"
        progress={progress}
        action={
          <div
            className={s.nextButton}
            onClick={() => {
              if (!tooLittle) {
                alert('준비중')
              }
            }}
          >
            다음
          </div>
        }
      />
      <div className={s.heading}>
        {tooLittle
          ? `재료를 ${1}개 더 골라주세요!`
          : dirty
          ? `재료를 ${6}개 골랐어요.`
          : `재료는 5개 정도가 가장 적당해요!`}
      </div>
      <div className={s.subheading}>
        {tooLittle
          ? `최소 3개의 주제를 골라야 맛있는 공약쥬스를 만들 수 있답니다.`
          : dirty
          ? `그냥 넘어가도 되지만, 5개면 딱 좋아요!`
          : `혹시 뺄 만한 재료는 없는지 생각해 보세요.`}
      </div>
      <div style={{ height: 32 }} />
      <IssueGridSelector
        items={mockItems}
        onToggle={() => {
          setDirty(true)
        }}
      />
    </div>
  )
}
