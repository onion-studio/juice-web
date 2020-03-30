import React, { useEffect, useState } from 'react'
import ky from 'ky'
import { ResultCard } from '../components/ResultCard'
import { PartyInfo } from '../components/PartyInfo'
import s from './ResultPage.module.scss'
import { usePersistency } from '../contexts/PersistencyContext'

interface Result {
  respondentLog: {
    user_id: number
    nickname: string
    juice_id: number
    juice_name: string
  }
  pledges: {
    id: number
    title: string
    summary: string
    party_id: number
    issue_id: number
    count: number
  }[]
  issues: {
    id: number
    name: string
  }[]
}

export const ResultPage: React.FC = () => {
  const [result, setResult] = useState<Result | null>(null)
  const persistency = usePersistency()

  useEffect(() => {
    const init = async () => {
      console.log('init result')
      const token = localStorage.getItem('token')!
      const res: any = await ky
        .get('https://api.juice.vote/result', {
          searchParams: {
            token,
          },
        })
        .json()
      setResult(res.result)
    }
    init()
  }, [])
  if (!result) {
    return null
  }

  const partyIds = Array.from(
    new Set(result.pledges.map(item => item.party_id)),
  )

  return (
    <div className={s.wrap}>
      <ResultCard
        nickname={result.respondentLog.nickname}
        juiceName={result.respondentLog.juice_name}
        juiceId={result.respondentLog.juice_id}
      />
      {partyIds.map(partyId => {
        return (
          <PartyInfo
            key={partyId}
            partyId={partyId as any}
            nickname={result.respondentLog.nickname}
            pledges={result.pledges.filter(item => item.party_id === partyId)}
          />
        )
      })}
      <button onClick={() => persistency.action.reset()}>다시 주문하기</button>
    </div>
  )
}
