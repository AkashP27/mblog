import React, { useState, useRef, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../context/Context";
import { axiosInstance } from "../config";
// import "./index.css";
import "../styles/login.css";

const Login = () => {
 const userRef = useRef();
 const passwordRef = useRef();
 const { dispatch, isFetching } = useContext(Context);
 const [error, setError] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(false);

  dispatch({ type: "LOGIN_START" });

  try {
   const res = await axiosInstance.post("/auth/login", {
    email: userRef.current.value,
    password: passwordRef.current.value,
   });
   dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
   setError(true);

   dispatch({ type: "LOGIN_FAILURE" });
  }
 };

 return (
  <>
   <br />
   <br />
   <div className="login ">
    <span className="loginTitle">Login</span>
    {error && (
     <span style={{ alignSelf: "center", color: "red", marginTop: "10px" }}>
      <h6>Please enter correct details!</h6>
     </span>
    )}

    <form method="POST" className="loginForm" onSubmit={handleSubmit}>
     <input
      type="text"
      className="loginInput"
      ref={userRef}
      placeholder="Enter your email"
     />

     <input
      type="password"
      className="loginInput"
      ref={passwordRef}
      placeholder="Enter your password"
     />
     <button
      className="loginButton"
      value="Log In"
      type="submit"
      disabled={isFetching}
     >
      Login
     </button>
     <br />
     <div className="bottom">
      <p style={{ color: "black !important" }}>New User?</p>
      <NavLink to="/register">Register</NavLink>
     </div>
    </form>
   </div>
  </>
 );
};

export default Login;
