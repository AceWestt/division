import React, { useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useAppContext } from '../appContext';

const Case = () => {
	const match = useRouteMatch();
	const { setIsFooterDisabled, lang, backendData } = useAppContext();
	const caseID = match.params.id;
	const currentCase = backendData.cases.cases.find((c) => c._id === caseID);
	useEffect(() => {
		setIsFooterDisabled(false);
	}, [setIsFooterDisabled]);
	return (
		<div className="section section-case">
			{currentCase.title && <div className="title">{currentCase.title[lang]}</div>}
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
		</div>
	);
};

export default Case;

const Block = ({ b, lang }) => {
	const { type, text = null, img = null, gallery = [], video = null } = b;

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
							{lang === 'ru'
								? text.textRu || ''
								: lang === 'en'
								? text.textEn || ''
								: text.textUz || ''}
						</p>
					</div>
				)}
			</div>
		);
	}
	return '';
};
