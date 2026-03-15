// ============================================================
// API Service - Centralized HTTP calls to the backend
// ============================================================

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Accident APIs
export const getAccidents   = () => API.get('/accidents');
export const createAccident = (data) => API.post('/accidents', data);
export const deleteAccident = (id) => API.delete(`/accidents/${id}`);

// Victim APIs
export const getVictims   = () => API.get('/victims');
export const createVictim = (data) => API.post('/victims', data);
export const deleteVictim = (id) => API.delete(`/victims/${id}`);

// Vehicle APIs
export const getVehicles   = () => API.get('/vehicles');
export const createVehicle = (data) => API.post('/vehicles', data);
export const deleteVehicle = (id) => API.delete(`/vehicles/${id}`);

// Response APIs
export const getResponses    = () => API.get('/responses');
export const getDropdownData = () => API.get('/responses/dropdown');
export const createResponse  = (data) => API.post('/responses', data);
export const deleteResponse  = (id) => API.delete(`/responses/${id}`);

// Transaction Demo
export const runTransactionDemo = () => API.post('/demo/transaction');
