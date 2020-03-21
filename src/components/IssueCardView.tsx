import React, {
  FC,
  useCallback,
  useState,
  useRef,
  useEffect,
  CSSProperties,
  useContext,
} from 'react'
import c from 'classnames'
import s from './IssueCardView.module.scss'
import { CardEventContext } from '../contexts/CardEventContext'
import { ReactComponent as IconPickRed } from './svg/ico-pick-red.svg'
import { ReactComponent as IconPickGray } from './svg/ico-pick-gray.svg'

enum SlideAnimationState {
  start = 'start',
  appearing = 'appearing',
  idle = 'idle',
  leftSlide = 'leftSlide',
  rightSlide = 'rightSlide',
  grabbed = 'grabbed',
  recovering = 'recovering',
  end = 'end',
}

interface CardGrabbedEvent {
  type: 'cardGrabbed'
  x: number
}

interface CardMovedEvent {
  type: 'cardMoved'
  x: number
}

interface CardReleasedEvent {
  type: 'cardReleased'
}

type SlideAnimationEvent = CardGrabbedEvent | CardMovedEvent | CardReleasedEvent

const DURATION_LEFT_SLIDE = 300
const DURATION_RIGHT_SLIDE = 300
const DURATION_APPEARING = 800
const DURATION_RECOVERING = 300

const msToSec = (ms: number) => `${ms / 1000}s`
const dLeftSide = msToSec(DURATION_LEFT_SLIDE)
const dRightSlide = msToSec(DURATION_RIGHT_SLIDE)
const dAppearing = msToSec(DURATION_APPEARING)
const dRecovering = msToSec(DURATION_RECOVERING)

type SlideAnimationEnv = [
  SlideAnimationState,
  /// offset
  number,
  (e: SlideAnimationEvent) => void,
  /// triggerLeftSlide
  () => void,
  /// triggerRightSlide
  () => void,
]

const useSlideAnimation: (
  threshold: number,
  onSelect: () => void,
  onSelectAnimationEnd: () => void,
  onDiscard: () => void,
  onDiscardAnimationEnd: () => void,
) => SlideAnimationEnv = (
  threshold,
  onSelect,
  onSelectAnimationEnd,
  onDiscard,
  onDiscardAnimationEnd,
) => {
  const [animationState, setAnimationState] = useState(
    SlideAnimationState.start,
  )
  const initialMousePos = useRef<null | number>(null)
  const animationStateRef = useRef<SlideAnimationState>(animationState)
  animationStateRef.current = animationState
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setAnimationState(SlideAnimationState.appearing)
    })
    setTimeout(() => {
      setAnimationState(SlideAnimationState.idle)
    }, DURATION_APPEARING)
  }, [])

  const triggerLeftSlide = useCallback(() => {
    setAnimationState(SlideAnimationState.leftSlide)
    onDiscard()
    setTimeout(() => {
      setAnimationState(SlideAnimationState.end)
      onDiscardAnimationEnd()
    }, DURATION_LEFT_SLIDE)
  }, [onDiscard, onDiscardAnimationEnd])

  const triggerRightSlide = useCallback(() => {
    setAnimationState(SlideAnimationState.rightSlide)
    onSelect()
    setTimeout(() => {
      setAnimationState(SlideAnimationState.end)
      onSelectAnimationEnd()
    }, DURATION_RIGHT_SLIDE)
  }, [onSelect, onSelectAnimationEnd])

  const onEvent = useCallback(
    (e: SlideAnimationEvent) => {
      switch (e.type) {
        case 'cardGrabbed':
          // idle 상태면, grabbed 상태로 전환하고, 최초 마우스 포지션을 기록한다.
          // 다른 상태라면 아무것도 하지 않는다.
          if (
            animationState === SlideAnimationState.idle ||
            animationState === SlideAnimationState.recovering
          ) {
            setAnimationState(SlideAnimationState.grabbed)
            initialMousePos.current = e.x
          }
          return
        case 'cardMoved':
          // grabbed 상태면, 최초 마우스 포지션을 참고해서 offset을 수정한다.
          // 다른 상태라면 아무것도 하지 않는다.
          if (animationState === SlideAnimationState.grabbed) {
            setOffset(e.x - initialMousePos.current!)
          }
          return
        case 'cardReleased':
          // grabbed 상태면, offset 에 따라 leftSlide, rightSlide, recovering 상태로 전환한다.
          // 다른 상태라면 아무것도 하지 않는다.
          if (animationState === SlideAnimationState.grabbed) {
            if (offset < -threshold) {
              triggerLeftSlide()
            } else if (offset > threshold) {
              triggerRightSlide()
            } else {
              setAnimationState(SlideAnimationState.recovering)
              // NOTE: 하단 detailButton onClick 핸들러가
              // onEvent 보다 2ms 늦게 실행되는 문제가 있어서 workaround
              setTimeout(() => {
                setOffset(0)
              }, 20)
              setTimeout(() => {
                // NOTE: recovering 중에 다시 grabbed 상태에 빠지는 경우를 고려
                if (
                  animationStateRef.current === SlideAnimationState.recovering
                ) {
                  setAnimationState(SlideAnimationState.idle)
                }
              }, DURATION_RECOVERING)
            }
          }
          return
      }
    },
    [
      offset,
      setOffset,
      animationState,
      setAnimationState,
      threshold,
      triggerLeftSlide,
      triggerRightSlide,
    ],
  )

  return [animationState, offset, onEvent, triggerLeftSlide, triggerRightSlide]
}

