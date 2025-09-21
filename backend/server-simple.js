const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

let users = [];
let tierLists = [];
let comments = [];

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Holiday Tier List API is running (Memory Mode)',
    timestamp: new Date().toISOString(),
    mode: 'development-memory'
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = users.find(u => u.email === email || u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = {
    id: Date.now().toString(),
    username,
    email,
    createdAt: new Date().toISOString(),
    stats: { tierListsCreated: 0, totalLikes: 0, totalViews: 0 }
  };

  users.push(user);

  res.status(201).json({
    message: 'User registered successfully',
    token: 'demo-token-' + user.id,
    user
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    message: 'Login successful',
    token: 'demo-token-' + user.id,
    user
  });
});

app.get('/api/tier-lists', (req, res) => {
  const publicTierLists = tierLists.filter(tl => tl.isPublic);

  res.json({
    tierLists: publicTierLists.map(tl => ({
      ...tl,
      creator: users.find(u => u.id === tl.creatorId)
    })),
    pagination: {
      page: 1,
      limit: 10,
      total: publicTierLists.length,
      pages: 1
    }
  });
});

app.get('/api/tier-lists/:id', (req, res) => {
  const tierList = tierLists.find(tl => tl.id === req.params.id);
  if (!tierList) {
    return res.status(404).json({ message: 'Tier list not found' });
  }

  tierList.views = (tierList.views || 0) + 1;

  res.json({
    ...tierList,
    creator: users.find(u => u.id === tierList.creatorId)
  });
});

app.post('/api/tier-lists', (req, res) => {
  const { title, description, tiers, tags, isPublic } = req.body;

  if (!title || !tiers) {
    return res.status(400).json({ message: 'Title and tiers are required' });
  }

  const tierList = {
    id: Date.now().toString(),
    title,
    description: description || '',
    tiers: tiers || [],
    tags: tags || [],
    isPublic: isPublic !== false,
    creatorId: '1', // Demo user
    createdAt: new Date().toISOString(),
    views: 0,
    stats: { totalLikes: 0, totalComments: 0, totalShares: 0 }
  };

  tierLists.push(tierList);

  res.status(201).json({
    ...tierList,
    creator: users.find(u => u.id === tierList.creatorId) || { username: 'Demo User' }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: 'Internal server error'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 添加一些示例数据
users.push({
  id: '1',
  username: 'demo_user',
  email: 'demo@example.com',
  createdAt: new Date().toISOString(),
  stats: { tierListsCreated: 1, totalLikes: 5, totalViews: 20 }
});

tierLists.push({
  id: '1',
  title: 'My Holiday Rankings',
  description: 'A sample tier list showing how different holidays rank in my opinion',
  tiers: [
    {
      id: 'S',
      name: 'S Tier',
      color: '#ff6b35',
      items: [
        { id: 'christmas', name: 'Christmas', emoji: '🎄', category: 'religious' },
        { id: 'newyear', name: 'New Year', emoji: '🎉', category: 'cultural' }
      ]
    },
    {
      id: 'A',
      name: 'A Tier',
      color: '#f7931e',
      items: [
        { id: 'halloween', name: 'Halloween', emoji: '🎃', category: 'cultural' },
        { id: 'thanksgiving', name: 'Thanksgiving', emoji: '🦃', category: 'cultural' }
      ]
    }
  ],
  tags: ['holidays', 'personal', 'ranking'],
  isPublic: true,
  creatorId: '1',
  createdAt: new Date().toISOString(),
  views: 15,
  stats: { totalLikes: 5, totalComments: 2, totalShares: 1 }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Running in memory mode (no database required)`);
});