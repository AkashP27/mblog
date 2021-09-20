import { Route } from "react-router-dom";
import React, { useContext } from "react";
import { Context } from "./context/Context";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Single from "./components/Single";
import Write from "./components/Write";
import Login from "./components/Login";
import Register from "./components/Register";
import MyProfile from "./components/MyProfile";
// import "./index.css";
import "./help.css";

const App = () => {
  const { user } = useContext(Context);

  return (
    <>
      <div>
        <Navbar />
        <Route exact path="/" component={Home} />
        <Route exact path="/register">
          {user ? <Home /> : <Register />}
        </Route>
        <Route exact path="/login">
          {user ? <Home /> : <Login />}
        </Route>
        <Route exact path="/post/:postId">
          <Single />
        </Route>
        <Route exact path="/write">
          {user ? <Write /> : <Login />}
        </Route>
        <Route exact path="/myprofile">
          <MyProfile />
        </Route>
      </div>
    </>
  );
};

export default App;
