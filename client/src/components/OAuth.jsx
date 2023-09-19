import React, { useState, useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Context } from "../context/Context";
import { axiosInstance } from "../config";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
	display: "block",
	margin: "200px auto",
};

const OAuth = () => {
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const { dispatch } = useContext(Context);

	const search = useLocation().search;
	const code = new URLSearchParams(search).get("code");
	// console.log(code);

	useEffect(() => {
		dispatch({ type: "LOGIN_START" });

		const fetchPosts = async () => {
			setLoading(true);
			try {
				const res = await axiosInstance.get(`/oauth/google?code=${code}`);
				dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
				setLoading(false);
				history.push("/");
				// console.log(res.data);
			} catch (err) {
				// console.log(err.response);
				setLoading(false);
				dispatch({ type: "LOGIN_FAILURE" });
				alert(err.response.data.message);
				history.push("/");
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
