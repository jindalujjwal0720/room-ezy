import { createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  isLoggedIn: boolean;
  isProfileUpdated: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isProfileUpdated: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { accessToken, user } = action.payload;
      localStorage.setItem('room-ezy-access-token', accessToken);
      state.isLoggedIn = true;
      state.isProfileUpdated =
        user.name !== 'NONE' && user.admissionNumber !== 'NONE';
      state.isAdmin = user.role === 'admin';
    },
    setUser(state, action) {
      const user = action.payload;
      console.log(user);
      state.isProfileUpdated =
        user.name !== 'NONE' && user.admissionNumber !== 'NONE';
      state.isAdmin = user.role === 'admin';
    },
    clearCredentials(state) {
      state.isLoggedIn = false;
      state.isProfileUpdated = false;
      state.isAdmin = false;
      localStorage.removeItem('room-ezy-access-token');
    },
  },
});

interface State {
  auth: AuthState;
}

export const selectIsLoggedIn = (state: State) => state.auth.isLoggedIn;
export const selectIsProfileUpdated = (state: State) =>
  state.auth.isProfileUpdated;
export const selectIsAdmin = (state: State) => state.auth.isAdmin;

export const { setCredentials, setUser, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
