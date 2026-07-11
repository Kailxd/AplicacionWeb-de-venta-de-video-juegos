import { VideoGame } from './types';

export const VIDEO_GAMES_CATALOG: VideoGame[] = [
  {
    id: 'g1',
    title: 'Elden Ring: Shadow of the Erdtree',
    price: 69.99,
    description: 'De la mano de Hidetaka Miyazaki y George R. R. Martin llega una nueva aventura en las Tierras Sombrías llenas de misterios, mazmorras peligrosas y nuevos jefes legendarios.',
    category: 'PS5',
    platforms: ['PS5', 'Xbox', 'PC'],
    image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/jentG1Cyp9s', // Embeddable official trailer
    rating: 4.9,
    developer: 'FromSoftware',
    releaseDate: '21 Jun 2024',
    isFeatured: true,
    stock: 15
  },
  {
    id: 'g2',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    price: 59.99,
    description: 'Una aventura épica a lo largo de la tierra y los cielos de Hyrule en esta aclamada secuela. Crea tus propias armas y vehículos con el poder de la Ultramano.',
    category: 'Nintendo Switch',
    platforms: ['Nintendo Switch'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/NKvBKwO1ZnE', // Embeddable Zelda trailer
    rating: 4.8,
    developer: 'Nintendo EPD',
    releaseDate: '12 May 2023',
    isFeatured: true,
    stock: 8
  },
  {
    id: 'g3',
    title: 'Cyberpunk 2077: Ultimate Edition',
    price: 49.99,
    description: 'Conviértete en V, un mercenario cyberpunk en la megalópolis de Night City. Incluye la aclamada expansión de espionaje y suspenso Phantom Liberty.',
    category: 'PC',
    platforms: ['PC', 'PS5', 'Xbox'],
    image: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/8X2kIfS6fb8', // Cyberpunk
    rating: 4.6,
    developer: 'CD Projekt Red',
    releaseDate: '05 Dec 2023',
    isFeatured: true,
    stock: 20
  },
  {
    id: 'g4',
    title: 'Marvel\'s Spider-Man 2',
    price: 79.99,
    description: 'Los Spider-Men Peter Parker y Miles Morales regresan para una nueva y espectacular aventura en la que balancearse por una Nueva York ampliada y enfrentar a Venom.',
    category: 'PS5',
    platforms: ['PS5', 'PC'],
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/DdndgMIuIGA', // Embeddable Spider-Man 2 trailer
    rating: 4.7,
    developer: 'Insomniac Games',
    releaseDate: '20 Oct 2023',
    isFeatured: false,
    stock: 12
  },
  {
    id: 'g5',
    title: 'Red Dead Redemption 2',
    price: 39.99,
    description: 'La épica historia del forajido Arthur Morgan y la banda de Van der Linde mientras huyen a través del vasto y salvaje corazón de América al final de la era del salvaje oeste.',
    category: 'Xbox',
    platforms: ['Xbox', 'PS5', 'PC'],
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/eaW0tYpxyp0', // Embeddable RDR2 trailer
    rating: 4.9,
    developer: 'Rockstar Games',
    releaseDate: '26 Oct 2018',
    isFeatured: false,
    stock: 6
  },
  {
    id: 'g6',
    title: 'Super Mario Bros. Wonder',
    price: 54.99,
    description: 'Encuentra lo inesperado en cada esquina con la nueva Flor Maravilla que cambia el nivel de formas locas y divertivas en este clásico plataformas en 2D.',
    category: 'Nintendo Switch',
    platforms: ['Nintendo Switch'],
    image: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/JStAYvbeSHc', // Mario Wonder
    rating: 4.8,
    developer: 'Nintendo',
    releaseDate: '20 Oct 2023',
    isFeatured: false,
    stock: 14
  },
  {
    id: 'g7',
    title: 'Halo Infinite: Campaign',
    price: 29.99,
    description: 'Cuando toda esperanza se ha perdido y el destino de la humanidad pende de un hilo, el Jefe Maestro está listo para enfrentarse al enemigo más despiadado que jamás haya conocido.',
    category: 'Xbox',
    platforms: ['Xbox', 'PC'],
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/CpVm4Mvecbk', // Halo Infinite
    rating: 4.4,
    developer: '343 Industries',
    releaseDate: '08 Dec 2021',
    isFeatured: false,
    stock: 10
  },
  {
    id: 'g8',
    title: 'Hades II',
    price: 29.99,
    description: 'Ábrete paso más allá del Inframundo utilizando hechicería oscura para enfrentarte al mismísimo Titán del Tiempo en esta fascinante secuela del galardonado juego de exploración de mazmorras.',
    category: 'PC',
    platforms: ['PC', 'PS5', 'Xbox'],
    image: 'https://images.unsplash.com/photo-1608178398319-48f814d0750c?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/txQKYcbIAHU', // Hades II
    rating: 4.9,
    developer: 'Supergiant Games',
    releaseDate: '06 May 2024',
    isFeatured: false,
    stock: 25
  },
  {
    id: 'g9',
    title: 'Grand Theft Auto V',
    price: 29.99,
    description: 'Experimenta el aclamado juego de mundo abierto de Rockstar Games. Explora el vasto mundo de Los Santos y Blaine County en la experiencia de acción definitiva.',
    category: 'PS5',
    platforms: ['PS5', 'Xbox', 'PC'],
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/QkkoHAzjnUs', // GTA V Launch Trailer
    rating: 4.8,
    developer: 'Rockstar Games',
    releaseDate: '15 Mar 2022',
    isFeatured: false,
    stock: 18
  },
  {
    id: 'g10',
    title: 'God of War Ragnarök',
    price: 59.99,
    description: 'Embárcate en un viaje épico y emotivo junto a Kratos y Atreus mientras luchan por aferrarse y soltar. Una aventura mitológica nórdica sin precedentes.',
    category: 'PS5',
    platforms: ['PS5', 'PC'],
    image: 'https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/Dc5xOGS1oJ0', // God of War Ragnarök
    rating: 4.9,
    developer: 'Santa Monica Studio',
    releaseDate: '09 Nov 2022',
    isFeatured: true,
    stock: 11
  },
  {
    id: 'g11',
    title: 'EA SPORTS FC 24',
    price: 39.99,
    description: 'La nueva era del juego mundial. Incluye HyperMotionV, PlayStyles optimizados por Opta y un motor Frostbite revolucionado con las ligas y torneos más grandes.',
    category: 'Xbox',
    platforms: ['PS5', 'Xbox', 'PC', 'Nintendo Switch'],
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/DGpLwSGwYOo', // FC 24 Reveal
    rating: 4.2,
    developer: 'EA Vancouver',
    releaseDate: '29 Sep 2023',
    isFeatured: false,
    stock: 30
  },
  {
    id: 'g12',
    title: 'Resident Evil 4',
    price: 49.99,
    description: 'Sobrevivir es solo el principio. Seis años después del desastre biológico en Raccoon City, Leon S. Kennedy es enviado a rescatar a la hija del presidente en un aislado pueblo europeo.',
    category: 'PC',
    platforms: ['PS5', 'Xbox', 'PC'],
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=600&auto=format&fit=crop',
    trailerUrl: 'https://www.youtube.com/embed/j5Ic2z3_xp0', // RE4 Remake Trailer
    rating: 4.8,
    developer: 'Capcom',
    releaseDate: '24 Mar 2023',
    isFeatured: false,
    stock: 14
  }
];

export const TRAILERS_GALLERY = [
  {
    id: 't1',
    title: 'Elden Ring: Shadow of the Erdtree',
    embedId: 'jentG1Cyp9s',
    gameId: 'g1',
    description: 'Tráiler oficial de revelación del galardonado juego del año.'
  },
  {
    id: 't2',
    title: 'The Legend of Zelda: Tears of the Kingdom',
    embedId: 'NKvBKwO1ZnE',
    gameId: 'g2',
    description: 'Espectacular tercer tráiler oficial del aclamado juego de Nintendo.'
  },
  {
    id: 't3',
    title: 'Cyberpunk 2077: Phantom Liberty',
    embedId: '8X2kIfS6fb8',
    gameId: 'g3',
    description: 'Tráiler cinematográfico del thriller de espías de Night City.'
  },
  {
    id: 't4',
    title: 'Marvel\'s Spider-Man 2',
    embedId: 'DdndgMIuIGA',
    gameId: 'g4',
    description: 'Tráiler de la historia oficial donde Peter y Miles enfrentan a Venom.'
  },
  {
    id: 't5',
    title: 'Red Dead Redemption 2',
    embedId: 'eaW0tYpxyp0',
    gameId: 'g5',
    description: 'Tráiler oficial de Rockstar Games que retrata la caída del salvaje oeste.'
  },
  {
    id: 't6',
    title: 'Super Mario Bros. Wonder',
    embedId: 'JStAYvbeSHc',
    gameId: 'g6',
    description: 'La locura de la Flor Maravilla se desata en este tráiler oficial.'
  },
  {
    id: 't7',
    title: 'Halo Infinite: Campaign',
    embedId: 'CpVm4Mvecbk',
    gameId: 'g7',
    description: 'Tráiler de lanzamiento de la campaña con el épico Jefe Maestro.'
  },
  {
    id: 't8',
    title: 'Hades II',
    embedId: 'txQKYcbIAHU',
    gameId: 'g8',
    description: 'Tráiler oficial de revelación de la secuela del premiado rogue-like.'
  },
  {
    id: 't9',
    title: 'Grand Theft Auto V',
    embedId: 'QkkoHAzjnUs',
    gameId: 'g9',
    description: 'Tráiler oficial de lanzamiento para consolas de nueva generación.'
  },
  {
    id: 't10',
    title: 'God of War Ragnarök',
    embedId: 'Dc5xOGS1oJ0',
    gameId: 'g10',
    description: 'Impresionante tráiler de lanzamiento sobre el destino final de la saga nórdica.'
  },
  {
    id: 't11',
    title: 'EA SPORTS FC 24',
    embedId: 'DGpLwSGwYOo',
    gameId: 'g11',
    description: 'La revelación de la jugabilidad y la tecnología HyperMotionV.'
  },
  {
    id: 't12',
    title: 'Resident Evil 4',
    embedId: 'j5Ic2z3_xp0',
    gameId: 'g12',
    description: 'Tráiler oficial del rediseño completo de este clásico del survival horror.'
  }
];

export const STORE_INFO = {
  name: 'Game Shop León',
  address: 'Av. País Leonés, 12, 24010 León, España',
  phone: '+34 987 123 456',
  email: 'contacto@gameshopleon.es',
  hours: [
    { days: 'Lunes a Viernes', time: '10:00 - 14:00 y 17:00 - 21:00' },
    { days: 'Sábados', time: '10:00 - 14:30 y 16:30 - 20:30' },
    { days: 'Domingos y Festivos', time: 'Cerrado (¡A jugar en casa!)' }
  ],
  socials: {
    facebook: 'https://www.facebook.com/share/1DMjrULh8W/',
    instagram: 'https://www.instagram.com/videojuegosgame?igsh=MWhiZjMzMnV6aDYxaA=='
  },
  locationCoords: {
    lat: 42.6074,
    lng: -5.5898 // Approximate for Av. País Leonés, León, Spain
  }
};
