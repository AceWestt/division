import React, { useEffect } from 'react';
import PageTitleHolder from '../compontents/PageTitleHolder';
import titleImg from '../images/page-title-contact.svg';
import titleImgEn from '../images/page-title-contacts-en.svg';
import titleImgUz from '../images/page-title-contacts-uz.svg';
import logo from '../images/logo-contact.svg';
import logoMobile from '../images/logo-contact-mobile.svg';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import { useAppContext } from '../appContext';

const Contact = ({ handleScrollToFooter }) => {
	const { setIsFooterDisabled, lang, backendData } = useAppContext();
	useEffect(() => {
		setIsFooterDisabled(false);
	}, [setIsFooterDisabled]);
	return (
		<div className="section section-contact">
			<div className="title-holder-wrap">
				<PageTitleHolder disabled={lang !== 'en'} title={titleImgEn} />
				<PageTitleHolder disabled={lang !== 'uz'} title={titleImgUz} />
				<PageTitleHolder disabled={lang !== 'ru'} title={titleImg} />
			</div>
			<div className="contact-details">
				<div className="side side-map">
					<div className="map-container">
						<YMaps>
							<Map
								className="map"
								state={{
									center: [
										backendData.contactContent.officeCoords.long,
										backendData.contactContent.officeCoords.lat,
									],
									zoom: 15,
								}}
							>
								<Placemark
									geometry={[
										backendData.contactContent.officeCoords.long,
										backendData.contactContent.officeCoords.lat,
									]}
								/>
							</Map>
						</YMaps>
					</div>
					<div className="logo-mobile">
						<img src={logoMobile} alt="logo" />
					</div>
				</div>
				<div className="side side-details">
					<div className="detail email">
						<a href={`mailto:${backendData.contactContent.email}`}>
							{backendData.contactContent.email}
						</a>
					</div>
					<div className="detail phone">
						<a href={`tel:${backendData.contactContent.phone}`}>
							{backendData.contactContent.phone}
						</a>
					</div>
					<div className="detail socials">
						<a href={backendData.contactContent.facebook}>Facebook,</a>
						<a href={backendData.contactContent.instagram}>Instagram</a>
					</div>
					<div className="detail address">
						{backendData.contactContent.address[lang]}
					</div>
					<div
						className="btn btn-with-icon cta"
						onClick={() => {
							handleScrollToFooter();
						}}
					>
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
						<span>
							{lang === 'en'
								? 'Submit an application'
								: lang === 'uz'
								? ' So‘rov qoldirish'
								: 'Оставить заявку'}
						</span>
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
