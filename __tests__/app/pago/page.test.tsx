import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import PagoPage from '@/app/pago/page';

// Mock de los iconos de Lucide React
jest.mock('lucide-react', () => ({
  CreditCard: () => <span data-testid="credit-card-icon">💳</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
}));

// Mock de next/navigation
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock de setTimeout para evitar timeouts en tests
jest.useFakeTimers();

describe('PagoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock de alert global
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renderiza la página de pago correctamente', () => {
    render(<PagoPage />);

    expect(screen.getByText('Procesar Pago')).toBeInTheDocument();
    expect(
      screen.getByText('Selecciona tu método de pago preferido')
    ).toBeInTheDocument();
    expect(screen.getByText('Plan Premium - 1 mes')).toBeInTheDocument();
    expect(screen.getByText('$1499 ARS')).toBeInTheDocument();
  });

  it('muestra los métodos de pago disponibles', () => {
    render(<PagoPage />);

    expect(
      screen.getByText('💳 Pagar con Tarjeta de Crédito')
    ).toBeInTheDocument();
    expect(screen.getByText('🔵 Pagar con MercadoPago')).toBeInTheDocument();
  });

  it('muestra el botón de volver', () => {
    render(<PagoPage />);

    expect(screen.getByText('Volver a Planes')).toBeInTheDocument();
  });

  it('muestra el botón de cancelar', () => {
    render(<PagoPage />);

    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('maneja el pago con MercadoPago correctamente', async () => {
    render(<PagoPage />);

    const mercadopagoButton = screen.getByText('🔵 Pagar con MercadoPago');

    await act(async () => {
      fireEvent.click(mercadopagoButton);
    });

    expect(global.alert).toHaveBeenCalledWith(
      'Procesando pago con MercadoPago...'
    );

    // Avanzar el tiempo para simular el setTimeout
    act(() => {
      jest.runAllTimers();
    });

    expect(global.alert).toHaveBeenCalledWith(
      '¡Pago procesado exitosamente! Ahora tienes acceso Premium.'
    );
    expect(mockPush).toHaveBeenCalledWith('/?payment=success');
  });

  it('maneja el pago con tarjeta correctamente', async () => {
    render(<PagoPage />);

    const cardButton = screen.getByText('💳 Pagar con Tarjeta de Crédito');

    await act(async () => {
      fireEvent.click(cardButton);
    });

    // Debería mostrar el formulario de tarjeta
    expect(screen.getByText('Datos de Tarjeta')).toBeInTheDocument();
    expect(
      screen.getByText('Ingresa los datos de tu tarjeta de crédito')
    ).toBeInTheDocument();
  });

  it('maneja el botón de volver correctamente', async () => {
    render(<PagoPage />);

    const backButton = screen.getByText('Volver a Planes');

    await act(async () => {
      fireEvent.click(backButton);
    });

    expect(mockBack).toHaveBeenCalled();
  });

  it('maneja el botón de cancelar correctamente', async () => {
    render(<PagoPage />);

    const cancelButton = screen.getByText('Cancelar');

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(mockBack).toHaveBeenCalled();
  });
});
