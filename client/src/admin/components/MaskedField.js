import React from 'react';
import MaskField from 'react-masked-field';
import { Form, InputGroup } from 'rsuite';
import PopoverInstructions from './PopoverInstructions';
import { Icon } from '@rsuite/icons';
import { FcInfo } from 'react-icons/fc';

const InputMask = React.forwardRef(({ onChange, ...rest }, ref) => (
	<MaskField
		inputRef={ref}
		className="rs-input"
		onChange={(event) => {
			onChange(event.target.value);
		}}
		{...rest}
	/>
));

const defaultStyles = {
	width: '100%',
};

const Field = React.forwardRef((props, ref) => {
	const {
		styles,
		name,
		message,
		label,
		accepter,
		error,
		popoverProps,
		...rest
	} = props;
	const mergedSytles = { ...defaultStyles, ...styles };
	return (
		<Form.Group ref={ref} className={error ? 'has-error' : ''}>
			<Form.ControlLabel>{label} </Form.ControlLabel>
			<InputGroup style={mergedSytles}>
				<Form.Control name={name} accepter={accepter} errorMessage="" {...rest} />
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

const MaskedField = ({
	name,
	label,
	error,
	popoverProps,
	fieldRef,
	mask,
	...rest
}) => {
	return (
		<Field
			name={name}
			label={label}
			mask={mask}
			accepter={InputMask}
			error={error}
			popoverProps={{ ...popoverProps }}
			{...rest}
		/>
	);
};

export default MaskedField;
