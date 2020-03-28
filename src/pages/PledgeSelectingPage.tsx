import React, { FC } from 'react'
import s from './PledgeSelectingPage.module.scss'
import c from 'classnames'
import { TopNavBar } from '../components/TopNavBar'
import { PledgeCard } from '../components/PledgeCard'
import {
  PledgeSelectorProvider,
  usePledgeSelector,
} from '../contexts/PledgeSelectorContext'
import { Issue } from '../contexts/entities'
import {
  useIssueSelectorContext,
  issueSelectorThunk,
} from '../contexts/IssueSelectorContext'

const IssueNavigationItem: FC<{ selected: boolean; title: string }> = ({
  selected,
  title,
}) => {
  return (
    <div
      className={c(s.issueList_item, {
        [s.issueList_item__selected]: selected,
      })}
    >
      <div className={s.issueList_item_mock} />
      <div className={s.issueList_item_title}>{title}</div>
    </div>
  )
}

// https://gist.github.com/gre/1650294
const easeOutCubic = (t: number) => --t * t * t + 1

enum CarouselState {
  start = 'start', // TODO: 시작 애니메이션
  idle = 'idle',
  grabbed = 'grabbed',
  animating = 'animating',
  pointerDown = 'pointerDown',
}

const itemWidth = 94

interface CarouselAnimationInfo {
  animationStartTime: number
  animationStartScrollPos: number
  animationDestScrollPos: number
  animationId: number
}

interface State {
  width: number
  selectedItemIndex: number
}

class IssueNavigationBar extends React.Component<
  { issues: Issue[]; onSelectIssue: (id: Issue['id']) => void },
  State
> {
  // region Property
  carouselRef = React.createRef<HTMLDivElement>()
  _carouselState = CarouselState.idle
  carouselRect!: DOMRect
  initialMousePos!: number
  initialScrollPos!: number
  lastPointerPos!: number
  state = {
    width: -1,
    selectedItemIndex: 0,
  }
  animationId: number = 0
  // endregion

  // region Lifecycle
  componentDidMount() {
    // FIXME: 바뀔 수 있음
    this.carouselRect = this.carouselRef.current!.getBoundingClientRect()
    this.setState({ width: this.carouselRect.width }, () => {
      this.setScroll(this.calcScrollPosOf(0))
    })
  }

  render() {
    return (
      <div className={s.issueNavigator}>
        <div className={s.issueList} ref={this.carouselRef}>
          <div className={s.issueList_spacer} />
          {this.props.issues.map((item, i) => {
            return (
              <IssueNavigationItem
                key={item.id}
                title={item.name}
                selected={i === this.state.selectedItemIndex}
              />
            )
          })}
          <div className={s.issueList_spacer} />
        </div>
        <div
          className={s.window}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
        />
      </div>
    )
  }
  // endregion

  // region Helper
  getScroll(): number {
    return this.carouselRef.current!.scrollLeft
  }

  setScroll(scrollLeft: number) {
    this.carouselRef.current!.scrollLeft = scrollLeft
  }

  assertCarouselState(...s: CarouselState[]) {
    return s.includes(this._carouselState)
  }

  /// index -> scroll position
  calcScrollPosOf(index: number): number {
    const base = (this.state.width + itemWidth) / 2
    return base + index * itemWidth
  }

  calcIndexOf(offsetX: number): number {
    // offsetX = targetPosition.clientX - carouselRect.left
    const coordX = this.getScroll() + offsetX
    let scopeLeft = this.state.width
    let scopeRight = scopeLeft + itemWidth
    let index = 0
    while (scopeRight < coordX) {
      scopeRight += itemWidth
      index += 1
    }
    return Math.min(index, this.props.issues.length - 1)
  }

  calcDestIndexForSwipe(): number {
    return this.calcIndexOf(this.state.width / 2)
  }

  transitTo(s: CarouselState) {
    // console.log(`transition: ${this._carouselState} -> ${s}`)
    this._carouselState = s
  }

  // endregion

  // region State Machine - Action
  toGrabbed = () => {
    this.initialScrollPos = this.getScroll()
    this.transitTo(CarouselState.grabbed)
  }

  whileGrabbed = (clientX: number) => {
    const offset = this.initialMousePos - clientX
    this.setScroll(this.initialScrollPos + offset * 1.5)

    const destIndex = this.calcDestIndexForSwipe()
    if (this.state.selectedItemIndex !== destIndex) {
      this.setState({ selectedItemIndex: destIndex })
    }
  }

  toAnimating = (selectedItemIndex: number) => {
    const animationStartScrollPos = this.getScroll()
    const animationDestScrollPos = this.calcScrollPosOf(selectedItemIndex)
    this.setState({ selectedItemIndex })
    // TODO: debounce
    this.props.onSelectIssue(this.props.issues[selectedItemIndex].id)
    this.transitTo(CarouselState.animating)
    this.animationId += 1
    this.whileAnimating({
      animationStartTime: Date.now(),
      animationStartScrollPos,
      animationDestScrollPos,
      animationId: this.animationId,
    })
  }

  whileAnimating = (animationInfo: CarouselAnimationInfo) => {
    const {
      animationStartTime,
      animationStartScrollPos,
      animationDestScrollPos,
      animationId,
    } = animationInfo

    const duration = 300
    const elapsed = Date.now() - animationStartTime

    // console.log(duration, elapsed)
    if (elapsed > duration) {
      // console.log('return: animationFinish')
      this.whenAnimationFinish()
      return
    }

    if (animationId !== this.animationId) {
      // console.log('return: animationId different')
      return
    }

    if (!this.assertCarouselState(CarouselState.animating)) {
      // console.log('return: not animating state')
      return
    }

    const progress = easeOutCubic(elapsed / duration)
    const currentScrollPos =
      animationStartScrollPos +
      (animationDestScrollPos - animationStartScrollPos) * progress
    this.setScroll(currentScrollPos)

    // console.log('request!')
    requestAnimationFrame(() => this.whileAnimating(animationInfo))
  }

  toPointerDown = () => {
    this.transitTo(CarouselState.pointerDown)
  }

  toIdle = () => {
    this.transitTo(CarouselState.idle)
  }
  // endregion

  // region State Machine - Event

  whenAnimationFinish() {
    this.toIdle()
  }

  whenPointerDown(pointerClientX: number) {
    if (this.assertCarouselState(CarouselState.idle, CarouselState.animating)) {
      this.toPointerDown()
      this.initialMousePos = pointerClientX
      this.lastPointerPos = pointerClientX
    }
  }

  whenPointerMove(pointerClientX: number) {
    this.lastPointerPos = pointerClientX
    if (this.assertCarouselState(CarouselState.grabbed)) {
      this.whileGrabbed(pointerClientX)
    } else if (
      this.assertCarouselState(CarouselState.pointerDown) &&
      Math.abs(this.lastPointerPos - this.initialMousePos) > 2
    ) {
      this.toGrabbed()
    }
  }

  whenPointerUp() {
    if (this.assertCarouselState(CarouselState.grabbed)) {
      this.toAnimating(this.calcDestIndexForSwipe())
    } else if (this.assertCarouselState(CarouselState.pointerDown)) {
      // 클릭으로 간주
      const offsetX = this.lastPointerPos - this.carouselRect.left
      const selectedItemIndex = this.calcIndexOf(offsetX)
      this.toAnimating(selectedItemIndex)
    }
  }

  // endregion

  // region DOM Event Handler
  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // console.log('mousedown')
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    this.whenPointerDown(e.clientX)
  }

  handleMouseMove = (e: MouseEvent) => {
    this.whenPointerMove(e.clientX)
  }

  handleMouseUp = () => {
    // console.log('mouseup')
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    this.whenPointerUp()
  }

  handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    // console.log('touchstart!!!!!!!!!')
    this.whenPointerDown(e.touches[0].clientX)
  }

  handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    this.whenPointerMove(e.touches[0].clientX)
  }

  handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    // console.log('touchend')
    this.whenPointerUp()
  }

  // endregion
}

