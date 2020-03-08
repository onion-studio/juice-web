import React, {
  createContext,
  ReactNode,
  useState,
  useCallback,
  useRef,
  useMemo,
  useContext,
} from 'react';

import produce, { Draft } from 'immer';
import {
  BaseMemoCreators,
  BaseAction,
  BaseActionCreators,
  BaseDeps,
  BaseState,
  BaseThunk,
  BaseThunkCreators,
  ReturnTypeOfProperties,
  ArrayElement,
} from './base';
import { Mixin } from './Mixin';

interface ProducerOf<State extends BaseState, Action extends BaseAction> {
  (draft: Draft<State>, action: Action): State | void;
}

function isThunk<T extends BaseThunk>(actionOrThunk: any): actionOrThunk is T {
  return typeof actionOrThunk === 'function';
}

export interface Opts {
  name: string;
  logging?: boolean;
}

export default function buildContext<Deps = unknown>(opts: Opts) {
  return new Builder<{}, Deps, never, never, never, {}, {}, {}>(
    opts,
    {},
    {},
    {},
    [],
    {},
  );
}

// https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never;

class Builder<
  PrevState extends BaseState,
  Deps extends BaseDeps,
  PrevAction extends BaseAction,
  PrevThunk extends BaseThunk,
  PrevProducer extends ProducerOf<PrevState, PrevAction>,
  PrevActionCreators extends BaseActionCreators,
  PrevThunkCreators extends BaseThunkCreators,
  PrevMemoCreators extends BaseMemoCreators
