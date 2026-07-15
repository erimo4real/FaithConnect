import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { verifyDonation } from '../services/api';

export default function DonationSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [donation, setDonation] = useState(null);
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  useEffect(() => {
    if (!reference) { setStatus('no-ref'); return; }

    let cancelled = false;
    const verify = async () => {
      try {
        const data = await verifyDonation(reference);
        if (cancelled) return;
        if (data.status === 'completed' || data.paystack_status === 'success') {
          setDonation(data);
          setStatus('confirmed');
        } else {
          setDonation(data);
          setStatus('pending');
        }
      } catch {
        if (!cancelled) setStatus('no-ref');
      }
    };
    // Retry up to 3 times with delay (webhook may arrive moments later)
    verify();
    const retry = setTimeout(() => { if (!cancelled) verify(); }, 5000);
    const retry2 = setTimeout(() => { if (!cancelled) verify(); }, 15000);
    return () => { cancelled = true; clearTimeout(retry); clearTimeout(retry2); };
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
        {status === 'verifying' && (
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Verifying Payment...</h1>
            <p className="text-gray-500 dark:text-gray-400">Please wait while we confirm your donation with Paystack.</p>
          </div>
        )}

        {status === 'confirmed' && (
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FaCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Thank You!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-1">Your donation has been received.</p>
            {donation && (
              <p className="text-2xl font-bold text-primary mb-1">₦{Number(donation.amount).toLocaleString()}</p>
            )}
            {reference && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Reference: <span className="font-mono font-semibold">{reference}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              A receipt will be sent to your email shortly.
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}

        {status === 'pending' && (
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Payment Pending</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Your donation is being processed. This should complete shortly.
            </p>
            {reference && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Reference: <span className="font-mono font-semibold">{reference}</span>
              </p>
            )}
            <Link
              to="/"
              className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}

        {status === 'no-ref' && (
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FaTimesCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Verification Unavailable</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We couldn't verify your payment right now. If you made a donation, please check your email for a receipt or contact us.
            </p>
            <Link
              to="/"
              className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
