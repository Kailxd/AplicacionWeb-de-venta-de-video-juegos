import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';

// Railway automatically provides DATABASE_URL
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/gameshop';

export const realPool = new Pool({
  connectionString,
  ssl: isProduction || connectionString.includes('railway.app') || connectionString.includes('neon.tech') || connectionString.includes('supabase')
    ? { rejectUnauthorized: false }
    : false,
});

// Resiliency flag: False means we use mock in-memory fallback
export let dbOnline = true;

// Mock in-memory tables for local sandbox fallback
const memoryCategories = [
  { id_cat: 1, nom_cat: 'Acción / RPG', desc_cat: 'Juegos de rol con intensos combates en tiempo real.' },
  { id_cat: 2, nom_cat: 'Aventura / Mundo Abierto', desc_cat: 'Exploración de mundos inmensos y narrativas profundas.' },
  { id_cat: 3, nom_cat: 'Plataformas', desc_cat: 'Niveles llenos de saltos, obstáculos y diversión.' },
  { id_cat: 4, nom_cat: 'Acción / Aventura', desc_cat: 'Combates, puzles y exploración en una sola experiencia.' }
];

const memoryPlatforms = [
  { id_pla: 1, nom_pla: 'PS5' },
  { id_pla: 2, nom_pla: 'Xbox' },
  { id_pla: 3, nom_pla: 'Nintendo Switch' },
  { id_pla: 4, nom_pla: 'PC' }
];

