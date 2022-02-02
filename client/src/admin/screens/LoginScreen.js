import React, { useEffect, useRef, useState } from 'react';
import {
	Container,
	Header,
	Navbar,
	Content,
	FlexboxGrid,
	Panel,
	Form,
	Schema,
	InputGroup,
	ButtonToolbar,
	Button,
	Footer,
	Message,
	toaster,
} from 'rsuite';
import { BsEyeSlash, BsEye } from 'react-icons/bs';
import axios from 'axios';

const LoginScreen = ({ history }) => {
	useEffect(() => {
		if (localStorage.getItem('authToken')) {
			history.push('/admin');
		}
	}, [history]);

	const model = Schema.Model({
		username: Schema.Types.StringType().isRequired('Введите логин.'),
		password: Schema.Types.StringType().isRequired('Введите пароль.'),
	});

	const formRef = useRef(null);
	const [formError, setFormError] = useState({});
	const [formValue, setFormValue] = useState({});
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const errorMessage = (error) => {
		return (
			<Message showIcon type="error">
				{error}
			</Message>
		);
	};
	const messagePlacement = 'topCenter';

	const onSubmit = async () => {
		if (formRef.current.check()) {
			const config = {
				header: {
					'Content-Type': 'application/json',
				},
			};
			try {
				const { data } = await axios.post('/api/auth/login', formValue, config);

				localStorage.setItem('authToken', data.token);
				history.push('/admin');
			} catch (error) {
				if (error.response.data.error) {
					toaster.push(errorMessage(error.response.data.error), {
						placement: messagePlacement,
					});
				} else {
					toaster.push(errorMessage('Не удалось авторизоваться!'), {
						placement: messagePlacement,
					});
				}
			}
		}
	};

	return (
		<div className="screen login-screen">
			<Container>
				<Header>
					<Navbar appearance="inverse">
						<Navbar.Brand href="/" target="_blank">
							Havvogroup
						</Navbar.Brand>
					</Navbar>
				</Header>
				<Content>
					<FlexboxGrid justify="center" align="middle" style={{ height: '100%' }}>
						<FlexboxGrid.Item colspan={12}>
							<Panel header={<h3>Login</h3>} bordered>
								<Form
									className="form login-form"
									ref={formRef}
									onChange={setFormValue}
									onCheck={setFormError}
									model={model}
									fluid
									onSubmit={onSubmit}
								>
									<Form.Group>
										<Form.ControlLabel>Логин</Form.ControlLabel>
										<Form.Control name="username" errorMessage={''} />
										{formError.username && (
											<Form.HelpText style={{ color: 'red' }}>
												{formError.username}
											</Form.HelpText>
										)}
									</Form.Group>
									<Form.Group>
										<Form.ControlLabel>Пароль</Form.ControlLabel>
										<InputGroup inside style={{ width: '100%' }}>
											<Form.Control
												name="password"
												type={isPasswordVisible ? 'text' : 'password'}
												autoComplete="off"
												errorMessage=""
											/>
											<InputGroup.Button
												onClick={() => setIsPasswordVisible(!isPasswordVisible)}
											>
												{isPasswordVisible ? <BsEye /> : <BsEyeSlash />}
											</InputGroup.Button>
										</InputGroup>

										{formError.password && (
											<Form.HelpText style={{ color: 'red' }}>
												{formError.password}
											</Form.HelpText>
										)}
									</Form.Group>
									<Form.Group>
										<ButtonToolbar>
											<Button appearance="primary" type="submit">
												Войти
											</Button>
										</ButtonToolbar>
									</Form.Group>
								</Form>
							</Panel>
						</FlexboxGrid.Item>
					</FlexboxGrid>
				</Content>
				<Footer>the Division</Footer>
			</Container>
		</div>
	);
};

export default LoginScreen;
