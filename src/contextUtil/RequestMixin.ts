import { BaseAction, BaseState } from './base';
import { Draft } from 'immer';
import { Mixin } from './Mixin';

type RequestStateItem<Data, Error> = {
  loading: boolean;
  data: Data | null;
  error: Error | null;
};

type RequestActionCreator<Name extends string, Data, Error> = {
  (status: 'start'): RequestAction<Name, Data, Error>;
  (status: 'complete', data: Data): RequestAction<Name, Data, Error>;
  (status: 'fail', error: Error): RequestAction<Name, Data, Error>;
  (status: 'clear'): RequestAction<Name, Data, Error>;
};

class Either<Data, Error> {
  // DataType!: Data;
  // ErrorType!: Error;
}

type RequestState<Name extends string, Data, Error> = {
  [K in Name]: RequestStateItem<Data, Error>;
};

type RequestActionCreatorMap<Name extends string, Data, Error> = {
  [K in Name]: RequestActionCreator<Name, Data, Error>;
};

export class RequestMixin<Name extends string, Data, Error> extends Mixin<
  RequestState<Name, Data, Error>,
  RequestActionCreatorMap<Name, Data, Error>
> {
  constructor(readonly name: Name, readonly either: Either<Data, Error>) {
    super();
  }

  initialPart() {
    return {
      [this.name]: RequestMixin.initialRequestState(),
    } as RequestState<Name, Data, Error>;
  }

  actionCreators() {
    return {
      [this.name]: createRequestActionCreator(this.name as Name),
    } as RequestActionCreatorMap<Name, Data, Error>;
  }

  producer() {
    return createRequestProducer(this.name);
  }

  static either<Data, Error>() {
    return new Either<Data, Error>();
  }

  static isLoading<D, E>(
    state: RequestStateItem<D, E>,
  ): state is RequestStateItemLoading<D, E> {
    return state.loading;
  }

  static isComplete<D, E>(
    state: RequestStateItem<D, E>,
  ): state is RequestStateItemStable<D, E> {
    return !RequestMixin.isLoading(state) && state.data !== null;
  }

  static isFailure<D, E>(
    state: RequestStateItem<D, E>,
  ): state is RequestStateItemError<D, E> {
    return !RequestMixin.isLoading(state) && state.error !== null;
  }

  static isStarted<D, E>(
    state: RequestStateItem<D, E>,
  ): state is
    | RequestStateItemLoading<D, E>
    | RequestStateItemStable<D, E>
    | RequestStateItemError<D, E> {
    return (
      RequestMixin.isLoading(state) ||
      RequestMixin.isComplete(state) ||
      RequestMixin.isFailure(state)
    );
  }

  static initialRequestState() {
    return {
      loading: false,
      data: null,
      error: null,
    };
  }
}

type RequestAction<Name extends string, Data, Error> =
  | {
      type: Name;
      status: 'start';
    }
  | { type: Name; status: 'complete'; data: Data }
  | { type: Name; status: 'fail'; error: Error }
  | { type: Name; status: 'clear' };

export interface RequestStateItemStable<D, E> extends RequestStateItem<D, E> {
  loading: false;
  data: NonNullable<D>;
  error: null;
}

export interface RequestStateItemLoading<D, E> extends RequestStateItem<D, E> {
  loading: true;
  data: D | null;
  error: E | null;
}

export interface RequestStateItemError<D, E> extends RequestStateItem<D, E> {
  loading: false;
  data: null;
  error: NonNullable<E>;
}

function createRequestActionCreator<Name extends string, Data, Error>(
  name: Name,
): RequestActionCreator<Name, Data, Error> {
  function requestActionCreator(
    status: 'start' | 'complete' | 'fail' | 'clear',
    dataOrError?: Data | Error,
  ): RequestAction<Name, Data, Error> {
    switch (status) {
      case 'start':
        return {
          type: name,
          status,
        };
      case 'complete':
        return {
          type: name,
          status,
          data: dataOrError as Data,
        };
      case 'fail':
        return {
          type: name,
          status,
          error: dataOrError as Error,
        };
      case 'clear':
        return {
          type: name,
          status,
        };
      default:
        throw new Error('Unsupported status');
    }
  }

  return requestActionCreator;
}

interface ProducerOf<State extends BaseState, Action extends BaseAction> {
  (draft: Draft<State>, action: Action): State | void;
}

function createRequestProducer<
  Name extends string,
  Data,
  Error,
  State extends BaseState,
  Action extends BaseAction
>(name: Name): ProducerOf<State, Action> {
  return (draft: Draft<State>, action: Action) => {
    if (action.type === name) {
      const requestAction = (action as unknown) as RequestAction<
        Name,
        Data,
        Error
      >;
      const requestState = Reflect.get(draft, name) as RequestStateItem<
        Data,
        Error
      >;

      if (requestAction.status === 'start') {
        requestState.loading = true;
        requestState.error = null;
      } else if (requestAction.status === 'complete') {
        requestState.loading = false;
        requestState.data = requestAction.data as Data;
        requestState.error = null;
      } else if (requestAction.status === 'fail') {
        requestState.loading = false;
        requestState.error = requestAction.error as Error;
        requestState.data = null;
      } else if (requestAction.status === 'clear') {
        Reflect.set(draft, name, RequestMixin.initialRequestState());
      }
    }
  };
}
