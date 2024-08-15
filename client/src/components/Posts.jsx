import React from "react";
import "../styles/posts.css";
import LazyLoad from "./LazyLoadPosts";

const Posts = ({ posts }) => {
	return (
		<>
			<div className="posts max_width m_auto">
				{posts?.map((p, index) => (
					<LazyLoad post={p} key={index} />
				))}
			</div>
		</>
	);
};

export default Posts;
