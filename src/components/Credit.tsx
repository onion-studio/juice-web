import React, { FC, useEffect } from 'react'
import s from './Credit.module.scss'
import { TopNavBar } from './TopNavBar'

export const Credit: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <TopNavBar title="공약쥬스를 만든 사람들" progress={0} isCredit={true} />
      <div className={s.wrap}>
        <div className={s.header}>
          “세상이 미워도
          <br />
          투표를 멀리하지 말자”
        </div>
        <div className={s.title}>PACTUM</div>
        <div className={`${s.card} ${s.pactum}`}>
          <div className={s.col}>
            <div className={s.item}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/seungha-kim"
                className={s.name}
              >
                댄
              </a>
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
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/eun9ook/"
                className={s.name}
              >
                은국
              </a>
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
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://jeesoo.work"
                className={s.name}
              >
                퍼핀
              </a>
              <div className={s.role}>Dev(server)</div>
            </div>
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={s.link}
            href="https://brunch.co.kr/@pactum"
          >
            <span>Pactum Blog</span>
          </a>
        </div>
        <div className={s.title}>Partners</div>
        <div className={`${s.card} ${s.partner}`}>
          <div className={s.col}>
            <div className={s.item}>
              <div className={s.name}>nonce</div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className={s.role}
                href="https://nonce.community/"
              >
                nonce.community
              </a>
            </div>
            <div className={s.item}>
              <div className={s.name}>NEWNEEK</div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://newneek.co/"
                className={s.role}
              >
                newneek.co
              </a>
            </div>
            <div className={s.item}>
              <div className={s.name}>잼있는인생</div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://jaminlife.me/"
                className={s.role}
              >
                jaminlife.me
              </a>
            </div>
          </div>
        </div>
        <div className={s.title}>Advisors</div>
        <div className={`${s.card} ${s.advisor}`}>
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
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={s.link}
            href="https://brunch.co.kr/@pactum/8"
          >
            <span>Advisor Story</span>
          </a>
        </div>
        <div className={s.title}>Angel Inverstors</div>
        <div className={`${s.card} ${s.investor}`}>
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
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={s.link}
            href="https://www.presenu.com/nonce/?idx=58"
          >
            <span>투자유치 이야기</span>
          </a>
        </div>
      </div>
    </>
  )
}
