import React, { FC } from 'react'
import { createPortal } from 'react-dom'
import s from './Toast.module.scss'
import { useToaster } from '../contexts/ToasterContext'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const toastSlot = document.querySelector('#toast')!

export const Toast: FC = () => {
  const toaster = useToaster()
  if (!toaster.toasts) return null
  return createPortal(
    <TransitionGroup className={s.wrap}>
      {toaster.toasts.map(m => {
        return (
          <CSSTransition
            key={m.id}
            timeout={{
              exit: 300,
            }}
            classNames={{
              enter: s.toast__hidden,
              enterActive: s.toast__visible,
              exit: s.toast__hidden,
            }}
          >
            <div className={s.toast}>{m.message}</div>
          </CSSTransition>
        )
      })}
    </TransitionGroup>,
    toastSlot,
  )
}
