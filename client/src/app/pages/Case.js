import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { cases } from './home/sampleCases';

const Case = () => {
	const match = useRouteMatch();
	const caseID = match.params.id;
	const currentCase = cases[caseID - 1];
	return (
		<div className="section section-case">
			{currentCase.title && <div className="title">{currentCase.title}</div>}
			{currentCase.subtitle && (
				<div className="subtitle">{currentCase.subtitle}</div>
			)}
			{currentCase.blocks && currentCase.blocks.length > 0 && (
				<div className="blocks">
					{currentCase.blocks.map((b, index) => {
						return <Block b={b} key={`case-block-${index}`} />;
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

const Block = ({ b }) => {
	const {
		type,
		label = '',
		text = '',
		img = null,
		gallery = [],
		video = null,
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
					src={video}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			</div>
		);
	}
	if (type === 'text' && (label || text)) {
		return (
			<div className="block block-text">
				{label && <label>{label}</label>}{' '}
				{text && (
					<div className="text">
						<p>{text}</p>
					</div>
				)}
			</div>
		);
	}
	return '';
};
