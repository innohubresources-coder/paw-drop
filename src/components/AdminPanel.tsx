import React, { useState } from 'react';
import { 
  CustomerOrder, 
  ErrorQueueItem, 
  DogProduct, 
  SupplierType 
} from '../types/dropship';
import { 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  Truck, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  PlusCircle, 
  Settings, 
  Search, 
  ArrowUpRight,
  Sparkles,
  Link,
  ShieldAlert,
  Edit3
} from 'lucide-react';

interface AdminPanelProps {
  orders: CustomerOrder[];
  errorQueue: ErrorQueueItem[];
  products: DogProduct[];
  onRetryError: (errorId: string) => void;
  onManualFulfill: (orderId: string) => void;
  onRefundOrder: (orderId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  errorQueue,
  products,
  onRetryError,
  onManualFulfill,
  onRefundOrder,
}) => {
  const [adminTab, setAdminTab] = useState<'orders' | 'errors' | 'skus' | 'import' | 'settings'>('orders');
  
  // Importer state
  const [importUrl, setImportUrl] = useState<string>('https://cjdropshipping.com/product/orthopedic-pet-mattress-7731.html');
  const [markupMultiplier, setMarkupMultiplier] = useState<number>(3.0);
  const [importingState, setImportingState] = useState<'idle' | 'fetching' | 'success'>('idle');

  // Supplier Settings State
  const [cjToken, setCjToken] = useState<string>('cjwt_984f828a8d11099238910bfe821');
  const [aeKey, setAeKey] = useState<string>('50391823');
  const [aeSecret, setAeSecret] = useState<string>('••••••••••••••••••••••••••••••••');
  const [warehousePriority, setWarehousePriority] = useState<string>('US_DOMESTIC_FIRST');

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalWholesale = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.supplierCost * i.quantity, 0),
    0
  );
  const netMargin = totalRevenue - totalWholesale;
  const marginPercentage = totalRevenue > 0 ? Math.round((netMargin / totalRevenue) * 100) : 0;

  const handleSimulateImport = () => {
    setImportingState('fetching');
    setTimeout(() => {
      setImportingState('success');
      setTimeout(() => setImportingState('idle'), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & KPI Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Dropship Fulfillment Command Center</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Live Edge Sync
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-supplier automation engine routing to CJ Dropshipping and AliExpress
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Worker Queue: Healthy (0.2s latency)</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Sales Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">${totalRevenue.toFixed(2)}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.5% vs yesterday</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Net Dropship Profit</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400">
              {marginPercentage}%
            </span>
          </div>
          <div className="text-2xl font-black text-orange-400 font-mono">${netMargin.toFixed(2)}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Wholesale Cost: ${totalWholesale.toFixed(2)}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Orders Dispatched</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{orders.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            100% Automated placement
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Failed Auto-Orders</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{errorQueue.length}</div>
          <div className="text-[11px] text-red-400/80 mt-1">
            Requires address or stock review
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setAdminTab('orders')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            adminTab === 'orders'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setAdminTab('errors')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            adminTab === 'errors'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <span>Error Queue</span>
          {errorQueue.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {errorQueue.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('skus')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            adminTab === 'skus'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          SKU Mapping Matrix
        </button>

        <button
          onClick={() => setAdminTab('import')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1 ${
            adminTab === 'import'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Product Importer (CJ / AE)</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1 ${
            adminTab === 'settings'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Supplier Credentials</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {adminTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Customer Orders & Auto-Order Status</h3>
            <span className="text-xs text-slate-400">Auto-refreshed via Webhook sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/40">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items & SKU</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Supplier Routing</th>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((order) => {
                  const supOrder = order.supplierOrders[0];
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {order.orderNumber}
                        <div className="text-[10px] text-slate-500 font-sans">{order.createdAt}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{order.customer.name}</div>
                        <div className="text-slate-400 text-[11px] truncate max-w-[150px]">{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="mb-1">
                            <span className="font-semibold text-white">{item.quantity}x {item.productTitle}</span>
                            <div className="font-mono text-[10px] text-slate-400">
                              SKU: {item.sku}
                            </div>
                          </div>
                        ))}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ${order.total.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        {supOrder ? (
                          <div className="space-y-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                              supOrder.supplier === 'CJ_DROPSHIPPING'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {supOrder.supplier === 'CJ_DROPSHIPPING' ? 'CJ Dropshipping' : 'AliExpress'}
                            </span>
                            <div className="text-[10px] font-mono text-slate-400">
                              {supOrder.supplierOrderNumber || 'Status: ' + supOrder.status}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Unassigned</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        {supOrder?.trackingNumber ? (
                          <a
                            href={supOrder.trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-emerald-400 hover:underline text-[11px]"
                          >
                            <span>{supOrder.trackingNumber}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : supOrder?.status === 'FAILED' ? (
                          <span className="text-red-400 font-semibold text-[11px]">Auto-Placement Failed</span>
                        ) : (
                          <span className="text-amber-400 text-[11px]">Processing with supplier</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          {supOrder?.status === 'FAILED' ? (
                            <button
                              onClick={() => onManualFulfill(order.id)}
                              className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[10px] flex items-center space-x-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Retry</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onRefundOrder(order.id)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 text-[10px]"
                            >
                              Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ERROR QUEUE */}
      {adminTab === 'errors' && (
        <div className="space-y-4">
          <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-4 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white">Dead Letter / Error Queue Active</h4>
                <p className="text-slate-300 mt-0.5">
                  When a supplier API rejects an order (e.g. PO Box rejection, stock run-out, or card decline), the worker stops retry loops and puts it here with zero customer double-charges.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {errorQueue.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <span>Zero failed auto-orders! The queue is clean and all supplier syncs succeeded.</span>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {errorQueue.map((err) => (
                  <div key={err.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white text-sm">{err.orderNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          {err.errorCode}
                        </span>
                        <span className="text-slate-400 text-xs">Supplier: {err.supplier}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">
                        {err.reason}
                      </p>
                      <div className="text-[11px] font-mono text-slate-400">
                        Payload: {JSON.stringify(err.payload)} • Retry Attempts: {err.retryAttempts}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onRetryError(err.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-md"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Fix Address & Retry Placement</span>
                      </button>

                      <button
                        onClick={() => onRefundOrder(err.orderId)}
                        className="bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-300 text-xs px-3 py-2 rounded-xl transition-all"
                      >
                        Stripe Refund
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SKU MAPPING MATRIX */}
      {adminTab === 'skus' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Internal SKU ↔ Supplier Product ID Mapping</h3>
              <p className="text-xs text-slate-400">Every store SKU connects to a supplier variant ID for 100% automated ordering.</p>
            </div>
            <button className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Map New SKU</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/40">
                  <th className="py-3 px-4">Internal Store SKU</th>
                  <th className="py-3 px-4">Product & Variant</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Supplier Variant ID</th>
                  <th className="py-3 px-4">Wholesale Cost</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Markup Multiplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {products.flatMap((p) =>
                  p.variants.map((v) => {
                    const markup = (v.price / v.supplierCost).toFixed(2);
                    return (
                      <tr key={v.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-bold text-white">{v.sku}</td>
                        <td className="py-3 px-4 font-sans">
                          <span className="font-semibold text-slate-200">{p.title}</span>
                          <div className="text-[11px] text-slate-400">{v.name}</div>
                        </td>
                        <td className="py-3 px-4 font-sans">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.supplierType === 'CJ_DROPSHIPPING' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {p.supplierType === 'CJ_DROPSHIPPING' ? 'CJ Dropshipping' : 'AliExpress'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-emerald-400">{v.cjVariantId || v.aeVariantId || 'N/A'}</td>
                        <td className="py-3 px-4">${v.supplierCost.toFixed(2)}</td>
                        <td className="py-3 px-4 text-white font-bold">${v.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-orange-400 font-bold">{markup}x</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCT IMPORTER */}
      {adminTab === 'import' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span>Automated Product Importer & AI SEO Staging</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Paste any CJ Dropshipping or AliExpress product link. The system pulls all supplier variants, images, wholesale costs, calculates 3x markup, and generates SEO dog copy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-300">Supplier Product URL or SKU ID:</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="https://cjdropshipping.com/product/..."
                />
                <button
                  onClick={handleSimulateImport}
                  disabled={importingState === 'fetching'}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-md shrink-0"
                >
                  {importingState === 'fetching' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scraping Specs...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Fetch & Import</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Auto Pricing Markup Multiplier:</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={markupMultiplier}
                  onChange={(e) => setMarkupMultiplier(parseFloat(e.target.value) || 3.0)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white w-24 font-mono font-bold"
                />
                <span className="text-xs text-slate-400">
                  (Default: 3.0x markup covering ads & shipping)
                </span>
              </div>
            </div>
          </div>

          {importingState === 'success' && (
            <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 text-xs text-slate-300 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Successfully Imported Product from CJ Dropshipping API!</span>
              </div>
              <p>
                Created Product: <strong>"VetPosture™ Orthopedic Therapeutic Memory Foam Joint Mattress"</strong> with 2 variants.
                Supplier Cost: $22.00 → Auto-Calculated Selling Price: $79.99 (68% margin). Images downloaded and staged.
              </p>
            </div>
          )}

          {/* Pricing Formula Explanation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
            <h4 className="font-bold text-white">Dynamic Pricing Engine Formula:</h4>
            <p className="font-mono text-amber-300">
              Retail Price = (Supplier Base Cost + Estimated Direct Shipping) × {markupMultiplier}x Buffer
            </p>
            <p className="text-slate-400 text-[11px]">
              Ensures minimum 60% gross profit after Facebook/TikTok Ad CAC ($12-18/sale) and Stripe payment fees (2.9% + 30¢).
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: SUPPLIER CREDENTIALS */}
      {adminTab === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <Settings className="w-5 h-5 text-orange-400" />
              <span>Supplier API Connections & Pre-Funded Balances</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure OAuth tokens, API keys, and automated wallet deduction rules for CJ Dropshipping and AliExpress Open Platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CJ Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <h4 className="font-bold text-white text-sm">CJ Dropshipping Open API v2</h4>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                  Wallet: $418.50
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">CJ API Access Token:</label>
                  <input
                    type="password"
                    value={cjToken}
                    onChange={(e) => setCjToken(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                  />
                </div>
                <div className="text-[11px] text-slate-500">
                  Auto-refreshed via cron every 14 days using CJ refreshToken flow.
                </div>
              </div>
            </div>

            {/* AliExpress Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <h4 className="font-bold text-white text-sm">AliExpress Dropshipping API / DSers</h4>
                </div>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                  Active Token
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">App Key:</label>
                  <input
                    type="text"
                    value={aeKey}
                    onChange={(e) => setAeKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">App Secret:</label>
                  <input
                    type="password"
                    value={aeSecret}
                    onChange={(e) => setAeSecret(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Warehouse Fulfillment Preference</span>
              <span className="text-[11px] text-slate-400">Prioritize local US/EU domestic warehouses over China direct air-freight</span>
            </div>
            <select
              value={warehousePriority}
              onChange={(e) => setWarehousePriority(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="US_DOMESTIC_FIRST">US Domestic Warehouses First (2-5 days)</option>
              <option value="LOWEST_COST">Lowest Cost Line (6-10 days)</option>
              <option value="CJ_PACKET_FAST">CJ Packet Fast Line Only</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
