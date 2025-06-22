import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaymentMethod from '@/app/pago/page'

// Mock de los iconos de Lucide React
jest.mock('lucide-react', () => ({
  CreditCard: () => <span data-testid="credit-card-icon">💳</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
}))

// Mock de alert para evitar que aparezcan durante los tests
global.alert = jest.fn()

describe('PaymentMethod (pruebas esenciales)', () => {
  const mockSelectedPlan = {
    duration: "1 mes",
    price: 1499,
    originalPrice: 1499,
    savings: 0
  }

  const mockOnPaymentSuccess = jest.fn()
  const mockOnBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debería mostrar la información del plan y métodos de pago', () => {
    render(
      <PaymentMethod
        selectedPlan={mockSelectedPlan}
        onPaymentSuccess={mockOnPaymentSuccess}
        onBack={mockOnBack}
      />
    )

    // Verificar información del plan
    expect(screen.getByText('Plan Premium - 1 mes')).toBeInTheDocument()
    expect(screen.getByText('$1499 ARS')).toBeInTheDocument()
    
    // Verificar métodos de pago disponibles
    expect(screen.getByText('💳 Pagar con Tarjeta de Crédito')).toBeInTheDocument()
    expect(screen.getByText('🔵 Pagar con MercadoPago')).toBeInTheDocument()
    
    // Verificar botones de navegación
    expect(screen.getByText('Volver a Planes')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('debería mostrar alert de procesamiento al hacer clic en MercadoPago', async () => {
    const user = userEvent.setup()
    
    render(
      <PaymentMethod
        selectedPlan={mockSelectedPlan}
        onPaymentSuccess={mockOnPaymentSuccess}
        onBack={mockOnBack}
      />
    )

    // Hacer clic en pagar con MercadoPago
    const mercadopagoButton = screen.getByText('🔵 Pagar con MercadoPago')
    await user.click(mercadopagoButton)

    // Verificar que se muestra el alert de procesamiento
    expect(global.alert).toHaveBeenCalledWith('Procesando pago con MercadoPago...')
  })

  it('debería mostrar errores de validación si se intenta pagar sin completar campos', async () => {
    const user = userEvent.setup()
    
    render(
      <PaymentMethod
        selectedPlan={mockSelectedPlan}
        onPaymentSuccess={mockOnPaymentSuccess}
        onBack={mockOnBack}
      />
    )

    // Hacer clic en pagar con tarjeta para mostrar el formulario
    const cardButton = screen.getByText('💳 Pagar con Tarjeta de Crédito')
    await user.click(cardButton)

    // Verificar que se muestra el formulario de tarjeta
    expect(screen.getByText('Datos de Tarjeta')).toBeInTheDocument()

    // Intentar enviar el formulario sin completar ningún campo
    const submitButton = screen.getByText('💳 Pagar $1499 ARS')
    await user.click(submitButton)

    // Verificar que se muestran los errores de validación para todos los campos
    const errorMessages = screen.getAllByText('Este campo es obligatorio')
    expect(errorMessages).toHaveLength(4)
    
    // Verificar que no se llama a onPaymentSuccess porque hay errores
    expect(mockOnPaymentSuccess).not.toHaveBeenCalled()
  })
}) 