import { createContext, useState, useEffect, type ReactNode } from 'react'
import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'
import type { JwtUser, LoginDto, RegisterDto } from '../types'

interface AuthContextType {
  user: JwtUser | null
  token: string | null
  isLoading: boolean
  login: (dto: LoginDto) => Promise<void>
  register: (dto: RegisterDto) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    api.get(ENDPOINTS.AUTH.ME)
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const login = async (dto: LoginDto) => {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, dto)
    localStorage.setItem('token', data.accessToken)
    setToken(data.accessToken)
    setUser(data.user)
  }

  const register = async (dto: RegisterDto) => {
    await api.post(ENDPOINTS.AUTH.REGISTER, dto)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
