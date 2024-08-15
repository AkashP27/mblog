import React, { useEffect } from "react";
import "../styles/modal.css";

const DeleteUserModal = ({ closeModal, setDeleteUser }) => {
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
					<div className="modal_body">Your account will be deleted..!</div>
					<div className="modal_footer">
						<button id="cancelBtn" onClick={() => closeModal(false)}>
							Cancel
						</button>
						<button
							onClick={() => {
								setDeleteUser();
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

export default DeleteUserModal;
