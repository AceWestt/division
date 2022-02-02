import React, { useState } from 'react';
import { theme } from '../adminContext';
import { Button, ButtonToolbar, Message, Table, toaster } from 'rsuite';
import AddAward from '../components/awardsScreenSub/drawers/AddAward';
import DeleteDialog from '../components/DeleteDialog';
import { useAxiosGet } from '../../common/hooks/useAxiosGet';
import axios from 'axios';
import EditAward from '../components/awardsScreenSub/drawers/EditAward';

const styles = {
	root: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(10),
	},
};

const Awards = () => {
	const [isAdding, setIsAdding] = useState(false);

	const [isEditing, setIsEditing] = useState(false);
	const [editedAward, setEditedAward] = useState(null);

	const [isDeleting, setIsDeleting] = useState(false);
	const [deletedId, setDeletedId] = useState(false);

	const messagePlacement = 'topCenter';

	const { data, success, fetchData } = useAxiosGet('/api/award');

	const toastMessage = (type, msg) => {
		return (
			<Message type={type} duration={5000}>
				{msg}
			</Message>
		);
	};

	const handleEdit = (value) => {
		setEditedAward(value);
		setIsEditing(true);
	};

	const handleDelete = async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const res = await axios.delete(`/api/award/${deletedId}`, config);
			if (res.data.status === 'success') {
				setIsDeleting(false);
				setDeletedId(null);
				fetchData();
				toaster.push(toastMessage('success', 'Награда удалена!'), {
					placement: messagePlacement,
				});
			}
		} catch (error) {
			if (error.response.data.error) {
				toaster.push(toastMessage('error', error.response.data.error), {
					placement: messagePlacement,
				});
			} else {
				toaster.push(toastMessage('error', 'Не удалось удалить награду!'), {
					placement: messagePlacement,
				});
			}
		}
	};
	return (
		<div className="awards-screen" style={styles.root}>
			<ButtonToolbar>
				<Button
					appearance="primary"
					onClick={() => setIsAdding(true)}
					color="green"
				>
					Новая награда
				</Button>
			</ButtonToolbar>
			{data && data.length > 0 && (
				<Table
					data={data}
					bordered
					hover={false}
					loading={!success}
					autoHeight
					cellBordered
				>
					<Table.Column width={100} align="center" fixed>
						<Table.HeaderCell>Лого/изображение</Table.HeaderCell>
						<ImageCell dataKey="logo" />
					</Table.Column>
					<Table.Column flexGrow={1} align="center">
						<Table.HeaderCell>Название</Table.HeaderCell>
						<Table.Cell style={{ textTransform: 'uppercase' }} dataKey="name" />
					</Table.Column>

					<Table.Column width={200} fixed="right">
						<Table.HeaderCell>Управление</Table.HeaderCell>

						<ControlCell
							onEditClick={handleEdit}
							onRemoveClick={(id) => {
								setDeletedId(id);
								setIsDeleting(true);
							}}
						/>
					</Table.Column>
				</Table>
			)}
			<AddAward
				open={isAdding}
				fetchData={fetchData}
				onClose={() => {
					setIsAdding(false);
				}}
			/>
			<EditAward
				open={isEditing}
				fetchData={fetchData}
				award={editedAward}
				onClose={() => {
					setIsEditing(false);
					setEditedAward(null);
				}}
			/>
			<DeleteDialog
				open={isDeleting}
				warning="Удаленную награду нельзя восстановить!"
				onClose={() => {
					setIsDeleting(false);
					setDeletedId(false);
				}}
				onConfirm={handleDelete}
			/>
		</div>
	);
};

const ControlCell = ({ rowData, onEditClick, onRemoveClick, ...props }) => {
	return (
		<Table.Cell {...props} style={{ padding: `${theme.spacing(2)} 0` }}>
			<ButtonToolbar>
				<Button
					size="sm"
					appearance="link"
					color="orange"
					onClick={() => onEditClick(rowData)}
				>
					Редактировать
				</Button>
				<Button
					size="sm"
					appearance="link"
					color="red"
					onClick={() => onRemoveClick(rowData._id)}
				>
					Удалить
				</Button>
			</ButtonToolbar>
		</Table.Cell>
	);
};

const ImageCell = ({ rowData, dataKey, ...props }) => {
	const img = rowData[dataKey];
	return (
		<Table.Cell
			{...props}
			style={{
				padding: `${theme.spacing(1)} ${theme.spacing(2.5)}`,
				alignItems: 'center',
				display: 'flex',
			}}
		>
			{img ? (
				<img
					style={{ height: '100%', width: '100%', objectFit: 'contain' }}
					src={rowData[dataKey]}
					alt="preview"
				/>
			) : (
				'No preview'
			)}
		</Table.Cell>
	);
};

export default Awards;
