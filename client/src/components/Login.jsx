import React, { useRef, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/login.css";
import Google from "../images/google.png";
import Github from "../images/github.png";
import Linkedin from "../images/linkedin.png";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { toast } from "react-hot-toast";
import Footer from "./Footer";

const Login = () => {
	const history = useHistory();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const isFetching = useSelector((state) => state.authentication.isFetching);
	const dispatch = useDispatch();

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
		dispatch(authActions.loginStart());
		// setLoading(true);

		try {
			const res = await axiosInstance.post("/auth/login", {
				// email: userRef.current.value,
				// password: passwordRef.current.value,
				email,
				password,
			});
			// console.log(res);
			// setLoading(false);
			dispatch(authActions.loginSuccess(res.data.data));
			history.push("/");
			localStorage.setItem("activeLink", "/");
			toast.success(`Welcome ${res.data.data.user.name}`, {
				duration: 10000,
			});
		} catch (err) {
			// setLoading(false);
			toast.error(err.response.data.message, {
				duration: 10000,
			});
			dispatch(authActions.loginFailure());
		}
	};

	return (
		<>
			<br />
			<br />
			<div className="login max_width m_auto">
				<span className="loginTitle">Welcome Back</span>
				<div className="wrapper">
					<div className="leftside">
						<form
							method="POST"
							className="loginForm"
							onSubmit={handleSubmit}
							autoComplete="off"
						>
							<div className="loginInputWrapper">
								<div className="loginInput">
									<i className="fas fa-envelope"></i>
									<input
										required
										type="email"
										placeholder="Email"
										onChange={(e) => setEmail(e.target.value)}
										value={email}
									/>
								</div>
							</div>
							<div className="loginInputWrapper">
								<div className="loginInput">
									<i className="fas fa-unlock-alt"></i>
									<input
										required
										type={passwordVisible ? "text" : "password"}
										placeholder="Password"
										onChange={(e) => setPassword(e.target.value)}
										value={password}
									/>
									<div
										className="togglePassword"
										onClick={() => {
											setPasswordVisible(!passwordVisible);
										}}
									>
										{passwordVisible ? (
											<i className="fa fa-eye"></i>
										) : (
											<i className="fas fa-eye-slash"></i>
										)}
									</div>
								</div>
							</div>
							<button
								className="loginButton"
								type="submit"
								disabled={isFetching}
							>
								{isFetching ? (
									<ClipLoader size={15} color={"#fff"} loading={true} />
								) : (
									"Login"
								)}
							</button>
						</form>

						<div className="left-bottom">
							<p>New User?</p>
							<NavLink to="/register">Register</NavLink>
						</div>
						<div className="left-bottom">
							<p>Forgot password? </p>
							<NavLink to="/forgot-password">Click here</NavLink>
						</div>
					</div>

					<div className="center">
						<div className="or">OR</div>
					</div>

					<div className="rightside">
						<div className="oauthloginButton google" onClick={getGoogleAuthUrl}>
							<img src={Google} alt="" className="icon" />
							Signin with Google
						</div>
						<div className="oauthloginButton github" onClick={getGithubAuthUrl}>
							<img src={Github} alt="" className="icon" />
							Signin with Github
						</div>
						<div
							className="oauthloginButton linkedin"
							onClick={getLinkedInAuthUrl}
						>
							<img src={Linkedin} alt="" className="icon" />
							Signin with LinkedIn
						</div>
					</div>
				</div>
			</div>
			<br />
			<br />
			<Footer />
		</>
	);
};

export default Login;
