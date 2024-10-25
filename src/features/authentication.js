import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  isFirstLogin: false,
  accessToken: "",
  username: "",
  isAdmin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setFirstLogin(state, action) {
      state.isFirstLogin = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setIsAdmin(state, action) {
      state.isAdmin = action.payload;
    },
    signout(state) {
      state.isLoggedIn = false;
      state.isFirstLogin = false;
      state.accessToken = "";
      state.isAdmin = false;
      state.username = "";
    },
  },
});

// Exporting actions
export const { setIsLoggedIn, setFirstLogin, setAccessToken, setUsername, setIsAdmin, signout } = userSlice.actions;

// Exporting reducer
export default userSlice.reducer;
