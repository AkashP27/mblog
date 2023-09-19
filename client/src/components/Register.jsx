import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import "../styles/login.css";

const Register = () => {
	const history = useHistory();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitButton, setSubmitButton] = useState(false);
	const [error, setError] = useState(false);
	const [passwordError, passwordSetError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitButton(true);
		setError(false);

		try {
			const res = await axiosInstance.post("/auth/register", {
				name,
				email,
				password,
			});

			// console.log(res);
			setSubmitButton(false);

			res.data && history.push("/login");
		} catch (err) {
			setErrorMessage(err.response.data.message);
			// console.log(err.response.data.message);
			setSubmitButton(false);
			setError(true);
		}
	};

	const handlePassword = (e) => {
		e.preventDefault();
		let password = e.target.value;
		if (password.length < 6) {
			passwordSetError(true);
			return;
		}
		passwordSetError(false);
		setPassword(password);
	};

	return (
		<>
			<>
				<br />
				<br />
				<div className="login max_width m_auto">
					<span className="loginTitle">Register</span>
					{error && (
						<span
							style={{ alignSelf: "center", color: "red", marginTop: "10px" }}
						>
							<h6>{errorMessage}</h6>
						</span>
					)}

					<form method="POST" className="loginForm" onSubmit={handleSubmit}>
						<input
							required
							type="text"
							name="name"
							className="loginInput"
							placeholder="Full Name"
							// value={user.name}
							onChange={(e) => setName(e.target.value)}
						/>
						<input
							required
							type="email"
							name="email"
							className="loginInput"
							placeholder="Email"
							// value={user.email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<input
							required
							type="password"
							name="password"
							className="loginInput"
							placeholder="Password"
							// value={user.password}
							onChange={handlePassword}
						/>
						{passwordError && (
							<span
								style={{
									alignSelf: "center",
									color: "red",
									marginTop: "10px",
								}}
							>
								<h6>Password must be at least 6 characters</h6>
							</span>
						)}

						<button
							className="loginButton"
							type="submit"
							disabled={submitButton}
						>
							Register
						</button>
					</form>

					<div class="bottom-pannel">
						<span
							style={{
								fontFamily: "'Nunito', sans-serif",
							}}
						>
							or
						</span>
						<div className="bottom">
							<p>Already User?</p>
							<NavLink to="/login">Login</NavLink>
						</div>
					</div>
				</div>
			</>
		</>
	);
};

export default Register;