const PledgeCardList: FC = () => {
  const pledgeSelector = usePledgeSelector()

  if (!pledgeSelector.pledgesResult.data) {
    return null
  }

  const pledges = pledgeSelector.pledgesResult.data
  // TODO
  const filteredPledges = pledges.filter(
    item => item.issueId === pledgeSelector.currentIssueId,
  )
  return (
    <div className={s.pledgeCardList}>
      {filteredPledges.map(item => {
        const selected = pledgeSelector.selectedPledgeIds.has(item.id)
        const folded = !pledgeSelector.unfoldedPledgeIds.has(item.id)
        return (
          <PledgeCard
            key={item.id}
            title={item.title}
            summary={item.summary}
            selected={selected}
            onSelect={() =>
              pledgeSelector.action.togglePledgeSelection(item.id)
            }
            onToggleFolding={() =>
              pledgeSelector.action.togglePledgeFolding(item.id)
            }
            folded={folded}
          />
        )
      })}
    </div>
  )
}

export const Inner: FC = () => {
  const pledgeSelector = usePledgeSelector()
  const selectedCount = pledgeSelector.selectedPledgeIds.size
  const progress = Math.min(1, selectedCount / 3)
  const title =
    selectedCount === 0
      ? '공약을 3개 이상 선택하세요!'
      : selectedCount < 3
      ? `${selectedCount}개 선택했어요…`
      : `${selectedCount}개 선택했어요 (최대 10개)`
  return (
    <div className={s.main}>
      <TopNavBar
        title={title}
        progress={progress}
        action={
          <div className={c(s.completeButton, s.completeButton__disabled)}>
            결과 보기
          </div>
        }
      />
      <IssueNavigationBar
        issues={pledgeSelector.selectedIssues}
        onSelectIssue={(id: Issue['id']) =>
          pledgeSelector.action.selectIssue(id)
        }
      />
      <PledgeCardList />
    </div>
  )
}

export const PledgeSelectingPage: FC = () => {
  const [issueSelectorState, issueSelectorDispatch] = useIssueSelectorContext()

  if (!issueSelectorState.issuesReq.data) {
    issueSelectorDispatch(issueSelectorThunk.loadIssues())
    return null
  }

  // TODO: 데모용으로 일단 전체 이슈 보여줌
  // const selectedIssues = issueSelectorState.issuesReq.data.filter(item =>
  //   issueSelectorState.selectedIssueIds.includes(item.id),
  // )

  const selectedIssues = issueSelectorState.issuesReq.data

  return (
    <PledgeSelectorProvider selectedIssues={selectedIssues.slice(0, 4)}>
      <Inner />
    </PledgeSelectorProvider>
  )
}
