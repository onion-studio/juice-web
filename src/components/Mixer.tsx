import React, { FC, useEffect, useState } from 'react'
import s from './Mixer.module.scss'
import c from 'classnames'
import { Lace } from './Lace'
import { Card } from './Card'

interface Props {
  animating: boolean
  initialProgress?: 0 | 50
  targetProgress: 50 | 100
}

export const Mixer: FC<Props> = ({
  animating,
  initialProgress = 0,
  targetProgress,
}) => {
  const [currentProgress, setCurrentProgress] = useState<0 | 50 | 100>(
    initialProgress,
  )
  useEffect(() => {
    setTimeout(() => {
      setCurrentProgress(targetProgress)
    })
  }, [targetProgress])
  return (
    <div className={s.wrap}>
      <div
        className={c(s.progress, {
          [s.progress__50]: currentProgress === 50,
          [s.progress__100]: currentProgress === 100,
        })}
      />
      <div className={s.upper}>
        <Card style={{ margin: '0 auto' }}>
          <div className={s.header}>
            당신을 위한 공약쥬스가 <br />
            만들어지고 있어요. <br />
            잠시만 기다려 주세요!
          </div>
        </Card>

        <div className={s.canvas}>
          <div
            className={c(s.brrr, { [s.brrr__animating]: animating })}
            style={{ bottom: 95 }}
          />
          <div className={c(s.mixer, { [s.mixer__animating]: animating })} />
          <div
            className={c(s.brrr, { [s.brrr__animating]: animating })}
            style={{ bottom: -130 }}
          />
        </div>

        <Lace style={{ position: 'relative', bottom: -3 }} />
      </div>
      <div className={s.lower} />
    </div>
  )
}
