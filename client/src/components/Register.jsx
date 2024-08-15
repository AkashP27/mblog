import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/login.css";
import Google from "../images/google.png";
import Github from "../images/github.png";
import Linkedin from "../images/linkedin.png";
import { toast } from "react-hot-toast";
import Footer from "./Footer";

const Register = () => {
	const history = useHistory();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	const [didEdit, setDidEdit] = useState({
		email: false,
		password: false,
	});

	const [errors, setErrors] = useState({
		email: "",
		password: "",
	});

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return "Please enter a valid email address.";
		}
		return "";
	};

	const validatePassword = (password) => {
		if (password.length < 6) {
			return "Password must be at least 6 characters.";
		}
		return "";
	};

	const handleEmailChange = (e) => {
		const newEmail = e.target.value;
		setEmail(newEmail);
		setDidEdit((prevEdit) => ({
			...prevEdit,
			email: false,
		}));
		setErrors((prevErrors) => ({
			...prevErrors,
			email: validateEmail(newEmail),
		}));
	};

	const handlePasswordChange = (e) => {
		const newPassword = e.target.value;
		setPassword(newPassword);
		setDidEdit((prevEdit) => ({
			...prevEdit,
			password: false,
		}));
		setErrors((prevErrors) => ({
			...prevErrors,
			password: validatePassword(newPassword),
		}));
	};

	const handleInputBlur = (identifier) => {
		setDidEdit((prevEdit) => ({
			...prevEdit,
			[identifier]: true,
		}));
	};

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
		setLoading(true);

		try {
			const res = await axiosInstance.post("/auth/register", {
				name,
				email,
				password,
			});

			// console.log(res);
			setLoading(false);
			res.data && history.push("/login");
			toast.success("Registered. Please Login..!", {
				duration: 5000,
			});
		} catch (err) {
			toast.error(err.response.data.message, {
				duration: 15000,
			});
			setLoading(false);
		}
	};

	return (
		<>
			<br />
			<br />
			<div className="login max_width m_auto">
				<span className="loginTitle">Join Us</span>
				<div className="wrapper">
					<div className="leftside">
						<form method="POST" className="loginForm" onSubmit={handleSubmit}>
							<div className="loginInputWrapper">
								<div className="loginInput">
									<i className="fas fa-user"></i>
									<input
										required
										type="text"
										name="name"
										placeholder="Name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className={didEdit.name && errors.name ? "error" : ""}
									/>
								</div>
								{didEdit.name && errors.name && (
									<span className="error">{errors.name}</span>
								)}
							</div>

							<div className="loginInputWrapper">
								<div className="loginInput">
									<i className="fas fa-envelope"></i>
									<input
										required
										type="email"
										name="email"
										placeholder="Email"
										onBlur={() => handleInputBlur("email")}
										value={email}
										onChange={handleEmailChange}
										className={didEdit.email && errors.email ? "error" : ""}
									/>
								</div>
								{didEdit.email && errors.email && (
									<span className="error">{errors.email}</span>
								)}
							</div>

							<div className="loginInputWrapper">
								<div className="loginInput">
									<i className="fas fa-unlock-alt"></i>
									<input
										required
										type={passwordVisible ? "text" : "password"}
										name="password"
										placeholder="Password"
										value={password}
										onBlur={() => handleInputBlur("password")}
										onChange={handlePasswordChange}
										className={
											didEdit.password && errors.password ? "error" : ""
										}
									/>
									<span
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
									</span>
								</div>
								{didEdit.password && errors.password && (
									<span className="error">{errors.password}</span>
								)}
							</div>

							<button
								className="loginButton"
								type="submit"
								disabled={
									loading || errors.name || errors.email || errors.password
								}
							>
								{loading ? (
									<ClipLoader size={20} color={"#fff"} loading={true} />
								) : (
									"Register"
								)}
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

					<div className="rightside">
						<div className="oauthloginButton google" onClick={getGoogleAuthUrl}>
							<img src={Google} alt="" className="icon" />
							Signup with Google
						</div>
						<div className="oauthloginButton github" onClick={getGithubAuthUrl}>
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
			<Footer />
		</>
	);
};

export default Register;
