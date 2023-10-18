/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";
import "../help.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";

const Navbar = () => {
	const token = useSelector((state) => state.authentication.token);
	const dispatch = useDispatch();
	const [menuOpen, setMenuOpen] = useState(false);
	let menuRef = useRef();

	useEffect(() => {
		let handler = (e) => {
			if (!menuRef.current.contains(e.target)) {
				setMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
	});

	const handleLogout = () => {
		dispatch(authActions.logout());
	};

	return (
		<>
			<nav className="main_nav max_width m_auto">
				<NavLink to="/" className="logo">
					MBlog
				</NavLink>

				<div ref={menuRef}>
					<ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
						<li className="nav-item">
							<NavLink to="/">Home</NavLink>
						</li>
						<li className="nav-item">
							<NavLink to="/myprofile">MyProfile</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className=" create-btnnnn" to="/write">
								Create
							</NavLink>
						</li>
						<li className="nav-item" onClick={handleLogout}>
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
					</ul>
				</div>

				<div id="mobile" onClick={() => setMenuOpen(!menuOpen)}>
					{/* <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i> */}
					<i className="fas fa-bars"></i>
				</div>
			</nav>
			<hr className="max_width m_auto" />
		</>
	);
};

export default Navbar;
