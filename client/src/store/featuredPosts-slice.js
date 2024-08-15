import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../config";

const featuredInitialState = {
	posts: [],
	loading: false,
	error: null,
};

export const fetchFeaturedPosts = createAsyncThunk(
	"featuredPosts/fetchFeaturedPosts",
	async (_, { rejectWithValue }) => {
		try {
			const res = await axiosInstance.get("/posts?featured=true");
			return res.data.data.posts;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const featuredPostsSlice = createSlice({
	name: "featuredPosts",
	initialState: featuredInitialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFeaturedPosts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchFeaturedPosts.fulfilled, (state, action) => {
				state.posts = action.payload;
				state.loading = false;
			})
			.addCase(fetchFeaturedPosts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default featuredPostsSlice;
