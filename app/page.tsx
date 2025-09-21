'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🦆 Bienvenido a Pato App
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre y aprende sobre las fascinantes especies de patos que habitan
          en Argentina
        </p>
      </div>

      {user ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Explorar Catálogo</CardTitle>
              <CardDescription>
                Descubre todas las especies de patos argentinos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/catalogo">
                <Button className="w-full">Ver Catálogo</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mi Plan</CardTitle>
              <CardDescription>
                Plan actual: {user.plan === 'gratuito' ? 'Gratuito' : 'Premium'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/plan">
                <Button variant="outline" className="w-full">
                  {user.plan === 'gratuito'
                    ? 'Actualizar Plan'
                    : 'Gestionar Plan'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {user.rol === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Administración</CardTitle>
                <CardDescription>Gestionar especies de patos</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button variant="secondary" className="w-full">
                    Panel Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="grid md:grid-cols-2 gap-6 max-w-md mx-auto">
            <Link href="/register">
              <Button size="lg" className="w-full">
                Registrarse
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Explora</h3>
          <p className="text-gray-600">
            Descubre especies únicas de patos argentinos con información
            detallada
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">Escucha</h3>
          <p className="text-gray-600">
            Reproduce los sonidos característicos de cada especie
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">Aprende</h3>
          <p className="text-gray-600">
            Conoce sobre comportamiento, hábitat y características únicas
          </p>
        </div>
      </div>
    </div>
  );
}
