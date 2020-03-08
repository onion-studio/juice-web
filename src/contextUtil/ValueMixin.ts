import { Mixin } from './Mixin';
import { BaseAction, BaseState } from './base';
import { Draft } from 'immer';

type ValueState<Name extends string, Value> = {
  [K in Name]: Value;
};

type ValueAction<Name extends string, Value> = {
  type: Name;
  value: Value;
};

type ValueActionCreatorMap<Name extends string, Value> = {
  [K in Name]: (value: Value) => ValueAction<Name, Value>;
};

class ValueHelper<Value> {
  constructor(readonly defaultValue: Value) {}
}

export class ValueMixin<
  Name extends string,
  Value,
  ActionName extends string = Name
> extends Mixin<
  ValueState<Name, Value>,
  ValueActionCreatorMap<ActionName, Value>
> {
  constructor(
    readonly name: Name,
    readonly valueHelper: ValueHelper<Value>,
    readonly actionName?: ActionName,
  ) {
    super();
  }

  get actualActionName() {
    return (this.actionName || this.name) as ActionName;
  }

  initialPart() {
    return {
      [this.name]: this.valueHelper.defaultValue,
    } as ValueState<Name, Value>;
  }

  actionCreators() {
    return {
      [this.actualActionName]: createValueActionCreator(this.actualActionName),
    } as ValueActionCreatorMap<ActionName, Value>;
  }

  producer() {
    return createValueProducer(this.name, this.actionName || this.name);
  }

  static value<V>(defaultValue: V) {
    return new ValueHelper<V>(defaultValue);
  }
}

function createValueActionCreator<ActionName extends string, Value>(
  actionName: ActionName,
) {
  function valueActionCreator(value: Value) {
    return {
      type: actionName,
      value,
    };
  }

  return valueActionCreator;
}

function createValueProducer<
  PropName extends string,
  ActionName extends string,
  Value,
  State extends BaseState,
  Action extends BaseAction
>(propName: PropName, actionName: ActionName) {
  return (draft: Draft<State>, action: Action) => {
    if (action.type === actionName) {
      const valueAction = (action as unknown) as ValueAction<ActionName, Value>;
      Object.assign(draft, { [propName]: valueAction.value });
    }
  };
}
