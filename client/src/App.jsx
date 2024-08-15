import React, { lazy, Suspense, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import "./index.css";
import "./help.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchFeaturedPosts } from "./store/featuredPosts-slice";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./custom-hooks/useScrollToTop";
import HashLoader from "react-spinners/HashLoader";

const About = lazy(() => import("./components/About"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const MyProfile = lazy(() => import("./components/MyProfile"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const ChangePassword = lazy(() => import("./components/ChangePassword"));
const Write = lazy(() => import("./components/Write"));
const AuthorPosts = lazy(() => import("./components/AuthorPosts"));
const Single = lazy(() => import("./components/Single"));
const Category = lazy(() => import("./components/Category"));
const OAuth = lazy(() => import("./components/OAuth"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));

const override = {
	display: "block",
	margin: "200px auto",
};

const App = () => {
	const token = useSelector((state) => state.authentication.token);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchFeaturedPosts());
	}, [dispatch]);

	return (
		<div>
			<Navbar />
			<ScrollToTop />
			<Suspense
				fallback={
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100vh",
						}}
					>
						<HashLoader
							color={"#36d7b7"}
							cssOverride={override}
							size={50}
							width={100}
							display="block"
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					</div>
				}
			>
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route exact path="/register">
						{token ? <Home /> : <Register />}
					</Route>
					<Route exact path="/login">
						{token ? <Home /> : <Login />}
					</Route>
					<Route exact path="/posts/:postId">
						<Single />
					</Route>
					<Route path="/posts/author/:authorId">
						<AuthorPosts />
					</Route>
					<Route exact path="/posts">
						<Category />
					</Route>
					<Route exact path="/write">
						{token ? <Write /> : <Login />}
					</Route>
					<Route exact path="/myprofile">
						{token ? <MyProfile /> : <Login />}
					</Route>
					<Route exact path="/about">
						<About />
					</Route>
					<Route exact path="/forgot-password">
						<ForgotPassword />
					</Route>
					<Route exact path="/reset-password/:token">
						<ResetPassword />
					</Route>
					<Route exact path="/update-password">
						{token ? <ChangePassword /> : <Login />}
					</Route>
					<Route exact path="/oauth">
						<OAuth />
					</Route>
					<Route path="*" exact component={PageNotFound} />
				</Switch>
			</Suspense>
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
	);
};

export default App;