const memoryProducts = [
  {
    id_pro: 1,
    nom_pro: 'Elden Ring: Shadow of the Erdtree',
    precio: 69.99,
    desc_pro: 'De la mano de Hidetaka Miyazaki y George R. R. Martin llega una nueva aventura en las Tierras Sombrías llenas de misterios, mazmorras peligrosas y nuevos jefes legendarios.',
    plataforma_id_pla: 1,
    platforms: ['PS5', 'Xbox', 'PC'],
    categoria_id_cat: 1,
    image: 'https://www.adrenaline.com.br/wp-content/uploads/2024/06/Abaixar-a-dificuldade-de-Elden-Ring-quebraria-o-jogo-afirma-diretor.jpg',
    trailer_url: 'https://www.youtube.com/embed/jentG1Cyp9s',
    rating: 4.9,
    developer: 'FromSoftware',
    release_date: '21 Jun 2024',
    is_featured: true,
    dis_pro: 15
  },
  {
    id_pro: 2,
    nom_pro: 'The Legend of Zelda: Tears of the Kingdom',
    precio: 59.99,
    desc_pro: 'Una aventura épica a lo largo de la tierra y los cielos de Hyrule en esta aclamada secuela. Crea tus propias armas y vehículos con el poder de la Ultramano.',
    plataforma_id_pla: 3,
    platforms: ['Nintendo Switch'],
    categoria_id_cat: 2,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_ZefYbkdAmEt_wwJ1nvCgfZuGe0tWsCKt8sQxp_YXz6FMMqmMdTir5rH1&s=10',
    trailer_url: 'https://www.youtube.com/embed/NKvBKwO1ZnE',
    rating: 4.8,
    developer: 'Nintendo EPD',
    release_date: '12 May 2023',
    is_featured: true,
    dis_pro: 8
  },
  {
    id_pro: 3,
    nom_pro: 'Cyberpunk 2077: Ultimate Edition',
    precio: 49.99,
    desc_pro: 'Conviértete en V, un mercenario cyberpunk en la megalópolis de Night City. Incluye la aclamada expansión de espionaje y suspenso Phantom Liberty.',
    plataforma_id_pla: 4,
    platforms: ['PC', 'PS5', 'Xbox'],
    categoria_id_cat: 1,
    image: 'https://es.kotaku.com/app/uploads/2026/03/Diseno-sin-titulo-2026-03-14T170348.505.jpg',
    trailer_url: 'https://www.youtube.com/embed/8X2kIfS6fb8',
    rating: 4.6,
    developer: 'CD Projekt Red',
    release_date: '05 Dec 2023',
    is_featured: true,
    dis_pro: 20
  },
  {
    id_pro: 4,
    nom_pro: 'Marvel\'s Spider-Man 2',
    precio: 79.99,
    desc_pro: 'Los Spider-Men Peter Parker y Miles Morales regresan para una nueva y espectacular aventura en la que balancearse por una Nueva York ampliada y enfrentar a Venom.',
    plataforma_id_pla: 1,
    platforms: ['PS5', 'PC'],
    categoria_id_cat: 4,
    image: 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/e66c4ae18c5d8e3986a24599b293162a6f5c9eba22968d2c.jpg',
    trailer_url: 'https://www.youtube.com/embed/DdndgMIuIGA',
    rating: 4.7,
    developer: 'Insomniac Games',
    release_date: '20 Oct 2023',
    is_featured: false,
    dis_pro: 12
  },
  {
    id_pro: 5,
    nom_pro: 'Red Dead Redemption 2',
    precio: 39.99,
    desc_pro: 'La épica historia del forajido Arthur Morgan y la banda de Van der Linde mientras huyen a través del vasto y salvaje corazón de América al final de la era del salvaje oeste.',
    plataforma_id_pla: 2,
    platforms: ['Xbox', 'PS5', 'PC'],
    categoria_id_cat: 2,
    image: 'https://i.blogs.es/41c79d/rdr2_officialart2_desktop/1366_2000.jpeg',
    trailer_url: 'https://www.youtube.com/embed/eaW0tYpxyp0',
    rating: 4.9,
    developer: 'Rockstar Games',
    release_date: '26 Oct 2018',
    is_featured: false,
    dis_pro: 6
  },
  {
    id_pro: 6,
    nom_pro: 'Super Mario Bros. Wonder',
    precio: 54.99,
    desc_pro: 'Encuentra lo inesperado en cada esquina con la nueva Flor Maravilla que cambia el nivel de formas locas y divertidas en este clásico plataformas en 2D.',
    plataforma_id_pla: 3,
    platforms: ['Nintendo Switch'],
    categoria_id_cat: 3,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC6fI6p-xRrOG2Y7SGzYxl5rbN-mpd_V0RFHcGb1UuFeBpGiUCWtmRBWA&s=10',
    trailer_url: 'https://www.youtube.com/embed/JStAYvbeSHc',
    rating: 4.8,
    developer: 'Nintendo',
    release_date: '20 Oct 2023',
    is_featured: false,
    dis_pro: 14
  },
  {
    id_pro: 7,
    nom_pro: 'Halo Infinite: Campaign',
    precio: 29.99,
    desc_pro: 'Cuando toda esperanza se ha perdido y el destino de la humanidad pende de un hilo, el Jefe Maestro está listo para enfrentarse al enemigo más despiadado que jamás haya conocido.',
    plataforma_id_pla: 2,
    platforms: ['Xbox', 'PC'],
    categoria_id_cat: 4,
    image: 'https://i.ytimg.com/vi/HZtc5-syeAk/maxresdefault.jpg',
    trailer_url: 'https://www.youtube.com/embed/CpVm4Mvecbk',
    rating: 4.4,
    developer: '343 Industries',
    release_date: '08 Dec 2021',
    is_featured: false,
    dis_pro: 10
  },
  {
    id_pro: 8,
    nom_pro: 'Hades II',
    precio: 29.99,
    desc_pro: 'Ábrete paso más allá del Inframundo utilizando hechicería oscura para enfrentarte al mismísimo Titán del Tiempo en esta fascinante secuela del galardonado juego de exploración de mazmorras.',
    plataforma_id_pla: 4,
    platforms: ['PC', 'PS5', 'Xbox'],
    categoria_id_cat: 1,
    image: 'https://assets.nintendo.com/image/upload/q_auto/f_auto/store/software/switch2/70010000105526/4ea19bfcd0c389ee5d02bb0c9bbb562802c40b73eba39e1582ac057ea7f73ad4',
    trailer_url: 'https://www.youtube.com/embed/txQKYcbIAHU',
    rating: 4.9,
    developer: 'Supergiant Games',
    release_date: '06 May 2024',
    is_featured: false,
    dis_pro: 25
  },
  {
    id_pro: 9,
    nom_pro: 'Grand Theft Auto V',
    precio: 29.99,
    desc_pro: 'Experimenta el aclamado juego de mundo abierto de Rockstar Games. Explora el vasto mundo de Los Santos y Blaine County en la experiencia de acción definitiva.',
    plataforma_id_pla: 1,
    platforms: ['PS5', 'Xbox', 'PC'],
    categoria_id_cat: 2,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxAM5tudjfue-hYYkxVWUIYGZ6w8vMNN4jj5U-ZSD7iliIxgamYTKZrsQ&s=10',
    trailer_url: 'https://www.youtube.com/embed/QkkoHAzjnUs',
    rating: 4.8,
    developer: 'Rockstar Games',
    release_date: '15 Mar 2022',
    is_featured: false,
    dis_pro: 18
  },
  {
    id_pro: 10,
    nom_pro: 'God of War Ragnarök',
    precio: 59.99,
    desc_pro: 'Embárcate en un viaje épico y emotivo junto a Kratos y Atreus mientras luchan por aferrarse y soltar. Una aventura mitológica nórdica sin precedentes.',
    plataforma_id_pla: 1,
    platforms: ['PS5', 'PC'],
    categoria_id_cat: 1,
    image: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1117/4uH3OH4dQtHMe2gmdFuth02u.jpg',
    trailer_url: 'https://www.youtube.com/embed/Dc5xOGS1oJ0',
    rating: 4.9,
    developer: 'Santa Monica Studio',
    release_date: '09 Nov 2022',
    is_featured: true,
    dis_pro: 11
  },
  {
    id_pro: 11,
    nom_pro: 'EA SPORTS FC 24',
    precio: 39.99,
    desc_pro: 'La nueva era del juego mundial. Incluye HyperMotionV, PlayStyles optimizados por Opta y un motor Frostbite revolucionado con las ligas y torneos más grandes.',
    plataforma_id_pla: 2,
    platforms: ['PS5', 'Xbox', 'PC', 'Nintendo Switch'],
    categoria_id_cat: 4,
    image: 'https://image.api.playstation.com/vulcan/ap/rnd/202408/0817/31148e51a8883f275f48ac0c91583d688dd2ea35db2a8294.jpg',
    trailer_url: 'https://www.youtube.com/embed/DGpLwSGwYOo',
    rating: 4.2,
    developer: 'EA Vancouver',
    release_date: '29 Sep 2023',
    is_featured: false,
    dis_pro: 30
  },
  {
    id_pro: 12,
    nom_pro: 'Resident Evil 4',
    precio: 49.99,
    desc_pro: 'Sobrevivir es solo el principio. Seis años después del desastre biológico en Raccoon City, Leon S. Kennedy es enviado a rescatar a la hija del presidente en un aislado pueblo europeo.',
    plataforma_id_pla: 4,
    platforms: ['PS5', 'Xbox', 'PC'],
    categoria_id_cat: 4,
    image: 'https://juegosdigitalesmexico.mx/files/images/noticias/1656977797-6.jpg',
    trailer_url: 'https://www.youtube.com/embed/j5Ic2z3_xp0',
    rating: 4.8,
    developer: 'Capcom',
    release_date: '24 Mar 2023',
    is_featured: false,
    dis_pro: 14
  }
];

