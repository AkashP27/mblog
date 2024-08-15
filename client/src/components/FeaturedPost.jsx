import { Link } from "react-router-dom";
import "../styles/navbar.css";
import "../styles/categorylist.css";
import categoryColors from "../utils/categoryColors";

const FeaturedPost = ({ posts }) => {
	const getCategoryColor = (category) => {
		return categoryColors[category] || categoryColors.Default;
	};

	return (
		<div className="featured">
			<h4>Featured Posts</h4>
			{posts.map((post, index) => (
				<div className="featured_posts max_width m_auto" key={index}>
					<div className="featured_category">
						{post.category?.map((cat, index) => (
							<span
								style={{ backgroundColor: getCategoryColor(cat) }}
								key={index}
							>
								{cat}
							</span>
						))}
					</div>
					<Link to={`/posts/${post._id}`}>
						<div className="featured_title">
							<img src={post.imageURL} alt="" />
							<span>{post.title}</span>
						</div>
						<div className="featured_info">
							<span className="featured_author">{post?.uploadedBy?.name}</span>
							<span>
								{`	-	${new Date(post.createdAt).getDate()}.${
									new Date(post.createdAt).getMonth() + 1
								}.${new Date(post.createdAt).getFullYear()}`}
							</span>
						</div>
					</Link>
				</div>
			))}
		</div>
	);
};

export default FeaturedPost;
