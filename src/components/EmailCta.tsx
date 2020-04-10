import React, { FC } from 'react'
import { createPortal } from 'react-dom'
import s from './EmailCta.module.scss'
import c from 'classnames'

const slot = document.querySelector('#modal')!

export const EmailCta: FC<{ name: string }> = ({ name }) => {
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    let prevScrollY = 0
    let disabled = false
    const handler = () => {
      const currentScrollY = window.scrollY
      // 스크롤을 한 번이라도 올린 순간에 발동, 다음 번에는 발동하지 않음
      if (!disabled && prevScrollY > currentScrollY) {
        setVisible(true)
        disabled = true
      }
      prevScrollY = currentScrollY
    }
    window.addEventListener('scroll', handler)
    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [])
  return createPortal(
    <div className={c(s.wrap, { [s.wrap__visible]: visible })}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://hi378006.typeform.com/to/HhvYGa"
        className={s.main}
      >
        <div
          className={s.close}
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setVisible(false)
          }}
        />
        <div className={s.title}>근데 이 공약… 지켜질까?</div>
        <div className={s.subtitle}>{name}님의 공약이 지켜질지 궁금하다면</div>
        <div className={s.goTo} />
      </a>
    </div>,
    slot,
  )
}
