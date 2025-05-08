// src/config.js
export const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://tu-app.up.railway.app/api'
    : 'http://127.0.0.1:8000/api';
