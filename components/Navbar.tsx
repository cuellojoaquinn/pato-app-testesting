'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            🦆 Pato App
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/catalogo" className="hover:text-blue-200">
                  Catálogo
                </Link>
                {user.rol === 'admin' && (
                  <Link href="/admin" className="hover:text-blue-200">
                    Administración
                  </Link>
                )}
                <Link href="/plan" className="hover:text-blue-200">
                  Mi Plan ({user.plan})
                </Link>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.nombre}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:text-blue-200 hover:bg-blue-700"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-200">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="hover:text-blue-200">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
