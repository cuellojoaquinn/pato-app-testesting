import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import PlanPage from '@/app/plan/page';
import type { User } from '@/types';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock del componente PaymentMethod
jest.mock('@/components/PaymentMethod', () => {
  return function MockPaymentMethod({
    selectedPlan,
    onPaymentSuccess,
    onBack,
  }: any) {
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
    );
  };
});

// Mock de los iconos de Lucide React
jest.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon">✓</span>,
  Crown: () => <span data-testid="crown-icon">👑</span>,
  Star: () => <span data-testid="star-icon">⭐</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
}));

// Mock completo del contexto de autenticación
const mockUseAuth = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

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
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar el componente correctamente', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      updateUserPlan: jest.fn(),
    });

    render(<PlanPage />);

    expect(screen.getByText('Mi Plan')).toBeInTheDocument();
    expect(screen.getByText('Actualizar a Premium')).toBeInTheDocument();
  });

  it('debería mostrar las opciones de plan al hacer clic en actualizar', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      updateUserPlan: jest.fn(),
    });

    render(<PlanPage />);

    const upgradeButton = screen.getByText('Actualizar a Premium');
    await act(async () => {
      fireEvent.click(upgradeButton);
    });

    expect(screen.getByText('Elige tu Plan Premium')).toBeInTheDocument();
    expect(screen.getByText('Plan Mensual')).toBeInTheDocument();
    expect(screen.getByText('Plan Semestral')).toBeInTheDocument();
    expect(screen.getByText('Plan Anual')).toBeInTheDocument();
  });

  it('debería volver a la vista principal al hacer clic en "Volver a Planes"', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      updateUserPlan: jest.fn(),
    });

    render(<PlanPage />);

    // Ir a las opciones de plan
    const upgradeButton = screen.getByText('Actualizar a Premium');
    await act(async () => {
      fireEvent.click(upgradeButton);
    });

    // Verificar que estamos en la vista de opciones de plan
    expect(screen.getByText('Elige tu Plan Premium')).toBeInTheDocument();

    // Hacer clic en "Volver a Planes"
    const backButton = screen.getByText('Volver a Planes');
    await act(async () => {
      fireEvent.click(backButton);
    });

    // Verificar que volvimos a la vista principal
    expect(screen.getByText('Mi Plan')).toBeInTheDocument();
    expect(screen.queryByText('Elige tu Plan Premium')).not.toBeInTheDocument();
  });

  it('debería actualizar el plan del usuario al completar el pago exitosamente', async () => {
    const mockUpdateUserPlan = jest.fn();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      updateUserPlan: mockUpdateUserPlan,
    });

    render(<PlanPage />);

    const upgradeButton = screen.getByText('Actualizar a Premium');
    await act(async () => {
      fireEvent.click(upgradeButton);
    });

    const monthlyPlanButton = screen.getByText('Seleccionar Plan Mensual');
    await act(async () => {
      fireEvent.click(monthlyPlanButton);
    });

    const paymentSuccessButton = screen.getByTestId('payment-success');
    await act(async () => {
      fireEvent.click(paymentSuccessButton);
    });

    expect(mockUpdateUserPlan).toHaveBeenCalledWith('pago');
  });
});
