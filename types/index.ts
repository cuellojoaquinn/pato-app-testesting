export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  usuario: string;
  contraseña: string;
  rol: 'user' | 'admin';
  plan: 'gratuito' | 'pago';
  fechaRegistro: string;
}

export interface Pato {
  id: string;
  nombre: string;
  nombreCientifico: string;
  descripcion: string;
  comportamiento: string;
  habitat: string;
  plumaje: string;
  alimentacion: string;
  imagen: string;
  sonido: string;
  especie: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: Omit<User, 'id' | 'fechaRegistro' | 'rol' | 'plan'>
  ) => Promise<boolean>;
  logout: () => void;
  updateUserPlan: (plan: 'gratuito' | 'pago') => void;
}
