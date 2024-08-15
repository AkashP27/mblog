import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { axiosInstance } from "../config";
import Posts from "./Posts";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import jwt_decode from "jwt-decode";
import "../styles/single.css";
import "../styles/posts.css";
import ClipLoader from "react-spinners/ClipLoader";
import HashLoader from "react-spinners/HashLoader";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import PostModal from "../Modal/PostModal";
import FeaturedPost from "./FeaturedPost";
import categoryColors from "../utils/categoryColors";
import Avatar from "react-avatar";
import CategoryList from "./CategoryList";
import Footer from "./Footer";

const override = {
	display: "block",
	margin: "200px auto",
};

const modules = {
	toolbar: [
		[{ font: [] }],
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		["bold", "italic", "underline", "strike"],
		[{ color: [] }, { background: [] }],
		[{ script: "sub" }, { script: "super" }],
		["blockquote", "code-block"],
		[{ list: "ordered" }, { list: "bullet" }],
		["clean"],
	],
};

const Single = () => {
	const [loaded, setLoaded] = useState(false);

	let history = useHistory();
	const location = useLocation();
	const path = location.pathname.split("/")[2];
	const [name, setName] = useState("");
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState(``);
	const [update, setUpdate] = useState(false);
	const [post, setPost] = useState("");
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [recommendedPosts, setRecommendedPosts] = useState([]);
	const [loadingRecommendedPosts, setLoadingRecommendedPosts] = useState(false);
	const [readingTime, setReadingTime] = useState(0);
	const token = useSelector((state) => state.authentication.token);
	const { posts: featuredPosts } = useSelector((state) => state.featuredPosts);

	if (token) {
		var decoded = jwt_decode(token);
		var nameOfUser = decoded.name;
	}

	const date = new Date(post.createdAt);
	const formattedDate = `${date.getDate()}.${
		date.getMonth() + 1
	}.${date.getFullYear()}`;

	useEffect(() => {
		const myAbortController = new AbortController();
		if (post) {
			setLoadingRecommendedPosts(true);
			const fetchRecommendedPosts = async (authorId, currentPostId) => {
				try {
					const res = await axiosInstance.get(`/posts/author/${authorId}`, {
						signal: myAbortController.signal,
					});
					let recommended = res.data.data.posts;
					// Filter out the current post from recommended posts
					recommended = recommended.filter(
						(post) => post._id !== currentPostId
					);

					if (recommended.length === 0) {
						// If there's only one post, randomly select two more posts excluding the current one
						const randomPostsRes = await axiosInstance.get(
							`/posts/random?exclude=${currentPostId}`,
							{
								signal: myAbortController.signal,
							}
						);
						// recommended = recommended.concat(
						// 	randomPostsRes.data.data.posts.slice(0, 2)
						// );
						recommended = randomPostsRes.data.data.posts;
					}
					setLoadingRecommendedPosts(false);
					setRecommendedPosts(recommended);
				} catch (error) {
					setLoadingRecommendedPosts(false);
					console.error("Error fetching recommended posts:", error);
				}
			};
			fetchRecommendedPosts(post.uploadedBy._id, post._id);
		}
		return () => {
			myAbortController.abort();
		};
	}, [post]);

	useEffect(() => {
		const myAbortController = new AbortController();
		setLoading(true);
		const fetchPosts = async () => {
			try {
				const res = await axiosInstance.get("/posts/" + path, {
					signal: myAbortController.signal,
				});
				setPost(res.data.data.post);
				setName(res.data.data.post.uploadedBy?.name);
				setTitle(res.data.data.post.title);
				setDesc(res.data.data.post.desc);
				calculateReadingTime(res.data.data.post.desc);
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.error("Error fetching post:", error);
			}
		};
		fetchPosts();

		return () => {
			myAbortController.abort();
		};
	}, [path]);

	// if (update) {
	// 	console.log(desc);
	// }

	const getCategoryColor = (category) => {
		return categoryColors[category] || categoryColors.Default;
	};

	const calculateReadingTime = (content) => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		const minutes = Math.ceil(wordCount / wordsPerMinute);
		setReadingTime(minutes);
	};

	const handleDelete = async () => {
		setLoading(true);
		try {
			await axiosInstance.delete(`/posts/${post._id}`, {
				headers: {
					authorization: `Bearer ${token}`,
				},
			});
			setLoading(false);
			history.push("/");
			toast.success("Post deleted successfully", {
				duration: 5000,
			});
		} catch (err) {
			setLoading(false);
			toast.error("Could not delete the post", {
				duration: 10000,
			});
		}
	};

	const handleUpdate = async () => {
		setLoading(true);
		try {
			await axiosInstance.put(
				`/posts/${post._id}`,
				{
					title,
					desc,
				},
				{
					headers: {
						authorization: `Bearer ${token}`,
					},
				}
			);
			// window.location.reload();
			setUpdate(false);
			setLoading(false);
			toast.success("Post updated..!", {
				duration: 5000,
			});
		} catch (err) {
			setLoading(false);
			toast.error("Sorry! Couldn't update the post", {
				duration: 10000,
			});
		}
	};

	const handleAuthorClick = (authorId) => {
		history.push(`/posts/author/${authorId}`);
	};

	return (
		<>
			{showModal && (
				<PostModal closeModal={setShowModal} setDeletePost={handleDelete} />
			)}
			{loading ? (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
					}}
				>
					<HashLoader
						color={"#36d7b7"}
						cssOverride={override}
						size={50}
						width={100}
						display="block"
						aria-label="Loading Spinner"
						data-testid="loader"
					/>
				</div>
			) : (
				<>
					<CategoryList />
					<div className="single max_width m_auto">
						<div className="singlePostWrapper">
							{post.imageURL && (
								<img
									className={`singlePostImg max_width m_auto ${
										loaded ? "loaded" : "loading"
									}`}
									src={post.imageURL}
									alt="singlepage"
									onLoad={() => setLoaded(true)}
								/>
							)}
							{update ? (
								<input
									type="text"
									value={title}
									className="singlePostTitleInput"
									onChange={(e) => setTitle(e.target.value)}
									autoFocus
								/>
							) : (
								<>
									<h1 className="singlePostTitle ">{title}</h1>
									{post.uploadedBy?.name === nameOfUser && (
										<div className="singlePostEdit">
											<i
												className="singlePostIcon fas fa-edit"
												onClick={() => setUpdate(true)}
											></i>
											<i
												className="singlePostIcon fas fa-trash-alt"
												onClick={() => {
													setShowModal(true);
												}}
											></i>
										</div>
									)}
								</>
							)}

							<div className="singlePostInfo">
								<span
									className="singlePostAuthor"
									onClick={() => handleAuthorClick(post.uploadedBy._id)}
								>
									<Avatar
										name={post.uploadedBy?.name}
										src={
											post.uploadedBy?.avatarURL
												? post.uploadedBy?.avatarURL
												: ""
										}
										size={34}
										round={true}
										maxInitials={3}
										className="myprofile_img"
									/>
									<p className="singlePostAuthorName">
										{post.uploadedBy?.name}
									</p>
								</span>
								<span>
									<span>{formattedDate}</span>
									<span style={{ padding: "0px 10px" }}>|</span>
									<span className="singlePostReadingTime">
										<i class="fas fa-book-open"></i> {readingTime} mins read
									</span>
								</span>
							</div>
							<div className="single-categories">
								{post.category?.map((cat, index) => (
									<span
										key={index}
										className="single-category"
										style={{ backgroundColor: getCategoryColor(cat) }}
									>
										{cat}
									</span>
								))}
							</div>

							{update ? (
								<ReactQuill
									placeholder="Tell your story"
									theme="snow"
									modules={modules}
									value={desc}
									onChange={(newValue) => setDesc(newValue)}
								/>
							) : (
								<div
									className="singlePostDesc"
									dangerouslySetInnerHTML={{ __html: desc }}
								/>
							)}
							{update && (
								<button className="singlePostButton" onClick={handleUpdate}>
									Update
								</button>
							)}
						</div>
						<FeaturedPost posts={featuredPosts} />
					</div>
					{loadingRecommendedPosts ? (
						<ClipLoader color={"#36d7b7"} cssOverride={override} size={50} />
					) : (
						<div className="single-right">
							<h1>Other Blogs</h1>
							<Posts posts={recommendedPosts} />
						</div>
					)}
					<Footer />
				</>
			)}
		</>
	);
};

export default Single;
