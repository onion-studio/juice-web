import React, { FC, ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import s from './TopNavBar.module.scss'
import c from 'classnames'
import { Lace } from './Lace'
import { usePersistency } from '../contexts/PersistencyContext'

const topNavSlot = document.querySelector('#top-nav')!

export const TopNavBar: FC<{
  title: ReactNode
  action?: ReactNode
  progress: number
}> = ({ title, action, progress }) => {
  const persistency = usePersistency()
  const [scrollIsTop, setScrollIsTop] = useState(true)
  useEffect(() => {
    const handler = () => {
      if (window.scrollY < 10) {
        setScrollIsTop(true)
      } else {
        setScrollIsTop(false)
      }
    }
    window.addEventListener('scroll', handler)
    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [])

  return createPortal(
    <div className={s.wrap}>
      <div className={c(s.lace, { [s.lace__hidden]: !scrollIsTop })}>
        <Lace />
      </div>
      <div className={s.container}>
        <div
          className={s.progressBar}
          style={{ width: `${progress * 100}%` }}
        />
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
      </div>
    </div>,
    topNavSlot,
  )
}
