export interface BaseAction {
  type: string;
}

export interface BaseActionCreators {
  [key: string]: (...args: any[]) => BaseAction;
}

export interface BaseThunk {
  (...args: any[]): Promise<any>;
}

export interface BaseThunkCreators {
  [key: string]: (dispatch: any, getState: any, deps: BaseDeps) => BaseThunk;
}

export interface BaseMemoCreators {
  [key: string]: (state: any) => any;
}

export interface BaseState {
  [key: string]: any;
}

export interface BaseDeps {
  [key: string]: any;
}

export type ReturnTypeOfProperties<
  O extends { [key: string]: (...args: any[]) => any }
> = ReturnType<O[keyof O]>;

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
