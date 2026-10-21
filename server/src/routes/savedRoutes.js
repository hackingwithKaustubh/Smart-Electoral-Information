const express = require('express');
const { protect } = require('../middleware/auth');
const savedController = require('../controllers/savedController');

const router = express.Router();

router.use(protect);
router.get('/', savedController.listSaved);
router.post('/', savedController.createSaved);
router.delete('/:id', savedController.deleteSaved);

module.exports = router;
