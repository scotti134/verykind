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
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'daf' | 'card'>('paypal');
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
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
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
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Payment method</h3>

            <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <div
                onClick={() => setPaymentMethod('paypal')}
                className={`p-5 cursor-pointer transition-all border-b-2 border-gray-200 ${
                  paymentMethod === 'paypal' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === 'paypal' ? 'border-green-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'paypal' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-l text-xs font-bold">Pay</span>
                      <span className="bg-blue-400 text-white px-1.5 py-0.5 rounded-r text-xs font-bold">Pal</span>
                    </div>
                    <span className="font-medium text-gray-900">PayPal</span>
                  </div>
                </div>

                {paymentMethod === 'paypal' && (
                  <div className="space-y-3 pl-8">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <label className="absolute top-1 left-3.5 text-xs text-gray-500">Country</label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-3.5 pt-5 pb-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                          <option>Canada</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal code"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div
                onClick={() => setPaymentMethod('daf')}
                className={`p-5 cursor-pointer transition-all border-b-2 border-gray-200 ${
                  paymentMethod === 'daf' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === 'daf' ? 'border-green-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'daf' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                      <span>DAF</span>
                      <span className="ml-1 text-[10px] font-normal">pay</span>
                    </div>
                    <span className="font-medium text-gray-900">Donor Advised Fund</span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-5 cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === 'card' ? 'border-green-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'card' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    <span className="font-medium text-gray-900">Credit or debit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hideNamePublicly}
                onChange={(e) => setHideNamePublicly(e.target.checked)}
                className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded accent-blue-600"
              />
              <div className="flex items-start gap-1 flex-1">
                <span className="text-gray-900 text-sm leading-tight">
                  Don't display my name publicly on the fundraiser.
                </span>
                <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </button>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={receiveUpdates}
                onChange={(e) => setReceiveUpdates(e.target.checked)}
                className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded accent-blue-600"
              />
              <span className="text-gray-900 text-sm leading-tight">
                Get occasional marketing updates from Very Kind. You may unsubscribe at any time.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowContact}
                onChange={(e) => setAllowContact(e.target.checked)}
                className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded accent-blue-600"
              />
              <span className="text-gray-900 text-sm leading-tight">
                I would like to be contacted by {creatorName} about other ways that I can help.
              </span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-5 mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Your donation</h3>
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Your donation</span>
                <span>CA${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Very Kind tip</span>
                <span>CA${platformTip.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200 mb-3">
              <span>Total due today</span>
              <span>CA${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Your total amount will be charged in the fundraiser's currency, USD. International transaction and conversion fees may apply based on your payment method.
            </p>
          </div>

          <button className="w-full bg-[#FFC439] hover:bg-[#FFB800] text-gray-900 font-bold py-3.5 px-6 rounded-full transition-colors text-base mb-4">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[#003087]">Pay</span>
              <span className="text-[#009CDE]">Pal</span>
            </div>
          </button>

          <div className="text-xs text-gray-600 leading-relaxed space-y-3">
            <p>
              By clicking 'PayPal', you agree to Very Kind's{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>, including
              disclosing your name and email to {creatorName} for compliance purposes. Learn more
              about{' '}
              <a href="#" className="text-blue-600 hover:underline">pricing and fees</a>.
            </p>
            <p>
              Your donation may be sent directly to the nonprofit, if they have enabled Very Kind Pay
              with us. If not, it will be sent to PayPal Giving Fund,{' '}
              <a href="#" className="text-blue-600 hover:underline">minus transaction fees</a>, and
              granted within{' '}
              <a href="#" className="text-blue-600 hover:underline">15-45 days</a>, subject to its{' '}
              <a href="#" className="text-blue-600 hover:underline">terms</a>. In the unlikely event
              that{' '}
              <a href="#" className="text-blue-600 hover:underline">
                there is a problem funding your chosen nonprofit
              </a>
              , PayPal Giving Fund will (whenever possible) ask you to recommend another, and grant
              the funds to a similar nonprofit if you don't respond. Your donation is typically tax
              deductible in the US.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