const memoryUsers: any[] = [
  { id_us: 1, nom_us: 'Carlos Mendoza', correo: 'carlos.m@example.com', pass_hash: 'guest_password_123' },
  { id_us: 2, nom_us: 'Sofía Rodríguez', correo: 'sofia.rod@example.com', pass_hash: 'guest_password_123' },
  { id_us: 3, nom_us: 'Alejandro Gómez', correo: 'ale.gomez@example.com', pass_hash: 'guest_password_123' },
  { id_us: 4, nom_us: 'Laura Torres', correo: 'laura.t@example.com', pass_hash: 'guest_password_123' },
  { id_us: 5, nom_us: 'Mateo Silva', correo: 'mateo.silva@example.com', pass_hash: 'guest_password_123' },
  
  { id_us: 6, nom_us: 'Diego Ramos', correo: 'diego.r@example.com', pass_hash: 'guest_password_123' },
  { id_us: 7, nom_us: 'Elena Ortiz', correo: 'elena.ort@example.com', pass_hash: 'guest_password_123' },
  { id_us: 8, nom_us: 'Javier López', correo: 'javier.l@example.com', pass_hash: 'guest_password_123' },
  { id_us: 9, nom_us: 'Lucía Castro', correo: 'lucia.c@example.com', pass_hash: 'guest_password_123' },
  { id_us: 10, nom_us: 'Marcos Ruiz', correo: 'marcos.r@example.com', pass_hash: 'guest_password_123' },
  { id_us: 11, nom_us: 'Patricia Sanz', correo: 'patricia.s@example.com', pass_hash: 'guest_password_123' },
  { id_us: 12, nom_us: 'Álvaro G.', correo: 'alvaro.g@example.com', pass_hash: 'guest_password_123' },
  { id_us: 13, nom_us: 'Clara Méndez', correo: 'clara.m@example.com', pass_hash: 'guest_password_123' },
  { id_us: 14, nom_us: 'Roberto Díaz', correo: 'roberto.d@example.com', pass_hash: 'guest_password_123' },
  { id_us: 15, nom_us: 'Nerea Marín', correo: 'nerea.m@example.com', pass_hash: 'guest_password_123' },
  { id_us: 16, nom_us: 'Hugo Felipe', correo: 'hugo.f@example.com', pass_hash: 'guest_password_123' },
  { id_us: 17, nom_us: 'Sonia Vega', correo: 'sonia.v@example.com', pass_hash: 'guest_password_123' },
  { id_us: 18, nom_us: 'Andrés B.', correo: 'andres.b@example.com', pass_hash: 'guest_password_123' },
  { id_us: 19, nom_us: 'Isabel Domínguez', correo: 'isabel.d@example.com', pass_hash: 'guest_password_123' },
  { id_us: 20, nom_us: 'Tomás Alarcón', correo: 'tomas.a@example.com', pass_hash: 'guest_password_123' },
  { id_us: 21, nom_us: 'Valeria Soler', correo: 'valeria.s@example.com', pass_hash: 'guest_password_123' }
];

