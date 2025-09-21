// Vercel Serverless Function for authentication
let users = [
  {
    id: 'demo',
    username: 'Demo User',
    email: 'demo@example.com',
    avatar: '',
    preferences: {
      language: 'zh',
      theme: 'light'
    }
  }
];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method } = req;

  switch (method) {
    case 'POST':
      const { action, email, password, username } = req.body;

      if (action === 'login') {
        // Simple demo login - accept any email/password
        const user = users.find(u => u.email === email) || users[0];

        res.status(200).json({
          success: true,
          message: '登录成功',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
          },
          token: 'demo-jwt-token-' + Date.now()
        });
      } else if (action === 'register') {
        // Simple demo registration
        const newUser = {
          id: (users.length + 1).toString(),
          username: username || 'New User',
          email: email,
          avatar: '',
          preferences: {
            language: 'zh',
            theme: 'light'
          }
        };

        users.push(newUser);

        res.status(201).json({
          success: true,
          message: '注册成功',
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar
          },
          token: 'demo-jwt-token-' + Date.now()
        });
      } else {
        res.status(400).json({ message: 'Invalid action' });
      }
      break;

    case 'GET':
      // Get current user info (demo)
      res.status(200).json({
        user: users[0],
        authenticated: true
      });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}