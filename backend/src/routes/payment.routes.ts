import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

// User routes
router.post('/create', paymentController.createPayment);
router.get('/booking/:bookingId', paymentController.getPaymentByBooking);
router.get('/user/:userId', paymentController.getPaymentsByUser);

// Admin routes
router.get('/all', paymentController.getAllPayments);
router.get('/status/:status', paymentController.getPaymentsByStatus);
router.put('/verify/:paymentId', paymentController.updatePaymentStatus);
router.delete('/:paymentId', paymentController.deletePayment);
router.get('/stats/overview', paymentController.getPaymentStats);

export default router;
