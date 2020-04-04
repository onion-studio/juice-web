import React, { FC } from 'react'
import s from './AdditionalLanding.module.scss'
import { JuiceID } from '../constants'
import { ReactComponent as ArrowFold } from './svg/arr-fold.svg'

interface Props {
  nickname: string
  juiceName: string
  juiceId: JuiceID
  issueNames: string[]
  pScore: number
  cScore: number
}

const AdditonalLanding: FC<any> = ({ nickname }) => {
  return (
    <>
      <div className={s.s2}>
        이봐, 젊은이
        <br />더 놀다 가게나!
      </div>
      <div className={s.cardContainer}>
        <div className={s.detailBox_wrap}>
          <div className={s.detailBox}>
            <div className={s.detailTitle}>
              {nickname}님이랑 비슷한 사람들이
              <br />
              어떤 쥬스를 만들었는지
              <br />
              궁금하다면?
            </div>
            <div className={s.foldButton}>
              <ArrowFold style={{ transform: 'rotate(90deg' }} />
            </div>
          </div>
          <div className={s.detailBox}>
            <div className={s.detailTitle}>
              우리 동네에 출마한
              <br />
              지역구 후보를 알고 싶다면?
            </div>
            <div className={s.foldButton}>
              <ArrowFold style={{ transform: 'rotate(90deg' }} />
            </div>
          </div>
          <div className={s.detailBox}>
            <div className={s.detailTitle}>
              펀딩 참여해 <br />
              공약쥬스 밀어주고 싶다면?
            </div>
            <div className={s.foldButton}>
              <ArrowFold style={{ transform: 'rotate(90deg' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdditonalLanding
