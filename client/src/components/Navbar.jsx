/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../context/Context";
import "../styles/navbar.css";
import "../help.css";

const Navbar = () => {
	const { token, dispatch } = useContext(Context);
	const [showLinks, setShowLinks] = useState(false);

	const handleLogout = () => {
		dispatch({ type: "LOGOUT" });
	};

	return (
		<>
			<nav className="main_nav max_width m_auto">
				<div className="logo">
					<h2>
						<NavLink to="/">
							<span>MBlog</span>
						</NavLink>
					</h2>
				</div>
				<a
					href="#"
					className="toggle_button"
					onClick={() => setShowLinks(!showLinks)}
				>
					<span className="bar"></span>
					<span className="bar"></span>
					<span className="bar"></span>
				</a>

				{/* <div className="left" id={showLinks ? " hidden" : ""}> */}
				<div className={showLinks ? " mobile " : "left"}>
					<ul>
						<li>
							<NavLink to="/">Home</NavLink>
						</li>
						<li className="leftLi">
							{token && (
								<NavLink to="/myprofile" className="link">
									MyProfile
								</NavLink>
							)}
						</li>
					</ul>
					<li>
						<NavLink className=" btnnnn" to="/write">
							Create Post
						</NavLink>
					</li>
				</div>
				<div className="right">
					<li onClick={handleLogout}>
						{token ? (
							<NavLink className="rightt" to="/" style={{ color: "#fa7575" }}>
								Logout
							</NavLink>
						) : (
							<NavLink className="rightt" to="/login">
								Login
							</NavLink>
						)}
					</li>
				</div>
			</nav>
			<hr className="max_width m_auto" />
		</>
	);
};

export default Navbar;
