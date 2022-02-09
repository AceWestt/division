import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import closeBtn from './imgs/closebtn.svg';
import logo from './imgs/logo.svg';
import mobileBg from './imgs/mobile-bg.png';
import { gsap } from 'gsap';
import { useAppContext } from '../../appContext';

const Menu = ({ setIsMenuOpen, handleScrollToFooter }) => {
	const mainRef = useRef(null);
	const casesRef = useRef(null);
	const contactRef = useRef(null);
	const aboutRef = useRef(null);
	const servicesRef = useRef(null);

	const { lang, setLang, smallScreen, backendData } = useAppContext();
	const [activePage, setActivePage] = useState('');

	const { pathname } = useLocation();

	useEffect(() => {
		setActivePage(pathname.split('/')[1]);
		console.log(pathname.split('/')[1]);
	}, [pathname]);

	const handleImgAppear = (img) => {
		if (!smallScreen) {
			gsap.to(img, { opacity: 1, duration: 0.3, ease: 'none' });
		}
	};
	const handleImgDisappear = (img) => {
		if (!smallScreen) {
			gsap.to(img, { opacity: 0, duration: 0.3, ease: 'none' });
		}
	};

	if (smallScreen) {
		return (
			<div className="modal menu-modal mobile">
				<img className="modal-bg" src={mobileBg} alt="bg" />
				<div className="menu-header">
					<div className="lang-select">
						<div
							className={lang === 'ru' ? 'active' : ''}
							onClick={() => setLang('ru')}
						>
							Ru
						</div>
						<div
							className={lang === 'en' ? 'active' : ''}
							onClick={() => setLang('en')}
						>
							En
						</div>
						<div
							className={lang === 'uz' ? 'active' : ''}
							onClick={() => setLang('uz')}
						>
							Uz
						</div>
					</div>
					<div className="close-btn" onClick={() => setIsMenuOpen(false)}>
						<img src={closeBtn} alt="close" />
					</div>
				</div>
				<div className="menu-mid">
					<div className="links">
						<Link
							to="/"
							className={activePage === '' ? 'active' : ''}
							onClick={() => setIsMenuOpen(false)}
						>
							Главная,
						</Link>
						<Link
							to="/about"
							className={activePage === 'about' ? 'active' : ''}
							onClick={() => setIsMenuOpen(false)}
						>
							О нас,
						</Link>
						<Link
							to="/cases"
							className={activePage === 'cases' ? 'active' : ''}
							onClick={() => setIsMenuOpen(false)}
						>
							Кейсы,
						</Link>
						<Link
							to="/contact"
							className={activePage === 'contact' ? 'active' : ''}
							onClick={() => setIsMenuOpen(false)}
						>
							Контакты,
						</Link>
						<Link
							to="/services"
							className={activePage === 'services' ? 'active' : ''}
							onClick={() => setIsMenuOpen(false)}
						>
							Услуги
						</Link>
					</div>
				</div>
				<div className="menu-bottom">
					<div
						className="btn-holder request-price"
						onClick={() => {
							handleScrollToFooter();
							setIsMenuOpen(false);
						}}
					>
						<div className="btn btn-primary">Запросить стоимость</div>
					</div>
					<a
						href={`tel:${backendData.contactContent.phone}`}
						className="btn btn-link btn-footer btn-phone"
					>
						{backendData.contactContent.phone}
					</a>
					<div className="social-links">
						<a
							href={backendData.contactContent.instagram}
							className="btn btn-link btn-footer"
						>
							Instagram,
						</a>
						<a
							href={backendData.contactContent.facebook}
							className="btn btn-link btn-footer"
						>
							Facebook
						</a>
					</div>
					<div className="address">{backendData.contactContent.address[lang]}</div>
					<div className="logo">
						<img src={logo} alt="logo" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="modal menu-modal" id="menu">
			<div className="menu-header">
				<div className="lang-select">
					<div
						className={lang === 'ru' ? 'active' : ''}
						onClick={() => setLang('ru')}
					>
						Ru
					</div>
					<div
						className={lang === 'en' ? 'active' : ''}
						onClick={() => setLang('en')}
					>
						En
					</div>
					<div
						className={lang === 'uz' ? 'active' : ''}
						onClick={() => setLang('uz')}
					>
						Uz
					</div>
				</div>
				<div className="close-btn" onClick={() => setIsMenuOpen(false)}>
					<img src={closeBtn} alt="close" />
					<span>Закрыть</span>
				</div>
			</div>
			<div className="menu-mid">
				<div className="links">
					<div className="side">
						<Link
							to="/"
							className={activePage === '' ? 'active' : ''}
							onPointerOver={() => handleImgAppear(mainRef.current)}
							onPointerLeave={() => handleImgDisappear(mainRef.current)}
							onClick={() => setIsMenuOpen(false)}
						>
							Главная,
						</Link>
						<Link
							to="/cases"
							className={activePage === 'cases' ? 'active' : ''}
							onPointerOver={() => handleImgAppear(casesRef.current)}
							onPointerLeave={() => handleImgDisappear(casesRef.current)}
							onClick={() => setIsMenuOpen(false)}
						>
							Кейсы,
						</Link>
						<Link
							to="/contact"
							className={activePage === 'contact' ? 'active' : ''}
							onPointerOver={() => handleImgAppear(contactRef.current)}
							onPointerLeave={() => handleImgDisappear(contactRef.current)}
							onClick={() => setIsMenuOpen(false)}
						>
							Контакты
						</Link>
					</div>
					<div className="side">
						<Link
							to="/about"
							className={activePage === 'about' ? 'active' : ''}
							onPointerOver={() => handleImgAppear(aboutRef.current)}
							onPointerLeave={() => handleImgDisappear(aboutRef.current)}
							onClick={() => setIsMenuOpen(false)}
						>
							О нас,
						</Link>
						<Link
							to="/services"
							className={activePage === 'services' ? 'active' : ''}
							onPointerOver={() => handleImgAppear(servicesRef.current)}
							onPointerLeave={() => handleImgDisappear(servicesRef.current)}
							onClick={() => setIsMenuOpen(false)}
						>
							Услуги,
						</Link>
					</div>
				</div>
				<div className="imgs">
					<div className="img-holder">
						<img
							className="main"
							ref={mainRef}
							src={backendData.generalContent.mainLinkGif}
							alt="main"
						/>
						<img
							className="cases"
							ref={casesRef}
							src={backendData.generalContent.casesLinkGif}
							alt="main"
						/>
						<img
							className="contacts"
							ref={contactRef}
							src={backendData.generalContent.contactsLinkGif}
							alt="main"
						/>
						<img
							className="about"
							ref={aboutRef}
							src={backendData.generalContent.aboutLinkGif}
							alt="main"
						/>
						<img
							className="services"
							ref={servicesRef}
							src={backendData.generalContent.servicesLinkGif}
							alt="main"
						/>
					</div>
				</div>
			</div>
			<div className="menu-bottom">
				<div className="logo">
					<img src={logo} alt="logo" />
				</div>
				<div className="social-links">
					<a
						href={backendData.contactContent.instagram}
						className="btn btn-link btn-footer"
					>
						Instagram,
					</a>
					<a
						href={backendData.contactContent.facebook}
						className="btn btn-link btn-footer"
					>
						Facebook
					</a>
				</div>
				<div className="address">{backendData.contactContent.address[lang]}</div>
			</div>
		</div>
	);
};

export default Menu;
