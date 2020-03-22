import React, { FC } from 'react'
import s from './IssueGridSelector.module.scss'
import { ReactComponent as IconPick } from './svg/ico-pick.svg'

export interface Props {
  items: { id: number; title: string; selected: boolean }[]
  onToggle: (id: number) => void
}

export const IssueGridSelector: FC<Props> = ({ items, onToggle }) => {
  return (
    <div className={s.list}>
      {items.map(item => (
        <div className={s.item} key={item.id} onClick={() => onToggle(item.id)}>
          {item.selected && <IconPick className={s.item_pickIcon} />}
          <div className={s.item_box} />
          <div className={s.item_label}>{item.title}</div>
        </div>
      ))}
    </div>
  )
}
