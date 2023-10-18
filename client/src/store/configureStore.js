import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";

const store = configureStore({
	reducer: {
		authentication: authSlice.reducer,
	},
});

export default store;
