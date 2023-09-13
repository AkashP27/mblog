import { useState, useContext } from "react";
import { Context } from "../context/Context";
import { axiosInstance } from "../config";
import ReactQuill from "react-quill";
import jwt_decode from "jwt-decode";
import "react-quill/dist/quill.snow.css";
import "../index.css";
import "../styles/write.css";

const Write = () => {
	const [file, setFile] = useState(null);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const { token } = useContext(Context);
	var decoded = jwt_decode(token);

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		let data = new FormData();
		data.append("image", file);
		data.append("title", title);
		data.append("desc", desc);
		data.append("name", decoded.name);

		try {
			const res = await axiosInstance.post("/posts/", data);
			// alert("Post created successfully");
			window.location.replace("/post/" + res.data._id);
		} catch (err) {
			alert("Sorry! Post was not created");
		}
	};
	//  console.log(res);

	return (
		<>
			<div className="write max_width m_auto">
				{file && (
					<img className="writeImg" src={URL.createObjectURL(file)} alt="" />
				)}

				<form
					className="writeForm"
					onSubmit={handleSubmit}
					enctype="multipart/form-data"
				>
					<div className="postimg">
						<label htmlFor="fileInput">
							<i className="writeIcon fas fa-plus"></i>
						</label>
						<h5>Add Image</h5>
						<button className="writeSubmit" type="submit">
							Publish
						</button>
					</div>
					<div className="writeFormGroup">
						<input
							type="file"
							id="fileInput"
							style={{ display: "none" }}
							onChange={(e) => setFile(e.target.files[0])}
						></input>
						<input
							type="text"
							placeholder="Title"
							className="writeInput "
							autoFocus={true}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<ReactQuill
							placeholder="Tell your story"
							theme="snow"
							modules={modules}
							value={desc}
							onChange={(newValue) => setDesc(newValue)}
						/>
					</div>
				</form>
			</div>
		</>
	);
};

export default Write;
