module.exports.corsOptions = {
  origin: [
    'localhost:3000',
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
