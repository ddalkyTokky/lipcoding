const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { getDb } = require('../config/database');

const router = express.Router();

/**
 * @swagger
 * /match-requests:
 *   post:
 *     summary: 매칭 요청 보내기 (멘티 전용)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mentorId
 *               - menteeId
 *               - message
 *             properties:
 *               mentorId:
 *                 type: integer
 *               menteeId:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: 매칭 요청 생성 성공
 */
router.post('/match-requests', authenticateToken, requireRole('mentee'), (req, res) => {
  try {
    const db = getDb();
    const { mentorId, menteeId, message } = req.body;
    const userId = parseInt(req.user.sub); // JWT에서 사용자 ID 가져오기
    
    // 필수 필드 검증 (menteeId도 필수로 복원)
    if (!mentorId || !menteeId || !message) {
      return res.status(400).json({ error: 'mentorId, menteeId, and message are required' });
    }
    
    // mentorId, menteeId 숫자 검증
    if (isNaN(parseInt(mentorId)) || isNaN(parseInt(menteeId))) {
      return res.status(400).json({ error: 'mentorId and menteeId must be valid numbers' });
    }
    
    // 메시지 길이 검증 (최대 1000자)
    if (typeof message !== 'string' || message.length > 1000) {
      return res.status(400).json({ error: 'Message must be a string with maximum 1000 characters' });
    }
    
    // 요청한 사용자가 menteeId와 일치하는지 확인
    if (userId !== parseInt(menteeId)) {
      return res.status(403).json({ error: 'Unauthorized: Cannot create request for another user' });
    }
  
  // 멘토가 존재하는지 확인
  console.log('매칭 요청 생성 시도:', { mentorId, menteeId, userId });
  
  // 멘토 존재 확인
  const mentorQuery = 'SELECT id, role FROM users WHERE id = ? AND role = ?';
  db.get(mentorQuery, [mentorId, 'mentor'], (err, mentor) => {
    if (err) {
      console.error('멘토 조회 오류:', err);
      return res.status(500).json({ error: 'Database error while checking mentor' });
    }
    
    console.log('멘토 조회 결과:', mentor);
    if (!mentor) {
      console.log('멘토를 찾을 수 없음:', mentorId);
      return res.status(400).json({ error: 'Mentor not found' });
    }
    
    // 멘티 존재 확인
    const menteeQuery = 'SELECT id, role FROM users WHERE id = ? AND role = ?';
    db.get(menteeQuery, [menteeId, 'mentee'], (err, mentee) => {
      if (err) {
        console.error('멘티 조회 오류:', err);
        return res.status(500).json({ error: 'Database error while checking mentee' });
      }
      
      if (!mentee) {
        console.log('멘티를 찾을 수 없음:', menteeId);
        return res.status(400).json({ error: 'Mentee not found' });
      }
      
      // 기존 요청이 있는지 확인 (pending 상태만)
      const existingQuery = 'SELECT id FROM match_requests WHERE mentor_id = ? AND mentee_id = ? AND status = ?';
      db.get(existingQuery, [mentorId, menteeId, 'pending'], (err, existingRequest) => {
        if (err) {
          console.error('기존 요청 확인 오류:', err);
          return res.status(500).json({ error: 'Database error while checking existing request' });
        }
        
        console.log('기존 요청 확인 결과:', existingRequest);
      
      if (existingRequest) {
        return res.status(400).json({ error: 'Pending match request already exists' });
      }
      
      // 매칭 요청 생성
      const query = `
        INSERT INTO match_requests (mentor_id, mentee_id, message, status)
        VALUES (?, ?, ?, 'pending')
      `;
      
      db.run(query, [mentorId, menteeId, message], function(err) {
        if (err) {
          console.error('매칭 요청 생성 오류:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        
        res.json({
          id: this.lastID,
          mentorId,
          menteeId,
          message,
          status: 'pending'
        });
      });
      });
    });
    });
  } catch (error) {
    console.error('매칭 요청 처리 중 예외 발생:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /match-requests/incoming:
 *   get:
 *     summary: 나에게 들어온 요청 목록 (멘토 전용)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 */
router.get('/match-requests/incoming', authenticateToken, requireRole('mentor'), (req, res) => {
  const db = getDb();
  const mentorId = parseInt(req.user.sub);
  
  const query = `
    SELECT 
      mr.id, mr.mentor_id as mentorId, mr.mentee_id as menteeId,
      mr.message, mr.status, mr.created_at as createdAt,
      u.name as menteeName, u.email as menteeEmail
    FROM match_requests mr
    JOIN users u ON mr.mentee_id = u.id
    WHERE mr.mentor_id = ?
    ORDER BY mr.created_at DESC
  `;
  
  db.all(query, [mentorId], (err, rows) => {
    if (err) {
      console.error('들어온 매칭 요청 조회 오류:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    res.json(rows);
  });
});

/**
 * @swagger
 * /match-requests/outgoing:
 *   get:
 *     summary: 내가 보낸 요청 목록 (멘티 전용)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 */
router.get('/match-requests/outgoing', authenticateToken, requireRole('mentee'), (req, res) => {
  const db = getDb();
  const menteeId = parseInt(req.user.sub);
  
  const query = `
    SELECT 
      mr.id, mr.mentor_id as mentorId, mr.mentee_id as menteeId,
      mr.message, mr.status, mr.created_at as createdAt,
      u.name as mentorName, u.email as mentorEmail
    FROM match_requests mr
    JOIN users u ON mr.mentor_id = u.id
    WHERE mr.mentee_id = ?
    ORDER BY mr.created_at DESC
  `;
  
  db.all(query, [menteeId], (err, rows) => {
    if (err) {
      console.error('보낸 매칭 요청 조회 오류:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    res.json(rows);
  });
});

/**
 * @swagger
 * /match-requests/{id}/accept:
 *   put:
 *     summary: 요청 수락 (멘토 전용)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
router.put('/match-requests/:id/accept', authenticateToken, requireRole('mentor'), (req, res) => {
  const db = getDb();
  const requestId = req.params.id;
  const mentorId = parseInt(req.user.sub);
  
  // 매칭 요청이 존재하고 해당 멘토의 요청인지 확인
  db.get('SELECT * FROM match_requests WHERE id = ? AND mentor_id = ?', [requestId, mentorId], (err, request) => {
    if (err) {
      console.error('매칭 요청 조회 오류:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    if (!request) {
      return res.status(404).json({ error: 'Match request not found' });
    }
    
    // 상태를 accepted로 업데이트
    const updateQuery = `
      UPDATE match_requests 
      SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(updateQuery, [requestId], function(err) {
      if (err) {
        console.error('매칭 요청 수락 오류:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      res.json({
        id: request.id,
        mentorId: request.mentor_id,
        menteeId: request.mentee_id,
        message: request.message,
        status: 'accepted'
      });
    });
  });
});

/**
 * @swagger
 * /match-requests/{id}/reject:
 *   put:
 *     summary: 요청 거절 (멘토 전용)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
router.put('/match-requests/:id/reject', authenticateToken, requireRole('mentor'), (req, res) => {
  const db = getDb();
  const requestId = req.params.id;
  const mentorId = parseInt(req.user.sub);
  
  // 매칭 요청이 존재하고 해당 멘토의 요청인지 확인
  db.get('SELECT * FROM match_requests WHERE id = ? AND mentor_id = ?', [requestId, mentorId], (err, request) => {
    if (err) {
      console.error('매칭 요청 조회 오류:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    if (!request) {
      return res.status(404).json({ error: 'Match request not found' });
    }
    
    // 상태를 rejected로 업데이트
    const updateQuery = `
      UPDATE match_requests 
      SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(updateQuery, [requestId], function(err) {
      if (err) {
        console.error('매칭 요청 거절 오류:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      res.json({
        id: request.id,
        mentorId: request.mentor_id,
        menteeId: request.mentee_id,
        message: request.message,
        status: 'rejected'
      });
    });
  });
});

/**
 * @swagger
 * /match-requests/{id}:
 *   delete:
 *     summary: 요청 삭제/취소 (멘티 전용)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/match-requests/:id', authenticateToken, requireRole('mentee'), (req, res) => {
  const db = getDb();
  const requestId = req.params.id;
  const menteeId = parseInt(req.user.sub);
  
  // ID 파라미터 검증
  if (!requestId || isNaN(parseInt(requestId))) {
    return res.status(400).json({ error: 'Invalid request ID' });
  }
  
  // 매칭 요청이 존재하고 해당 멘티의 요청인지 확인
  db.get('SELECT * FROM match_requests WHERE id = ? AND mentee_id = ?', [requestId, menteeId], (err, request) => {
    if (err) {
      console.error('매칭 요청 조회 오류:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    if (!request) {
      return res.status(404).json({ error: 'Match request not found' });
    }
    
    // 상태를 cancelled로 업데이트 (실제 삭제 대신)
    const updateQuery = `
      UPDATE match_requests 
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(updateQuery, [requestId], function(err) {
      if (err) {
        console.error('매칭 요청 취소 오류:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      res.json({
        id: request.id,
        mentorId: request.mentor_id,
        menteeId: request.mentee_id,
        message: request.message,
        status: 'cancelled'
      });
    });
  });
});

module.exports = router;
