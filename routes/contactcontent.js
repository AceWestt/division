const express = require('express');

const router = express.Router();

const { get, update } = require('../controllers/contactcontentcontroller');

const { protect } = require('../middleware/auth');

router.route('/').get(get);
router.route('/:id').put(protect, update);

module.exports = router;
