import React, { FC, useCallback, useContext, useRef, useState } from 'react'
import { IssueCardCommand, IssueCardView } from '../components/IssueCardView'
import s from './SelectStagePage.module.scss'
import { useMap } from 'react-use'
import {
  CardEventContext,
  CardEventProvider,
} from '../contexts/CardEventContext'

const selectedIds: number[] = []

interface IssueCard {
  id: number
  title: string
  description: string
}

const issueCards: IssueCard[] = [
  { id: 1, title: '코로나 19 바이러스 공포 1', description: '...' },
  { id: 2, title: '코로나 19 바이러스 공포 2', description: '...' },
  { id: 3, title: '코로나 19 바이러스 공포 3', description: '...' },
  { id: 4, title: '코로나 19 바이러스 공포 4', description: '...' },
  { id: 5, title: '코로나 19 바이러스 공포 5', description: '...' },
  { id: 6, title: '코로나 19 바이러스 공포 6', description: '...' },
  { id: 7, title: '코로나 19 바이러스 공포 7', description: '...' },
  { id: 8, title: '코로나 19 바이러스 공포 8', description: '...' },
  { id: 9, title: '코로나 19 바이러스 공포 9', description: '...' },
  { id: 10, title: '코로나 19 바이러스 공포 10', description: '...' },
  { id: 11, title: '코로나 19 바이러스 공포 11', description: '...' },
  { id: 12, title: '코로나 19 바이러스 공포 12', description: '...' },
  { id: 13, title: '코로나 19 바이러스 공포 13', description: '...' },
  { id: 14, title: '코로나 19 바이러스 공포 14', description: '...' },
  { id: 15, title: '코로나 19 바이러스 공포 15', description: '...' },
  { id: 16, title: '코로나 19 바이러스 공포 16', description: '...' },
  { id: 17, title: '코로나 19 바이러스 공포 17', description: '...' },
  { id: 18, title: '코로나 19 바이러스 공포 18', description: '...' },
  { id: 19, title: '코로나 19 바이러스 공포 19', description: '...' },
  { id: 20, title: '코로나 19 바이러스 공포 20', description: '...' },
]

const IssueSelectorView: FC = () => {
  // card stack
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [slideAnimationPlaying, setSlideAnimationPlaying] = useState(false)
  const cardEventManager = useContext(CardEventContext)
  const currentCard = issueCards[currentCardIndex]
  const oldCard: IssueCard = issueCards[currentCardIndex - 1]
  const onConclude = useCallback(
    (selected: boolean) => {
      setCurrentCardIndex(currentCardIndex + 1)
      setSlideAnimationPlaying(true)
      if (selected) {
        selectedIds.push(currentCard.id)
      }
    },
    [currentCardIndex, currentCard],
  )
  const onConclusionAnimationEnd = useCallback(() => {
    setSlideAnimationPlaying(false)
  }, [])
  return (
    <div>
      <div>
        {selectedIds.map(id => (
          <span>({id})</span>
        ))}
      </div>
      <div style={{ position: 'relative', height: 388 }}>
        <IssueCardView
          key={currentCard.id}
          title={currentCard.title}
          description={currentCard.description}
          onSelect={() => onConclude(true)}
          onSelectAnimationEnd={onConclusionAnimationEnd}
          onDiscard={() => onConclude(false)}
          onDiscardAnimationEnd={onConclusionAnimationEnd}
        />
        {slideAnimationPlaying && (
          <IssueCardView
            key={oldCard.id}
            title={oldCard.title}
            description={oldCard.description}
            onSelect={() => onConclude(true)}
            onSelectAnimationEnd={onConclusionAnimationEnd}
            onDiscard={() => onConclude(false)}
            onDiscardAnimationEnd={onConclusionAnimationEnd}
          />
        )}
      </div>
      <div className={s.selectButtonContainer}>
        <div
          className={s.selectButton}
          onClick={() => {
            cardEventManager.discard()
          }}
        >
          싫어요
        </div>
        <div
          className={s.selectButton}
          onClick={() => {
            cardEventManager.select()
          }}
        >
          담을래요
        </div>
      </div>
    </div>
  )
}

export const SelectStagePage: FC = () => {
  return (
    <CardEventProvider>
      <IssueSelectorView />
    </CardEventProvider>
  )
}
