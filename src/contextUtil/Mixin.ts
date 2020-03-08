import { BaseActionCreators, BaseState, ReturnTypeOfProperties } from './base';
import { Draft } from 'immer';

export abstract class Mixin<
  AdditionalStateType extends BaseState,
  ActionCreatorsType extends BaseActionCreators,
  ProducerType extends Function = (
    draft: Draft<AdditionalStateType>,
    action: ReturnTypeOfProperties<ActionCreatorsType>,
  ) => void
> {
  readonly AdditionalStateType!: AdditionalStateType;
  readonly ActionCreatorsType!: ActionCreatorsType;

  abstract initialPart(): AdditionalStateType;

  abstract actionCreators(): ActionCreatorsType;

  abstract producer(): ProducerType;
}
