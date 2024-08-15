import { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import categories from "../utils/category";
import categoryColors from "../utils/categoryColors";
import "../styles/categorylist.css";

const CategoryList = () => {
	const scrollRef = useRef(null);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);
	const location = useLocation();
	const [selectedCategory, setSelectedCategory] = useState(" ");

	useEffect(() => {
		const handleScroll = () => {
			if (scrollRef.current) {
				const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
				setShowLeftArrow(scrollLeft > 0);
				setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
			}
		};

		if (scrollRef.current) {
			scrollRef.current.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (scrollRef.current) {
				scrollRef.current.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const category = params.get("category") || "";
		setSelectedCategory(category);
	}, [location]);

	const handleScrollLeft = () => {
		scrollRef.current.scrollLeft -= 250;
	};

	const handleScrollRight = () => {
		scrollRef.current.scrollLeft += 250;
	};

	const getCategoryColor = (category) => {
		return categoryColors[category] || categoryColors.Default;
	};

	return (
		<div className="container max_width m_auto">
			<div className="scroll-container">
				{showLeftArrow && (
					<div className="left-arrow" onClick={handleScrollLeft}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 19.5 8.25 12l7.5-7.5"
							/>
						</svg>
					</div>
				)}
				<div className="category-list" ref={scrollRef}>
					{categories.map((cat, index) => (
						<Link
							to={`/posts?category=${cat.value}`}
							className="category"
							style={{
								backgroundColor:
									selectedCategory === cat.value
										? "#424242"
										: getCategoryColor(cat.value),
								color:
									selectedCategory === cat.value
										? "#ffffff"
										: "rgb(32, 78, 119)",
							}}
							key={index}
							onClick={() => setSelectedCategory(cat.value)}
						>
							{cat.image && (
								<img className="category-image" src={cat.image} alt="" />
							)}
							<span>{cat.label}</span>
						</Link>
					))}
				</div>
				{showRightArrow && (
					<div className="right-arrow" onClick={handleScrollRight}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m8.25 4.5 7.5 7.5-7.5 7.5"
							/>
						</svg>
					</div>
				)}
			</div>
		</div>
	);
};

export default CategoryList;
