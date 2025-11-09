// Vercel Serverless Function for tier lists
let tierLists = [
  {
    id: '1',
    title: 'Demo Holiday Rankings',
    description: 'A sample tier list showing holiday preferences',
    tiers: [
      {
        id: 'S',
        name: 'S Tier',
        color: '#ff6b35',
        items: [
          { id: 'spring-festival', name: '春节', emoji: '🧧', category: 'traditional' },
          { id: 'new-year', name: '元旦', emoji: '🎊', category: 'national' }
        ]
      },
      {
        id: 'A',
        name: 'A Tier',
        color: '#f7931e',
        items: [
          { id: 'mid-autumn', name: '中秋节', emoji: '🥮', category: 'traditional' },
          { id: 'national-day', name: '国庆节', emoji: '🇨🇳', category: 'national' }
        ]
      }
    ],
    tags: ['holidays', 'demo', 'ranking'],
    isPublic: true,
    createdAt: new Date().toISOString(),
    views: 42,
    stats: { totalLikes: 15, totalComments: 3, totalShares: 2 }
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
    case 'GET':
      // Get all tier lists
      res.status(200).json({
        tierLists: tierLists.map(tl => ({
          ...tl,
          creator: { username: 'Demo User', avatar: '', id: 'demo' }
        })),
        pagination: {
          page: 1,
          limit: 10,
          total: tierLists.length,
          pages: 1
        }
      });
      break;

    case 'POST':
      // Create new tier list
      const { title, description, tiers, tags, isPublic } = req.body;

      if (!title || !tiers) {
        return res.status(400).json({ message: 'Title and tiers are required' });
      }

      const newTierList = {
        id: (tierLists.length + 1).toString(),
        title,
        description: description || '',
        tiers: tiers || [],
        tags: tags || [],
        isPublic: isPublic !== false,
        createdAt: new Date().toISOString(),
        views: 0,
        stats: { totalLikes: 0, totalComments: 0, totalShares: 0 }
      };

      tierLists.push(newTierList);

      res.status(201).json({
        ...newTierList,
        creator: { username: 'Demo User', avatar: '', id: 'demo' }
      });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}