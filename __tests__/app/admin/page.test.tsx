import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import '@testing-library/jest-dom'
import AdminPage from "@/app/admin/page"
import { useAuth } from "@/contexts/AuthContext"
import { PatoService } from "@/lib/patoService"
import type {} from 'jest' // Add this import for TypeScript to recognize jest namespace

// Mocks
jest.mock("@/contexts/AuthContext")
jest.mock("@/lib/patoService")
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

const mockPatos = [
  {
    id: "1",
    nombre: "Pato Test",
    nombreCientifico: "Anas testus",
    descripcion: "Un pato de prueba",
    comportamiento: "Tranquilo",
    habitat: "Lagos",
    plumaje: "Colorido",
    alimentacion: "Semillas",
    especie: "Test",
    imagen: "/test.jpg",
    sonido: "/test.mp3",
  },
]

describe("AdminPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // @ts-ignore
    useAuth.mockReturnValue({ user: { rol: "admin" } })
    // @ts-ignore
    PatoService.getPatos.mockReturnValue(mockPatos)
  })

  it("renderiza el panel de administración y muestra patos", () => {
    render(<AdminPage />)
    expect(screen.getByText("Panel de Administración")).toBeInTheDocument()
    expect(screen.getByText("Pato Test")).toBeInTheDocument()
    expect(screen.getByText("Anas testus")).toBeInTheDocument()
  })

  it("abre el diálogo para agregar especie y limpia el formulario", () => {
    render(<AdminPage />)
    fireEvent.click(screen.getByText("Agregar Especie"))
    expect(screen.getByText("Agregar Nueva Especie")).toBeInTheDocument()
    expect(screen.getByLabelText("Nombre")).toHaveValue("")
  })

  it("llama a handleEdit y muestra datos del pato seleccionado", () => {
    render(<AdminPage />)
    fireEvent.click(screen.getAllByRole("button", { name: "" })[0]) // Botón editar
    expect(screen.getByText("Editar Especie")).toBeInTheDocument()
    expect(screen.getByLabelText("Nombre")).toHaveValue("Pato Test")
  })

  it("elimina un pato y muestra mensaje de éxito", () => {
    window.confirm = jest.fn(() => true)
    // @ts-ignore
    PatoService.deletePato.mockReturnValue(true)
    render(<AdminPage />)
    fireEvent.click(screen.getAllByRole("button", { name: "" })[1]) // Botón eliminar
    expect(PatoService.deletePato).toHaveBeenCalledWith("1")
    expect(screen.getByText("Especie eliminada exitosamente")).toBeInTheDocument()
  })

  it("agrega una especie nueva y muestra mensaje de éxito", async () => {
    // @ts-ignore
    PatoService.addPato.mockImplementation(() => {})
    render(<AdminPage />)
    fireEvent.click(screen.getByText("Agregar Especie"))
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nuevo Pato" } })
    fireEvent.change(screen.getByLabelText("Nombre Científico"), { target: { value: "Anas nuevo" } })
    fireEvent.change(screen.getByLabelText("Especie"), { target: { value: "Nueva" } })
    fireEvent.change(screen.getByLabelText("URL de Imagen"), { target: { value: "/nuevo.jpg" } })
    fireEvent.change(screen.getByLabelText("Descripción"), { target: { value: "Desc" } })
    fireEvent.change(screen.getByLabelText("Comportamiento"), { target: { value: "Activo" } })
    fireEvent.change(screen.getByLabelText("Hábitat"), { target: { value: "Ríos" } })
    fireEvent.change(screen.getByLabelText("Plumaje"), { target: { value: "Gris" } })
    fireEvent.change(screen.getByLabelText("Alimentación"), { target: { value: "Peces" } })
    fireEvent.change(screen.getByLabelText("URL de Sonido"), { target: { value: "/nuevo.mp3" } })
    fireEvent.click(screen.getByRole("button", { name: /Agregar/i }))
    await waitFor(() => {
      expect(PatoService.addPato).toHaveBeenCalled()
      expect(screen.getByText("Nueva especie agregada exitosamente")).toBeInTheDocument()
    })
  })
})