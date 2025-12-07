import { X } from 'lucide-react';
import { useState } from 'react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  amount: number;
  platformTip: number;
  message?: string;
  isMonthly?: boolean;
}

export default function DonationModal({
  isOpen,
  onClose,
  creatorName,
  amount,
  platformTip,
  message,
  isMonthly = false
}: DonationModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('Canada');
  const [postalCode, setPostalCode] = useState('');
  const [hideNamePublicly, setHideNamePublicly] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [allowContact, setAllowContact] = useState(false);

  const total = amount + platformTip;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Complete your support</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment method</h3>

            <div className="space-y-3">
              <div
                onClick={() => setPaymentMethod('paypal')}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="radio"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">Pay</div>
                    <div className="bg-blue-400 text-white px-2 py-1 rounded text-xs font-bold">Pal</div>
                    <span className="font-semibold text-gray-900">PayPal</span>
                  </div>
                </div>

                {paymentMethod === 'paypal' && (
                  <div className="space-y-3 pl-8">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                          <option>Canada</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                        </select>
                        <div className="absolute top-1 left-4 text-xs text-gray-500">Country</div>
                      </div>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="w-5 h-5 text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                  <span className="font-semibold text-gray-900">Credit or debit</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={hideNamePublicly}
                onChange={(e) => setHideNamePublicly(e.target.checked)}
                className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-gray-900 text-sm">
                  Don't display my name publicly on the fundraiser.
                </span>
                <button className="ml-1 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4 inline" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </button>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={receiveUpdates}
                onChange={(e) => setReceiveUpdates(e.target.checked)}
                className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-900 text-sm">
                Get occasional marketing updates from Very Kind. You may unsubscribe at any time.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={allowContact}
                onChange={(e) => setAllowContact(e.target.checked)}
                className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-900 text-sm">
                I would like to be contacted by {creatorName} about other ways that I can help.
              </span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your donation</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Your donation</span>
                <span className="font-semibold">CA${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Very Kind tip</span>
                <span className="font-semibold">CA${platformTip.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total due today</span>
              <span>CA${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Your total amount will be charged in the fundraiser's currency, USD. International transaction and conversion fees may apply based on your payment method.
            </p>
          </div>

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded-full transition-colors text-lg mb-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-blue-600 font-bold">Pay</span>
              <span className="text-blue-400 font-bold">Pal</span>
            </div>
          </button>

          <div className="text-xs text-gray-600 leading-relaxed space-y-2">
            <p>
              By clicking 'PayPal', you agree to Very Kind's{' '}
              <button className="text-blue-600 hover:underline">Terms of Service</button> and{' '}
              <button className="text-blue-600 hover:underline">Privacy Notice</button>, including
              disclosing your name and email to {creatorName} for compliance purposes. Learn more
              about{' '}
              <button className="text-blue-600 hover:underline">pricing and fees</button>.
            </p>
            <p>
              Your donation may be sent directly to the creator, if they have enabled Very Kind Pay
              with us. If not, it will be sent to PayPal Giving Fund,{' '}
              <button className="text-blue-600 hover:underline">minus transaction fees</button>, and
              granted within{' '}
              <button className="text-blue-600 hover:underline">15-45 days</button>, subject to its{' '}
              <button className="text-blue-600 hover:underline">terms</button>. In the unlikely event
              that{' '}
              <button className="text-blue-600 hover:underline">
                there is a problem funding your chosen creator
              </button>
              , PayPal Giving Fund will (whenever possible) ask you to recommend another, and grant
              the funds to a similar creator if you don't respond. Your donation is typically tax
              deductible in the US.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
