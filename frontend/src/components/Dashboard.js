import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const [orderBy, setOrderBy] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMentors();
      fetchMatches();
    }
  }, [user]);

  const handleSearch = () => {
    fetchMentors(searchSkill, orderBy);
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      setError('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const fetchMentors = async (skill = '', orderBy = '') => {
    if (!user || user.role !== 'mentee') return; // 멘티만 멘토 목록 조회
    
    try {
      const token = localStorage.getItem('token');
      let url = '/api/mentors';
      const params = new URLSearchParams();
      
      if (skill) params.append('skill', skill);
      if (orderBy) params.append('order_by', orderBy);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMentors(response.data || []);
    } catch (error) {
      console.error('멘토 목록을 불러오는데 실패했습니다:', error);
    }
  };

  const fetchMatches = async () => {
    if (!user) return; // 사용자 정보가 없으면 리턴
    
    try {
      const token = localStorage.getItem('token');
      
      // 사용자 역할에 따라 다른 엔드포인트 호출
      const endpoint = user.role === 'mentor' 
        ? '/api/match-requests/incoming' 
        : '/api/match-requests/outgoing';
        
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMatches(response.data || []);
    } catch (error) {
      console.error('매칭 목록을 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async (mentorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/match-requests', 
        { 
          mentorId,
          menteeId: user.id,
          message: '멘토링 받고 싶어요!'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMatches();
    } catch (error) {
      setError('매칭 요청에 실패했습니다.');
    }
  };

  const handleAcceptMatch = async (matchId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/match-requests/${matchId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMatches();
    } catch (error) {
      setError('매칭 수락에 실패했습니다.');
    }
  };

  const handleRejectMatch = async (matchId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/match-requests/${matchId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMatches();
    } catch (error) {
      setError('매칭 거절에 실패했습니다.');
    }
  };

  const handleCancelMatch = async (matchId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/match-requests/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMatches();
    } catch (error) {
      setError('매칭 취소에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div>
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <h1>멘토-멘티 매칭 플랫폼</h1>
            <div className="nav-actions">
              <span>안녕하세요, {user?.name}님!</span>
              <button 
                onClick={onLogout}
                className="btn btn-secondary"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        {error && <div className="error">{error}</div>}

        {/* 사용자 프로필 */}
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>내 프로필</h3>
          <p><strong>이름:</strong> {user?.profile?.name || user?.name}</p>
          <p><strong>이메일:</strong> {user?.email}</p>
          <p><strong>역할:</strong> {user?.role === 'mentor' ? '멘토' : '멘티'}</p>
          {user?.profile?.skills && (
            <p><strong>기술 스택:</strong> {user.profile.skills.join(', ')}</p>
          )}
          <p><strong>자기소개:</strong> {user?.profile?.bio || '없음'}</p>
          {user?.profile?.imageUrl && (
            <img 
              src={user.profile.imageUrl} 
              alt="프로필 이미지" 
              className="profile-image"
              onError={(e) => {
                e.target.src = user.role === 'mentor' 
                  ? 'https://placehold.co/500x500.jpg?text=MENTOR'
                  : 'https://placehold.co/500x500.jpg?text=MENTEE';
              }}
            />
          )}
        </div>

        {/* 멘토 목록 (멘티인 경우에만 표시) */}
        {user?.role === 'mentee' && (
          <div>
            <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>멘토 찾기</h2>
            
            {/* 검색 필터 */}
            <div className="card">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
                  <label>기술 스택 검색</label>
                  <input
                    type="text"
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    placeholder="예: React, Spring Boot"
                  />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                  <label>정렬 기준</label>
                  <select
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                  >
                    <option value="">ID 순</option>
                    <option value="name">이름 순</option>
                    <option value="skill">기술 순</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                  <button 
                    onClick={handleSearch}
                    className="btn btn-primary"
                  >
                    검색
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-2">
              {mentors.map(mentor => (
                <div key={mentor.id} className="card">
                  <img 
                    src={mentor.profile?.imageUrl || 'https://placehold.co/500x500.jpg?text=MENTOR'} 
                    alt="멘토 프로필" 
                    className="profile-image"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/500x500.jpg?text=MENTOR';
                    }}
                  />
                  <h3>{mentor.profile?.name || mentor.name}</h3>
                  <p><strong>이메일:</strong> {mentor.email}</p>
                  <p><strong>기술 스택:</strong> {mentor.profile?.skills?.join(', ') || '없음'}</p>
                  <p>{mentor.profile?.bio || mentor.bio}</p>
                  <button 
                    onClick={() => handleMatch(mentor.id)}
                    className="btn btn-primary"
                  >
                    매칭 요청
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 매칭 목록 */}
        <div>
          <h2 style={{ marginTop: '40px', marginBottom: '20px' }}>
            {user?.role === 'mentor' ? '받은 매칭 요청' : '보낸 매칭 요청'}
          </h2>
          {matches.length === 0 ? (
            <div className="card">
              <p>아직 매칭이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-2">
              {matches.map(match => (
                <div key={match.id} className="card">
                  <h3>
                    {user?.role === 'mentor' ? 
                      `멘티: ${match.menteeName || '멘티'}` : 
                      `멘토: ${match.mentorName || '멘토'}`
                    }
                  </h3>
                  <p><strong>상태:</strong> {
                    match.status === 'pending' ? '대기 중' :
                    match.status === 'accepted' ? '수락됨' :
                    match.status === 'rejected' ? '거절됨' :
                    match.status === 'cancelled' ? '취소됨' : match.status
                  }</p>
                  {match.message && <p><strong>메시지:</strong> {match.message}</p>}
                  <p><strong>생성일:</strong> {new Date(match.createdAt || Date.now()).toLocaleDateString()}</p>
                  
                  {/* 멘토용 버튼들 */}
                  {user?.role === 'mentor' && match.status === 'pending' && (
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => handleAcceptMatch(match.id)}
                        className="btn btn-primary"
                      >
                        수락
                      </button>
                      <button 
                        onClick={() => handleRejectMatch(match.id)}
                        className="btn btn-secondary"
                      >
                        거절
                      </button>
                    </div>
                  )}
                  
                  {/* 멘티용 버튼들 */}
                  {user?.role === 'mentee' && (match.status === 'pending' || match.status === 'accepted') && (
                    <div style={{ marginTop: '10px' }}>
                      <button 
                        onClick={() => handleCancelMatch(match.id)}
                        className="btn btn-secondary"
                      >
                        취소
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
