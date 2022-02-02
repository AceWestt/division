const express = require('express');
const router = express.Router();

const { initsuperadmin, login, ifAuthorized } = require('../controllers/auth');

const { protect } = require('../middleware/auth');

router.route('/initsuperadmin').get(initsuperadmin);

router.route('/login').post(login);
router.route('/checkauthorization').get(protect, ifAuthorized);

module.exports = router;
