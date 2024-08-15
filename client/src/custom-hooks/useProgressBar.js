import { useEffect, useState } from "react";

const useProgressBar = () => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const updateProgressBar = () => {
			const currentScrollBar = window.scrollY;
			const scrollHeight = document.body.scrollHeight - window.innerHeight;

			if (scrollHeight) {
				setProgress(Number((currentScrollBar / scrollHeight).toFixed(2)) * 100);
			}
		};

		window.addEventListener("scroll", updateProgressBar);

		return () => {
			window.removeEventListener("scroll", updateProgressBar);
		};
	}, []);

	return progress;
};

export default useProgressBar;
