import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/navbar.css";
import "../help.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import useProgressBar from "../custom-hooks/useProgressBar";
import jwt_decode from "jwt-decode";
import Avatar from "react-avatar";

const Navbar = () => {
	const token = useSelector((state) => state.authentication.token);
	const avatarURL = useSelector((state) => state.authentication.avatarURL);
	if (token) {
		var decoded = jwt_decode(token);
	}

	const dispatch = useDispatch();
	const [activeLink, setActiveLink] = useState("/");
	const [menuOpen, setMenuOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const profileRef = useRef(null);

	const progress = useProgressBar();

	useEffect(() => {
		const storedActiveLink = localStorage.getItem("activeLink");
		setActiveLink(storedActiveLink || "/");
	}, [activeLink]);

	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflowY = "hidden";
			document.body.addEventListener("click", handleBodyClick);
		} else {
			document.body.style.overflowY = "scroll";
			document.body.removeEventListener("click", handleBodyClick);
		}

		return () => {
			document.body.removeEventListener("click", handleBodyClick);
		};
	}, [menuOpen]);

	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (profileRef.current && !profileRef.current.contains(event.target)) {
				setProfileOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, []);

	const handleLogout = () => {
		dispatch(authActions.logout());
		setActiveLink("/");
		localStorage.setItem("activeLink", "/");
	};

	const handleLinkClick = (link) => {
		setActiveLink(link);
		localStorage.setItem("activeLink", link);
		setMenuOpen(false);
	};

	const handleBodyClick = (event) => {
		if (!event.target.closest(".nav-menu")) {
			setMenuOpen(false);
		}
	};

	return (
		<>
			<nav>
				<div className="main-nav">
					<div className="nav-bar max_width m_auto">
						<NavLink
							to="/"
							className="logo"
							onClick={() => handleLinkClick("/")}
						>
							<img src="/logo.svg" alt="" />
						</NavLink>
						<ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
							<li>
								<NavLink
									to="/"
									activeClassName={activeLink === "/" ? "active" : ""}
									onClick={() => handleLinkClick("/")}
								>
									Home
								</NavLink>
							</li>
							<li>
								<NavLink
									to="/about"
									activeClassName={activeLink === "/about" ? "active" : ""}
									onClick={() => handleLinkClick("/about")}
								>
									About
								</NavLink>
							</li>
							{token ? (
								<>
									<li>
										<NavLink
											to="/write"
											activeClassName={activeLink === "/write" ? "active" : ""}
											onClick={() => handleLinkClick("/write")}
										>
											Create
										</NavLink>
									</li>
								</>
							) : (
								<li>
									<NavLink
										className="login-btn"
										to="/login"
										onClick={() => handleLinkClick("/login")}
									>
										Login
									</NavLink>
								</li>
							)}
						</ul>
						{token && (
							<div
								className={profileOpen ? "user active" : "user"}
								onClick={() => setProfileOpen(!profileOpen)}
								ref={profileRef}
							>
								<span className="profile_pic">
									<Avatar
										name={decoded.name}
										src={avatarURL ? avatarURL : ""}
										size={34}
										round={true}
										maxInitials={3}
										className="myprofile_img"
									/>
								</span>
								<ul className="dropdown-menu">
									<div className="user-name">
										<span className="profile_pic">
											<Avatar
												name={decoded.name}
												src={avatarURL ? avatarURL : ""}
												size={34}
												round={true}
												maxInitials={3}
												className="myprofile_img"
											/>
										</span>
										<strong>@{decoded.name}</strong>
									</div>
									<li>
										<Link to="/myprofile">
											<i class="nav_icons fa fa-user"></i>
											Profile
										</Link>
									</li>
									<li>
										<NavLink to="/" onClick={handleLogout} className="logout">
											<i class="nav_icons fa fa-sign-out"></i>
											Logout
										</NavLink>
									</li>
								</ul>
							</div>
						)}
						<div id="mobile" onClick={() => setMenuOpen(!menuOpen)}>
							<i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
						</div>
					</div>
				</div>

				<span
					style={{ transform: `translate(${progress - 100}%)` }}
					className="progress-scrollbar"
				/>
			</nav>
		</>
	);
};

export default Navbar;
