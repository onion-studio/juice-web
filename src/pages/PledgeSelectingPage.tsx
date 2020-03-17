import React, { FC } from 'react'
import { useSet, useToggle } from 'react-use'
import s from './PledgeSelectingPage.module.scss'
import c from 'classnames'

const IssueNavigationItem: FC = () => {
  return <div className={s.issueNavigationBar_item}>1</div>
}

const IssueNavigationBar: FC = () => {
  return (
    <div className={s.issueNavigationBar}>
      <div className={s.issueNavigationBar_spacer} />
      <div className={s.issueNavigationBar_spacer} />
      {new Array(20).fill(null).map((_, i) => {
        return <IssueNavigationItem key={i} />
      })}
      <div className={s.issueNavigationBar_spacer} />
      <div className={s.issueNavigationBar_spacer} />
    </div>
  )
}

const Header: FC = () => {
  return (
    <div className={s.header}>
      <div className={s.header_back}>Back</div>
      <div className={s.header_content}>공약을 5개 이상 선택하세요!</div>
      <div>결과 보기</div>
    </div>
  )
}

const PledgeCard: FC<{ onSelect: () => void; selected: boolean }> = ({
  onSelect,
  selected,
}) => {
  const [folded, toggle] = useToggle(true)
  return (
    <div className={s.pledgeCard} onClick={onSelect}>
      <div className={s.pledgeCard_title}>title</div>
      <div
        className={s.pledgeCard_foldButton}
        onClick={e => {
          e.stopPropagation()
          toggle()
        }}
      >
        {folded ? '펴기' : '접기'}
      </div>
      {folded || (
        <div className={s.pledgeCard_description}>
          현재 부동산 보유세 부담은 일반의 폭이 어쩌구인데 이걸 2024년까지
          이렇게 저렇게 고치는 방안을 추진해서 구름다리 동네에 사는 사람과
          바람계곡에 사는 사람이 할 수 있도록 하겠습니다.
        </div>
      )}
      {selected && <div className={s.pledgeCard_check}>체크</div>}
    </div>
  )
}

const PledgeCardList: FC = () => {
  const [, { has, toggle }] = useSet<number>()
  return (
    <div className={s.pledgeCardList}>
      {new Array(10).fill(null).map((_, i) => (
        <PledgeCard key={i} selected={has(i)} onSelect={() => toggle(i)} />
      ))}
    </div>
  )
}

export const PledgeSelectingPage: FC = () => {
  return (
    <div>
      <Header />
      <IssueNavigationBar />
      <PledgeCardList />
    </div>
  )
}
