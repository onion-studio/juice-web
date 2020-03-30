import React, { FC } from 'react'
import s from './PartyInfo.module.scss'
import { PledgeCard } from './PledgeCard'
export const PartyInfo: FC = () => {
  return (
    <div className={s.wrap} style={{ backgroundColor: 'silver' }}>
      <div className={s.borderBox}>
        <div className={s.header_name}>Name님이 선택한</div>
        <div className={s.header_party}>더불어민주당의 공약</div>
        <div className={s.header_links}>
          <a className={s.header_link} href="https://naver.com" target="_blank">
            소개
          </a>
          <a className={s.header_link} href="https://naver.com" target="_blank">
            비례대표 명부
          </a>
        </div>
      </div>
      <div style={{ width: 300, marginTop: 15 }}>
        <PledgeCard
          title="호호"
          summary="하하"
          style={{ borderColor: 'black' }}
        />
      </div>
    </div>
  )
}
