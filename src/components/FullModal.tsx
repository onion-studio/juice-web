import React, { FC, ReactNode } from 'react'
import s from './FullModal.module.scss'
import { Card } from './Card'
import logo from './images/pactum_logo.png'

interface Props {
  label: ReactNode
  title: ReactNode
  description: ReactNode
  dismissLabel: ReactNode
  onDismiss: () => void
  spacerInner?: ReactNode
  logoVisible?: boolean
}

export const FullModal: FC<Props> = ({
  label,
  title,
  description,
  dismissLabel,
  onDismiss,
  spacerInner,
  logoVisible,
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
      {logoVisible && <img className={s.logo} src={logo} alt="pactum" />}
    </div>
  )
}
