import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosInstance } from "../config";

const ResetPassword = () => {
	const history = useHistory();
	const { token } = useParams();
	// console.log(token);

	const [submitButton, setSubmitButton] = useState(false);
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitButton(true);

		try {
			const res = await axiosInstance.put(`/auth/reset-password/${token}`, {
				password,
			});

			setSubmitButton(false);

			if (res.status === 200) {
				alert("Password changed successfully");
				history.push("/login");
			}
		} catch (err) {
			alert("Token expired");
		}
	};
	return (
		<>
			<br />
			<br />
			<div className="login max_width m_auto">
				<span className="loginTitle">Enter your new password</span>
				<form
					method="POST"
					className="loginForm"
					onSubmit={handleSubmit}
					autoComplete="off"
				>
					<input
						type="password"
						className="loginInput"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						placeholder="Enter your new password"
					/>
					<button
						className="loginButton"
						value="Log In"
						type="submit"
						disabled={submitButton}
					>
						Send
					</button>
					<br />
				</form>
			</div>
		</>
	);
};

export default ResetPassword;
