import React from 'react';
import { Form, InputGroup, Whisper, Tooltip, Input } from 'rsuite';
import PopoverInstructions from './PopoverInstructions';
import { Icon } from '@rsuite/icons';
import { FcInfo } from 'react-icons/fc';

const defaultStyle = {
	width: '100%',
};

const Textarea = React.forwardRef((props, ref) => (
	<Input {...props} as="textarea" ref={ref} />
));

const MultiLangInputField = React.forwardRef((props, ref) => {
	const {
		styles,
		runame,
		enname,
		uzname = null,
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
	} = props;
	const mergedStyles = { ...defaultStyle, styles };
	return (
		<Form.Group ref={ref} className={ruerror || enerror ? 'has-error' : ''}>
			<Form.ControlLabel>{label} </Form.ControlLabel>
			<InputGroup style={mergedStyles}>
				{textarea ? (
					<Form.Control
						name={runame}
						errorMessage=""
						accepter={Textarea}
						rows={10}
					/>
				) : (
					<Form.Control name={runame} errorMessage="" />
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
					<Form.Control
						name={enname}
						errorMessage=""
						accepter={Textarea}
						rows={10}
					/>
				) : (
					<Form.Control name={enname} errorMessage="" />
				)}
				{uzname && (
					<>
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
							<Form.Control
								name={uzname}
								errorMessage=""
								accepter={Textarea}
								rows={10}
							/>
						) : (
							<Form.Control name={uzname} errorMessage="" />
						)}
					</>
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

export default MultiLangInputField;
