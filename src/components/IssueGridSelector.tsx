import React, { FC } from 'react'
import s from './IssueGridSelector.module.scss'
import { ReactComponent as IconPick } from './svg/ico-pick.svg'
import c from 'classnames'
import { issueImageMap } from './images/issues/issueImageMap'

export interface Props {
  items: { id: number; name: string }[]
  selectedIds: number[]
  onSelect: (id: number) => void
  onDiscard: (id: number) => void
}

export const IssueGridSelector: FC<Props> = ({
  items,
  selectedIds,
  onSelect,
  onDiscard,
}) => {
  return (
    <div className={s.list}>
      {items.map(item => {
        const selected = selectedIds.indexOf(item.id) !== -1
        return (
          <div
            className={s.item}
            key={item.id}
            onClick={() => (selected ? onDiscard(item.id) : onSelect(item.id))}
          >
            {selected && <IconPick className={s.item_pickIcon} />}
            <div
              className={c(s.item_img, { [s.item_img__selected]: selected })}
              style={{
                backgroundImage: `url('${issueImageMap[item.id]}')`,
              }}
            />
            <div
              className={c(s.item_box, { [s.item_box__selected]: selected })}
            />
            <div
              className={c(s.item_label, {
                [s.item_label__selected]: selected,
              })}
            >
              {item.name}
            </div>
          </div>
        )
      })}
    </div>
  )
}
