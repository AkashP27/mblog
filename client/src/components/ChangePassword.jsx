import React, { useState } from "react";
import { axiosInstance } from "../config";
import { useHistory } from "react-router-dom";
import "../styles/login.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
	let history = useHistory();
	const [submitButton, setSubmitButton] = useState(false);
	const [currentPassword, setCurrentPassword] = useState();
	const [newPassword, setNewPassword] = useState();
	const token = useSelector((state) => state.authentication.token);
	const dispatch = useDispatch();

	const handleLogout = () => {
		dispatch(authActions.logout());
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitButton(true);
		try {
			const res = await axiosInstance.put(
				"/auth/update-password",
				{
					currentPassword,
					newPassword,
				},
				{ headers: { authorization: `Bearer ${token}` } }
			);
			history.push("/login");
			handleLogout();
			toast.success(res.data.message, {
				duration: 10000,
			});
		} catch (err) {
			toast.error(err.response.data.message, {
				duration: 15000,
			});
			setSubmitButton(false);
			// setCurrentPassword("");
			setNewPassword("");
		}
	};
	return (
		<>
			<br />
			<br />
			<div className="login max_width m_auto">
				<span className="loginTitle">Change your password</span>
				<form
					method="POST"
					className="loginForm"
					onSubmit={handleSubmit}
					autoComplete="off"
				>
					<input
						required
						type="password"
						className="loginInput"
						onChange={(e) => setCurrentPassword(e.target.value)}
						value={currentPassword}
						placeholder="Enter your current password"
					/>
					<input
						required
						type="password"
						className="loginInput"
						onChange={(e) => setNewPassword(e.target.value)}
						value={newPassword}
						placeholder="Enter your new password"
					/>
					<button
						className="loginButton"
						value="Log In"
						type="submit"
						disabled={submitButton}
					>
						Change
					</button>
					<br />
				</form>
			</div>
		</>
	);
};

export default ChangePassword;
