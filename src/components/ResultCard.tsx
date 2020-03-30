import React, { FC } from 'react'
import s from './ResultCard.module.scss'
import { Card } from './Card'
import { Lace } from './Lace'
import { juiceMap } from './images/juices/juiceMap'

interface Props {
  nickname: string
  juiceName: string
  juiceId: number
  // issueKeywords: [string, string]
  // partyKeywords: [string, string]
}

export const ResultCard: FC<Props> = ({
  nickname,
  juiceName,
  juiceId,
  // issueKeywords,
  // partyKeywords,
}) => {
  return (
    <div className={s.cardContainer}>
      <Card
        style={{}}
        topLabel={<span className={s.topLabel}>SPECIAL MENU</span>}
        actionLabel="공약쥬스 메뉴판 공유하기!"
      >
        <div className={s.s1}>{nickname}님, 주문하신 공약쥬스 나왔습니다</div>
        <div className={s.s2}>{juiceName}!</div>
        <div className={s.juiceImageContainer}>
          <img
            className={s.juiceImage}
            src={(juiceMap as any)[`y${juiceId.toString().padStart(2, '0')}`]}
            alt="베리"
          />
        </div>
        <Lace style={{ backgroundPositionX: -1 }} />
        <div className={s.interests}>
          <span className={s.keyword}>#TODO</span>과{' '}
          <span className={s.keyword}>#TODO</span> 문제에 관심이 많고,
          <br />
          <span className={s.keyword}>#TODO</span>과{' '}
          <span className={s.keyword}>#TODO</span>을 중시하는 당신!
        </div>
        <div className={s.recommendedParty}>
          이번 총선에서는 <br />
          TODO를 눈여겨 보세요!
        </div>
      </Card>
    </div>
  )
}
