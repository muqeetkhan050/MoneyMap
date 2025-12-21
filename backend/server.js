
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Body Parser
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Routes
console.log('🔧 Loading routes...');

// Test route before auth
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

try {
  const authRoutes = require("./routes/auth");
  app.use("/api/auth", authRoutes);
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.error('❌ Auth routes failed:', err.message);
}

try {
  const analyticsRoutes = require("./routes/analytics");
  app.use('/api/analytics', analyticsRoutes);
  console.log('✅ Analytics routes loaded');
} catch (err) {
  console.error('❌ Analytics routes failed:', err.message);
}

try {
  const uploadRoutes = require("./routes/upload");
  app.use('/api/upload', uploadRoutes);
  console.log('✅ Upload routes loaded');
} catch (err) {
  console.error('❌ Upload routes failed:', err.message);
}

// MongoDB Connection - SIMPLIFIED
console.log('\n🔗 Connecting to MongoDB...');
const connectDB = async () => {
  try {
    // Simple connection - remove deprecated options
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
    console.log(`📡 Ready State: ${mongoose.connection.readyState}`);
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check .env file has correct MONGO_URI');
    console.log('2. Try this connection string:');
    console.log('   mongodb+srv://muqeetkhan050:Frigrate0337007@cluster0.ajh2vsl.mongodb.net/moneymap');
    console.log('3. Check MongoDB Atlas → Network Access → Add IP 0.0.0.0/0');
  }
};

connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});