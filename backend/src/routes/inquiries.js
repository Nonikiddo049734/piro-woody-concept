const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const validate = require('../middleware/validate');
const { createInquirySchema } = require('../utils/validators');

router.post('/', validate(createInquirySchema), inquiryController.createInquiry);

module.exports = router;
