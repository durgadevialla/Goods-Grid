const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const corsOptions = {
  origin: [
    'https://goods-grid.vercel.app', 
    'https://goods-grid-6r8f.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes


app.use(express.json());

// Auth Routes
app.use('/api/auth', authRoutes);

let products = [
  { id: 1, name: 'Smart Mirror' },
  { id: 2, name: 'AI Lamp' },
  { id: 3, name: 'Wireless Charging Desk' },
];

// Product Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const { name } = req.body;
  const newProduct = { id: Date.now(), name };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.sendStatus(204);
});

// Gemini Chat Route
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
  const { query } = req.body;
  const productList = products.map(p => p.name).join(', ');

  const prompt = `
You are an AI product assistant.
User asked: "${query}"
Available products: ${productList}
Respond accordingly.
  `;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }
    
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log('Chat response generated successfully');
    res.json({ reply: text });
  } catch (err) {
    console.error('Gemini API error:', {
      error: err.message,
      stack: err.stack,
      apiKeyConfigured: !!process.env.GEMINI_API_KEY
    });
    res.status(500).json({ 
      reply: 'Chat service unavailable',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
