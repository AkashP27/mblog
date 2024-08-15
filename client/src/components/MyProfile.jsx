import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import { NavLink } from "react-router-dom";
import LazyLoad from "./LazyLoadPosts";
import jwt_decode from "jwt-decode";
import "../styles/myprofile.css";
import "../styles/login.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { toast } from "react-hot-toast";
import UpdateUserModal from "../Modal/UpdateUserModal";
import DeleteUserModal from "../Modal/DeleteUserModal";
import Avatar from "react-avatar";
import PostSkeleton from "./PostSkeleton";
import Footer from "./Footer";

const MyProfile = () => {
	let history = useHistory();
	const [avatar, setAvatar] = useState(null);
	const [avatarPreview, setAvatarPreview] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [posts, setPosts] = useState([]);
	const [userDetails, setUserDetails] = useState([]);
	const [loading, setLoading] = useState(false);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [activeTab, setActiveTab] = useState("details");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const token = useSelector((state) => state.authentication.token);
	const decoded = jwt_decode(token);
	const dispatch = useDispatch();
	const profileInputRef = useRef(null);
	const [activeItem, setActiveItem] = useState("details");

	const handleItemClick = (item) => {
		setActiveItem(item);
	};

	useEffect(() => {
		if (sidebarOpen) {
			document.body.style.overflowY = "hidden";
			document.body.addEventListener("click", handleBodyClick);
		} else {
			document.body.style.overflowY = "scroll";
			document.body.removeEventListener("click", handleBodyClick);
		}

		return () => {
			document.body.removeEventListener("click", handleBodyClick);
		};
	}, [sidebarOpen]);

	useEffect(() => {
		const myAbortController = new AbortController();
		setLoading(true);
		const fetchPosts = async () => {
			try {
				const [firstResponse, secondResponse] = await Promise.all(
					[
						axiosInstance.get(`/user/${decoded.id}/posts`, {
							headers: { authorization: `Bearer ${token}` },
						}),
						axiosInstance.get(`/user/${decoded.id}`, {
							headers: { authorization: `Bearer ${token}` },
						}),
					],
					{
						signal: myAbortController.signal,
					}
				);
				setLoading(false);
				setPosts(firstResponse.data.data.posts);
				setUserDetails(secondResponse.data.data.user);
			} catch (err) {
				setLoading(false);
				if (!myAbortController.signal.aborted) {
					console.log(err.response);
				}
			}
		};
		fetchPosts();

		return () => {
			myAbortController.abort();
		};
	}, [decoded.id, token]);

	const handleLogout = () => {
		dispatch(authActions.logout());
	};

	const handleUpdate = async () => {
		setUpdateLoading(true);
		let updatedUser = new FormData();
		if (name) updatedUser.append("name", name);
		if (email) updatedUser.append("email", email);
		if (avatar) updatedUser.append("avatar", avatar);

		try {
			await axiosInstance.put(`/user/${decoded.id}`, updatedUser, {
				headers: { authorization: `Bearer ${token}` },
			});
			setUpdateLoading(false);
			history.push("/");
			handleLogout();
			toast.success("Account has been updated. Please Login again...!", {
				duration: 5000,
			});
		} catch (err) {
			setUpdateLoading(false);
			toast.error(err.response.data.message, {
				duration: 5000,
			});
		}
	};

	const handleDelete = async () => {
		setLoading(true);
		try {
			await axiosInstance.delete(`/user/${decoded.id}`, {
				headers: { authorization: `Bearer ${token}` },
			});
			setLoading(false);
			history.push("/");
			handleLogout();
			toast.success("Account has been deleted...!", {
				duration: 5000,
			});
		} catch (err) {
			setLoading(false);
			toast.error("Couldn't delete your account", {
				duration: 5000,
			});
		}
	};

	const handleProfileClick = () => {
		profileInputRef.current.click();
	};

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAvatar(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const handleBodyClick = (event) => {
		if (!event.target.closest(".sidebar")) {
			setSidebarOpen(false);
		}
	};

	const renderContent = () => {
		switch (activeTab) {
			case "editProfile":
				return (
					<form
						className="myprofileform"
						method="POST"
						onSubmit={(e) => {
							e.preventDefault();
							setShowUpdateModal(true);
						}}
						encType="multipart/form-data"
					>
						<div className="myprofile_pic" onClick={handleProfileClick}>
							<input
								ref={profileInputRef}
								type="file"
								style={{ display: "none" }}
								onChange={handleAvatarChange}
							/>
							<Avatar
								name={decoded.name}
								src={
									avatarPreview ||
									(userDetails.avatarURL ? userDetails.avatarURL : "")
								}
								size={168}
								round={true}
								maxInitials={3}
								className="myprofile_img"
							/>
						</div>
						<div className="myprofileinput">
							<input
								type="text"
								defaultValue={userDetails.name}
								placeholder="name"
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="myprofileinput">
							<input
								type="email"
								defaultValue={userDetails.email}
								placeholder="email"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<button
							className="myprofilesubmit"
							type="submit"
							disabled={updateLoading}
						>
							{updateLoading ? (
								<ClipLoader size={15} color={"#fff"} loading={true} />
							) : (
								"Update"
							)}
						</button>
					</form>
				);
			case "myPosts":
				return (
					<>
						{posts?.length > 0 ? (
							<div className="myprofile_posts">
								{posts?.map((p, index) => (
									<LazyLoad post={p} key={index} />
								))}
							</div>
						) : (
							<div
								style={{
									paddingTop: "20px",
									textAlign: "center",
								}}
							>
								OOPS..! No posts uploaded yet
							</div>
						)}
					</>
				);

			case "changePassword":
				return (
					<div className="changePassword">
						<p>Change password functionality goes here.</p>
						<NavLink to="update-password">Click here</NavLink>
					</div>
				);
			case "deleteAccount":
				return (
					<div className="deleteAccount">
						<button className="delete" onClick={() => setShowDeleteModal(true)}>
							Delete Account
						</button>
					</div>
				);
			default:
				return (
					<div className="myprofileform">
						<div className="userDetails">
							<Avatar
								name={decoded.name}
								src={
									avatarPreview ||
									(userDetails.avatarURL ? userDetails.avatarURL : "")
								}
								size={168}
								round={true}
								maxInitials={3}
								className="myprofile_img"
							/>
							<p
								style={{
									fontWeight: "700",
									marginTop: "20px",
								}}
							>
								{userDetails.name}
							</p>
							<p>{userDetails.email}</p>
							<p>Posts uploaded: {posts.length}</p>
							{!userDetails.oAuth && (
								<button
									onClick={() => {
										setActiveTab("editProfile");
										handleItemClick("editProfile");
									}}
									className="edit-profile-btn"
								>
									Edit Profile
								</button>
							)}
						</div>
					</div>
				);
		}
	};

	return (
		<>
			{showUpdateModal && (
				<UpdateUserModal
					closeModal={setShowUpdateModal}
					setUpdateUser={handleUpdate}
				/>
			)}
			{showDeleteModal && (
				<DeleteUserModal
					closeModal={setShowDeleteModal}
					setDeleteUser={handleDelete}
				/>
			)}
			{loading ? (
				<PostSkeleton type={"my-profile"} />
			) : (
				<>
					<br />
					<div className="myprofile max_width m_auto">
						<div
							className="hamburger"
							onClick={() => setSidebarOpen(!sidebarOpen)}
						>
							<i
								className={sidebarOpen ? "fas fa-times" : "fas fa-arrow-right"}
							></i>
						</div>
						<div className={sidebarOpen ? "sidebar active" : "sidebar"}>
							<ul>
								<li
									onClick={() => {
										setActiveTab("details");
										handleItemClick("details");
										setSidebarOpen(false);
									}}
									className={activeItem === "details" ? "active" : ""}
								>
									Account Details
								</li>
								{!userDetails.oAuth && (
									<li
										onClick={() => {
											setActiveTab("editProfile");
											handleItemClick("editProfile");
											setSidebarOpen(false);
										}}
										className={activeItem === "editProfile" ? "active" : ""}
									>
										Edit Profile
									</li>
								)}
								<li
									onClick={() => {
										setActiveTab("myPosts");
										handleItemClick("myPosts");
										setSidebarOpen(false);
									}}
									className={activeItem === "myPosts" ? "active" : ""}
								>
									My Posts
								</li>
								<li onClick={() => setSidebarOpen(false)}>
									<NavLink to="write">Create Post</NavLink>
								</li>
								{!userDetails.oAuth && (
									<li onClick={() => setSidebarOpen(false)}>
										<NavLink to="update-password">Change Password</NavLink>
									</li>
								)}
								<li
									onClick={() => {
										setShowDeleteModal(true);
										setSidebarOpen(false);
									}}
								>
									Delete Account
								</li>
								<li onClick={handleLogout}>Logout</li>
							</ul>
						</div>
						<div className="content">{renderContent()}</div>
					</div>
				</>
			)}
			<Footer />
		</>
	);
};

export default MyProfile;
