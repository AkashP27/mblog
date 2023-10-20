import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
	const history = useHistory();
	const { token } = useParams();
	const [submitButton, setSubmitButton] = useState(false);
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitButton(true);

		try {
			await axiosInstance.put(`/auth/reset-password/${token}`, {
				password,
			});

			setSubmitButton(false);
			history.push("/login");
			toast.success("Password changed successfully. Please Login again.", {
				duration: 10000,
			});
		} catch (err) {
			toast.error(err.response.data.message, {
				duration: 15000,
			});
			setSubmitButton(false);
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
						required
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
