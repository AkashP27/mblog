import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/pagenotfound.css";

const PageNotFound = () => {
	return (
		<>
			<span className="max_width m_auto page-not-found">
				<h2>404 | This page could not be found</h2>
				<h5>
					<NavLink to="/">Go back to home</NavLink>
				</h5>
			</span>
		</>
	);
};

export default PageNotFound;
