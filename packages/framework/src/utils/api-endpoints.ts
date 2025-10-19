/**
 * Centralized API endpoints configuration
 * All endpoints should be defined here to avoid hardcoding
 */

// Authentication endpoints
const AUTH = {

  OTP_VERIFY: "/authenticateOTP",
} as const;

// Auth token endpoint (Django-style token auth)
const AUTH_TOKEN = {
  CREATE: "/api-token-auth",
} as const;

// Admin token endpoint
const ADMIN_TOKEN = {
  CREATE: "/admin-api-token",
} as const;

// User management endpoints
const USER = {
  PROFILE: "/getuserprofile",
} as const;

// Users management (admin)
const USERS = {
  LIST: "/admin/users",
  CREATE: "/admin/users",
  UPDATE: "/admin/users",
  DELETE: "/admin/users",
  BULK_DELETE: "/admin/users/bulk-delete",
  EXPORT: "/admin/users/export",
} as const;



/**
 * Main API endpoints object
 * Add new endpoint groups here
 */
const API_ENDPOINTS = {
  AUTH,
  AUTH_TOKEN,
  ADMIN_TOKEN,
  USER,
  USERS,

} as const;

export default API_ENDPOINTS;

// Export individual endpoint groups for convenience
export {
  AUTH,
  AUTH_TOKEN,
  ADMIN_TOKEN,
  USER,
  USERS,
};
