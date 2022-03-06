import React, { useState } from 'react';
import { Input, Toggle, Button } from 'rsuite';

const styles = {
	root: {
		width: '100%',
		display: 'flex',
		margin: '20px 0',
		flexDirection: 'column',
		padding: '20px',
		background: 'rgba(15, 183, 255,0.15)',
		borderRadius: '4px',
		border: '1px solid rgba(15, 183, 255,1)',
		gap: '20px',
	},
	inputWrap: {
		display: 'flex',
		flexDirection: 'column',
		// alignItems: 'center',
		gap: '10px',
	},
};

const LinkGenerator = () => {
	const [text, setText] = useState('');
	const [url, setUrl] = useState('');
	const [isBlank, setIsBlank] = useState(false);
	return (
		<div style={styles.root}>
			<div style={{ width: '100%', display: 'flex', gap: '20px' }}>
				<div style={styles.inputWrap}>
					<label>Отображаемый текст</label>
					<Input value={text} onChange={(value) => setText(value)} />
				</div>
				<div style={styles.inputWrap}>
					<label>Ссылка</label>
					<Input value={url} onChange={(value) => setUrl(value)} />
				</div>
				<div style={styles.inputWrap}>
					<label>Открывать на новой вкладке?</label>
					<Toggle checked={isBlank} onChange={(value) => setIsBlank(value)} />
				</div>
			</div>
			<code
				style={{
					padding: '10px',
					border: '1px solid #11698f',
					borderRadius: '4px',
					color: '#11698f',
					fontWeight: '700',
				}}
			>
				{`<a href="${url}" target="${isBlank ? '_blank' : '_self'}">${text}</a>`}
				<Button
					appearance="primary"
					color="green"
					style={{ display: 'inline', marginLeft: '10px' }}
					onClick={() => {
						navigator.clipboard.writeText(
							`<a href="${url}" target="${isBlank ? '_blank' : '_self'}">${text}</a>`
						);
					}}
				>
					copy
				</Button>
			</code>
		</div>
	);
};

export default LinkGenerator;
