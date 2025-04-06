/**
 * Environment variables for the application.
 * Provides access to environment variables with proper typing and defaults.
 */

/**
 * API base URL for the Despatch Advice API.
 * Uses environment variable in production or localhost in development.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

