import React, { useState, useEffect } from "react";
import Header from "./Header";
import Posts from "./Posts";
import { axiosInstance } from "../config";

const Home = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await axiosInstance.get("/posts");
			setPosts(res.data);
			// console.log(res);
		};
		fetchPosts();
	}, []);
	return (
		<>
			<Header />
			<Posts posts={posts} />
		</>
	);
};

export default Home;
