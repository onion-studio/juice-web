import React, { useContext } from 'react'

let idSeq = 0

interface ToastItem {
  id: number
  message: string
}
interface Deps {}
interface ContextValue {
  toasts: ToastItem[]
  action: {
    pushMessage: (message: string, timeout?: number) => void
  }
}

const ToasterContext = React.createContext<ContextValue>(null as any)

export class ToasterProvider extends React.Component<Deps, ContextValue> {
  constructor(props: Deps) {
    super(props)

    this.state = {
      toasts: [],
      action: {
        pushMessage: this.pushMessage,
      },
    }
    ;(window as any).toaster = this
  }

  pushMessage = (message: string, timeout: number = 3000) => {
    const id = idSeq++
    this.setState({
      toasts: [
        ...this.state.toasts,
        {
          id,
          message,
        },
      ],
    })
    setTimeout(() => {
      this.setState({
        toasts: this.state.toasts.filter(t => t.id !== id),
      })
    }, timeout)
  }

  render() {
    return (
      <ToasterContext.Provider value={this.state}>
        {this.props.children}
      </ToasterContext.Provider>
    )
  }
}

export const useToaster = () => useContext(ToasterContext)
