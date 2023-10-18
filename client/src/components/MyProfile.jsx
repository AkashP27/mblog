import React, { useState, useEffect } from "react";
import Posts from "./Posts";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import { NavLink } from "react-router-dom";
// import "./index.css";
import jwt_decode from "jwt-decode";
import "../styles/myprofile.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";

const override = {
	display: "block",
	margin: "200px auto",
};

const MyProfile = () => {
	let history = useHistory();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	// const [success, setSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [posts, setPosts] = useState([]);
	const [userDetails, setUserDetails] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const token = useSelector((state) => state.authentication.token);
	const dispatch = useDispatch();

	const decoded = jwt_decode(token);

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
				// console.log(secondResponse.data.data.user);
				setUserDetails(secondResponse.data.data.user);
			} catch (err) {
				if (!myAbortController.signal.aborted) {
					console.log(err.response);
				}
			}
		};
		fetchPosts();

		return () => {
			myAbortController.abort();
		};
	}, [token]);

	const handleLogout = () => {
		dispatch(authActions.logout());
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		let updatedUser;

		if (name) {
			updatedUser = {
				name,
			};
		}

		if (email) {
			updatedUser = {
				email,
			};
		}

		if (name && email) {
			updatedUser = {
				name,
				email,
			};
		}

		// console.log(updatedUser);

		try {
			let updateacc = window.confirm("Are you sure to update the account?");
			if (updateacc) {
				await axiosInstance.put(`/user/${decoded.id}`, updatedUser, {
					headers: { authorization: `Bearer ${token}` },
				});

				// localStorage.setItem("token", JSON.stringify(res.data.token));
				alert("Account has been updated. Please Login again...!");
				history.push("/");
				handleLogout();
			}
		} catch (err) {
			setError(true);
			setErrorMessage(err.response.data.message);
			// console.log(err.response.data.message);
		}
	};

	const handleDelete = async (e) => {
		let deleteacc = window.confirm("Are you sure to delete the account?");
		deleteacc = window.confirm("Are you sure?");
		try {
			if (deleteacc) {
				await axiosInstance.delete(`/user/${decoded.id}`, {
					headers: { authorization: `Bearer ${token}` },
				});
				alert("Account has been deleted...!");
				history.push("/");
				handleLogout();
			}
		} catch (err) {
			alert("Couldn't delete your account");
		}
	};

	return (
		<>
			{/* <br />
			<br /> */}
			{posts.length > 0 && (
				<div className="post_heading max_width m_auto">
					<h1 style={{ fontFamily: "'Nunito', sans-serif" }}>My Posts</h1>
					<NavLink className="btnn" to="/write">
						Create Post
					</NavLink>
				</div>
			)}
			{loading ? (
				<ClipLoader
					color={"#489cb1"}
					// loading={loading}
					cssOverride={override}
					size={50}
					width={100}
					display="block"
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			) : (
				<>
					<Posts posts={posts} />

					<br />
					<br />
					<div className="myprofile max_width m_auto">
						<div className="myprofilewrapper">
							<div className="myprofileheading">
								<span className="myprofileupdateheading">Account Details</span>
							</div>

							{error && (
								<span
									style={{
										alignSelf: "center",
										color: "red",
										// marginTop: "10px",
									}}
								>
									<h6>{errorMessage}</h6>
								</span>
							)}

							<form
								className="myprofileform"
								method="POST"
								onSubmit={handleUpdate}
							>
								{userDetails.oAuth ? (
									<>
										<input
											required
											type="text"
											value={userDetails.name}
											placeholder="  name"
											onChange={(e) => setName(e.target.value)}
										></input>

										<input
											required
											type="email"
											value={userDetails.email}
											placeholder="email"
											onChange={(e) => setEmail(e.target.value)}
										></input>
									</>
								) : (
									<>
										<input
											required
											type="text"
											defaultValue={userDetails.name}
											placeholder="  name"
											onChange={(e) => setName(e.target.value)}
										></input>
										<input
											required
											type="email"
											defaultValue={userDetails.email}
											placeholder="email"
											onChange={(e) => setEmail(e.target.value)}
										></input>
										<button className="myprofilesubmit" type="submit">
											Update
										</button>
									</>
								)}
							</form>

							<button className="delete" onClick={handleDelete}>
								Delete Account
							</button>

							{!userDetails.oAuth && (
								<div className="bottom">
									<p style={{ color: "black !important" }}>change password?</p>
									<NavLink to="update-password">Click here</NavLink>
								</div>
							)}
						</div>
					</div>

					<br />
					<br />
				</>
			)}
		</>
	);
};

export default MyProfile;
