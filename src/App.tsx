import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { RequireAuth } from '@/components/RequireAuth'
import { useAuthSession } from '@/hooks/useAuthSession'
import { useProfileSession } from '@/hooks/useProfileSession'
import { Dashboard } from '@/pages/Dashboard'
import { Home } from '@/pages/Home'
import { Interview } from '@/pages/Interview'
import { Login } from '@/pages/Login'
import { Onboarding } from '@/pages/Onboarding'
import { Result } from '@/pages/Result'
import { SignUp } from '@/pages/SignUp'

export function App() {
  useAuthSession()
  useProfileSession()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/result" element={<Result />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/onboarding"
          element={
            <RequireAuth>
              <Onboarding />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
