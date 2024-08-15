import React, { useState } from "react";
import { axiosInstance } from "../config";
import ClipLoader from "react-spinners/ClipLoader";
import { useHistory, NavLink } from "react-router-dom";
import "../styles/login.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { toast } from "react-hot-toast";
import Footer from "./Footer";

const ChangePassword = () => {
	let history = useHistory();
	const [loading, setLoading] = useState(false);
	const [currentPassword, setCurrentPassword] = useState();
	const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
	const [newPassword, setNewPassword] = useState();
	const [newPasswordVisible, setNewPasswordVisible] = useState(false);
	const token = useSelector((state) => state.authentication.token);
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(authActions.logout());
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axiosInstance.put(
				"/auth/update-password",
				{
					currentPassword,
					newPassword,
				},
				{ headers: { authorization: `Bearer ${token}` } }
			);
			setLoading(false);
			history.push("/login");
			handleLogout();
			toast.success(res.data.message, {
				duration: 10000,
			});
		} catch (err) {
			toast.error(err.response.data.message, {
				duration: 15000,
			});
			setLoading(false);
			// setCurrentPassword("");
			setNewPassword("");
		}
	};
	return (
		<>
			{/* <br />
			<br /> */}
			<div style={{ height: "70vh" }} className="login max_width m_auto">
				<span className="loginTitle">Change your password</span>
				<div style={{ padding: "10px" }}>
					<form
						method="POST"
						className="loginForm"
						onSubmit={handleSubmit}
						autoComplete="off"
					>
						<div className="loginInputWrapper">
							<div className="loginInput">
								<i className="fas fa-envelope"></i>
								<input
									required
									type={currentPasswordVisible ? "text" : "password"}
									onChange={(e) => setCurrentPassword(e.target.value)}
									value={currentPassword}
									placeholder="Current password"
								/>
								<div
									className="togglePassword"
									onClick={() => {
										setCurrentPasswordVisible(!currentPasswordVisible);
									}}
								>
									{currentPasswordVisible ? (
										<i class="fa fa-eye"></i>
									) : (
										<i class="fas fa-eye-slash"></i>
									)}
								</div>
							</div>
						</div>

						<div className="loginInputWrapper">
							<div className="loginInput">
								<i className="fas fa-envelope"></i>
								<input
									required
									type={newPasswordVisible ? "text" : "password"}
									onChange={(e) => setNewPassword(e.target.value)}
									value={newPassword}
									placeholder="New password"
								/>
								<div
									className="togglePassword"
									onClick={() => {
										setNewPasswordVisible(!newPasswordVisible);
									}}
								>
									{newPasswordVisible ? (
										<i class="fa fa-eye"></i>
									) : (
										<i class="fas fa-eye-slash"></i>
									)}
								</div>
							</div>
						</div>
						<button
							className="loginButton"
							value="Log In"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<ClipLoader size={20} color={"#fff"} loading={true} />
							) : (
								"Change"
							)}
						</button>
						<NavLink to="/myprofile">Go back to MyProfile</NavLink>
						<br />
					</form>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default ChangePassword;
