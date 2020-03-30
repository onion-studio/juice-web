import React, { FC } from 'react'
import s from './ResultCard.module.scss'
import { Card } from './Card'
import { Lace } from './Lace'
import { juiceMap } from './images/juices/juiceMap'

export const ResultCard: FC = () => {
  return (
    <div className={s.cardContainer}>
      <Card
        style={{}}
        topLabel={<span className={s.topLabel}>SPECIAL MENU</span>}
        actionLabel="공약쥬스 메뉴판 공유하기!"
      >
        <div className={s.s1}>NAME님, 주문하신 공약쥬스 나왔습니다</div>
        <div className={s.s2}>베리블루하우스익스트림!</div>
        <div className={s.juiceImageContainer}>
          <img className={s.juiceImage} src={juiceMap.y01} alt="베리" />
        </div>
        <Lace style={{ backgroundPositionX: -1 }} />
        <div className={s.interests}>
          <span className={s.keyword}>#부동산</span>과{' '}
          <span className={s.keyword}>#디지털 성범죄</span> 문제에 관심이 많고,
          <br />
          <span className={s.keyword}>#공정함</span>과{' '}
          <span className={s.keyword}>#정의로움</span>을 중시하는 당신!
        </div>
        <div className={s.recommendedParty}>
          이번 총선에서는 <br />
          더불어민주당을 눈여겨 보세요!
        </div>
      </Card>
    </div>
  )
}
