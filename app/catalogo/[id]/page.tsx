'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PatoService } from '@/lib/patoService';
import type { Pato } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Volume2,
  MapPin,
  Utensils,
  Feather,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PatoDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [pato, setPato] = useState<Pato | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const patoId = params.id as string;
    const patos = PatoService.getPatos();
    const foundPato = patos.find(p => p.id === patoId);

    if (foundPato) {
      setPato(foundPato);
    } else {
      router.push('/catalogo');
    }
  }, [user, params.id, router]);

  const playSound = () => {
    if (!pato) return;

    if (user?.plan === 'gratuito') {
      alert(
        'Esta funcionalidad está disponible solo para usuarios Premium. ¡Actualiza tu plan!'
      );
      return;
    }

    // Simular reproducción de sonido
    alert(`🎵 Reproduciendo sonido de ${pato.nombre}`);
  };

  if (!user || !pato) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/catalogo">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Catálogo
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden">
            <Image
              src={pato.imagen || '/placeholder.svg'}
              alt={pato.nombre}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Sonido Característico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={playSound}
                className="w-full"
                disabled={user.plan === 'gratuito'}
              >
                {user.plan === 'gratuito'
                  ? '🔒 Premium Requerido'
                  : '🎵 Reproducir Sonido'}
              </Button>
              {user.plan === 'gratuito' && (
                <p className="text-sm text-amber-600 mt-2 text-center">
                  Actualiza a Premium para escuchar los sonidos
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {pato.nombre}
            </h1>
            <p className="text-xl text-gray-600 italic mb-4">
              {pato.nombreCientifico}
            </p>
            <Badge variant="secondary" className="mb-4">
              Especie: {pato.especie}
            </Badge>
            <p className="text-gray-700 leading-relaxed">{pato.descripcion}</p>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5" />
                  Comportamiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{pato.comportamiento}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  Hábitat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{pato.habitat}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Feather className="w-5 h-5" />
                  Plumaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{pato.plumaje}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Utensils className="w-5 h-5" />
                  Alimentación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{pato.alimentacion}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
