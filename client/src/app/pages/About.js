import React, { useEffect, useRef, useState } from 'react';
import PageTitleHolder from '../compontents/PageTitleHolder';
import titleImg from '../images/page-title-about.svg';
import hero1 from '../images/hero-1-about.png';
import hero2 from '../images/hero-2-about.png';
import hero3 from '../images/hero-3-about.png';
import hero4 from '../images/hero-4-about.png';
import sloganImg from '../images/slogan-img.png';
import teamBlockArt from '../images/team-block-art-about.svg';
import teamControlBtn from '../images/team-control-about.svg';
import { newsItems } from './about/sampleNews';
import { useAppContext } from '../appContext';
import { teamMembers } from './about/sampleTeamMembers';
import logofooter from '../images/footer-logo.svg';
import locationIcnMobile from '../images/location-about-mobile.svg';
import faceBookIcnMobile from '../images/facebook-icn-about-mobile.svg';
import instagramIcnMobile from '../images/instagram-icn-about-mobile.svg';

const About = () => {
	const { smallScreen, setIsFooterDisabled } = useAppContext();

	useEffect(() => {
		setIsFooterDisabled(true);
	}, [setIsFooterDisabled]);

	return (
		<div className="section section-about">
			<PageTitleHolder title={titleImg} />
			<div className="description">
				<span>Division Marketing Agency</span> — мы превратили свою работу в
				настоящую страсть. Наша история началась летом 2018 года. Тогда наша команда
				состояла только из трех человек, а сегодня нас уже больше 25-ти.
			</div>
			<div className="hero-imgs">
				<img src={hero1} alt="heroimg" />
				<img src={hero2} alt="heroimg" />
				<img src={hero3} alt="heroimg" />
				<img src={hero4} alt="heroimg" />
			</div>
			<div className="short-text">
				Наше главное преимущество — нестандартное решение задач любой сложности.
			</div>
			<div className="slogan-wrap">
				<span>Мы полны энергии и всегда готовы к новым вызовам!</span>
				<img src={sloganImg} alt="img" />
			</div>
			<MediaBlock />
			{smallScreen ? <TeamBlockMobile /> : <TeamBlock />}
		</div>
	);
};

export default About;

const TeamBlock = () => {
	const teamArrayLength = teamMembers.length;
	const teamCountMax = Math.ceil(teamArrayLength / 10);
	let teamArrayToRender = [];
	for (let i = 0; i < teamCountMax; i++) {
		teamArrayToRender.push(teamMembers.slice(i * 10, (i + 1) * 10));
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
		if (index === activeIndex) {
			position = 'active-slide';
		}
		if (index === activeIndex - 1 || (activeIndex === 0 && index === lastIndex)) {
			position = 'last-slide';
		}
		return position;
	};

	return (
		<div className="team-block">
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
													<div className="name">{member.name}</div>
													<div className="title">{member.title}</div>
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
					<a href="https://www.instagram.com/" className="btn btn-link btn-footer">
						Instagram,
					</a>
					<a href="https://www.facebook.com/" className="btn btn-link btn-footer">
						Facebook
					</a>
				</div>
				<div className="address">г. Ташкент улица Тадбиркор 78</div>
			</div>
		</div>
	);
};

const TeamBlockMobile = () => {
	const teamArrayLength = teamMembers.length;
	const teamCountMax = Math.ceil(teamArrayLength / 2);
	let teamArrayToRender = [];
	for (let i = 0; i < teamCountMax; i++) {
		teamArrayToRender.push(teamMembers.slice(i * 2, (i + 1) * 2));
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
		if (index === activeIndex) {
			position = 'active-slide';
		}
		if (index === activeIndex - 1 || (activeIndex === 0 && index === lastIndex)) {
			position = 'last-slide';
		}
		return position;
	};

	return (
		<div className="team-block">
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
													<div className="name">{member.name}</div>
													<div className="title">{member.title}</div>
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
				<div className="address">
					<img src={locationIcnMobile} alt="location" />
					<span>г. Ташкент улица Тадбиркор 78</span>
				</div>
				<img src={logofooter} alt="logo" />
				<div className="social-links">
					<a href="https://www.instagram.com/" className="btn btn-link btn-footer">
						<img src={instagramIcnMobile} alt="instagram" />
					</a>
					<a href="https://www.facebook.com/" className="btn btn-link btn-footer">
						<img src={faceBookIcnMobile} alt="facebook" />
					</a>
				</div>
			</div>
		</div>
	);
};

const MediaBlock = () => {
	const [isScroll, setIsScroll] = useState(false);
	const [speed, setSpeed] = useState(5);
	const [posx, setPosx] = useState(0);
	const newsRef = useRef(null);

	useEffect(() => {
		const width = newsRef.current.offsetWidth;
		setSpeed(width * 0.005);
	}, []);

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
					{newsItems.map((n, i) => {
						return (
							<div
								href={n.url}
								target="_blank"
								rel="noreferrer"
								className="news-item"
								key={`news-${i}`}
							>
								<img src={n.img} alt={n.title} />
								<div className="date">{n.date}</div>
								<a href={n.url} target="_blank" rel="noreferrer" className="title">
									{n.title}
								</a>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
