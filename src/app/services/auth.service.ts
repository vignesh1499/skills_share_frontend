import apiClient from "./api_client";
import Cookies from "js-cookie"

//Login API Function
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });
    return response;
  } catch (error) {
    throw error;
  }
};


// Register API Function
export const register = async (userDetails: any) => {
  try {
    const response = await apiClient.post("/auth/register", userDetails);
    return response;
  } catch (error) {
    throw error;
  }
};

export const setAuthToken = (token: string) => {
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000); // 1 hour in milliseconds

  Cookies.set('token', token, {
    expires: oneHourFromNow,
    secure: true,
    sameSite: 'Strict',
    path: '/',
  });
};


export const getAuthToken = () => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token');
};



