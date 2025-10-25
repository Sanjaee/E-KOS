import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

interface PaymentButtonProps {
  postPremiumId: number;
  price: number;
}

interface SnapCallbacks {
  onSuccess: () => void;
  onPending: () => void;
  onError: () => void;
  onClose: () => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, callbacks: SnapCallbacks) => void;
    };
  }
}


const PaymentButton: React.FC<PaymentButtonProps> = ({ postPremiumId, price }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postPremiumId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Load Midtrans Snap
      const snapScript = document.createElement('script');
      snapScript.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      snapScript.type = 'text/javascript';
      snapScript.onload = () => {
        window.snap.pay(data.token, {
          onSuccess: function() {
            router.push(`/payment/success?order_id=${data.transaction_id}`);
          },
          onPending: function() {
            router.push(`/payment/pending?order_id=${data.transaction_id}`);
          },
          onError: function() {
            router.push(`/payment/error?order_id=${data.transaction_id}`);
          },
          onClose: function() {
            setIsLoading(false);
          }
        });
      };
      document.head.appendChild(snapScript);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled
      className="w-full dark:bg-darkBg bg-darkBg text-lightBg border-black border  px-6 py-3 rounded-md  transition-colors duration-200 disabled:bg-gray-400"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </div>
      ) : (
        `${formatCurrency(price)}`
      )}
    </button>
  );
};

export default PaymentButton;