import React, { useState, useEffect } from "react";
import Header from "./Header";
import Posts from "./Posts";
import { axiosInstance } from "../config";
import { NavLink } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
	display: "block",
	margin: "200px auto",
};

const Home = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const myAbortController = new AbortController();

		const fetchPosts = async () => {
			try {
				const res = await axiosInstance.get(`/posts`, {
					signal: myAbortController.signal,
				});

				setLoading(false);

				// console.log(res.data);
				setPosts(res.data.data.posts);
			} catch (err) {
				if (!myAbortController.signal.aborted) {
					console.log(err.response);
				}
			}
		};

		fetchPosts();

		return () => {
			myAbortController.abort();
		};
	}, []);

	return (
		<>
			<Header />
			<div className="post_heading max_width m_auto">
				<h1 style={{ fontFamily: "'Nunito', sans-serif" }}>Posts</h1>
				<NavLink className="btnn" to="/write">
					Create Post
				</NavLink>
			</div>
			{loading ? (
				<ClipLoader
					color={"#36d7b7"}
					// loading={loading}
					cssOverride={override}
					size={50}
					width={100}
					display="block"
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			) : (
				<>
					{posts.length > 0 ? (
						<Posts posts={posts} />
					) : (
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<h1
								style={{
									fontFamily: "'Nunito', sans-serif",
									marginBottom: "450px",
								}}
							>
								No posts found...!!
							</h1>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default Home;
