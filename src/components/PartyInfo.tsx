import React, { FC } from 'react'
import s from './PartyInfo.module.scss'
import { PledgeCard } from './PledgeCard'
import {
  introLinks,
  partyColor,
  PartyID,
  partyNames,
  profileLinks,
} from '../constants'

interface Props {
  nickname: string
  partyId: PartyID
  pledges: { id: number; title: string; summary: string; count: number }[]
}

export const PartyInfo: FC<Props> = ({ nickname, partyId, pledges }) => {
  const partyName = partyNames[partyId]
  return (
    <div className={s.wrap} style={{ backgroundColor: partyColor[partyId] }}>
      <div className={s.borderBox}>
        <div className={s.header_name}>{nickname}님이 선택한</div>
        <div className={s.header_party}>{partyName}의 공약</div>
        <div className={s.header_links}>
          <a
            className={s.header_link}
            href={introLinks[partyId]}
            target="_blank"
          >
            소개
          </a>
          <a
            className={s.header_link}
            href={profileLinks[partyId]}
            target="_blank"
          >
            비례대표 명부
          </a>
        </div>
      </div>
      <div style={{ width: 300, marginTop: 15 }}>
        {pledges.map(item => {
          return (
            <PledgeCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              style={{ borderColor: 'black' }}
            />
          )
        })}
      </div>
    </div>
  )
}
