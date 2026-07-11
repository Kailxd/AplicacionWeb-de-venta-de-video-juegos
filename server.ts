import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initDB, pool } from './src/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing and URL encoding middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize DB tables and seed data
  try {
    await initDB();
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
  });

  // 1. Get all video games (Productos joined with Plataforma & Categoria)
  app.get('/api/games', async (req, res) => {
    try {
      const query = `
        SELECT 
          p.ID_PRO as id,
          p.NOM_PRO as title,
          p.PRECIO::float as price,
          p.DESC_PRO as description,
          plat.NOM_PLA as category,
          COALESCE(
            (
              SELECT json_agg(pla.NOM_PLA)
              FROM PRODUCTO_PLATAFORMA pp_sub
              JOIN PLATAFORMA pla ON pp_sub.PLATAFORMA_ID_PLA = pla.ID_PLA
              WHERE pp_sub.PRODUCTO_ID_PRO = p.ID_PRO
            ),
            '[]'::json
          ) as platforms,
          p.IMAGE as image,
          p.TRAILER_URL as "trailerUrl",
          p.RATING::float as rating,
          p.DEVELOPER as developer,
          p.RELEASE_DATE as "releaseDate",
          p.IS_FEATURED as "isFeatured",
          p.DIS_PRO as stock
        FROM PRODUCTO p
        LEFT JOIN PLATAFORMA plat ON p.PLATAFORMA_ID_PLA = plat.ID_PLA
        ORDER BY p.ID_PRO ASC
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err: any) {
      console.error('Error fetching games:', err);
      res.status(500).json({ error: 'Error interno del servidor al obtener catálogo de videojuegos.' });
    }
  });

  // 2. Auth: Register
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, correo electrónico y contraseña son obligatorios.' });
    }

    try {
      // Check if user already exists
      const userCheck = await pool.query('SELECT * FROM USUARIO WHERE CORREO = $1', [email]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      }

      // Simple secure hash or store as-is since DB is Postgres (we will store it safely)
      const tel = phone || null;
      const result = await pool.query(
        'INSERT INTO USUARIO (NOM_US, TEL_US, CORREO, PASS_HASH) VALUES ($1, $2, $3, $4) RETURNING ID_US, NOM_US, CORREO',
        [name, tel, email, password]
      );

      const newUser = {
        id: String(result.rows[0].id_us),
        name: result.rows[0].nom_us,
        email: result.rows[0].correo
      };

      res.status(201).json(newUser);
    } catch (err: any) {
      console.error('Error registering user:', err);
      res.status(500).json({ error: 'Error interno al registrar usuario.' });
    }
  });

  // 3. Auth: Login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios.' });
    }

    try {
      const result = await pool.query(
        'SELECT ID_US, NOM_US, CORREO, PASS_HASH FROM USUARIO WHERE CORREO = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas. Correo no encontrado.' });
      }

      const dbUser = result.rows[0];
      if (dbUser.pass_hash !== password) {
        return res.status(401).json({ error: 'Contraseña incorrecta.' });
      }

      const loggedUser = {
        id: String(dbUser.id_us),
        name: dbUser.nom_us,
        email: dbUser.correo
      };

      res.json(loggedUser);
    } catch (err: any) {
      console.error('Error in login:', err);
      res.status(500).json({ error: 'Error interno durante el inicio de sesión.' });
    }
  });

  // 4. Comments: Get all general/product comments
  app.get('/api/comments', async (req, res) => {
    try {
      const query = `
        SELECT 
          c.ID_COMT as id,
          COALESCE(u.NOM_US, 'Usuario de Game Shop') as "userName",
          COALESCE(u.CORREO, 'anonimo@correo.com') as email,
          c.COMEN as message,
          COALESCE(c.RATING, 5) as rating,
          TO_CHAR(c.FECHA_COM, 'DD/MM/YYYY') as date
        FROM COMENTARIO c
        LEFT JOIN USUARIO u ON c.USUARIO_ID_US = u.ID_US
        WHERE c.PRODUCTO_ID_PRO IS NULL
        ORDER BY c.ID_COMT DESC
      `;
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      res.status(500).json({ error: 'Error al obtener comentarios.' });
    }
  });

  // 5. Comments: Post a comment
  app.post('/api/comments', async (req, res) => {
    const { userName, email, message, rating } = req.body;
    if (!userName || !email || !message) {
      return res.status(400).json({ error: 'Nombre, correo electrónico y mensaje son obligatorios.' });
    }

    try {
      // Find or create Usuario associated with this email
      let userId;
      const userRes = await pool.query('SELECT ID_US FROM USUARIO WHERE CORREO = $1', [email]);
      if (userRes.rows.length > 0) {
        userId = userRes.rows[0].id_us;
      } else {
        // Create a guest/new user record
        const insertUser = await pool.query(
          'INSERT INTO USUARIO (NOM_US, CORREO, PASS_HASH) VALUES ($1, $2, $3) RETURNING ID_US',
          [userName, email, 'guest_password_123']
        );
        userId = insertUser.rows[0].id_us;
      }

      // Store comments keep PRODUCTO_ID_PRO as null
      const commentRes = await pool.query(
        'INSERT INTO COMENTARIO (COMEN, USUARIO_ID_US, PRODUCTO_ID_PRO, RATING) VALUES ($1, $2, $3, $4) RETURNING ID_COMT, FECHA_COM',
        [message, userId, null, rating || 5]
      );

      const dbComment = commentRes.rows[0];

      res.status(201).json({
        id: 'c_' + dbComment.id_comt,
        userName,
        email,
        message,
        rating: rating || 5,
        date: new Date(dbComment.fecha_com).toLocaleDateString('es-ES')
      });
    } catch (err: any) {
      console.error('Error posting comment:', err);
      res.status(500).json({ error: 'Error al publicar comentario.' });
    }
  });

  // 5b. Game-specific comments: Get comments for a single game
  app.get('/api/games/:gameId/comments', async (req, res) => {
    const { gameId } = req.params;
    const gameIdInt = typeof gameId === 'string' ? parseInt(gameId.replace(/[^\d]/g, ''), 10) : gameId;
    try {
      const query = `
        SELECT 
          c.ID_COMT as id,
          COALESCE(u.NOM_US, 'Usuario de Game Shop') as "userName",
          COALESCE(u.CORREO, 'anonimo@correo.com') as email,
          c.COMEN as message,
          COALESCE(c.RATING, 5) as rating,
          TO_CHAR(c.FECHA_COM, 'DD/MM/YYYY') as date
        FROM COMENTARIO c
        LEFT JOIN USUARIO u ON c.USUARIO_ID_US = u.ID_US
        WHERE c.PRODUCTO_ID_PRO = $1
        ORDER BY c.ID_COMT DESC
      `;
      const result = await pool.query(query, [gameIdInt]);
      res.json(result.rows);
    } catch (err: any) {
      console.error('Error fetching game-specific comments:', err);
      res.status(500).json({ error: 'Error al obtener comentarios del videojuego.' });
    }
  });

  // 5c. Game-specific comments: Post comment on a single game
  app.post('/api/games/:gameId/comments', async (req, res) => {
    const { gameId } = req.params;
    const gameIdInt = typeof gameId === 'string' ? parseInt(gameId.replace(/[^\d]/g, ''), 10) : gameId;
    const { userName, email, message, rating } = req.body;
    if (!userName || !email || !message) {
      return res.status(400).json({ error: 'Nombre, correo electrónico y mensaje son obligatorios.' });
    }

    try {
      let userId;
      const userRes = await pool.query('SELECT ID_US FROM USUARIO WHERE CORREO = $1', [email]);
      if (userRes.rows.length > 0) {
        userId = userRes.rows[0].id_us;
      } else {
        const insertUser = await pool.query(
          'INSERT INTO USUARIO (NOM_US, CORREO, PASS_HASH) VALUES ($1, $2, $3) RETURNING ID_US',
          [userName, email, 'guest_password_123']
        );
        userId = insertUser.rows[0].id_us;
      }

      const commentRes = await pool.query(
        'INSERT INTO COMENTARIO (COMEN, USUARIO_ID_US, PRODUCTO_ID_PRO, RATING) VALUES ($1, $2, $3, $4) RETURNING ID_COMT, FECHA_COM',
        [message, userId, gameIdInt, rating || 5]
      );

      const dbComment = commentRes.rows[0];

      res.status(201).json({
        id: 'c_' + dbComment.id_comt,
        userName,
        email,
        message,
        rating: rating || 5,
        date: new Date(dbComment.fecha_com).toLocaleDateString('es-ES')
      });
    } catch (err: any) {
      console.error('Error posting game comment:', err);
      res.status(500).json({ error: 'Error al publicar comentario en el videojuego.' });
    }
  });

  // 6. Purchases: Create a purchase order (with payment details)
  app.post('/api/purchases', async (req, res) => {
    const { userId, items, total, cardName, cardNumber, cardExp, cardCvv } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'La compra debe contener al menos un videojuego.' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Resolve/Find user ID in DB
      let resolvedUserId = null;
      if (userId) {
        resolvedUserId = parseInt(userId, 10);
      } else {
        // Create an anonymous/guest user if checkout is guest-based
        const guestEmail = `guest_${Date.now()}@gameshop.es`;
        const guestUser = await client.query(
          'INSERT INTO USUARIO (NOM_US, CORREO, PASS_HASH) VALUES ($1, $2, $3) RETURNING ID_US',
          [cardName || 'Cliente Invitado', guestEmail, 'guest_pass_123']
        );
        resolvedUserId = guestUser.rows[0].id_us;
      }

      // 2. Create payment method (METODOPAGO)
      let paymentId = null;
      if (cardName && cardNumber) {
        const payRes = await client.query(`
          INSERT INTO METODOPAGO (TITULAR, NUM_TAR, EXPIRACION, CVV, USUARIO_ID_US)
          VALUES ($1, $2, $3, $4, $5) RETURNING ID_MET
        `, [cardName, cardNumber, cardExp || '12/29', parseInt(cardCvv || '123', 10), resolvedUserId]);
        paymentId = payRes.rows[0].id_met;
      }

      // 3. Create main purchase record (COMPRA)
      const purchaseRes = await client.query(`
        INSERT INTO COMPRA (USUARIO_ID_US)
        VALUES ($1) RETURNING ID_COM, FECHA
      `, [resolvedUserId]);
      const purchaseId = purchaseRes.rows[0].id_com;
      const purchaseDate = purchaseRes.rows[0].fecha;

      // 4. Insert items detail (DETAIL_COMPRA) and adjust game stock (PRODUCTO)
      for (const item of items) {
        // Map frontend client-side string IDs like 'g1' to DB integer primary keys by parsing or removing 'g'
        const gameIdInt = typeof item.gameId === 'string' ? parseInt(item.gameId.replace(/[^\d]/g, ''), 10) : item.gameId;
        
        await client.query(`
          INSERT INTO DETAIL_COMPRA (PRODUCTO_ID_PRO, COMPRA_ID_COM, METODOPAGO_ID_MET, CANT_PRO, PRECIO_FINAL, PLATFORM)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [gameIdInt, purchaseId, paymentId, item.quantity, item.price, item.platform || null]);

        // Deduct stock in PRODUCTO
        await client.query(`
          UPDATE PRODUCTO 
          SET DIS_PRO = GREATEST(0, DIS_PRO - $1)
          WHERE ID_PRO = $2
        `, [item.quantity, gameIdInt]);
      }

      await client.query('COMMIT');

      // Generate a nice order number
      const orderNumber = `GSL-${purchaseId}-${Math.floor(1000 + Math.random() * 9000)}`;

      res.status(201).json({
        id: String(purchaseId),
        userId: String(resolvedUserId),
        items,
        total,
        cardName,
        cardNumber: cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : '****',
        date: new Date(purchaseDate).toLocaleDateString('es-ES'),
        orderNumber
      });

    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error('Error processing checkout transaction:', err);
      res.status(500).json({ error: 'Error interno del servidor al procesar la compra.' });
    } finally {
      client.release();
    }
  });

  // 7. Purchases: Get history for a user
  app.get('/api/purchases/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const userIdInt = parseInt(userId, 10);
      if (isNaN(userIdInt)) {
        return res.json([]); // Return empty list for guests or non-valid user ids
      }

      // Fetch all compras for this user
      const comprasRes = await pool.query(`
        SELECT 
          c.ID_COM as id,
          c.FECHA as date,
          m.TITULAR as "cardName",
          m.NUM_TAR as "cardNumber"
        FROM COMPRA c
        LEFT JOIN METODOPAGO m ON m.USUARIO_ID_US = c.USUARIO_ID_US
        WHERE c.USUARIO_ID_US = $1
        ORDER BY c.ID_COM DESC
      `, [userIdInt]);

      const purchaseHistory = [];

      for (const row of comprasRes.rows) {
        // Fetch details for each purchase
        const detailsRes = await pool.query(`
          SELECT 
            dc.PRODUCTO_ID_PRO as "gameId",
            p.NOM_PRO as title,
            dc.PRECIO_FINAL::float as price,
            dc.CANT_PRO as quantity,
            dc.PLATFORM as platform
          FROM DETAIL_COMPRA dc
          JOIN PRODUCTO p ON dc.PRODUCTO_ID_PRO = p.ID_PRO
          WHERE dc.COMPRA_ID_COM = $1
        `, [row.id]);

        let total = 0;
        const items = detailsRes.rows.map(item => {
          total += item.price * item.quantity;
          return {
            gameId: 'g' + item.gameId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            platform: item.platform
          };
        });

        purchaseHistory.push({
          id: String(row.id),
          userId: String(userId),
          items,
          total,
          cardName: row.cardName || 'Cliente Invitado',
          cardNumber: row.cardNumber ? `**** **** **** ${row.cardNumber.slice(-4)}` : '****',
          date: new Date(row.date).toLocaleDateString('es-ES'),
          orderNumber: `GSL-${row.id}-${1000 + Number(row.id)}`
        });
      }

      res.json(purchaseHistory);
    } catch (err: any) {
      console.error('Error fetching purchases history:', err);
      res.status(500).json({ error: 'Error al obtener historial de compras.' });
    }
  });

  // --- VITE MIDDLEWARE CONFIGURATION ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server with Postgres connection running on http://localhost:${PORT}`);
  });
}

startServer();