const memoryComments: any[] = [
  // General comments (Store reviews) - producto_id_pro: null
  { id_comt: 1, comen: '¡Increíble servicio! El envío a domicilio en León llegó súper rápido y los precios son excelentes.', usuario_id_us: 1, producto_id_pro: null, fecha_com: new Date(), rating: 5 },
  { id_comt: 2, comen: 'La mejor tienda de videojuegos en la zona. Tienen un stock muy variado y consolas difíciles de conseguir.', usuario_id_us: 2, producto_id_pro: null, fecha_com: new Date(), rating: 5 },
  { id_comt: 3, comen: 'Atención al cliente excepcional. Me ayudaron a elegir el regalo perfecto para mi hijo. Volveré sin duda.', usuario_id_us: 3, producto_id_pro: null, fecha_com: new Date(), rating: 5 },
  { id_comt: 4, comen: 'Me encanta el programa de fidelización y las ofertas semanales. La web es muy intuitiva y rápida.', usuario_id_us: 4, producto_id_pro: null, fecha_com: new Date(), rating: 4 },
  { id_comt: 5, comen: 'Súper confiable. He comprado varios juegos digitales y físicos, y todo llega siempre perfecto y a tiempo.', usuario_id_us: 5, producto_id_pro: null, fecha_com: new Date(), rating: 5 },

  // Elden Ring (producto_id_pro: 1)
  { id_comt: 6, comen: '¡Una obra maestra! El mapa es gigantesco y los nuevos jefes son un reto espectacular.', usuario_id_us: 6, producto_id_pro: 1, fecha_com: new Date(), rating: 5 },
  { id_comt: 7, comen: 'La atmósfera es increíble. Visual y artísticamente es de lo mejor que ha hecho FromSoftware.', usuario_id_us: 7, producto_id_pro: 1, fecha_com: new Date(), rating: 5 },

  // Zelda Tears of the Kingdom (producto_id_pro: 2)
  { id_comt: 8, comen: 'La Ultramano añade una libertad creativa impresionante. Puedes pasar horas solo construyendo cosas.', usuario_id_us: 8, producto_id_pro: 2, fecha_com: new Date(), rating: 5 },
  { id_comt: 9, comen: 'Una continuación perfecta de Breath of the Wild. Las islas del cielo y el subsuelo duplican la aventura.', usuario_id_us: 9, producto_id_pro: 2, fecha_com: new Date(), rating: 5 },

  // Cyberpunk 2077 (producto_id_pro: 3)
  { id_comt: 10, comen: 'Por fin el juego está como debió salir. La expansión Phantom Liberty tiene una narrativa espectacular.', usuario_id_us: 10, producto_id_pro: 3, fecha_com: new Date(), rating: 4 },
  { id_comt: 11, comen: 'Night City se siente súper viva y el rendimiento en PS5 ahora es excelente. Juegazo indispensable.', usuario_id_us: 11, producto_id_pro: 3, fecha_com: new Date(), rating: 5 },

  // Spider-Man 2 (producto_id_pro: 4)
  { id_comt: 12, comen: 'El balanceo y el planeo con las alitas son increíblemente fluidos. Gran historia de Peter y Miles.', usuario_id_us: 12, producto_id_pro: 4, fecha_com: new Date(), rating: 5 },
  { id_comt: 13, comen: 'Visualmente exprime al máximo la consola. Las transiciones rápidas y los combates con Venom son brutales.', usuario_id_us: 13, producto_id_pro: 4, fecha_com: new Date(), rating: 4 },

  // Red Dead Redemption 2 (producto_id_pro: 5)
  { id_comt: 14, comen: 'El juego con el mundo abierto más vivo y realista jamás creado. La historia de Arthur Morgan es insuperable.', usuario_id_us: 14, producto_id_pro: 5, fecha_com: new Date(), rating: 5 },
  { id_comt: 15, comen: 'Una obra de arte absoluta. La atención al detalle en cada rincón es simplemente asombrosa.', usuario_id_us: 15, producto_id_pro: 5, fecha_com: new Date(), rating: 5 },

  // Super Mario Bros. Wonder (producto_id_pro: 6)
  { id_comt: 16, comen: 'Súper divertido e innovador. Las flores maravilla hacen que cada nivel sea una sorpresa constante.', usuario_id_us: 16, producto_id_pro: 6, fecha_com: new Date(), rating: 5 },
  { id_comt: 17, comen: 'El diseño de niveles es brillante y jugar con amigos o familia es de lo más divertido.', usuario_id_us: 17, producto_id_pro: 6, fecha_com: new Date(), rating: 5 },

  // Halo Infinite (producto_id_pro: 7)
  { id_comt: 18, comen: 'La jugabilidad clásica de Halo en un entorno de mundo abierto. El gancho de agarre es sumamente adictivo.', usuario_id_us: 18, producto_id_pro: 7, fecha_com: new Date(), rating: 4 },
  { id_comt: 19, comen: 'Gran banda sonora y una jugabilidad muy bien pulida. Un buen reinicio para las aventuras del Jefe Maestro.', usuario_id_us: 19, producto_id_pro: 7, fecha_com: new Date(), rating: 4 },

  // Hades II (producto_id_pro: 8)
  { id_comt: 20, comen: 'Melinoë se siente única y diferente de Zagreus. Las nuevas armas y hechizos son excelentes.', usuario_id_us: 20, producto_id_pro: 8, fecha_com: new Date(), rating: 5 },
  { id_comt: 21, comen: 'Visuales hermosos, música de locura y un gameplay súper adictivo. ¡Supergiant Games nunca falla!', usuario_id_us: 21, producto_id_pro: 8, fecha_com: new Date(), rating: 5 }
];
const memoryMetodoPago: any[] = [];
const memoryCompra: any[] = [];
const memoryDetailCompra: any[] = [];

