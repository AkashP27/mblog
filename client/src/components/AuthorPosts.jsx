import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../config";
import Posts from "./Posts";
import Footer from "./Footer";
import PostSkeleton from "./PostSkeleton";
import CategoryList from "./CategoryList";
import FeaturedPost from "./FeaturedPost";

const AuthorPosts = () => {
	const { authorId } = useParams();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const { posts: featuredPosts } = useSelector((state) => state.featuredPosts);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const res = await axiosInstance.get(`/posts/author/${authorId}`);
				setPosts(res.data.data.posts);
				console.log(res.data.data.posts);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.error("Error fetching posts by author:", error);
			}
		};
		fetchPosts();
	}, [authorId]);

	return (
		<>
			<CategoryList />
			<div style={{ margin: "50px 0" }}>
				{loading ? (
					<PostSkeleton postCount={2} featureCount={3} type="home" />
				) : (
					<>
						<h1
							style={{ textAlign: "center", margin: "20px 0px" }}
						>{`Posts uploaded by ${posts[0]?.uploadedBy?.name}`}</h1>
						<div className="post_container max_width m_auto">
							<Posts posts={posts} />
							<FeaturedPost posts={featuredPosts} />
						</div>
					</>
				)}
			</div>
			<Footer />
		</>
	);
};

export default AuthorPosts;
