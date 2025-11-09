// Vercel Serverless Function for health check
export default function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'Holiday Tier List API is running on Vercel',
    timestamp: new Date().toISOString(),
    mode: 'serverless'
  });
}