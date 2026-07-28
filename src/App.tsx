import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { useAuthSession } from '@/hooks/useAuthSession'
import { Home } from '@/pages/Home'
import { Interview } from '@/pages/Interview'
import { Login } from '@/pages/Login'
import { Result } from '@/pages/Result'
import { SignUp } from '@/pages/SignUp'

export function App() {
  useAuthSession()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/result" element={<Result />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
