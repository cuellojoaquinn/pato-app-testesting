"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    contraseña: "",
    confirmarContraseña: "",
    aceptaTerminos: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido"
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }
    if (!formData.usuario.trim()) {
      newErrors.usuario = "El nombre de usuario es requerido"
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = "El usuario debe tener al menos 3 caracteres"
    }
    if (!formData.contraseña) {
      newErrors.contraseña = "La contraseña es requerida"
    } else if (formData.contraseña.length < 6) {
      newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres"
    }
    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = "Las contraseñas no coinciden"
    }
    if (!formData.aceptaTerminos) {
      newErrors.aceptaTerminos = "Debes aceptar los términos y condiciones"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const success = await register({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        usuario: formData.usuario,
        contraseña: formData.contraseña,
      })

      if (success) {
        router.push("/login?registered=true")
      } else {
        setErrors({ general: "El email o nombre de usuario ya están en uso" })
      }
    } catch {}

    setLoading(false)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Crear Cuenta</CardTitle>
          <CardDescription>Únete a Pato App para explorar el mundo de los patos argentinos</CardDescription>
        </CardHeader>
        <CardContent>
          <form data-testid="register-form" onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <Alert variant="destructive">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  className={errors.nombre ? "border-red-500" : ""}
                />
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                  className={errors.apellido ? "border-red-500" : ""}
                />
                {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="usuario">Nombre de Usuario</Label>
              <Input
                id="usuario"
                value={formData.usuario}
                onChange={(e) => handleChange("usuario", e.target.value)}
                className={errors.usuario ? "border-red-500" : ""}
              />
              {errors.usuario && <p className="text-red-500 text-sm mt-1">{errors.usuario}</p>}
            </div>

            <div>
              <Label htmlFor="contraseña">Contraseña</Label>
              <Input
                id="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={(e) => handleChange("contraseña", e.target.value)}
                className={errors.contraseña ? "border-red-500" : ""}
              />
              {errors.contraseña && <p className="text-red-500 text-sm mt-1">{errors.contraseña}</p>}
            </div>

            <div>
              <Label htmlFor="confirmarContraseña">Confirmar Contraseña</Label>
              <Input
                id="confirmarContraseña"
                type="password"
                value={formData.confirmarContraseña}
                onChange={(e) => handleChange("confirmarContraseña", e.target.value)}
                className={errors.confirmarContraseña ? "border-red-500" : ""}
              />
              {errors.confirmarContraseña && <p className="text-red-500 text-sm mt-1">{errors.confirmarContraseña}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terminos"
                checked={formData.aceptaTerminos}
                onCheckedChange={(checked) => handleChange("aceptaTerminos", checked as boolean)}
              />
              <Label htmlFor="terminos" className="text-sm">
                Acepto los términos y condiciones
              </Label>
            </div>
            {errors.aceptaTerminos && <p className="text-red-500 text-sm">{errors.aceptaTerminos}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Crear Cuenta"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
