import React, { useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { SelectStagePage } from './pages/SelectStagePage'

const App: React.FC = () => {
  return (
    <HashRouter>
      <div
        style={{
          width: 400,
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
