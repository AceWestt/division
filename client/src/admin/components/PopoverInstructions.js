import React from 'react';
import { Popover, Whisper, Button } from 'rsuite';
import { theme } from '../adminContext';

const PopoverInstructions = ({
	placement = 'auto',
	trigger = 'hover',
	title = 'Инструкция',
	text = '',
	img = null,
	children,
}) => {
	const speaker = (
		<Popover title={title} style={{ maxWidth: '300px' }}>
			{text && <p style={{ marginBottom: theme.spacing(3) }}>{text}</p>}
			{img && <img src={img} alt="instructions" style={{ width: '100%' }} />}
		</Popover>
	);
	return (
		<Whisper placement={placement} trigger={trigger} speaker={speaker}>
			{children ? children : <Button>Наведи на меня</Button>}
		</Whisper>
	);
};

export default PopoverInstructions;
