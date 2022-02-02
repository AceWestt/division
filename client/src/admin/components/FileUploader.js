import React from 'react';
import { Form, Uploader } from 'rsuite';
import { Icon } from '@rsuite/icons';
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
		objectFit: 'cover',
	},
};

const FileUploader = React.forwardRef(
	(
		{
			label,
			accept = 'image/*',
			oldImg = null,
			name,
			listType = 'picture',
			disabled = false,
			errExt = null,
			errSize = null,
			popoverProps,
		},
		ref
	) => {
		return (
			<Form.Group ref={ref}>
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
				<Form.Control
					accept={accept}
					name={name}
					accepter={Uploader}
					autoUpload={false}
					listType={listType}
					disabled={disabled}
					errorMessage=""
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
				</Form.Control>
				{errExt && <Form.HelpText style={{ color: 'red' }}>{errExt}</Form.HelpText>}
				{errSize && (
					<Form.HelpText style={{ color: 'red' }}>{errSize}</Form.HelpText>
				)}
			</Form.Group>
		);
	}
);

export default FileUploader;
