import React from 'react'
import { render, screen } from '@testing-library/react'

// Componente de ejemplo para pruebas
const ExampleComponent = () => {
  return <div>Hola Mundo</div>
}

describe('Ejemplo de Prueba', () => {
  it('debería renderizar "Hola Mundo"', () => {
    render(<ExampleComponent />)
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument()
  })

  it('debería pasar una prueba básica', () => {
    expect(1 + 1).toBe(2)
  })
}) 