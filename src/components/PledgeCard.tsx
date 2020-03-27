import React, { FC } from 'react'
import { useToggle } from 'react-use'
import c from 'classnames'
import s from './PledgeCard.module.scss'
import { ReactComponent as IconPick } from './svg/ico-pick.svg'
import { ReactComponent as ArrowFold } from './svg/arr-fold.svg'
import { ReactComponent as ArrowUnfold } from './svg/arr-unfold.svg'

export const PledgeCard: FC<{ onSelect: () => void; selected: boolean }> = ({
  onSelect,
  selected,
}) => {
  const [folded, toggle] = useToggle(true)
  return (
    <div
      className={c(s.pledgeCard, { [s.pledgeCard__selected]: selected })}
      onClick={onSelect}
    >
      {selected && <IconPick className={s.pickIcon} />}
      <div className={s.pledgeCard_title}>
        부동산 보유세 부담은 대폭 낮추고, 거래 숨통은 틔우겠습니다{' '}
      </div>
      <div
        className={s.pledgeCard_foldButton}
        onClick={e => {
          e.stopPropagation()
          toggle()
        }}
      >
        {folded ? <ArrowUnfold /> : <ArrowFold />}
      </div>
      {folded || (
        <div className={s.pledgeCard_description}>
          현재 부동산 보유세 부담은 일반의 폭이 어쩌구인데 이걸 2024년까지
          이렇게 저렇게 고치는 방안을 추진해서 구름다리 동네에 사는 사람과
          바람계곡에 사는 사람이 할 수 있도록 하겠습니다.
        </div>
      )}
    </div>
  )
}
