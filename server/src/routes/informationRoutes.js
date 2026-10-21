const express = require('express');
const informationController = require('../controllers/informationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/information', informationController.listInformation);
router.get('/information/:id', informationController.getInformation);
router.get('/faqs', informationController.listFaqs);
router.get('/faqs/:id', informationController.getFaq);
router.get('/sources', informationController.listSources);
router.get('/search', protect, informationController.globalSearch);

module.exports = router;
