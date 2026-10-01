import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Mail, 
  FileText, 
  X, 
  Send, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Clock 
} from 'lucide-react';

export type PolicyType = 'shipping' | 'returns' | 'privacy' | 'terms' | 'contact' | 'faq';

interface PolicyModalProps {
  type: PolicyType | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', dogBreed: '', message: '' });

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {type === 'shipping' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <Truck className="w-6 h-6" />
              <h3 className="text-xl font-black text-white">Shipping & Fulfillment Policy</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              At PawDrop, every order is processed automatically within 24 hours of payment verification via our direct logistics network (US Domestic Warehouses & CJ Fast Lines).
            </p>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-200 font-semibold border-b border-slate-800 pb-2">
                <span>Shipping Zone</span>
                <span>Estimated Delivery</span>
                <span>Cost</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>United States (Domestic Lines)</span>
                <span className="text-emerald-400">3 – 7 Business Days</span>
                <span className="text-white font-bold">FREE over $35</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Canada, UK & EU</span>
                <span className="text-emerald-400">6 – 10 Business Days</span>
                <span className="text-white font-bold">$4.95</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Australia & New Zealand</span>
                <span className="text-emerald-400">7 – 12 Business Days</span>
                <span className="text-white font-bold">$5.95</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              *All parcels include door-to-door USPS / DHL milestone tracking issued directly to your email upon fulfillment.
            </p>
          </div>
        )}

        {type === 'returns' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-xl font-black text-white">30-Day "Wag-Guarantee" Return & Refund Policy</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We stand behind our dog care products 100%. If your pup doesn't feel calmer, sleep better, or love their new gear, you have <strong>30 days from delivery</strong> to request a hassle-free replacement or full refund.
            </p>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <h4 className="font-bold text-white">How Returns Work:</h4>
              <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                <li>Send an email to <code className="text-orange-400">support@pawdrop.com</code> with your order number.</li>
                <li>For defective or wrong sizes, we dispatch a complimentary replacement immediately.</li>
                <li>Refunds are credited back to your original payment method (Stripe card/Apple Pay) within 3-5 business days.</li>
              </ol>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-xl font-black text-white">GDPR & CCPA Compliant Privacy Policy</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              PawDrop strictly protects customer privacy. Credit card information is processed directly by Stripe Elements and never touches or persists on our servers (100% PCI SAQ A compliant).
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              <li><strong>Zero Data Selling:</strong> We never sell customer names, phone numbers, or emails to third parties.</li>
              <li><strong>Supplier Delivery Data:</strong> Only your name, shipping address, and phone number are forwarded to the carrier for label generation.</li>
              <li><strong>Right to Erasure:</strong> Customers can request full account deletion and data export at any time.</li>
            </ul>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <FileText className="w-6 h-6" />
              <h3 className="text-xl font-black text-white">Terms of Service</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              By accessing PawDrop, you agree to fair consumer use and our automated fulfillment terms. All product descriptions are crafted for informational wellness guidance and are not a replacement for veterinary clinical diagnoses.
            </p>
            <p className="text-xs text-slate-400">
              Pricing is subject to promotional availability. We reserve the right to cancel or refund orders where logistics carriers cannot deliver to hazardous or unsupported zones.
            </p>
          </div>
        )}

        {type === 'faq' && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white">Frequently Asked Questions</h3>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1">How do I choose the right bed size for my dog?</h4>
                <p className="text-slate-400">We recommend measuring from nose to tail while sleeping. If in doubt, size up so your dog has ample room to nestle and rest joints.</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1">Are the soft chew supplements safe for puppies?</h4>
                <p className="text-slate-400">Our FlexiHound mobility chews are safe for dogs over 12 weeks of age. Consult your vet for puppies under 3 months.</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white mb-1">How can I track my shipment?</h4>
                <p className="text-slate-400">Click the "Track My Order" button in the header or footer, type your order number (e.g. PAW-10492), and view instant carrier status.</p>
              </div>
            </div>
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-orange-400">
              <Mail className="w-6 h-6" />
              <h3 className="text-xl font-black text-white">Contact PawDrop Canine Care Team</h3>
            </div>
            <p className="text-xs text-slate-300">
              Have a question about sizing, ingredients, or order dispatch? Our pet specialists respond within 2-4 hours.
            </p>

            {contactSubmitted ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Message Dispatched!</h4>
                <p className="text-xs text-slate-300">
                  Thank you! Our canine care concierge has received your note and will email you back shortly.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="text-xs text-orange-400 underline font-semibold pt-1"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Your Full Name:</label>
                    <input
                      required
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Sarah Jenkins"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Your Email:</label>
                    <input
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="sarah@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="text-slate-400 block mb-1">Dog Breed & Age (Optional):</label>
                  <input
                    type="text"
                    value={contactForm.dogBreed}
                    onChange={(e) => setContactForm({ ...contactForm, dogBreed: e.target.value })}
                    placeholder="e.g. Golden Retriever, 4 years old"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <div className="text-xs">
                  <label className="text-slate-400 block mb-1">How can we help your pup?</label>
                  <textarea
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Ask about size recommendations, tracking, or calming bed options..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-orange-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Support</span>
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap justify-between gap-2">
              <span>📧 support@pawdrop.com</span>
              <span>🕒 Concierge Hours: Mon–Sat 8am–8pm EST</span>
              <span>📍 Denver, CO, USA</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