export enum IssueCardCommand {
  leftSlide = 'leftSlide',
  rightSlide = 'rightSlide',
}

export interface Props {
  // iconImg: string
  // tags: string[]
  distance: number
  interactive: boolean
  title: string
  description: string
  onSelect: () => void
  onSelectAnimationEnd: () => void
  onDiscard: () => void
  onDiscardAnimationEnd: () => void
}

export const IssueCardView: FC<Props> = ({
  interactive,
  title,
  description,
  onSelect,
  onSelectAnimationEnd,
  onDiscard,
  onDiscardAnimationEnd,
  distance,
}) => {
  const threshold = 40
  const [
    animationState,
    offset,
    onEvent,
    triggerLeftSlide,
    triggerRightSlide,
  ] = useSlideAnimation(
    threshold,
    onSelect,
    onSelectAnimationEnd,
    onDiscard,
    onDiscardAnimationEnd,
  )
  const [detailVisible, setDetailVisible] = useState(false)
  const cardEventManager = useContext(CardEventContext)
  const animationStateRef = useRef(animationState)
  const interactiveRef = useRef(interactive)
  animationStateRef.current = animationState
  interactiveRef.current = interactive

  useEffect(() => {
    return cardEventManager.onSelect(() => {
      if (
        interactiveRef.current &&
        animationStateRef.current === SlideAnimationState.idle
      ) {
        triggerRightSlide()
      }
    })
  }, [cardEventManager, triggerRightSlide])

  useEffect(() => {
    return cardEventManager.onDiscard(() => {
      if (
        interactiveRef.current &&
        animationStateRef.current === SlideAnimationState.idle
      ) {
        triggerLeftSlide()
      }
    })
  }, [cardEventManager, triggerLeftSlide])

  const rotation = offset / 10
  const cardStyle: CSSProperties =
    animationState === SlideAnimationState.start
      ? {
          transition: `transform ${dAppearing}, opacity ${dAppearing}`,
          opacity: 0,
        }
      : // : animationState === SlideAnimationState.appearing
      // ? {
      //     transition: `transform ${dAppearing}, opacity ${dAppearing}`,
      //     opacity: 1,
      //   }
      animationState === SlideAnimationState.idle
      ? {
          transition: `transform ${dLeftSide}, opacity ${dLeftSide} .2s`,
        }
      : animationState === SlideAnimationState.grabbed
      ? {
          transform: `translateX(${offset}px) rotate(${rotation}deg)`,
        }
      : animationState === SlideAnimationState.leftSlide
      ? {
          transition: `transform ${dLeftSide}, opacity ${dLeftSide} .2s`,
          transform: `translateX(${Math.min(offset, -300)}px) rotate(${Math.min(
            rotation,
            -10,
          )}deg)`,
          opacity: 0,
        }
      : animationState === SlideAnimationState.rightSlide
      ? {
          transition: `transform ${dRightSlide}, opacity ${dRightSlide} .2s`,
          transform: `translateX(${Math.max(offset, 300)}px) rotate(${Math.max(
            rotation,
            10,
          )}deg)`,
          opacity: 0,
        }
      : animationState === SlideAnimationState.recovering
      ? {
          transition: `transform ${dRecovering}, opacity ${dRecovering}`,
          transform: `translateX(0px) rotate(0deg)`,
        }
      : animationState === SlideAnimationState.end
      ? {
          pointerEvents: 'none',
          opacity: 0,
        }
      : {}
  return (
    <div
      style={{
        zIndex: 100 - distance,
        pointerEvents: interactive ? 'auto' : 'none',
        transform: `translateX(-50%) scale(${(100 - distance) /
          100}) translateY(${distance * 3}px)`,
      }}
      className={s.container}
      onTouchStart={e => {
        onEvent({ type: 'cardGrabbed', x: e.touches[0].clientX })
      }}
      onMouseDown={e => {
        onEvent({ type: 'cardGrabbed', x: e.clientX })
      }}
      onMouseMove={e => {
        onEvent({ type: 'cardMoved', x: e.clientX })
      }}
      onTouchMove={e => {
        onEvent({ type: 'cardMoved', x: e.touches[0].clientX })
      }}
      onMouseUp={e => {
        onEvent({ type: 'cardReleased' })
      }}
      onTouchEnd={e => {
        onEvent({ type: 'cardReleased' })
      }}
    >
      <div className={s.card} style={cardStyle}>
        <div
          className={c(s.selectStamp, {
            [s.selectStamp__visible]: offset > threshold,
          })}
        >
          <div>
            <IconPickRed />
          </div>
          <div>담을래요</div>
        </div>
        <div
          className={c(s.discardStamp, {
            [s.discardStamp__visible]: offset < -threshold,
          })}
        >
          <div>
            <IconPickGray />
          </div>
          <div>싫어요</div>
        </div>

        <div
          className={c(
            s.card_inner,
            detailVisible ? s.card_inner__expanded : s.card_inner__collapsed,
          )}
        >
          <div className={s.cardTitle}>{title}</div>
          {detailVisible || (
            <div className={s.cardTags}>#질병 #감염병 #출입국관리</div>
          )}

          {detailVisible ? (
            <div className={s.cardDescription}>{description}</div>
          ) : (
            <>
              <div style={{ flexGrow: 1 }} />
              <div
                className={s.detailButton}
                onClick={() => {
                  if (Math.abs(offset) < 2) {
                    setDetailVisible(true)
                  }
                }}
              >
                자세히 보기
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
