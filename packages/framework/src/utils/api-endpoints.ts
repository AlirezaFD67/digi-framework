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

// Articles management endpoints
const ARTICLES = {
  ADMIN_LEARNING_LIST: "/adminlearninglist",
  ADD_ARTICLE: "/admininsertlearningbase1",
  ADD_ARTICLE_BASE2: "/admininsertlearningbase2",
  UPDATE_ARTICLE: "/adminupdatelearning",
  GET_LEARNING_CAT_LIST: "/getlearningcatlist",
  UPLOAD_THUMBNAIL: "/adminuploadlearningimage",
  ADMIN_LEARNING_DETAIL: "/adminlearningbasedetails",
  ADMIN_LEARNING_BODY_DETAILS: "/adminlearningbodydetails",
  SEARCH_DOCS: "/adminlearningsearchdoc",
  ADMIN_FILE_MANAGER_LIST: "/adminfilemanagerlist",
  SAVE_CONTENT: "/admininsertlearningbody",
  ACCEPT_LEARNING: "/adminacceptlearning",
  UPLOAD_FILE: "/adminuploadnewfile",
} as const;

// File upload endpoints
const FILE = {
  UPLOAD_CHUNK: "/adminuploadnewfile",
} as const;

// Doctors endpoints
const DOCTORS = {
  GET_DOCTORS: "/getdoctors",
} as const;

// Doctor profile endpoints
const DOCTOR_PROFILE = {
  INSERT: "/insertdoctorprofile",
  GET_PROFILE: "/getdoctorsprofile",
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
  ARTICLES,
  FILE,
  DOCTORS,
  DOCTOR_PROFILE,
} as const;

export default API_ENDPOINTS;

// Export individual endpoint groups for convenience
export {
  AUTH,
  AUTH_TOKEN,
  ADMIN_TOKEN,
  USER,
  USERS,
  ARTICLES,
  FILE,
  DOCTORS,
  DOCTOR_PROFILE,
};
