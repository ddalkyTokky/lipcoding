import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'mentee',
    skills: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        bio: formData.bio
      };

      await axios.post('/api/signup', submitData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>회원가입</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">역할</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="mentee">멘티</option>
            <option value="mentor">멘토</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="skills">기술 스택 (쉼표로 구분)</label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="예: JavaScript, React, Node.js"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bio">자기소개</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="간단한 자기소개를 작성해주세요"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>
      
      <Link to="/login" className="link">
        이미 계정이 있으신가요? 로그인
      </Link>
    </div>
  );
};

export default Register;
