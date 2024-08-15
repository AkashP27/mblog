import { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import jwt_decode from "jwt-decode";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../index.css";
import "../styles/write.css";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import categories from "../utils/category";
import CircularProgressBar from "./CircularProgressBar";

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

const Write = () => {
	const history = useHistory();
	const token = useSelector((state) => state.authentication.token);
	var decoded = jwt_decode(token);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [category, setCategory] = useState([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(true);
	const dropdownRef = useRef(null);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		window.scrollTo(0, 0);
		setIsDropdownOpen(false);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [dropdownRef]);

	const handleCategoryChange = (value) => {
		if (category.length >= 3) {
			toast.error("You can only select up to 3 categories", {
				duration: 5000,
			});
			return;
		}
		if (value && !category.includes(value)) {
			setCategory((prevCategory) => [...prevCategory, value]);
			setIsDropdownOpen(false);
		}
	};

	const removeCategory = (categoryToRemove) => {
		setCategory((prevCategory) =>
			prevCategory.filter((cat) => cat !== categoryToRemove)
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!file) {
			toast.error("Please select an image.");
			return;
		}

		if (category.length === 0) {
			toast.error("Please select at least one category.");
			return;
		}

		if (!title.trim()) {
			toast.error("Please enter a title.");
			return;
		}

		if (!desc.trim()) {
			toast.error("Please enter a description.");
			return;
		}

		setLoading(true);

		let data = new FormData();
		data.append("image", file);
		data.append("title", title);
		data.append("desc", desc);
		data.append("author", decoded.name);
		data.append("uploadedBy", decoded.id);
		data.append("category", JSON.stringify(category));

		try {
			const res = await axiosInstance.post("/posts/", data, {
				headers: {
					authorization: `Bearer ${token}`,
				},
				onUploadProgress: (progressEvent) => {
					let percentCompleted = Math.floor(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					// console.log(
					// 	`${progressEvent.loaded}kb of ${progressEvent.total}kb | ${percentCompleted}%`
					// );
					if (percentCompleted <= 100) setProgress(percentCompleted);
				},
			});
			setLoading(false);
			window.location.replace("/posts/" + res.data.data.post._id);
			toast.success("Post created successfully", {
				duration: 5000,
			});
		} catch (err) {
			setLoading(false);
			history.push("/");
			toast.error(`Sorry! Post was not created. ${err.response.data.message}`, {
				duration: 15000,
			});
		}
	};

	return (
		<>
			{loading ? (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
					}}
				>
					<CircularProgressBar
						progress={progress}
						size={150}
						strokeWidth={10}
					/>
				</div>
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
								name={file}
								style={{ display: "none" }}
								onChange={(e) => setFile(e.target.files[0])}
							/>

							<div className="ip_container">
								<div
									className={`ip_select-box ${
										isDropdownOpen ? "focus-within" : ""
									}`}
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									ref={dropdownRef}
								>
									<div className="select-wrapper">
										<span className="selected-category">Select category</span>
										<i className="fa fa-angle-down dropdown-icon"></i>
									</div>
									{isDropdownOpen && (
										<ul
											className={`dropdown-option ${
												isDropdownOpen ? "focus-within" : ""
											}`}
										>
											{categories
												.filter((cat) => cat.value !== "")
												.map((cat) => (
													<li
														key={cat.value}
														className="dropdown-item"
														onClick={() => handleCategoryChange(cat.value)}
													>
														{cat.label}
													</li>
												))}
										</ul>
									)}
								</div>
								<div className="category-container">
									{category.map((cat, i) => (
										<div key={i} className="category-item">
											{cat}
											<i
												className="fas fa-times"
												onClick={() => removeCategory(cat)}
											></i>
										</div>
									))}
								</div>
							</div>
							<div className="writeInput">
								<input
									required
									type="text"
									placeholder="Title"
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
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
