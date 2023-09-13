import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Context } from "../context/Context";
import { axiosInstance } from "../config";
import ReactQuill from "react-quill";
import jwt_decode from "jwt-decode";
import "react-quill/dist/quill.snow.css";
import "../styles/single.css";

const Single = () => {
	let history = useHistory();
	const location = useLocation();

	const path = location.pathname.split("/")[2];
	const [post, setPost] = useState("");

	const { token } = useContext(Context);

	if (token) {
		var decoded = jwt_decode(token);
		var nameOfUser = decoded.name;
	}

	// eslint-disable-next-line no-unused-vars
	const [name, setName] = useState("");
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [update, setUpdate] = useState(false);

	const modules = {
		toolbar: [
			[{ font: [] }],
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			["bold", "italic", "underline", "strike"],
			[{ color: [] }, { background: [] }],
			[{ script: "sub" }, { script: "super" }],
			["blockquote", "code-block"],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "image", "video"],
			["clean"],
		],
	};

	useEffect(() => {
		const getPost = async () => {
			const res = await axiosInstance.get("/posts/" + path);
			setPost(res.data);
			setName(res.data.name);
			setTitle(res.data.title);
			setDesc(res.data.desc);
		};
		getPost();
	}, [path]);

	const handleDelete = async () => {
		let deletepost = window.confirm("Are you sure to delete the post?");
		if (deletepost) {
			try {
				await axiosInstance.delete(`/posts/${post._id}`, {
					headers: {
						authorization: `Bearer ${token}`,
					},
				});

				// alert("Post deleted successfully");
				history.push("/");
			} catch (err) {
				alert("Could not delete the post");
			}
		}
	};

	const handleUpdate = async () => {
		console.log(desc);
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
			// alert("Your Post updated Successfully");
		} catch (err) {
			alert("Sorry! Couldn't update'");
		}
	};

	// console.log(path);

	return (
		<>
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
							{post.name === nameOfUser && (
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
						Author:<b>{post.name}</b>
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
		</>
	);
};

export default Single;
