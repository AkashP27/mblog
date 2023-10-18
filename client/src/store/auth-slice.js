import { createSlice } from "@reduxjs/toolkit";

const authInitialState = {
	token: JSON.parse(localStorage.getItem("token")) || null,
	isFetching: false,
	error: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState: authInitialState,
	reducers: {
		loginStart: (state) => {
			state.token = null;
			state.isFetching = true;
			state.error = false;
			localStorage.setItem("token", JSON.stringify(state.token));
		},

		loginSuccess: (state, action) => {
			state.token = action.payload.token;
			state.isFetching = false;
			state.error = false;
			localStorage.setItem("token", JSON.stringify(state.token));
		},

		loginFailure: (state) => {
			state.token = null;
			state.isFetching = false;
			state.error = true;
			localStorage.setItem("token", JSON.stringify(state.token));
		},

		logout: (state) => {
			state.token = null;
			state.isFetching = false;
			state.error = false;
			localStorage.setItem("token", JSON.stringify(state.token));
		},
	},
});

export const authActions = authSlice.actions;

export default authSlice;
