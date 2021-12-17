import React from 'react';

const SoundIcon = (props) => {
	return (
		<svg
			viewBox="0 0 15 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect y="10" width="3" height="4" fill="black" />
			<rect x="6" y="5" width="3" height="9" fill="black" />
			<rect x="12" width="3" height="14" fill="black" />
		</svg>
	);
};

export default SoundIcon;
