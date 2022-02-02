import React from 'react';
import { Form } from 'rsuite';

const FormWrapper = ({
	customClass = '',
	formRef,
	onChange,
	onCheck,
	model,
	formValue,
	fluid = true,
	onSubmit,
	children,
	readOnly = false,
}) => {
	return (
		<Form
			className={`form ${customClass}`}
			ref={formRef}
			onChange={onChange}
			onCheck={onCheck}
			model={model}
			formValue={formValue}
			fluid={fluid}
			onSubmit={onSubmit}
			readOnly={readOnly}
		>
			{children}
		</Form>
	);
};

export default FormWrapper;
