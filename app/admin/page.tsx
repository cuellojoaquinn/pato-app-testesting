'use client';

import type React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PatoService } from '@/lib/patoService';
import type { Pato } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [patos, setPatos] = useState<Pato[]>([]);
  const [editingPato, setEditingPato] = useState<Pato | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Pato, 'id'>>({
    nombre: '',
    nombreCientifico: '',
    descripcion: '',
    comportamiento: '',
    habitat: '',
    plumaje: '',
    alimentacion: '',
    especie: '',
    imagen: '',
    sonido: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.rol !== 'admin') {
      router.push('/');
      return;
    }

    loadPatos();
  }, [user, router]);

  const loadPatos = () => {
    setPatos(PatoService.getPatos());
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      nombreCientifico: '',
      descripcion: '',
      comportamiento: '',
      habitat: '',
      plumaje: '',
      alimentacion: '',
      especie: '',
      imagen: '',
      sonido: '',
    });
    setEditingPato(null);
  };

  const handleEdit = (pato: Pato) => {
    setEditingPato(pato);
    setFormData({
      nombre: pato.nombre,
      nombreCientifico: pato.nombreCientifico,
      descripcion: pato.descripcion,
      comportamiento: pato.comportamiento,
      habitat: pato.habitat,
      plumaje: pato.plumaje,
      alimentacion: pato.alimentacion,
      especie: pato.especie,
      imagen: pato.imagen,
      sonido: pato.sonido,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta especie?')) {
      const success = PatoService.deletePato(id);
      if (success) {
        loadPatos();
        setMessage('Especie eliminada exitosamente');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPato) {
      // Actualizar
      const success = PatoService.updatePato(editingPato.id, formData);
      if (success) {
        setMessage('Especie actualizada exitosamente');
      }
    } else {
      // Crear nuevo
      PatoService.addPato(formData);
      setMessage('Nueva especie agregada exitosamente');
    }

    loadPatos();
    setIsDialogOpen(false);
    resetForm();
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user || user.rol !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona las especies de patos en el catálogo
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Especie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPato ? 'Editar Especie' : 'Agregar Nueva Especie'}
              </DialogTitle>
              <DialogDescription>
                {editingPato
                  ? 'Modifica los datos de la especie'
                  : 'Completa la información de la nueva especie'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={e => handleChange('nombre', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nombreCientifico">Nombre Científico</Label>
                  <Input
                    id="nombreCientifico"
                    value={formData.nombreCientifico}
                    onChange={e =>
                      handleChange('nombreCientifico', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="especie">Especie</Label>
                  <Input
                    id="especie"
                    value={formData.especie}
                    onChange={e => handleChange('especie', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="imagen">URL de Imagen</Label>
                  <Input
                    id="imagen"
                    value={formData.imagen}
                    onChange={e => handleChange('imagen', e.target.value)}
                    placeholder="/placeholder.svg?height=300&width=400"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={e => handleChange('descripcion', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="comportamiento">Comportamiento</Label>
                <Textarea
                  id="comportamiento"
                  value={formData.comportamiento}
                  onChange={e => handleChange('comportamiento', e.target.value)}
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="habitat">Hábitat</Label>
                <Textarea
                  id="habitat"
                  value={formData.habitat}
                  onChange={e => handleChange('habitat', e.target.value)}
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="plumaje">Plumaje</Label>
                <Textarea
                  id="plumaje"
                  value={formData.plumaje}
                  onChange={e => handleChange('plumaje', e.target.value)}
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="alimentacion">Alimentación</Label>
                <Textarea
                  id="alimentacion"
                  value={formData.alimentacion}
                  onChange={e => handleChange('alimentacion', e.target.value)}
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sonido">URL de Sonido</Label>
                <Input
                  id="sonido"
                  value={formData.sonido}
                  onChange={e => handleChange('sonido', e.target.value)}
                  placeholder="https://example.com/sounds/pato.mp3"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {editingPato ? 'Actualizar' : 'Agregar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {patos.map(pato => (
          <Card key={pato.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{pato.nombre}</CardTitle>
                  <CardDescription className="italic">
                    {pato.nombreCientifico}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pato)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(pato.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Image
                    src={pato.imagen || '/placeholder.svg'}
                    alt={pato.nombre}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Especie:</strong> {pato.especie}
                  </p>
                  <p className="text-sm">
                    <strong>Hábitat:</strong> {pato.habitat}
                  </p>
                  <p className="text-sm">
                    <strong>Alimentación:</strong> {pato.alimentacion}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {pato.descripcion}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {patos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No hay especies registradas. ¡Agrega la primera!
          </p>
        </div>
      )}
    </div>
  );
}
