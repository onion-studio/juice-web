import React, { FC } from 'react'
import { createPortal } from 'react-dom'
import s from './PersonalForm.module.scss'
import { PersonalInfo } from '../contexts/PledgeSelectorContext'

const modalSlot = document.querySelector('#modal')!

interface Props {
  onSubmit: (info: PersonalInfo) => void
  onDismiss: () => void
}

export const PersonalForm: FC<Props> = ({ onSubmit, onDismiss }) => {
  const nicknameRef = React.createRef<HTMLInputElement>()
  const voterRef = React.createRef<HTMLSelectElement>()
  const ageRef = React.createRef<HTMLSelectElement>()
  const genderRef = React.createRef<HTMLSelectElement>()
  const locationRef = React.createRef<HTMLSelectElement>()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nickname = nicknameRef.current!.value.slice(0, 100)
    const isVoter = +voterRef.current!.value as any
    const [ageStartStr, ageEndStr] = ageRef.current!.value.split('-')
    const ageStart = +ageStartStr
    const ageEnd = +ageEndStr
    const gender = genderRef.current!.value as any
    const location = locationRef.current!.value
    onSubmit({ isVoter, ageStart, ageEnd, gender, location, nickname })
  }
  return createPortal(
    <div className={s.wrap}>
      <form className={s.form} onSubmit={handleSubmit}>
        <div className={s.dismiss} onClick={onDismiss} />
        <div className={s.header_title}>앗, 연료가 부족해요!</div>
        <div className={s.header_subtitle}>
          아래 내용을 채워 연료를 공급해 주세요!
        </div>
        <div className={s.group}>
          <label className={s.label}>별명 또는 ID</label>
          <input className={s.input} ref={nicknameRef} required />
          <div className={s.placeholder}>별명 또는 ID를 작성해 주세요</div>
        </div>

        <div className={s.group}>
          <label className={s.label}>
            한일월드컵 개막식이 열린 2002년 5월 31일에 귀하는 세상에 존재했나요?
          </label>
          <select className={s.select} ref={voterRef} required>
            <option disabled selected hidden />
            <option value="1">예 (투표권 있음)</option>
            <option value="0">아니오 (투표권 없음)</option>
          </select>
          <div className={s.placeholder}>연령대를 선택해 주세요</div>
        </div>

        <div className={s.group}>
          <label className={s.label}>연령</label>
          <select className={s.select} ref={ageRef} required>
            <option disabled selected hidden />
            <option value="0-17">18세 미만 (2004년 이후 출생)</option>
            <option value="18-21">18세 ~ 21세 (2003년 ~ 2000년생)</option>
            <option value="22-25">22세 ~ 25세 (1999년 ~ 1996년생)</option>
            <option value="26-29">26세 ~ 29세 (1995년 ~ 1992년생)</option>
            <option value="30-34">30세 ~ 34세 (1991년 ~ 1987년생)</option>
            <option value="35-39">35세 ~ 39세 (1986년 ~ 1982년생)</option>
            <option value="40-49">40세 ~ 49세 (1981년 ~ 1972년생)</option>
            <option value="50-64">50세 ~ 64세 (1971년 ~ 1957년생)</option>
            <option value="65-100">65세 이상 (1957년 이전 출생)</option>
          </select>
          <div className={s.placeholder}>연령대를 선택해 주세요</div>
        </div>

        <div className={s.group}>
          <label className={s.label}>성별</label>
          <select className={s.select} ref={genderRef} required>
            <option disabled selected hidden />
            <option value="M">남성</option>
            <option value="F">여성</option>
            <option value="O">그 외 젠더</option>
          </select>
          <div className={s.placeholder}>성별을 선택해 주세요</div>
        </div>

        <div className={s.group}>
          <label className={s.label}>거주 지역</label>
          <select className={s.select} ref={locationRef} required>
            <option disabled selected hidden />
            <option value="서울특별시">서울특별시</option>
            <option value="부산광역시">부산광역시</option>
            <option value="대구광역시">대구광역시</option>
            <option value="인천광역시">인천광역시</option>
            <option value="광주광역시">광주광역시</option>
            <option value="대전광역시">대전광역시</option>
            <option value="울산광역시">울산광역시</option>
            <option value="세종특별자치시">세종특별자치시</option>
            <option value="경기도">경기도</option>
            <option value="강원도">강원도</option>
            <option value="충청북도">충청북도</option>
            <option value="충청남도">충청남도</option>
            <option value="전라북도">전라북도</option>
            <option value="전라남도">전라남도</option>
            <option value="경상북도">경상북도</option>
            <option value="경상남도">경상남도</option>
            <option value="제주특별자치도">제주특별자치도</option>
            <option value="해외">해외</option>
          </select>
          <div className={s.placeholder}>거주 지역을 선택해 주세요</div>
        </div>
        <div className={s.group}>
          <div className={s.privacy}>
            제공하신 정보는 연령, 성별, 지역에 따라 관심 공약, 정책 등이 어떻게
            다른지 분석하기 위한 목적으로만 활용됩니다. 분석 내용은 선거 이후
            공약쥬스 웹사이트 등에서 확인하실 수 있습니다.
          </div>
        </div>
        <button type="submit" className={s.button} title="연료 공급!" />
      </form>
    </div>,
    modalSlot,
  )
}
