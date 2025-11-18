const express = require('express');
const { 
  getInvoices, 
  getInvoice, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice,
  generatePDF,
  sendEmail
} = require('../controllers/invoiceController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getInvoices);
router.get('/:id', getInvoice);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.get('/:id/pdf', generatePDF);
router.post('/:id/send', sendEmail);

module.exports = router;