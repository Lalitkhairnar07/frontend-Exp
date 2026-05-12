import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import AppRoutes from './router/AppRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes></AppRoutes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
