
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'

function App() {
  return (
    <>
      <div className='min-h-screen flex flex-col items-center justify-center'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<div className='min-h-screen'>Page Not Found</div>} />
        </Routes>
      </div>
    </>
  )
}

export default App
