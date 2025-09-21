import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import LoginPage from '../../../app/login/page';

// --- MOCKS DE DEPENDENCIAS ---
// Simula el hook useSearchParams de next/navigation para controlar parámetros de URL
const mockGet = jest.fn();
// Creamos un mock para router.push y lo usamos en el mock de useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush, // Ahora podemos verificar si se llamó a push
  }),
  useSearchParams: () => ({
    get: mockGet, // Permite controlar el valor de los parámetros de búsqueda
  }),
}));

// Simula el contexto de autenticación para controlar el login y el usuario
const mockLogin = jest.fn();
const mockUser = null;
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin, // Permite controlar el resultado de login
    user: mockUser,
  }),
}));

// Agrupa todos los tests relacionados con LoginPage
describe('LoginPage', () => {
  // Limpia el historial de mocks antes de cada test para evitar interferencias
  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockImplementation(() => null); // Valor por defecto para los parámetros de búsqueda
  });

  // Caso de prueba: Verificar el comportamiento de inicio de sesión exitoso
  it('calls login and redirects on success', async () => {
    mockLogin.mockResolvedValueOnce(true); // Simula login exitoso
    // Renderiza el componente LoginPage
    const { getByLabelText, getByRole } = render(<LoginPage />);

    // Simula ingreso de email y contraseña
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'juan@example.com' },
    });
    fireEvent.change(getByLabelText(/contraseña/i), {
      target: { value: '123456' },
    });
    // Simula click en el botón de iniciar sesión
    fireEvent.click(getByRole('button', { name: /iniciar sesión/i }));

    // Espera a que login haya sido llamado con los datos correctos
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('juan@example.com', '123456');
      // Verificamos que router.push("/") fue llamado tras login exitoso
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  // Caso de prueba: muestra estado de carga mientras se envía el formulario
  it('shows loading state while submitting', async () => {
    let resolveLogin: ((value: boolean) => void) | undefined;
    // Simula login pendiente (promesa sin resolver)
    mockLogin.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveLogin = resolve;
        })
    );
    const { getByLabelText, getByRole } = render(<LoginPage />);

    // Simula ingreso de email y contraseña
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: 'juan@example.com' },
    });
    fireEvent.change(getByLabelText(/contraseña/i), {
      target: { value: '123456' },
    });
    fireEvent.click(getByRole('button', { name: /iniciar sesión/i }));

    // Verifica que el botón muestre el estado de carga
    expect(getByRole('button')).toHaveTextContent(/iniciando sesión/i);
    // Resuelve la promesa de login
    if (resolveLogin) resolveLogin(true);
    // Espera a que el botón vuelva a su estado original
    await waitFor(() =>
      expect(getByRole('button')).toHaveTextContent(/iniciar sesión/i)
    );
  });

  // Caso de prueba: muestra mensaje de éxito si el parámetro registered es true
  it('shows success message if registered param is true', () => {
    // Simula que el parámetro registered es "true"
    mockGet.mockImplementation(() => 'true');
    render(<LoginPage />);
    // Verifica que se muestre el mensaje de registro exitoso
    expect(
      screen.getByText('¡Registro exitoso! Ahora puedes iniciar sesión.')
    ).toBeInTheDocument();
  });
});
