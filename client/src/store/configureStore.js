import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import featuredPostsSlice from "./featuredPosts-slice";

const store = configureStore({
	reducer: {
		authentication: authSlice.reducer,
		featuredPosts: featuredPostsSlice.reducer,
	},
});

export default store;
