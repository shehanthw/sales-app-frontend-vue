import router from "../router";
import api from "./api";

export const logout = async () => {
  try {
    await api.post("auth/jwt/logout");
    router.push("/login");
  } catch (err) {
    console.error("Logout failed", err);
  }
};

export const login = async (formData: FormData) => {
  try {
    await api.post("/auth/jwt/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  } catch (err) {
    console.error("Login failed", err);
  }
};

export const healthCheck = async () => {
  try {
    const { data } = await api.get("/auth/check");
    return data.authenticated;
  } catch (err) {
    console.error("Health check failed", err);
    throw err; 
  }
};

export const getCurrentUser = async () => {
  try {
    const data = await api.get("/users/me");
    return data;
  } catch (err) {
    console.error("Health check failed", err);
    throw err; 
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await api.get("/api/users");
    return data;
  } catch (err) {
    console.error("Health check failed", err);
    throw err; 
  }
};

export const getUserById = async (user_id: string) => {
  try {
    const { data } = await api.get(`/api/user/${user_id}`);
    return data;
  } catch (err) {
    console.error("Health check failed", err);
    throw err; 
  }
};
