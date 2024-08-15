import React from "react";
import "../styles/circularprogressbar.css";

const CircularProgressBar = ({ progress, size = 100, strokeWidth = 10 }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progress / 100) * circumference;
	return (
		<svg className="circular-progress-bar" width={size} height={size}>
			<circle
				className="circular-progress-bar__bg"
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeWidth={strokeWidth}
			/>
			<circle
				className="circular-progress-bar__progress"
				cx={size / 2}
				cy={size / 2}
				r={radius}
				strokeWidth={strokeWidth}
				strokeDasharray={circumference}
				strokeDashoffset={offset}
			/>
			<text
				className="circular-progress-bar__text"
				x="50%"
				y="50%"
				dy=".3em"
				textAnchor="middle"
			>
				{progress}%
			</text>
		</svg>
	);
};

export default CircularProgressBar;
