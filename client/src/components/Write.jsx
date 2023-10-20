import { useState } from "react";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import jwt_decode from "jwt-decode";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../index.css";
import "../styles/write.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

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

const Write = () => {
	const history = useHistory();
	const token = useSelector((state) => state.authentication.token);
	var decoded = jwt_decode(token);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		let data = new FormData();
		data.append("image", file);
		data.append("title", title);
		data.append("desc", desc);
		data.append("uploadedBy", decoded.id);

		try {
			const res = await axiosInstance.post("/posts/", data, {
				headers: { authorization: `Bearer ${token}` },
			});
			setLoading(false);
			window.location.replace("/post/" + res.data.data.post._id);
			toast.success("Post created successfully", {
				duration: 5000,
			});
		} catch (err) {
			history.push("/");
			toast.error(`Sorry! Post was not created. ${err.response.data.message}`, {
				duration: 15000,
			});
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
				<div className="write max_width m_auto">
					{file && (
						<img
							className="writeImg"
							src={URL.createObjectURL(file)}
							alt="OK"
						/>
					)}

					<form
						className="writeForm"
						onSubmit={handleSubmit}
						encType="multipart/form-data"
					>
						<div className="postimg">
							<label htmlFor="fileInput">
								<i className="writeIcon fas fa-plus"></i>
							</label>
							<h5>Add Image</h5>
							<button className="writeSubmit" value="Submit" type="submit">
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
			)}
		</>
	);
};

export default Write;
