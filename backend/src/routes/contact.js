const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const validate = require('../middleware/validate');
const { createContactSchema } = require('../utils/validators');

router.post('/', validate(createContactSchema), contactController.createContact);

module.exports = router;
