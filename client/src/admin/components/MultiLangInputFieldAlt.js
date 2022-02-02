import React from 'react';
import { Form, InputGroup, Whisper, Tooltip, Input } from 'rsuite';
import PopoverInstructions from './PopoverInstructions';
import { Icon } from '@rsuite/icons';
import { FcInfo } from 'react-icons/fc';

const defaultStyle = {
	width: '100%',
};

const MultiLangInputFieldAlt = React.forwardRef((props, ref) => {
	const {
		styles,
		valRu,
		onChangeRu,
		valEn,
		onChangeEn,
		valUz,
		onChangeUz,
		label,
		ruerror,
		enerror,
		uzerror,
		popoverProps,
		textarea,
		multiText = 'ru/en',
		tooltipText = 'Значение на русском (слева) / значение на английском (справа)',
		multiTextSecondary = 'en/uz',
		tooltipTextSecondary = 'Значение на английском (слева) / значение на узбекском (справа)',
		disabled = false,
	} = props;
	const mergedStyles = { ...defaultStyle, styles };
	return (
		<Form.Group ref={ref} className={ruerror || enerror ? 'has-error' : ''}>
			<Form.ControlLabel>{label} </Form.ControlLabel>
			<InputGroup style={mergedStyles}>
				{textarea ? (
					<Input
						value={valRu}
						onChange={onChangeRu}
						as="textarea"
						rows={10}
						readOnly={disabled}
					/>
				) : (
					<Input value={valRu} onChange={onChangeRu} readOnly={disabled} />
				)}

				<InputGroup.Addon>
					<Whisper
						placement="auto"
						trigger="hover"
						speaker={<Tooltip>{tooltipText}</Tooltip>}
					>
						<span>{multiText}</span>
					</Whisper>
				</InputGroup.Addon>
				{textarea ? (
					<Input
						value={valEn}
						onChange={onChangeEn}
						as="textarea"
						rows={10}
						readOnly={disabled}
					/>
				) : (
					<Input value={valEn} onChange={onChangeEn} readOnly={disabled} />
				)}
				<InputGroup.Addon>
					<Whisper
						placement="auto"
						trigger="hover"
						speaker={<Tooltip>{tooltipTextSecondary}</Tooltip>}
					>
						<span>{multiTextSecondary}</span>
					</Whisper>
				</InputGroup.Addon>
				{textarea ? (
					<Input
						value={valUz}
						onChange={onChangeUz}
						as="textarea"
						rows={10}
						readOnly={disabled}
					/>
				) : (
					<Input value={valUz} onChange={onChangeUz} readOnly={disabled} />
				)}

				<InputGroup.Addon>
					<PopoverInstructions {...popoverProps}>
						<div style={{ marginTop: '-3px' }}>
							<Icon as={FcInfo} />
						</div>
					</PopoverInstructions>
				</InputGroup.Addon>
			</InputGroup>
			{ruerror && (
				<Form.HelpText style={{ color: 'red' }}>{ruerror}</Form.HelpText>
			)}
			{enerror && (
				<Form.HelpText style={{ color: 'red' }}>{enerror}</Form.HelpText>
			)}
			{uzerror && (
				<Form.HelpText style={{ color: 'red' }}>{uzerror}</Form.HelpText>
			)}
		</Form.Group>
	);
});

export default MultiLangInputFieldAlt;
