import React, { useState } from 'react';
import { CustomerOrder } from '../types/dropship';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, X, ExternalLink } from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CustomerOrder[];
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<CustomerOrder | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setMatchedOrder(null);
      return;
    }
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === q ||
        o.customer.email.toLowerCase() === q ||
        o.supplierOrders.some((so) => so.trackingNumber?.toLowerCase() === q)
    );
    setMatchedOrder(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/30 mx-auto flex items-center justify-center mb-2">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Track Your Dog's Package</h3>
          <p className="text-xs text-slate-400">
            Enter your order number (e.g. <span className="text-orange-400 font-mono">PAW-10492</span>) or customer email.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Order # (PAW-10492) or email..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
          >
            Track
          </button>
        </form>

        {/* Demo order suggestions for easy testing */}
        <div className="mt-2 flex items-center space-x-2 text-[11px] text-slate-500">
          <span>Try demo order:</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('PAW-10493');
              const found = orders.find((o) => o.orderNumber === 'PAW-10493');
              setMatchedOrder(found || null);
              setSearched(true);
            }}
            className="text-orange-400 hover:underline font-mono"
          >
            PAW-10493
          </button>
          <span>or</span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('PAW-10492');
              const found = orders.find((o) => o.orderNumber === 'PAW-10492');
              setMatchedOrder(found || null);
              setSearched(true);
            }}
            className="text-orange-400 hover:underline font-mono"
          >
            PAW-10492
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div className="mt-5">
            {matchedOrder ? (
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Order Status</span>
                    <h4 className="text-sm font-bold text-white font-mono mt-0.5">{matchedOrder.orderNumber}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    matchedOrder.status === 'SHIPPED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {matchedOrder.status === 'SHIPPED' ? 'In Transit with Courier' : 'Packaging & Dispatching'}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-medium">Items in this shipment:</span>
                  {matchedOrder.items.map((it, idx) => (
                    <div key={idx} className="text-white flex justify-between">
                      <span>{it.quantity}x {it.productTitle}</span>
                      <span className="text-slate-400">{it.variantName}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Code */}
                {matchedOrder.supplierOrders[0]?.trackingNumber ? (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Carrier:</span>
                      <span className="text-white font-semibold">{matchedOrder.supplierOrders[0].carrier || 'USPS Priority'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Tracking Number:</span>
                      <a
                        href={matchedOrder.supplierOrders[0].trackingUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 font-mono font-bold flex items-center space-x-1 hover:underline"
                      >
                        <span>{matchedOrder.supplierOrders[0].trackingNumber}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-amber-300 text-[11px] flex items-center space-x-2">
                    <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Your order is verified. Tracking number generates as soon as the logistics hub scans the parcel.</span>
                  </div>
                )}

                {/* Destination */}
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Delivering to: {matchedOrder.shippingAddress.city}, {matchedOrder.shippingAddress.state} {matchedOrder.shippingAddress.postalCode}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-950 rounded-xl border border-slate-800">
                No orders found matching "{searchQuery}". Please check your order confirmation email.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
