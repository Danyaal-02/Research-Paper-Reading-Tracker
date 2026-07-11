export const AUTH_MESSAGES = {
  WELCOME_BACK: "Welcome Back",
  SIGN_IN_SUBTITLE: "Sign in to continue tracking your research",
  EMAIL_PLACEHOLDER: "you@university.edu",
  PASSWORD_PLACEHOLDER: "••••••••",
  LOGIN_SUCCESS: "Welcome back!",
  LOGIN_ERROR: "Login failed. Please try again.",
  SIGNUP_SUCCESS: "Account created successfully!",
  SIGNUP_ERROR: "Signup failed. Please try again.",
} as const;

export const PAPER_MESSAGES = {
  EMPTY_TITLE: "No papers found",
  EMPTY_SUBTITLE: "Add your first research paper to start tracking your reading progress, or adjust your filters.",
  ADD_SUCCESS: "Paper added successfully!",
  ADD_ERROR: "Failed to add paper. Please try again.",
} as const;
