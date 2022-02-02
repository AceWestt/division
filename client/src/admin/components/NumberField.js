import React from 'react';
import { Form, InputGroup, InputNumber } from 'rsuite';
import PopoverInstructions from './PopoverInstructions';
import { Icon } from '@rsuite/icons';
import { FcInfo } from 'react-icons/fc';

const defaultStyle = {};

const NumberField = React.forwardRef((props, ref) => {
	const { styles, name, label, error, min, popoverProps } = props;
	const mergedStyles = { ...defaultStyle, styles };
	return (
		<Form.Group ref={ref} className={error ? 'has-error' : ''}>
			<Form.ControlLabel>{label} </Form.ControlLabel>
			<InputGroup style={mergedStyles}>
				<Form.Control
					name={name}
					errorMessage=""
					style={{
						width: '100%',
						borderBottomLeftRadius: '6px',
						borderTopLeftRadius: '6px',
					}}
					min={min}
					accepter={InputNumber}
				/>

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

export default NumberField;
