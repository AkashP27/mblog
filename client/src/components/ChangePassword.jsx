import React, { useState, useContext } from "react";
import { axiosInstance } from "../config";
import { useHistory } from "react-router-dom";
import { Context } from "../context/Context";
import "../styles/login.css";

const ChangePassword = () => {
	let history = useHistory();

	const [submitButton, setSubmitButton] = useState(false);
	const [currentPassword, setCurrentPassword] = useState();
	const [newPassword, setNewPassword] = useState();
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const { token, dispatch } = useContext(Context);

	const handleLogout = () => {
		dispatch({ type: "LOGOUT" });
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
			alert(res.data.message);
			history.push("/");
			handleLogout();

			// console.log(res.data.message);
			setSuccessMessage(res.data.message);
			setSubmitButton(false);
			setCurrentPassword("");
			setNewPassword("");
		} catch (err) {
			setErrorMessage(err.response.data.message);
			// console.log(err.response.data.message);
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

				{successMessage ? (
					<span
						style={{ alignSelf: "center", marginTop: "10px", color: "green" }}
					>
						<h6>{successMessage}</h6>
					</span>
				) : (
					<span
						style={{ alignSelf: "center", marginTop: "10px", color: "red" }}
					>
						<h6>{errorMessage}</h6>
					</span>
				)}

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
