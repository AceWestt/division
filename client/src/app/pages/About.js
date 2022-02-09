import React, { useEffect, useRef, useState } from 'react';
import PageTitleHolder from '../compontents/PageTitleHolder';
import titleImg from '../images/page-title-about.svg';
import teamBlockArt from '../images/team-block-art-about.svg';
import teamControlBtn from '../images/team-control-about.svg';
import { useAppContext } from '../appContext';
import logofooter from '../images/footer-logo.svg';
import locationIcnMobile from '../images/location-about-mobile.svg';
import faceBookIcnMobile from '../images/facebook-icn-about-mobile.svg';
import instagramIcnMobile from '../images/instagram-icn-about-mobile.svg';
import phoneFooter from '../images/about-footer-phone.svg';
import emailFooter from '../images/about-footer-mail.svg';
import music from '../compontents/footer/bg.mp3';
import parse from 'html-react-parser';

const About = ({ footerRef }) => {
	const { smallScreen, setIsFooterDisabled, isSoundOn, lang, backendData } =
		useAppContext();

	const musicRef = useRef(null);

	useEffect(() => {
		if (musicRef.current) {
			if (isSoundOn) {
				musicRef.current.play();
			} else {
				musicRef.current.pause();
			}
		}
	}, [isSoundOn]);

	useEffect(() => {
		setIsFooterDisabled(true);
	}, [setIsFooterDisabled]);

	return (
		<div className="section section-about">
			<PageTitleHolder title={titleImg} />
			<div className="description">
				{parse(
					backendData.aboutContent.slogan[lang]
						.replace('<b>', '<span>')
						.replace('</b>', '</span>')
				)}
			</div>
			<div className="hero-imgs">
				<img src={backendData.aboutContent.teamPhoto1} alt="heroimg" />
				<img src={backendData.aboutContent.teamPhoto2} alt="heroimg" />
				<img src={backendData.aboutContent.teamPhoto3} alt="heroimg" />
				<img src={backendData.aboutContent.teamPhoto4} alt="heroimg" />
			</div>
			<div className="short-text">
				{backendData.aboutContent.advantageText[lang]}
			</div>
			<div className="slogan-wrap">
				<span>{backendData.aboutContent.energyText[lang]}</span>
				<img src={backendData.aboutContent.energyImg} alt="img" />
			</div>
			<MediaBlock lang={lang} backendData={backendData} />
			<audio loop src={music} ref={musicRef}>
				Your browser does not support the audio element.
			</audio>
			{smallScreen ? (
				<TeamBlockMobile
					footerRef={footerRef}
					backendData={backendData}
					lang={lang}
				/>
			) : (
				<TeamBlock footerRef={footerRef} backendData={backendData} lang={lang} />
			)}
		</div>
	);
};

export default About;

