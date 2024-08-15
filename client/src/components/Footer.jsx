import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
	return (
		<article className="footer_wrapper">
			<section className="footer_container max_width m_auto">
				<div className="footer_left">
					<div className="footer_logo">
						<img src="/logo.svg" alt="logo" />
					</div>
					<section className="footer_left_details">
						<div className="footer_email">
							<a href="mailto:mblog2728@gmail.com" className="footer_links">
								<i className="fa fa-envelope" />
								mblog2728@gmail.com
							</a>
						</div>
						<div className="footer_location">
							<span style={{ color: "#4c5f8d" }}>
								<i className="fas fa-map-marker-alt" /> Bengaluru, IN
							</span>
						</div>
					</section>
				</div>
				<div className="footer_links_wrapper">
					<div className="footer_about">
						<p>QUICK LINKS</p>
						<div className="footer_about_section">
							<NavLink to="/" className="footer_links">
								Home
							</NavLink>
							<NavLink to="/write" className="footer_links">
								Create Post
							</NavLink>
						</div>
					</div>
					<div className="footer_about">
						<p>ABOUT</p>
						<div className="footer_about_section">
							<NavLink to="/about" className="footer_links">
								About Us
							</NavLink>
						</div>
					</div>
					<div className="footer_about">
						<p>FOLLOW US</p>
						<div className="footer_about_section">
							<a
								href="https://github.com/AkashP27"
								target="_blank"
								className="footer_links"
								rel="noreferrer"
							>
								github
							</a>
							<a
								href="https://www.linkedin.com/in/akash-phayade/"
								target="_blank"
								className="footer_links"
								rel="noreferrer"
							>
								linkedIn
							</a>
						</div>
					</div>
					{/* <div className="footer_about">
						<p>LEGAL</p>
						<div className="footer_about_section">
							<NavLink to="/" className="footer_links">
								Privacy Policy
							</NavLink>
							<NavLink to="/" className="footer_links">
								Terms & Conditions
							</NavLink>
						</div>
					</div> */}
				</div>
			</section>
			<section className="footer_bottom">
				<p>
					&copy; 2024 MBLOG. Developed By Akash Phayade. All Rights Reserved.
				</p>
			</section>
		</article>
	);
};

export default Footer;
