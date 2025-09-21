'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, ArrowLeft } from 'lucide-react';
import PaymentMethod from '@/components/PaymentMethod';

export default function PlanPage() {
  const { user, updateUserPlan } = useAuth();
  const router = useRouter();
  const [showPlanOptions, setShowPlanOptions] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    duration: string;
    price: number;
    originalPrice?: number;
    savings?: number;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleUpgrade = () => {
    setShowPlanOptions(true);
  };

  const handlePlanSelection = (plan: {
    duration: string;
    price: number;
    originalPrice?: number;
    savings?: number;
  }) => {
    setSelectedPlan(plan);
    setShowPlanOptions(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    updateUserPlan('pago');
    setShowPayment(false);
    setShowPlanOptions(false);
    setSelectedPlan(null);
  };

  const handleBackToPlans = () => {
    setShowPlanOptions(false);
    setShowPayment(false);
    setSelectedPlan(null);
  };

  if (!user) return null;

  if (showPayment) {
    return (
      <PaymentMethod
        selectedPlan={selectedPlan}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={handleBackToPlans}
      />
    );
  }

  if (showPlanOptions) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <Button
            variant="ghost"
            onClick={() => setShowPlanOptions(false)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Planes
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Elige tu Plan Premium
          </h1>
          <p className="text-gray-600">
            Selecciona la duración que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Plan Mensual */}
          <Card className="border-2 hover:border-yellow-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Plan Mensual
              </CardTitle>
              <CardDescription>Perfecto para probar</CardDescription>
              <div className="text-3xl font-bold">$1,499 ARS</div>
              <div className="text-sm text-gray-500">por mes</div>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <ul className="space-y-2 mb-6 flex-grow">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Todo lo del plan gratuito
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Reproducción de sonidos
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
              <Button
                onClick={() =>
                  handlePlanSelection({ duration: '1 mes', price: 1499 })
                }
                className="w-full mt-auto"
              >
                Seleccionar Plan Mensual
              </Button>
            </CardContent>
          </Card>

          {/* Plan Semestral */}
          <Card className="border-2 border-yellow-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-yellow-500 text-white">Más Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Plan Semestral
              </CardTitle>
              <CardDescription>La opción más elegida</CardDescription>
              <div className="text-3xl font-bold">$7,499 ARS</div>
              <div className="text-sm text-gray-500">por 6 meses</div>
              <div className="text-sm text-green-600 font-semibold">
                Ahorras $1,495 ARS
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Todo lo del plan gratuito
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Reproducción de sonidos
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
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Descuento especial
                </li>
              </ul>
              <Button
                onClick={() =>
                  handlePlanSelection({
                    duration: '6 meses',
                    price: 7499,
                    originalPrice: 8994,
                    savings: 1495,
                  })
                }
                className="w-full"
                size="lg"
              >
                Seleccionar Plan Semestral
              </Button>
            </CardContent>
          </Card>

          {/* Plan Anual */}
          <Card className="border-2 hover:border-yellow-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Plan Anual
              </CardTitle>
              <CardDescription>Máximo ahorro</CardDescription>
              <div className="text-3xl font-bold">$12,999 ARS</div>
              <div className="text-sm text-gray-500">por 12 meses</div>
              <div className="text-sm text-green-600 font-semibold">
                Ahorras $4,989 ARS
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Todo lo del plan gratuito
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Reproducción de sonidos
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
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Máximo descuento
                </li>
              </ul>
              <Button
                onClick={() =>
                  handlePlanSelection({
                    duration: '12 meses',
                    price: 12999,
                    originalPrice: 17988,
                    savings: 4989,
                  })
                }
                className="w-full"
              >
                Seleccionar Plan Anual
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Mi Plan</h1>
        <p className="text-gray-600">
          Gestiona tu suscripción y accede a funcionalidades premium
        </p>
      </div>

      <div className="mb-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Plan Actual</CardTitle>
              <Badge variant={user.plan === 'pago' ? 'default' : 'secondary'}>
                {user.plan === 'pago' ? (
                  <>
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </>
                ) : (
                  'Gratuito'
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {user.plan === 'pago'
                ? 'Tienes acceso completo a todas las funcionalidades de Pato App'
                : 'Tienes acceso limitado. Actualiza para desbloquear todas las funciones'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Plan Gratuito */}
        <Card
          className={user.plan === 'gratuito' ? 'ring-2 ring-blue-500' : ''}
        >
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
              <li className="flex items-center gap-2 text-gray-400">
                ❌ Reproducción de sonidos
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                ❌ Simulaciones avanzadas
              </li>
            </ul>

            {user.plan === 'gratuito' && (
              <Badge variant="secondary" className="mt-4">
                Plan Actual
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Plan Premium */}
        <Card
          className={
            user.plan === 'pago'
              ? 'ring-2 ring-yellow-500'
              : 'border-yellow-200'
          }
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <CardTitle>Plan Premium</CardTitle>
            </div>
            <CardDescription>Experiencia completa</CardDescription>
            <div className="text-2xl font-bold">Desde $1,499 ARS/mes</div>
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

            {user.plan === 'pago' ? (
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
  );
}
