// Consistent API base URL for backend communication.
// Defaults to the deployed Render backend URL.
// In production (Vercel / Cloudflare), configure VITE_API_URL in your hosting dashboard if needed.
const envUrl = (import.meta.env.VITE_API_URL || '').trim();
const rawUrl = (envUrl || 'https://library-management-system-2-7fc2.onrender.com/api').replace(/\/+$/, '');

// Ensure /api is appended if omitted, preventing double /api or missing endpoints.
export const API_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
export const BOOKS_API_URL = `${API_URL}/books`;
