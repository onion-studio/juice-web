import React, { Component } from 'react'

class CardEventManager extends EventTarget {
  select() {
    this.dispatchEvent(new Event('select'))
  }

  discard() {
    this.dispatchEvent(new Event('discard'))
  }

  onSelect(cb: () => void) {
    this.addEventListener('select', cb)
    return () => {
      this.removeEventListener('select', cb)
    }
  }

  onDiscard(cb: () => void) {
    this.addEventListener('discard', cb)
    return () => {
      this.removeEventListener('discard', cb)
    }
  }
}

export const CardEventContext = React.createContext<CardEventManager>(
  null as any,
)

export class CardEventProvider extends Component {
  manager = new CardEventManager()

  render() {
    return (
      <CardEventContext.Provider value={this.manager}>
        {this.props.children}
      </CardEventContext.Provider>
    )
  }
}
