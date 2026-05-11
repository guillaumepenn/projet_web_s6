
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'pluriscience_secret_change_me_in_prod';


app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());


const db = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'pluriscience',
  waitForConnections: true,
  connectionLimit: 10,
});

(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}



app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hash, 'student']
    );

    const token = jwt.sign(
      { id: result.insertId, username, role: 'student' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: result.insertId, username, email, role: 'student' }
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.get('/api/create-admin', async (req, res) => {
  const hash = await bcrypt.hash('000000', 6);
  await db.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    ['admin', 'admin@pluriscience.com', hash, 'admin']
  );
  res.json({ message: 'Admin created !' });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * GET /api/auth/me
 * Récupère le profil de l'utilisateur connecté.
 * Protégé par JWT.
 */
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


/**
 * GET /api/quizzes
 * Récupère la liste de tous les quiz (pour le carrousel de l'accueil).
 * Public — aucune authentification requise.
 */
app.get('/api/quizzes', async (req, res) => {
  try {
    const [quizzes] = await db.execute(`
      SELECT q.id, q.title, q.description, q.domain, q.difficulty, q.created_at,
             u.username AS author,
             COUNT(DISTINCT qu.id) AS question_count
      FROM quizzes q
      JOIN users u ON q.created_by = u.id
      LEFT JOIN questions qu ON qu.quiz_id = q.id
      GROUP BY q.id
      ORDER BY q.created_at DESC
    `);
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

/**
 * GET /api/quizzes/:id
 * Récupère un quiz complet avec ses questions et réponses.
 * Les réponses correctes sont masquées (is_correct non envoyé).
 */
app.get('/api/quizzes/:id', async (req, res) => {
  const quizId = parseInt(req.params.id);
  if (isNaN(quizId)) return res.status(400).json({ error: 'Invalid quiz ID' });

  try {
    const [quizRows] = await db.execute(
      `SELECT q.*, u.username AS author FROM quizzes q
       JOIN users u ON q.created_by = u.id WHERE q.id = ?`,
      [quizId]
    );
    if (quizRows.length === 0) return res.status(404).json({ error: 'Quiz not found' });

    const quiz = quizRows[0];

    const [questions] = await db.execute(
      `SELECT q.id, q.question_text, q.order_index,
              JSON_ARRAYAGG(
                JSON_OBJECT('id', a.id, 'key', a.answer_key, 'text', a.answer_text)
                ORDER BY a.answer_key
              ) AS answers
       FROM questions q
       JOIN answers a ON a.question_id = q.id
       WHERE q.quiz_id = ?
       GROUP BY q.id
       ORDER BY q.order_index`,
      [quizId]
    );

    const parsedQuestions = questions.map(q => ({
      ...q,
      answers: typeof q.answers === 'string' ? JSON.parse(q.answers) : q.answers
    }));

    res.json({ ...quiz, questions: parsedQuestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

/**
 * POST /api/quizzes
 * Crée un nouveau quiz avec ses questions et réponses.
 * Réservé aux admins.
 * Body: {
 *   title, description, domain, difficulty,
 *   questions: [{ question_text, answers: [{ text, key, is_correct }] }]
 * }
 */
app.post('/api/quizzes', authenticateToken, requireAdmin, async (req, res) => {
  const { title, description, domain, difficulty, questions } = req.body;

  if (!title || !domain || !questions || questions.length === 0) {
    return res.status(400).json({ error: 'Title, domain and at least one question are required' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [quizResult] = await conn.execute(
      'INSERT INTO quizzes (title, description, domain, difficulty, created_by) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', domain, difficulty || 'medium', req.user.id]
    );
    const quizId = quizResult.insertId;

    for (let i = 0; i < questions.length; i++) {
      const { question_text, answers } = questions[i];
      if (!question_text || !answers || answers.length < 2) {
        throw new Error(`Question ${i + 1} must have text and at least 2 answers`);
      }

      const [qResult] = await conn.execute(
        'INSERT INTO questions (quiz_id, question_text, order_index) VALUES (?, ?, ?)',
        [quizId, question_text, i]
      );
      const questionId = qResult.insertId;

      const hasCorrect = answers.some(a => a.is_correct);
      if (!hasCorrect) throw new Error(`Question ${i + 1} must have at least one correct answer`);

      for (const ans of answers) {
        await conn.execute(
          'INSERT INTO answers (question_id, answer_text, answer_key, is_correct) VALUES (?, ?, ?, ?)',
          [questionId, ans.text, ans.key, ans.is_correct ? 1 : 0]
        );
      }
    }

    await conn.commit();
    res.status(201).json({ message: 'Quiz created successfully', quizId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message || 'Failed to create quiz' });
  } finally {
    conn.release();
  }
});

/**
 * PUT /api/quizzes/:id
 * Met à jour les métadonnées d'un quiz (titre, description, etc.).
 * Réservé aux admins.
 */
app.put('/api/quizzes/:id', authenticateToken, requireAdmin, async (req, res) => {
  const quizId = parseInt(req.params.id);
  const { title, description, domain, difficulty } = req.body;

  if (!title || !domain) {
    return res.status(400).json({ error: 'Title and domain are required' });
  }

  try {
    const [result] = await db.execute(
      'UPDATE quizzes SET title=?, description=?, domain=?, difficulty=? WHERE id=?',
      [title, description || '', domain, difficulty || 'medium', quizId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ message: 'Quiz updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

/**
 * DELETE /api/quizzes/:id
 * Supprime un quiz (et ses questions/réponses via CASCADE).
 * Réservé aux admins.
 */
app.delete('/api/quizzes/:id', authenticateToken, requireAdmin, async (req, res) => {
  const quizId = parseInt(req.params.id);
  try {
    const [result] = await db.execute('DELETE FROM quizzes WHERE id = ?', [quizId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Quiz not found' });
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});


/**
 * POST /api/results
 * Soumet et enregistre le score d'un utilisateur après un quiz.
 * Protégé par JWT (l'utilisateur doit être connecté).
 * Body: { quiz_id, answers: { [question_id]: answer_key } }
 */
app.post('/api/results', authenticateToken, async (req, res) => {
  const { quiz_id, answers } = req.body;

  if (!quiz_id || !answers) {
    return res.status(400).json({ error: 'quiz_id and answers are required' });
  }

  try {
    const [correctAnswers] = await db.execute(
      `SELECT q.id AS question_id, a.answer_key AS correct_key
       FROM questions q
       JOIN answers a ON a.question_id = q.id AND a.is_correct = TRUE
       WHERE q.quiz_id = ?`,
      [quiz_id]
    );

    if (correctAnswers.length === 0) {
      return res.status(404).json({ error: 'Quiz not found or has no questions' });
    }

    let score = 0;
    for (const { question_id, correct_key } of correctAnswers) {
      if (answers[question_id] === correct_key) score++;
    }

    const total = correctAnswers.length;

    const [result] = await db.execute(
      'INSERT INTO results (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)',
      [req.user.id, quiz_id, score, total]
    );

    res.status(201).json({
      message: 'Score saved',
      result_id: result.insertId,
      score,
      total_questions: total,
      score_percent: Math.round((score / total) * 100)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit results' });
  }
});

/**
 * GET /api/results/leaderboard/:quiz_id
 * Classement du meilleur score par joueur pour un quiz donné.
 * Public.
 */
app.get('/api/results/leaderboard/:quiz_id', async (req, res) => {
  const quizId = parseInt(req.params.quiz_id);
  if (isNaN(quizId)) return res.status(400).json({ error: 'Invalid quiz ID' });

  try {
    const [rows] = await db.execute(
      `SELECT u.username, MAX(r.score) AS best_score, r.total_questions,
              ROUND(MAX(r.score) / r.total_questions * 100, 1) AS best_percent,
              COUNT(r.id) AS attempts,
              MIN(r.completed_at) AS first_attempt
       FROM results r
       JOIN users u ON r.user_id = u.id
       WHERE r.quiz_id = ?
       GROUP BY u.id, r.total_questions
       ORDER BY best_score DESC, first_attempt ASC
       LIMIT 20`,
      [quizId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * GET /api/results/me
 * Historique des scores de l'utilisateur connecté.
 * Protégé par JWT.
 */
app.get('/api/results/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT r.id, r.score, r.total_questions, r.score_percent, r.completed_at,
              q.title AS quiz_title, q.domain
       FROM results r
       JOIN quizzes q ON r.quiz_id = q.id
       WHERE r.user_id = ?
       ORDER BY r.completed_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

/**
 * GET /api/results/leaderboard-global
 * Classement général toutes catégories confondues (top 10 utilisateurs).
 * Public.
 */
app.get('/api/results/leaderboard-global', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT u.username,
              COUNT(r.id) AS total_attempts,
              SUM(r.score) AS total_points,
              ROUND(AVG(r.score_percent), 1) AS avg_percent
       FROM results r
       JOIN users u ON r.user_id = u.id
       GROUP BY u.id
       ORDER BY avg_percent DESC, total_points DESC
       LIMIT 10`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch global leaderboard' });
  }
});


app.get('/', (req, res) => {
  res.json({
    name: 'Pluriscience API',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/me',
      'GET  /api/quizzes',
      'GET  /api/quizzes/:id',
      'POST /api/quizzes  [admin]',
      'PUT  /api/quizzes/:id  [admin]',
      'DELETE /api/quizzes/:id  [admin]',
      'POST /api/results',
      'GET  /api/results/me',
      'GET  /api/results/leaderboard/:quiz_id',
      'GET  /api/results/leaderboard-global',
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 pluriscience API running on http://localhost:${PORT}`);
});