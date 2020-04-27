import React, { FC } from 'react'
import { Card } from '../components/Card'
import s from './SeeYouAgainPage.module.scss'
import { Lace } from '../components/Lace'
import { SnsLinks } from '../components/SnsLinks'
import { Footer } from '../components/Footer'
import { ReactComponent as ArrowFold } from '../components/svg/arr-fold.svg'

export const SeeYouAgainPage: FC = () => {
  return (
    <div>
      <Card
        style={{ height: 340, margin: '34px auto 0' }}
        topLabel={<span className={s.topLabel}>SEE YOU AGAIN</span>}
      >
        <div
          style={{
            position: 'absolute',
            height: 105,
            bottom: 2,
            left: 2,
            right: 2,
            backgroundColor: '#d6cdb4',
          }}
        >
          <Lace
            style={{ position: 'absolute', top: -3, left: -1, right: -1 }}
          />
        </div>
        <div className={s.mixer} />
        <div className={s.cardLabel}>곧 다시 만나요!</div>
      </Card>
      <div className={s.midCard}>
        <div className={s.midCard_boldPara}>
          1월부터 달려온 공약쥬스는
          <br /> 잠시 문을 닫습니다.
          <br /> 공약쥬스를 사랑해주셔서 감사합니다.
        </div>
        <div className={s.midCard_normalPara}>
          공약쥬스 메이커 팀 팍툼 드림 <br />
          hi@pactum.kr
        </div>
      </div>
      <a
        href="https://www.tumblbug.com/juicevote"
        target="_blank"
        rel="noopener noreferrer"
        className={s.lowerCard}
      >
        다음 프로젝트 후원하고 <br />
        공약쥬스 굿즈{' '}
        <span role="img" aria-label="heart">
          💝
        </span>{' '}
        득템하기
        <div className={s.foldButton}>
          <ArrowFold style={{ transform: 'rotate(90deg' }} />
        </div>
      </a>
      <a
        href="https://hi378006.typeform.com/to/HhvYGa"
        target="_blank"
        rel="noopener noreferrer"
        className={s.lowerCard}
      >
        내가 뽑은 공약, 지켜질까…? <br />
        공약쥬스 결과 보고서 받아보기
        <div className={s.foldButton}>
          <ArrowFold style={{ transform: 'rotate(90deg' }} />
        </div>
      </a>
      <div style={{ height: 32 }} />
      <SnsLinks />
      <Footer />
    </div>
  )
}
