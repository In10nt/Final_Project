const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = 'mySecretKey123456789012345678901234567890';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data
let tenants = [
  {
    id: uuidv4(),
    name: 'Demo Shop',
    subdomain: 'demo',
    contactEmail: 'admin@demo.com',
    status: 'active'
  }
];

let users = [
  {
    id: uuidv4(),
    tenantId: tenants[0].id,
    email: 'admin@demo.com',
    passwordHash: bcrypt.hashSync('demo123', 10),
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    id: uuidv4(),
    tenantId: tenants[0].id,
    email: 'customer@demo.com',
    passwordHash: bcrypt.hashSync('customer123', 10),
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer'
  }
];

let products = [
  {
    id: uuidv4(),
    tenantId: tenants[0].id,
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt perfect for everyday wear',
    brand: 'Nike',
    price: 29.99,
    currency: 'USD',
    barcode: '1234567890123',
    sku: 'NIKE-TSHIRT-001',
    color: 'Blue',
    material: '100% Cotton',
    status: 'active'
  },
  {
    id: uuidv4(),
    tenantId: tenants[0].id,
    name: 'Denim Jeans',
    description: 'Classic denim jeans with perfect fit',
    brand: 'Levi\'s',
    price: 79.99,
    currency: 'USD',
    barcode: '1234567890124',
    sku: 'LEVIS-JEANS-001',
    color: 'Dark Blue',
    material: '98% Cotton, 2% Elastane',
    status: 'active'
  }
];

// Health check
app.get('/actuator/health', (req, res) => {
  res.json({ status: 'UP', service: 'virtual-tryon-backend' });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { 
      userId: user.id, 
      tenantId: user.tenantId, 
      userType: user.role,
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    },
    tenantId: user.tenantId
  });
});

app.post('/api/auth/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.role === 'admin');
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = jwt.sign(
    { 
      userId: user.id, 
      tenantId: user.tenantId, 
      userType: 'admin',
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }
  });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Product endpoints
app.get('/api/products', authenticateToken, (req, res) => {
  const { page = 0, size = 20 } = req.query;
  const tenantProducts = products.filter(p => p.tenantId === req.user.tenantId);
  
  const startIndex = page * size;
  const endIndex = startIndex + parseInt(size);
  const paginatedProducts = tenantProducts.slice(startIndex, endIndex);

  res.json({
    content: paginatedProducts,
    totalElements: tenantProducts.length,
    totalPages: Math.ceil(tenantProducts.length / size),
    size: parseInt(size),
    number: parseInt(page)
  });
});

app.get('/api/products/:id', authenticateToken, (req, res) => {
  const product = products.find(p => p.id === req.params.id && p.tenantId === req.user.tenantId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/products/barcode/:barcode', authenticateToken, (req, res) => {
  const product = products.find(p => p.barcode === req.params.barcode && p.tenantId === req.user.tenantId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', authenticateToken, (req, res) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const newProduct = {
    id: uuidv4(),
    tenantId: req.user.tenantId,
    ...req.body,
    status: 'active'
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Body profile data storage
let bodyProfiles = [];

// Body profile endpoints
app.get('/api/body-profiles/me', authenticateToken, (req, res) => {
  const profile = bodyProfiles.find(p => p.userId === req.user.userId);
  if (!profile) {
    return res.status(404).json({ error: 'Body profile not found' });
  }
  res.json(profile);
});

app.put('/api/body-profiles/me', authenticateToken, (req, res) => {
  const existingProfileIndex = bodyProfiles.findIndex(p => p.userId === req.user.userId);
  
  const profileData = {
    id: existingProfileIndex >= 0 ? bodyProfiles[existingProfileIndex].id : uuidv4(),
    userId: req.user.userId,
    tenantId: req.user.tenantId,
    height: req.body.height,
    weight: req.body.weight,
    chest: req.body.chest,
    waist: req.body.waist,
    hip: req.body.hip,
    bodyShape: req.body.bodyShape,
    skinTone: req.body.skinTone,
    updatedAt: new Date().toISOString()
  };

  if (existingProfileIndex >= 0) {
    bodyProfiles[existingProfileIndex] = profileData;
  } else {
    profileData.createdAt = new Date().toISOString();
    bodyProfiles.push(profileData);
  }

  res.json(profileData);
});

app.post('/api/body-profiles/me', authenticateToken, (req, res) => {
  // Check if profile already exists
  const existingProfile = bodyProfiles.find(p => p.userId === req.user.userId);
  if (existingProfile) {
    return res.status(409).json({ error: 'Body profile already exists. Use PUT to update.' });
  }

  const profileData = {
    id: uuidv4(),
    userId: req.user.userId,
    tenantId: req.user.tenantId,
    height: req.body.height,
    weight: req.body.weight,
    chest: req.body.chest,
    waist: req.body.waist,
    hip: req.body.hip,
    bodyShape: req.body.bodyShape,
    skinTone: req.body.skinTone,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  bodyProfiles.push(profileData);
  res.status(201).json(profileData);
});

// Analytics endpoints
app.get('/api/analytics/dashboard', authenticateToken, (req, res) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const tenantProducts = products.filter(p => p.tenantId === req.user.tenantId);
  const tenantUsers = users.filter(u => u.tenantId === req.user.tenantId && u.role === 'customer');

  res.json({
    totalCustomers: tenantUsers.length,
    totalProducts: tenantProducts.length,
    totalTryOns: 8750,
    conversionRate: 12.5,
    averageFitScore: 0.84
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Virtual Try-On Mock Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/actuator/health`);
  console.log(`📚 Demo credentials:`);
  console.log(`   Admin: admin@demo.com / demo123`);
  console.log(`   Customer: customer@demo.com / customer123`);
});