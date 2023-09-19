import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosInstance } from "../config";

const ResetPassword = () => {
	const history = useHistory();
	const { token } = useParams();
	const [submitButton, setSubmitButton] = useState(false);
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitButton(true);

		try {
			await axiosInstance.put(`/auth/reset-password/${token}`, {
				password,
			});

			setSubmitButton(false);

			alert("Password changed successfully. Please Login again.");
			history.push("/login");
		} catch (err) {
			// console.log(err.response);
			setErrorMessage(err.response.data.message);
			setSubmitButton(false);
		}
	};
	return (
		<>
			<br />
			<br />
			<div className="login max_width m_auto">
				<span className="loginTitle">Enter your new password</span>
				{errorMessage && (
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
