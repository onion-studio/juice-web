import React, { FC, ReactNode } from 'react'
import s from './FullModal.module.scss'

interface Props {
  label: ReactNode
  title: ReactNode
  description: ReactNode
  dismissLabel: ReactNode
  onDismiss: () => void
}

export const FullModal: FC<Props> = ({
  label,
  title,
  description,
  dismissLabel,
  onDismiss,
}) => {
  return (
    <div className={s.main}>
      <div>{label}</div>
      <div>{title}</div>
      <div>{description}</div>
      <div onClick={onDismiss}>{dismissLabel}</div>
    </div>
  )
}
