import React, { useRef, useEffect, useState } from "react";
import Post from "./Post";
import "../styles/posts.css";

const LazyLoad = ({ post }) => {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef();

	useEffect(() => {
		const callback = (entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
				}
			});
		};

		const observer = new IntersectionObserver(callback);
		if (ref.current) {
			observer.observe(ref.current);
		}
		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, []);

	return (
		<>
			{isVisible ? (
				<Post post={post} />
			) : (
				<div ref={ref} className="post"></div>
			)}
		</>
	);
};

export default LazyLoad;
