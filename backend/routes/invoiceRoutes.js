import express from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  downloadInvoice,
  shareInvoice
} from '../controllers/invoiceController.js';

const router = express.Router();

// Public routes - no authentication needed
router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.route('/:id')
  .get(getInvoiceById)
  .put(updateInvoice)
  .delete(deleteInvoice);

router.get('/:id/download', downloadInvoice);
router.post('/:id/share', shareInvoice);

export default router;
