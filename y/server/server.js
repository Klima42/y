import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

app.use(cors());
app.use(express.json());

// Database setup
let db;
async function setupDb() {
  db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      display_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tweet_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, tweet_id),
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (tweet_id) REFERENCES tweets (id)
    );
  `);
}

setupDb();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, display_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      'INSERT INTO users (username, password, display_name) VALUES (?, ?, ?)',
      [username, hashedPassword, display_name]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, display_name: user.display_name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tweet routes
app.get('/api/tweets', async (req, res) => {
  try {
    const tweets = await db.all(`
      SELECT 
        t.*,
        u.username,
        u.display_name,
        COUNT(l.id) as likes_count
      FROM tweets t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN likes l ON t.id = l.tweet_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `);
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tweets', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const result = await db.run(
      'INSERT INTO tweets (user_id, content) VALUES (?, ?)',
      [req.user.id, content]
    );
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tweets/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.run(
      'INSERT INTO likes (user_id, tweet_id) VALUES (?, ?)',
      [req.user.id, id]
    );
    res.status(201).json({ message: 'Tweet liked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tweets/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.run(
      'DELETE FROM likes WHERE user_id = ? AND tweet_id = ?',
      [req.user.id, id]
    );
    res.json({ message: 'Like removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});