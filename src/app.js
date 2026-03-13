require('dotenv').config();
const express  = require('express');
const cors     = require('cors');

const connectDB = require('./config/database'); // MongoDB connection

const authRoutes    = require('./routes/auth');
const postRoutes    = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes    = require('./routes/likes');

const app  = express();
const PORT = process.env.PORT || 3000;

/* Connect MongoDB */
connectDB();

/* Middlewares */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Logger for development */
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

/* Test Route */
app.get('/', (_req, res) =>
  res.json({ message: '📝 Blog Backend API', version: '1.0.0' })
);

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api', likeRoutes);

/* 404 Handler */
app.use((_req, res) =>
  res.status(404).json({ error: 'Route not found' })
);

/* Error Handler */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

/* Start Server */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;