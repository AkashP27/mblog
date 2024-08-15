import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Header from "./Header";
import Posts from "./Posts";
import FeaturedPost from "./FeaturedPost";
import CategoryList from "./CategoryList";
import Footer from "./Footer";
import { axiosInstance } from "../config";
import PostSkeleton from "./PostSkeleton";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";

const Home = () => {
	const [postsData, setPostsData] = useState([]);
	const [search, setSearch] = useState("");
	const [focused, setFocused] = useState(false);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);

	const { posts: featuredPosts } = useSelector(
		(state) => state.featuredPosts || {}
	);

	const searchHandler = (e) => {
		setSearch(e.target.value);
		setPage(1);
	};

	useEffect(() => {
		const myAbortController = new AbortController();
		window.scrollTo(0, 550);

		if (!search) {
			setLoading(true);
		}

		const fetchPosts = async () => {
			setLoading(true);
			try {
				const res = await axiosInstance.get(
					`/posts?search=${search}&page=${page}`,
					{
						signal: myAbortController.signal,
					}
				);
				setPostsData(res.data.data);
				setLoading(false);
			} catch (err) {
				setLoading(false);
				if (!myAbortController.signal.aborted) {
					toast.error(err.response.data.message);
				}
			}
		};

		let timeout = setTimeout(() => {
			fetchPosts();
		}, 500);

		return () => {
			clearTimeout(timeout);
			myAbortController.abort();
		};
	}, [search, page]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handlePageChange = (newPage) => {
		setPage(newPage);
	};

	return (
		<>
			<Header />
			<CategoryList />
			<div className="post_heading max_width m_auto">
				<div className={`search ${focused ? "focused" : ""}`}>
					<i className="search-icon fas fa-search"></i>
					<input
						type="search"
						placeholder="Search by post title or author..."
						onChange={searchHandler}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
					/>
				</div>
				<NavLink
					className="btnn"
					to="/write"
					onClick={() => localStorage.setItem("activeLink", "/write")}
				>
					Create Post
				</NavLink>
			</div>
			{loading ? (
				<PostSkeleton type="home" postCount={6} featureCount={3} />
			) : (
				<>
					{postsData?.posts?.length > 0 ? (
						<div className="post_container max_width m_auto">
							<Posts posts={postsData.posts} />
							<FeaturedPost posts={featuredPosts} />
						</div>
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
									marginBottom: "450px",
								}}
							>
								No posts found...!!
							</h1>
						</div>
					)}
					<div style={{ display: search ? "none" : "block" }}>
						<Pagination
							currentPage={page}
							onPageChange={handlePageChange}
							totalResults={postsData.postCount}
						/>
					</div>
				</>
			)}
			<Footer />
		</>
	);
};

export default Home;
