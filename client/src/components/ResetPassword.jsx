import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-hot-toast";
import "../styles/login.css";
import Footer from "./Footer";

const ResetPassword = () => {
	const history = useHistory();
	const { token } = useParams();
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await axiosInstance.put(`/auth/reset-password/${token}`, {
				password,
			});

			setLoading(false);
			history.push("/login");
			toast.success("Password changed successfully. Please Login again.", {
				duration: 10000,
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
			{/* <br />
			<br /> */}
			<div style={{ height: "70vh" }} className="login max_width m_auto">
				<span className="loginTitle">New password</span>
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
									type={passwordVisible ? "text" : "password"}
									onChange={(e) => setPassword(e.target.value)}
									value={password}
									placeholder="Enter new password"
								/>
								<div
									className="togglePassword"
									onClick={() => {
										setPasswordVisible(!passwordVisible);
									}}
								>
									{passwordVisible ? (
										<i class="fa fa-eye"></i>
									) : (
										<i class="fas fa-eye-slash"></i>
									)}
								</div>
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
								"Submit"
							)}
						</button>
						<br />
					</form>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default ResetPassword;
