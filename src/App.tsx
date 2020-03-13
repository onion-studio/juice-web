import React from 'react'
import { HashRouter } from 'react-router-dom'
import { SelectStagePage } from './pages/SelectStagePage'

const App: React.FC = () => {
  return (
    <HashRouter>
      <div
        style={{
          maxWidth: 400,
          minHeight: 700,
          margin: '0 auto',
          backgroundColor: 'white',
        }}
      >
        <SelectStagePage />
      </div>
    </HashRouter>
  )
}

export default App
