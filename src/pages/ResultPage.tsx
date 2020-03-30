import React from 'react'
import { ResultCard } from '../components/ResultCard'
import { PartyInfo } from '../components/PartyInfo'
import s from './ResultPage.module.scss'

export const ResultPage: React.FC = () => {
  return (
    <div className={s.wrap}>
      <ResultCard />
      <PartyInfo />
    </div>
  )
}
