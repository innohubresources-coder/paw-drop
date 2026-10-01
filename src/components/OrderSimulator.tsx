import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  RotateCcw, 
  ShieldCheck, 
  Truck, 
  Zap,
  ArrowRight,
  Database,
  Layers
} from 'lucide-react';
import { WebhookLogEntry } from '../types/dropship';

interface OrderSimulatorProps {
  logs: WebhookLogEntry[];
  onTriggerSimulation: (scenario: 'SUCCESS' | 'OUT_OF_STOCK' | 'INVALID_ADDRESS' | 'API_TIMEOUT') => void;
  isSimulating: boolean;
  activeScenario: string | null;
  onClearLogs: () => void;
}

export const OrderSimulator: React.FC<OrderSimulatorProps> = ({
  logs,
  onTriggerSimulation,
  isSimulating,
  activeScenario,
  onClearLogs,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'SUCCESS' | 'OUT_OF_STOCK' | 'INVALID_ADDRESS' | 'API_TIMEOUT'>('SUCCESS');

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Section 4: Auto-Order Worker Runtime Simulator</span>
            </div>
            <h2 className="text-xl font-black text-white">Interactive Order Fulfillment Engine</h2>
            <p className="text-xs text-slate-400 mt-1">
              Simulate end-to-end webhook ingestion, BullMQ background job processing, SKU mapping, and supplier API calls.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClearLogs}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl transition-all"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="pt-6 space-y-4">
          <label className="text-xs font-bold text-slate-300 block">
            Select Simulation Scenario to Fire:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              disabled={isSimulating}
              onClick={() => setSelectedScenario('SUCCESS')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedScenario === 'SUCCESS'
                  ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-400">Happy Path Order</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Valid address, in-stock SKU, CJ Open API auto-creates order & provides instant tracking code.
              </p>
            </button>

            <button
              disabled={isSimulating}
              onClick={() => setSelectedScenario('INVALID_ADDRESS')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedScenario === 'INVALID_ADDRESS'
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-amber-400">Invalid PO Box</span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Customer inputs PO Box. Express carrier rejects. Worker pushes to ErrorQueue & alerts admin.
              </p>
            </button>

            <button
              disabled={isSimulating}
              onClick={() => setSelectedScenario('OUT_OF_STOCK')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedScenario === 'OUT_OF_STOCK'
                  ? 'bg-red-500/15 border-red-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-red-400">Supplier Out-of-Stock</span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Supplier variant depleted. Auto-routing attempts backup supplier, then halts safely.
              </p>
            </button>

            <button
              disabled={isSimulating}
              onClick={() => setSelectedScenario('API_TIMEOUT')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedScenario === 'API_TIMEOUT'
                  ? 'bg-blue-500/15 border-blue-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-blue-400">Supplier API 504 Timeout</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                Supplier gateway drops connection. BullMQ triggers exponential backoff retry.
              </p>
            </button>
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              disabled={isSimulating}
              onClick={() => onTriggerSimulation(selectedScenario)}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-orange-500/25 disabled:opacity-40 transition-all"
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Processing Worker Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Scenario in Worker Engine</span>
                </>
              )}
            </button>

            <span className="text-xs text-slate-400">
              Target: <strong className="text-slate-200">Worker Node v20 (Railway Daemon)</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Terminal / Logs Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 ml-2">
              PawDrop Fulfillment Daemon — stdout/stderr stream
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            ONLINE • BULLMQ V5
          </span>
        </div>

        <div className="p-4 font-mono text-xs space-y-2 max-h-96 overflow-y-auto bg-slate-950">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2.5">
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                log.source === 'STRIPE'
                  ? 'bg-blue-500/20 text-blue-400'
                  : log.source === 'CJ_DROPSHIPPING'
                  ? 'bg-orange-500/20 text-orange-400'
                  : log.source === 'ALIEXPRESS'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-purple-500/20 text-purple-400'
              }`}>
                {log.source}
              </span>
              <span className={`font-semibold shrink-0 ${
                log.status === 'SUCCESS' ? 'text-emerald-400' : log.status === 'WARNING' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {log.event}:
              </span>
              <span className="text-slate-300 leading-relaxed">{log.details}</span>
            </div>
          ))}

          {isSimulating && (
            <div className="flex items-center space-x-2 text-amber-400 animate-pulse pt-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Worker executing async step...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
