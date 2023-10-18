// import "./index.css";
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { axiosInstance } from "../config";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import jwt_decode from "jwt-decode";
// import axios from "axios";
import "../styles/single.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from "react-redux";

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
		// ["link", "image", "video"],
		["clean"],
	],
};

const Single = () => {
	let history = useHistory();
	const location = useLocation();
	const path = location.pathname.split("/")[2];
	const [post, setPost] = useState("");
	const [loading, setLoading] = useState(false);

	const token = useSelector((state) => state.authentication.token);

	if (token) {
		var decoded = jwt_decode(token);
		var nameOfUser = decoded.name;
	}

	// eslint-disable-next-line no-unused-vars
	const [name, setName] = useState("");
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [update, setUpdate] = useState(false);

	useEffect(() => {
		setLoading(true);
		const getPost = async () => {
			const res = await axiosInstance.get("/posts/" + path);
			setPost(res.data.data.post);
			setName(res.data.data.post.uploadedBy?.name);
			setTitle(res.data.data.post.title);
			setDesc(res.data.data.post.desc);
			setLoading(false);
		};
		getPost();
	}, [path]);

	// if (update) {
	// 	console.log(desc);
	// }

	const handleDelete = async () => {
		let deletepost = window.confirm("Are you sure to delete the post?");
		if (deletepost) {
			setLoading(true);

			try {
				await axiosInstance.delete(`/posts/${post._id}`, {
					headers: {
						authorization: `Bearer ${token}`,
					},
				});
				setLoading(false);

				// alert("Post deleted successfully");
				history.push("/");
			} catch (err) {
				alert("Could not delete the post");
			}
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

			// alert("Your Post updated Successfully");
		} catch (err) {
			alert("Sorry! Couldn't update");
		}
	};

	return (
		<>
			{loading ? (
				<ClipLoader
					color={"#36d7b7"}
					// loading={loading}
					cssOverride={override}
					size={50}
					width={100}
					display="block"
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			) : (
				<div className="single max_width m_auto">
					<div className="singlePostWrapper">
						<hr className=" max_width m_auto" />
						{post.imageURL && (
							<img
								className="singlePostImg max_width m_auto"
								src={post.imageURL}
								alt="singlepage"
							/>
						)}

						<hr className=" max_width m_auto" />
						{update ? (
							<input
								type="text"
								value={title}
								className="singlePostTitleInput"
								onChange={(e) => setTitle(e.target.value)}
								autoFocus
							/>
						) : (
							<h1 className="singlePostTitle ">
								{title}
								{post.uploadedBy?.name === nameOfUser && (
									<div className="singlePostEdit">
										<i
											className="singlePostIcon fas fa-edit"
											onClick={() => setUpdate(true)}
										></i>
										<i
											className="singlePostIcon fas fa-trash-alt"
											onClick={handleDelete}
										></i>
									</div>
								)}
							</h1>
						)}
					</div>

					<div className="singlePostInfo">
						<span className="singlePostAuthor">
							Author:<b>{post.uploadedBy?.name}</b>
						</span>
						<span className="singlePostDate">
							{new Date(post.createdAt).toDateString()}
						</span>
					</div>

					{update ? (
						<ReactQuill
							// className="singlePostDesc"
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
			)}
		</>
	);
};

export default Single;
