import React, { FC } from 'react'
import s from './PartyInfo.module.scss'
import { PledgeCard } from './PledgeCard'
import {
  introLinks,
  partyColor,
  PartyID,
  partyNames,
  profileLinks,
  pledgeLinks,
} from '../constants'

interface Props {
  nickname: string
  partyId: PartyID
  pledges: {
    id: number
    title: string
    summary: string
    party_id: PartyID
    issue_id: number
    count: number
  }[]
  issues: { id: number; name: string }[]
}

export const PartyInfo: FC<Props> = ({
  nickname,
  partyId,
  pledges,
  issues,
}) => {
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
          <a
            className={s.header_link}
            href={pledgeLinks[partyId]}
            target="_blank"
          >
            10대 공약 원문
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
              tags={[
                issues.find(i => i.id === item.issue_id)!.name,
                `${item.count}명이 선택`,
              ]}
            />
          )
        })}
      </div>
    </div>
  )
}
