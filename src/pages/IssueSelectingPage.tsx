import React, { FC, useCallback, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useHistory } from 'react-router-dom'
import { IssueCardView } from '../components/IssueCardView'
import s from './IssueSelectingPage.module.scss'
import {
  CardEventContext,
  CardEventProvider,
} from '../contexts/CardEventContext'
import {
  useIssueSelectorContext,
  issueSelectorThunk,
  issueSelectorAction,
} from '../contexts/IssueSelectorContext'
import { TopNavBar } from '../components/TopNavBar'
import { useSet } from 'react-use'
import { ReactComponent as IconXBlack } from '../components/svg/ico-x-black.svg'
import { ReactComponent as IconPickBlack } from '../components/svg/ico-pick-black.svg'
import { Issue } from '../contexts/entities'
import { FullModal } from '../components/FullModal'

interface IssueCard {
  id: number
  title: string
  description: string
}

const ConfirmModal: FC<{ ids: number[]; onRemove: (id: number) => void }> = ({
  ids,
  onRemove,
}) => {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(153, 153, 153, 0.7)',
        padding: 20,
        overflowY: 'scroll',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          width: 300,
          margin: '0 auto',
        }}
      >
        <div className={s.confirmModalTitle}>내가 고른 재료</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className={s.confirmModalList}>
            {ids.map(id => (
              <div key={id} className={s.confirmModalItem}>
                <div style={{ textAlign: 'center', flexGrow: 1 }}>{id}</div>

                <div className={s.confirmModalItemLabel}>코로나 19</div>
                <div
                  className={s.confirmModalRemove}
                  onClick={() => onRemove(id)}
                >
                  x
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={s.confirmModalButton} onClick={() => alert('준비중^^')}>
          확인
        </div>
      </div>
    </div>,
    document.querySelector('#modal')!,
  )
}

const IssueSelectorView: FC = () => {
  const [issueSelectorState, issueSelectorDispatch] = useIssueSelectorContext()
  const issues = issueSelectorState.issuesReq.data
  useEffect(() => {
    issueSelectorDispatch(issueSelectorThunk.loadIssues())
  }, [])
  const cardEventManager = useContext(CardEventContext)
  const history = useHistory()
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
        history.push('/confirm')
      } else {
        history.push('/pledges')
      }
    }
  }, [allSelected, selectedIds.size])

  const onConclude = useCallback(
    (selected: boolean) => {
      const id = issues![currentCardIndex].id
      if (selected) {
        addSelectedId(id)
        issueSelectorDispatch(issueSelectorAction.selectIssue(id))
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
  // const conclusionCount = selectedIds.size + discardedIds.size

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
          title="1단계: 내 관심 주제 고르기"
          description=""
          dismissLabel="시작하기"
          onDismiss={() => setModalVisible(false)}
        />
      )}
      <IssueSelectorView />
    </CardEventProvider>
  )
}
