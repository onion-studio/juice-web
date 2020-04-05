import React, { FC } from 'react'
import s from './Credit.module.scss'

export const Credit: FC = () => {
  return (
    <div className={s.wrap}>
      <div>“세상이 미워도 투표를 멀리하지 말자”</div>
      <div className={s.card}>
        <div className={s.col}>
          <div className={s.item}>
            <div className={s.name}>댄</div>
            <div className={s.role}>Dev(client)</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>쌈</div>
            <div className={s.role}>Contents</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>숨</div>
            <div className={s.role}>Marketing</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>씨</div>
            <div className={s.role}>UX</div>
          </div>
        </div>
        <div className={s.col}>
          <div className={s.item}>
            <div className={s.name}>윌리</div>
            <div className={s.role}>Contents</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>은국</div>
            <div className={s.role}>Design</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>솜</div>
            <div className={s.role}>Marketing</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>키</div>
            <div className={s.role}>Contents</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>퍼핀</div>
            <div className={s.role}>Dev(server)</div>
          </div>
        </div>
      </div>
      <div className={s.card}>
        <div className={s.col}>
          <div className={s.item}>
            <div className={s.name}>nonce</div>
            <div className={s.role}>nonce.community</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>NEWNEEK</div>
            <div className={s.role}>newneek.co.kr</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>잼있는인생</div>
            <div className={s.role}>jaminlife.me</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>씨</div>
            <div className={s.role}>UX</div>
          </div>
        </div>
      </div>
      <div className={s.card}>
        <div className={s.col}>
          <div className={s.item}>
            <div className={s.name}>국일</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>래현</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>예진</div>
          </div>
        </div>
        <div className={s.col}>
          <div className={s.item}>
            <div className={s.name}>예찬</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>신수</div>
          </div>
        </div>
      </div>
      <div className={s.card}>
        <div className={s.col}>
          <div className={s.item}>
            <div className={s.name}>강영세</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>김서진</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>김승덕</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>김영원</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>김주연</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>김형석</div>
          </div>
        </div>
        <div className={s.col}>
          <div className={s.item}>
            <div className={s.name}>박준호</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>이성은</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>이진경</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>차이새</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>송창석</div>
          </div>
          <div className={s.item}>
            <div className={s.name}>김형석</div>
          </div>
        </div>
      </div>
    </div>
  )
}
