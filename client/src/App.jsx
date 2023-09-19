import { Route, Switch } from "react-router-dom";
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
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ChangePassword from "./components/ChangePassword";
import OAuth from "./components/OAuth";
import PageNotFound from "./components/PageNotFound";
import "./help.css";

const App = () => {
	const { token } = useContext(Context);

	return (
		<>
			<div>
				<Navbar />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/register">
						{token ? <Home /> : <Register />}
					</Route>
					<Route exact path="/login">
						{token ? <Home /> : <Login />}
					</Route>
					<Route exact path="/post/:postId">
						<Single />
					</Route>
					<Route exact path="/write">
						{token ? <Write /> : <Login />}
					</Route>
					<Route exact path="/myprofile">
						<MyProfile />
					</Route>
					<Route exact path="/forgot-password">
						<ForgotPassword />
					</Route>
					<Route exact path="/reset-password/:token">
						<ResetPassword />
					</Route>
					<Route exact path="/update-password">
						<ChangePassword />
					</Route>
					<Route exact path="/oauth">
						<OAuth />
					</Route>
					<Route path="*" exact component={PageNotFound} />
				</Switch>
			</div>
		</>
	);
};

export default App;