const TeamBlock = ({ footerRef, backendData, lang }) => {
	const teamArrayLength = backendData.team.length || 0;
	const teamCountMax = Math.ceil(teamArrayLength / 10);
	let teamArrayToRender = [];
	for (let i = 0; i < teamCountMax; i++) {
		teamArrayToRender.push(backendData.team.slice(i * 10, (i + 1) * 10));
	}

	const [activeIndex, setActiveIndex] = useState(0);
	const lastIndex = teamCountMax - 1;

	useEffect(() => {
		if (activeIndex < 0) {
			setActiveIndex(lastIndex);
		}
		if (activeIndex > lastIndex) {
			setActiveIndex(0);
		}
	}, [activeIndex, lastIndex]);

	useEffect(() => {
		let slider = setInterval(() => {
			setActiveIndex(activeIndex + 1);
		}, 10000);
		return () => {
			clearInterval(slider);
		};
	}, [activeIndex]);

	const getPositionClass = (index) => {
		let position = 'next-slide';

		if (index === activeIndex - 1 || (activeIndex === 0 && index === lastIndex)) {
			position = 'last-slide';
		}
		if (index === activeIndex) {
			position = 'active-slide';
		}
		return position;
	};

	return (
		<div className="team-block" ref={footerRef}>
			<div className="head">
				<div className="title-block">
					<div className="title">Наша команда</div>
					<img src={teamBlockArt} alt="наша команда" />
				</div>
				<div className="team-members-block">
					<div className="team-members-wrap">
						<div className="team-members">
							{teamArrayToRender.map((arrayGroup, index) => {
								return (
									<div
										className={`team-group ${getPositionClass(index)}`}
										key={`team-group-${index}`}
									>
										{arrayGroup.map((member, mIndex) => {
											return (
												<div className="team-member" key={`team-member-${mIndex}`}>
													<img src={member.img} alt="member" />
													<div className="name">{member.name[lang]}</div>
													<div className="title">{member.title[lang]}</div>
												</div>
											);
										})}
									</div>
								);
							})}
						</div>
					</div>
					<div className="team-member-slider-control">
						<img
							src={teamControlBtn}
							alt="left"
							className="control to-left"
							onClick={() => setActiveIndex(activeIndex - 1)}
						/>
						<img
							src={teamControlBtn}
							alt="left"
							className="control to-right"
							onClick={() => setActiveIndex(activeIndex + 1)}
						/>
					</div>
				</div>
			</div>
			<div className="foot">
				<img src={logofooter} alt="logo" />
				<div className="social-links">
					<a
						href={`tel:${backendData.contactContent.phone}`}
						className="btn btn-link btn-footer btn-with-icon"
						style={{ marginRight: '3.125vw' }}
					>
						<img src={phoneFooter} alt="phone" />
						<span>{backendData.contactContent.phone}</span>
					</a>
					<a
						href={`mailto:${backendData.contactContent.email}`}
						className="btn btn-link btn-footer btn-with-icon"
						style={{ marginRight: '3.125vw' }}
					>
						<img src={emailFooter} alt="phone" />
						<span>{backendData.contactContent.email}</span>
					</a>
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

const TeamBlockMobile = ({ footerRef, backendData, lang }) => {
	const teamArrayLength = backendData.team.length || 0;
	const teamCountMax = Math.ceil(teamArrayLength / 2);
	let teamArrayToRender = [];
	for (let i = 0; i < teamCountMax; i++) {
		teamArrayToRender.push(backendData.team.slice(i * 2, (i + 1) * 2));
	}

	const [activeIndex, setActiveIndex] = useState(0);
	const lastIndex = teamCountMax - 1;

	useEffect(() => {
		if (activeIndex < 0) {
			setActiveIndex(lastIndex);
		}
		if (activeIndex > lastIndex) {
			setActiveIndex(0);
		}
	}, [activeIndex, lastIndex]);

	useEffect(() => {
		let slider = setInterval(() => {
			setActiveIndex(activeIndex + 1);
		}, 10000);
		return () => {
			clearInterval(slider);
		};
	}, [activeIndex]);

	const getPositionClass = (index) => {
		let position = 'next-slide';

		if (index === activeIndex - 1 || (activeIndex === 0 && index === lastIndex)) {
			position = 'last-slide';
		}

		if (index === activeIndex) {
			position = 'active-slide';
		}

		return position;
	};

	return (
		<div className="team-block" ref={footerRef}>
			<div className="head">
				<div className="title-block">
					<div className="title">Наша команда</div>
					<img src={teamBlockArt} alt="наша команда" />
				</div>
				<div className="team-members-block">
					<div className="team-members-wrap">
						<div className="team-members">
							{teamArrayToRender.map((arrayGroup, index) => {
								return (
									<div
										className={`team-group ${getPositionClass(index)}`}
										key={`team-group-${index}`}
									>
										{arrayGroup.map((member, mIndex) => {
											return (
												<div className="team-member" key={`team-member-${mIndex}`}>
													<img src={member.img} alt="member" />
													<div className="name">{member.name[lang]}</div>
													<div className="title">{member.title[lang]}</div>
												</div>
											);
										})}
									</div>
								);
							})}
						</div>
					</div>
					<div className="team-member-slider-control">
						<img
							src={teamControlBtn}
							alt="left"
							className="control to-left"
							onClick={() => setActiveIndex(activeIndex - 1)}
						/>
						<img
							src={teamControlBtn}
							alt="left"
							className="control to-right"
							onClick={() => setActiveIndex(activeIndex + 1)}
						/>
					</div>
				</div>
			</div>
			<div className="foot">
				<a
					href={`tel:${backendData.contactContent.phone}`}
					className="btn btn-link btn-footer address"
				>
					<img src={phoneFooter} alt="phone" />
					<span>{backendData.contactContent.phone}</span>
				</a>
				<a
					href={`mailto:${backendData.contactContent.email}`}
					className="btn btn-link btn-footer address"
				>
					<img src={emailFooter} alt="phone" />
					<span>{backendData.contactContent.email}</span>
				</a>
				<div className="address">
					<img src={locationIcnMobile} alt="location" />
					<span>{backendData.contactContent.address[lang]}</span>
				</div>
				<img src={logofooter} alt="logo" />
				<div className="social-links">
					<a
						href={backendData.contactContent.instagram}
						className="btn btn-link btn-footer"
					>
						<img src={instagramIcnMobile} alt="instagram" />
					</a>
					<a
						href={backendData.contactContent.facebook}
						className="btn btn-link btn-footer"
					>
						<img src={faceBookIcnMobile} alt="facebook" />
					</a>
				</div>
			</div>
		</div>
	);
};

const MediaBlock = ({ backendData, lang }) => {
	const [isScroll, setIsScroll] = useState(false);
	const [speed, setSpeed] = useState(5);
	const [posx, setPosx] = useState(0);
	const newsRef = useRef(null);
	const newsitemRef = useRef(null);

	useEffect(() => {
		if (newsitemRef.current) {
			const width = newsitemRef.current.offsetWidth;
			setSpeed(width * 0.0455);
		}
	}, [newsitemRef]);

	return (
		<div className="media-block">
			<div className="title">Медиа</div>
			<div
				className="news-wrap"
				ref={newsRef}
				onMouseDown={(e) => {
					setIsScroll(true);
				}}
				onMouseUp={(e) => {
					setIsScroll(false);
					setPosx(0);
				}}
				onMouseLeave={() => {
					setIsScroll(false);
				}}
				onMouseMove={(e) => {
					if (isScroll) {
						if (e.pageX > posx) {
							newsRef.current.scrollLeft -= speed;
						} else {
							newsRef.current.scrollLeft += speed;
						}
						setPosx(e.pageX);
					}
				}}
			>
				<div className="news">
					{backendData.media.map((n, i) => {
						let date = new Date(n.date);
						date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
						return (
							<div className="news-item" key={`news-${i}`} ref={newsitemRef}>
								<img src={n.img} alt={n.title[lang]} />
								<div className="date">{date}</div>
								<a href={n.link} target="_blank" rel="noreferrer" className="title">
									{n.title[lang]}
								</a>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
