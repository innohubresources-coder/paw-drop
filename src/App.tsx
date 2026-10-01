import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { ArchitectureView } from './components/ArchitectureView';
import { Storefront } from './components/Storefront';
import { AdminPanel } from './components/AdminPanel';
import { OrderSimulator } from './components/OrderSimulator';
import { NichePlaybook } from './components/NichePlaybook';
import { FeatureAuditTable } from './components/FeatureAuditTable';
import { AdminAuthModal } from './components/AdminAuthModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { PolicyModal, PolicyType } from './components/PolicyModal';
import { 
  DOG_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_ERROR_QUEUE, 
  INITIAL_LOGS 
} from './data/dogProducts';
import { 
  CustomerOrder, 
  ErrorQueueItem, 
  WebhookLogEntry, 
  CartItem, 
  ShippingAddress,
  SupplierType 
} from './types/dropship';
import { Lock, Truck, ShieldCheck, Heart, Mail, CheckSquare } from 'lucide-react';

export default function App() {
  // Public by default: only live storefront is visible
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('pawdrop_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('storefront');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Database / Domain state
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_ORDERS);
  const [errorQueue, setErrorQueue] = useState<ErrorQueueItem[]>(INITIAL_ERROR_QUEUE);
  const [logs, setLogs] = useState<WebhookLogEntry[]>(INITIAL_LOGS);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // Keyboard shortcut listener: Ctrl + Shift + A to open secret admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdminUnlocked) {
          setActiveTab('admin');
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminUnlocked]);

  const handleUnlockAdmin = () => {
    setIsAdminUnlocked(true);
    try {
      sessionStorage.setItem('pawdrop_admin_unlocked', 'true');
    } catch {
      // ignore
    }
    setIsAuthModalOpen(false);
    setActiveTab('admin');
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem('pawdrop_admin_unlocked');
    } catch {
      // ignore
    }
    setActiveTab('storefront');
  };

  const addLog = (entry: Omit<WebhookLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newEntry: WebhookLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      ...entry,
    };
    setLogs((prev) => [newEntry, ...prev]);
  };

  const handlePlaceOrder = (cartItems: CartItem[], address: ShippingAddress) => {
    const orderNum = `PAW-${Math.floor(10500 + Math.random() * 900)}`;
    const subtotal = cartItems.reduce((s, i) => s + i.variant.price * i.quantity, 0);

    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: 'Just now',
      status: 'PROCESSING_SUPPLIER',
      customer: {
        name: address.fullName,
        email: address.email,
        phone: address.phone,
      },
      shippingAddress: address,
      items: cartItems.map((ci) => ({
        productId: ci.product.id,
        productTitle: ci.product.title,
        variantId: ci.variant.id,
        variantName: ci.variant.name,
        sku: ci.variant.sku,
        quantity: ci.quantity,
        unitPrice: ci.variant.price,
        supplierCost: ci.variant.supplierCost,
        supplierType: ci.product.supplierType,
      })),
      subtotal,
      shippingFee: 0,
      total: subtotal,
      stripePaymentIntentId: `pi_${Date.now()}_test_${Math.random().toString(36).substr(2, 6)}`,
      supplierOrders: [],
    };

    setOrders((prev) => [newOrder, ...prev]);

    addLog({
      source: 'STRIPE',
      event: 'payment_intent.succeeded',
      orderId: newOrder.id,
      status: 'SUCCESS',
      details: `Stripe verified $${subtotal.toFixed(2)} charge for ${address.fullName}. Signature verified.`,
    });

    setTimeout(() => {
      addLog({
        source: 'INTERNAL_WORKER',
        event: 'bullmq.job.enqueued',
        orderId: newOrder.id,
        status: 'SUCCESS',
        details: `Enqueued job 'fulfill_${newOrder.id}' with max_retries=3, exponential_backoff=5s.`,
      });
    }, 400);

    setTimeout(() => {
      const primarySupplier = newOrder.items[0]?.supplierType || 'CJ_DROPSHIPPING';
      const cjOrderNum = `CJ-ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const trackingCode = `940011189922${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      addLog({
        source: primarySupplier,
        event: primarySupplier === 'CJ_DROPSHIPPING' ? 'cj.order.create' : 'aliexpress.order.create',
        orderId: newOrder.id,
        status: 'SUCCESS',
        details: `Supplier API 200 OK. Created supplier order ${cjOrderNum}. Auto-deducted from pre-funded wallet. Assigned initial tracking: ${trackingCode}.`,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === newOrder.id
            ? {
                ...o,
                status: 'SUPPLIER_PLACED',
                supplierOrders: [
                  {
                    id: `sup-${Date.now()}`,
                    orderId: o.id,
                    supplier: primarySupplier,
                    supplierOrderNumber: cjOrderNum,
                    status: 'PLACED',
                    costTotal: o.items.reduce((s, i) => s + i.supplierCost * i.quantity, 0),
                    trackingNumber: trackingCode,
                    carrier: 'USPS Priority / CJ FastPacket',
                    trackingUrl: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingCode}`,
                    placedAt: 'Just now',
                    retryCount: 0,
                  },
                ],
              }
            : o
        )
      );
    }, 1200);
  };

  const handleTriggerSimulation = (scenario: 'SUCCESS' | 'OUT_OF_STOCK' | 'INVALID_ADDRESS' | 'API_TIMEOUT') => {
    setIsSimulating(true);
    setActiveScenario(scenario);

    const testOrderNum = `PAW-SIM-${Math.floor(1000 + Math.random() * 9000)}`;
    const testOrderId = `sim-ord-${Date.now()}`;

    addLog({
      source: 'STRIPE',
      event: 'payment_intent.succeeded',
      orderId: testOrderId,
      status: 'SUCCESS',
      details: `[SIMULATION: ${scenario}] Received verified payment event $54.99 for ${testOrderNum}. Idempotency lock acquired in Redis.`,
    });

    setTimeout(() => {
      addLog({
        source: 'INTERNAL_WORKER',
        event: 'worker.job.started',
        orderId: testOrderId,
        status: 'SUCCESS',
        details: `Worker daemon process picked up job for ${testOrderNum}. Validating address schema and pre-checking supplier stock...`,
      });

      setTimeout(() => {
        if (scenario === 'SUCCESS') {
          const tracking = `CJPAK${Math.floor(100000000 + Math.random() * 900000000)}US`;
          addLog({
            source: 'CJ_DROPSHIPPING',
            event: 'cj.order.create',
            orderId: testOrderId,
            status: 'SUCCESS',
            details: `HTTP 200: CJ Dropshipping order CJ-ORD-2026-${Math.floor(10000 + Math.random() * 90000)} created. Tracking code assigned: ${tracking}. Blind dropship invoice enabled.`,
          });
          setIsSimulating(false);
        } else if (scenario === 'INVALID_ADDRESS') {
          addLog({
            source: 'ALIEXPRESS',
            event: 'aliexpress.ds.order.create',
            orderId: testOrderId,
            status: 'ERROR',
            details: `HTTP 422: Carrier rejected address 'PO Box 891'. Courier express line requires physical street address.`,
          });

          const newErr: ErrorQueueItem = {
            id: `err-${Date.now()}`,
            orderId: testOrderId,
            orderNumber: testOrderNum,
            supplier: 'ALIEXPRESS',
            sku: 'PAW-GADG-BARK-PRO',
            errorCode: 'ADDR_PO_BOX_REJECTED',
            reason: 'AliExpress Direct line prohibits PO Box delivery. Enqueued to ErrorQueue for admin address update.',
            severity: 'HIGH',
            payload: { street1: 'PO Box 891', city: 'Austin', state: 'TX' },
            createdAt: 'Just now',
            retryAttempts: 1,
            resolved: false,
          };
          setErrorQueue((prev) => [newErr, ...prev]);
          setIsSimulating(false);
        } else if (scenario === 'OUT_OF_STOCK') {
          addLog({
            source: 'CJ_DROPSHIPPING',
            event: 'cj.product.stock.check',
            orderId: testOrderId,
            status: 'WARNING',
            details: `Supplier inventory returned 0 available units for variant CJ-VAR-902-L-GRY. Attempting fallback supplier...`,
          });

          setTimeout(() => {
            addLog({
              source: 'INTERNAL_WORKER',
              event: 'fallback.supplier.failed',
              orderId: testOrderId,
              status: 'ERROR',
              details: `AliExpress backup supplier also out of stock. Order marked as OUT_OF_STOCK. Enqueued to ErrorQueue and sent Slack alert to admin.`,
            });

            const newErr: ErrorQueueItem = {
              id: `err-${Date.now()}`,
              orderId: testOrderId,
              orderNumber: testOrderNum,
              supplier: 'CJ_DROPSHIPPING',
              sku: 'PAW-BED-CALM-L-GRY',
              errorCode: 'SUPPLIER_OUT_OF_STOCK',
              reason: 'Zero inventory on primary & backup supplier. Delisted SKU from storefront and queued for admin review.',
              severity: 'CRITICAL',
              payload: { sku: 'PAW-BED-CALM-L-GRY', neededQty: 1 },
              createdAt: 'Just now',
              retryAttempts: 2,
              resolved: false,
            };
            setErrorQueue((prev) => [newErr, ...prev]);
            setIsSimulating(false);
          }, 800);
        } else if (scenario === 'API_TIMEOUT') {
          addLog({
            source: 'CJ_DROPSHIPPING',
            event: 'network.timeout',
            orderId: testOrderId,
            status: 'ERROR',
            details: `HTTP 504 Gateway Timeout: CJ Dropshipping API did not respond within 8000ms. BullMQ scheduled Attempt 2 in 5000ms.`,
          });

          setTimeout(() => {
            addLog({
              source: 'INTERNAL_WORKER',
              event: 'bullmq.retry.attempt_2',
              orderId: testOrderId,
              status: 'SUCCESS',
              details: `Retry Attempt 2 succeeded! Supplier API connection restored. Created order CJ-ORD-RETRY-881.`,
            });
            setIsSimulating(false);
          }, 1500);
        }
      }, 1000);
    }, 700);
  };

  const handleRetryError = (errorId: string) => {
    const err = errorQueue.find((e) => e.id === errorId);
    if (!err) return;

    setErrorQueue((prev) => prev.filter((e) => e.id !== errorId));
    addLog({
      source: 'INTERNAL_WORKER',
      event: 'error_queue.retry_executed',
      orderId: err.orderId,
      status: 'SUCCESS',
      details: `Admin initiated retry for ${err.orderNumber} with corrected address. Order successfully placed with ${err.supplier}!`,
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === err.orderId
          ? {
              ...o,
              status: 'SUPPLIER_PLACED',
              supplierOrders: [
                {
                  id: `sup-${Date.now()}`,
                  orderId: o.id,
                  supplier: err.supplier,
                  supplierOrderNumber: `${err.supplier === 'CJ_DROPSHIPPING' ? 'CJ' : 'AE'}-RETRY-${Math.floor(10000 + Math.random() * 90000)}`,
                  status: 'PLACED',
                  costTotal: 12.1,
                  trackingNumber: `94001118992${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                  carrier: 'USPS Commercial Priority',
                  placedAt: 'Just now',
                  retryCount: err.retryAttempts + 1,
                },
              ],
            }
          : o
      )
    );
  };

  const handleManualFulfill = (orderId: string) => {
    addLog({
      source: 'INTERNAL_WORKER',
      event: 'admin.manual_fulfill',
      orderId,
      status: 'SUCCESS',
      details: `Admin manually fulfilled order ${orderId}. Marked as SUPPLIER_PLACED.`,
    });
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'SUPPLIER_PLACED',
              supplierOrders: [
                {
                  id: `sup-manual-${Date.now()}`,
                  orderId: o.id,
                  supplier: 'CJ_DROPSHIPPING',
                  supplierOrderNumber: `MANUAL-FULFILL-${Date.now()}`,
                  status: 'PLACED',
                  costTotal: o.items[0]?.supplierCost || 10,
                  trackingNumber: `94001118992${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                  carrier: 'USPS Priority',
                  placedAt: 'Just now',
                  retryCount: 0,
                },
              ],
            }
          : o
      )
    );
  };

  const handleRefundOrder = (orderId: string) => {
    addLog({
      source: 'STRIPE',
      event: 'stripe.refund.created',
      orderId,
      status: 'SUCCESS',
      details: `Stripe issued 100% refund for order ${orderId}. Customer notified via automated email.`,
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'REFUNDED' } : o))
    );
    setErrorQueue((prev) => prev.filter((e) => e.orderId !== orderId));
  };

  const cartTotal = cart.reduce((s, i) => s + i.variant.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminUnlocked={isAdminUnlocked}
        onLockAdmin={handleLockAdmin}
        onOpenAdminAuth={() => setIsAuthModalOpen(true)}
        onOpenTracking={() => setIsTrackModalOpen(true)}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        errorCount={errorQueue.length}
        isSimulating={isSimulating}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* If Admin is locked, always render Storefront regardless of any state */}
        {!isAdminUnlocked || activeTab === 'storefront' ? (
          <Storefront
            products={DOG_PRODUCTS}
            cart={cart}
            setCart={setCart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            onPlaceOrder={handlePlaceOrder}
            onOpenTracking={() => setIsTrackModalOpen(true)}
            onOpenPolicy={(policy) => setActivePolicy(policy)}
          />
        ) : activeTab === 'admin' ? (
          <AdminPanel
            orders={orders}
            errorQueue={errorQueue}
            products={DOG_PRODUCTS}
            onRetryError={handleRetryError}
            onManualFulfill={handleManualFulfill}
            onRefundOrder={handleRefundOrder}
          />
        ) : activeTab === 'audit' ? (
          <FeatureAuditTable
            onGoToStorefront={() => setActiveTab('storefront')}
            onGoToAdmin={() => setActiveTab('admin')}
            onGoToSimulator={() => setActiveTab('simulator')}
          />
        ) : activeTab === 'architecture' ? (
          <ArchitectureView
            onLaunchSimulator={() => setActiveTab('simulator')}
          />
        ) : activeTab === 'simulator' ? (
          <OrderSimulator
            logs={logs}
            onTriggerSimulation={handleTriggerSimulation}
            isSimulating={isSimulating}
            activeScenario={activeScenario}
            onClearLogs={() => setLogs([])}
          />
        ) : (
          <NichePlaybook />
        )}
      </main>

      {/* Customer Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        orders={orders}
      />

      {/* Legal & Customer Care Policy Modals */}
      <PolicyModal
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Secret Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleUnlockAdmin}
      />

      {/* High-Converting Public Storefront Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white">
                  🐾
                </div>
                <span className="font-extrabold text-lg text-white">PawDrop</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated to improving dog wellness, orthopedic posture, and calming solutions with veterinarian-vetted designs.
              </p>
              <div className="flex items-center space-x-3 text-xs text-slate-300 pt-1">
                <span>✓ 30-Day Wag Guarantee</span>
                <span>•</span>
                <span>✓ Free US Shipping</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Shop Categories</h4>
              <ul className="text-xs space-y-2 text-slate-400">
                <li><button onClick={() => { setActiveTab('storefront'); }} className="hover:text-white transition-colors">Anti-Anxiety Donut Beds</button></li>
                <li><button onClick={() => { setActiveTab('storefront'); }} className="hover:text-white transition-colors">Undercoat Deshedding Rakes</button></li>
                <li><button onClick={() => { setActiveTab('storefront'); }} className="hover:text-white transition-colors">Whisper-Quiet Nail Grinders</button></li>
                <li><button onClick={() => { setActiveTab('storefront'); }} className="hover:text-white transition-colors">Mobility & Hip Soft Chews</button></li>
                <li><button onClick={() => { setActiveTab('storefront'); }} className="hover:text-white transition-colors">Tactical No-Pull Harnesses</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Care & Policies</h4>
              <ul className="text-xs space-y-2 text-slate-400">
                <li>
                  <button 
                    onClick={() => setIsTrackModalOpen(true)}
                    className="text-orange-400 hover:underline flex items-center space-x-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track My Package</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('shipping')} className="hover:text-white transition-colors">
                    Shipping Policy (3-7 Days)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('returns')} className="hover:text-white transition-colors">
                    30-Day Return & Refund Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('faq')} className="hover:text-white transition-colors">
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('contact')} className="hover:text-white text-orange-400 font-semibold transition-colors">
                    Contact Us / Concierge
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Stay In The Pup Club</h4>
              <p className="text-xs text-slate-400">
                Get VIP discounts, canine nutrition advice, and early access to new gear.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your dog parent email"
                  className="bg-slate-900 border border-slate-800 rounded-l-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 w-full"
                />
                <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3.5 py-2 rounded-r-xl transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Sub-footer & Secret Merchant Entrance */}
          <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center space-x-4">
              <span>© {new Date().getFullYear()} PawDrop Pet Innovations. All rights reserved.</span>
              <span>•</span>
              <button onClick={() => setActivePolicy('privacy')} className="hover:text-slate-400 cursor-pointer">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => setActivePolicy('terms')} className="hover:text-slate-400 cursor-pointer">Terms of Service</button>
            </div>

            {/* Secret merchant entrance */}
            <div className="flex items-center space-x-3">
              {isAdminUnlocked ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 font-mono text-[11px] bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30"
                  >
                    <CheckSquare className="w-3 h-3" />
                    <span>Audit 40/40 MVP</span>
                  </button>
                  <button
                    onClick={handleLockAdmin}
                    className="text-red-400 hover:text-red-300 flex items-center space-x-1 font-mono text-[11px] bg-red-950/40 px-2.5 py-1 rounded border border-red-500/30"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Lock Admin Session</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  title="Store Staff & Merchant Access"
                  className="text-slate-600 hover:text-slate-400 flex items-center space-x-1 text-[11px] transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Staff Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
