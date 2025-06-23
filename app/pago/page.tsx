"use client"

import { useRouter } from "next/navigation"
import PaymentMethod from "@/components/PaymentMethod"

export default function PagoPage() {
  const router = useRouter()

  const handlePaymentSuccess = () => {
    // Redirigir a la página principal o mostrar mensaje de éxito
    router.push("/?payment=success")
  }

  const handleBack = () => {
    router.back()
  }

  // Por ahora, usamos un plan de ejemplo
  // En una implementación real, esto vendría de la URL o del estado global
  const selectedPlan = {
    duration: "1 mes",
    price: 1499,
    originalPrice: 1499,
    savings: 0
  }

  return (
    <PaymentMethod
      selectedPlan={selectedPlan}
      onPaymentSuccess={handlePaymentSuccess}
      onBack={handleBack}
    />
  )
} 