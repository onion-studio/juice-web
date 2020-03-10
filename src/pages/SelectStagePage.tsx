import React, { FC, useRef, useState } from 'react'
import { IssueCardCommand, IssueCardView } from '../components/IssueCardView'
import s from './SelectStagePage.module.scss'
import { useMap } from 'react-use'

const IssueSelectorView: FC = () => {
  const [ids, setIds] = useState<number[]>([0])
  const [commandMap, commandMapAction] = useMap<{
    [id: number]: IssueCardCommand
  }>({})
  const idsRef = useRef(ids)
  idsRef.current = ids
  return (
    <div>
      <div style={{ position: 'relative', height: 388 }}>
        {ids.map(id => (
          <IssueCardView
            key={id}
            command={commandMap[id]}
            title="코로나19 바이러스 공포"
            description="지금 중국이랑 한국, 비상이 걸렸어요.
중국 ‘우한 폐렴’의 확진 환자가 우리나라에서도 나왔거든요. 이게 코로나 바이러스의 일종인데, 치료제는 없고 전염성은 강해서 자칫하면 집단으로 감염될 수 있어요."
            onSelect={() => {
              // alert(`onSelect ${id}`)
              setIds([id + 1, ...idsRef.current])
            }}
            onSelectAnimationEnd={() => {
              // alert(`onSelectAnimationEnd ${id}`)
              setIds(idsRef.current.filter(i => i !== id))
            }}
            onDiscard={() => {
              // alert(`onDiscard ${id}`)
              setIds([id + 1, ...idsRef.current])
            }}
            onDiscardAnimationEnd={() => {
              // alert(`onDiscardAnimationEnd ${id}`)
              setIds(idsRef.current.filter(i => i !== id))
            }}
          />
        ))}
      </div>
      <div className={s.selectButtonContainer}>
        <div
          className={s.selectButton}
          onClick={() => {
            commandMapAction.set(
              ids[ids.length - 1],
              IssueCardCommand.leftSlide,
            )
          }}
        >
          싫어요
        </div>
        <div
          className={s.selectButton}
          onClick={() => {
            commandMapAction.set(
              ids[ids.length - 1],
              IssueCardCommand.rightSlide,
            )
          }}
        >
          담을래요
        </div>
      </div>
    </div>
  )
}

export const SelectStagePage: FC = () => {
  return <IssueSelectorView />
}
