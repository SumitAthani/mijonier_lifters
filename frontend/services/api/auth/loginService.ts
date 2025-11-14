import apiClient from "../apiClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const loginService = async (payload: LoginPayload): Promise<any> => {
  try {
    const response = await apiClient.post("/api/auth/login", payload);

    // If your backend returns token
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.user;
  } catch (error: any) {
    // Safe readable error
    const message =
      error.response?.data?.message ||
      "Login failed! Please check your credentials.";

    throw new Error(message);
  }
};
