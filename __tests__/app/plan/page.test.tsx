import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlanPage from '@/app/plan/page'
import { AuthProvider } from '@/contexts/AuthContext'
import type { User } from '@/types'

// Mock del componente PaymentMethod
jest.mock('@/app/pago/page', () => {
  return function MockPaymentMethod({ selectedPlan, onPaymentSuccess, onBack }: any) {
    return (
      <div data-testid="payment-method">
        <h2>Método de Pago</h2>
        <p>Plan: {selectedPlan?.duration}</p>
        <p>Precio: ${selectedPlan?.price}</p>
        <button onClick={onPaymentSuccess} data-testid="payment-success">
          Simular Pago Exitoso
        </button>
        <button onClick={onBack} data-testid="payment-back">
          Volver
        </button>
      </div>
    )
  }
})

// Mock de los iconos de Lucide React
jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
  Crown: () => <span data-testid="crown-icon">👑</span>,
  Star: () => <span data-testid="star-icon">⭐</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
}))

const renderWithAuth = (user: User | null = null) => {
  return render(
    <AuthProvider>
      <PlanPage />
    </AuthProvider>
  )
}

const mockUseAuth = jest.fn()
jest.mock('@/contexts/AuthContext', () => ({
  ...jest.requireActual('@/contexts/AuthContext'),
  useAuth: () => mockUseAuth(),
}))

describe('PlanPage (pruebas esenciales)', () => {
  const mockUser: User = {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    usuario: 'juanperez',
    contraseña: 'password123',
    rol: 'user',
    plan: 'gratuito',
    fechaRegistro: '2024-01-01',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería volver a la vista principal al hacer clic en "Volver a Planes"', async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      user: mockUser,
      updateUserPlan: jest.fn(),
    })
    renderWithAuth(mockUser)
    
    // Ir a las opciones de plan
    const upgradeButton = screen.getByText('Actualizar a Premium')
    await user.click(upgradeButton)
    
    // Verificar que estamos en la vista de opciones de plan
    expect(screen.getByText('Elige tu Plan Premium')).toBeInTheDocument()
    
    // Hacer clic en "Volver a Planes"
    const backButton = screen.getByText('Volver a Planes')
    await user.click(backButton)
    
    // Verificar que volvimos a la vista principal
    expect(screen.getByText('Mi Plan')).toBeInTheDocument()
    expect(screen.queryByText('Elige tu Plan Premium')).not.toBeInTheDocument()
  })

  it('debería mostrar las opciones de plan al hacer clic en actualizar', async () => {
    const user = userEvent.setup()
    mockUseAuth.mockReturnValue({
      user: mockUser,
      updateUserPlan: jest.fn(),
    })
    renderWithAuth(mockUser)
    const upgradeButton = screen.getByText('Actualizar a Premium')
    await user.click(upgradeButton)
    expect(screen.getByText('Elige tu Plan Premium')).toBeInTheDocument()
    expect(screen.getByText('Plan Mensual')).toBeInTheDocument()
    expect(screen.getByText('Plan Semestral')).toBeInTheDocument()
    expect(screen.getByText('Plan Anual')).toBeInTheDocument()
  })

  it('debería actualizar el plan del usuario al completar el pago exitosamente', async () => {
    const user = userEvent.setup()
    const mockUpdateUserPlan = jest.fn()
    mockUseAuth.mockReturnValue({
      user: mockUser,
      updateUserPlan: mockUpdateUserPlan,
    })
    renderWithAuth(mockUser)
    const upgradeButton = screen.getByText('Actualizar a Premium')
    await user.click(upgradeButton)
    const monthlyPlanButton = screen.getByText('Seleccionar Plan Mensual')
    await user.click(monthlyPlanButton)
    const paymentSuccessButton = screen.getByTestId('payment-success')
    await user.click(paymentSuccessButton)
    expect(mockUpdateUserPlan).toHaveBeenCalledWith('pago')
  })
}) 