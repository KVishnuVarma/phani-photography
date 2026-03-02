import React from 'react';
import { motion } from 'framer-motion';

interface PaymentModalProps {
  isOpen: boolean;
  bookingId: string;
  bookingAmount: number;
  onPayNow: () => void;
  onPayLater: () => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  bookingId,
  bookingAmount,
  onPayNow,
  onPayLater,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-3xl font-bold mb-2 text-primary-700 dark:text-primary-300 font-serif">
          Payment Confirmation
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Booking ID: <span className="font-mono text-sm">{bookingId.substring(0, 8)}...</span>
        </p>

        <div className="bg-primary-50 dark:bg-neutral-700 p-4 rounded-lg mb-6 border border-primary-200 dark:border-neutral-600">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">Total Booking Amount</p>
          <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">₹{bookingAmount}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onPayNow}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 rounded-lg transition shadow-lg shadow-primary-600/50"
          >
            <span className="flex items-center justify-center gap-2">
              💳 Pay Advance Now
            </span>
            <span className="text-xs mt-1 opacity-90">Get instant confirmation</span>
          </button>

          <button
            onClick={onPayLater}
            className="w-full bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 font-bold py-4 rounded-lg transition border-2 border-neutral-300 dark:border-neutral-600"
          >
            <span className="flex items-center justify-center gap-2">
              📅 Pay Later
            </span>
            <span className="text-xs mt-1 opacity-75">Complete payment during shoot</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 font-semibold py-2"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
