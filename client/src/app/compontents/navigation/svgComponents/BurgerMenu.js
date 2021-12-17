import React from 'react';

const BurgerMenu = (props) => {
	return (
		<svg
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<rect width="3" height="3" fill="black" />
			<rect y="6" width="3" height="3" fill="black" />
			<rect y="12" width="3" height="3" fill="black" />
			<rect x="6" width="3" height="3" fill="black" />
			<rect x="6" y="6" width="3" height="3" fill="black" />
			<rect x="6" y="12" width="3" height="3" fill="black" />
			<rect x="12" width="3" height="3" fill="black" />
			<rect x="12" y="6" width="3" height="3" fill="black" />
			<rect x="12" y="12" width="3" height="3" fill="black" />
		</svg>
	);
};

export default BurgerMenu;
