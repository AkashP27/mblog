import React, { useContext, useState, useEffect } from "react";
import { Context } from "../context/Context";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../config";
// import "./index.css";
import jwt_decode from "jwt-decode";
import "../styles/myprofile.css";

const MyProfile = () => {
	let history = useHistory();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// const [success, setSuccess] = useState(false);

	const { token, dispatch } = useContext(Context);
	const decoded = jwt_decode(token);

	const handleLogout = () => {
		dispatch({ type: "LOGOUT" });
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		const updatedUser = {
			name,
			email,
			password,
		};

		try {
			let updateacc = window.confirm("Are you sure to update the account?");
			if (updateacc) {
				await axiosInstance.put(`/users/${decoded.id}`, updatedUser, {
					headers: { authorization: `Bearer ${token}` },
				});

				// localStorage.setItem("token", JSON.stringify(res.data.token));
				alert("Account has been updated. Please Login again...!");
				history.push("/");
				handleLogout();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleDelete = async (e) => {
		let deleteacc = window.confirm("Are you sure to delete the account?");
		if (deleteacc) {
			await axiosInstance.delete(`/users/${decoded.id}`, {
				headers: { authorization: `Bearer ${token}` },
			});
			alert("Account has been deleted...!");
			history.push("/");
			handleLogout();
		}
	};

	return (
		<>
			<br />
			<br />
			<div className="myprofile ">
				<div className="myprofilewrapper">
					<div className="myprofileheading">
						<span className="myprofileupdateheading">
							Update/ Delete Account
						</span>
					</div>

					<form className="myprofileform">
						<input
							type="text"
							placeholder="  name"
							onChange={(e) => setName(e.target.value)}
						></input>

						<input
							type="text"
							placeholder="  email"
							onChange={(e) => setEmail(e.target.value)}
						></input>

						<input
							type="password"
							placeholder="  password"
							onChange={(e) => setPassword(e.target.value)}
						></input>
						<div className="butn"></div>
					</form>
					<button
						className="myprofilesubmit"
						type="submit"
						onClick={handleUpdate}
					>
						Update
					</button>
					<button className="myprofilesubmit" onClick={handleDelete}>
						Delete
					</button>
				</div>
			</div>
		</>
	);
};

export default MyProfile;
