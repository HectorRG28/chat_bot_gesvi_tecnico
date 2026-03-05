const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// El prefijo "/api/faqs" ya se define en server.js, aquí usamos "/"
router.get('/', chatController.getAllFaqs);
router.post('/', chatController.addFaq);
router.get('/:id', chatController.getFaqById);
router.put('/:id', chatController.updateFaq);
router.delete('/:id', chatController.deleteFaq);

module.exports = router;