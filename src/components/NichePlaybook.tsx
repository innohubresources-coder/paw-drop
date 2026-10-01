import React from 'react';
import { 
  Sparkles, 
  Video, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import { DOG_PRODUCTS } from '../data/dogProducts';

export const NichePlaybook: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = React.useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const tiktokHooks = [
    { hook: "If your dog sleeps like THIS... check their bed immediately 😳🐾", angle: "Fear / Curiosity (Anxiety Donut Bed)" },
    { hook: "Veterinarians don't want you to know how easy deshedding actually is...", angle: "Contrarian / Life Hack (FurSweep Rake)" },
    { hook: "POV: You bought that viral $24 brush from TikTok and your dog looks like a cloud", angle: "Satisfying Visual Transformation" },
    { hook: "I thought my dog was just getting old, until our vet showed me this mobility routine...", angle: "Emotional / Senior Dog Hip Chews" },
    { hook: "Stop clipping your dog's nails with clippers! Look at this LED diamond grinder...", angle: "Pain-Point Solution (No More Bleeding)" },
    { hook: "This $18 gadget keeps muddy paw prints off my clean cream rugs forever", angle: "Household Cleanliness / MudBuster Washer" },
    { hook: "My dog used to panic during thunderstorms until we tried this 1 gentle wrap trick", angle: "Empathy / Calming Compression Vest" },
    { hook: "My dog ate his dinner in 8 seconds flat. Here's why that terrified me...", angle: "Health Urgency / Anti-Bloat Slow Feeder" },
    { hook: "Amazon charges $89 for this tactical harness, but here is the exact manufacturer version...", angle: "Price Anchor / High Perceived Value" },
    { hook: "Solo dog owners: this suction cup tug toy keeps my German Shepherd busy for 2 hours", angle: "Busy Owner Convenience / Boredom Relief" }
  ];

  const emailSubjectLines = [
    { subject: "🐾 Is your pup sleeping deeply enough? (Quick check inside)", openRate: "48.2%", type: "Welcome / Education" },
    { subject: "Stop the shedding storm in under 5 minutes 🌪️", openRate: "42.1%", type: "Product Spotlight" },
    { subject: "Quick heads-up about [DogName]'s upcoming joint stiffness...", openRate: "45.7%", type: "Consumable Chews Reminder" },
    { subject: "Why 84% of dogs secretly fear regular nail clippers 😱", openRate: "49.0%", type: "Curiosity Click" },
    { subject: "Exclusive VIP Dog Parent discount expires tonight (Save 25%)", openRate: "39.8%", type: "Urgency Flash Sale" }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Section 12: Dog Care High-Margin Niche Playbook</span>
        </div>
        <h1 className="text-2xl font-black text-white">Dog Care Dropshipping Strategy & Conversion Assets</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          The dog care niche boasts unmatched emotional buyer attachment, recurring consumable replenishment (chews, balms), and high impulse-buying behavior on short-form video ads.
        </p>
      </div>

      {/* 20 Starter Products Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">20 Curated Starter Products (CJ & AliExpress Direct)</h3>
            <p className="text-xs text-slate-400">Targeting minimum 60% gross margin and low return rates (&lt;1.8%).</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            Avg Margin: 69.4%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/40">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Product Title</th>
                <th className="py-3 px-4">Niche Category</th>
                <th className="py-3 px-4">Supplier Search Keyword</th>
                <th className="py-3 px-4">Est. Cost</th>
                <th className="py-3 px-4">Retail</th>
                <th className="py-3 px-4">Gross Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {DOG_PRODUCTS.map((prod, idx) => {
                const cost = prod.variants[0]?.supplierCost || 0;
                const price = prod.variants[0]?.price || 0;
                const margin = Math.round(((price - cost) / price) * 100);
                return (
                  <tr key={prod.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3 px-4 font-semibold text-white">{prod.title}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{prod.supplierProductId}</td>
                    <td className="py-3 px-4 font-mono text-amber-300">${cost.toFixed(2)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">${price.toFixed(2)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{margin}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TikTok / Reels Viral Hooks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-white text-base">10 Viral TikTok / Reels Hooks</h3>
          </div>
          <p className="text-xs text-slate-400">Tested angles triggering high CTR on TikTok Organic and Spark Ads.</p>

          <div className="space-y-2">
            {tiktokHooks.map((item, i) => (
              <div
                key={i}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between group hover:border-slate-700"
              >
                <div className="pr-3">
                  <p className="font-medium text-slate-200">"{item.hook}"</p>
                  <span className="text-[10px] text-orange-400 font-mono mt-0.5 inline-block">
                    Angle: {item.angle}
                  </span>
                </div>
                <button
                  onClick={() => copyText(item.hook, `tiktok-${i}`)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  {copiedIndex === `tiktok-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* High-Converting Email Sequences */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-white text-base">5 High-Open Email Subject Lines</h3>
          </div>
          <p className="text-xs text-slate-400">Tailored Klaviyo / Resend flows for post-purchase and abandonment.</p>

          <div className="space-y-2.5">
            {emailSubjectLines.map((item, i) => (
              <div
                key={i}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between group hover:border-slate-700"
              >
                <div>
                  <p className="font-medium text-slate-200">{item.subject}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1 font-mono">
                    <span className="text-emerald-400 font-bold">{item.openRate} Avg Open</span>
                    <span>•</span>
                    <span className="text-amber-400">{item.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => copyText(item.subject, `email-${i}`)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                >
                  {copiedIndex === `email-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>

          {/* Sample Product Page Copy: Deshedding Brush */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-orange-400" />
                <span>Sample High-Converting PDP Copy Template (FurSweep Rake)</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <p><strong>Headline:</strong> "Tired of Fur on Your Clothes, Couches, and Morning Coffee?"</p>
              <p><strong>Subhead:</strong> Regular brushes only scratch the surface. The FurSweep Dual-Action Undercoat Rake gently removes up to 95% of trapped, dead loose hair from dense undercoats without scratching your pup's sensitive skin.</p>
              <p><strong>Feature Bullets:</strong></p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                <li>Double-Sided 17+9 Rounded Steel Safety Teeth</li>
                <li>Reduces Household Allergens & Odors in 10 Minutes</li>
                <li>Ergonomic Non-Slip Silicone Grip</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
