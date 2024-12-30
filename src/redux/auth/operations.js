import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const goItApi = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

goItApi.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

goItApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await goItApi.post("/auth/refresh");

        const { accessToken } = refreshResponse.data.data;

        localStorage.setItem("accessToken", accessToken);

        goItApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        return goItApi(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const res = await goItApi.post("/auth/register", credentials);
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return thunkAPI.rejectWithValue(
          "User with this email is already registered"
        );
      }
      return thunkAPI.rejectWithValue("Registration failed. Please try again.");
    }
  }
);

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await goItApi.post("/auth/login", credentials);
      localStorage.setItem("accessToken", res.data.data.accessToken);
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue("Invalid email or password.");
      }
      return thunkAPI.rejectWithValue("Login failed. Please try again later.");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await goItApi.post("/auth/logout");
    localStorage.removeItem("accessToken");
  } catch {
    return thunkAPI.rejectWithValue("Logout failed. Please try again.");
  }
});
