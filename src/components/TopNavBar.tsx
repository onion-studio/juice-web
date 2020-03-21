import React, { FC, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import s from './TopNavBar.module.scss'

const topNavSlot = document.querySelector('#top-nav')!

export const TopNavBar: FC<{
  title: ReactNode
  action?: ReactNode
  progress: number
}> = ({ title, action, progress }) => {
  return createPortal(
    <div className={s.container}>
      <div className={s.progressBar} style={{ width: `${progress * 100}%` }} />
      <div className={s.backButton}>뒤로</div>
      <div className={s.title}>{title}</div>
      {action && (
        <div id="navAction" className={s.actionButton}>
          {action}
        </div>
      )}
    </div>,
    topNavSlot,
  )
}
