import React, { FC, MouseEvent as ReactMouseEvent, TouchEvent } from 'react'
import { useSet, useToggle } from 'react-use'
import s from './PledgeSelectingPage.module.scss'
import c from 'classnames'

const IssueNavigationItem: FC<{ selected: boolean }> = ({ selected }) => {
  return (
    <div
      className={c(s.issueList_item, {
        [s.issueList_item__selected]: selected,
      })}
    >
      1
    </div>
  )
}

// https://gist.github.com/gre/1650294
const easeOutCubic = (t: number) => --t * t * t + 1

const indicies = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
]

enum CarouselState {
  start = 'start', // TODO: 시작 애니메이션
  idle = 'idle',
  grabbed = 'grabbed',
  animating = 'animating',
  mouseDown = 'mouseDown',
}

const itemWidth = 80

interface State {
  width: number
  selectedItemIndex: number
}

class IssueNavigationBar extends React.Component<{}, State> {
  // region Property
  carouselRef = React.createRef<HTMLDivElement>()
  _carouselState = CarouselState.idle
  carouselRect!: DOMRect
  initialMousePos!: number
  initialScrollPos!: number
  animationStartTime!: number
  animationStartScrollPos!: number
  animationDestScrollPos!: number
  lastMouseDownPos!: number

  state = {
    width: -1,
    selectedItemIndex: 0,
  }
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
      <div>
        <div className={s.issueList} ref={this.carouselRef}>
          <div className={s.issueList_spacer} />
          {indicies.map((_, i) => {
            return (
              <IssueNavigationItem
                key={i}
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

  /// offsetX -> index
  calcIndexOf(offsetX: number): number {
    // offsetX = targetPosition.clientX - carouselRect.left
    const coordX = this.carouselRef.current!.scrollLeft + offsetX
    let scopeLeft = this.state.width
    let scopeRight = scopeLeft + itemWidth
    let index = 0
    while (scopeRight < coordX) {
      scopeRight += itemWidth
      index += 1
    }
    return Math.min(index, indicies.length - 1)
  }

  calcDestIndex(): number {
    return this.calcIndexOf(this.state.width / 2)
  }

  carouselStateTransition(s: CarouselState) {
    // console.log(`transition: ${this._carouselState} -> ${s}`)
    this._carouselState = s
  }

  // endregion

  // region State Machine - Action
  toGrabbed = (clientX: number) => {
    if (
      !this.assertCarouselState(
        CarouselState.idle,
        CarouselState.animating,
        CarouselState.mouseDown,
      )
    ) {
      return
    }
    this.initialMousePos = clientX
    this.initialScrollPos = this.carouselRef.current!.scrollLeft
    this.carouselStateTransition(CarouselState.grabbed)
  }

  whileGrabbed = (clientX: number) => {
    if (!this.assertCarouselState(CarouselState.grabbed)) {
      return
    }
    this.carouselRef.current!.scrollLeft =
      this.initialScrollPos - clientX + this.initialMousePos

    const destIndex = this.calcDestIndex()
    if (this.state.selectedItemIndex !== destIndex) {
      this.setState({ selectedItemIndex: destIndex })
    }
  }

  toAnimating = (selectedItemIndex: number) => {
    if (
      !this.assertCarouselState(CarouselState.grabbed, CarouselState.mouseDown)
    ) {
      return
    }

    this.animationStartTime = Date.now()
    this.animationStartScrollPos = this.getScroll()
    this.animationDestScrollPos = this.calcScrollPosOf(selectedItemIndex)
    this.setState({ selectedItemIndex })
    this.carouselStateTransition(CarouselState.animating)
    this.whileAnimating()
  }

  whileAnimating = () => {
    const duration = 300
    const elapsed = Date.now() - this.animationStartTime
    const progress = easeOutCubic(elapsed / duration)
    const currentScrollPos =
      this.animationStartScrollPos +
      (this.animationDestScrollPos - this.animationStartScrollPos) * progress
    this.setScroll(currentScrollPos)

    if (
      elapsed < duration &&
      this.assertCarouselState(CarouselState.animating)
    ) {
      requestAnimationFrame(this.whileAnimating)
    }
  }

  toMouseDown = () => {
    this.carouselStateTransition(CarouselState.mouseDown)
  }
  // endregion

  // region State Machine - Event

  whenPointerDown(pointerClientX: number) {
    this.toMouseDown()
    this.lastMouseDownPos = pointerClientX
  }

  whenPointerMove(pointerClientX: number) {
    this.lastMouseDownPos = pointerClientX
    if (this.assertCarouselState(CarouselState.mouseDown)) {
      this.toGrabbed(pointerClientX)
    } else {
      this.whileGrabbed(pointerClientX)
    }
  }

  whenPointerUp() {
    if (this.assertCarouselState(CarouselState.grabbed)) {
      this.toAnimating(this.calcDestIndex())
    } else if (this.assertCarouselState(CarouselState.mouseDown)) {
      // 클릭으로 간주
      const offsetX = this.lastMouseDownPos - this.carouselRect.left
      const selectedItemIndex = this.calcIndexOf(offsetX)
      this.toAnimating(selectedItemIndex)
    }
  }

  // endregion

  // region DOM Event Handler
  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    this.whenPointerDown(e.clientX)
  }

  handleMouseMove = (e: MouseEvent) => {
    this.whenPointerMove(e.clientX)
  }

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    this.whenPointerUp()
  }

  handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    this.whenPointerDown(e.touches[0].clientX)
  }

  handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    this.whenPointerMove(e.touches[0].clientX)
  }

  handleTouchEnd = () => {
    this.whenPointerUp()
  }

  // endregion

  // 시작: start -> animating -> idle
  // 드래그: idle | animating -> grabbed -> animating -> idle
  // 클릭: idle | animating -> animating -> idle

  // select 이벤트란:
  // n 번째 엘리먼트가 마킹이 되면서
  // 하단 목록이 바뀐다.

  // **NOTE** 중앙에 위치하는 애니메이션은 select 이벤트와 별개

  // select 이벤트 발생 조건:
  // 1. 아이템 클릭하면 발생
  // 2. 스와이프하면서 '중앙' 영역에 50% 넘게 들어오면 발생

  // animating 상태:
  // n 번째 엘리먼트가 중앙에 위치하도록 스크롤 포지션을 0.3s 동안 이동시킴

  // animating 상태에 빠지는 조건:
  // - 현재 선택되지 않은 아이템 클릭
  // - grabbed 상태에서 touchUp/mouseUp
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
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, i) => (
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
