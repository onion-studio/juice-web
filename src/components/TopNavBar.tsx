import React, { FC, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import s from './TopNavBar.module.scss'
import { Lace } from './Lace'
import { usePersistency } from '../contexts/PersistencyContext'

const topNavSlot = document.querySelector('#top-nav')!

export const TopNavBar: FC<{
  title: ReactNode
  action?: ReactNode
  progress: number
}> = ({ title, action, progress }) => {
  const persistency = usePersistency()

  return createPortal(
    <div className={s.container}>
      <div className={s.progressBar} style={{ width: `${progress * 100}%` }} />
      <div className={s.title}>{title}</div>
      <div
        className={s.backButton}
        onClick={() => {
          if (window.confirm('처음으로 돌아가시겠어요?')) {
            persistency.action.reset()
          }
        }}
      />
      {action && (
        <div id="navAction" className={s.actionButton}>
          {action}
        </div>
      )}

      <div className={s.lace}>
        <Lace />
      </div>
    </div>,
    topNavSlot,
  )
}
