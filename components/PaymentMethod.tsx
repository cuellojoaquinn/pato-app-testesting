"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, ArrowLeft } from "lucide-react"

interface PaymentMethodProps {
  selectedPlan: {
    duration: string
    price: number
    originalPrice?: number
    savings?: number
  } | null
  onPaymentSuccess: () => void
  onBack: () => void
}

export default function PaymentMethod({ selectedPlan, onPaymentSuccess, onBack }: PaymentMethodProps) {
  const [showCardForm, setShowCardForm] = useState(false)
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  })
  const [errors, setErrors] = useState({
    number: false,
    name: false,
    expiry: false,
    cvv: false
  })
  const [nameError, setNameError] = useState("")

  const handlePayment = (method: "card" | "mercadopago") => {
    if (method === "card") {
      setShowCardForm(true)
    } else {
      // Simular proceso de pago con MercadoPago
      alert(`Procesando pago con MercadoPago...`)

      setTimeout(() => {
        alert("¡Pago procesado exitosamente! Ahora tienes acceso Premium.")
        onPaymentSuccess()
      }, 2000)
    }
  }

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación de campos vacíos
    const newErrors = {
      number: !cardData.number.trim(),
      name: !cardData.name.trim(),
      expiry: !cardData.expiry.trim(),
      cvv: !cardData.cvv.trim()
    }
    
    setErrors(newErrors)
    
    // Validación de longitud del nombre
    if (cardData.name.length > 30) {
      setNameError("El nombre no puede exceder los 30 caracteres")
      return
    } else {
      setNameError("")
    }
    
    // Si hay errores, no continuar
    if (Object.values(newErrors).some(error => error)) {
      return
    }

    // Simular proceso de pago
    alert("Procesando pago con tarjeta de crédito...")

    setTimeout(() => {
      alert("¡Pago procesado exitosamente! Ahora tienes acceso Premium.")
      onPaymentSuccess()
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
    
    // Validación especial para el nombre
    if (field === 'name') {
      if (value.length > 30) {
        setNameError("El nombre no puede exceder los 30 caracteres")
      } else {
        setNameError("")
      }
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleBackToPaymentMethods = () => {
    setShowCardForm(false)
    setCardData({ number: "", name: "", expiry: "", cvv: "" })
    setErrors({ number: false, name: false, expiry: false, cvv: false })
    setNameError("")
  }

  if (showCardForm) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToPaymentMethods}
                className="p-0 h-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver
              </Button>
            </div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Datos de Tarjeta
            </CardTitle>
            <CardDescription>Ingresa los datos de tu tarjeta de crédito</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Plan Premium - {selectedPlan?.duration}</h3>
                <p className="text-2xl font-bold">${selectedPlan?.price} ARS</p>
                {selectedPlan?.savings && (
                  <p className="text-sm text-green-600">Ahorras ${selectedPlan.savings} ARS</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => handleInputChange('number', formatCardNumber(e.target.value))}
                  maxLength={19}
                  className={errors.number ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.number && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Nombre del Titular</Label>
                <Input
                  id="cardName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={cardData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name || nameError ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">Este campo es obligatorio</p>
                )}
                {nameError && (
                  <p className="text-sm text-red-500">{nameError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Fecha de Vencimiento</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => handleInputChange('expiry', formatExpiry(e.target.value))}
                    maxLength={5}
                    className={errors.expiry ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {errors.expiry && (
                    <p className="text-sm text-red-500">Este campo es obligatorio</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    className={errors.cvv ? "border-red-500 focus:border-red-500" : ""}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-red-500">Este campo es obligatorio</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                💳 Pagar ${selectedPlan?.price} ARS
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={handleBackToPaymentMethods}
              >
                Cancelar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a Planes
            </Button>
          </div>
          <CardTitle>Procesar Pago</CardTitle>
          <CardDescription>Selecciona tu método de pago preferido</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Plan Premium - {selectedPlan?.duration}</h3>
            <p className="text-2xl font-bold">${selectedPlan?.price} ARS</p>
            {selectedPlan?.savings && (
              <p className="text-sm text-green-600">Ahorras ${selectedPlan.savings} ARS</p>
            )}
          </div>

          <Button onClick={() => handlePayment("card")} className="w-full" size="lg">
            💳 Pagar con Tarjeta de Crédito
          </Button>

          <Button onClick={() => handlePayment("mercadopago")} variant="outline" className="w-full" size="lg">
            🔵 Pagar con MercadoPago
          </Button>

          <Button onClick={onBack} variant="ghost" className="w-full">
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 