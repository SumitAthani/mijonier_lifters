import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Dashboard from '../pages/Dashboard'
import Sidebar from '../ui/Sidebar'
import NotFound from '../pages/NotFound'

function App() {
  return (
    <>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="*"
              element={<NotFound/>}
            />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
