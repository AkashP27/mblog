import React, { useState } from "react";
import { axiosInstance } from "../config";
import "../styles/login.css";

const ForgotPassword = () => {
	const [submitButton, setSubmitButton] = useState(false);

	const [email, setEmail] = useState();
	const [successMessage, setSuccessMessage] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitButton(true);
		try {
			const res = await axiosInstance.post("/auth/forgot-password", {
				email,
			});

			// console.log(res.data);
			setSubmitButton(false);
			if (res.status === 200) {
				setEmail("");
				setSuccessMessage(true);
			}
		} catch (err) {
			alert("Invalid email");
			setSubmitButton(false);
		}
	};
	return (
		<>
			<br />
			<br />
			<div className="login max_width m_auto">
				<span className="loginTitle">Enter your email</span>
				{successMessage && (
					<span
						style={{ alignSelf: "center", color: "green", marginTop: "10px" }}
					>
						<h6>Check your email to reset your password!</h6>
					</span>
				)}
				<form
					method="POST"
					className="loginForm"
					onSubmit={handleSubmit}
					autoComplete="off"
				>
					<input
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
