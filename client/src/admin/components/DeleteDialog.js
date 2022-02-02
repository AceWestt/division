import React from 'react';
import { Modal, Button } from 'rsuite';

const DeleteDialog = React.forwardRef((props, ref) => {
	const { open, onClose, onConfirm, warning } = props;
	return (
		<Modal size={'sm'} open={open} onClose={onClose} ref={ref}>
			<Modal.Header>
				<Modal.Title>Вы уверены?</Modal.Title>
			</Modal.Header>
			<Modal.Body>{warning}</Modal.Body>
			<Modal.Footer>
				<Button onClick={onConfirm} appearance="primary" color="red">
					Да уверен(а)
				</Button>
				<Button onClick={onClose} appearance="subtle">
					Отмена
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

export default DeleteDialog;
