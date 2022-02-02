const express = require('express');

const router = express.Router();

const {
	getCategories,
	getCategory,
	addCategory,
	updateCategory,
	deleteCategory,
	getCases,
	getCase,
	addCase,
	updateCase,
	deleteCase,
} = require('../controllers/casecontroller');

const { protect } = require('../middleware/auth');

router.route('/categories').get(getCategories);
router.route('/categories/:id').get(getCategory);
router.route('/categories').post(protect, addCategory);
router.route('/categories/:id').put(protect, updateCategory);
router.route('/categories/:id').delete(protect, deleteCategory);

router.route('/cases/:id').get(getCases);
router.route('/case/:id').get(getCase);
router.route('/cases/:id').post(protect, addCase);
router.route('/cases/:id').put(protect, updateCase);
router.route('/cases/:id').delete(protect, deleteCase);

module.exports = router;
