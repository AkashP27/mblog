import React, { useState, useRef, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Context } from "../context/Context";
import { axiosInstance } from "../config";
// import "./index.css";
import "../styles/login.css";

const Login = () => {
	const history = useHistory();
	const userRef = useRef();
	const passwordRef = useRef();
	const { dispatch, isFetching } = useContext(Context);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(false);
		dispatch({ type: "LOGIN_START" });

		try {
			const res = await axiosInstance.post("/auth/login", {
				email: userRef.current.value,
				password: passwordRef.current.value,
			});
			// console.log(res);

			dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
			history.push("/");
		} catch (err) {
			// console.log(err.response);
			setErrorMessage(err.response.data.message);
			setError(true);
			dispatch({ type: "LOGIN_FAILURE" });
		}
	};

	return (
		<>
			<br />
			<br />

			<div className="login max_width m_auto">
				<span className="loginTitle">Login</span>
				{error && (
					<span
						style={{ alignSelf: "center", color: "red", marginTop: "10px" }}
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
						ref={userRef}
						placeholder="Enter your email"
					/>
					<input
						required
						type="password"
						className="loginInput"
						ref={passwordRef}
						placeholder="Enter your password"
					/>
					<button
						className="loginButton"
						value="Log In"
						type="submit"
						disabled={isFetching}
					>
						Login
					</button>
					{/* <br /> */}
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
						<p style={{ color: "black !important" }}>New User?</p>
						<NavLink to="/register">Register</NavLink>
					</div>
					<div className="bottom">
						<p style={{ color: "black !important" }}>Forgot password? </p>
						<NavLink to="/forgot-password">Click here</NavLink>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
