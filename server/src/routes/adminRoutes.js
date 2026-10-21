const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', adminController.listUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.get('/analytics', adminController.analytics);

router.post('/faqs', adminController.createFaq);
router.put('/faqs/:id', adminController.updateFaq);
router.delete('/faqs/:id', adminController.deleteFaq);

router.post('/information', adminController.createInformation);
router.put('/information/:id', adminController.updateInformation);
router.delete('/information/:id', adminController.deleteInformation);

router.post('/sources', adminController.createSource);
router.put('/sources/:id', adminController.updateSource);
router.delete('/sources/:id', adminController.deleteSource);

module.exports = router;
