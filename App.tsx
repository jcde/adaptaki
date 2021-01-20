import React, { useState, useEffect } from 'react'
import AppPersisted from './AppPersisted'
import Adaptaki from './components/Adaptaki'

const App = () => {
  return (
    <AppPersisted>
      <Adaptaki />
    </AppPersisted>
  )
}

export default App