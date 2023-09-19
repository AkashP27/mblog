import React from "react";
import Post from "./Post";
import "../styles/posts.css";

const Posts = ({ posts }) => {
	return (
		<>
			<div className="posts max_width m_auto">
				{posts?.map((p, index) => (
					<Post post={p} key={index} />
				))}
			</div>
		</>
	);
};

export default Posts;
