const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [mentor, mentee]
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role, skills, bio } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['mentor', 'mentee'].includes(role)) {
      return res.status(400).json({ error: 'Role must be mentor or mentee' });
    }

    const db = getDb();

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      db.run(
        'INSERT INTO users (email, password, name, role, bio) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, name, role, bio || null],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          const userId = this.lastID;

          // Insert skills if user is mentor and skills are provided
          if (role === 'mentor' && skills && Array.isArray(skills)) {
            const skillPromises = skills.map(skill => {
              return new Promise((resolve, reject) => {
                db.run(
                  'INSERT INTO skills (user_id, skill_name) VALUES (?, ?)',
                  [userId, skill.trim()],
                  (err) => {
                    if (err) reject(err);
                    else resolve();
                  }
                );
              });
            });

            Promise.all(skillPromises)
              .then(() => {
                res.status(201).json({ message: 'User created successfully', userId });
              })
              .catch(() => {
                res.status(500).json({ error: 'Failed to save skills' });
              });
          } else {
            res.status(201).json({ message: 'User created successfully', userId });
          }
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const now = Math.floor(Date.now() / 1000);
      const payload = {
        iss: process.env.JWT_ISSUER || 'mentor-mentee-app',
        sub: user.id.toString(),
        aud: process.env.JWT_AUDIENCE || 'mentor-mentee-users',
        exp: now + 3600, // 1 hour
        nbf: now,
        iat: now,
        jti: `${user.id}-${now}`,
        name: user.name,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET || 'default-secret');

      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
