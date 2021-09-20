import React, { useState, useEffect, useContext } from "react";
import { Context } from "../context/Context";
import Header from "./Header";
import Posts from "./Posts";
import {axiosInstance} from "../config"

const Home = () => {
  const { user } = useContext(Context);
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
      {!user ? (
        <Header />
      ) : (
        <>
          <Header />
          <Posts posts={posts} />
        </>
      )}
    </>
  );
};

export default Home;
