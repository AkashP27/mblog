import React from "react";
import "../styles/pagination.css";

const Pagination = ({ currentPage, onPageChange, totalResults }) => {
	const resultsPerPage = 6;
	const totalPages = Math.ceil(totalResults / resultsPerPage);

	const getPageNumbers = () => {
		const pageNumbers = [];
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
		return pageNumbers;
	};

	return (
		<div className="pagination">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<i class="fa fa-arrow-left" />
			</button>
			{getPageNumbers().map((number) => (
				<button
					key={number}
					onClick={() => onPageChange(number)}
					className={number === currentPage ? "active" : "inactive"}
				>
					{number}
				</button>
			))}
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				<i class="fa fa-arrow-right" />
			</button>
		</div>
	);
};

export default Pagination;
