import React, { useState } from 'react';
import { theme } from '../adminContext';
import {
	Message,
	Button,
	ButtonToolbar,
	Panel,
	IconButton,
	toaster,
} from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import axios from 'axios';
import { useAxiosGet } from '../../common/hooks/useAxiosGet';
import AddClient from '../components/clientScreenSub/drawers/AddClient';
import EditClient from '../components/clientScreenSub/drawers/EditClient';
import DeleteDialog from '../components/DeleteDialog';

const styles = {
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(10),
	},
	clients: {
		root: {
			with: '100%',
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(5),
		},
		panel: {
			width: '100%',
			display: 'flex',
			flexWrap: 'wrap',
			gap: theme.spacing(2.5),
		},
		clientRoot: {
			width: theme.spacing(30),
			height: theme.spacing(30),
			padding: theme.spacing(2.5),
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			overFlow: 'hidden',
			borderRadius: theme.spacing(1),
			border: '1px solid rgba(0, 0, 0, 0.3)',
			background: 'rgba(0, 0, 0, 0.05)',
			position: 'relative',
		},
		buttonToolBar: {
			position: 'absolute',
			top: theme.spacing(1),
			right: theme.spacing(1),
		},
	},
};

const Clients = () => {
	const [isAdding, setIsAdding] = useState(false);

	const [isEditing, setIsEditing] = useState(false);
	const [editedClient, setEditedClient] = useState(null);

	const [isDeleting, setIsDeleting] = useState(false);
	const [deletedId, setDeletedId] = useState(null);

	const messagePlacement = 'topCenter';

	const { data, fetchData } = useAxiosGet('/api/clients');

	const toastMessage = (type, msg) => {
		return (
			<Message type={type} duration={5000}>
				{msg}
			</Message>
		);
	};

	const handleDelete = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const res = await axios.delete(`/api/clients/${deletedId}`, config);
			if (res.data.status === 'success') {
				setIsDeleting(false);
				setDeletedId(null);
				fetchData();
				toaster.push(toastMessage('success', 'Клиент удален!'), {
					placement: messagePlacement,
				});
			}
		} catch (error) {
			if (error.response.data.error) {
				toaster.push(toastMessage('error', error.response.data.error), {
					placement: messagePlacement,
				});
			} else {
				toaster.push(toastMessage('error', 'Не удалось удалить клиента!'), {
					placement: messagePlacement,
				});
			}
		}
	};
	return (
		<div className="clients-screen" style={styles.root}>
			<ButtonToolbar>
				<Button
					appearance="primary"
					onClick={() => setIsAdding(true)}
					color="green"
				>
					Новый клиент
				</Button>
			</ButtonToolbar>
			{data && data.length > 0 && (
				<div style={styles.clients.root}>
					{data.map((row, rindex) => {
						let rowToRender;

						rowToRender = row;
						return (
							<Panel
								key={`group_${rindex}`}
								bordered
								collapsible
								header={`${rindex + 1} Строка`}
							>
								<div style={styles.clients.panel}>
									{rowToRender.length > 0
										? rowToRender.map((client, cindex) => {
												return (
													<div style={styles.clients.clientRoot} key={client._id}>
														<img
															src={client.logo}
															style={{ maxWidth: '100%', maxHeight: '100%' }}
															alt="client"
														/>
														<ButtonToolbar style={styles.clients.buttonToolBar}>
															<IconButton
																appearance="subtle"
																color="orange"
																size="xs"
																circle
																icon={<EditIcon />}
																onClick={() => {
																	setEditedClient(client);
																	setIsEditing(true);
																}}
															/>
															<IconButton
																appearance="subtle"
																color="red"
																size="xs"
																circle
																icon={<TrashIcon />}
																onClick={() => {
																	setDeletedId(client._id);
																	setIsDeleting(true);
																}}
															/>
														</ButtonToolbar>
													</div>
												);
										  })
										: 'пока нет клиентов тут'}
								</div>
							</Panel>
						);
					})}
				</div>
			)}
			<AddClient
				open={isAdding}
				fetchData={fetchData}
				onClose={() => {
					setIsAdding(false);
				}}
			/>
			<EditClient
				open={isEditing}
				fetchData={fetchData}
				client={editedClient}
				onClose={() => {
					setIsEditing(false);
					setEditedClient(null);
				}}
			/>
			<DeleteDialog
				open={isDeleting}
				warning="Удаленнего клиента нельзя восстановить!"
				onClose={() => {
					setIsDeleting(false);
					setDeletedId(false);
				}}
				onConfirm={handleDelete}
			/>
		</div>
	);
};

export default Clients;
