import { createSlice } from "@reduxjs/toolkit";

const authInitialState = {
	token: JSON.parse(localStorage.getItem("token")) || null,
	avatarURL: JSON.parse(localStorage.getItem("avatarURL")) || "",
	isFetching: false,
	error: false,
};

const authSlice = createSlice({
	name: "auth",
	initialState: authInitialState,
	reducers: {
		loginStart: (state) => {
			state.token = null;
			state.avatarURL = "";
			state.isFetching = true;
			state.error = false;
			localStorage.setItem("token", JSON.stringify(state.token));
			localStorage.setItem("avatarURL", JSON.stringify(state.avatarURL));
		},

		loginSuccess: (state, action) => {
			state.token = action.payload.token;
			state.avatarURL = action.payload.user.avatarURL;
			state.isFetching = false;
			state.error = false;
			localStorage.setItem("token", JSON.stringify(state.token));
			localStorage.setItem("avatarURL", JSON.stringify(state.avatarURL));
		},

		loginFailure: (state) => {
			state.token = null;
			state.avatarURL = "";
			state.isFetching = false;
			state.error = true;
			localStorage.setItem("token", JSON.stringify(state.token));
			localStorage.setItem("avatarURL", JSON.stringify(state.avatarURL));
		},

		logout: (state) => {
			state.token = null;
			state.avatarURL = "";
			state.isFetching = false;
			state.error = false;
			localStorage.setItem("token", JSON.stringify(state.token));
			localStorage.setItem("avatarURL", JSON.stringify(state.avatarURL));
		},
	},
});

export const authActions = authSlice.actions;

export default authSlice;
