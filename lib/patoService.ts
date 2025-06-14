import type { Pato } from "@/types"
import { mockPatos } from "@/data/mockData"

export class PatoService {
  private static STORAGE_KEY = "patoapp_patos"

  static getPatos(): Pato[] {
    if (typeof window === "undefined") return mockPatos

    const saved = localStorage.getItem(this.STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockPatos))
    return mockPatos
  }

  static savePatos(patos: Pato[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patos))
  }

  static addPato(pato: Omit<Pato, "id">): Pato {
    const patos = this.getPatos()
    const newPato: Pato = {
      ...pato,
      id: Date.now().toString(),
    }

    const updatedPatos = [...patos, newPato]
    this.savePatos(updatedPatos)
    return newPato
  }

  static updatePato(id: string, updates: Partial<Pato>): boolean {
    const patos = this.getPatos()
    const index = patos.findIndex((p) => p.id === id)

    if (index === -1) return false

    patos[index] = { ...patos[index], ...updates }
    this.savePatos(patos)
    return true
  }

  static deletePato(id: string): boolean {
    const patos = this.getPatos()
    const filtered = patos.filter((p) => p.id !== id)

    if (filtered.length === patos.length) return false

    this.savePatos(filtered)
    return true
  }

  static searchPatos(
    query: string,
    filters: {
      especie?: string
      habitat?: string
      alimentacion?: string
    } = {},
  ): Pato[] {
    const patos = this.getPatos()

    return patos
      .filter((pato) => {
        const matchesQuery =
          !query ||
          pato.nombre.toLowerCase().includes(query.toLowerCase()) ||
          pato.nombreCientifico.toLowerCase().includes(query.toLowerCase()) ||
          pato.descripcion.toLowerCase().includes(query.toLowerCase())

        const matchesEspecie = !filters.especie || pato.especie === filters.especie
        const matchesHabitat = !filters.habitat || pato.habitat.toLowerCase().includes(filters.habitat.toLowerCase())
        const matchesAlimentacion =
          !filters.alimentacion || pato.alimentacion.toLowerCase().includes(filters.alimentacion.toLowerCase())

        return matchesQuery && matchesEspecie && matchesHabitat && matchesAlimentacion
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  }
}
