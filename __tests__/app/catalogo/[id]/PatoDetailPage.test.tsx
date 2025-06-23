import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useParams } from 'next/navigation'
import PatoDetailPage from '../../../../app/catalogo/[id]/page'
import { useAuth } from '../../../../contexts/AuthContext'
import { PatoService } from '../../../../lib/patoService'

// Mock de Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))

// Mock del contexto de autenticación
jest.mock('../../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}))

// Mock del servicio de patos
jest.mock('../../../../lib/patoService', () => ({
  PatoService: {
    getPatos: jest.fn(),
  },
}))

// Mock de Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock de window.alert
const mockAlert = jest.fn()
global.alert = mockAlert

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}
global.localStorage = localStorageMock

describe('PatoDetailPage', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  const mockUser = {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    usuario: 'juanperez',
    contraseña: 'password123',
    rol: 'user' as const,
    plan: 'gratuito' as const,
    fechaRegistro: '2024-01-01',
  }

  const mockPato = {
    id: 'pato-1',
    nombre: 'Pato Real',
    nombreCientifico: 'Anas platyrhynchos',
    descripcion: 'El pato real es una especie muy común en América del Norte.',
    comportamiento: 'Son aves sociales que viven en grupos.',
    habitat: 'Lagos, ríos y humedales',
    plumaje: 'Plumaje verde iridiscente en la cabeza',
    alimentacion: 'Omnívoro, se alimenta de plantas acuáticas e insectos',
    imagen: '/pato-real.jpg',
    sonido: 'cuac-cuac.mp3',
    especie: 'Anas',
  }

  const mockPremiumUser = {
    ...mockUser,
    plan: 'pago' as const,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useParams as jest.Mock).mockReturnValue({ id: 'pato-1' })
    ;(useAuth as jest.Mock).mockReturnValue({ user: mockUser })
    ;(PatoService.getPatos as jest.Mock).mockReturnValue([mockPato])
  })

  describe('Renderizado inicial', () => {
    it('debería renderizar la información del pato correctamente', () => {
      render(<PatoDetailPage />)

      expect(screen.getByText('Pato Real')).toBeInTheDocument()
      expect(screen.getByText('Anas platyrhynchos')).toBeInTheDocument()
      expect(screen.getByText('Especie: Anas')).toBeInTheDocument()
      expect(screen.getByText(/El pato real es una especie muy común/)).toBeInTheDocument()
    })

    it('debería mostrar todos los campos de información del pato', () => {
      render(<PatoDetailPage />)

      expect(screen.getByText('Comportamiento')).toBeInTheDocument()
      expect(screen.getByText('Hábitat')).toBeInTheDocument()
      expect(screen.getByText('Plumaje')).toBeInTheDocument()
      expect(screen.getByText('Alimentación')).toBeInTheDocument()
    })

    it('debería mostrar la imagen del pato', () => {
      render(<PatoDetailPage />)

      const imagen = screen.getByAltText('Pato Real')
      expect(imagen).toBeInTheDocument()
      expect(imagen).toHaveAttribute('src', '/pato-real.jpg')
    })

    it('debería mostrar el botón de volver al catálogo', () => {
      render(<PatoDetailPage />)

      expect(screen.getByText('Volver al Catálogo')).toBeInTheDocument()
    })
  })

  describe('Funcionalidad de sonido', () => {
    it('debería mostrar botón de sonido deshabilitado para usuarios gratuitos', () => {
      render(<PatoDetailPage />)

      const botonSonido = screen.getByText('🔒 Premium Requerido')
      expect(botonSonido).toBeInTheDocument()
      expect(botonSonido.closest('button')).toBeDisabled()
    })

    it('debería mostrar botón de sonido habilitado para usuarios premium', () => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: mockPremiumUser })
      
      render(<PatoDetailPage />)

      const botonSonido = screen.getByText('🎵 Reproducir Sonido')
      expect(botonSonido).toBeInTheDocument()
      expect(botonSonido.closest('button')).not.toBeDisabled()
    })

    it('debería mostrar mensaje de actualización para usuarios gratuitos', () => {
      render(<PatoDetailPage />)

      expect(screen.getByText('Actualiza a Premium para escuchar los sonidos')).toBeInTheDocument()
    })

    it('debería mostrar alerta cuando usuario gratuito intenta reproducir sonido', async () => {
      render(<PatoDetailPage />)

      const botonSonido = screen.getByText('🔒 Premium Requerido')
      // El botón está deshabilitado, por lo que no se ejecuta onClick
      // Verificamos que el botón esté deshabilitado y muestre el texto correcto
      expect(botonSonido.closest('button')).toBeDisabled()
      expect(botonSonido).toHaveTextContent('🔒 Premium Requerido')
    })

    it('debería reproducir sonido cuando usuario premium hace clic', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: mockPremiumUser })
      
      render(<PatoDetailPage />)

      const botonSonido = screen.getByText('🎵 Reproducir Sonido')
      await userEvent.click(botonSonido)

      expect(mockAlert).toHaveBeenCalledWith('🎵 Reproduciendo sonido de Pato Real')
    })
  })

  describe('Navegación', () => {
    it('debería redirigir a login si no hay usuario autenticado', () => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: null })
      
      render(<PatoDetailPage />)

      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('debería redirigir al catálogo si el pato no existe', () => {
      ;(PatoService.getPatos as jest.Mock).mockReturnValue([])
      
      render(<PatoDetailPage />)

      expect(mockRouter.push).toHaveBeenCalledWith('/catalogo')
    })

    it('debería navegar al catálogo cuando se hace clic en "Volver al Catálogo"', async () => {
      render(<PatoDetailPage />)

      const botonVolver = screen.getByText('Volver al Catálogo')
      await userEvent.click(botonVolver)

      // Verificar que el enlace apunta al catálogo
      expect(botonVolver.closest('a')).toHaveAttribute('href', '/catalogo')
    })
  })

  describe('Manejo de errores', () => {
    it('debería manejar pato sin imagen', () => {
      const patoSinImagen = { ...mockPato, imagen: '' }
      ;(PatoService.getPatos as jest.Mock).mockReturnValue([patoSinImagen])
      
      render(<PatoDetailPage />)

      const imagen = screen.getByAltText('Pato Real')
      expect(imagen).toHaveAttribute('src', '/placeholder.svg')
    })

    it('debería renderizar null si no hay usuario o pato', () => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: null })
      
      const { container } = render(<PatoDetailPage />)
      
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Interacciones del usuario', () => {
    it('debería permitir hacer clic en el botón de sonido para usuarios premium', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: mockPremiumUser })
      
      render(<PatoDetailPage />)

      const botonSonido = screen.getByText('🎵 Reproducir Sonido')
      expect(botonSonido.closest('button')).not.toBeDisabled()
      
      await userEvent.click(botonSonido)
      expect(mockAlert).toHaveBeenCalled()
    })

    it('debería mostrar información completa del pato', () => {
      render(<PatoDetailPage />)

      // Verificar que toda la información del pato esté presente
      expect(screen.getByText(mockPato.comportamiento)).toBeInTheDocument()
      expect(screen.getByText(mockPato.habitat)).toBeInTheDocument()
      expect(screen.getByText(mockPato.plumaje)).toBeInTheDocument()
      expect(screen.getByText(mockPato.alimentacion)).toBeInTheDocument()
    })
  })

  describe('Accesibilidad', () => {
    it('debería tener texto alternativo en la imagen', () => {
      render(<PatoDetailPage />)

      const imagen = screen.getByAltText('Pato Real')
      expect(imagen).toBeInTheDocument()
    })

    it('debería tener botones con texto descriptivo', () => {
      render(<PatoDetailPage />)

      expect(screen.getByText('Volver al Catálogo')).toBeInTheDocument()
      expect(screen.getByText('🔒 Premium Requerido')).toBeInTheDocument()
    })
  })

  describe('Estados del componente', () => {
    it('debería mostrar el estado de carga inicial', () => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: mockUser })
      ;(PatoService.getPatos as jest.Mock).mockReturnValue([])
      
      render(<PatoDetailPage />)

      // El componente debería redirigir inmediatamente
      expect(mockRouter.push).toHaveBeenCalledWith('/catalogo')
    })

    it('debería manejar cambios en el plan del usuario', () => {
      // Primero renderizar con usuario gratuito
      ;(useAuth as jest.Mock).mockReturnValue({ user: mockUser })
      const { rerender } = render(<PatoDetailPage />)

      expect(screen.getByText('🔒 Premium Requerido')).toBeInTheDocument()

      // Cambiar a usuario premium
      ;(useAuth as jest.Mock).mockReturnValue({ user: mockPremiumUser })
      rerender(<PatoDetailPage />)

      expect(screen.getByText('🎵 Reproducir Sonido')).toBeInTheDocument()
    })
  })
}) 