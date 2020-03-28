import React, { FC } from 'react'
import { useToggle } from 'react-use'
import c from 'classnames'
import s from './PledgeCard.module.scss'
import { ReactComponent as IconPick } from './svg/ico-pick.svg'
import { ReactComponent as ArrowFold } from './svg/arr-fold.svg'
import { ReactComponent as ArrowUnfold } from './svg/arr-unfold.svg'

export const PledgeCard: FC<{
  onSelect: () => void
  selected: boolean
  title: string
  summary: string
  onToggleFolding: () => void
  folded: boolean
}> = ({ onSelect, selected, title, summary, onToggleFolding, folded }) => {
  return (
    <div
      className={c(s.pledgeCard, { [s.pledgeCard__selected]: selected })}
      onClick={onSelect}
    >
      {selected && <IconPick className={s.pickIcon} />}
      <div className={s.pledgeCard_title}>{title}</div>
      <div
        className={s.pledgeCard_foldButton}
        onClick={e => {
          e.stopPropagation()
          onToggleFolding()
        }}
      >
        {folded ? <ArrowUnfold /> : <ArrowFold />}
      </div>
      {folded || <div className={s.pledgeCard_description}>{summary}</div>}
    </div>
  )
}
