import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  CreditCard, 
  Truck, 
  AlertOctagon, 
  Workflow, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Boxes,
  Zap,
  Globe,
  Bell,
  Terminal,
  FileCode,
  Copy,
  Check
} from 'lucide-react';

export const ArchitectureView: React.FC<{ onLaunchSimulator: () => void }> = ({ onLaunchSimulator }) => {
  const [selectedFlowStep, setSelectedFlowStep] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const rawAsciiDiagram = `
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          PAWDROP AUTOMATED DROPSHIPPING ARCHITECTURE                   │
└────────────────────────────────────────────────────────────────────────────────────────┘

    CUSTOMER BROWSER / CLIENT                      EDGE & API GATEWAY
 ┌───────────────────────────────┐              ┌─────────────────────────────┐
 │ Next.js 14 Storefront (Vercel)│              │ Vercel Serverless Functions │
 │ • Dog Care Catalog (20 SKUs)  ├─────────────►│ • /api/checkout (Stripe)    │
 │ • Cart, Address, Dog Sizing   │  HTTPS POST  │ • /api/webhooks/stripe      │
 └──────────────┬────────────────┘              └──────────────┬──────────────┘
                │                                              │
                │ Direct Payment Sheet                         │ Verified Event
                ▼                                              ▼
 ┌───────────────────────────────┐              ┌─────────────────────────────┐
 │      Stripe Payment Engine    ├─────────────►│ Webhook Ingestion & Verify  │
 │  • Cards / Apple Pay / 3DS    │ payment_     │ • Validate HMAC Signature   │
 │  • Zero PCI compliance burden │ intent.succ  │ • Idempotency key cache     │
 └───────────────────────────────┘              └──────────────┬──────────────┘
                                                               │
                                         ┌─────────────────────┴─────────────────────┐
                                         │                                           │
                                         ▼                                           ▼
                              ┌───────────────────────┐                  ┌───────────────────────┐
                              │ PostgreSQL (Supabase) │                  │ Upstash Redis / BullMQ│
                              │ • Order, OrderItem    │                  │ Job: process-supplier-│
                              │ • SupplierProduct SKU │                  │      order-queue      │
                              │ • WebhookLog & Audit  │                  └───────────┬───────────┘
                              └───────────────────────┘                              │
                                                                                     ▼
 ┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │ RAILWAY / RENDER BACKGROUND WORKER (Always-on Node.js + TypeScript Daemon)                            │
 │                                                                                                       │
 │  ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐  │
 │  │ 1. Dequeue Job ──► 2. Address Normalizer ──► 3. SKU Splitter ──► 4. Pre-Flight Stock Check      │  │
 │  └───────────────────────────────────┬─────────────────────────────────────────────────────────────┘  │
 │                                      │                                                                │
 │                 ┌────────────────────┴────────────────────┐                                           │
 │                 ▼                                         ▼                                           │
 │       ┌──────────────────┐                      ┌──────────────────┐                                  │
 │       │    CJ Adapter    │                      │AliExpress Adapter│                                  │
 │       │ • CJ Open API v2 │                      │ • DSers / AE API │                                  │
 │       │ • Pre-funded Bal │                      │ • Dropship OAuth │                                  │
 │       └─────────┬────────┘                      └─────────┬────────┘                                  │
 │                 │                                         │                                           │
 │                 └────────────────────┬────────────────────┘                                           │
 │                                      ▼                                                                │
 │                       ┌─────────────────────────────┐                                                 │
 │                       │   Success? Supplier Order ID│                                                 │
 │                       │   + Carrier Tracking Code   │                                                 │
 │                       └──────┬───────────────┬──────┘                                                 │
 │                              │               │                                                        │
 │                   SUCCESS    │               │  FAILURE / EXCEPTION                                   │
 │                              ▼               ▼                                                        │
 │         ┌────────────────────────┐      ┌────────────────────────┐                                    │
 │         │ Update DB Status:      │      │ ErrorQueue Table:      │                                    │
 │         │ SUPPLIER_PLACED        │      │ • Out of stock         │                                    │
 │         │ Dispatch Resend Email  │      │ • Address invalid      │                                    │
 │         │ Notify Customer        │      │ • Slack Alert Admin    │                                    │
 │         └────────────────────────┘      └────────────────────────┘                                    │
 └───────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                ▲                                ▲
                                │                                │
                      CRON (Every 6 Hours)              WEBHOOK POLLER (Hourly)
               ┌───────────────────────────────┐  ┌─────────────────────────────────┐
               │ Supplier Stock & Price Worker │  │ Tracking Number Polling Worker  │
               │ • Auto-delist dead SKUs       │  │ • Pull tracking IDs from CJ/AE  │
               │ • Recompute 3x markup margins │  │ • Push to customer tracking page│
               └───────────────────────────────┘  └─────────────────────────────────┘
`;

  const copyDiagram = () => {
    navigator.clipboard.writeText(rawAsciiDiagram);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const flowSteps = [
    {
      step: 1,
      name: 'Checkout & Stripe Payment',
      actor: 'Customer & Stripe API',
      tech: 'Next.js App Router + Stripe Elements',
      description: 'Dog owner picks an anti-anxiety donut bed and mobility chews, inputs shipping details, and completes Apple Pay / credit card payment. Card data never touches your servers (100% PCI SAQ A compliant).',
      detailCode: `// /app/api/checkout/route.ts
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: validatedCartItems,
  customer_email: address.email,
  metadata: { orderId: internalOrder.id }
});`,
      icon: CreditCard,
      status: 'Ready',
    },
    {
      step: 2,
      name: 'Stripe Webhook Verification & Idempotency',
      actor: 'Next.js API Route (/api/webhooks/stripe)',
      tech: 'Node.js crypto + Prisma DB',
      description: 'Receives payment_intent.succeeded webhook. Checks event.id against WebhookLog to prevent duplicate fulfillment if Stripe resends. Records order as PAID in PostgreSQL.',
      detailCode: `// /app/api/webhooks/stripe/route.ts
const sig = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
if (event.type === 'payment_intent.succeeded') {
  await queueSupplierFulfillment({ orderId: event.data.object.metadata.orderId });
}`,
      icon: ShieldCheck,
      status: 'Verified',
    },
    {
      step: 3,
      name: 'Decoupled Job Queue (BullMQ + Redis)',
      actor: 'Queue Broker',
      tech: 'BullMQ + Upstash Redis',
      description: 'Why NOT auto-order directly inside the Stripe webhook? Webhooks timeout after 10-15s, and supplier APIs frequently take 4-8s or experience transient rate limits. Decoupling into a queue gives guaranteed delivery, auto-retries, and concurrency limits.',
      detailCode: `// /lib/queue.ts
await supplierQueue.add('fulfill_order', { orderId }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
  removeOnComplete: 1000
});`,
      icon: Boxes,
      status: 'Enqueued',
    },
    {
      step: 4,
      name: 'Worker Fulfillment & Supplier Routing',
      actor: 'Railway Background Worker',
      tech: 'TypeScript Worker + Supplier Adapters',
      description: 'Worker retrieves order items, looks up SupplierProduct mappings. If SKU maps to CJ Dropshipping, invokes CJAdapter.placeOrder(). If AliExpress, invokes AliExpressAdapter.placeOrder(). Uses pre-funded wallet or credit line.',
      detailCode: `// /workers/orderFulfillmentWorker.ts
for (const item of order.items) {
  const mapping = await prisma.supplierProduct.findUnique({ where: { sku: item.sku } });
  const adapter = getSupplierAdapter(mapping.supplierType);
  const supplierOrder = await adapter.placeOrder({
    supplierVariantId: mapping.supplierVariantId,
    shippingAddress: order.shippingAddress,
    customerNotes: 'Dropshipping order - NO PROMOTIONAL INVOICE'
  });
}`,
      icon: Server,
      status: 'Executing',
    },
    {
      step: 5,
      name: 'Tracking Ingestion & Customer Updates',
      actor: 'Sync Worker & Resend Email',
      tech: 'Scheduled Cron + Resend / SendGrid',
      description: 'When CJ / AliExpress marks the package as dispatched and issues a tracking number (e.g., USPS 9400...), the poller records it in TrackingEvent and emails the customer a branded tracking portal link.',
      detailCode: `// /workers/trackingSyncWorker.ts
const tracking = await adapter.getTracking(supplierOrder.supplierOrderId);
if (tracking?.trackingNumber) {
  await prisma.supplierOrder.update({ where: { id }, data: { trackingNumber: tracking.trackingNumber } });
  await sendTrackingEmail({ to: order.customer.email, trackingNumber: tracking.trackingNumber });
}`,
      icon: Truck,
      status: 'Dispatched',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold mb-3">
              <Workflow className="w-3.5 h-3.5" />
              <span>Section 1: Automated Dropshipping System Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Zero-Touch Dog Care E-Commerce & Auto-Fulfillment Architecture
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Engineered for a solo developer prioritizing reliability, idempotency, and automated revenue. 
              Orders flow from your Next.js storefront into a resilient queue worker that seamlessly routes SKUs to 
              <strong className="text-orange-400"> CJ Dropshipping</strong> and <strong className="text-amber-400">AliExpress</strong>, automatically handling currency conversion, address validation, and tracking feeds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onLaunchSimulator}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all transform active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Live Fulfillment Simulator</span>
            </button>
            <button
              onClick={copyDiagram}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied ASCII Diagram' : 'Copy ASCII Diagram'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Component Breakdown Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Boxes className="w-5 h-5 text-orange-500" />
          <span>Core System Components & Infrastructure Split</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">1. Storefront</h3>
            <p className="text-xs text-slate-400 mt-1">Next.js 14 App Router on Vercel</p>
            <ul className="text-[11px] text-slate-300 mt-2 space-y-1">
              <li>• Dog niche catalog & size filters</li>
              <li>• Instant Stripe checkout</li>
              <li>• Self-service order tracking</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">2. Admin Portal</h3>
            <p className="text-xs text-slate-400 mt-1">Authenticated Next.js Dashboard</p>
            <ul className="text-[11px] text-slate-300 mt-2 space-y-1">
              <li>• Real-time margins & revenues</li>
              <li>• SKU mapping editor</li>
              <li>• 1-Click Error Queue resolution</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">3. Auto-Order Worker</h3>
            <p className="text-xs text-slate-400 mt-1">Railway Daemon (BullMQ)</p>
            <ul className="text-[11px] text-slate-300 mt-2 space-y-1">
              <li>• Decoupled background execution</li>
              <li>• CJ Open API & AE Adapter</li>
              <li>• Blind-dropship instructions</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">4. Sync Worker</h3>
            <p className="text-xs text-slate-400 mt-1">Scheduled Cron Daemon</p>
            <ul className="text-[11px] text-slate-300 mt-2 space-y-1">
              <li>• 6-Hour stock & price polling</li>
              <li>• Auto-hide zero stock items</li>
              <li>• 1-Hour tracking ingest</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">5. Error Queue</h3>
            <p className="text-xs text-slate-400 mt-1">Fault-Tolerant Circuit</p>
            <ul className="text-[11px] text-slate-300 mt-2 space-y-1">
              <li>• Dead-letter queue table</li>
              <li>• Telegram / Slack instant alert</li>
              <li>• Address edit & manual re-trigger</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Data Flow Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-800 gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Workflow className="w-5 h-5 text-orange-500" />
              <span>End-to-End Data Flow: From Customer Cart to Supplier Doorstep</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Click any stage to view architectural logic and source code excerpt</p>
          </div>
          <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
            Step {selectedFlowStep} of 5 Active
          </span>
        </div>

        {/* Step buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-6">
          {flowSteps.map((step) => {
            const Icon = step.icon;
            const isSelected = selectedFlowStep === step.step;
            return (
              <button
                key={step.step}
                onClick={() => setSelectedFlowStep(step.step)}
                className={`flex items-center space-x-2 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-orange-500/15 border-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Phase {step.step}</div>
                  <div className="text-xs font-semibold truncate">{step.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Deep Dive */}
        {(() => {
          const activeStep = flowSteps[selectedFlowStep - 1];
          const Icon = activeStep.icon;
          return (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{activeStep.name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span><strong>Actor:</strong> {activeStep.actor}</span>
                      <span>•</span>
                      <span className="text-orange-400 font-mono">{activeStep.tech}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    disabled={selectedFlowStep === 1}
                    onClick={() => setSelectedFlowStep((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
                  >
                    Previous
                  </button>
                  <button
                    disabled={selectedFlowStep === 5}
                    onClick={() => setSelectedFlowStep((prev) => Math.min(5, prev + 1))}
                    className="px-2.5 py-1 text-xs rounded-lg bg-orange-600 text-white disabled:opacity-40 hover:bg-orange-500"
                  >
                    Next Stage
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                {activeStep.description}
              </p>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="flex items-center space-x-1.5 font-mono">
                    <FileCode className="w-3.5 h-3.5 text-orange-400" />
                    <span>Implementation Blueprint Snippet</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">TypeScript / Node.js</span>
                </div>
                <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs font-mono text-emerald-300 overflow-x-auto">
                  {activeStep.detailCode}
                </pre>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Critical Architecture Analysis: WHERE does Auto-Ordering happen? */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-orange-500" />
          <span>Architectural Decision: Webhook vs. Queue vs. Cron for Auto-Ordering</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          A common beginner mistake is calling the supplier API directly inside the Stripe Webhook handler. Here is why the hybrid 
          <strong> Webhook → Queue Worker </strong> architecture is mandatory for production ecommerce.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/70 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Option A: Synchronous Webhook</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">Anti-Pattern</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Calling CJ or AliExpress directly inside <code className="text-red-300">/api/webhooks/stripe</code>.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5">
              <li className="text-red-400 font-medium">✗ Stripe times out after 10-15s if CJ API hangs</li>
              <li className="text-red-400 font-medium">✗ Stripe retries the webhook → duplicate orders placed on supplier!</li>
              <li className="text-red-400 font-medium">✗ If customer card succeeds but supplier fails, webhook fails entirely</li>
            </ul>
          </div>

          <div className="bg-slate-950/70 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Option B: Pure Cron Poller</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold">Sub-Optimal</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              A cron job runs every 10 minutes, querying DB for <code className="text-yellow-300">PAID</code> orders.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5">
              <li className="text-yellow-300 font-medium">~ Adds 5 to 15 minute delay before supplier order is placed</li>
              <li className="text-yellow-300 font-medium">~ DB polling locks rows or creates race conditions during scale</li>
              <li className="text-yellow-300 font-medium">~ Spike in traffic creates large batch bursts, hitting supplier rate limits</li>
            </ul>
          </div>

          <div className="bg-slate-950/70 border border-emerald-500/40 rounded-xl p-4 relative shadow-lg shadow-emerald-500/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Option C: Webhook → BullMQ Queue</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Selected Architecture</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Stripe webhook returns HTTP 200 in &lt;150ms, enqueuing a BullMQ job to Railway worker.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5">
              <li className="text-emerald-400 font-medium">✓ Guaranteed instant HTTP 200 back to Stripe (no webhook retry loops)</li>
              <li className="text-emerald-400 font-medium">✓ Automatic exponential backoff retry for transient network drops</li>
              <li className="text-emerald-400 font-medium">✓ Rate limit throttle: 2 calls/sec per supplier API keys</li>
              <li className="text-emerald-400 font-medium">✓ Atomic idempotency lock ensures no double-purchase</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Failure Handling & Self-Healing Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
          <AlertOctagon className="w-5 h-5 text-orange-500" />
          <span>Failure Handling & Self-Healing Matrix</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Automated dropshipping creates edge cases. Here is how PawDrop gracefully handles every failure scenario without dropping money or losing customers.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3">Failure Scenario</th>
                <th className="py-3 px-3">Root Cause</th>
                <th className="py-3 px-3">System Automated Action</th>
                <th className="py-3 px-3">Customer Experience</th>
                <th className="py-3 px-3">Admin Action Required?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Supplier Out of Stock</span>
                </td>
                <td className="py-3 px-3 text-slate-400">Inventory depleted between customer checkout and supplier API call</td>
                <td className="py-3 px-3 font-mono text-[11px] text-amber-300">
                  1. Check backup supplier (CJ ↔ AE)<br />
                  2. If none, push to ErrorQueue<br />
                  3. Delist SKU from storefront
                </td>
                <td className="py-3 px-3 text-slate-400">Order stays "Processing". If unresolvable in 24h, auto-refund with friendly apology email.</td>
                <td className="py-3 px-3 font-semibold text-amber-400">Yes (Choose alt SKU or 1-Click Refund)</td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Invalid Address / PO Box</span>
                </td>
                <td className="py-3 px-3 text-slate-400">Supplier express line does not accept PO Box or postal code format mismatch</td>
                <td className="py-3 px-3 font-mono text-[11px] text-amber-300">
                  Worker fails address validation; marks Order as NEEDS_ADDRESS_UPDATE. Auto-sends email with secure address correction link.
                </td>
                <td className="py-3 px-3 text-slate-400">Customer receives email: "Please confirm your street address for courier dispatch."</td>
                <td className="py-3 px-3 text-emerald-400">No (Customer self-service, or 1-click override)</td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Supplier API Timeout (504/502)</span>
                </td>
                <td className="py-3 px-3 text-slate-400">AliExpress or CJ servers experiencing high load or gateway blip</td>
                <td className="py-3 px-3 font-mono text-[11px] text-emerald-300">
                  BullMQ retries with Exponential Backoff (5s, 25s, 125s). If all 3 attempts fail, job moves to Dead Letter Queue.
                </td>
                <td className="py-3 px-3 text-slate-400">Zero impact. Customer sees order is confirmed.</td>
                <td className="py-3 px-3 text-slate-400">Rare (Auto-retried in next hourly cycle)</td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Low Pre-Funded Supplier Balance</span>
                </td>
                <td className="py-3 px-3 text-slate-400">CJ Wallet or AE Dropship balance insufficient to clear wholesale fee</td>
                <td className="py-3 px-3 font-mono text-[11px] text-red-300">
                  Job halts gracefully. Dispatches high-priority alert to Telegram/Slack: "CJ Wallet balance under $50 threshold".
                </td>
                <td className="py-3 px-3 text-slate-400">Order stays queued safely in DB. No order dropped.</td>
                <td className="py-3 px-3 font-semibold text-red-400">Yes (Top-up CJ wallet; then hit "Retry All" in Admin)</td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="py-3 px-3 font-semibold text-white flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Duplicate Stripe Webhooks</span>
                </td>
                <td className="py-3 px-3 text-slate-400">Stripe network re-attempts sending the same payment_intent webhook</td>
                <td className="py-3 px-3 font-mono text-[11px] text-emerald-300">
                  Database uniqueness constraint on `stripePaymentIntentId` + Redis idempotency key locks identical duplicate. Immediate 200 response.
                </td>
                <td className="py-3 px-3 text-slate-400">Single order confirmation, zero double-charges.</td>
                <td className="py-3 px-3 text-emerald-400">Zero (Fully automated)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
