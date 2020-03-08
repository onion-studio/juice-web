import React, { useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { SelectStagePage } from './pages/SelectStagePage'

const App: React.FC = () => {
  return (
    <HashRouter>
      <SelectStagePage />
    </HashRouter>
  )
}

export default App
