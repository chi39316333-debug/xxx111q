import React, { useState } from "react";
import { 
  DollarSign, Check, X, FileText, CheckCircle2, AlertTriangle, ChevronRight, 
  ArrowUpRight, Users, TrendingUp, Calendar, Plus, Trash2
} from "lucide-react";
import { MoneyItem, BillItem, InvoiceItem } from "../../types";

interface FinanceModuleProps {
  payouts: MoneyItem[];
  bills: BillItem[];
  invoices: InvoiceItem[];
  onAddPayout: (payout: MoneyItem) => void;
  onDeletePayout: (id: string) => void;
  onAddBill: (bill: BillItem) => void;
  onDeleteBill: (id: string) => void;
  onAddInvoice: (inv: InvoiceItem) => void;
  onDeleteInvoice: (id: string) => void;
  onUpdatePayoutStatus: (id: string, status: "审核中" | "已放款" | "已驳回") => void;
}

export default function FinanceModule({
  payouts,
  bills,
  invoices,
  onAddPayout,
  onDeletePayout,
  onAddBill,
  onDeleteBill,
  onAddInvoice,
  onDeleteInvoice,
  onUpdatePayoutStatus
}: FinanceModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"audit" | "bills" | "invoices" | "compliance">("audit");

  // Dynamic Stripe Connect & Tax compliance states
  const [stripeSharePercent, setStripeSharePercent] = useState(15);
  const [stripeTxVal, setStripeTxVal] = useState(1000);
  const [convBase, setConvBase] = useState("EUR");
  const [convTarget, setConvTarget] = useState("USD");
  const [convAmt, setConvAmt] = useState(100);
  const [vatCountry, setVatCountry] = useState("DE");
  const [vatSignerName, setVatSignerName] = useState("");
  const [vatSigned, setVatSigned] = useState(false);

  // Dialog togglers
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // New item form states
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPayoutAmount, setNewPayoutAmount] = useState(500);

  const [newCustomerName, setNewCustomerName] = useState("");
  const [newBillAmount, setNewBillAmount] = useState(199);
  const [newBillStatus, setNewBillStatus] = useState<"已付" | "未付">("已付");

  const [newInvStore, setNewInvStore] = useState("");
  const [newInvAmount, setNewInvAmount] = useState(199);
  const [newInvTax, setNewInvTax] = useState(15);

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim()) {
      alert("请输入开发者/合作商名字");
      return;
    }
    const fresh: MoneyItem = {
      id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
      partnerName: newPartnerName,
      amount: Number(newPayoutAmount),
      status: "审核中",
      time: new Date().toLocaleString()
    };
    onAddPayout(fresh);
    setNewPartnerName("");
    setShowPayoutModal(false);
  };

  const handleBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) {
      alert("请输入付款商户/租户名");
      return;
    }
    const fresh: BillItem = {
      id: `BIL-${Math.floor(100 + Math.random() * 900)}`,
      customerName: newCustomerName,
      amount: Number(newBillAmount),
      status: newBillStatus,
      time: new Date().toISOString().substring(0, 10)
    };
    onAddBill(fresh);
    setNewCustomerName("");
    setShowBillModal(false);
  };

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvStore.trim()) {
      alert("请输入店铺主体名");
      return;
    }
    const fresh: InvoiceItem = {
      id: `INV-${Math.floor(100 + Math.random() * 900)}`,
      storeName: newInvStore,
      amount: Number(newInvAmount),
      tax: Number(newInvTax),
      time: new Date().toISOString().substring(0, 10)
    };
    onAddInvoice(fresh);
    setNewInvStore("");
    setShowInvoiceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Cards summary for accounting (Section 13 of spec) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-shopify p-4 flex justify-between items-center bg-white">
          <div>
            <span className="text-[11px] text-[#6d7175] font-bold">平台总账余额</span>
            <p className="text-xl font-bold text-[#202223] mt-1 font-mono">€{ (payouts.reduce((acc, p) => acc + (p.status === "已放款" ? p.amount : 0), 0) + 12400).toFixed(2) }</p>
          </div>
          <div className="p-2 bg-emerald-50 rounded-lg text-[#008060]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="card-shopify p-4 flex justify-between items-center bg-white">
          <div>
            <span className="text-[11px] text-[#6d7175] font-bold">提现待审金额</span>
            <p className="text-xl font-bold text-amber-600 mt-1 font-mono">€{ payouts.filter(p => p.status === "审核中").reduce((acc, p) => acc + p.amount, 0).toFixed(2) }</p>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="card-shopify p-4 flex justify-between items-center bg-white">
          <div>
            <span className="text-[11px] text-[#6d7175] font-bold">平台基础扣税项</span>
            <p className="text-xl font-bold text-gray-800 mt-1 font-mono">€{ invoices.reduce((acc, i) => acc + i.tax, 0).toFixed(2) }</p>
          </div>
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="card-shopify p-4 flex justify-between items-center bg-white">
          <div>
            <span className="text-[11px] text-[#6d7175] font-bold">分账结算渠道扣率</span>
            <p className="text-xl font-bold text-[#202223] mt-1 font-mono">2.8%</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg text-[#2c6ecb]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex border-b border-[#e1e3e5] justify-between items-center text-sm font-bold text-[#6d7175]">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveSubTab("audit")}
            className={`pb-2.5 transition cursor-pointer ${
              activeSubTab === "audit"
                ? "text-[#008060] border-b-2 border-[#008060] font-bold"
                : "hover:text-[#202223]"
            }`}
          >
            分账提现审核
          </button>
          <button
            onClick={() => setActiveSubTab("bills")}
            className={`pb-2.5 transition cursor-pointer ${
              activeSubTab === "bills"
                ? "text-[#008060] border-b-2 border-[#008060] font-bold"
                : "hover:text-[#202223]"
            }`}
          >
            租户对账清算
          </button>
          <button
            onClick={() => setActiveSubTab("invoices")}
            className={`pb-2.5 transition cursor-pointer ${
              activeSubTab === "invoices"
                ? "text-[#008060] border-b-2 border-[#008060] font-bold"
                : "hover:text-[#202223]"
            }`}
          >
            系统出海发票
          </button>
          <button
            onClick={() => setActiveSubTab("compliance")}
            className={`pb-2.5 transition cursor-pointer ${
              activeSubTab === "compliance"
                ? "text-[#008060] border-b-2 border-[#008060] font-bold"
                : "hover:text-[#202223]"
            }`}
          >
            Stripe Connect & 跨境合规
          </button>
        </div>

        {activeSubTab === "audit" && (
          <button
            onClick={() => setShowPayoutModal(true)}
            className="text-xs bg-[#008060] hover:bg-[#006e52] text-white py-1.5 px-3.5 rounded-md font-bold transition flex items-center gap-1 shadow-sm mb-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            新建提现单
          </button>
        )}
        {activeSubTab === "bills" && (
          <button
            onClick={() => setShowBillModal(true)}
            className="text-xs bg-[#008060] hover:bg-[#006e52] text-white py-1.5 px-3.5 rounded-md font-bold transition flex items-center gap-1 shadow-sm mb-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            记入对账单
          </button>
        )}
        {activeSubTab === "invoices" && (
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="text-xs bg-[#008060] hover:bg-[#006e52] text-white py-1.5 px-3.5 rounded-md font-bold transition flex items-center gap-1 shadow-sm mb-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            开票账期登记
          </button>
        )}
      </div>

      {activeSubTab === "audit" ? (
        /* Payout Audits List */
        <div className="card-shopify bg-white overflow-hidden animate-fade-in">
          <div className="overflow-x-auto text-xs font-sans text-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] font-bold">
                  <th className="py-3 px-4">提现单ID</th>
                  <th className="py-3 px-4">合伙开发者</th>
                  <th className="py-3 px-4">打款金额</th>
                  <th className="py-3 px-4">申请时间</th>
                  <th className="py-3 px-4">状态</th>
                  <th className="py-3 px-4 text-right">审核决策</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e5]">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors h-[52px]">
                    <td className="py-2 px-4 font-mono font-medium text-gray-500">{p.id}</td>
                    <td className="py-2 px-4 font-bold text-[#202223]">{p.partnerName}</td>
                    <td className="py-2 px-4 font-mono font-bold text-[#008060]">€{p.amount.toFixed(2)}</td>
                    <td className="py-2 px-4 font-mono text-gray-500">{p.time}</td>
                    <td className="py-2 px-4">
                      {p.status === "审核中" && (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-bold">
                          ● 待审核
                        </span>
                      )}
                      {p.status === "已放款" && (
                        <span className="inline-flex items-center gap-1 text-[#008060] bg-[#e2f1e4] px-2.5 py-0.5 rounded-full border border-[#bbe5b3] font-bold">
                          ● 已打款
                        </span>
                      )}
                      {p.status === "已驳回" && (
                        <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 font-bold">
                          ● 被驳回
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {p.status === "审核中" && (
                        <>
                          <button
                            onClick={() => onUpdatePayoutStatus(p.id, "已放款")}
                            className="inline-flex items-center gap-1 text-xs text-white bg-[#008060] hover:bg-[#006e52] font-bold py-1 px-2 hover:opacity-90 shadow-2xs cursor-pointer transition"
                          >
                            通过
                          </button>
                          <button
                            onClick={() => onUpdatePayoutStatus(p.id, "已驳回")}
                            className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-bold py-1 px-2 border border-red-200 rounded transition cursor-pointer"
                          >
                            拒绝
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => {
                          if (confirm(`物理废除该款项记录 ${p.id} 吗？`)) {
                            onDeletePayout(p.id);
                          }
                        }}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 font-bold p-1 rounded hover:bg-slate-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === "bills" ? (
        /* Bills table */
        <div className="card-shopify bg-white overflow-hidden animate-fade-in">
          <div className="overflow-x-auto text-xs font-sans text-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] font-bold">
                  <th className="py-3 px-4">对账清算号</th>
                  <th className="py-3 px-4">付款商户</th>
                  <th className="py-3 px-4">对账金额</th>
                  <th className="py-3 px-4">出入账周期</th>
                  <th className="py-3 px-4">清结算状态</th>
                  <th className="py-3 px-4 text-right">管理</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e5]">
                {bills.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/70 transition-colors h-[52px]">
                    <td className="py-2 px-4 font-mono font-medium text-gray-500">{b.id}</td>
                    <td className="py-2 px-4 font-bold text-gray-800">{b.customerName}</td>
                    <td className="py-2 px-4 font-mono font-bold">€{b.amount.toFixed(2)}</td>
                    <td className="py-2 px-4 font-mono text-[#6d7175]">{b.time}</td>
                    <td className="py-2 px-4 font-bold">
                      {b.status === "已付" ? (
                        <span className="inline-flex items-center gap-1 text-[#008060] bg-[#e2f1e4] px-2 py-0.5 rounded-full border border-[#bbe5b3]">
                          支付结算成功
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          清算处理中
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`删除此往来账单 ${b.id}?`)) {
                            onDeleteBill(b.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 rounded inline-block transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeSubTab === "invoices" ? (
        /* Outbound invoices table */
        <div className="card-shopify bg-white overflow-hidden animate-fade-in">
          <div className="overflow-x-auto text-xs font-sans text-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] font-bold">
                  <th className="py-3 px-4">出海发票代码</th>
                  <th className="py-3 px-4">对应店铺主体</th>
                  <th className="py-3 px-4">票面金额</th>
                  <th className="py-3 px-4">基础扣除税(7.5%)</th>
                  <th className="py-3 px-4">开具时间</th>
                  <th className="py-3 px-4 text-right">管理</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e5]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/70 transition-colors h-[52px]">
                    <td className="py-2 px-4 font-mono font-medium text-gray-500">{inv.id}</td>
                    <td className="py-2 px-4 font-bold text-gray-800">{inv.storeName}</td>
                    <td className="py-2 px-4 font-mono font-bold text-[#008060]">€{inv.amount.toFixed(2)}</td>
                    <td className="py-2 px-4 font-mono text-red-500">-€{inv.tax.toFixed(2)}</td>
                    <td className="py-2 px-4 font-mono text-[#6d7175]">{inv.time}</td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`撤废并删除发票记录 ${inv.id}?`)) {
                            onDeleteInvoice(inv.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 rounded inline-block transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Part 19: Stripe Connect & Cross-border Compliance */
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Split router customizer */}
            <div className="lg:col-span-6 card-shopify p-5 space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#008060] bg-[#e2f1e4] px-2 py-0.5 rounded border border-[#bbe5b3]">
                Stripe Connect カスタム Splits Router
              </span>
              <h3 className="text-sm font-bold text-gray-900">1. 两端动态资金分账与退保机制</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                企业入驻开发者商城或生态产品交易时，平台直接通过 Stripe Custom Accounts 实现原生底层资金划转与实时争议暂扣。
              </p>

              <div className="space-y-3.5 text-xs bg-slate-50 p-4 border border-slate-200 rounded">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-gray-700">
                    <span>平台提取提成 (Platform Fee %):</span>
                    <span className="font-mono text-[#008060] font-bold">{stripeSharePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    value={stripeSharePercent}
                    onChange={(e) => setStripeSharePercent(Number(e.target.value))}
                    className="w-full accent-[#008060] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>最小值 5%</span>
                    <span>最大值 45% (SaaS上限)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">模拟单笔成交金额 (EUR):</label>
                  <input
                    type="number"
                    value={stripeTxVal}
                    onChange={(e) => setStripeTxVal(Number(e.target.value))}
                    className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded font-mono font-bold"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-gray-500">平台收取分佣 (Platform Split Wallet):</span>
                    <span className="font-mono font-bold text-[#008060]">€{(stripeTxVal * stripeSharePercent / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">商户店主所得 (Merchant Connect Split):</span>
                    <span className="font-mono font-bold text-blue-600">€{(stripeTxVal * (100 - stripeSharePercent) / 100 * 0.95).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-dashed border-slate-200 pt-1.5">
                    <span>欺诈防范保证金 (Escrow Hold Back 5%):</span>
                    <span className="font-mono text-red-500">€{(stripeTxVal * (100 - stripeSharePercent) / 100 * 0.05).toFixed(2)}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 leading-tight block">
                    注：保证金将于对账无纠纷 7 天(Hold Period)后自动从 Stripe Connect 托管池归集结算。
                  </span>
                </div>
              </div>
            </div>

            {/* Global Conversion FX Engine */}
            <div className="lg:col-span-6 card-shopify p-5 space-y-4 text-xs font-sans">
              <span className="text-[11px] font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                FX Currency Converter & Volatility
              </span>
              <h3 className="text-sm font-bold text-gray-900">2. 全球多币种汇率结算对冲</h3>
              <p className="text-xs text-gray-500">
                对接国际多币种实时远期汇率，自动为跨境商户规避不同时点划拨资金所产生的汇差损益。
              </p>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="space-y-1">
                  <label className="text-gray-500 block">原始货币 (Base)</label>
                  <select
                    value={convBase}
                    onChange={(e) => setConvBase(e.target.value)}
                    className="w-full p-1.5 border border-slate-200 rounded font-bold"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 block">结算货币 (Target)</label>
                  <select
                    value={convTarget}
                    onChange={(e) => setConvTarget(e.target.value)}
                    className="w-full p-1.5 border border-slate-200 rounded font-bold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 block">对账换汇金额</label>
                  <input
                    type="number"
                    value={convAmt}
                    onChange={(e) => setConvAmt(Number(e.target.value))}
                    className="w-full p-1 border border-slate-200 rounded font-mono font-bold"
                  />
                </div>
              </div>

              {/* Conversion results */}
              <div className="p-3 bg-[#f0f8ff] border border-blue-100 rounded text-xs space-y-1 font-mono text-blue-900">
                <div className="flex justify-between font-bold">
                  <span>折现汇率 (Indicative FX Rate):</span>
                  <span>1 {convBase} = {convBase === "EUR" && convTarget === "USD" ? "1.082" : convBase === "EUR" && convTarget === "CNY" ? "7.842" : "1.251"} {convTarget}</span>
                </div>
                <div className="flex justify-between">
                  <span>应发资金 (Converted Net Total):</span>
                  <span className="font-extrabold text-[#008060]">
                    {convAmt} {convBase} ➔ {(convAmt * (convBase === "EUR" && convTarget === "USD" ? 1.082 : convBase === "EUR" && convTarget === "CNY" ? 7.842 : 1.251)).toFixed(2)} {convTarget}
                  </span>
                </div>
              </div>

              {/* FX Rate SVG Visual Line */}
              <div className="space-y-1 bg-white p-3 border border-slate-200 rounded">
                <span className="text-[10px] text-gray-400 font-bold block uppercase font-mono">欧元对美元波动均线对冲 (30 Days Trend):</span>
                <div className="h-12 flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 300 40">
                    <path
                      d="M 0 30 Q 50 10 100 25 T 200 15 T 300 12"
                      fill="none"
                      stroke="#2c6ecb"
                      strokeWidth="2"
                    />
                    <circle cx="300" cy="12" r="3" fill="#2c6ecb" />
                  </svg>
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                  <span>首周: 1.071</span>
                  <span>中旬: 1.079</span>
                  <span>当前汇：1.082 (高位)</span>
                </div>
              </div>
            </div>
          </div>

          {/* EU MOSS Standard Certified VAT Digital Invoice Signer */}
          <div className="card-shopify p-5 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#d82c0d] bg-red-50 px-2 py-0.5 rounded border border-red-200">
              EU MOSS / OSS Tax compliance Formats
            </span>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><FileText className="w-4 h-4 text-rose-500" />3. 欧盟 OSS 统一数字签名防篡改税控账单板</h3>
            <p className="text-xs text-gray-500">
              欧洲、北美及全球各地区征收消费税（VAT/GST）规则极其繁琐。系统可自动针对商户实体注册国下发 MOSS VAT 标准发票并进行数字证书 CA 安全加密加签。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-5 bg-slate-50 p-4 rounded-md border border-slate-200 text-xs space-y-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700">主体国家及消费税额度 (VAT Tier)</label>
                  <select
                    value={vatCountry}
                    onChange={(e) => setVatCountry(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded font-bold"
                  >
                    <option value="DE">德国 (Germany Standard - 19% VAT)</option>
                    <option value="FR">法国 (France Standard - 20% VAT)</option>
                    <option value="IT">意大利 (Italy Standard - 22% VAT)</option>
                    <option value="UK">英国 (United Kingdom - 20% VAT)</option>
                    <option value="US">非欧盟国际商户 (0% Export Tariff)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700">开票盖章签署人姓名 (Digital Signer Signature):</label>
                  <input
                    type="text"
                    value={vatSignerName}
                    onChange={(e) => setVatSignerName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded font-bold"
                    placeholder="例如: CEO. Alexander Martin"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!vatSignerName.trim()) {
                      alert("请先在签署处写下您的高管签名");
                      return;
                    }
                    setVatSigned(true);
                    alert("📢 账发票证书哈希碰撞计算正常，欧盟 OSS VAT 账单通过 256 位防篡改数字证书，已经实时签署。");
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold cursor-pointer transition text-xs"
                >
                  🔒 校验签名并对该发票加封 SHA-256 加密锁
                </button>
              </div>

              {/* Dynamic printable style invoice receipt box */}
              <div className="md:col-span-7 bg-white border-2 border-dashed border-slate-300 p-5 rounded-md relative text-[11px] font-mono leading-relaxed space-y-3.5">
                <div className="text-center pb-2.5 border-b border-slate-200 space-y-1">
                  <h4 className="text-base font-extrabold tracking-wider text-slate-800">SHOPIFY SAAS PLATFORM INC</h4>
                  <p className="text-[10px] text-gray-400 uppercase font-sans font-bold">欧盟 OSS VAT 增值税标准防伪汇款发票 (Invoice)</p>
                </div>

                <div className="grid grid-cols-2 text-[10px] text-gray-500">
                  <p>发票代码：SHO-VAT-{Math.floor(2891209 + Math.random() * 90000)}</p>
                  <p className="text-right">时间: {new Date().toLocaleDateString()}</p>
                  <p>税号: OSS-DE-3928109-12</p>
                  <p className="text-right">结算货币: EUR (€)</p>
                </div>

                <div className="border-t border-b border-slate-200 py-3.5 my-2 text-xs font-bold space-y-1 font-sans">
                  <div className="flex justify-between">
                    <span>SaaS 算力托管 & 网关带宽费用 (Monthly Lease):</span>
                    <span>€999.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>计税基属 (Subtotal Amount):</span>
                    <span>€999.00</span>
                  </div>
                  <div className="flex justify-between font-mono font-medium text-rose-600">
                    <span>增值税比例 ({vatCountry === "DE" ? "德国 19%" : vatCountry === "FR" ? "法国 20%" : vatCountry === "IT" ? "意大利 22%" : vatCountry === "UK" ? "英国 20%" : "跨国免税 0%"}):</span>
                    <span>+€{(999 * (vatCountry === "DE" ? 0.19 : vatCountry === "FR" ? 0.20 : vatCountry === "IT" ? 0.22 : vatCountry === "UK" ? 0.20 : 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-mono font-extrabold text-slate-900 border-t border-slate-200 pt-1.5 text-sm">
                    <span>应收合合总含税 (Gross Total due):</span>
                    <span>€{(999 * (1 + (vatCountry === "DE" ? 0.19 : vatCountry === "FR" ? 0.20 : vatCountry === "IT" ? 0.22 : vatCountry === "UK" ? 0.20 : 0))).toFixed(2)}</span>
                  </div>
                </div>

                {/* Digital Signature box */}
                <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-[9px] text-slate-500 space-y-1 relative">
                  {vatSigned ? (
                    <>
                      <div className="absolute right-3 top-3 border-2 border-emerald-500 text-emerald-500 font-sans font-black text-center text-[10px] transform rotate-12 bg-white p-1 rounded">
                        🔒 OSS VAT SIGNED
                      </div>
                      <p className="font-bold text-gray-800 uppercase font-sans">🛡️ 欧盟 OSS 数字安全证书数字签盖 (DIgital Seal):</p>
                      <p>签名人: <span className="font-bold underline text-gray-900">{vatSignerName}</span></p>
                      <p className="break-all text-emerald-600 font-bold">哈希：sha256-4b9e28f3cbcd839e928ee100eefea00cb2910fa31e138aedae4ea98c71bfa8a38</p>
                      <p className="font-sans text-emerald-600 font-semibold text-[8px]">校验状态: 校验通过 | 已写入平台 WORM 安全防篡改记账链</p>
                    </>
                  ) : (
                    <p className="text-center py-2 font-bold animate-pulse text-amber-600">⚠️ 此发票尚未盖签。请在左侧指定人高管签名，执行加封 SHA-256 安全加签。</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout dialog modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl border border-[#e1e3e5] animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e1e3e5]">
              <h3 className="text-xs font-bold text-gray-900">设计出账提现单</h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handlePayoutSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">合作商主体名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: Stripe开发者生态团队"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">打款资助金额 (EUR) *</label>
                <input
                  type="number"
                  required
                  value={newPayoutAmount}
                  onChange={(e) => setNewPayoutAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-mono font-bold text-[#008060]"
                />
              </div>
              <div className="pt-3 border-t border-[#f1f1f1] flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded text-center text-gray-600 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#008060] hover:bg-[#006e52] rounded text-center text-white transition cursor-pointer"
                >
                  挂起待审单
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill dialog modal */}
      {showBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl border border-[#e1e3e5] animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e1e3e5]">
              <h3 className="text-xs font-bold text-gray-900">登记来往对账结算单</h3>
              <button onClick={() => setShowBillModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleBillSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">来账租户店主姓名 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 露雅女士"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">划账金额 (EUR) *</label>
                  <input
                    type="number"
                    required
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">当前清算状态</label>
                  <select
                    value={newBillStatus}
                    onChange={(e) => setNewBillStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none"
                  >
                    <option value="已付">结算成功(已付)</option>
                    <option value="未付">处理挂账中(未付)</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 border-t border-[#f1f1f1] flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setShowBillModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded text-center text-gray-600 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#008060] hover:bg-[#006e52] rounded text-center text-white transition cursor-pointer"
                >
                  登毕记入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice dialog modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl border border-[#e1e3e5] animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e1e3e5]">
              <h3 className="text-xs font-bold text-gray-900">系统出海合规发票</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInvoiceSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">开票店铺主体 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 凡特高端家居"
                  value={newInvStore}
                  onChange={(e) => setNewInvStore(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">票面总数 (EUR) *</label>
                  <input
                    type="number"
                    required
                    value={newInvAmount}
                    onChange={(e) => setNewInvAmount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">扣税 (7.5%扣除非中所得) *</label>
                  <input
                    type="number"
                    required
                    value={newInvTax}
                    onChange={(e) => setNewInvTax(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-mono"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-[#f1f1f1] flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded text-center text-gray-600 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#008060] hover:bg-[#006e52] rounded text-center text-white transition cursor-pointer"
                >
                  出证开票
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
