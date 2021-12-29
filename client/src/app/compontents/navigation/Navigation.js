import React from 'react';
import { useAppContext } from '../../appContext';
import BurgerMenu from './svgComponents/BurgerMenu';
import NavPhone from './svgComponents/NavPhone';
import SoundIcon from './svgComponents/SoundIcon';

const Navigation = ({ setIsMenuOpen, handleScrollToFooter }) => {
	const { isSoundOn, setIsSoundOn } = useAppContext();
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
			<div className="btn-holder nav-phone">
				<a
					href="tel:(97) 4448493"
					className="btn btn-with-icon btn-transparent btn-link"
				>
					<NavPhone />
					<span>(97) 444 84 93</span>
				</a>
			</div>
			<div
				className="btn-holder request-price"
				onClick={() => handleScrollToFooter()}
			>
				<div className="btn btn-primary">Запросить стоимость</div>
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
