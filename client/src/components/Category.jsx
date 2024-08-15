import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Posts from "./Posts";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../config";
import CategoryList from "./CategoryList";
import PostSkeleton from "./PostSkeleton";
import FeaturedPost from "./FeaturedPost";
import Footer from "./Footer";

const Category = () => {
	const location = useLocation();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [category, setCategory] = useState("");

	const { posts: featuredPosts } = useSelector((state) => state.featuredPosts);

	useEffect(() => {
		const myAbortController = new AbortController();
		window.scrollTo(0, 0);
		const queryParams = new URLSearchParams(location.search);
		const categoryParam = queryParams.get("category") || "";
		setCategory(categoryParam);

		const fetchPosts = async () => {
			try {
				setLoading(true);
				const res = await axiosInstance.get(
					`/posts?category=${categoryParam}`,
					{
						signal: myAbortController.signal,
					}
				);
				setPosts(res.data.data.posts);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				if (error.response && error.response.status === 404) {
					setPosts([]);
				}
				console.error("Error fetching posts:", error);
				// Handle error (e.g., show error message)
			}
		};

		fetchPosts();

		return () => {
			myAbortController.abort();
		};
	}, [location.search]);

	return (
		<>
			<CategoryList />
			<>
				<div style={{ margin: "50px 0" }}>
					{loading ? (
						<PostSkeleton postCount={2} type="home" featureCount={3} />
					) : (
						<>
							{posts?.length > 0 ? (
								<>
									<h1
										style={{
											marginBottom: "20px",
											textAlign: "center",
										}}
									>
										{category
											? `Showing results for ${category}`
											: `Showing results for All`}
									</h1>
									<div className="post_container max_width m_auto">
										<Posts posts={posts} />
										<FeaturedPost posts={featuredPosts} />
									</div>
								</>
							) : (
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										height: "40vh",
									}}
								>
									<h1>{`No posts found in ${category}`}</h1>
								</div>
							)}
						</>
					)}
				</div>
			</>
			<Footer />
		</>
	);
};

export default Category;
