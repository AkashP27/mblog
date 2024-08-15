import React, { useEffect } from "react";
import "../styles/modal.css";

const PostModal = ({ closeModal, setDeletePost }) => {
	useEffect(() => {
		document.body.style.overflowY = "hidden";

		return () => {
			document.body.style.overflowY = "scroll";
		};
	}, []);

	return (
		<>
			<div className="modal_wrapper">
				<div className="modal_container">
					<div className="modal_title">
						<h2>Are you sure?</h2>
					</div>
					<div className="modal_body">Your current post will be deleted..!</div>
					<div className="modal_footer">
						<button id="cancelBtn" onClick={() => closeModal(false)}>
							Cancel
						</button>
						<button
							onClick={() => {
								setDeletePost();
								closeModal(false);
							}}
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default PostModal;
