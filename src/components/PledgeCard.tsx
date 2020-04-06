import React, { CSSProperties, FC, ReactNode } from 'react'
import { useToggle } from 'react-use'
import c from 'classnames'
import s from './PledgeCard.module.scss'
import { ReactComponent as IconPick } from './svg/ico-pick.svg'
import { ReactComponent as IconPickGray } from './svg/ico_pick_gray.svg'
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
  tags?: string[]
}> = ({
  onSelect,
  selected,
  title,
  summary,
  onToggleFolding: onToggleFoldingExt,
  folded: foldedExt,
  style = {},
  tags,
}) => {
  const [foldedState, toggleFolded] = useToggle(true)
  const folded = foldedExt ?? foldedState
  const onToggleFolding = onToggleFoldingExt ?? toggleFolded
  return (
    <div
      className={c(s.pledgeCard, { [s.pledgeCard__selected]: selected })}
      onClick={onSelect}
      style={{ cursor: onSelect ? 'pointer' : 'auto', ...style }}
    >
      {onSelect ? (
        selected ? (
          <IconPick className={s.pickIcon} />
        ) : (
          <IconPickGray className={s.pickIcon} />
        )
      ) : null}
      <div className={s.pledgeCard_title}>
        {title}
        {tags && (
          <div className={s.tagList}>
            {tags.map(t => (
              <span className={s.tag} key={t}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
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
