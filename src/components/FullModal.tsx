import React, { CSSProperties, FC, ReactNode } from 'react'
import s from './FullModal.module.scss'
import { Card } from './Card'

interface Props {
  label: ReactNode
  title: ReactNode
  description: ReactNode
  dismissLabel: ReactNode
  onDismiss: () => void
  spacerInner?: ReactNode
}

export const FullModal: FC<Props> = ({
  label,
  title,
  description,
  dismissLabel,
  onDismiss,
  spacerInner,
}) => {
  return (
    <div className={s.main}>
      <Card
        style={{ height: 500, marginTop: 72 }}
        topLabel={label}
        actionLabel={dismissLabel}
        onAction={onDismiss}
      >
        <div className={s.title}>{title}</div>
        <div className={s.spacer}>{spacerInner}</div>
        <div className={s.description}>{description}</div>
      </Card>
    </div>
  )
}
