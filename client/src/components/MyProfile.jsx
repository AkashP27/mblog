import React, { useContext, useState } from "react";
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

	const { user } = useContext(Context);
	// console.log(user);

	const handleUpdate = async (e) => {
		e.preventDefault();
		const updatedUser = {
			userId: user._id,
			name,
			email,
			password,
		};

		try {
			let updateacc = window.confirm("Are you sure to update the account?");
			if (updateacc) {
				{
					await axiosInstance.put("/users/" + user._id, updatedUser);
					alert("Account has been updated. Please Login again...!");
					history.push("/");
				}
			}
		} catch (err) {}
	};

	const handleDelete = async (e) => {
		let deleteacc = window.confirm("Are you sure to delete the account?");
		if (deleteacc) {
			{
				await axiosInstance.delete(`/users/${user._id}`, {
					data: { userId: user._id },
					name: user.name,
				});
				alert("Account has been deleted...!");
				history.push("/");
			}
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
