const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'), { index: false }));

// Sample user data for DevOps CI/CD
const users = [
  { id: 1, name: 'DevOps Engineer', email: 'devops@example.com', role: 'Admin' },
  { id: 2, name: 'Cloud Architect', email: 'cloud@example.com', role: 'User' },
  { id: 3, name: 'CI/CD Specialist', email: 'cicd@example.com', role: 'User' }
];

// E-commerce products catalog for BOOM.COM
const products = [
  {
    id: 'prod-1',
    name: 'BOOM CyberPulse Wireless ANC Headphones',
    category: 'Audio',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviews: 1420,
    badge: 'BESTSELLER',
    badgeColor: '#e11d48',
    image: '🎧',
    description: 'Active Noise Cancellation, 40h battery life, Spatial Audio.'
  },
  {
    id: 'prod-2',
    name: 'BOOM Titan RTX 4080 Gaming Beast',
    category: 'Gaming',
    price: 1899.99,
    originalPrice: 2199.99,
    rating: 5.0,
    reviews: 860,
    badge: 'HOT DEAL',
    badgeColor: '#f97316',
    image: '💻',
    description: 'Intel i9 14th Gen, RTX 4080 16GB, 32GB DDR5, 240Hz QHD.'
  },
  {
    id: 'prod-3',
    name: 'BOOM Nova Ultra AMOLED Smartwatch',
    category: 'Wearables',
    price: 229.99,
    originalPrice: 279.99,
    rating: 4.8,
    reviews: 2150,
    badge: 'NEW',
    badgeColor: '#8b5cf6',
    image: '⌚',
    description: 'Sapphire glass, ECG, GPS, 14-day battery, 5ATM waterproof.'
  },
  {
    id: 'prod-4',
    name: 'BOOM Phantom RGB Optical Keyboard',
    category: 'Gaming',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.9,
    reviews: 3200,
    badge: 'TOP RATED',
    badgeColor: '#06b6d4',
    image: '⌨️',
    description: 'Hot-swappable switches, PBT keycaps, per-key RGB, wireless.'
  },
  {
    id: 'prod-5',
    name: 'BOOM Viper Pro Wireless 8K Mouse',
    category: 'Gaming',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 1890,
    badge: 'SALE',
    badgeColor: '#22c55e',
    image: '🖱️',
    description: '49g ultra-lightweight, 30,000 DPI sensor, 8000Hz polling rate.'
  },
  {
    id: 'prod-6',
    name: 'BOOM Vortex 4K Curved Gaming Monitor',
    category: 'Monitors',
    price: 449.99,
    originalPrice: 529.99,
    rating: 4.9,
    reviews: 950,
    badge: 'POPULAR',
    badgeColor: '#ec4899',
    image: '🖥️',
    description: '34-inch UWQHD, 165Hz, HDR1000, 1000R curvature, Quantum Dot.'
  },
  {
    id: 'prod-7',
    name: 'BOOM Core VR Metaverse Pro Headset',
    category: 'Gaming',
    price: 599.99,
    originalPrice: 699.99,
    rating: 4.8,
    reviews: 640,
    badge: 'LIMITED',
    badgeColor: '#6366f1',
    image: '🥽',
    description: '4K Micro-OLED per eye, eye-tracking, pancake lenses, spatial 3D.'
  },
  {
    id: 'prod-8',
    name: 'BOOM HyperCharge 100W GaN Station',
    category: 'Accessories',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.6,
    reviews: 4120,
    badge: 'MUST HAVE',
    badgeColor: '#eab308',
    image: '⚡',
    description: '4-Port Fast Charging (3x USB-C, 1x USB-A), compact travel size.'
  }
];

// Root Endpoint - Serves HTML when accessed via browser, JSON when requested via API/CI-CD
app.get('/', (req, res) => {
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('text/html') && !acceptHeader.startsWith('application/json')) {
    return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }
  res.status(200).json({
    application: 'nodejs-cicd-app',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    message: 'Welcome to Node.js CI/CD Practice API'
  });
});

// Health Check Endpoint - Used for CI/CD checks and PM2/load balancers
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP'
  });
});

// API Users Endpoint
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// API E-commerce Products Endpoint
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  res.status(200).json({
    store: 'BOOM.COM',
    total: filtered.length,
    products: filtered
  });
});

// Mock Checkout Endpoint
app.post('/api/checkout', (req, res) => {
  const { items, promoCode } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const orderId = 'BOOM-' + Math.floor(100000 + Math.random() * 900000);
  res.status(200).json({
    success: true,
    orderId,
    message: 'Thank you for your purchase from BOOM.COM!',
    status: 'CONFIRMED'
  });
});

module.exports = app;
