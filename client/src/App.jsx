import { Route, Switch } from "react-router-dom";
import React from "react";
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
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

const App = () => {
	const token = useSelector((state) => state.authentication.token);

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
						{token ? <MyProfile /> : <Login />}
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
				<Toaster
					toastOptions={{
						success: {
							style: {
								background: "rgba(216, 239, 234, 1)",
							},
						},
						error: {
							style: {
								background: "rgba(241, 211, 206, 1)",
							},
						},
					}}
					containerStyle={{
						top: 85,
						left: 20,
						bottom: 20,
						right: 20,
					}}
				/>
			</div>
		</>
	);
};

export default App;
