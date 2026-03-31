import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiUserPlus, FiX } from 'react-icons/fi';
import { brandColors } from '@acme/shared';

export const AuthChoiceModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueAsGuest = () => {
    setIsLoading(true);
    // Navigate to checkout page for guest workflow
    navigate('/checkout');
    setIsLoading(false);
  };

  const handleLoginSignup = () => {
    setIsLoading(true);
    // For MVP, we'll just close the modal and let user navigate manually
    // In a full implementation, this would open login/signup modal
    onClose();
    setIsLoading(false);
  };

  return (
    <>
      <div
        aria-hidden={false}
        className="fixed inset-0 z-40 bg-stone-950/35 transition pointer-events-auto opacity-100"
        onClick={onClose}
      />
      <div
        aria-hidden={false}
        className="fixed left-1/2 top-1/2 z-50 flex h-auto w-full max-w-md transform -translate-x-1/2 -translate-y-1/2 flex-col border-l border-stone-200 bg-white shadow-[0_18px_45px_rgba(120,98,70,0.18)] transition-transform duration-300"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Continue Checkout</p>
            <h2 className="text-xl font-semibold text-stone-950">How would you like to continue?</h2>
          </div>

          <button
            aria-label="Close modal"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
            onClick={onClose}
            type="button"
          >
            <FiX aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="flex-1 flex-col items-center justify-center gap-4 px-6 py-6">
          <div className="space-y-4">
            <button
              onClick={handleContinueAsGuest}
              disabled={isLoading}
              className={`inline-flex w-full items-center justify-center gap-3 rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : `background-color: ${brandColors.logoGreen}; color: ${brandColors.white}`}
              `}
              type="button"
            >
              {isLoading ? 'Continuing...' : (
                <>
                  <FiLogIn size={20} aria-hidden="true" />
                  Continue as guest
                </>
              )}
            </button>

            <button
              onClick={handleLoginSignup}
              disabled={isLoading}
              className={`inline-flex w-full items-center justify-center gap-3 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="button"
            >
              {isLoading ? 'Processing...' : (
                <>
                  <FiUserPlus size={20} aria-hidden="true" />
                  Login / Sign up
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-stone-500 text-center">
            Continue as guest to checkout quickly without creating an account
          </p>
        </div>
      </div>
    </>
  );
};