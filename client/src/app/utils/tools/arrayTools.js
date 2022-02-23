export const getFilteredCases = (array, activeCat) => {
	if (Array.isArray(array) && array.length > 0) {
		return array.filter((item) => {
			if (activeCat.id === '-1') {
				return true;
			}
			if (activeCat.id === item.category_id) {
				return true;
			}
			return false;
		});
	}
	return [];
};
