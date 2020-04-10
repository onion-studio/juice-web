import React, { FC } from 'react'
import s from './SnsLinks.module.scss'
import brunchLogo from './images/sns-01-brnch@3x.png'
import twitterLogo from './images/sns-02-twt@3x.png'
import facebookLogo from './images/sns-03-fb@3x.png'
import instagramLogo from './images/sns-04-insta@3x.png'

export const SnsLinks: FC = () => {
  return (
    <div className={s.wrap}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://brunch.co.kr/@pactum"
      >
        <img src={brunchLogo} alt="브런치" />
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://twitter.com/hi_pactum"
      >
        <img src={twitterLogo} alt="트위터" />
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.facebook.com/pactum.juice/"
      >
        <img src={facebookLogo} alt="페이스북" />
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.instagram.com/hi_juice.vote/"
      >
        <img src={instagramLogo} alt="인스타그램" />
      </a>
    </div>
  )
}
