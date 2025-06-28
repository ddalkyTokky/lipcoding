const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getDb } = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [mentor, mentee]
 *         profile:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             bio:
 *               type: string
 *             imageUrl:
 *               type: string
 *             skills:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticateToken, (req, res) => {
  const db = getDb();
  const userId = parseInt(req.user.sub); // 문자열을 정수로 변환
  
  db.get('SELECT id, email, name, role, bio FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get skills if user is a mentor
    if (user.role === 'mentor') {
      db.all('SELECT skill_name FROM skills WHERE user_id = ?', [user.id], (err, skills) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        const response = {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: {
            name: user.name,
            bio: user.bio,
            imageUrl: user.profile_image ? `/api/images/${user.role}/${user.id}` : `https://placehold.co/500x500.jpg?text=MENTOR`,
            skills: skills.map(skill => skill.skill_name)
          }
        };

        res.json(response);
      });
    } else {
      const response = {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: {
          name: user.name,
          bio: user.bio,
          imageUrl: user.profile_image ? `/api/images/${user.role}/${user.id}` : `https://placehold.co/500x500.jpg?text=MENTEE`
        }
      };

      res.json(response);
    }
  });
});

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: 프로필 수정
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               bio:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: Base64 encoded image
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
 */
router.put('/profile', authenticateToken, (req, res) => {
  const db = getDb();
  const { id, name, role, bio, image, skills } = req.body;
  const userId = parseInt(req.user.sub); // 문자열을 정수로 변환
  
  // 필수 필드 검증
  if (!id || !name) {
    return res.status(400).json({ error: 'id and name are required' });
  }
  
  // 역할 검증 (role이 제공된 경우)
  if (role && !['mentor', 'mentee'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be mentor or mentee' });
  }
  
  // 요청한 사용자가 본인인지 확인
  if (id !== userId) {
    return res.status(403).json({ error: 'Unauthorized: Cannot update another user profile' });
  }
  
  // 사용자 정보 업데이트
  const updateQuery = `
    UPDATE users 
    SET name = ?, bio = ?, profile_image = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(updateQuery, [name, bio, image || null, userId], function(err) {
    if (err) {
      console.error('프로필 업데이트 오류:', err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
    
    // 멘토인 경우 스킬 업데이트
    if (role === 'mentor' && skills && Array.isArray(skills)) {
      // 기존 스킬 삭제
      db.run('DELETE FROM skills WHERE user_id = ?', [userId], (err) => {
        if (err) {
          console.error('기존 스킬 삭제 오류:', err);
          return res.status(500).json({ error: 'Failed to update skills' });
        }
        
        // 새 스킬 추가
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
            // 업데이트된 사용자 정보 반환
            fetchUpdatedUser(db, userId, res);
          })
          .catch(() => {
            res.status(500).json({ error: 'Failed to update skills' });
          });
      });
    } else {
      // 업데이트된 사용자 정보 반환
      fetchUpdatedUser(db, userId, res);
    }
  });
});

function fetchUpdatedUser(db, userId, res) {
  db.get('SELECT id, email, name, role, bio FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (user.role === 'mentor') {
      db.all('SELECT skill_name FROM skills WHERE user_id = ?', [userId], (err, skills) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        const response = {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: {
            name: user.name,
            bio: user.bio,
            imageUrl: user.profile_image ? `/api/images/${user.role}/${user.id}` : `https://placehold.co/500x500.jpg?text=MENTOR`,
            skills: skills.map(skill => skill.skill_name)
          }
        };
        
        res.json(response);
      });
    } else {
      const response = {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: {
          name: user.name,
          bio: user.bio,
          imageUrl: user.profile_image ? `/api/images/${user.role}/${user.id}` : `https://placehold.co/500x500.jpg?text=MENTEE`
        }
      };
      
      res.json(response);
    }
  });
}

/**
 * @swagger
 * /images/{role}/{id}:
 *   get:
 *     summary: 프로필 이미지 조회
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: role
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [mentor, mentee]
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 프로필 이미지
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/images/:role/:id', authenticateToken, (req, res) => {
  const db = getDb();
  const { role, id } = req.params;
  
  if (!['mentor', 'mentee'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  db.get('SELECT profile_image FROM users WHERE id = ? AND role = ?', [id, role], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user || !user.profile_image) {
      // 기본 이미지를 반환하거나 404를 반환
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // 이미지가 Base64 형태로 저장되어 있다면
    const imageBuffer = Buffer.from(user.profile_image, 'base64');
    res.set('Content-Type', 'image/jpeg'); // 또는 적절한 이미지 타입
    res.send(imageBuffer);
  });
});

module.exports = router;
