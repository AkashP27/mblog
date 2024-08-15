import React, { useEffect } from "react";
import Footer from "./Footer";
import "../styles/about.css";

const About = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<>
			<div className="about-page">
				<div className="about-section">
					<div className="about-heading">
						<h1>About Us</h1>
						<p>
							Welcome to mblog, your number one source for all things
							blog-related. We're dedicated to providing you the very best of
							content, with an emphasis on quality, reliability, and uniqueness.
						</p>
					</div>
					<div className="about-content">
						<div className="about-left">
							<p>
								MBlog, where the magic of storytelling comes alive! Here,
								individuals are not just bloggers; they're storytellers, sharing
								their unique experiences, knowledge, and passions. This isn't
								just a platform; it's a dynamic hub, a playground for your
								creativity.
								<br />
								<br />
								MBlog - where every story finds its stage, and every blogger is
								a star. Let your words sparkle and your journey begin..!
							</p>
						</div>
						<div className="about-right">
							<img src="./BLOG.png" alt="About us" />
						</div>
					</div>
				</div>
				<section className="mission">
					<h2>Our Mission</h2>
					<p>
						Our mission is to provide insightful and engaging content to our
						readers. We aim to cover a variety of topics and offer unique
						perspectives to keep you informed and entertained.
					</p>
				</section>
				<section className="team">
					<h2>Our Team</h2>
					<p>
						We have a dedicated team of writers and editors who work tirelessly
						to bring you the best content. Our team is passionate about sharing
						knowledge and providing value to our readers.
					</p>
				</section>
			</div>
			<Footer />
		</>
	);
};

export default About;
