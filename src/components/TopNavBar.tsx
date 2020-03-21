import React, { FC, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import s from './TopNavBar.module.scss'
import { Lace } from './Lace'

const topNavSlot = document.querySelector('#top-nav')!

export const TopNavBar: FC<{
  title: ReactNode
  action?: ReactNode
  progress: number
}> = ({ title, action, progress }) => {
  return createPortal(
    <div className={s.container}>
      <div className={s.progressBar} style={{ width: `${progress * 100}%` }} />
      <div className={s.backButton}>TODO</div>
      <div className={s.title}>{title}</div>
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
