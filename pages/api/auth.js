// pages/api/auth.js
export default function handler(req, res) {
  // Only allow POST method for authentication
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只允許 POST 請求' });
  }

  const { username, password } = req.body;

  // Get credentials from environment variables
  // In production, you should store these in .env.local
  const validUsername = process.env.AUTH_USERNAME || 'admin';
  const validPassword = process.env.AUTH_PASSWORD || 'password';

  // Check if credentials match
  if (username === validUsername && password === validPassword) {
    return res.status(200).json({ 
      message: '登入成功',
      user: { username }
    });
  } else {
    return res.status(401).json({ message: '用戶名或密碼錯誤' });
  }
}