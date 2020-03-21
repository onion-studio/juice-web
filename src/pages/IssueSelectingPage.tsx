import React, { FC, useCallback, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
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

interface IssueCard {
  id: number
  title: string
  description: string
}

const desc =
  '지금 중국이랑 한국, 비상이 걸렸어요.\n' +
  '중국 ‘우한 폐렴’의 확진 환자가 우리나라에서도 나왔거든요. 이게 코로나 바이러스의 일종인데, 치료제는 없고 전염성은 강해서 자칫하면 집단으로 감염될 수 있어요.'

const issueCards: IssueCard[] = [
  { id: 1, title: '코로나 19 바이러스 공포 1', description: desc },
  { id: 2, title: '코로나 19 바이러스 공포 2', description: desc },
  { id: 3, title: '코로나 19 바이러스 공포 3', description: desc },
  { id: 4, title: '코로나 19 바이러스 공포 4', description: desc },
  { id: 5, title: '코로나 19 바이러스 공포 5', description: desc },
  { id: 6, title: '코로나 19 바이러스 공포 6', description: desc },
  { id: 7, title: '코로나 19 바이러스 공포 7', description: desc },
  { id: 8, title: '코로나 19 바이러스 공포 8', description: desc },
  { id: 9, title: '코로나 19 바이러스 공포 9', description: desc },
  { id: 10, title: '코로나 19 바이러스 공포 10', description: desc },
  // { id: 11, title: '코로나 19 바이러스 공포 11', description: desc },
  // { id: 12, title: '코로나 19 바이러스 공포 12', description: desc },
  // { id: 13, title: '코로나 19 바이러스 공포 13', description: desc },
  // { id: 14, title: '코로나 19 바이러스 공포 14', description: desc },
  // { id: 15, title: '코로나 19 바이러스 공포 15', description: desc },
  // { id: 16, title: '코로나 19 바이러스 공포 16', description: desc },
  // { id: 17, title: '코로나 19 바이러스 공포 17', description: desc },
  // { id: 18, title: '코로나 19 바이러스 공포 18', description: desc },
  // { id: 19, title: '코로나 19 바이러스 공포 19', description: desc },
  // { id: 20, title: '코로나 19 바이러스 공포 20', description: desc },
]

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
  // card stack
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [
    selectedIds,
    { add: addSelectedId, remove: removeSelectedId },
  ] = useSet<number>()
  const [discardedIds, { add: addDiscardedId }] = useSet<number>()
  const cardEventManager = useContext(CardEventContext)

  const onConclude = useCallback(
    (selected: boolean) => {
      if (selected) {
        addSelectedId(issueCards[currentCardIndex].id)
      } else {
        addDiscardedId(issueCards[currentCardIndex].id)
      }
    },
    [currentCardIndex, selectedIds],
  )
  const onConclusionAnimationEnd = useCallback(() => {
    setCurrentCardIndex(currentCardIndex + 1)
  }, [currentCardIndex])

  // const conclusionCount = selectedIds.size + discardedIds.size
  const allSelected = currentCardIndex >= issueCards.length
  const progress = currentCardIndex / issueCards.length

  return (
    <div>
      <TopNavBar title="관심 주제 고르기" progress={progress} />
      <div className={s.upperAreaGuide}>
        이 재료를 <br /> 내 공약쥬스에 담을까요?
      </div>
      <div style={{ position: 'relative', height: 372 }}>
        {issueCards.map((c, i) => (
          <IssueCardView
            total={issueCards.length}
            cardNumber={i + 1}
            distance={Math.max(0, i - currentCardIndex)}
            interactive={issueCards[currentCardIndex]?.id === c.id}
            title={c.title}
            description={c.description}
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
  return (
    <CardEventProvider>
      <IssueSelectorView />
    </CardEventProvider>
  )
}
