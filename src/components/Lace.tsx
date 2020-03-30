import React, { CSSProperties, FC } from 'react'
import s from './Lace.module.scss'

export const Lace: FC<{ style?: CSSProperties }> = ({ style = {} } = {}) => {
  return <div className={s.lace} style={style} />
}
