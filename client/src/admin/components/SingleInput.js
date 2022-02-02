import React from 'react';
import { Form, InputGroup, Input } from 'rsuite';
import PopoverInstructions from './PopoverInstructions';
import { Icon } from '@rsuite/icons';
import { FcInfo } from 'react-icons/fc';

const defaultStyle = {
	width: '100%',
};

const Textarea = React.forwardRef((props, ref) => (
	<Input {...props} as="textarea" ref={ref} />
));

const SingleInput = React.forwardRef((props, ref) => {
	const { styles, name, label, error, popoverProps, textarea } = props;
	const mergedStyles = { ...defaultStyle, styles };
	return (
		<Form.Group ref={ref} className={error ? 'has-error' : ''}>
			<Form.ControlLabel>{label} </Form.ControlLabel>
			<InputGroup style={mergedStyles}>
				{textarea ? (
					<Form.Control name={name} errorMessage="" accepter={Textarea} rows={10} />
				) : (
					<Form.Control name={name} errorMessage="" />
				)}

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

export default SingleInput;
