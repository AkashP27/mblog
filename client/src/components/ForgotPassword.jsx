import React, { useState } from "react";
import { axiosInstance } from "../config";
import "../styles/login.css";

const ForgotPassword = () => {
	const [submitButton, setSubmitButton] = useState(false);

	const [email, setEmail] = useState();
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitButton(true);
		try {
			const res = await axiosInstance.post("/auth/forgot-password", {
				email,
			});

			// console.log(res.data.message);
			setSuccessMessage(res.data.message);
			setSubmitButton(false);
			setEmail("");

			// if (res.status === 200) {
			// }
		} catch (err) {
			setErrorMessage(err.response.data.message);
			// console.log(err.response.data.message);
			setSubmitButton(false);
			// setEmail("");
		}
	};
	return (
		<>
			<br />
			<br />
			<div className="login max_width m_auto">
				<span className="loginTitle">Enter your email</span>

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
						type="email"
						className="loginInput"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						placeholder="Enter your email"
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

export default ForgotPassword;