> {
  constructor(
    private readonly opts: Opts,
    private readonly prevInitialState: PrevState,
    private readonly prevActionCreators: PrevActionCreators,
    private readonly prevThunkCreators: PrevThunkCreators,
    private readonly prevProducers: ProducerOf<PrevState, PrevAction>[],
    private readonly prevMemoCreators: PrevMemoCreators,
  ) {}

  mixins<MixinArr extends Mixin<any, any, any>[]>(mixinArr: MixinArr) {
    // State
    type AdditionalState = UnionToIntersection<
      ArrayElement<MixinArr>['AdditionalStateType']
    >;
    type NextState = PrevState & AdditionalState;

    const additionalInitialState = mixinArr.reduce(
      (acc, mixin) => ({ ...acc, ...mixin.initialPart() }),
      {},
    ) as AdditionalState;

    const nextInitialState = {
      ...this.prevInitialState,
      // @ts-ignore
      ...additionalInitialState,
    } as NextState;

    // Action
    type AdditionalActionCreators = UnionToIntersection<
      ArrayElement<MixinArr>['ActionCreatorsType']
    >;
    type NextActionCreators = PrevActionCreators & AdditionalActionCreators;
    type NextAction = ReturnTypeOfProperties<NextActionCreators>;

    const additionalActionCreators = mixinArr.reduce(
      (acc, mixin) => ({ ...acc, ...mixin.actionCreators() }),
      {},
    ) as AdditionalActionCreators;

    const nextActionCreators = {
      ...this.prevActionCreators,
      // @ts-ignore
      ...additionalActionCreators,
    } as NextActionCreators;

    // Producer
    type AdditionalProducer = ProducerOf<NextState, NextAction>;
    type NextProducer = AdditionalProducer;

    const additionalProducers = mixinArr.reduce<AdditionalProducer[]>(
      (acc, mixin) => [...acc, mixin.producer()],
      [],
    );

    const nextProducers = [
      ...this.prevProducers,
      ...additionalProducers,
    ] as NextProducer[];

    return new Builder<
      NextState,
      Deps,
      NextAction,
      PrevThunk,
      NextProducer,
      NextActionCreators,
      PrevThunkCreators,
      PrevMemoCreators
    >(
      this.opts,
      nextInitialState,
      nextActionCreators,
      this.prevThunkCreators,
      nextProducers,
      this.prevMemoCreators,
    );
  }

  actionCreators<
    ReturnActionCreators extends {
      [key: string]: (...args: any[]) => { type: string };
    }
  >(additionalActionCreators: ReturnActionCreators) {
    type AdditionalActionCreators = typeof additionalActionCreators;
    type AdditionalAction = ReturnTypeOfProperties<AdditionalActionCreators>;

    type NextActionCreators = PrevActionCreators & AdditionalActionCreators;
    type NextAction = PrevAction | AdditionalAction;
    type NextProducer = ProducerOf<PrevState, NextAction>;

    const nextActionCreators = Object.assign(
      {},
      this.prevActionCreators,
      additionalActionCreators,
    ) as NextActionCreators;

    return new Builder<
      PrevState,
      Deps,
      NextAction,
      PrevThunk,
      NextProducer,
      NextActionCreators,
      PrevThunkCreators,
      PrevMemoCreators
    >(
      this.opts,
      this.prevInitialState,
      nextActionCreators,
      this.prevThunkCreators,
      (this.prevProducers as unknown) as NextProducer[], // TODO
      this.prevMemoCreators,
    );
  }

  producer<
    AdditionalPart extends BaseState,
    NextState = PrevState & AdditionalPart,
    AdditionalProducer = ProducerOf<NextState, PrevAction>
  >(initialPart: AdditionalPart, producer: AdditionalProducer) {
    const nextState = (Object.assign(
      {},
      this.prevInitialState,
      initialPart,
    ) as unknown) as NextState; // TODO

    type NextProducer = ProducerOf<NextState, PrevAction>;
    const nextProducers = ([
      ...this.prevProducers,
      producer,
    ] as unknown) as NextProducer[]; // TODO

    return new Builder<
      NextState,
      Deps,
      PrevAction,
      never,
      NextProducer,
      PrevActionCreators,
      {},
      {}
    >(this.opts, nextState, this.prevActionCreators, {}, nextProducers, {});
  }

  thunkCreators<
    ReturnThunkCreators extends (
      actionCreators: PrevActionCreators,
      prevThunkCreators: PrevThunkCreators,
    ) => {
      [key: string]: (
        ...args: any[]
      ) => (
        dispatch: (actionOrThunk: PrevAction | PrevThunk) => any,
        getState: () => PrevState,
        deps: Deps,
      ) => any;
    }
  >(f: ReturnThunkCreators) {
    type AdditionalThunkCreators = ReturnType<typeof f>;
    type AdditionalThunk = ReturnType<
      AdditionalThunkCreators[keyof AdditionalThunkCreators]
    >;
    type NextThunk = PrevThunk | AdditionalThunk;
    type NextThunkCreators = PrevThunkCreators & AdditionalThunkCreators;

    const additionalThunkCreators = f(
      this.prevActionCreators,
      this.prevThunkCreators,
    ) as AdditionalThunkCreators;

    for (const key of Object.keys(additionalThunkCreators)) {
      const name = additionalThunkCreators[key].name;
      const thunkCreator = additionalThunkCreators[key];

      Object.assign(additionalThunkCreators, {
        [key]: (...args: any[]) => {
          const thunk = thunkCreator(...args);
          Object.assign(thunk, { displayName: name });
          return thunk;
        },
      });
    }

    const nextThunkCreators: NextThunkCreators = {
      ...this.prevThunkCreators,
      ...additionalThunkCreators,
    };

    return new Builder<
      PrevState,
      Deps,
      PrevAction,
      NextThunk,
      PrevProducer,
      PrevActionCreators,
      NextThunkCreators,
      PrevMemoCreators
    >(
      this.opts,
      this.prevInitialState,
      this.prevActionCreators,
      nextThunkCreators,
      this.prevProducers,
      this.prevMemoCreators,
    );
  }

  memos<
    AdditionalMemoCreators extends { [key: string]: (state: PrevState) => any }
  >(m: AdditionalMemoCreators) {
    type NextMemoCreators = PrevMemoCreators & AdditionalMemoCreators;

    const nextMemoCreators = {
      ...this.prevMemoCreators,
      ...m,
    } as NextMemoCreators;

    return new Builder<
      PrevState,
      Deps,
      PrevAction,
      PrevThunk,
      PrevProducer,
      PrevActionCreators,
      PrevThunkCreators,
      NextMemoCreators
    >(
      this.opts,
      this.prevInitialState,
      this.prevActionCreators,
      this.prevThunkCreators,
      this.prevProducers,
      nextMemoCreators,
    );
  }

  build() {
    type Dispatch = (d: PrevAction | PrevThunk) => any;
    interface ProviderProps {
      mockState?: PrevState;
      deps: Deps;
      children: ReactNode;
      windowProperty?: string;
    }
    type Memo = {
      [K in keyof PrevMemoCreators]: ReturnType<PrevMemoCreators[K]>;
    };

    const Context = createContext<[PrevState, Dispatch, Memo]>([
      this.prevInitialState,
      (...args: any[]) => {
        throw new Error(
          `dispatch called without ${
            this.opts.name
          }Provider with args: ${JSON.stringify(args)}`,
        );
      },
      {} as any, // TODO
    ]);

    const reducer = (state: PrevState, action: PrevAction): PrevState => {
      return this.prevProducers.reduce(
        (additionalState, producer) =>
          // @ts-ignore
          produce(producer)(additionalState, action),
        state,
      );
    };

    const Provider = ({
      mockState,
      deps,
      children,
      windowProperty,
    }: ProviderProps) => {
      // TODO: optional deps
      // TODO: deps shallow compare

      const stateRef = useRef(mockState || this.prevInitialState);
      const [state, setState] = useState(stateRef.current);

      const memos = useMemo<Memo>(() => {
        return Object.entries(this.prevMemoCreators).reduce(
          (acc, [key, f]) => ({
            ...acc,
            [key]: f(state),
          }),
          {} as Memo,
        );
      }, [state]);

      if (windowProperty) {
        Object.assign(window, {
          [windowProperty]: state,
        });
      }

      const naiveDispatch = useCallback(
        (action: PrevAction) => {
          if (this.opts.logging && console.group) {
            // TODO: mixin action
            console.groupCollapsed(
              `%c${this.opts.name} action: %c${action.type}`,
              'color: green; font-weight: bold;',
              'color: #333; font-weight: bold;',
            );
            console.log(
              '%cprev state',
              'color: silver; font-weight: bold;',
              stateRef.current,
            );
            console.log(
              '%caction    ',
              'color: #0cf; font-weight: bold;',
              action,
            );
          }

          // NOTE: ref를 안 쓰면, thunk에서 이전 렌더링 시점의 stale state를 받아오는 문제가 생김
          stateRef.current = reducer(stateRef.current, action);

          if (this.opts.logging && console.group) {
            console.log(
              '%cnext state',
              'color: #0c6; font-weight: bold;',
              stateRef.current,
            );
            console.groupEnd();
          }

          // NOTE: 렌더링 시점의 로그가 group 안에 섞이지 않도록 밑으로 내림
          setState(stateRef.current);

          if (windowProperty) {
            Object.assign(window, {
              [windowProperty]: stateRef.current,
            });
          }
          return action;
        },
        [windowProperty],
      );

      const dispatch = useCallback(
        (actionOrThunk: PrevAction | PrevThunk) => {
          if (isThunk(actionOrThunk)) {
            if (this.opts.logging) {
              const thunkName = Reflect.get(actionOrThunk, 'displayName');
              console.log(
                `%c${this.opts.name} thunk: %c${thunkName}`,
                'color: blue; font-weight: bold;',
                'color: #333; font-weight: bold',
              );
            }
            actionOrThunk(dispatch, () => stateRef.current, deps);
          } else {
            naiveDispatch(actionOrThunk);
          }
        },
        [deps, naiveDispatch],
      );

      const mockDispatch = (...args: any[]) => {};

      const value = useMemo<[PrevState, Dispatch, Memo]>(
        () => [state, mockState ? mockDispatch : dispatch, memos],
        [state, dispatch, memos, mockState],
      );

      return <Context.Provider value={value}>{children}</Context.Provider>;
    };

    if (this.opts.name) {
      Provider.displayName = `${this.opts.name}Provider`;
    }

    return {
      reducer,
      actionCreators: this.prevActionCreators,
      thunkCreators: this.prevThunkCreators,
      Context,
      Provider,
      initialState: this.prevInitialState,
      useThisContext: () => useContext(Context),
      // TODO: createStore
    };
  }
}
