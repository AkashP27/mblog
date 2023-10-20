import React, { useState } from "react";
import { axiosInstance } from "../config";
import "../styles/login.css";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
	const [submitButton, setSubmitButton] = useState(false);
	const [email, setEmail] = useState();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitButton(true);
		try {
			const res = await axiosInstance.post("/auth/forgot-password", {
				email,
			});

			toast.success(res.data.message, {
				duration: 15000,
			});
			setSubmitButton(false);
			setEmail("");
		} catch (err) {
			toast.error(err.response.data.message, {
				duration: 15000,
			});
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
