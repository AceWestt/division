import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAxiosGet = (url) => {
	const [success, setSuccess] = useState(false);
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	const fetchData = useCallback(async () => {
		const config = { headers: { 'Content-Type': 'application/json' } };
		try {
			const { data } = await axios.get(url, config);
			setData(data.data);
			setSuccess(true);
			setError(null);
		} catch (error) {
			setSuccess(false);
			setError(error);
		}
	}, [url]);

	useEffect(() => {
		fetchData();
	}, [url, fetchData]);

	return { success, data, error, fetchData };
};
