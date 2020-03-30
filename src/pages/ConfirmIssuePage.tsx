import React, { FC, useState } from 'react'
import { IssueGridSelector } from '../components/IssueGridSelector'
import { TopNavBar } from '../components/TopNavBar'
import s from './ConfirmIssuePage.module.scss'
import { PageID, usePersistency } from '../contexts/PersistencyContext'
import { useIssueSelector } from '../contexts/IssueSelectorContext'

export const ConfirmIssuePage: FC = () => {
  const persistency = usePersistency()
  const issueSelector = useIssueSelector()
  React.useEffect(() => {
    if (!issueSelector.issues) {
      issueSelector.action.loadIssues()
    }
  }, [issueSelector.issues])
  const { issues, selectedIssueIds } = issueSelector
  const [dirty, setDirty] = useState(false)
  const selectedIssueCount = selectedIssueIds.size
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
                persistency.action.navigate({
                  to: PageID.pledgeSelector,
                  selectedIssueIds: Array.from(selectedIssueIds),
                })
              }
            }}
          >
            다음
          </div>
        }
      />
      <div className={s.heading}>
        {tooLittle
          ? `재료를 ${3 - selectedIssueCount}개 더 골라주세요!`
          : dirty
          ? `재료를 ${selectedIssueCount}개 골랐어요.`
          : `재료는 5개 정도가 가장 적당해요!`}
      </div>
      <div className={s.subheading}>
        {tooLittle ? (
          <div>
            최소 3개의 주제를 골라야 맛있는 공약쥬스를
            <br />
            만들 수 있답니다.
          </div>
        ) : dirty ? (
          `그냥 넘어가도 되지만, 5개면 딱 좋아요!`
        ) : (
          `혹시 뺄 만한 재료는 없는지 생각해 보세요.`
        )}
      </div>
      <div style={{ height: 32 }} />
      {issues && (
        <IssueGridSelector
          items={issues}
          selectedIds={Array.from(selectedIssueIds)}
          onSelect={id => {
            setDirty(true)
            issueSelector.action.selectIssue(id)
          }}
          onDiscard={id => {
            setDirty(true)
            issueSelector.action.discardIssue(id)
          }}
        />
      )}
    </div>
  )
}
