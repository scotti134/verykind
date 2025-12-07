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
  amount: initialAmount,
  platformTip: initialPlatformTip,
  message,
  isMonthly = false
}: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [currency, setCurrency] = useState('CAD');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'daf' | 'card'>('card');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [useAsBillingName, setUseAsBillingName] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [country, setCountry] = useState('Canada');
  const [postalCode, setPostalCode] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [hideNamePublicly, setHideNamePublicly] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [allowContact, setAllowContact] = useState(false);

  const presetAmounts = [200, 300, 500, 750, 1000, 2000];
  const amount = selectedAmount || parseFloat(customAmount) || initialAmount;
  const platformTip = (amount * tipPercentage) / 100;
  const total = amount + platformTip;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Enter your donation for</p>
              <h2 className="text-2xl font-bold text-gray-900">{creatorName}</h2>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4">Enter your donation</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setSelectedAmount(preset);
                    setCustomAmount('');
                  }}
                  className={`py-3 px-4 border-2 rounded-lg font-bold text-base transition-all relative ${
                    selectedAmount === preset
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  CA${preset}
                  {preset === 500 && (
                    <span className="absolute -top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      SUGGESTED
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative">
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-green-500">
                <span className="pl-4 pr-2 text-2xl font-bold text-gray-900">CA$</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setCustomAmount(value);
                    setSelectedAmount(null);
                  }}
                  placeholder=".00"
                  className="flex-1 py-4 text-4xl font-bold text-gray-900 focus:outline-none"
                />
                <button className="px-4 py-2 flex items-center gap-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <circle cx="10" cy="10" r="8" />
                  </svg>
                  {currency}
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-2">Tip GoFundMe services</h3>
            <p className="text-sm text-gray-600 mb-4">
              GoFundMe has a 0% platform fee for organizers and relies primarily on the generosity of donors like you to operate our service.
            </p>
            <div className="flex gap-3">
              {[15, 20, 25].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setTipPercentage(tip)}
                  className={`flex-1 py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                    tipPercentage === tip
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {tip}%
                </button>
              ))}
              <button
                onClick={() => setTipPercentage(0)}
                className={`flex-1 py-3 px-4 border-2 rounded-lg font-medium transition-all ${
                  tipPercentage === 0
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Other
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="border-2 border-gray-300 rounded-xl overflow-hidden">
              <div
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 cursor-pointer transition-all border-b-2 border-gray-200 ${
                  paymentMethod === 'paypal' ? 'bg-white' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
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
              </div>

              <div
                onClick={() => setPaymentMethod('daf')}
                className={`p-4 cursor-pointer transition-all border-b-2 border-gray-200 ${
                  paymentMethod === 'daf' ? 'bg-white' : 'bg-white hover:bg-gray-50'
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
                className={`p-4 cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'bg-white' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
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

                {paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useAsBillingName}
                        onChange={(e) => setUseAsBillingName(e.target.checked)}
                        className="w-4 h-4 border-2 border-gray-300 rounded accent-green-600"
                      />
                      <span className="text-sm text-gray-700">Use as billing name</span>
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="CVV"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      value={nameOnCard}
                      onChange={(e) => setNameOnCard(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                        >
                          <option>Canada</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Australia</option>
                        </select>
                        <label className="absolute top-1 left-4 text-xs text-gray-500">Country</label>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="w-4 h-4 border-2 border-gray-300 rounded accent-green-600"
                      />
                      <span className="text-sm text-gray-700">Save card for future donations</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hideNamePublicly}
                onChange={(e) => setHideNamePublicly(e.target.checked)}
                className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded accent-green-600"
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
                className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded accent-green-600"
              />
              <span className="text-gray-900 text-sm leading-tight">
                Get occasional marketing updates from GoFundMe. You may unsubscribe at any time.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allowContact}
                onChange={(e) => setAllowContact(e.target.checked)}
                className="w-4 h-4 mt-0.5 border-2 border-gray-300 rounded accent-green-600"
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
                <span>GoFundMe tip</span>
                <span>CA${platformTip.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200 mb-3">
              <span>Total due today</span>
              <span>CA${total.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full bg-[#02A95C] hover:bg-[#019A51] text-white font-bold py-4 px-6 rounded-lg transition-colors text-base mb-4">
            Donate now
          </button>

          <div className="text-xs text-gray-600 leading-relaxed space-y-3">
            <p>
              By continuing, you agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline">terms</a> and{' '}
              <a href="#" className="text-blue-600 hover:underline">privacy policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
