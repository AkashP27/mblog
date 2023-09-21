import React, { useState, useRef, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Context } from "../context/Context";
import { axiosInstance } from "../config";
// import "./index.css";
import "../styles/login.css";
import Google from "../images/google.png";
import Github from "../images/github.png";

const Login = () => {
	const history = useHistory();
	const userRef = useRef();
	const passwordRef = useRef();
	const { dispatch, isFetching } = useContext(Context);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const getGoogleAuthUrl = () => {
		const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

		const options = {
			redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL,
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
			access_type: "offline",
			response_type: "code",
			prompt: "consent",
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email",
			].join(" "),
		};

		// console.log(options);

		const queryString = new URLSearchParams(options);
		window.location.replace(`${rootUrl}?${queryString.toString()}`);
		// 	return `${rootUrl}?${queryString.toString()}`;
	};

	const getGithubAuthUrl = () => {
		const rootUrl = `https://github.com/login/oauth/authorize`;
		const path = "/";

		const options = {
			redirect_uri: process.env.REACT_APP_GITHUB_OAUTH_REDIRECT_URL,
			client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
			scope: "user:email",
			path,
		};

		const queryString = new URLSearchParams(options);
		window.location.replace(`${rootUrl}?${queryString.toString()}`);

		// return `${rootUrl}?${queryString.toString()}`;
	};

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

				<div className="wrapper">
					<div className="leftside">
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
						<div className="left-bottom">
							<p style={{ color: "black !important" }}>New User?</p>
							<NavLink to="/register">Register</NavLink>
						</div>
						<div className="left-bottom">
							<p style={{ color: "black !important" }}>Forgot password? </p>
							<NavLink to="/forgot-password">Click here</NavLink>
						</div>
					</div>

					<div className="center">
						<div className="or">OR</div>
					</div>

					<div class="rightside">
						<div className="oauthloginButton google" onClick={getGoogleAuthUrl}>
							<img src={Google} alt="" className="icon" />
							Signin with Google
						</div>
						<div className="oauthloginButton github" onClick={getGithubAuthUrl}>
							<img src={Github} alt="" className="icon" />
							Signin with Github
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
