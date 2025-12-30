import dotenv from 'dotenv';

dotenv.config();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'NewSecurePassword2024!@#$%';

async function logoutAllSessions() {
  try {
    const response = await fetch('http://localhost:3001/api/admin/logout-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD })
    });

    if (response.ok) {
      console.log('✅ All admin sessions have been logged out');
    } else {
      console.error('❌ Failed to logout all sessions');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

logoutAllSessions();
