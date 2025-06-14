"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star } from "lucide-react"

export default function PlanPage() {
  const { user, updateUserPlan } = useAuth()
  const router = useRouter()
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleUpgrade = () => {
    setShowPayment(true)
  }

  const handlePayment = (method: "card" | "mercadopago") => {
    // Simular proceso de pago
    alert(`Procesando pago con ${method === "card" ? "Tarjeta de Crédito" : "MercadoPago"}...`)

    setTimeout(() => {
      updateUserPlan("pago")
      alert("¡Pago procesado exitosamente! Ahora tienes acceso Premium.")
      setShowPayment(false)
    }, 2000)
  }

  if (!user) return null

  if (showPayment) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Procesar Pago</CardTitle>
            <CardDescription>Selecciona tu método de pago preferido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Plan Premium</h3>
              <p className="text-2xl font-bold">$999 ARS/mes</p>
            </div>

            <Button onClick={() => handlePayment("card")} className="w-full" size="lg">
              💳 Pagar con Tarjeta de Crédito
            </Button>

            <Button onClick={() => handlePayment("mercadopago")} variant="outline" className="w-full" size="lg">
              🔵 Pagar con MercadoPago
            </Button>

            <Button onClick={() => setShowPayment(false)} variant="ghost" className="w-full">
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mi Plan</h1>
        <p className="text-gray-600">Gestiona tu suscripción y accede a funcionalidades premium</p>
      </div>

      <div className="mb-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Plan Actual</CardTitle>
              <Badge variant={user.plan === "pago" ? "default" : "secondary"}>
                {user.plan === "pago" ? (
                  <>
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </>
                ) : (
                  "Gratuito"
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {user.plan === "pago"
                ? "Tienes acceso completo a todas las funcionalidades de Pato App"
                : "Tienes acceso limitado. Actualiza para desbloquear todas las funciones"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Plan Gratuito */}
        <Card className={user.plan === "gratuito" ? "ring-2 ring-blue-500" : ""}>
          <CardHeader>
            <CardTitle>Plan Gratuito</CardTitle>
            <CardDescription>Perfecto para comenzar</CardDescription>
            <div className="text-2xl font-bold">$0 ARS/mes</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Acceso al catálogo completo
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Información detallada de especies
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Filtros básicos de búsqueda
              </li>
              <li className="flex items-center gap-2 text-gray-400">❌ Reproducción de sonidos</li>
              <li className="flex items-center gap-2 text-gray-400">❌ Simulaciones avanzadas</li>
            </ul>

            {user.plan === "gratuito" && (
              <Badge variant="secondary" className="mt-4">
                Plan Actual
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Plan Premium */}
        <Card className={user.plan === "pago" ? "ring-2 ring-yellow-500" : "border-yellow-200"}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <CardTitle>Plan Premium</CardTitle>
            </div>
            <CardDescription>Experiencia completa</CardDescription>
            <div className="text-2xl font-bold">$999 ARS/mes</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Todo lo del plan gratuito
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Reproducción de sonidos de especies
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Simulaciones interactivas
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Contenido exclusivo
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Soporte prioritario
              </li>
            </ul>

            {user.plan === "pago" ? (
              <Badge className="mt-4">
                <Crown className="w-4 h-4 mr-1" />
                Plan Actual
              </Badge>
            ) : (
              <Button onClick={handleUpgrade} className="w-full mt-4">
                Actualizar a Premium
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
