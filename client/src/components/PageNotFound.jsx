import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/pagenotfound.css";
import Footer from "./Footer";

const PageNotFound = () => {
	return (
		<>
			<div className="max_width m_auto page-not-found">
				<h2>404 | This page doesn't exists</h2>
				<p>
					You might have typed the wrong address. Please try again or visit home
					page
				</p>
				<span>
					<NavLink to="/">Go back to home</NavLink>
				</span>
			</div>
			<Footer />
		</>
	);
};

export default PageNotFound;
