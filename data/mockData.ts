import type { User, Pato } from "@/types"

export const mockUsers: User[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@example.com",
    usuario: "juanperez",
    contraseña: "123456",
    rol: "admin",
    plan: "pago",
    fechaRegistro: "2024-01-15",
  },
  {
    id: "2",
    nombre: "María",
    apellido: "González",
    email: "maria@example.com",
    usuario: "mariagonzalez",
    contraseña: "123456",
    rol: "user",
    plan: "gratuito",
    fechaRegistro: "2024-02-20",
  },
]

export const mockPatos: Pato[] = [
  {
    id: "1",
    nombre: "Pato Barcino",
    nombreCientifico: "Anas flavirostris",
    descripcion:
      "Pato de tamaño mediano, muy común en Argentina. Se caracteriza por su plumaje moteado y su adaptabilidad a diversos ambientes acuáticos.",
    comportamiento: "Gregario, forma bandadas numerosas. Muy activo durante el amanecer y atardecer.",
    habitat: "Lagunas, esteros, ríos de corriente lenta y ambientes palustres",
    plumaje: "Dorso pardo moteado, vientre blanquecino con manchas oscuras, pico amarillo",
    alimentacion: "Omnívoro: semillas, plantas acuáticas, invertebrados",
    especie: "Anas",
    imagen: "/placeholder.svg?height=300&width=400",
    sonido: "https://example.com/sounds/pato-barcino.mp3",
  },
  {
    id: "2",
    nombre: "Pato Sirirí Pampa",
    nombreCientifico: "Dendrocygna viduata",
    descripcion:
      "Pato silbador de aspecto elegante, con cuello largo y patas largas. Es una especie migratoria que visita Argentina.",
    comportamiento: "Muy gregario, forma grandes bandadas. Emite silbidos característicos en vuelo.",
    habitat: "Lagunas profundas, esteros y humedales con vegetación abundante",
    plumaje: "Cabeza y cuello blancos con corona negra, dorso castaño, flancos rayados",
    alimentacion: "Principalmente vegetariano: semillas, brotes tiernos, algas",
    especie: "Dendrocygna",
    imagen: "/placeholder.svg?height=300&width=400",
    sonido: "https://example.com/sounds/siriri-pampa.mp3",
  },
  {
    id: "3",
    nombre: "Pato Picazo",
    nombreCientifico: "Netta peposaca",
    descripcion: "Pato buceador robusto, endémico de Sudamérica. Los machos presentan un llamativo plumaje nupcial.",
    comportamiento: "Buceador experto, puede sumergirse hasta 3 metros de profundidad.",
    habitat: "Lagunas profundas, embalses y grandes cuerpos de agua",
    plumaje: "Macho: cabeza negra con reflejos verdes, pecho castaño. Hembra: parda con vientre claro",
    alimentacion: "Moluscos, crustáceos, plantas acuáticas sumergidas",
    especie: "Netta",
    imagen: "/placeholder.svg?height=300&width=400",
    sonido: "https://example.com/sounds/pato-picazo.mp3",
  },
  {
    id: "4",
    nombre: "Pato Maicero",
    nombreCientifico: "Anas georgica",
    descripcion:
      "Pato de gran tamaño, común en la región patagónica y centro de Argentina. Muy adaptable a diferentes ambientes.",
    comportamiento: "Territorial durante la época reproductiva, forma parejas estables.",
    habitat: "Lagos, lagunas, ríos y costas marinas",
    plumaje: "Plumaje general pardo con tonos rojizos, espejo alar verde brillante",
    alimentacion: "Omnívoro: vegetación acuática, invertebrados, pequeños peces",
    especie: "Anas",
    imagen: "/placeholder.svg?height=300&width=400",
    sonido: "https://example.com/sounds/pato-maicero.mp3",
  },
  {
    id: "5",
    nombre: "Pato Cuchara",
    nombreCientifico: "Spatula platalea",
    descripcion:
      "Pato distintivo por su pico en forma de cuchara, utilizado para filtrar el agua en busca de alimento.",
    comportamiento: "Nada en círculos para crear corrientes que concentren el alimento.",
    habitat: "Lagunas someras, bañados y humedales con agua poco profunda",
    plumaje: "Macho: cabeza verde, pecho blanco, flancos castaños. Hembra: moteada en tonos pardos",
    alimentacion: "Filtrador: plancton, semillas pequeñas, invertebrados microscópicos",
    especie: "Spatula",
    imagen: "/placeholder.svg?height=300&width=400",
    sonido: "https://example.com/sounds/pato-cuchara.mp3",
  },
]
