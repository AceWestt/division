import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AppContext = React.createContext();
const smallScreenBreakPoint = 768;

const AppProvider = ({ children }) => {
	const { pathname } = useLocation();
	const [isSoundOn, setIsSoundOn] = useState(false);
	const [lang, setLang] = useState('ru');
	const [smallScreen, setSmallScreen] = useState(false);

	const [isFooterDisabled, setIsFooterDisabled] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	const handleResize = () => {
		const wWidht =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.body.clientWidth;
		if (wWidht <= smallScreenBreakPoint) {
			setSmallScreen(true);
		} else {
			setSmallScreen(false);
		}
	};

	useEffect(() => {
		handleResize();
	}, []);

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [smallScreen]);

	return (
		<AppContext.Provider
			value={{
				isSoundOn,
				setIsSoundOn,
				lang,
				setLang,
				smallScreen,
				isFooterDisabled,
				setIsFooterDisabled,
				pathname,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	return useContext(AppContext);
};

export { AppContext, AppProvider };
