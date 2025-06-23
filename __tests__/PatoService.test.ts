import { PatoService } from '@/lib/patoService'
import { mockPatos } from '@/data/mockData'
import type { Pato } from '@/types'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('PatoService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
  })

  describe('getPatos', () => {
    it('should return mock data when localStorage is empty', () => {
      const result = PatoService.getPatos()
      
      expect(result).toEqual(mockPatos)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_patos',
        JSON.stringify(mockPatos)
      )
    })

    it('should return data from localStorage when available', () => {
      const storedPatos = [{ ...mockPatos[0], id: 'stored-1' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedPatos))
      
      const result = PatoService.getPatos()
      
      expect(result).toEqual(storedPatos)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('patoapp_patos')
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')
      
      const result = PatoService.getPatos()
      
      expect(result).toEqual(mockPatos)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_patos',
        JSON.stringify(mockPatos)
      )
    })
  })

  describe('savePatos', () => {
    it('should save patos to localStorage', () => {
      const patosToSave = [{ ...mockPatos[0], id: 'test-1' }]
      
      PatoService.savePatos(patosToSave)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_patos',
        JSON.stringify(patosToSave)
      )
    })

    it('should not save when window is undefined (SSR)', () => {
      const originalWindow = global.window
      delete (global as any).window
      
      const patosToSave = [{ ...mockPatos[0], id: 'test-1' }]
      PatoService.savePatos(patosToSave)
      
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
      
      global.window = originalWindow
    })
  })

  describe('addPato', () => {
    it('should add new pato with generated id', () => {
      const newPatoData = {
        nombre: 'Nuevo Pato',
        nombreCientifico: 'Anas novus',
        descripcion: 'Descripción del nuevo pato',
        comportamiento: 'Comportamiento',
        habitat: 'Hábitat',
        plumaje: 'Plumaje',
        alimentacion: 'Alimentación',
        especie: 'Anas',
        imagen: '/test.jpg',
        sonido: '/test.mp3',
      }

      const result = PatoService.addPato(newPatoData)
      
      expect(result).toMatchObject({
        ...newPatoData,
        id: expect.any(String),
      })
      expect(result.id).toBeTruthy()
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should add pato to existing list', () => {
      const existingPatos = [{ ...mockPatos[0], id: 'existing-1' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPatos))
      
      const newPatoData = {
        nombre: 'Nuevo Pato',
        nombreCientifico: 'Anas novus',
        descripcion: 'Descripción',
        comportamiento: 'Comportamiento',
        habitat: 'Hábitat',
        plumaje: 'Plumaje',
        alimentacion: 'Alimentación',
        especie: 'Anas',
        imagen: '/test.jpg',
        sonido: '/test.mp3',
      }

      PatoService.addPato(newPatoData)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_patos',
        JSON.stringify([
          ...existingPatos,
          expect.objectContaining(newPatoData)
        ])
      )
    })
  })

  describe('updatePato', () => {
    it('should update existing pato', () => {
      const existingPatos = [
        { ...mockPatos[0], id: '1' },
        { ...mockPatos[1], id: '2' }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPatos))
      
      const updates = {
        nombre: 'Pato Actualizado',
        descripcion: 'Nueva descripción'
      }
      
      const result = PatoService.updatePato('1', updates)
      
      expect(result).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_patos',
        JSON.stringify([
          { ...existingPatos[0], ...updates },
          existingPatos[1]
        ])
      )
    })

    it('should return false when pato not found', () => {
      const existingPatos = [{ ...mockPatos[0], id: '1' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPatos))
      
      const result = PatoService.updatePato('non-existent', { nombre: 'Test' })
      
      expect(result).toBe(false)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('deletePato', () => {
    it('should delete existing pato', () => {
      const existingPatos = [
        { ...mockPatos[0], id: '1' },
        { ...mockPatos[1], id: '2' }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPatos))
      
      const result = PatoService.deletePato('1')
      
      expect(result).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'patoapp_patos',
        JSON.stringify([existingPatos[1]])
      )
    })

    it('should return false when pato not found', () => {
      const existingPatos = [{ ...mockPatos[0], id: '1' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingPatos))
      
      const result = PatoService.deletePato('non-existent')
      
      expect(result).toBe(false)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('searchPatos', () => {
    beforeEach(() => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPatos))
    })

    it('should return all patos when no query or filters provided', () => {
      const result = PatoService.searchPatos('')
      
      expect(result).toHaveLength(mockPatos.length)
      expect(result).toEqual(expect.arrayContaining(mockPatos))
    })

    it('should filter by query in nombre', () => {
      const result = PatoService.searchPatos('Barcino')
      
      expect(result).toHaveLength(1)
      expect(result[0].nombre).toBe('Pato Barcino')
    })

    it('should filter by query in nombreCientifico', () => {
      const result = PatoService.searchPatos('flavirostris')
      
      expect(result).toHaveLength(1)
      expect(result[0].nombreCientifico).toBe('Anas flavirostris')
    })

    it('should filter by query in descripcion', () => {
      const result = PatoService.searchPatos('Argentina')
      
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(pato => 
        pato.descripcion.toLowerCase().includes('argentina')
      )).toBe(true)
    })

    it('should filter by especie', () => {
      const result = PatoService.searchPatos('', { especie: 'Anas' })
      
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(pato => pato.especie === 'Anas')).toBe(true)
    })

    it('should filter by habitat', () => {
      const result = PatoService.searchPatos('', { habitat: 'lagunas' })
      
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(pato => 
        pato.habitat.toLowerCase().includes('lagunas')
      )).toBe(true)
    })

    it('should filter by alimentacion', () => {
      const result = PatoService.searchPatos('', { alimentacion: 'semillas' })
      
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(pato => 
        pato.alimentacion.toLowerCase().includes('semillas')
      )).toBe(true)
    })

    it('should combine query and filters', () => {
      const result = PatoService.searchPatos('pato', { especie: 'Anas' })
      
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(pato => 
        pato.especie === 'Anas' && 
        (pato.nombre.toLowerCase().includes('pato') ||
         pato.nombreCientifico.toLowerCase().includes('pato') ||
         pato.descripcion.toLowerCase().includes('pato'))
      )).toBe(true)
    })

    it('should sort results alphabetically by nombre', () => {
      const result = PatoService.searchPatos('')
      
      for (let i = 1; i < result.length; i++) {
        expect(result[i-1].nombre.localeCompare(result[i].nombre)).toBeLessThanOrEqual(0)
      }
    })

    it('should be case insensitive', () => {
      const result1 = PatoService.searchPatos('BARCINO')
      const result2 = PatoService.searchPatos('barcino')
      
      expect(result1).toEqual(result2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty array in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]))
      
      const result = PatoService.getPatos()
      
      expect(result).toEqual([])
    })

    it('should handle null in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = PatoService.getPatos()
      
      expect(result).toEqual(mockPatos)
    })

    it('should handle undefined in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(undefined)
      
      const result = PatoService.getPatos()
      
      expect(result).toEqual(mockPatos)
    })

    it('should handle server-side rendering', () => {
      const originalWindow = global.window
      delete (global as any).window
      
      const result = PatoService.getPatos()
      
      expect(result).toEqual(mockPatos)
      
      global.window = originalWindow
    })
  })
}) 