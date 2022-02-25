import React from 'react';
import { Form, Uploader, IconButton } from 'rsuite';
import { Icon } from '@rsuite/icons';
import TrashIcon from '@rsuite/icons/Trash';
import { FcInfo } from 'react-icons/fc';
import PopoverInstructions from './PopoverInstructions';
import { theme } from '../adminContext';

const oldImgStyles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'column',
	},
	span: {
		fontSize: theme.spacing(3),
		fontWeight: '700',
		marginBottom: theme.spacing(2),
	},
	img: {
		width: theme.spacing(37.5),
		height: theme.spacing(25),
		borderRadius: theme.spacing(1),
		border: `2px solid ${theme.colors.mainBg}`,
		background: theme.colors.mainBg,
	},
};

const oldGalleryStyles = {
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		flexDirection: 'column',
	},
	span: {
		fontSize: theme.spacing(3),
		fontWeight: '700',
		marginBottom: theme.spacing(2),
	},
	gallery: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: '10px',
	},
	imgWrap: {
		width: theme.spacing(37.5),
		height: theme.spacing(25),
		borderRadius: theme.spacing(1),
		border: `2px solid ${theme.colors.mainBg}`,
		background: theme.colors.mainBg,
		overflow: 'hidden',
		position: 'relative',
	},
	button: {
		position: 'absolute',
		top: 4,
		right: 4,
	},
};

const FileUploaderAlt = React.forwardRef(
	(
		{
			label,
			accept = 'image/*',
			onChange,
			oldImg = null,
			oldGallery = [],
			oldVid = null,
			onGalleryDeleteClick = () => {},
			listType = 'picture',
			disabled = false,
			errExt = null,
			errSize = null,
			popoverProps,
		},
		ref
	) => {
		return (
			<Form.Group ref={ref} style={{ display: 'flex', flexDirection: 'column' }}>
				<Form.ControlLabel>{label}</Form.ControlLabel>
				{oldImg && (
					<div style={oldImgStyles.root}>
						<span style={oldImgStyles.span}>Текущее изображение: </span>
						<img
							style={{ ...oldImgStyles.img, opacity: disabled ? 0.5 : 1 }}
							src={oldImg}
							alt="old"
						/>
					</div>
				)}
				{oldImg && <span style={oldImgStyles.span}>Новое изображение: </span>}
				{oldVid && (
					<div style={oldImgStyles.root}>
						<span style={oldImgStyles.span}>Текущее видео: </span>
						<video
							autoPlay
							muted
							loop
							style={{ ...oldImgStyles.img, opacity: disabled ? 0.5 : 1 }}
						>
							<source src={oldVid} />
							your browser does not support the video tag
						</video>
					</div>
				)}
				{oldGallery && oldGallery.length > 0 && (
					<div style={oldGalleryStyles.root}>
						<span style={oldGalleryStyles.span}>Текущая галлерея</span>
						<div style={oldGalleryStyles.gallery}>
							{oldGallery.map((img, index) => {
								return (
									<div style={oldGalleryStyles.imgWrap} key={index}>
										<img
											src={img}
											style={{ width: '100%', height: '100%', objectFit: 'cover' }}
											alt="oldimg"
										/>
										<IconButton
											appearance="subtle"
											color="red"
											style={oldGalleryStyles.button}
											size="xs"
											circle
											icon={<TrashIcon />}
											onClick={() => onGalleryDeleteClick(index)}
											disabled={disabled}
										/>
									</div>
								);
							})}
						</div>
					</div>
				)}
				<Uploader
					accept={accept}
					autoUpload={false}
					listType={listType}
					disabled={disabled}
					onChange={onChange}
					action="#"
				>
					<span
						style={{
							display: disabled ? 'none' : 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: `0 16px`,
							width: theme.spacing(37.5),
						}}
					>
						Загрузить
						<PopoverInstructions {...popoverProps}>
							<div style={{ marginTop: '-3px' }}>
								<Icon as={FcInfo} style={{ marginLeft: '10px' }} />
							</div>
						</PopoverInstructions>
					</span>
				</Uploader>
				{errExt && <Form.HelpText style={{ color: 'red' }}>{errExt}</Form.HelpText>}
				{errSize && (
					<Form.HelpText style={{ color: 'red' }}>{errSize}</Form.HelpText>
				)}
			</Form.Group>
		);
	}
);

export default FileUploaderAlt;
