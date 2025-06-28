const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { getDb } = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * /mentors:
 *   get:
 *     summary: 멘토 전체 리스트 조회 (멘티 전용)
 *     tags: [Mentors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: skill
 *         in: query
 *         schema:
 *           type: string
 *         description: 기술 스택으로 필터링
 *       - name: order_by
 *         in: query
 *         schema:
 *           type: string
 *           enum: [skill, name]
 *         description: 정렬 기준 (skill 또는 name)
 *     responses:
 *       200:
 *         description: 멘토 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   profile:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       bio:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: string
 */
router.get('/mentors', authenticateToken, requireRole('mentee'), (req, res) => {
  const db = getDb();
  const { skill, order_by } = req.query;
  
  let query = `
    SELECT 
      u.id, u.email, u.role, u.name, u.bio, u.profile_image,
      GROUP_CONCAT(s.skill_name) as skills
    FROM users u
    LEFT JOIN skills s ON u.id = s.user_id
    WHERE u.role = 'mentor'
  `;
  
  const params = [];
  
  // 기술 스택 필터링
  if (skill) {
    query += ` AND u.id IN (
      SELECT user_id FROM skills 
      WHERE skill_name LIKE ?
    )`;
    params.push(`%${skill}%`);
  }
  
  query += ' GROUP BY u.id';
  
  // 정렬
  if (order_by === 'name') {
    query += ' ORDER BY u.name ASC';
  } else if (order_by === 'skill') {
    query += ' ORDER BY skills ASC';
  } else {
    query += ' ORDER BY u.id ASC';
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('멘토 목록 조회 오류:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    const mentors = rows.map(row => ({
      id: row.id,
      email: row.email,
      role: row.role,
      profile: {
        name: row.name,
        bio: row.bio,
        imageUrl: row.profile_image ? `/api/images/mentor/${row.id}` : `https://placehold.co/500x500.jpg?text=MENTOR`,
        skills: row.skills ? row.skills.split(',') : []
      }
    }));
    
    res.json(mentors);
  });
});

module.exports = router;
