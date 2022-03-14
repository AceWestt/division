import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../appContext';
import BurgerMenu from './svgComponents/BurgerMenu';
import NavPhone from './svgComponents/NavPhone';
import SoundIcon from './svgComponents/SoundIcon';
import logo from '../../images/logomain.svg';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ setIsMenuOpen, handleScrollToFooter }) => {
	const { isSoundOn, setIsSoundOn, backendData, lang } = useAppContext();
	const location = useLocation();
	const [isMainLinkOn, setIsMainLinkOn] = useState(true);
	useEffect(() => {
		const { pathname } = location;
		if (pathname === '/') {
			setIsMainLinkOn(false);
		} else {
			setIsMainLinkOn(true);
		}
	}, [location]);
	return (
		<div className="section section-navigation">
			<div className="btn-holder toggle-sound">
				<div
					className={`btn btn-with-icon btn-tranparent ${
						isSoundOn ? '' : 'deactivated'
					}`}
					onClick={() => setIsSoundOn(!isSoundOn)}
				>
					<SoundIcon />
					<span>Звук</span>
				</div>
			</div>
			{isMainLinkOn && (
				<Link className="back-to-main-btn" to="/">
					<img src={logo} alt="logo" />
				</Link>
			)}

			<div className="btn-holder nav-phone">
				<a
					href={`tel:${backendData.contactContent.phone}`}
					className="btn btn-with-icon btn-transparent btn-link"
				>
					<NavPhone />
					<span>{backendData.contactContent.phone}</span>
				</a>
			</div>
			<div
				className="btn-holder request-price"
				onClick={() => handleScrollToFooter()}
			>
				<div className="btn btn-primary">
					{lang === 'en'
						? 'Request for Quote'
						: lang === 'uz'
						? 'Narxlarni bilish'
						: 'Запросить стоимость'}
				</div>
			</div>
			<div className="btn-holder open-menu">
				<div className="btn btn-icon" onClick={() => setIsMenuOpen(true)}>
					<BurgerMenu />
				</div>
			</div>
		</div>
	);
};

export default Navigation;
