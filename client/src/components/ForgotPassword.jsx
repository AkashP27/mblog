import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { axiosInstance } from "../config";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/login.css";
import { toast } from "react-hot-toast";
import Footer from "./Footer";

const ForgotPassword = () => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await axiosInstance.post("/auth/forgot-password", {
				email,
			});

			toast.success(res.data.message, {
				duration: 15000,
			});
			setLoading(false);
			setEmail("");
		} catch (err) {
			toast.error(err.response.data.message, {
				duration: 15000,
			});
			setLoading(false);
			// setEmail("");
		}
	};
	return (
		<>
			{/* <br />
			<br /> */}
			<div style={{ height: "70vh" }} className="login max_width m_auto">
				<span className="loginTitle">Request New Password</span>
				<div style={{ padding: "10px" }}>
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
									onChange={(e) => setEmail(e.target.value)}
									value={email}
									placeholder="Email Address"
								/>
							</div>
						</div>
						<button
							className="loginButton"
							value="Log In"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<ClipLoader size={20} color={"#fff"} loading={true} />
							) : (
								"Request"
							)}
						</button>
						<NavLink to="/login">Go back to Login</NavLink>
					</form>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default ForgotPassword;
