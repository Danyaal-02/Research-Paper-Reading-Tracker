export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Logged out successfully", // matching user request example
  NOT_ALLOWED_CORS: "Origin not allowed by CORS",
  ROUTE_NOT_FOUND: "Route not found on this server.",
  UNAUTHORIZED: "Unauthorized access. Token missing or invalid.",
  INVALID_CREDENTIALS: "The email or password provided is incorrect.",
  
  // Existing backend auth messages
  USER_EXISTS: "User already exists",
  INVALID_LOGIN: "Invalid email or password",
  LOGOUT_SUCCESS: "Logged out successfully",
  USER_NOT_FOUND: "User not found",
  NO_USER_FOUND: "No user found",
  AUTH_NO_TOKEN: "Not authorized, no token",
  AUTH_USER_NOT_FOUND: "Not authorized, user not found",
  AUTH_TOKEN_FAILED: "Not authorized, token failed",
  TOO_MANY_ATTEMPTS: "Too many login attempts. Try again later."
} as const;

export const PAPER_MESSAGES = {
  CREATE_SUCCESS: "Research paper successfully tracked.",
  FETCH_SUCCESS: "Library collection loaded successfully.",
  NOT_FOUND: "Requested research paper could not be found.",
  VALIDATION_ERROR: "Required fields missing or formatting incorrect.",
} as const;

export const GENERAL_MESSAGES = {
  API_RUNNING: "Research Paper Tracker API is running 🚀",
  SERVER_ERROR: "Server Error"
} as const;
