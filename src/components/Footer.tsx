import React, { FC } from 'react'
import s from './Footer.module.scss'

export const Footer: FC = () => {
  return (
    <>
      <div className={s.miscLinks}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/pactum.juice/posts/120718532903677"
        >
          자주 묻는 질문
        </a>
        <a href="/#/credit">공약쥬스를 만든 사람들</a>
      </div>
      <div className={s.copyright}>
        Copyrightⓒ2020 pactum All rights reserved.
      </div>
    </>
  )
}
