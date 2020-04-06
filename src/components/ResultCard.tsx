import React, { FC, ReactNode } from 'react'
import s from './ResultCard.module.scss'
import { Card } from './Card'
import { Lace } from './Lace'
import { juiceMap } from './images/juices/juiceMap'
import {
  conservativeParties,
  JuiceID,
  PartyID,
  partyNamesWithPro,
  progressiveParties,
} from '../constants'
import { useToaster } from '../contexts/ToasterContext'

// https://github.com/e-/Josa.js/blob/master/josa.js
function hasJong(s: string): boolean {
  const charCode = s.charCodeAt(s.length - 1)
  return (charCode - 0xac00) % 28 > 0
}

function 을를(s: string): string {
  return hasJong(s) ? '을' : '를'
}

function 과와(s: string): string {
  return hasJong(s) ? '과' : '와'
}

interface Props {
  nickname: string
  juiceName: string
  juiceId: JuiceID
  issueNames: string[]
  pScore: number
  cScore: number
}

const nav = window.navigator as any
const shareApiAvailable = !!nav.share
const clipboardAvailable = !!nav.clipboard && !!nav.clipboard.writeText
const canShare = shareApiAvailable || clipboardAvailable

export const ResultCard: FC<Props> = ({
  nickname,
  juiceName,
  juiceId,
  issueNames,
  pScore,
  cScore,
}) => {
  const descriptionSet = descriptionsPerJuiceId[juiceId]
  const toaster = useToaster()
  const handleShare = () => {
    if (shareApiAvailable) {
      nav.share({
        title: '공약쥬스',
        url: 'https://vo.la/mLtX',
      })
    } else if (clipboardAvailable) {
      nav.clipboard.writeText('https://vo.la/mLtX').then(() => {
        toaster.action.pushMessage('주소가 복사됐어요!')
      })
    }
  }

  return (
    <>
      <div className={s.cardContainer}>
        <Card
          style={{}}
          topLabel={<span className={s.topLabel}>SPECIAL MENU</span>}
          actionLabel={canShare ? '단톡방에 공유하기!' : undefined}
          onAction={handleShare}
        >
          <div className={s.s1}>{nickname}님, 주문하신 공약쥬스 나왔습니다</div>
          <div className={s.s2}>{juiceName}!</div>
          <div className={s.juiceImageContainer}>
            <img
              className={s.juiceImage}
              src={(juiceMap as any)[`y${juiceId.toString().padStart(2, '0')}`]}
              alt="베리"
            />
          </div>
          <Lace style={{ backgroundPositionX: -1 }} />
          <div className={s.interests}>
            {issueNames[1] && (
              <>
                <span className={s.keyword}>#{issueNames[1]}</span>
              </>
            )}
            {과와(issueNames[1])}{' '}
            <span className={s.keyword}>#{issueNames[0]}</span> 문제에 관심이
            많고,
            <br />
            <span className={s.keyword}>#{descriptionSet.keyword1}</span>
            {과와(descriptionSet.keyword1)}{' '}
            <span className={s.keyword}>#{descriptionSet.keyword2}</span>
            {을를(descriptionSet.keyword2)} 중시하는 당신!
          </div>
          <div className={s.recommendedParty}>
            {descriptionSet.resultSummary(nickname)}
          </div>
        </Card>
      </div>
      <div className={s.detailBox_wrap}>
        <div className={s.detailBox}>
          <div className={s.detailTitle}>
            {juiceName}
            {을를(juiceName)} 주문하신 {nickname}님!
          </div>
          <div className={s.detailDesc}>
            {descriptionSet.resultDetail({
              name: nickname,
              pScore,
              cScore,
              issueNames: issueNames.slice(0, 3),
            })}
          </div>
        </div>
      </div>
    </>
  )
}

interface ResultSet {
  keyword1: string
  keyword2: string
  resultSummary: (name: string) => ReactNode
  resultDetail: (args: {
    name: string
    pScore: number
    cScore: number
    issueNames: string[]
  }) => ReactNode
}

function leftOrRight(pScore: number, cScore: number): string {
  return pScore > cScore ? '진보' : '보수'
}

function larger(pScore: number, cScore: number) {
  return pScore > cScore ? pScore : cScore
}

function similarParties(
  pScore: number,
  cScore: number,
  except: number,
): string {
  let partyIds: PartyID[] =
    pScore > cScore ? progressiveParties : conservativeParties
  partyIds = partyIds.filter(id => id !== except)
  return partyIds.map(id => partyNamesWithPro[id]).join(', ')
}

