// import "./index.css";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Context } from "../context/Context";
import {axiosInstance} from "../config";
import "../styles/single.css";

const Single = () => {
  let history = useHistory();
  const location = useLocation();

  const path = location.pathname.split("/")[2];

  const [post, setPost] = useState({});
  const PublicFolder = "https://mblog-akash.herokuapp.com/images/";

  const { user } = useContext(Context);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const getPost = async () => {
      const res = await axiosInstance.get("/posts/" + path);

      setPost(res.data);
      setName(res.data.name);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    getPost();
  }, [path]);

  const handleDelete = async () => {
    let deletepost = window.confirm("Are you sure to delete the post?");
    if (deletepost) {
      {
        await axiosInstance.delete(`/posts/${post._id}`, { data: { name: user.name } });
        history.push("/");
      }
    }
  };

  const handleUpdate = async () => {
    await axiosInstance.put(`/posts/${post._id}`, { name: user.name, title, desc });
    // window.location.reload();
    setUpdate(false);
  };

  // console.log(path);

  return (
    <>
      <div className="single max_width m_auto">
        <div className="singlePostWrapper">
          <hr className=" max_width m_auto" />
          {post.photo && (
            <img
              className="singlePostImg max_width m_auto"
              src={PublicFolder + post.photo}
              alt="singlepage"
            />
          )}

          <hr className=" max_width m_auto" />
          {update ? (
            <input
              type="text"
              value={title}
              className="singlePostTitleInput"
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          ) : (
            <h1 className="singlePostTitle ">
              {title}
              {post.name === user.name && (
                <div className="singlePostEdit">
                  <i
                    className="singlePostIcon fas fa-edit"
                    onClick={() => setUpdate(true)}
                  ></i>
                  <i
                    className="singlePostIcon fas fa-trash-alt"
                    onClick={handleDelete}
                  ></i>
                </div>
              )}
            </h1>
          )}
        </div>

        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:<b>{post.name}</b>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {update ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {update && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
    </>
  );
};

export default Single;
