import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

// Password hashing
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// JWT token generation
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
};

// Pagination helper
export const createPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// Error response helper
export const createErrorResponse = (code, message, details = null) => {
  const error = {
    code,
    message,
    ...(details && { details }),
  };
  return { error };
};

// Success response helper
export const createSuccessResponse = (data, message = "Success") => {
  return {
    success: true,
    message,
    data,
  };
};

// Validation helpers
export const validateEmail = (email) => {
  return validator.isEmail(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Search helper
export const createSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};

  const searchConditions = fields.map((field) => ({
    [field]: { contains: searchTerm, mode: 'insensitive' },
  }));

  return { OR: searchConditions };
};

// Date formatting
export const formatDate = (date) => {
  return new Date(date).toISOString();
};

// File upload validation
export const validateImageUrl = (url) => {
  if (!url) return true;
  return validator.isURL(url) && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

// Rate limiting helper
export const createRateLimit = (windowMs, max) => {
  return {
    windowMs,
    max,
    message: {
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please try again later",
      },
    },
  };
};
