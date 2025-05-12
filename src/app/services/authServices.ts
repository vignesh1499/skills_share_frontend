import apiClient from "./apiClient";

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

