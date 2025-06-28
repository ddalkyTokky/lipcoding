const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.dirname(process.env.DB_PATH || './database/mentor_mentee.db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || './database/mentor_mentee.db';
const db = new sqlite3.Database(dbPath);

const init = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table (for both mentors and mentees)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          role TEXT NOT NULL CHECK (role IN ('mentor', 'mentee')),
          bio TEXT,
          profile_image BLOB,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Skills table (for mentor skills)
      db.run(`
        CREATE TABLE IF NOT EXISTS skills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          skill_name TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Match requests table
      db.run(`
        CREATE TABLE IF NOT EXISTS match_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          mentor_id INTEGER NOT NULL,
          mentee_id INTEGER NOT NULL,
          message TEXT,
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (mentor_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (mentee_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(mentor_id, mentee_id)
        )
      `);

      // Create indexes for better performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_users_role ON users (role)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills (user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_skills_name ON skills (skill_name)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_match_requests_mentor ON match_requests (mentor_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_match_requests_mentee ON match_requests (mentee_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_match_requests_status ON match_requests (status)`);

      console.log('✅ Database tables created successfully');
      resolve();
    });
  });
};

const getDb = () => db;

const close = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('📦 Database connection closed');
        resolve();
      }
    });
  });
};

module.exports = {
  init,
  getDb,
  close
};
