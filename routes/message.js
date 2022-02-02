const express = require('express');

const router = express.Router();

const { getall, add, deleteMessage } = require('../controllers/message');

const { protect } = require('../middleware/auth');

router.route('/').get(protect, getall);
router.route('/').post(add);
router.route('/:id').delete(protect, deleteMessage);

module.exports = router;
