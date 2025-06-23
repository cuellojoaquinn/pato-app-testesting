import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { mockUsers } from '@/data/mockData'
import type { User } from '@/types'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Test component to access context
const TestComponent: React.FC = () => {
  const { user, login, register, logout, updateUserPlan } = useAuth()
  
  return (
    <div>
      <div data-testid="user-info">
        {user ? `${user.nombre} ${user.rol}` : 'No user'}
      </div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={() => register({
        nombre: 'Test',
        apellido: 'User',
        email: 'new@example.com',
        usuario: 'testuser',
        contraseña: 'password'
      })}>
        Register
      </button>
      <button onClick={logout}>
        Logout
      </button>
      <button onClick={() => updateUserPlan('pago')}>
        Update Plan
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
  })

  describe('Initial State', () => {
    it('should start with no user when localStorage is empty', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user')
    })

    it('should load user from localStorage on mount', () => {
      const savedUser = mockUsers[0]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedUser))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(screen.getByTestId('user-info')).toHaveTextContent('Juan admin')
    })

    it('should load users from localStorage on mount', () => {
      const savedUsers = [mockUsers[0]]
      localStorageMock.getItem
        .mockReturnValueOnce(null) // user
        .mockReturnValueOnce(JSON.stringify(savedUsers)) // users

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(localStorageMock.getItem).toHaveBeenCalledWith('patoapp_users')
    })

    it('should initialize with mock users when localStorage is empty', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_users',
        JSON.stringify(mockUsers)
      )
    })
  })

  describe('Login', () => {
    it('should login successfully with valid credentials', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      loginButton.click()

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_user',
        JSON.stringify(mockUsers[0])
      )
    })

    it('should not login with invalid credentials', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const loginButton = screen.getByText('Login')
      loginButton.click()

      // Should not set user in localStorage for invalid credentials
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        'patoapp_user',
        expect.any(String)
      )
    })
  })

  describe('Register', () => {
    it('should register successfully with new user data', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const registerButton = screen.getByText('Register')
      registerButton.click()

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_users',
        expect.stringContaining('new@example.com')
      )
    })

    it('should not register with existing email', () => {
      // Mock existing user with same email
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      const registerButton = screen.getByText('Register')
      registerButton.click()

      // Should not add duplicate user
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        'patoapp_users',
        expect.stringContaining('juan@example.com')
      )
    })
  })

  describe('Logout', () => {
    it('should logout and clear user data', () => {
      // Start with logged in user
      const savedUser = mockUsers[0]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedUser))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Verify user is logged in
      expect(screen.getByTestId('user-info')).toHaveTextContent('Juan admin')

      // Logout
      const logoutButton = screen.getByText('Logout')
      logoutButton.click()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('patoapp_user')
    })
  })

  describe('Update User Plan', () => {
    it('should update user plan successfully', () => {
      // Start with logged in user
      const savedUser = mockUsers[0]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedUser))

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Update plan
      const updatePlanButton = screen.getByText('Update Plan')
      updatePlanButton.click()

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_user',
        JSON.stringify({ ...savedUser, plan: 'pago' })
      )

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_users',
        expect.stringContaining('"plan":"pago"')
      )
    })

    it('should not update plan when no user is logged in', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )

      // Try to update plan without user
      const updatePlanButton = screen.getByText('Update Plan')
      updatePlanButton.click()

      expect(localStorageMock.setItem).not.toHaveBeenCalledWith(
        'patoapp_user',
        expect.any(String)
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      expect(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      }).not.toThrow()
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')

      expect(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      }).not.toThrow()
    })

    it('should handle null values in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)

      expect(() => {
        render(
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        )
      }).not.toThrow()
    })
  })

  describe('useAuth Hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow('useAuth must be used within an AuthProvider')

      consoleSpy.mockRestore()
    })
  })
}) 