import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 8000;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"