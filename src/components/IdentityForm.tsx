import React, { FC } from 'react'
import { createPortal } from 'react-dom'
import s from './IdentityForm.module.scss'
// import { IdentityInfo } from '../contexts/PledgeSelectorContext'

const modalSlot = document.querySelector('#modal')!

// TODO: type
export const IdentityForm: FC<{ onSubmit: (info: any) => void }> = (
  {
    // onSubmit,
  },
) => {
  const emailRef = React.createRef<HTMLInputElement>()
  const isAgreedRef = React.createRef<HTMLInputElement>()
  const identityRef = React.createRef<HTMLInputElement>()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const email = emailRef.current!.value.slice(0, 100)
    const isAgreed = isAgreedRef.current?.checked
    const identity = identityRef.current?.value
    // onSubmit({ email, isAgreed, identity })
  }
  return createPortal(
    <div className={s.wrap}>
      <form className={s.form} onSubmit={handleSubmit}>
        <div className={s.header_subtitle}>
          나랑 어울리는 단어를 골라주세요!
        </div>
        <div className={s.group}>
          <label className={s.label}>나랑 어울리는 단어를 골라주세요!</label>
          <button value="small_business_job">중소기업</button>
          <button value="major_business_job">대기업</button>
          <button value="public_job">공무원/공기업</button>
          <button value="job_seeker">취업준비생</button>
          <button value="student">학생</button>
          <button value="self_employed">자영업자</button>
          <button value="full_time_worker">정규직</button>
          <button value="temporary_worker">비정규직</button>
          <button value="freelance">프리랜서</button>
          <button value="infant_carer">육아</button>
          <button value="single_household">1인가구</button>
          <button value="married">기혼</button>
        </div>
        <div className={s.group}>
          <label className={s.label}>이메일 주소</label>
          <input className={s.input} ref={emailRef} required />
          <div className={s.placeholder}>이메일 주소를 입력해 주세요.</div>
        </div>
        <div className={s.group}>
          <label className={s.label}>
            개인정보수집 및 이용약관에 동의합니다.
          </label>
          <input
            className={s.input}
            type="checkbox"
            ref={isAgreedRef}
            required
          />
        </div>
        <button
          type="submit"
          className={s.button}
          title="이메일로 상세한 결과 받기!"
        />
      </form>
    </div>,
    modalSlot,
  )
}
