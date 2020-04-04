import React, { useEffect, useState } from 'react'
import ky from 'ky'
import { ResultCard } from '../components/ResultCard'
import { PartyInfo } from '../components/PartyInfo'
import s from './ResultPage.module.scss'
import { usePersistency } from '../contexts/PersistencyContext'
import { JuiceID, PartyID, progressiveParties } from '../constants'
import AdditonalLanding from '../components/AdditionalLanding'

interface Result {
  respondentLog: {
    user_id: number
    nickname: string
    juice_id: JuiceID
    juice_name: string
  }
  pledges: {
    id: number
    title: string
    summary: string
    party_id: PartyID
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
      const token = persistency.token!
      try {
        const res: any = await ky
          .get('https://api.juice.vote/result', {
            searchParams: {
              token,
            },
          })
          .json()
        setResult(res.result)
      } catch (e) {
        if (
          window.confirm('통신 문제가 발생했습니다. 처음으로 돌아가시겠습니까?')
        ) {
          persistency.action.reset()
        }
      }
    }
    init()
  }, [persistency.action, persistency.token])
  if (!result) {
    return null
  }

  const partyIds = Array.from(
    new Set(result.pledges.map(item => item.party_id)),
  ).sort((id1, id2) => {
    const count1 = result.pledges.filter(item => item.party_id === id1)
    const count2 = result.pledges.filter(item => item.party_id === id2)
    if (count1 > count2) {
      return -1
    } else if (count1 === count2) {
      return 0
    } else {
      return 1
    }
  })

  const pledgeCountPerIssue = result.pledges.reduce(
    (acc: { [k: number]: number }, item) => ({
      ...acc,
      [item.issue_id]: (acc[item.issue_id] ?? 0) + 1,
    }),
    {},
  )

  const progressivePledgeCount = result.pledges.filter(item =>
    progressiveParties.includes(item.party_id),
  ).length
  const conservativePledgeCount = result.pledges.length - progressivePledgeCount
  const pScore = Math.round(
    (progressivePledgeCount / result.pledges.length) * 100,
  )
  const cScore = Math.round(
    (conservativePledgeCount / result.pledges.length) * 100,
  )

  const issuesSortedByPledgeCount = result.issues.sort((i1, i2) => {
    const i1Count = pledgeCountPerIssue[i1.id] ?? 0
    const i2Count = pledgeCountPerIssue[i2.id] ?? 0
    if (i1Count > i2Count) {
      return -1
    } else if (i1Count === i2Count) {
      return 0
    } else {
      return 1
    }
  })

  return (
    <div className={s.wrap}>
      <ResultCard
        nickname={result.respondentLog.nickname}
        juiceName={result.respondentLog.juice_name}
        juiceId={result.respondentLog.juice_id}
        issueNames={issuesSortedByPledgeCount.map(item => item.name)}
        pScore={pScore}
        cScore={cScore}
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
      <AdditonalLanding />
      <button
        className={s.resetButton}
        onClick={() => persistency.action.reset()}
      >
        다시 주문하기
      </button>
      <div className={s.copyright}>
        <a href="https://brunch.co.kr/@pactum" target="_blank">
          공약쥬스 소개
        </a>{' '}
        | team pactum <br /> Copyrightⓒ2020 pactum All rights reserved.
      </div>
    </div>
  )
}
