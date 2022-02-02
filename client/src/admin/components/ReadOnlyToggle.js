import React from 'react';
import { Form, Toggle } from 'rsuite';

const ReadOnlyToggle = ({
	checked = null,
	loading = false,
	disabled = false,
	onChange,
}) => {
	return (
		<Form.Group>
			<Toggle
				size="lg"
				checkedChildren="Редактирование включено"
				unCheckedChildren="Редактирование отключено"
				checked={checked}
				loading={loading}
				disabled={disabled}
				onChange={onChange}
			/>
		</Form.Group>
	);
};

export default ReadOnlyToggle;
