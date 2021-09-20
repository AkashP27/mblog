import React from "react";
import { Link } from "react-router-dom";
import "../styles/posts.css";

const Post = ({ post }) => {
  const PublicFolder = "https://mblog-akash.herokuapp.com/images/";
  return (
    <>
      <div className="post">
        <Link to={`/post/${post._id}`} className="link">
          {post.photo && (
            <img className="post_img" src={PublicFolder + post.photo} />
          )}

          <div className="post_info">
            <span className="post_title">
              <h4>{post.title}</h4>
            </span>

            <span>
              <h5 className="author">
                {new Date(post.createdAt).toDateString()}
              </h5>
            </span>
            <span className="post_desc">{post.desc}</span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Post;
