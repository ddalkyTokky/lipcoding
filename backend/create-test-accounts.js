const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// 데이터베이스 연결
const db = new sqlite3.Database('./database/mentor_mentee.db');

async function createTestAccounts() {
  try {
    // 테스트 계정 데이터
    const testAccounts = [
      {
        email: 'mentor1@test.com',
        password: 'password123',
        name: '김멘토',
        role: 'mentor',
        bio: '5년차 React 개발자입니다. 프론트엔드 개발에 대해 멘토링해드립니다.',
        skills: ['React', 'JavaScript', 'TypeScript', 'Next.js']
      },
      {
        email: 'mentor2@test.com',
        password: 'password123',
        name: '이백엔드',
        role: 'mentor',
        bio: '백엔드 개발 전문가입니다. Node.js와 Python을 사용합니다.',
        skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL']
      },
      {
        email: 'mentor3@test.com',
        password: 'password123',
        name: '박풀스택',
        role: 'mentor',
        bio: '풀스택 개발자로 다양한 기술 스택을 다룹니다.',
        skills: ['React', 'Node.js', 'AWS', 'Docker']
      },
      {
        email: 'mentee1@test.com',
        password: 'password123',
        name: '최멘티',
        role: 'mentee',
        bio: '프론트엔드 개발을 배우고 싶은 신입 개발자입니다.'
      },
      {
        email: 'mentee2@test.com',
        password: 'password123',
        name: '강학습',
        role: 'mentee',
        bio: '백엔드 개발에 관심이 많은 학습자입니다.'
      }
    ];

    for (const account of testAccounts) {
      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(account.password, 10);

      // 사용자 생성
      const userId = await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (email, password, name, role, bio) VALUES (?, ?, ?, ?, ?)',
          [account.email, hashedPassword, account.name, account.role, account.bio],
          function(err) {
            if (err) {
              if (err.code === 'SQLITE_CONSTRAINT' || err.message.includes('UNIQUE constraint failed')) {
                console.log(`⚠️ 계정 ${account.email}은 이미 존재합니다. 건너뜁니다.`);
                resolve(null);
              } else {
                console.error(`❌ 테스트 계정 생성 실패: ${err}`);
                reject(err);
              }
            } else {
              console.log(`✅ 계정 생성: ${account.email} (ID: ${this.lastID})`);
              resolve(this.lastID);
            }
          }
        );
      });

      // 멘토인 경우 스킬 추가
      if (userId && account.role === 'mentor' && account.skills) {
        for (const skill of account.skills) {
          await new Promise((resolve, reject) => {
            db.run(
              'INSERT INTO skills (user_id, skill_name) VALUES (?, ?)',
              [userId, skill],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        }
        console.log(`  스킬 추가: ${account.skills.join(', ')}`);
      }
    }

    console.log('\n🎉 테스트 계정 생성 완료!');
    console.log('\n📋 테스트 계정 정보:');
    console.log('멘토 계정:');
    console.log('  - mentor1@test.com / password123 (React 전문)');
    console.log('  - mentor2@test.com / password123 (백엔드 전문)');
    console.log('  - mentor3@test.com / password123 (풀스택)');
    console.log('\n멘티 계정:');
    console.log('  - mentee1@test.com / password123');
    console.log('  - mentee2@test.com / password123');

  } catch (error) {
    console.error('❌ 테스트 계정 생성 실패:', error);
  } finally {
    db.close();
  }
}

createTestAccounts();