// Clean query simulation for local in-memory DB
function queryMemoryDB(text: string, params: any[] = []): { rows: any[] } {
  const normText = text.toUpperCase().replace(/\s+/g, ' ');

  // 1. SELECT * FROM USUARIO WHERE CORREO = $1
  if (normText.includes('FROM USUARIO') && normText.includes('CORREO =')) {
    const email = String(params[0] || '').toLowerCase();
    const user = memoryUsers.find(u => u.correo.toLowerCase() === email);
    return { rows: user ? [user] : [] };
  }

  // 2. INSERT INTO USUARIO
  if (normText.includes('INSERT INTO USUARIO')) {
    const id_us = memoryUsers.length + 1;
    const name = params[0];
    const tel = params[1] || null;
    const email = params[2];
    const pass = params[3];
    const newUser = { id_us, nom_us: name, tel_us: tel, correo: email, pass_hash: pass };
    memoryUsers.push(newUser);
    return { rows: [newUser] };
  }

  // 3. SELECT FROM PRODUCTO
  if (normText.includes('FROM PRODUCTO P')) {
    const rows = memoryProducts.map(p => {
      const plat = memoryPlatforms.find(pl => pl.id_pla === p.plataforma_id_pla);
      return {
        id: p.id_pro,
        title: p.nom_pro,
        price: p.precio,
        description: p.desc_pro,
        category: plat ? plat.nom_pla : 'PS5',
        platforms: p.platforms || (plat ? [plat.nom_pla] : ['PS5']),
        image: p.image,
        trailerUrl: p.trailer_url,
        rating: p.rating,
        developer: p.developer,
        releaseDate: p.release_date,
        isFeatured: p.is_featured,
        stock: p.dis_pro
      };
    });
    return { rows };
  }

  // 4. SELECT FROM COMENTARIO
  if (normText.includes('FROM COMENTARIO C')) {
    let filteredComments = memoryComments;
    if (normText.includes('PRODUCTO_ID_PRO =')) {
      const prodId = params[0];
      filteredComments = memoryComments.filter(c => c.producto_id_pro === prodId);
    } else {
      filteredComments = memoryComments.filter(c => c.producto_id_pro === null);
    }
    const rows = filteredComments.map(c => {
      const u = memoryUsers.find(user => user.id_us === c.usuario_id_us);
      return {
        id: c.id_comt,
        userName: u ? u.nom_us : 'Usuario de Game Shop',
        email: u ? u.correo : 'anonimo@correo.com',
        message: c.comen,
        rating: c.rating || 5,
        date: new Date(c.fecha_com).toLocaleDateString('es-ES')
      };
    });
    return { rows };
  }

  // 5. INSERT INTO COMENTARIO
  if (normText.includes('INSERT INTO COMENTARIO')) {
    const id_comt = memoryComments.length + 1;
    const comen = params[0];
    const usuario_id_us = params[1];
    const producto_id_pro = params[2];
    const rating = params[3] || 5;
    const newComment = { id_comt, comen, usuario_id_us, producto_id_pro, rating, fecha_com: new Date() };
    memoryComments.push(newComment);
    return { rows: [newComment] };
  }

  // 6. INSERT INTO METODOPAGO
  if (normText.includes('INSERT INTO METODOPAGO')) {
    const id_met = memoryMetodoPago.length + 1;
    const titular = params[0];
    const num_tar = params[1];
    const expiracion = params[2];
    const cvv = params[3];
    const usuario_id_us = params[4];
    const newPayment = { id_met, titular, num_tar, expiracion, cvv, usuario_id_us };
    memoryMetodoPago.push(newPayment);
    return { rows: [newPayment] };
  }

  // 7. INSERT INTO COMPRA
  if (normText.includes('INSERT INTO COMPRA')) {
    const id_com = memoryCompra.length + 1;
    const usuario_id_us = params[0];
    const newCompra = { id_com, fecha: new Date(), usuario_id_us };
    memoryCompra.push(newCompra);
    return { rows: [newCompra] };
  }

  // 8. INSERT INTO DETAIL_COMPRA
  if (normText.includes('INSERT INTO DETAIL_COMPRA')) {
    const id_det = memoryDetailCompra.length + 1;
    const producto_id_pro = params[0];
    const compra_id_com = params[1];
    const metodopago_id_met = params[2];
    const cant_prod = params[3];
    const precio_final = params[4];
    const newDetail = { id_det, producto_id_pro, compra_id_com, metodopago_id_met, cant_prod, precio_final };
    memoryDetailCompra.push(newDetail);
    return { rows: [newDetail] };
  }

  // 9. UPDATE PRODUCTO SET DIS_PRO
  if (normText.includes('UPDATE PRODUCTO') && normText.includes('DIS_PRO =')) {
    const qty = params[0] || 0;
    const id = params[1];
    const prod = memoryProducts.find(p => p.id_pro === id);
    if (prod) {
      prod.dis_pro = Math.max(0, prod.dis_pro - qty);
    }
    return { rows: [] };
  }

  // 10. SELECT FROM COMPRA WHERE USUARIO_ID_US = $1
  if (normText.includes('FROM COMPRA') && normText.includes('USUARIO_ID_US =')) {
    const userId = params[0];
    const rows = memoryCompra.filter(c => c.usuario_id_us === userId).map(c => {
      const pay = memoryMetodoPago.find(m => m.usuario_id_us === userId);
      return {
        id: c.id_com,
        date: c.fecha,
        titular: pay ? pay.titular : null,
        num_tar: pay ? pay.num_tar : null
      };
    });
    return { rows };
  }

  // 11. SELECT FROM DETAIL_COMPRA WHERE COMPRA_ID_COM = $1
  if (normText.includes('FROM DETAIL_COMPRA') && normText.includes('COMPRA_ID_COM =')) {
    const compraId = params[0];
    const matchedDetails = memoryDetailCompra.filter(dc => dc.compra_id_com === compraId);
    const rows = matchedDetails.map(dc => {
      const prod = memoryProducts.find(p => p.id_pro === dc.producto_id_pro);
      return {
        gameId: dc.producto_id_pro,
        title: prod ? prod.nom_pro : 'Videojuego',
        price: dc.precio_final,
        quantity: dc.cant_prod
      };
    });
    return { rows };
  }

  return { rows: [] };
}

