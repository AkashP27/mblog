import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import "../styles/login.css";

const Register = () => {
	let history = useHistory();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(false);
		try {
			const res = await axiosInstance.post("/auth/register", {
				name,
				email,
				password,
			});
			res.data && history.push("/login");
		} catch (err) {
			setError(true);
		}
	};

	return (
		<>
			<br />
			<br />
			<div className="login">
				<span className="loginTitle">Register</span>
				{error && (
					<span
						style={{ alignSelf: "center", color: "red", marginTop: "10px" }}
					>
						<h6>Please enter correct details!</h6>
					</span>
				)}
				<form method="POST" className="loginForm" onSubmit={handleSubmit}>
					<input
						type="text"
						name="name"
						className="loginInput"
						placeholder="Full Name"
						// value={user.name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="text"
						name="email"
						className="loginInput"
						placeholder="Email"
						// value={user.email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						name="password"
						className="loginInput"
						placeholder="Password"
						// value={user.password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button className="loginButton" type="submit">
						Register
					</button>
					<br />
					<div className="bottom">
						<p>Already User?</p>
						<NavLink to="/login">Login</NavLink>
					</div>
				</form>
			</div>
		</>
	);
};

export default Register;
