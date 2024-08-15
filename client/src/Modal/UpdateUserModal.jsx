import React, { useEffect } from "react";
import "../styles/modal.css";

const UpdateUserModal = ({ closeModal, setUpdateUser }) => {
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
					<div className="modal_body">
						Your current account details will be updated..!
					</div>
					<div className="modal_footer">
						<button id="cancelBtn" onClick={() => closeModal(false)}>
							Cancel
						</button>
						<button
							onClick={() => {
								setUpdateUser();
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

export default UpdateUserModal;
