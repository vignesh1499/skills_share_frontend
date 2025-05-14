import { jwtDecode } from "jwt-decode";

// Define expected structure of your token payload
interface DecodedToken {
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export const decodeToken = (token: string): DecodedToken | null => {
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};
