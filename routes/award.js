const express = require('express');
const router = express.Router();

const {
	getAwards,
	getAward,
	addAward,
	updateAward,
	deleteAward,
} = require('../controllers/awardcontroller');

const { protect } = require('../middleware/auth');

router.route('/').get(getAwards);
router.route('/:id').get(getAward);
router.route('/').post(protect, addAward);
router.route('/:id').put(protect, updateAward);
router.route('/:id').delete(protect, deleteAward);

module.exports = router;
