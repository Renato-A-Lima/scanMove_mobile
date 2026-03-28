import axios from 'axios';

// Troque conforme seu ambiente:
const API_BASE_URL = 'http://10.0.2.2:3000'; // Android emulator
// const API_BASE_URL = 'http://localhost:3000'; // iOS simulator
// const API_BASE_URL = 'http://192.168.0.25:3000'; // celular físico

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});