const Footer: FC<{ name: string }> = ({ name }) => {
  return (
    <p>
      앞으로 {name}님이 선택한 공약을 잘 지키는지 지켜봐 주세요. 아무도 기억하지
      못하는 약속보다 많은 사람들이 기억하는 약속이 지켜질 가능성이 높습니다.{' '}
      <b>{name}님이 선택하신 공약 딱 한 개는 우리 기억하기로 약속해요.</b> 🤝
    </p>
  )
}

const descriptionsPerJuiceId: {
  [K in JuiceID]: ResultSet
} = {
  1: {
    keyword1: '공정',
    keyword2: '평화',
    resultSummary: (name: string) => (
      <div>
        <p>
          <b>
            베리블루하우스익스트림은 선택하신 공약 중 40% 이상이 더불어민주당의
            공약인 경우
          </b>
          에 만들어지는 특별한 쥬스랍니다. 더불어민주당이 추구하는 방향과 정책이{' '}
          {name}님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.{' '}
          <b>
            더불어민주당에 투표하시면 {name}님이 필요하다고 생각하는 공약이
            추진되는 데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 가장 마음에 들어한 공약은 더불어민주당의 공약이 아닐
          수도 있으니, 아래의 성분분석 코너를 확인해보세요!
        </p>
        <p>
          ⚠주의: 비례대표 투표를 할 때는 더불어민주당이 없습니다. 대신
          더불어민주당의 후보들이 등록되어 있는 더불어시민당이 있습니다.
          더불어시민당에 투표를 하시면 더불어민주당의 비례대표 후보를
          당선시키는데 기여하실 수 있습니다.
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 공정, 평화 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>진보</b> 정당 공약이 {pScore}
          %로 많은 편입니다. 따라서 {name}님의 정치적인 성향은 <b>진보</b>에
          가깝습니다. 이번 총선에서 투표할 수 있는 <b>진보</b> 성향 정당은
          더불어민주당 외에도 정의당, 민중당. 녹색당 등이 있습니다. 혹시 충분한
          시간이 있으시다면 더불어민주당과 유사한 성향을 가진 정당의 공약과
          후보에 대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 더불어민주당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  2: {
    keyword1: '안전',
    keyword2: '포용',
    resultSummary: (name: string) => (
      <div>
        <p>
          사파이어베리스무디는{' '}
          <b>더불어민주당의 공약을 다른 정당의 공약에 비해 많이 선택한 경우</b>
          에 만들어지는 신선한 쥬스랍니다. 더불어민주당이 추구하는 방향과 정책이{' '}
          {name}님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.{' '}
          <b>
            더불어민주당에 투표하시면 {name}님이 필요하다고 생각하는 공약이
            추진되는 데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 선택한 공약 중 더불어민주당 공약이 많기는 하지만, 가장
          마음에 든 그 공약은 다른 정당의 공약일 수도 있습니다. 아래의 성분분석
          코너를 확인해보세요!
        </p>
        <p>
          ⚠주의: 비례대표 투표를 할 때는 더불어민주당이 없습니다. 대신
          더불어민주당의 후보들이 등록되어 있는 더불어시민당이 있습니다.
          더불어시민당에 투표를 하시면 더불어민주당의 비례대표 후보를
          당선시키는데 기여하실 수 있습니다.
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 안전, 포용과 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>{leftOrRight(pScore, cScore)}</b> 정당
          공약이 {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의
          정치적인 성향은 <b>{leftOrRight(pScore, cScore)}</b>에 가깝습니다.
          이번 총선에서 투표할 수 있는 <b>{leftOrRight(pScore, cScore)}</b> 성향
          정당은 {similarParties(pScore, cScore, 1)} 등이 있습니다. 혹시 충분한
          시간이 있으시다면 더불어민주당뿐만 아니라 다른 정당의 공약과 후보에
          대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 더불어민주당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  3: {
    keyword1: '자유',
    keyword2: '안보',
    resultSummary: (name: string) => (
      <div>
        <p>
          자몽자이언트파이어볼은{' '}
          <b>선택하신 공약 중 40% 이상이 미래통합당의 공약인 경우</b>에
          만들어지는 특별한 쥬스랍니다. 미래통합당이 추구하는 방향과 정책이{' '}
          {name}님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.
          <b>
            미래통합당에 투표하시면 {name}님이 필요하다고 생각하는 공약이
            추진되는 데 힘을 보태게 됩니다.
          </b>{' '}
          단, 낮은 확률로 {name}님이 가장 마음에 들어한 공약은 미래통합당의
          공약이 아니라 다른 정당 공약일 수도 있답니다. 아래의 성분분석 코너를
          확인해보세요!
        </p>

        <p>
          ⚠주의: 비례대표 투표를 할 때는 미래통합당이 없습니다. 대신
          미래통합당이 파견한 후보들이 등록되어 있는 미래한국당이 있습니다.
          미래한국당에 투표를 하시면 미래통합당이 파견한 비례대표 후보를
          당선시키는데 기여하실 수 있습니다.
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 자유, 안보와 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>보수</b> 성향 정당 공약이{' '}
          {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의 정치적인
          성향은 <b>보수</b>에 가깝습니다. 이번 총선에서 투표할 수 있는{' '}
          <b>보수</b> 성향 정당은 미래통합당 외에도 민생당, 국민의당.
          우리공화당, 친박신당 등이 있습니다. 혹시 충분한 시간이 있으시다면
          미래통합당과 유사한 성향을 가진 정당의 공약과 후보에 대해서도
          알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 미래통합당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  4: {
    keyword1: '시장',
    keyword2: '법치',
    resultSummary: (name: string) => (
      <div>
        <p>
          핑크자몽허니요거트는{' '}
          <b>미래통합당의 공약을 다른 정당의 공약에 비해 많이 선택한 경우</b>에
          만들어지는 신선한 쥬스랍니다. 미래통합당이 추구하는 방향과 정책이{' '}
          {name}님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.
          <b>
            미래통합당에 투표하시면 {name}님이 필요하다고 생각하는 공약이
            추진되는 데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 선택한 공약 중 미래통합당 공약이 많기는 하지만, 가장
          마음에 든 그 공약은 다른 정당의 공약일 수도 있습니다. 아래의 성분분석
          코너를 확인해보세요!
        </p>
        <p>
          ⚠주의: 비례대표 투표를 할 때는 미래통합당이 없습니다. 대신
          미래통합당이 파견한 후보들이 등록되어 있는 미래한국당이 있습니다.
          미래한국당에 투표를 하시면 미래통합당이 파견한 비례대표 후보를
          당선시키는데 기여하실 수 있습니다.
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 시장과 법치 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>{leftOrRight(pScore, cScore)}</b> 정당
          공약이 {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의
          정치적인 성향은 <b>{leftOrRight(pScore, cScore)}</b>에 가깝습니다.
          이번 총선에서 투표할 수 있는 <b>{leftOrRight(pScore, cScore)}</b> 성향
          정당은 {similarParties(pScore, cScore, 2)} 등이 있습니다. 혹시 충분한
          시간이 있으시다면 미래통합당뿐만 아니라 다른 정당의 공약과 후보에
          대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 미래통합당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  5: {
    keyword1: '노동',
    keyword2: '정의',
    resultSummary: (name: string) => (
      <div>
        <p>
          그레이트저스티스바나나는 이용자가{' '}
          <b>선택한 공약 중 40% 이상이 정의당의 공약인 경우</b>에 만들어지는
          특별한 쥬스랍니다. 정의당이 추구하는 방향과 정책이 {name}님이 옳다고
          생각하시는 바와 비슷하다는 의미입니다.
          <b>
            정의당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          다만 {name}님이 가장 마음에 들어한 공약은 정의당의 공약이 아닐 수도
          있으니, 아래의 성분분석 코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 노동과 정의를 중요하게 생각하는 사람일 가능성이
            높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 전보 성향 정당 공약이 {larger(pScore, cScore)}
          %로 많은 편입니다. 따라서 {name}님의 정치적인 성향은 <b>진보</b>{' '}
          성향에 가깝습니다. 이번 총선에서 투표할 수 있는 진보 성향의 정당은
          정의당 외에도 더불어민주당, 민중당, 녹색당 등이 있습니다. 혹시 충분한
          시간이 있으시다면 정의당과 유사한 성향을 가진 정당의 공약과 후보에
          대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 정의당이 {name}님의 관심 분야에 어떤 공약을
          가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  6: {
    keyword1: '평등',
    keyword2: '연대',
    resultSummary: (name: string) => (
      <div>
        <p>
          옐로우아일랜드티는{' '}
          <b>정의당의 공약을 다른 정당의 공약에 비해 많이 선택한 경우</b>에
          만들어지는 신선한 쥬스입니다. 정의당이 추구하는 방향과 정책이 {name}
          님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.{' '}
          <b>
            정의당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 선택한 공약 중 정의당 공약이 많기는 하지만, 가장 마음에
          든 그 공약은 다른 정당의 공약일 수도 있습니다. 아래의 성분분석 코너를
          확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 평등과 연대를 중요하게 생각하는 사람일 가능성이
            높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>{leftOrRight(pScore, cScore)}</b> 정당
          공약이 {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}
          님의 정치적인 성향은 <b>{leftOrRight(pScore, cScore)}</b>에
          가깝습니다. 이번 총선에서 투표할 수 있는{' '}
          <b>{leftOrRight(pScore, cScore)}</b> 성향 정당은{' '}
          {similarParties(pScore, cScore, 3)} 등이 있습니다. 혹시 충분한 시간이
          있으시다면 정의당뿐만 아니라 다른 정당의 공약과 후보에 대해서도
          알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 정의당이 {name}님의 관심 분야에 어떤 공약을
          가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  7: {
    keyword1: '혁신',
    keyword2: '합리',
    resultSummary: (name: string) => (
      <div>
        <p>
          센트럴썬라이즈는 이용자가{' '}
          <b>선택한 공약 중 40% 이상이 국민의당의 공약인 경우</b>에 만들어지는
          특별한 쥬스랍니다. 국민의당이 추구하는 방향과 정책이 {name}님이 옳다고
          생각하시는 바와 비슷하다는 의미입니다.{' '}
          <b>
            국민의당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          다만 {name}님이 가장 마음에 들어한 공약은 국민의당의 공약이 아닐 수도
          있으니, 아래의 성분분석 코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 혁신과 합리와 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>보수</b> 성향 정당 공약이{' '}
          {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의 정치적인
          성향은 <b>보수</b> 성향에 가깝습니다. 이번 총선에서 투표할 수 있는{' '}
          <b>보수</b>
          성향의 정당은 국민의당 외에도 미래통합당, 민생당, 우리공화당, 친박신당
          등이 있습니다. 혹시 충분한 시간이 있으시다면 국민의당과 유사한 성향을
          가진 정당의 공약과 후보에 대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 국민의당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  8: {
    keyword1: '실용',
    keyword2: '행복',
    resultSummary: (name: string) => (
      <div>
        <p>
          쿨오렌지에이드는{' '}
          <b>국민의당의 공약을 다른 정당의 공약에 비해 많이 선택한 경우</b>에
          만들어지는 신선한 쥬스입니다. 국민의당이 추구하는 방향과 정책이 {name}
          님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.{' '}
          <b>
            국민의당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 선택한 공약 중 국민의당 공약이 많기는 하지만, 가장
          마음에 든 그 공약은 다른 정당의 공약일 수도 있습니다. 아래의 성분분석
          코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 실용과 행복 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>{leftOrRight(pScore, cScore)}</b> 정당
          공약이 {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의
          정치적인 성향은 <b>{leftOrRight(pScore, cScore)}</b>에 가깝습니다.
          이번 총선에서 투표할 수 있는 <b>{leftOrRight(pScore, cScore)}</b> 성향
          정당은 {similarParties(pScore, cScore, 4)} 등이 있습니다. 혹시 충분한
          시간이 있으시다면 국민의당뿐만 아니라 다른 정당의 공약과 후보에
          대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 국민의당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  9: {
    keyword1: '민생',
    keyword2: '통합',
    resultSummary: (name: string) => (
      <div>
        <p>
          민초록레볼루셔너리밤은 이용자가{' '}
          <b>선택한 공약 중 40% 이상이 민생당의 공약인 경우</b>에 만들어지는
          특별한 쥬스랍니다. 민생당이 추구하는 방향과 정책이 {name}님이 옳다고
          생각하시는 바와 비슷하다는 의미입니다.
          <b>
            민생당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          다만 {name}님이 가장 마음에 들어한 공약은 민생당의 공약이 아닐 수도
          있으니, 아래의 성분분석 코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 민생, 통합과 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>보수</b> 성향 정당 공약이{' '}
          {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의 정치적인
          성향은 <b>보수</b> 성향에 가깝습니다. 이번 총선에서 투표할 수 있는{' '}
          <b>보수</b>
          성향의 정당은 민생당 외에도 미래통합당, 국민의당, 우리공화당, 친박신당
          등이 있습니다. 혹시 충분한 시간이 있으시다면 민생당과 유사한 성향을
          가진 정당의 공약과 후보에 대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 민생당이 {name}님의 관심 분야에 어떤 공약을
          가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  10: {
    keyword1: '개혁',
    keyword2: '실용',
    resultSummary: (name: string) => (
      <div>
        <p>
          에버그린키위라떼는{' '}
          <b>민생당의 공약을 다른 정당의 공약에 비해 많이 선택한 경우</b>에
          만들어지는 신선한 쥬스입니다. 민생당이 추구하는 방향과 정책이 {name}
          님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.{' '}
          <b>
            민생당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 선택한 공약 중 민생당 공약이 많기는 하지만, 가장 마음에
          든 그 공약은 다른 정당의 공약일 수도 있습니다. 아래의 성분분석 코너를
          확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 개혁과 실용 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>{leftOrRight(pScore, cScore)}</b> 정당
          공약이 {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의
          정치적인 성향은 <b>{leftOrRight(pScore, cScore)}</b>에 가깝습니다.
          이번 총선에서 투표할 수 있는 <b>{leftOrRight(pScore, cScore)}</b> 성향
          정당은 {similarParties(pScore, cScore, 5)} 등이 있습니다. 혹시 충분한
          시간이 있으시다면 민생당뿐만 아니라 다른 정당의 공약과 후보에 대해서도
          알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 민생당이 {name}님의 관심 분야에 어떤 공약을
          가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  11: {
    keyword1: '안보',
    keyword2: '자유',
    resultSummary: (name: string) => (
      <div>
        <p>
          태극뽀빠이캐롯샤워는 이용자가{' '}
          <b>선택한 공약 중 40% 이상이 우리공화당의 공약인 경우</b>에 만들어지는
          특별한 쥬스랍니다. 우리공화당이 추구하는 방향과 정책이 {name}님이
          옳다고 생각하시는 바와 비슷하다는 의미입니다.
          <b>
            우리공화당에 투표하시면 {name}님이 필요하다고 생각하는 공약이
            추진되는 데 힘을 보태게 됩니다.
          </b>{' '}
          다만 {name}님이 가장 마음에 들어한 공약은 우리공화당의 공약이 아닐
          수도 있으니, 아래의 성분분석 코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 안보와 자유 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>보수</b> 성향 정당 공약이{' '}
          {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의 정치적인
          성향은 <b>보수</b> 성향에 가깝습니다. 이번 총선에서 투표할 수 있는{' '}
          <b>보수</b>
          성향의 정당은 우리공화당 외에도 미래통합당, 민생당, 국민의당, 친박신당
          등이 있습니다. 혹시 충분한 시간이 있으시다면 우리공화당과 유사한
          성향을 가진 정당의 공약과 후보에 대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 우리공화당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  12: {
    keyword1: '시장',
    keyword2: '법치',
    resultSummary: (name: string) => (
      <div>
        <p>
          파워녹황프라푸치노는{' '}
          <b>우리공화당의 공약을 다른 정당의 공약에 비해 많이 선택한 경우</b>에
          만들어지는 신선한 쥬스입니다. 우리공화당이 추구하는 방향과 정책이{' '}
          {name}님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.
          <b>
            우리공화당에 투표하시면 {name}님이 필요하다고 생각하는 공약이
            추진되는 데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 선택한 공약 중 우리공화당 공약이 많기는 하지만, 가장
          마음에 든 그 공약은 다른 정당의 공약일 수도 있습니다. 아래의 성분분석
          코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 시장, 법치와 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>{leftOrRight(pScore, cScore)}</b> 정당
          공약이 {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의
          정치적인 성향은 <b>{leftOrRight(pScore, cScore)}</b>에 가깝습니다.
          이번 총선에서 투표할 수 있는 <b>{leftOrRight(pScore, cScore)}</b> 성향
          정당은 {similarParties(pScore, cScore, 6)} 등이 있습니다. 혹시 충분한
          시간이 있으시다면 우리공화당뿐만 아니라 다른 정당의 공약과 후보에
          대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 우리공화당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  13: {
    keyword1: '자주',
    keyword2: '통일',
    resultSummary: (name: string) => (
      <div>
        <p>
          샤인레이버스더블샷은 이용자가{' '}
          <b>선택한 공약 중 40% 이상이 민중당의 공약인 경우</b>에 만들어지는
          특별한 쥬스랍니다. 민중당이 추구하는 방향과 정책이 {name}님이 옳다고
          생각하시는 바와 비슷하다는 의미입니다.
          <b>
            민중당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          다만 {name}님이 가장 마음에 들어한 공약은 민중당의 공약이 아닐 수도
          있으니, 아래의 성분분석 코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 자주, 통일과 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 전보 성향 정당 공약이 {larger(pScore, cScore)}
          %로 많은 편입니다. 따라서 {name}님의 정치적인 성향은 <b>진보</b>{' '}
          성향에 가깝습니다. 이번 총선에서 투표할 수 있는 진보 성향의 정당은
          민중당 외에도 더불어민주당, 정의당, 녹색당 등이 있습니다. 혹시 충분한
          시간이 있으시다면 민중당과 유사한 성향을 가진 정당의 공약과 후보에
          대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 민중당이 {name}님의 관심 분야에 어떤 공약을
          가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  14: {
    keyword1: '노동',
    keyword2: '평등',
    resultSummary: (name: string) => (
      <div>
        <p>
          허니시트러스토닉은{' '}
          <b>민중당의 공약을 다른 정당의 공약에 비해 많이 선택한 경우</b>에
          만들어지는 신선한 쥬스입니다. 민중당이 추구하는 방향과 정책이 {name}
          님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.{' '}
          <b>
            민중당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 선택한 공약 중 민중당 공약이 많기는 하지만, 가장 마음에
          든 그 공약은 다른 정당의 공약일 수도 있습니다. 아래의 성분분석 코너를
          확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 노동과 평등 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>{leftOrRight(pScore, cScore)}</b> 정당
          공약이 {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의
          정치적인 성향은 <b>{leftOrRight(pScore, cScore)}</b>에 가깝습니다.
          이번 총선에서 투표할 수 있는 <b>{leftOrRight(pScore, cScore)}</b> 성향
          정당은 {similarParties(pScore, cScore, 7)} 등이 있습니다. 혹시 충분한
          시간이 있으시다면 민중당뿐만 아니라 다른 정당의 공약과 후보에 대해서도
          알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 민중당이 {name}님의 관심 분야에 어떤 공약을
          가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  15: {
    keyword1: '자유',
    keyword2: '시장',
    resultSummary: (name: string) => (
      <div>
        <p>
          마이프렌들리파크는 이용자가{' '}
          <b>선택한 공약 중 40% 이상이 친박신당의 공약인 경우</b>에 만들어지는
          특별한 쥬스랍니다. 친박신당이 추구하는 방향과 정책이 {name}님이 옳다고
          생각하시는 바와 비슷하다는 의미입니다.
          <b>
            친박신당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          다만 {name}님이 가장 마음에 들어한 공약은 친박신당의 공약이 아닐 수도
          있으니, 아래의 성분분석 코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 자유, 시장과 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>보수</b> 성향 정당 공약이{' '}
          {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의 정치적인
          성향은 <b>보수</b> 성향에 가깝습니다. 이번 총선에서 투표할 수 있는{' '}
          <b>보수</b>
          성향의 정당은 친박신당 외에도 미래통합당, 민생당, 국민의당, 우리공화당
          등이 있습니다. 혹시 충분한 시간이 있으시다면 친박신당과 유사한 성향을
          가진 정당의 공약과 후보에 대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 친박신당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  16: {
    keyword1: '안보',
    keyword2: '법치',
    resultSummary: (name: string) => (
      <div>
        <p>
          프리덤할라피뇨즙은{' '}
          <b>친박신당의 공약을 다른 정당의 공약에 비해 많이 선택한 경우</b>에
          만들어지는 신선한 쥬스입니다. 친박신당이 추구하는 방향과 정책이 {name}
          님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.
          <b>
            친박신당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 선택한 공약 중 친박신당 공약이 많기는 하지만, 가장
          마음에 든 그 공약은 다른 정당의 공약일 수도 있습니다. 아래의 성분분석
          코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 안보, 법치와 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>{leftOrRight(pScore, cScore)}</b> 정당
          공약이 {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의
          정치적인 성향은 <b>{leftOrRight(pScore, cScore)}</b>에 가깝습니다.
          이번 총선에서 투표할 수 있는 <b>{leftOrRight(pScore, cScore)}</b> 성향
          정당은 {similarParties(pScore, cScore, 8)} 등이 있습니다. 혹시 충분한
          시간이 있으시다면 친박신당뿐만 아니라 다른 정당의 공약과 후보에
          대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 친박신당이 {name}님의 관심 분야에 어떤
          공약을 가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  17: {
    keyword1: '생태',
    keyword2: '정의',
    resultSummary: (name: string) => (
      <div>
        <p>
          프레시유니버스클렌즈는 이용자가{' '}
          <b>선택한 공약 중 40% 이상이 녹색당의 공약인 경우</b>에 만들어지는
          특별한 쥬스랍니다. 녹색당이 추구하는 방향과 정책이 {name}님이 옳다고
          생각하시는 바와 비슷하다는 의미입니다.
          <b>
            녹색당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          다만 {name}님이 가장 마음에 들어한 공약은 녹색당의 공약이 아닐 수도
          있으니, 아래의 성분분석 코너를 확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 생태와 정의 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 전보 성향 정당 공약이 {larger(pScore, cScore)}
          %로 많은 편입니다. 따라서 {name}님의 정치적인 성향은 <b>진보</b>{' '}
          성향에 가깝습니다. 이번 총선에서 투표할 수 있는 진보 성향의 정당은
          녹색당 외에도 더불어민주당, 정의당, 민중당 등이 있습니다. 혹시 충분한
          시간이 있으시다면 녹색당과 유사한 성향을 가진 정당의 공약과 후보에
          대해서도 알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 녹색당이 {name}님의 관심 분야에 어떤 공약을
          가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  18: {
    keyword1: '협동',
    keyword2: '평화',
    resultSummary: (name: string) => (
      <div>
        <p>
          케일디톡스두유라떼는{' '}
          <b>녹색당의 공약을 다른 정당의 공약에 비해 많이 선택한 경우</b>에
          만들어지는 신선한 쥬스입니다. 녹색당이 추구하는 방향과 정책이 {name}
          님이 옳다고 생각하시는 바와 비슷하다는 의미입니다.
          <b>
            녹색당에 투표하시면 {name}님이 필요하다고 생각하는 공약이 추진되는
            데 힘을 보태게 됩니다.
          </b>{' '}
          단, {name}님이 선택한 공약 중 녹색당 공약이 많기는 하지만, 가장 마음에
          든 그 공약은 다른 정당의 공약일 수도 있습니다. 아래의 성분분석 코너를
          확인해보세요!
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 협동과 평화 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 <b>{leftOrRight(pScore, cScore)}</b> 정당
          공약이 {larger(pScore, cScore)}%로 많은 편입니다. 따라서 {name}님의
          정치적인 성향은 <b>{leftOrRight(pScore, cScore)}</b>에 가깝습니다.
          이번 총선에서 투표할 수 있는 <b>{leftOrRight(pScore, cScore)}</b> 성향
          정당은 {similarParties(pScore, cScore, 9)} 등이 있습니다. 혹시 충분한
          시간이 있으시다면 녹색당뿐만 아니라 다른 정당의 공약과 후보에 대해서도
          알아보시면 좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 녹색당이 {name}님의 관심 분야에 어떤 공약을
          가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  19: {
    keyword1: '정의',
    keyword2: '포용',
    resultSummary: (name: string) => (
      <div>
        <p>
          트로피칼페스티벌은 <b>진보</b> 성향 정당의 공약을 많이 선택하면
          만들어지는 따스한 쥬스입니다. 아쉽지만 {name}님께는 딱 한 개 정당을
          골라드리기 어렵답니다. 왜냐하면 {name}님이 특별히 한 정당의 공약을
          많이 선택하시지 않았기 때문이에요. 그럼 투표 어떻게 하냐구요?{' '}
          <b>
            {name}
            님이 투표할 정당을 찾기 위한 팁을 알려드릴게요.
          </b>{' '}
          아래 성분분석 코너에 {name}님이 선택하신 공약이 각각 어떤 정당의
          공약인지 표시해 뒀어요.{' '}
          <b>
            선택한 공약 중에 특히 마음에 드는 공약을 낸 정당이 어디인지, 혹은
            관심 주제에 대해 좋은 공약을 낸 정당이 어디인지 확인해 보세요!
          </b>{' '}
          이 과정을 거치면 {name}님이 이유 있는 한 표를 행사할 정당을 찾을 수
          있답니다.
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 정의, 포용 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 진보 성향 정당 공약이 {larger(pScore, cScore)}
          %로 많은 편입니다. 따라서 {name}님의 정치적인 성향은 <b>진보</b>에
          가깝습니다. 이번 총선에서 투표할 수 있는 진보 성향 정당은
          더불어민주당(더불어시민당). 정의당, 민중당, 녹색당 등이 있습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 진보 성향 정당들이 {name}
          님의 관심 분야에 어떤 공약을 가지고 있는지 확인하는 일은 꽤 흥미로울
          것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  20: {
    keyword1: '자유',
    keyword2: '안보',
    resultSummary: (name: string) => (
      <div>
        <p>
          베리익스트림시에스타는 <b>보수</b> 성향 정당의 공약을 많이 선택하면
          만들어지는 상큼한 쥬스입니다. 아쉽지만 {name}님께는 딱 한 개 정당을
          골라드리기 어려워요. 왜냐하면 {name}님이 특별히 한 정당의 공약을 많이
          선택하시지 않았기 때문이에요. 그럼 어디에 투표 하냐구요?{' '}
          <b>{name}님이 투표할 정당을 찾기 위한 팁을 알려드릴게요.</b> 아래
          성분분석 코너에 {name}
          님이 선택하신 공약이 각각 어떤 정당의 공약인지 표시해 뒀어요.{' '}
          <b>
            선택한 공약 중에 특히 마음에 드는 공약을 낸 정당이 어디인지, 혹은
            관심 주제에 대해 좋은 공약을 낸 정당이 어디인지 확인해 보세요!
          </b>{' '}
          이 과정을 거치면 {name}님이 이유 있는 한 표를 행사할 정당을 찾을 수
          있답니다.
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 자유, 안보와 같은 가치를 중요하게 생각하는 사람일
            가능성이 높습니다.
          </b>{' '}
          또 선택하신 공약 중에서 보수 성향 정당 공약이 {larger(pScore, cScore)}
          %로 많은 편입니다. 따라서 {name}님의 정치적인 성향은 <b>보수</b>에
          가깝습니다. 이번 총선에서 투표할 수 있는 보수 성향 정당은
          미래통합당(미래한국당), 민생당, 우리공화당, 친박신당, 국민의당 등이
          있습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등과 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 보수 성향 정당들이 {name}
          님의 관심 분야에 어떤 공약을 가지고 있는지 확인하는 일은 꽤 흥미로울
          것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },

  21: {
    keyword1: '실용',
    keyword2: '합리',
    resultSummary: (name: string) => (
      <div>
        <p>
          매지컬후르츠블렌드는 보수와 진보를 넘나들며 다양한 성향의 공약을
          선택한 중도 성향 이용자를 위해 만든 아주 부드러운 쥬스입니다. 다만,{' '}
          {name}님께 딱 한 개 정당을 골라드리기는 어려워요. 왜냐하면 {name}님이
          특별히 한 정당의 공약을 많이 선택하시지 않았기 때문이에요. 그럼 어디에
          투표 하냐구요?{' '}
          <b>{name}님이 투표할 정당을 찾기 위한 팁을 알려드릴게요.</b> 아래
          성분분석 코너에 {name}
          님이 선택하신 공약이 각각 어떤 정당의 공약인지 표시해 뒀어요.{' '}
          <b>
            선택한 공약 중에 특히 마음에 드는 공약을 낸 정당이 어디인지, 혹은
            관심 주제에 대해 좋은 공약을 낸 정당이 어디인지 확인해 보세요!
          </b>{' '}
          이 과정을 거치면 {name}님이 이유 있는 한 표를 행사할 정당을 찾을 수
          있답니다.
        </p>
      </div>
    ),
    resultDetail: ({ name, pScore, cScore, issueNames }) => (
      <div>
        <p>
          <b>
            {name}님은 평소 실용적이고 합리적이며 편견 없이 다양한 입장에 두루
            공감하는 사람일 가능성이 높습니다.
          </b>{' '}
          선택하신 공약 중에서 보수 성향 정당 공약이 {cScore}%, 진보 성향 정당
          공약이 {pScore}%로 나뉩니다. 어느 한쪽으로 치우지지 않는 {name}님의
          정치적인 성향은 <b>중도</b>에 가깝습니다. 아래 성분분석에서 특별히
          마음에 드는 공약을 낸 정당이 어디인지를 중심으로 투표할 정당을 정해도
          좋습니다.
        </p>
        <p>
          <b>
            {name}님은 {issueNames.join(', ')} 등에 관심이 많은 사람입니다.
          </b>{' '}
          다양한 공약을 보여드렸는데, 그중에서 {name}님이 선택하신 공약은{' '}
          {issueNames.join(', ')} 등에 관련된 것이었습니다. [공약쥬스]는 편리한
          서비스를 만들기 위해 분야 별로 각 정당이 가지고 있는 대표공약 위주로
          보여드렸습니다. 더 구체적인 내용을 확인하고 싶으시다면 선거 공보물을
          살펴보셔도 좋습니다. 특히 정당들이 {name}님의 관심 분야에 어떤 공약을
          가지고 있는지 확인하는 일은 꽤 흥미로울 것입니다.
        </p>
        <Footer name={name} />
      </div>
    ),
  },
}
