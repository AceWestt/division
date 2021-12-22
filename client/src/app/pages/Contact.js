import React from 'react';
import PageTitleHolder from '../compontents/PageTitleHolder';
import titleImg from '../images/page-title-contact.svg';
import logo from '../images/logo-contact.svg';
import logoMobile from '../images/logo-contact-mobile.svg';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

const Contact = () => {
	return (
		<div className="section section-contact">
			<PageTitleHolder title={titleImg} />
			<div className="contact-details">
				<div className="side side-map">
					<div className="map-container">
						<YMaps>
							<Map className="map" state={{ center: [41.270079, 69.23447], zoom: 15 }}>
								<Placemark geometry={[41.270079, 69.23447]} />
							</Map>
						</YMaps>
					</div>
					<div className="logo-mobile">
						<img src={logoMobile} alt="logo" />
					</div>
				</div>
				<div className="side side-details">
					<div className="detail email">
						<a href="mailto:u.ergashev@dvsn.uz">u.ergashev@dvsn.uz</a>
					</div>
					<div className="detail phone">
						<a href="tel:+ 998 97 268 77 70">+ 998 97 268 77 70</a>
					</div>
					<div className="detail socials">
						<a href="https://www.facebook.com/">Facebook,</a>
						<a href="https://www.instagram.com/">Instagram</a>
					</div>
					<div className="detail address">г. Ташкент улица Тадбиркор 78</div>
					<div className="btn btn-with-icon cta">
						<svg width="66" height="66" viewBox="0 0 66 66" fill="none">
							<circle cx="33" cy="33" r="33" fill="#1170FF" />
							<circle cx="33.359" cy="33.2916" r="1.80337" stroke="white" />
							<circle cx="26.9098" cy="33.2919" r="1.80337" stroke="white" />
							<circle cx="39.8083" cy="33.2916" r="1.80337" stroke="white" />
							<path
								d="M20 25V41.5439H38.7018L46.614 45.5V25H20Z"
								stroke="white"
								strokeWidth="1.5"
							/>
						</svg>
						<span>Оставить заявку</span>
					</div>
					<div className="logo">
						<img src={logo} alt="logo" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;
