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
import { Issue } from '../contexts/entities'
import { deterministicShuffle } from '../utils/sort'
import cover from './cover-issue.png'
import { issueImageMap } from '../components/images/issues/issueImageMap'

const IssueSelectorView: FC = () => {
  const persistency = usePersistency()
  const issueSelector = useIssueSelector()
  const _issues = issueSelector.issues
  useEffect(() => {
    issueSelector.action.loadIssues()
  }, [])

  const shuffledIssues = useMemo<Issue[] | null>(() => {
    if (!_issues) return null
    return deterministicShuffle(_issues, persistency.token!, issue =>
      issue.id.toString(),
    )
  }, [_issues, persistency.token])

  const cardEventManager = useContext(CardEventContext)
  // card stack
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const allSelected =
    shuffledIssues !== null ? currentCardIndex >= shuffledIssues.length : false
  const progress =
    shuffledIssues !== null ? currentCardIndex / shuffledIssues.length : 0
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
          selectedIssueIds: Array.from(selectedIds),
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
      const id = shuffledIssues![currentCardIndex].id
      if (selected) {
        addSelectedId(id)
        issueSelector.action.selectIssue(id)
      } else {
        addDiscardedId(id)
      }
    },
    [
      shuffledIssues,
      currentCardIndex,
      selectedIds,
      addSelectedId,
      addDiscardedId,
    ],
  )
  const onConclusionAnimationEnd = useCallback(() => {
    setCurrentCardIndex(currentCardIndex + 1)
  }, [currentCardIndex])

  if (!shuffledIssues) {
    return null
  }

  return (
    <div>
      <TopNavBar title="관심 주제 고르기" progress={progress} />
      <div className={s.upperAreaGuide}>
        이 주제를 <br /> 내 공약쥬스에 담을까요?
      </div>
      <div style={{ position: 'relative', height: 372 }}>
        {shuffledIssues.map((c, i) => (
          <IssueCardView
            key={c.id}
            total={shuffledIssues.length}
            cardNumber={i + 1}
            imageUrl={issueImageMap[c.id]}
            distance={Math.max(0, i - currentCardIndex)}
            interactive={shuffledIssues[currentCardIndex]?.id === c.id}
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
              19개의 주제 카드를 보여드려요.
              <br />
              관심이 있으면 오른쪽,
              <br />
              아니면 왼쪽으로 넘겨주세요!
            </div>
          }
          spacerInner={
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: -50,
                bottom: 0,
                left: -50,
                backgroundImage: `url('${cover}')`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50% 70%',
                backgroundSize: '100%',
              }}
            />
          }
          dismissLabel="시작하기"
          onDismiss={() => setModalVisible(false)}
        />
      )}
      <IssueSelectorView />
    </CardEventProvider>
  )
}
