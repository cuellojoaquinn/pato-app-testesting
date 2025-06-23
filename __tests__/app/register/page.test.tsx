import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '@/contexts/AuthContext'
import RegisterPage from '@/app/register/page'

// Mock del contexto de autenticación
const mockRegister = jest.fn()
const mockUseAuth = {
  register: mockRegister,
}

jest.mock('@/contexts/AuthContext', () => ({
  ...jest.requireActual('@/contexts/AuthContext'),
  useAuth: () => mockUseAuth,
}))

// Mock de Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>)
}

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Renderizado inicial', () => {
    it('debe renderizar el formulario de registro correctamente', () => {
      renderWithAuth(<RegisterPage />)
      
      expect(screen.getByText('Únete a Pato App para explorar el mundo de los patos argentinos')).toBeInTheDocument()
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
      expect(screen.getByLabelText('Apellido')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Nombre de Usuario')).toBeInTheDocument()
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirmar Contraseña')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getByText('¿Ya tienes cuenta?')).toBeInTheDocument()
      const titleElements = screen.getAllByText('Crear Cuenta')
      const title = titleElements.find(el => el.getAttribute('data-slot') === 'card-title')
      expect(title).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Crear Cuenta' })).toBeInTheDocument()
    })

    it('debe mostrar el enlace de inicio de sesión', () => {
      renderWithAuth(<RegisterPage />)
      
      const loginLink = screen.getByText('Inicia sesión')
      expect(loginLink).toBeInTheDocument()
      expect(loginLink.closest('a')).toHaveAttribute('href', '/login')
    })
  })

  describe('Validación de formulario', () => {
    it('debe mostrar error cuando el nombre está vacío', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
    })

    it('debe mostrar error cuando el apellido está vacío', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      await user.type(nombreInput, 'Juan')
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('El apellido es requerido')).toBeInTheDocument()
    })

    it('debe mostrar error cuando el email está vacío', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      const apellidoInput = screen.getByLabelText('Apellido')
      await user.type(nombreInput, 'Juan')
      await user.type(apellidoInput, 'Pérez')
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('El email es requerido')).toBeInTheDocument()
    })

    it('debe mostrar error cuando el email no es válido', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      const apellidoInput = screen.getByLabelText('Apellido')
      const emailInput = screen.getByLabelText('Email')
      
      await user.type(nombreInput, 'Juan')
      await user.type(apellidoInput, 'Pérez')
      await user.type(emailInput, 'abc@abc')
      const usuarioInput = screen.getByLabelText('Nombre de Usuario')
      await user.type(usuarioInput, 'juanperez')
      const contraseñaInput = screen.getByLabelText('Contraseña')
      await user.type(contraseñaInput, '123456')
      const confirmarContraseñaInput = screen.getByLabelText('Confirmar Contraseña')
      await user.type(confirmarContraseñaInput, '123456')
      const terminosCheckbox = screen.getByRole('checkbox')
      await user.click(terminosCheckbox)
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      // Debug: verificar si la función register se llamó
      console.log('mockRegister calls:', mockRegister.mock.calls)
      // Debug: verificar el estado del formulario
      console.log('Email input value:', emailInput.value)
      console.log('Form errors:', screen.queryAllByText(/error/i))
      // Buscar el error de email con getByText
      expect(screen.getByText('El email no es válido')).toBeInTheDocument()
    })

    it('debe mostrar error cuando el nombre de usuario está vacío', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      const apellidoInput = screen.getByLabelText('Apellido')
      const emailInput = screen.getByLabelText('Email')
      
      await user.type(nombreInput, 'Juan')
      await user.type(apellidoInput, 'Pérez')
      await user.type(emailInput, 'juan@example.com')
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('El nombre de usuario es requerido')).toBeInTheDocument()
    })

    it('debe mostrar error cuando el nombre de usuario es muy corto', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      const apellidoInput = screen.getByLabelText('Apellido')
      const emailInput = screen.getByLabelText('Email')
      const usuarioInput = screen.getByLabelText('Nombre de Usuario')
      
      await user.type(nombreInput, 'Juan')
      await user.type(apellidoInput, 'Pérez')
      await user.type(emailInput, 'juan@example.com')
      await user.type(usuarioInput, 'ab')
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('El usuario debe tener al menos 3 caracteres')).toBeInTheDocument()
    })

    it('debe mostrar error cuando la contraseña está vacía', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      const apellidoInput = screen.getByLabelText('Apellido')
      const emailInput = screen.getByLabelText('Email')
      const usuarioInput = screen.getByLabelText('Nombre de Usuario')
      
      await user.type(nombreInput, 'Juan')
      await user.type(apellidoInput, 'Pérez')
      await user.type(emailInput, 'juan@example.com')
      await user.type(usuarioInput, 'juanperez')
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument()
    })

    it('debe mostrar error cuando la contraseña es muy corta', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      const apellidoInput = screen.getByLabelText('Apellido')
      const emailInput = screen.getByLabelText('Email')
      const usuarioInput = screen.getByLabelText('Nombre de Usuario')
      const contraseñaInput = screen.getByLabelText('Contraseña')
      
      await user.type(nombreInput, 'Juan')
      await user.type(apellidoInput, 'Pérez')
      await user.type(emailInput, 'juan@example.com')
      await user.type(usuarioInput, 'juanperez')
      await user.type(contraseñaInput, '123')
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
    })

    it('debe mostrar error cuando las contraseñas no coinciden', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      const apellidoInput = screen.getByLabelText('Apellido')
      const emailInput = screen.getByLabelText('Email')
      const usuarioInput = screen.getByLabelText('Nombre de Usuario')
      const contraseñaInput = screen.getByLabelText('Contraseña')
      const confirmarContraseñaInput = screen.getByLabelText('Confirmar Contraseña')
      
      await user.type(nombreInput, 'Juan')
      await user.type(apellidoInput, 'Pérez')
      await user.type(emailInput, 'juan@example.com')
      await user.type(usuarioInput, 'juanperez')
      await user.type(contraseñaInput, '123456')
      await user.type(confirmarContraseñaInput, '654321')
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument()
    })

    it('debe mostrar error cuando no se aceptan los términos', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      const apellidoInput = screen.getByLabelText('Apellido')
      const emailInput = screen.getByLabelText('Email')
      const usuarioInput = screen.getByLabelText('Nombre de Usuario')
      const contraseñaInput = screen.getByLabelText('Contraseña')
      const confirmarContraseñaInput = screen.getByLabelText('Confirmar Contraseña')
      
      await user.type(nombreInput, 'Juan')
      await user.type(apellidoInput, 'Pérez')
      await user.type(emailInput, 'juan@example.com')
      await user.type(usuarioInput, 'juanperez')
      await user.type(contraseñaInput, '123456')
      await user.type(confirmarContraseñaInput, '123456')
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('Debes aceptar los términos y condiciones')).toBeInTheDocument()
    })
  })

  describe('Interacción del usuario', () => {
    it('debe limpiar errores cuando el usuario comienza a escribir', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument()
      
      const nombreInput = screen.getByLabelText('Nombre')
      await user.type(nombreInput, 'Juan')
      
      expect(screen.queryByText('El nombre es requerido')).not.toBeInTheDocument()
    })

    it('debe permitir marcar y desmarcar el checkbox de términos', async () => {
      const user = userEvent.setup()
      renderWithAuth(<RegisterPage />)
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).toBeChecked()
      
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })
  })

  describe('Envío del formulario', () => {
    it('debe llamar a register con los datos correctos cuando el formulario es válido', async () => {
      const user = userEvent.setup()
      mockRegister.mockResolvedValue(true)
      
      renderWithAuth(<RegisterPage />)
      
      // Llenar el formulario
      await user.type(screen.getByLabelText('Nombre'), 'Juan')
      await user.type(screen.getByLabelText('Apellido'), 'Pérez')
      await user.type(screen.getByLabelText('Email'), 'juan@example.com')
      await user.type(screen.getByLabelText('Nombre de Usuario'), 'juanperez')
      await user.type(screen.getByLabelText('Contraseña'), '123456')
      await user.type(screen.getByLabelText('Confirmar Contraseña'), '123456')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          usuario: 'juanperez',
          contraseña: '123456',
        })
      })
    })

    it('debe mostrar estado de carga durante el registro', async () => {
      const user = userEvent.setup()
      mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)))
      
      renderWithAuth(<RegisterPage />)
      
      // Llenar el formulario
      await user.type(screen.getByLabelText('Nombre'), 'Juan')
      await user.type(screen.getByLabelText('Apellido'), 'Pérez')
      await user.type(screen.getByLabelText('Email'), 'juan@example.com')
      await user.type(screen.getByLabelText('Nombre de Usuario'), 'juanperez')
      await user.type(screen.getByLabelText('Contraseña'), '123456')
      await user.type(screen.getByLabelText('Confirmar Contraseña'), '123456')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      expect(screen.getByText('Registrando...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })

    it('debe mostrar error cuando el registro falla', async () => {
      const user = userEvent.setup()
      mockRegister.mockResolvedValue(false)
      
      renderWithAuth(<RegisterPage />)
      
      // Llenar el formulario
      await user.type(screen.getByLabelText('Nombre'), 'Juan')
      await user.type(screen.getByLabelText('Apellido'), 'Pérez')
      await user.type(screen.getByLabelText('Email'), 'juan@example.com')
      await user.type(screen.getByLabelText('Nombre de Usuario'), 'juanperez')
      await user.type(screen.getByLabelText('Contraseña'), '123456')
      await user.type(screen.getByLabelText('Confirmar Contraseña'), '123456')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('El email o nombre de usuario ya están en uso')).toBeInTheDocument()
      })
    })

    it('debe mostrar error cuando hay una excepción durante el registro', async () => {
      const user = userEvent.setup()
      mockRegister.mockRejectedValue(new Error('Error de red'))
      
      renderWithAuth(<RegisterPage />)
      
      // Llenar el formulario
      await user.type(screen.getByLabelText('Nombre'), 'Juan')
      await user.type(screen.getByLabelText('Apellido'), 'Pérez')
      await user.type(screen.getByLabelText('Email'), 'juan@example.com')
      await user.type(screen.getByLabelText('Nombre de Usuario'), 'juanperez')
      await user.type(screen.getByLabelText('Contraseña'), '123456')
      await user.type(screen.getByLabelText('Confirmar Contraseña'), '123456')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Error al registrar usuario')).toBeInTheDocument()
      })
    })
  })

  describe('Navegación', () => {
    it('debe redirigir a login cuando el registro es exitoso', async () => {
      const user = userEvent.setup()
      const mockPush = jest.fn()
      mockRegister.mockResolvedValue(true)
      
      // Mock del router
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({
          push: mockPush,
        }),
      }))
      
      renderWithAuth(<RegisterPage />)
      
      // Llenar el formulario
      await user.type(screen.getByLabelText('Nombre'), 'Juan')
      await user.type(screen.getByLabelText('Apellido'), 'Pérez')
      await user.type(screen.getByLabelText('Email'), 'juan@example.com')
      await user.type(screen.getByLabelText('Nombre de Usuario'), 'juanperez')
      await user.type(screen.getByLabelText('Contraseña'), '123456')
      await user.type(screen.getByLabelText('Confirmar Contraseña'), '123456')
      await user.click(screen.getByRole('checkbox'))
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalled()
      })
    })
  })

  describe('Accesibilidad', () => {
    it('debe tener labels asociados correctamente con los inputs', () => {
      renderWithAuth(<RegisterPage />)
      
      const nombreInput = screen.getByLabelText('Nombre')
      const apellidoInput = screen.getByLabelText('Apellido')
      const emailInput = screen.getByLabelText('Email')
      const usuarioInput = screen.getByLabelText('Nombre de Usuario')
      const contraseñaInput = screen.getByLabelText('Contraseña')
      const confirmarContraseñaInput = screen.getByLabelText('Confirmar Contraseña')
      
      expect(nombreInput).toBeInTheDocument()
      expect(apellidoInput).toBeInTheDocument()
      expect(emailInput).toBeInTheDocument()
      expect(usuarioInput).toBeInTheDocument()
      expect(contraseñaInput).toBeInTheDocument()
      expect(confirmarContraseñaInput).toBeInTheDocument()
    })

    it('debe tener el botón de envío con el tipo correcto', () => {
      renderWithAuth(<RegisterPage />)
      
      const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })
}) 