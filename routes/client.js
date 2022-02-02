const express = require('express');
const router = express.Router();

const {
	getClients,
	getClient,
	addClient,
	updateClient,
	deleteClient,
} = require('../controllers/clientcontroller');

const { protect } = require('../middleware/auth');

router.route('/').get(getClients);
router.route('/:id').get(getClient);
router.route('/').post(protect, addClient);
router.route('/:id').put(protect, updateClient);
router.route('/:id').delete(protect, deleteClient);

module.exports = router;
