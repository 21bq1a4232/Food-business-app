import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'payment_failed':
        return 'Your payment could not be processed. Please try again.';
      case 'order_not_found':
        return 'Order not found. Please contact support.';
      case 'verification_failed':
        return 'Payment verification failed. Please contact support.';
      default:
        return 'Something went wrong with your payment. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        {/* Error Details */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600">
              Order ID: <span className="font-medium">#{orderId}</span>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-700">
            <strong>Need Help?</strong> Contact our support team if you continue to face issues.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {orderId && (
            <Link
              to={`/checkout?retry=${orderId}`}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Link>
          )}
          <Link
            to="/cart"
            className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <Link
            to="/contact"
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;