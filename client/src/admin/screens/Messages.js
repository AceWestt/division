import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Message, toaster, List, FlexboxGrid, Button } from 'rsuite';

const styles = {
	root: {},
};

const Messages = () => {
	const [messages, setMessages] = useState([]);

	const toastMessage = (type, msg) => {
		return <Message type={type}>{msg}</Message>;
	};

	const fetchMessages = useCallback(async () => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const { data } = await axios.get('/api/message', config);
			setMessages(data.data);
		} catch (error) {
			if (error.response?.data.error) {
				toaster.push(toastMessage('error', error.response.data.error), {
					placement: 'topCenter',
				});
			} else {
				toaster.push(toastMessage('error', error.response.data.error));
			}
		}
	}, []);

	const deleteMessage = async (id) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
			},
		};
		try {
			const { data } = await axios.delete(`/api/message/${id}`, config);
			if (data.status === 'success') {
				toaster.push(toastMessage('success', 'Удалено'));
				fetchMessages();
			}
		} catch (error) {
			if (error.response?.data.error) {
				toaster.push(toastMessage('error', error.response.data.error), {
					placement: 'topCenter',
				});
			} else {
				toaster.push(toastMessage('error', error.response.data.error));
			}
		}
	};

	useEffect(() => {
		fetchMessages();
	}, [fetchMessages]);

	return (
		<div style={styles.root}>
			{messages && messages.length > 0 ? (
				<List hover>
					<List.Item>
						<FlexboxGrid align="middle">
							<FlexboxGrid.Item colspan={3}>
								<h5>Имя</h5>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={3}>
								<h5>Телефон</h5>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={6}>
								<h5>Email</h5>
							</FlexboxGrid.Item>

							<FlexboxGrid.Item colspan={8}>
								<h5>Сообщение</h5>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={2}>
								<h5>Дата</h5>
							</FlexboxGrid.Item>
							<FlexboxGrid.Item colspan={2}>
								<h5>Контроль</h5>
							</FlexboxGrid.Item>
						</FlexboxGrid>
					</List.Item>
					{messages.map((m, i) => {
						let date = new Date(m.created);
						date = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
						return (
							<List.Item key={`message-${m._id}`} index={i}>
								<FlexboxGrid align="middle">
									<FlexboxGrid.Item colspan={3}>{m.name}</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={3}>{m.phone}</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={6}>{m.email}</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={8}>{m.message}</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={2}>{date}</FlexboxGrid.Item>
									<FlexboxGrid.Item colspan={2}>
										<Button
											color="red"
											appearance="subtle"
											onClick={() => deleteMessage(m._id)}
										>
											удалить
										</Button>
									</FlexboxGrid.Item>
								</FlexboxGrid>
							</List.Item>
						);
					})}
				</List>
			) : (
				<h5>Пока сообщений нет</h5>
			)}
		</div>
	);
};

export default Messages;
