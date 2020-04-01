import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { IssueCardView } from '../components/IssueCardView'
import s from './IssueSelectingPage.module.scss'
import {
  CardEventContext,
  CardEventProvider,
} from '../contexts/CardEventContext'
import { TopNavBar } from '../components/TopNavBar'
import { useSet } from 'react-use'
import { ReactComponent as IconXBlack } from '../components/svg/ico-x-black.svg'
import { ReactComponent as IconPickBlack } from '../components/svg/ico-pick-black.svg'
import { FullModal } from '../components/FullModal'
import { PageID, usePersistency } from '../contexts/PersistencyContext'
import { useIssueSelector } from '../contexts/IssueSelectorContext'
import { Md5 } from 'ts-md5'
import { Issue } from '../contexts/entities'

const IssueSelectorView: FC = () => {
  const persistency = usePersistency()
  const issueSelector = useIssueSelector()
  const _issues = issueSelector.issues
  useEffect(() => {
    issueSelector.action.loadIssues()
  }, [])

  const issues = useMemo<Issue[] | null>(() => {
    if (!_issues) return null
    return [..._issues].sort((i1, i2) => {
      const hashed1 = Md5.hashStr(persistency.token! + i1.id)
      const hashed2 = Md5.hashStr(persistency.token! + i2.id)
      if (hashed1 < hashed2) {
        return -1
      } else if (hashed1 === hashed2) {
        return 0
      } else {
        return 1
      }
    })
  }, [_issues, persistency.token])

  const cardEventManager = useContext(CardEventContext)
  // card stack
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const allSelected =
    issues !== null ? currentCardIndex >= issues.length : false
  const progress = issues !== null ? currentCardIndex / issues.length : 0
  const [
    selectedIds,
    { add: addSelectedId, remove: removeSelectedId },
  ] = useSet<number>()
  const [discardedIds, { add: addDiscardedId }] = useSet<number>()
  useEffect(() => {
    if (allSelected) {
      if (selectedIds.size < 3 || selectedIds.size > 5) {
        persistency.action.navigate({
          to: PageID.issueConfirmation,
        })
      } else {
        persistency.action.navigate({
          to: PageID.pledgeSelector,
          selectedIssueIds: Array.from(selectedIds),
        })
      }
    }
  }, [allSelected, selectedIds.size])

  const onConclude = useCallback(
    (selected: boolean) => {
      const id = issues![currentCardIndex].id
      if (selected) {
        addSelectedId(id)
        issueSelector.action.selectIssue(id)
      } else {
        addDiscardedId(id)
      }
    },
    [issues, currentCardIndex, selectedIds, addSelectedId, addDiscardedId],
  )
  const onConclusionAnimationEnd = useCallback(() => {
    setCurrentCardIndex(currentCardIndex + 1)
  }, [currentCardIndex])

  if (!issues) {
    return null
  }

  return (
    <div>
      <TopNavBar title="관심 주제 고르기" progress={progress} />
      <div className={s.upperAreaGuide}>
        이 재료를 <br /> 내 공약쥬스에 담을까요?
      </div>
      <div style={{ position: 'relative', height: 372 }}>
        {issues.map((c, i) => (
          <IssueCardView
            key={c.id}
            total={issues.length}
            cardNumber={i + 1}
            distance={Math.max(0, i - currentCardIndex)}
            interactive={issues[currentCardIndex]?.id === c.id}
            issue={c}
            onSelect={() => onConclude(true)}
            onSelectAnimationEnd={onConclusionAnimationEnd}
            onDiscard={() => onConclude(false)}
            onDiscardAnimationEnd={onConclusionAnimationEnd}
          />
        ))}
      </div>
      <div className={s.selectButtonContainer}>
        <div
          className={s.discardButton}
          onClick={() => {
            cardEventManager.discard()
          }}
        >
          <div>
            <IconXBlack />
          </div>

          <div>싫어요</div>
        </div>
        <div
          className={s.selectButton}
          onClick={() => {
            cardEventManager.select()
          }}
        >
          <div>
            <IconPickBlack />
          </div>

          <div>담을래요</div>
        </div>
      </div>
    </div>
  )
}

export const IssueSelectingPage: FC = () => {
  const [modalVisible, setModalVisible] = useState(true)

  return (
    <CardEventProvider>
      {modalVisible && (
        <FullModal
          label="STEP 1"
          title={
            <div>
              1단계:
              <br />내 관심 주제 고르기
            </div>
          }
          description={
            <div>
              앗, 뜨거운 감자!
              <br />
              20개의 재료 카드를 보여드려요.
              <br />
              좌우로 스와이프해서
              <br />
              관심 있는 재료 카드를 골라주세요!
            </div>
          }
          dismissLabel="시작하기"
          onDismiss={() => setModalVisible(false)}
        />
      )}
      <IssueSelectorView />
    </CardEventProvider>
  )
}
