import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import "../styles/login.css";
import Google from "../images/google.png";
import Github from "../images/github.png";
import Linkedin from "../images/linkedin.png";

const Register = () => {
	const history = useHistory();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [submitButton, setSubmitButton] = useState(false);

	const [error, setError] = useState(false);
	const [passwordError, passwordSetError] = useState(false);
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
		// return `${rootUrl}?${queryString.toString()}`;
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

	const getLinkedInAuthUrl = () => {
		const rootUrl = `https://www.linkedin.com/oauth/v2/authorization`;

		const options = {
			redirect_uri: process.env.REACT_APP_LINKEDIN_OAUTH_REDIRECT_URL,
			client_id: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
			response_type: "code",
			scope: "email profile openid",
		};

		const queryString = new URLSearchParams(options);
		console.log(`${rootUrl}?${queryString.toString()}`);
		window.location.replace(`${rootUrl}?${queryString.toString()}`);

		// return `${rootUrl}?${queryString.toString()}`;
	};

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

					<div className="wrapper">
						<div className="leftside">
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
							<div className="left-bottom">
								<p>Already User?</p>
								<NavLink to="/login">Login</NavLink>
							</div>
						</div>

						<div className="center">
							<div className="or">OR</div>
						</div>

						<div class="rightside">
							<div
								className="oauthloginButton google"
								onClick={getGoogleAuthUrl}
							>
								<img src={Google} alt="" className="icon" />
								Signup with Google
							</div>
							<div
								className="oauthloginButton github"
								onClick={getGithubAuthUrl}
							>
								<img src={Github} alt="" className="icon" />
								Signup with Github
							</div>
							<div
								className="oauthloginButton linkedin"
								onClick={getLinkedInAuthUrl}
							>
								<img src={Linkedin} alt="" className="icon" />
								Signup with LinkedIn
							</div>
						</div>
					</div>
				</div>
			</>
		</>
	);
};

export default Register;
