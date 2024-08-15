import React from "react";
import "../styles/postskeleton.css";

const PostSkeleton = ({ type, postCount, featureCount }) => {
	const Skeleton = () => (
		<div className="post-skeleton">
			<div className="post-skeleton-img"></div>
			<div className="post-skeleton-info">
				<div className="post-skeleton-title"></div>
				<div className="post-skeleton-author-date-container">
					<div className="post-skeleton-author-avatar"></div>
					<div className="post-skeleton-author"></div>
					<div className="post-skeleton-date"></div>
				</div>
				<div className="post-skeleton-desc"></div>
			</div>
		</div>
	);

	const FeaturedSkeleton = () => (
		<div className="featured-skeleton">
			<div className="post-skeleton-featured-posts">
				<div className="post-skeleton-featured-category">
					<div className="post-skeleton-featured-category-1"></div>
					<div className="post-skeleton-featured-category-2"></div>
				</div>
				<div className="post-skeleton-featured-title">
					<div className="post-skeleton-featured-image"></div>
					<div className="post-skeleton-featured-sub-title"></div>
				</div>
				<div className="post-skeleton-featured-info">
					<div className="post-skeleton-featured-author"></div>
					<div className="post-skeleton-featured-date"></div>
				</div>
			</div>
		</div>
	);

	const CateoryListSkeleton = () => (
		<div className="category-list-skeleton max_width m_auto">
			<div className="scroll-container">
				<div className="category-skeleton"></div>
				<div className="category-skeleton"></div>
				<div className="category-skeleton"></div>
				<div className="category-skeleton"></div>
				<div className="category-skeleton"></div>
				<div className="category-skeleton"></div>
				<div className="category-skeleton"></div>
				<div className="category-skeleton"></div>
				<div className="category-skeleton"></div>
			</div>
		</div>
	);

	const UserDetailsSkeleton = () => (
		<div style={{ marginTop: "50px" }} className="user-details-skeleton">
			<div className="user-details-skeleton-avatar"></div>
			<div className="user-details-skeleton-name"></div>
			<div className="user-details-skeleton-email"></div>
			<div className="user-details-skeleton-post-count"></div>
		</div>
	);

	if (type === "home")
		return (
			<div className="post-skeleton-container max_width m_auto">
				<div className="post-wrapper">
					{Array(postCount).fill(<Skeleton />)}
				</div>
				<div className="featured-wrapper">
					{Array(featureCount).fill(<FeaturedSkeleton />)}
				</div>
			</div>
		);

	if (type === "category-list") return <CateoryListSkeleton />;

	if (type === "my-profile") return <UserDetailsSkeleton />;
};

export default PostSkeleton;
