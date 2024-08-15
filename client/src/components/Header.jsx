import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import main from "../images/main1.svg";
import "../styles/header.css";

const Header = () => {
	const token = useSelector((state) => state.authentication.token);
	return (
		<div className="head_wrapper ">
			<div className="head_sec max_width m_auto">
				<div className="heading_left">
					<p className="animate">
						Unleash <br /> Your <br />
						Creativity
					</p>
					<span className="animate">
						Multipurpose Blog, <br /> Your Canvas for Captivating Stories..!
					</span>
					<div>
						{token ? (
							<NavLink to="/write" className="header_signup animate">
								create post
							</NavLink>
						) : (
							<NavLink to="/register" className="header_signup animate">
								sign up
							</NavLink>
						)}
					</div>
				</div>
				<div className="heading_right animate">
					<img src={main} alt="Creative blog illustration" />
				</div>
			</div>
		</div>
	);
};

export default Header;
