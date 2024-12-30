import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { register, logIn, logout } from "./operations";

const initialState = {
  user: {
    name: null,
    email: null,
  },
  isLoggedIn: false,
  isLoading: false,
  isError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = { name: null, email: null };
        state.isLoggedIn = false;
      })
      .addMatcher(
        isAnyOf(register.pending, logIn.pending, logout.pending),
        (state) => {
          state.isLoading = true;
          state.isError = null;
        }
      )
      .addMatcher(
        isAnyOf(register.fulfilled, logIn.fulfilled, logout.fulfilled),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(register.rejected, logIn.rejected, logout.rejected),
        (state, action) => {
          state.isLoading = false;
          state.isError = action.payload;
        }
      );
  },
});

export const authReducer = authSlice.reducer;
