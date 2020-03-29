import React, { CSSProperties, FC, ReactNode } from 'react'
import c from 'classnames'
import s from './Card.module.scss'

export const Card: FC<{
  style: CSSProperties
  topLabel: ReactNode
  hovering?: boolean
  actionLabel?: ReactNode
  onAction: () => void
  children: ReactNode
}> = ({ style, topLabel, hovering, actionLabel, onAction, children }) => {
  return (
    <div className={c(s.card, { [s.card__hovering]: hovering })} style={style}>
      <div className={s.topLabel}>
        <div className={s.topLabel_content}>{topLabel}</div>
      </div>
      <div className={s.card_inner}>
        {children}
        {actionLabel && (
          <div className={s.detailButton} onClick={onAction}>
            {actionLabel}
          </div>
        )}
      </div>
    </div>
  )
}
