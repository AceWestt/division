import React from 'react';
import { Form, InputGroup, Input } from 'rsuite';
import PopoverInstructions from './PopoverInstructions';
import { Icon } from '@rsuite/icons';
import { FcInfo } from 'react-icons/fc';

const defaultStyle = {
	width: '100%',
};

const SingleInputAlt = React.forwardRef((props, ref) => {
	const {
		styles,
		val,
		onChange,
		label,
		error,
		popoverProps,
		disabled = false,
	} = props;
	const mergedStyles = { ...defaultStyle, styles };
	return (
		<Form.Group ref={ref} className={error ? 'has-error' : ''}>
			<Form.ControlLabel>{label} </Form.ControlLabel>
			<InputGroup style={mergedStyles}>
				<Input value={val} onChange={onChange} readOnly={disabled} />
				<InputGroup.Addon>
					<PopoverInstructions {...popoverProps}>
						<div style={{ marginTop: '-3px' }}>
							<Icon as={FcInfo} />
						</div>
					</PopoverInstructions>
				</InputGroup.Addon>
			</InputGroup>
			{error && <Form.HelpText style={{ color: 'red' }}>{error}</Form.HelpText>}
		</Form.Group>
	);
});

export default SingleInputAlt;
