import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPage from '@/app/admin/page'
import { AuthProvider } from '@/contexts/AuthContext'
import { PatoService } from '@/lib/patoService'
import { mockPatos } from '@/data/mockData'
import type { User } from '@/types'

// Mock PatoService
jest.mock('@/lib/patoService')
const mockPatoService = PatoService as jest.Mocked<typeof PatoService>

// Mock data
const mockAdminUser: User = {
  id: '1',
  nombre: 'Admin',
  apellido: 'User',
  email: 'admin@test.com',
  usuario: 'admin',
  contraseña: '123456',
  rol: 'admin',
  plan: 'pago',
  fechaRegistro: '2024-01-01',
}

const mockRegularUser: User = {
  id: '2',
  nombre: 'Regular',
  apellido: 'User',
  email: 'user@test.com',
  usuario: 'user',
  contraseña: '123456',
  rol: 'user',
  plan: 'gratuito',
  fechaRegistro: '2024-01-01',
}

// Wrapper component for testing
const TestWrapper: React.FC<{ children: React.ReactNode; initialUser?: User | null }> = ({ 
  children, 
  initialUser = null 
}) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPatoService.getPatos.mockReturnValue(mockPatos)
    mockPatoService.addPato.mockImplementation((pato) => ({
      ...pato,
      id: 'new-id',
    }))
    mockPatoService.updatePato.mockReturnValue(true)
    mockPatoService.deletePato.mockReturnValue(true)
  })

  describe('Authentication and Authorization', () => {
    it('should redirect to login when user is not authenticated', async () => {
      const mockPush = jest.fn()
      jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
        push: mockPush,
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })

    it('should redirect to home when user is not admin', async () => {
      const mockPush = jest.fn()
      jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
        push: mockPush,
      })

      // Mock useAuth to return a regular user
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockRegularUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })

    it('should render admin panel when user is authenticated admin', () => {
      // Mock useAuth to return an admin user
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
      expect(screen.getByText('Gestiona las especies de patos en el catálogo')).toBeInTheDocument()
    })
  })

  describe('Data Loading', () => {
    it('should load patos on component mount', () => {
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      expect(mockPatoService.getPatos).toHaveBeenCalled()
    })

    it('should display patos in the list', () => {
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      expect(screen.getByText('Pato Barcino')).toBeInTheDocument()
      expect(screen.getByText('Anas flavirostris')).toBeInTheDocument()
      expect(screen.getByText('Pato Sirirí Pampa')).toBeInTheDocument()
    })

    it('should show empty state when no patos exist', () => {
      mockPatoService.getPatos.mockReturnValue([])
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      expect(screen.getByText('No hay especies registradas. ¡Agrega la primera!')).toBeInTheDocument()
    })
  })

  describe('Add New Pato', () => {
    it('should open dialog when "Agregar Especie" button is clicked', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      const addButton = screen.getByText('Agregar Especie')
      await user.click(addButton)

      expect(screen.getByText('Agregar Nueva Especie')).toBeInTheDocument()
      expect(screen.getByText('Completa la información de la nueva especie')).toBeInTheDocument()
    })

    it('should add new pato when form is submitted', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Open dialog
      const addButton = screen.getByText('Agregar Especie')
      await user.click(addButton)

      // Fill form
      await user.type(screen.getByLabelText('Nombre'), 'Nuevo Pato')
      await user.type(screen.getByLabelText('Nombre Científico'), 'Anas novus')
      await user.type(screen.getByLabelText('Especie'), 'Anas')
      await user.type(screen.getByLabelText('URL de Imagen'), '/test-image.jpg')
      await user.type(screen.getByLabelText('Descripción'), 'Descripción del nuevo pato')
      await user.type(screen.getByLabelText('Comportamiento'), 'Comportamiento del pato')
      await user.type(screen.getByLabelText('Hábitat'), 'Hábitat del pato')
      await user.type(screen.getByLabelText('Plumaje'), 'Plumaje del pato')
      await user.type(screen.getByLabelText('Alimentación'), 'Alimentación del pato')
      await user.type(screen.getByLabelText('URL de Sonido'), '/test-sound.mp3')

      // Submit form
      const submitButton = screen.getByText('Agregar')
      await user.click(submitButton)

      expect(mockPatoService.addPato).toHaveBeenCalledWith({
        nombre: 'Nuevo Pato',
        nombreCientifico: 'Anas novus',
        especie: 'Anas',
        imagen: '/test-image.jpg',
        descripcion: 'Descripción del nuevo pato',
        comportamiento: 'Comportamiento del pato',
        habitat: 'Hábitat del pato',
        plumaje: 'Plumaje del pato',
        alimentacion: 'Alimentación del pato',
        sonido: '/test-sound.mp3',
      })

      expect(mockPatoService.getPatos).toHaveBeenCalled()
    })

    it('should show success message after adding pato', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Open dialog and submit form
      await user.click(screen.getByText('Agregar Especie'))
      
      // Fill required fields
      await user.type(screen.getByLabelText('Nombre'), 'Test Pato')
      await user.type(screen.getByLabelText('Nombre Científico'), 'Test Scientific')
      await user.type(screen.getByLabelText('Especie'), 'Test')
      await user.type(screen.getByLabelText('URL de Imagen'), '/test.jpg')
      await user.type(screen.getByLabelText('Descripción'), 'Test description')
      await user.type(screen.getByLabelText('Comportamiento'), 'Test behavior')
      await user.type(screen.getByLabelText('Hábitat'), 'Test habitat')
      await user.type(screen.getByLabelText('Plumaje'), 'Test plumage')
      await user.type(screen.getByLabelText('Alimentación'), 'Test food')
      await user.type(screen.getByLabelText('URL de Sonido'), '/test.mp3')

      await user.click(screen.getByText('Agregar'))

      expect(screen.getByText('Nueva especie agregada exitosamente')).toBeInTheDocument()
    })
  })

  describe('Edit Pato', () => {
    it('should open edit dialog when edit button is clicked', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Find and click edit button for first pato
      const editButtons = screen.getAllByRole('button')
      const editButton = editButtons.find(button => 
        button.querySelector('svg') && button.getAttribute('aria-label') !== 'delete'
      )
      
      if (editButton) {
        await user.click(editButton)
      }

      expect(screen.getByText('Editar Especie')).toBeInTheDocument()
      expect(screen.getByText('Modifica los datos de la especie')).toBeInTheDocument()
    })

    it('should populate form with existing pato data when editing', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Click edit button
      const editButtons = screen.getAllByRole('button')
      const editButton = editButtons.find(button => 
        button.querySelector('svg') && button.getAttribute('aria-label') !== 'delete'
      )
      
      if (editButton) {
        await user.click(editButton)
      }

      // Check if form is populated
      expect(screen.getByDisplayValue('Pato Barcino')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Anas flavirostris')).toBeInTheDocument()
    })

    it('should update pato when edit form is submitted', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Open edit dialog
      const editButtons = screen.getAllByRole('button')
      const editButton = editButtons.find(button => 
        button.querySelector('svg') && button.getAttribute('aria-label') !== 'delete'
      )
      
      if (editButton) {
        await user.click(editButton)
      }

      // Modify a field
      const nombreInput = screen.getByDisplayValue('Pato Barcino')
      await user.clear(nombreInput)
      await user.type(nombreInput, 'Pato Barcino Modificado')

      // Submit form
      const submitButton = screen.getByText('Actualizar')
      await user.click(submitButton)

      expect(mockPatoService.updatePato).toHaveBeenCalledWith('1', expect.objectContaining({
        nombre: 'Pato Barcino Modificado',
      }))

      expect(screen.getByText('Especie actualizada exitosamente')).toBeInTheDocument()
    })
  })

  describe('Delete Pato', () => {
    it('should show confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Find and click delete button
      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button => 
        button.querySelector('svg') && button.className.includes('text-red-600')
      )
      
      if (deleteButton) {
        await user.click(deleteButton)
      }

      expect(global.confirm).toHaveBeenCalledWith('¿Estás seguro de que quieres eliminar esta especie?')
    })

    it('should delete pato when confirmation is accepted', async () => {
      const user = userEvent.setup()
      ;(global.confirm as jest.Mock).mockReturnValue(true)
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Click delete button
      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button => 
        button.querySelector('svg') && button.className.includes('text-red-600')
      )
      
      if (deleteButton) {
        await user.click(deleteButton)
      }

      expect(mockPatoService.deletePato).toHaveBeenCalledWith('1')
      expect(mockPatoService.getPatos).toHaveBeenCalled()
      expect(screen.getByText('Especie eliminada exitosamente')).toBeInTheDocument()
    })

    it('should not delete pato when confirmation is cancelled', async () => {
      const user = userEvent.setup()
      ;(global.confirm as jest.Mock).mockReturnValue(false)
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Click delete button
      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(button => 
        button.querySelector('svg') && button.className.includes('text-red-600')
      )
      
      if (deleteButton) {
        await user.click(deleteButton)
      }

      expect(mockPatoService.deletePato).not.toHaveBeenCalled()
    })
  })

  describe('Form Validation', () => {
    it('should require all fields when adding new pato', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Open dialog
      await user.click(screen.getByText('Agregar Especie'))

      // Try to submit without filling required fields
      const submitButton = screen.getByText('Agregar')
      await user.click(submitButton)

      // Form should not submit and PatoService.addPato should not be called
      expect(mockPatoService.addPato).not.toHaveBeenCalled()
    })

    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Open dialog
      await user.click(screen.getByText('Agregar Especie'))

      // Check that required fields have required attribute
      expect(screen.getByLabelText('Nombre')).toHaveAttribute('required')
      expect(screen.getByLabelText('Nombre Científico')).toHaveAttribute('required')
      expect(screen.getByLabelText('Especie')).toHaveAttribute('required')
      expect(screen.getByLabelText('URL de Imagen')).toHaveAttribute('required')
      expect(screen.getByLabelText('Descripción')).toHaveAttribute('required')
      expect(screen.getByLabelText('Comportamiento')).toHaveAttribute('required')
      expect(screen.getByLabelText('Hábitat')).toHaveAttribute('required')
      expect(screen.getByLabelText('Plumaje')).toHaveAttribute('required')
      expect(screen.getByLabelText('Alimentación')).toHaveAttribute('required')
      expect(screen.getByLabelText('URL de Sonido')).toHaveAttribute('required')
    })
  })

  describe('UI Elements', () => {
    it('should display pato information correctly', () => {
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Check pato information is displayed
      expect(screen.getByText('Pato Barcino')).toBeInTheDocument()
      expect(screen.getByText('Anas flavirostris')).toBeInTheDocument()
      expect(screen.getByText('Especie: Anas')).toBeInTheDocument()
      expect(screen.getByText('Hábitat: Lagunas, esteros, ríos de corriente lenta y ambientes palustres')).toBeInTheDocument()
      expect(screen.getByText('Alimentación: Omnívoro: semillas, plantas acuáticas, invertebrados')).toBeInTheDocument()
    })

    it('should display pato images', () => {
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      const images = screen.getAllByAltText(/Pato/)
      expect(images.length).toBeGreaterThan(0)
      expect(images[0]).toHaveAttribute('src', '/placeholder.svg?height=300&width=400')
    })

    it('should have edit and delete buttons for each pato', () => {
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Should have edit and delete buttons for each pato
      const buttons = screen.getAllByRole('button')
      const editButtons = buttons.filter(button => 
        button.querySelector('svg') && !button.className.includes('text-red-600')
      )
      const deleteButtons = buttons.filter(button => 
        button.querySelector('svg') && button.className.includes('text-red-600')
      )

      expect(editButtons.length).toBeGreaterThan(0)
      expect(deleteButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle PatoService errors gracefully', async () => {
      const user = userEvent.setup()
      
      jest.spyOn(require('@/contexts/AuthContext'), 'useAuth').mockReturnValue({
        user: mockAdminUser,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        updateUserPlan: jest.fn(),
      })

      // Mock PatoService to throw error
      mockPatoService.addPato.mockImplementation(() => {
        throw new Error('Service error')
      })

      render(
        <TestWrapper>
          <AdminPage />
        </TestWrapper>
      )

      // Try to add a pato
      await user.click(screen.getByText('Agregar Especie'))
      
      // Fill form
      await user.type(screen.getByLabelText('Nombre'), 'Test Pato')
      await user.type(screen.getByLabelText('Nombre Científico'), 'Test Scientific')
      await user.type(screen.getByLabelText('Especie'), 'Test')
      await user.type(screen.getByLabelText('URL de Imagen'), '/test.jpg')
      await user.type(screen.getByLabelText('Descripción'), 'Test description')
      await user.type(screen.getByLabelText('Comportamiento'), 'Test behavior')
      await user.type(screen.getByLabelText('Hábitat'), 'Test habitat')
      await user.type(screen.getByLabelText('Plumaje'), 'Test plumage')
      await user.type(screen.getByLabelText('Alimentación'), 'Test food')
      await user.type(screen.getByLabelText('URL de Sonido'), '/test.mp3')

      await user.click(screen.getByText('Agregar'))

      // Component should not crash
      expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
    })
  })
}) 