/**
 * Application constants and configuration values.
 *
 * Centralizes all constants used throughout the application
 * for easy maintenance and consistency.
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: "access_token",
  USER_KEY: "user",
  TOKEN_REFRESH_THRESHOLD: 300000, // 5 minutes before expiry
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// User Roles
export const USER_ROLES = {
  ANONYMOUS: "anonymous",
  REGISTERED: "registered",
} as const;

// Permissions
export const PERMISSIONS = {
  VIEW_EVENTS: "view_events",
  MANAGE_RESERVATIONS: "manage_reservations",
  MANAGE_EVENTS: "manage_events",
  ADMIN_ACCESS: "admin_access",
} as const;

// Reservation Status
export const RESERVATION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

// Business Rules
export const BUSINESS_RULES = {
  MAX_TICKETS_PER_RESERVATION: 10,
  RESERVATION_TIMEOUT_MINUTES: 15,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MAX_EVENT_TITLE_LENGTH: 255,
  MAX_SEARCH_LENGTH: 100,
} as const;

// UI Constants
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY_DATE: "MMM dd, yyyy",
  DISPLAY_DATETIME: "MMM dd, yyyy at h:mm a",
  INPUT_DATE: "yyyy-MM-dd",
  INPUT_DATETIME: "yyyy-MM-ddTHH:mm",
  API_FORMAT: "yyyy-MM-ddTHH:mm:ss",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  UNAUTHORIZED: "Please log in to continue.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
  GENERIC_ERROR: "An unexpected error occurred. Please try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in!",
  REGISTRATION_SUCCESS: "Account created successfully!",
  RESERVATION_CREATED: "Reservation created successfully!",
  PAYMENT_PROCESSED: "Payment processed successfully!",
  RESERVATION_CANCELLED: "Reservation cancelled successfully!",
  EVENT_CREATED: "Event created successfully!",
  EVENT_UPDATED: "Event updated successfully!",
  EVENT_DELETED: "Event deleted successfully!",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "ticket_reservation_token",
  USER_DATA: "ticket_reservation_user",
  THEME_PREFERENCE: "ticket_reservation_theme",
  LANGUAGE_PREFERENCE: "ticket_reservation_language",
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: "#3b82f6",
    PRIMARY_DARK: "#1d4ed8",
    SECONDARY: "#64748b",
    SUCCESS: "#10b981",
    WARNING: "#f59e0b",
    ERROR: "#ef4444",
    INFO: "#06b6d4",
  },
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px",
    LG: "1024px",
    XL: "1280px",
    "2XL": "1536px",
  },
} as const;

// Route Paths
export const ROUTES = {
  HOME: "/",
  EVENTS: "/events",
  EVENT_DETAILS: "/events/:id",
  RESERVATIONS: "/reservations",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  ADMIN: "/admin",
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_REGISTRATION: true,
  ENABLE_PAYMENT_PROCESSING: true,
  ENABLE_EVENT_SEARCH: true,
  ENABLE_NOTIFICATIONS: false,
  ENABLE_ANALYTICS: false,
} as const;

// Environment
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_TEST: process.env.NODE_ENV === "test",
} as const;
