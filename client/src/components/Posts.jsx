import React from "react";
import Post from "./Post";
import { NavLink } from "react-router-dom";
import "../styles/posts.css";

const Posts = ({ posts }) => {
	return (
		<>
			<div className="post_heading max_width m_auto">
				<h1>Posts</h1>
				<NavLink className="btnn" to="/write">
					Create Post
				</NavLink>
			</div>

			<div className="posts max_width m_auto">
				{posts?.map((p, index) => (
					<Post post={p} key={index} />
				))}
			</div>
		</>
	);
};

export default Posts;
