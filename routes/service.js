const express = require('express');
const router = express.Router();

const {
	get,
	getAll,
	add,
	update,
	remove,
} = require('../controllers/servicecontroller');

const { protect } = require('../middleware/auth');

router.route('/').get(getAll);
router.route('/:id').get(get);
router.route('/').post(protect, add);
router.route('/:id').put(protect, update);
router.route('/:id').delete(protect, remove);

module.exports = router;
