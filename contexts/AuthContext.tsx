"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType } from "@/types"
import { mockUsers } from "@/data/mockData"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)

  useEffect(() => {
    // Cargar usuario desde localStorage al iniciar
    const savedUser = localStorage.getItem("patoapp_user")
    const savedUsers = localStorage.getItem("patoapp_users")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      localStorage.setItem("patoapp_users", JSON.stringify(mockUsers))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find((u) => u.email === email && u.contraseña === password)

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("patoapp_user", JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const register = async (userData: Omit<User, "id" | "fechaRegistro" | "rol" | "plan">): Promise<boolean> => {
    // Verificar si el email o usuario ya existen
    const emailExists = users.some((u) => u.email === userData.email)
    const userExists = users.some((u) => u.usuario === userData.usuario)

    if (emailExists || userExists) {
      return false
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      fechaRegistro: new Date().toISOString().split("T")[0],
      rol: "user",
      plan: "gratuito",
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("patoapp_users", JSON.stringify(updatedUsers))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("patoapp_user")
  }

  const updateUserPlan = (plan: "gratuito" | "pago") => {
    if (user) {
      const updatedUser = { ...user, plan }
      setUser(updatedUser)
      localStorage.setItem("patoapp_user", JSON.stringify(updatedUser))

      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      setUsers(updatedUsers)
      localStorage.setItem("patoapp_users", JSON.stringify(updatedUsers))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserPlan }}>{children}</AuthContext.Provider>
  )
}
