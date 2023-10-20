import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { axiosInstance } from "../config";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import { toast } from "react-hot-toast";

const override = {
	display: "block",
	margin: "200px auto",
};

const OAuth = () => {
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const search = useLocation().search;
	const code = new URLSearchParams(search).get("code");

	let vendor;
	new URLSearchParams(search).get("scope")
		? (vendor = "google")
		: code.length > 50
		? (vendor = "linkedIn")
		: (vendor = "github");

	useEffect(() => {
		dispatch(authActions.loginStart());

		const fetchPosts = async () => {
			setLoading(true);
			try {
				const res = await axiosInstance.get(`/oauth/${vendor}?code=${code}`);
				dispatch(authActions.loginSuccess(res.data.data));
				setLoading(false);
				history.push("/");
				toast.success(`Welcome ${res.data.data.user.name}`, {
					duration: 10000,
				});
			} catch (err) {
				setLoading(false);
				dispatch(authActions.loginFailure());
				history.push("/");
				toast.error(err.response.data.message, {
					duration: 15000,
				});
			}
		};

		fetchPosts();
	}, []);
	return (
		<div>
			{loading && (
				<ClipLoader
					color={"#36d7b7"}
					// loading={loading}
					cssOverride={override}
					size={50}
					width={100}
					display="block"
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			)}
		</div>
	);
};

export default OAuth;
