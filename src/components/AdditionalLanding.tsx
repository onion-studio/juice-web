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

const AdditonalLanding: FC<any> = ({ nickname, setFormVisible }) => {
  return (
    <>
      <div className={s.s2}>
        이봐, 젊은이
        <br />더 놀다 가게나!
      </div>
      <div className={s.cardContainer}>
        <div className={s.detailBox_wrap}>
          <a
            className={s.detailBox}
            href="https://forms.gle/CcTcpVyDfVEdbpsA7"
            target="_blank"
          >
            <div className={s.detailTitle}>
              {nickname}님, 선택한 공약이 잘 지켜질지
              <br />
              궁금하지 않으세요?
              <br />
            </div>
            <div className={s.foldButton}>
              <ArrowFold style={{ transform: 'rotate(90deg' }} />
            </div>
          </a>
          <a
            className={s.detailBox}
            href="https://napp.newneek.co/2020election"
            target="_blank"
          >
            <div className={s.detailTitle}>
              나를 위한 공약, 더 알고 싶다면?
              <br />
              밀레니얼을 위한 시사 뉴스레터 '뉴닉'이 뽀갠 총선공약 보러가기
            </div>
            <div className={s.foldButton}>
              <ArrowFold style={{ transform: 'rotate(90deg' }} />
            </div>
          </a>
          {/* <a className={s.detailBox}>
            <div className={s.detailTitle}>
              우리 동네에 출마한
              <br />
              지역구 후보를 알고 싶다면?
            </div>
            <div className={s.foldButton}>
              <ArrowFold style={{ transform: 'rotate(90deg' }} />
            </div>
          </a>
          <a className={s.detailBox}>
            <div className={s.detailTitle}>
              펀딩 참여해 <br />
              공약쥬스 밀어주고 싶다면?
            </div>
            <div className={s.foldButton}>
              <ArrowFold style={{ transform: 'rotate(90deg' }} />
            </div>
          </a> */}
        </div>
      </div>
    </>
  )
}

export default AdditonalLanding
