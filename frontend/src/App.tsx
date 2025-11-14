import { Route, Routes } from 'react-router-dom'
import { routes } from '../constants/routes'
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
            {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component/>}
                />
            ))}
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
