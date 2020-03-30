import React, { CSSProperties, FC } from 'react'
import { useToggle } from 'react-use'
import c from 'classnames'
import s from './PledgeCard.module.scss'
import { ReactComponent as IconPick } from './svg/ico-pick.svg'
import { ReactComponent as ArrowFold } from './svg/arr-fold.svg'
import { ReactComponent as ArrowUnfold } from './svg/arr-unfold.svg'

export const PledgeCard: FC<{
  onSelect?: () => void
  selected?: boolean
  title: string
  summary: string
  onToggleFolding?: () => void
  folded?: boolean
  style?: CSSProperties
}> = ({
  onSelect,
  selected,
  title,
  summary,
  onToggleFolding: onToggleFoldingExt,
  folded: foldedExt,
  style,
}) => {
  const [foldedState, toggleFolded] = useToggle(true)
  const folded = foldedExt ?? foldedState
  const onToggleFolding = onToggleFoldingExt ?? toggleFolded
  return (
    <div
      className={c(s.pledgeCard, { [s.pledgeCard__selected]: selected })}
      onClick={onSelect}
      style={style}
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
