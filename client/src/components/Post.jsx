import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/posts.css";
import Avatar from "react-avatar";
import categoryColors from "../utils/categoryColors";

const Post = ({ post }) => {
	const [loaded, setLoaded] = useState(false);

	const getCategoryColor = (category) => {
		return categoryColors[category] || categoryColors.Default;
	};

	const date = new Date(post.createdAt);
	const formattedDate = `${date.getDate()}.${
		date.getMonth() + 1
	}.${date.getFullYear()}`;

	const handleLinkClick = () => {
		localStorage.setItem("activeLink", "");
	};

	return (
		<div className="post">
			<Link
				to={`/posts/${post._id}`}
				className="link"
				onClick={handleLinkClick}
			>
				{post.imageURL && (
					<img
						className={`post_img ${loaded ? "loaded" : "loading"}`}
						src={post.imageURL}
						alt=""
						onLoad={() => setLoaded(true)}
					/>
				)}
			</Link>
			<div className="post_info">
				<span className="post_title">
					<span>{post.title}</span>
				</span>
				<div className="author_date_container">
					<span className="author_avatar">
						<Avatar
							name={post.author}
							src={
								post?.uploadedBy?.avatarURL ? post?.uploadedBy?.avatarURL : ""
							}
							size={32}
							round={true}
							maxInitials={3}
							className="myprofile_img"
						/>
					</span>
					<span className="author">{post?.uploadedBy?.name}</span>
					<span>{formattedDate}</span>
				</div>
				<div className="post-category">
					{post?.category?.map((cat, index) => (
						<p key={index} style={{ backgroundColor: getCategoryColor(cat) }}>
							{cat}
						</p>
					))}
				</div>
				<div
					className="post_desc"
					dangerouslySetInnerHTML={{ __html: post.desc }}
				/>
				<Link to={`/posts/${post._id}`} className="read_post">
					Read article
				</Link>
			</div>
		</div>
	);
};

export default Post;
