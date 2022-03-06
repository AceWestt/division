import React, { useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useAppContext } from '../appContext';
import parse from 'html-react-parser';
import OnImagesLoaded from 'react-on-images-loaded';

const Case = () => {
	const match = useRouteMatch();
	const { setIsFooterDisabled, lang, backendData, setIsScreenReady } =
		useAppContext();
	const caseID = match.params.id;
	const currentCase = backendData.cases.cases.find((c) => c._id === caseID);
	useEffect(() => {
		setIsFooterDisabled(false);
	}, [setIsFooterDisabled]);
	useEffect(() => {
		setIsScreenReady(false);
	}, [setIsScreenReady]);
	return (
		<div className="section section-case">
			<OnImagesLoaded
				onLoaded={() => setIsScreenReady(true)}
				onTimeout={() => setIsScreenReady(true)}
				timeout={7000}
			>
				{currentCase.title && (
					<div className="title">{currentCase.title[lang]}</div>
				)}
				{currentCase.subtitle && (
					<div className="subtitle">{currentCase.subtitle[lang]}</div>
				)}
				{currentCase.blocks && currentCase.blocks.length > 0 && (
					<div className="blocks">
						{currentCase.blocks.map((b, index) => {
							return <Block b={b} key={`case-block-${index}`} lang={lang} />;
						})}
					</div>
				)}

				<div className="btn-holder">
					<Link to="/cases" className="btn btn-primary btn-outlined">
						Все кейсы
					</Link>
				</div>
			</OnImagesLoaded>
		</div>
	);
};

export default Case;

const Block = ({ b, lang }) => {
	const {
		type,
		text = null,
		img = null,
		gallery = [],
		video = null,
		src = null,
	} = b;

	if (type === 'img' && img) {
		return (
			<div className="block block-img">
				<img src={img} alt="img" />
			</div>
		);
	}
	if (type === 'gallery' && gallery.length > 0) {
		return (
			<div className="block block-gallery">
				<div className="imgs">
					{gallery.map((gimg, index) => {
						return <img src={gimg} alt="img" key={`gallery-img-${index}`} />;
					})}
				</div>
			</div>
		);
	}
	if (type === 'video' && video) {
		return (
			<div className="block block-video">
				<iframe
					src={video.url}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			</div>
		);
	}
	if (type === 'text' && text) {
		return (
			<div className="block block-text">
				<label>
					{lang === 'ru'
						? text.labelRu || ''
						: lang === 'en'
						? text.labelEn || ''
						: text.labelUz || ''}
				</label>
				{text && (
					<div className="text">
						<p>
							{parse(
								lang === 'ru'
									? text.textRu || ''
									: lang === 'en'
									? text.textEn || ''
									: text.textUz || ''
							)}
						</p>
					</div>
				)}
			</div>
		);
	}
	if (type === 'uploadedVideo' && src) {
		return (
			<div className="block block-uploaded-video">
				<video autoPlay muted loop>
					<source src={src} />
					your browser does not support the video tag
				</video>
			</div>
		);
	}
	return '';
};
