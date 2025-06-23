"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { PatoService } from "@/lib/patoService"
import type { Pato } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Volume2, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CatalogoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [patos, setPatos] = useState<Pato[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    especie: "all",
    habitat: "",
    alimentacion: "",
  })

  const loadPatos = useCallback(() => {
    const filteredPatos = PatoService.searchPatos(searchQuery, filters)
    setPatos(filteredPatos)
  }, [searchQuery, filters])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    loadPatos()
  }, [user, router, loadPatos])

  useEffect(() => {
    loadPatos()
  }, [loadPatos])

  const playSound = (soundUrl: string, patoName: string) => {
    if (user?.plan === "gratuito") {
      alert("Esta funcionalidad está disponible solo para usuarios Premium. ¡Actualiza tu plan!")
      return
    }

    // Simular reproducción de sonido
    alert(`🎵 Reproduciendo sonido de ${patoName}`)
  }

  const especies = [...new Set(PatoService.getPatos().map((p) => p.especie))]

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de Patos Argentinos</h1>
        <p className="text-gray-600">Explora las fascinantes especies de patos que habitan en Argentina</p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.especie}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, especie: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por especie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las especies</SelectItem>
              {especies.map((especie) => (
                <SelectItem key={especie} value={especie}>
                  {especie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Filtrar por hábitat"
            value={filters.habitat}
            onChange={(e) => setFilters((prev) => ({ ...prev, habitat: e.target.value }))}
          />

          <Input
            placeholder="Filtrar por alimentación"
            value={filters.alimentacion}
            onChange={(e) => setFilters((prev) => ({ ...prev, alimentacion: e.target.value }))}
          />
        </div>
      </div>

      {/* Resultados */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patos.map((pato) => (
          <Card key={pato.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <Image src={pato.imagen || "/placeholder.svg"} alt={pato.nombre} width={400} height={225} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{pato.nombre}</CardTitle>
              <CardDescription className="italic">{pato.nombreCientifico}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{pato.descripcion}</p>

              <div className="flex gap-2">
                <Link href={`/catalogo/${pato.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => playSound(pato.sonido, pato.nombre)}
                  className="flex-shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>

              {user.plan === "gratuito" && (
                <p className="text-xs text-amber-600 mt-2">🔒 Sonidos disponibles en plan Premium</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {patos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron patos con los filtros aplicados</p>
        </div>
      )}
    </div>
  )
}