// Intercept wrapper for resilient PG pool operations
export const pool = {
  query: async (text: string, params: any[] = []) => {
    if (dbOnline) {
      try {
        return await realPool.query(text, params);
      } catch (err: any) {
        console.warn('Real Postgres connection is unavailable. Switching transparently to in-memory sandbox DB mode. Details:', err.message);
        dbOnline = false;
      }
    }
    return queryMemoryDB(text, params);
  },
  connect: async () => {
    if (dbOnline) {
      try {
        const client = await realPool.connect();
        return client;
      } catch (err: any) {
        console.warn('Real Postgres connection is unavailable on connect(). Switching transparently to in-memory sandbox DB mode. Details:', err.message);
        dbOnline = false;
      }
    }
    
    // Return mock PoolClient interface
    const mockClient: any = {
      query: async (text: string, params: any[] = []) => {
        return queryMemoryDB(text, params);
      },
      release: () => {},
    };
    return mockClient;
  }
};

export async function initDB() {
  console.log('Attempting to check connection to PostgreSQL database...');
  try {
    const client = await realPool.connect();
    console.log('PostgreSQL database connection successful!');
    
    // Create actual relational database tables with proper schema
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS CATEGORIA (
        ID_CAT SERIAL PRIMARY KEY,
        NOM_CAT VARCHAR(35) UNIQUE NOT NULL,
        DESC_CAT VARCHAR(100) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS PLATAFORMA (
        ID_PLA SERIAL PRIMARY KEY,
        NOM_PLA VARCHAR(35) UNIQUE NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS PRODUCTO (
        ID_PRO SERIAL PRIMARY KEY,
        NOM_PRO VARCHAR(40) UNIQUE NOT NULL,
        DESC_PRO VARCHAR(150) NOT NULL,
        PRECIO DECIMAL(6,2) NOT NULL,
        DIS_PRO INTEGER NOT NULL DEFAULT 10,
        CATEGORIA_ID_CAT INTEGER REFERENCES CATEGORIA(ID_CAT) ON DELETE SET NULL,
        PLATAFORMA_ID_PLA INTEGER REFERENCES PLATAFORMA(ID_PLA) ON DELETE SET NULL,
        IMAGE VARCHAR(255),
        TRAILER_URL VARCHAR(255),
        RATING DECIMAL(2,1),
        DEVELOPER VARCHAR(100),
        RELEASE_DATE VARCHAR(50),
        IS_FEATURED BOOLEAN DEFAULT FALSE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS PRODUCTO_PLATAFORMA (
        PRODUCTO_ID_PRO INTEGER REFERENCES PRODUCTO(ID_PRO) ON DELETE CASCADE,
        PLATAFORMA_ID_PLA INTEGER REFERENCES PLATAFORMA(ID_PLA) ON DELETE CASCADE,
        PRIMARY KEY (PRODUCTO_ID_PRO, PLATAFORMA_ID_PLA)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS USUARIO (
        ID_US SERIAL PRIMARY KEY,
        NOM_US VARCHAR(25) NOT NULL,
        TEL_US VARCHAR(20) UNIQUE,
        CORREO VARCHAR(35) UNIQUE NOT NULL,
        PASS_HASH VARCHAR(225) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS COMENTARIO (
        ID_COMT SERIAL PRIMARY KEY,
        COMEN VARCHAR(100) NOT NULL,
        FECHA_COM DATE NOT NULL DEFAULT CURRENT_DATE,
        USUARIO_ID_US INTEGER REFERENCES USUARIO(ID_US) ON DELETE CASCADE,
        PRODUCTO_ID_PRO INTEGER REFERENCES PRODUCTO(ID_PRO) ON DELETE CASCADE,
        RATING INTEGER NOT NULL DEFAULT 5
      );
    `);

    await client.query(`
      ALTER TABLE COMENTARIO ADD COLUMN IF NOT EXISTS RATING INTEGER NOT NULL DEFAULT 5;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS METODOPAGO (
        ID_MET SERIAL PRIMARY KEY,
        TITULAR VARCHAR(100) NOT NULL,
        NUM_TAR VARCHAR(20) NOT NULL,
        EXPIRACION VARCHAR(10) NOT NULL,
        CVV INTEGER NOT NULL,
        USUARIO_ID_US INTEGER REFERENCES USUARIO(ID_US) ON DELETE CASCADE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS COMPRA (
        ID_COM SERIAL PRIMARY KEY,
        FECHA TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        USUARIO_ID_US INTEGER REFERENCES USUARIO(ID_US) ON DELETE CASCADE
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS DETAIL_COMPRA (
        ID_DET SERIAL PRIMARY KEY,
        PRODUCTO_ID_PRO INTEGER REFERENCES PRODUCTO(ID_PRO) ON DELETE CASCADE,
        COMPRA_ID_COM INTEGER REFERENCES COMPRA(ID_COM) ON DELETE CASCADE,
        METODOPAGO_ID_MET INTEGER REFERENCES METODOPAGO(ID_MET) ON DELETE SET NULL,
        CANT_PRO INTEGER NOT NULL,
        PRECIO_FINAL DECIMAL(8,2) NOT NULL,
        PLATFORM VARCHAR(35)
      );
    `);

    await client.query(`
      ALTER TABLE DETAIL_COMPRA ADD COLUMN IF NOT EXISTS PLATFORM VARCHAR(35);
    `);

    await client.query('COMMIT');
    console.log('Real PostgreSQL tables successfully verified/created.');

    // Seed actual DB tables
    await seedRealData(client);
    client.release();

  } catch (err: any) {
    console.warn('Could not initialize real Postgres database. Switching to clean local in-memory DB fallback mode for development sandbox. Error details:', err.message);
    dbOnline = false;
  }
}

async function seedRealData(client: any) {
  // Check if categories exist
  const catCheck = await client.query('SELECT COUNT(*) FROM CATEGORIA');
  const catCount = parseInt(catCheck.rows[0].count, 10);
  if (catCount === 0) {
    console.log('Seeding initial categories...');
    const categories = [
      { name: 'Acción / RPG', desc: 'Juegos de rol con intensos combates en tiempo real.' },
      { name: 'Aventura / Mundo Abierto', desc: 'Exploración de mundos inmensos y narrativas profundas.' },
      { name: 'Plataformas', desc: 'Niveles llenos de saltos, obstáculos y diversión.' },
      { name: 'Acción / Aventura', desc: 'Combates, puzles y exploración en una sola experiencia.' }
    ];
    for (const cat of categories) {
      await client.query('INSERT INTO CATEGORIA (NOM_CAT, DESC_CAT) VALUES ($1, $2)', [cat.name, cat.desc]);
    }
  }

  // Check if platforms exist
  const platCheck = await client.query('SELECT COUNT(*) FROM PLATAFORMA');
  const platCount = parseInt(platCheck.rows[0].count, 10);
  if (platCount === 0) {
    console.log('Seeding initial platforms...');
    const platforms = ['PS5', 'Xbox', 'Nintendo Switch', 'PC'];
    for (const plat of platforms) {
      await client.query('INSERT INTO PLATAFORMA (NOM_PLA) VALUES ($1)', [plat]);
    }
  }

  // Seed or update products in the real DB
  console.log('Verifying and seeding products into real DB...');
  
  // Select seed categories & platforms to map
  const categoriesRes = await client.query('SELECT ID_CAT, NOM_CAT FROM CATEGORIA');
  const platformsRes = await client.query('SELECT ID_PLA, NOM_PLA FROM PLATAFORMA');
  
  const catMap = new Map(categoriesRes.rows.map((r: any) => [r.nom_cat, r.id_cat]));
  const platMap = new Map(platformsRes.rows.map((r: any) => [r.nom_pla, r.id_pla]));

  for (const g of memoryProducts) {
    const origCat = g.categoria_id_cat === 1 ? 'Acción / RPG' : g.categoria_id_cat === 2 ? 'Aventura / Mundo Abierto' : g.categoria_id_cat === 3 ? 'Plataformas' : 'Acción / Aventura';
    const origPlat = g.plataforma_id_pla === 1 ? 'PS5' : g.plataforma_id_pla === 2 ? 'Xbox' : g.plataforma_id_pla === 3 ? 'Nintendo Switch' : 'PC';
    
    const catId = catMap.get(origCat) || null;
    const platId = platMap.get(origPlat) || null;

    // Check if product exists
    const existing = await client.query('SELECT ID_PRO FROM PRODUCTO WHERE NOM_PRO = $1', [g.nom_pro]);
    if (existing.rows.length > 0) {
      // Update image and trailer_url for existing games (fixes corrupt links)
      const existingId = existing.rows[0].id_pro;
      await client.query(`
        UPDATE PRODUCTO 
        SET IMAGE = $1, TRAILER_URL = $2, PRECIO = $3, PLATAFORMA_ID_PLA = $4, CATEGORIA_ID_CAT = $5
        WHERE ID_PRO = $6
      `, [g.image, g.trailer_url, g.precio, platId, catId, existingId]);

      // Sync platform connections
      const gamePlatforms = g.platforms || [origPlat];
      for (const pName of gamePlatforms) {
        const pId = platMap.get(pName);
        if (pId) {
          await client.query(`
            INSERT INTO PRODUCTO_PLATAFORMA (PRODUCTO_ID_PRO, PLATAFORMA_ID_PLA)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [existingId, pId]);
        }
      }
    } else {
      // Insert new product
      const prodInsert = await client.query(`
        INSERT INTO PRODUCTO (NOM_PRO, DESC_PRO, PRECIO, DIS_PRO, CATEGORIA_ID_CAT, PLATAFORMA_ID_PLA, IMAGE, TRAILER_URL, RATING, DEVELOPER, RELEASE_DATE, IS_FEATURED)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING ID_PRO
      `, [
        g.nom_pro, g.desc_pro, g.precio, g.dis_pro, catId, platId, g.image, g.trailer_url, g.rating, g.developer, g.release_date, g.is_featured
      ]);
      const newProdId = prodInsert.rows[0].id_pro;

      const gamePlatforms = g.platforms || [origPlat];
      for (const pName of gamePlatforms) {
        const pId = platMap.get(pName);
        if (pId) {
          await client.query(`
            INSERT INTO PRODUCTO_PLATAFORMA (PRODUCTO_ID_PRO, PLATAFORMA_ID_PLA)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
          `, [newProdId, pId]);
        }
      }
    }
  }
  console.log('Seeded/Updated real database products successfully!');

  // Ensure PRODUCTO_PLATAFORMA is populated for existing products
  const jCheck = await client.query('SELECT COUNT(*) FROM PRODUCTO_PLATAFORMA');
  const jCount = parseInt(jCheck.rows[0].count, 10);
  if (jCount === 0) {
    console.log('Seeding PRODUCTO_PLATAFORMA join table for existing products...');
    const productsRes = await client.query('SELECT ID_PRO, NOM_PRO, PLATAFORMA_ID_PLA FROM PRODUCTO');
    const platformsRes = await client.query('SELECT ID_PLA, NOM_PLA FROM PLATAFORMA');
    const platMap = new Map(platformsRes.rows.map((r: any) => [r.nom_pla, r.id_pla]));

    for (const row of productsRes.rows) {
      const memGame = memoryProducts.find(p => p.nom_pro === row.nom_pro);
      const platformsToInsert = memGame ? memGame.platforms : [];
      if (platformsToInsert && platformsToInsert.length > 0) {
        for (const pName of platformsToInsert) {
          const pId = platMap.get(pName);
          if (pId) {
            await client.query(`
              INSERT INTO PRODUCTO_PLATAFORMA (PRODUCTO_ID_PRO, PLATAFORMA_ID_PLA)
              VALUES ($1, $2)
              ON CONFLICT DO NOTHING
            `, [row.id_pro, pId]);
          }
        }
      } else if (row.plataforma_id_pla) {
        await client.query(`
          INSERT INTO PRODUCTO_PLATAFORMA (PRODUCTO_ID_PRO, PLATAFORMA_ID_PLA)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [row.id_pro, row.plataforma_id_pla]);
      }
    }
  }

  // Check if comments exist
  const commCheck = await client.query('SELECT COUNT(*) FROM COMENTARIO');
  const commCount = parseInt(commCheck.rows[0].count, 10);
  if (commCount === 0) {
    console.log('Seeding initial users and comments into real DB...');
    
    // Seed users first if they do not exist
    for (const u of memoryUsers) {
      const uCheck = await client.query('SELECT ID_US FROM USUARIO WHERE CORREO = $1', [u.correo]);
      let userId;
      if (uCheck.rows.length > 0) {
        userId = uCheck.rows[0].id_us;
      } else {
        const uIns = await client.query(
          'INSERT INTO USUARIO (NOM_US, CORREO, PASS_HASH) VALUES ($1, $2, $3) RETURNING ID_US',
          [u.nom_us, u.correo, u.pass_hash]
        );
        userId = uIns.rows[0].id_us;
      }
      u.real_id = userId; // temporarily hold mapped database ID
    }

    // Now seed comments
    for (const c of memoryComments) {
      const associatedUser = memoryUsers.find(user => user.id_us === c.usuario_id_us);
      const dbUserId = associatedUser ? associatedUser.real_id : null;
      
      let dbProductId = null;
      if (c.producto_id_pro !== null) {
        const memProd = memoryProducts.find(p => p.id_pro === c.producto_id_pro);
        if (memProd) {
          const prodRes = await client.query('SELECT ID_PRO FROM PRODUCTO WHERE NOM_PRO = $1', [memProd.nom_pro]);
          if (prodRes.rows.length > 0) {
            dbProductId = prodRes.rows[0].id_pro;
          }
        }
      }

      await client.query(
        'INSERT INTO COMENTARIO (COMEN, USUARIO_ID_US, PRODUCTO_ID_PRO, RATING) VALUES ($1, $2, $3, $4)',
        [c.comen, dbUserId, dbProductId, c.rating || 5]
      );
    }
    console.log('Seeded real database comments and users successfully!');
  }
}
