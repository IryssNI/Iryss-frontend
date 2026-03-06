import { createContext, useContext, useState } from 'react'
import { setToken, clearToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [practice, setPractice] = useState(null)

  function login(token, practiceData) {
    setToken(token)
    setPractice(practiceData)
  }

  function logout() {
    clearToken()
    setPractice(null)
  }

  return (
    <AuthContext.Provider value={{ practice, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
