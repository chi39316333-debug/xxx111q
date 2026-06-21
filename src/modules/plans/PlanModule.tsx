import React, { useState } from "react";
import { 
  Sliders, ShieldCheck, Clock, CheckCircle2, XCircle, ToggleLeft, 
  ToggleRight, RefreshCw, Layers, Edit2, Play, Square, Settings, Key,
  Plus, X, Trash2
} from "lucide-react";
import { PlanItem, SubItem } from "../../types";

interface PlanModuleProps {
  plans: PlanItem[];
  subs: SubItem[];
  onAddPlan: (plan: PlanItem) => void;
  onDeletePlan: (id: string) => void;
  onAddSub: (sub: SubItem) => void;
  onDeleteSub: (id: string) => void;
  onUpdatePlan: (id: string, updated: Partial<PlanItem>) => void;
  onUpdateSub: (id: string, updated: Partial<SubItem>) => void;
  onOpenPlanEdit: (plan: PlanItem) => void;
}

export default function PlanModule({
  plans,
  subs,
  onAddPlan,
  onDeletePlan,
  onAddSub,
  onDeleteSub,
  onUpdatePlan,
  onUpdateSub,
  onOpenPlanEdit
}: PlanModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"plans" | "subs">("plans");
  
  // Local state for checking function flags of plans (Section 12 of spec)
  const [features, setFeatures] = useState<Record<string, Record<string, boolean>>>({
    "P-01": { 商品: true, 订单: true, 库存: true, 客户: true, 营销: false, 财务: false, API: false, Webhook: false, 主题: true, 应用: false, 多仓库: false, 多币种: false, 多语言: false },
    "P-02": { 商品: true, 订单: true, 库存: true, 客户: true, 营销: true, 财务: true, API: false, Webhook: true, 主题: true, 应用: true, 多仓库: true, 多币种: false, 多语言: false },
    "P-03": { 商品: true, 订单: true, 库存: true, 客户: true, 营销: true, 财务: true, API: true, Webhook: true, 主题: true, 应用: true, 多仓库: true, 多币种: true, 多语言: true },
    "P-04": { 商品: true, 订单: true, 库存: true, 客户: true, 营销: true, 财务: true, API: true, Webhook: true, 主题: true, 应用: true, 多仓库: true, 多币种: true, 多语言: true }
  });

  // Modal display toggles
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  // New plan fields
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanPriceMonthly, setNewPlanPriceMonthly] = useState(39);
  const [newPlanPriceYearly, setNewPlanPriceYearly] = useState(390);
  const [newPlanStatus, setNewPlanStatus] = useState<"上架" | "下架">("上架");

  // New subscription fields
  const [newSubStore, setNewSubStore] = useState("");
  const [newSubPlan, setNewSubPlan] = useState("专业版");
  const [newSubAmount, setNewSubAmount] = useState(79);
  const [newSubCycle, setNewSubCycle] = useState<"月付" | "年付">("月付");
  const [newSubStatus, setNewSubStatus] = useState<"正常" | "已过期" | "关闭">("正常");

  const toggleFeature = (planId: string, feature: string) => {
    setFeatures(prev => {
      const planFeatures = prev[planId] ? { ...prev[planId] } : { 商品: true, 订单: true, 库存: true, 客户: true };
      planFeatures[feature] = !planFeatures[feature];
      return { ...prev, [planId]: planFeatures };
    });
  };

  const handleCreatePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) {
      alert("请输入套餐名称！");
      return;
    }
    const freshPlan: PlanItem = {
      id: `P-${Math.floor(10 + Math.random() * 90)}`,
      name: newPlanName,
      priceMonthly: Number(newPlanPriceMonthly),
      priceYearly: Number(newPlanPriceYearly),
      status: newPlanStatus
    };
    onAddPlan(freshPlan);
    
    // Add default mock features
    setFeatures(prev => ({
      ...prev,
      [freshPlan.id]: { 商品: true, 订单: true, 库存: true, 客户: true, 营销: true, 财务: false, API: false, Webhook: false }
    }));

    setNewPlanName("");
    setShowPlanModal(false);
  };

  const handleCreateSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubStore.trim()) {
      alert("请输入租户店铺名称！");
      return;
    }
    const freshSub: SubItem = {
      id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      storeName: newSubStore,
      planName: newSubPlan,
      amount: Number(newSubAmount),
      cycle: newSubCycle,
      status: newSubStatus,
      startDate: new Date().toISOString().substring(0, 10)
    };
    onAddSub(freshSub);
    setNewSubStore("");
    setShowSubModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Tab select strip (Plans or active subscriptions log) */}
      <div className="flex border-b border-[#e1e3e5] justify-between items-center text-sm font-bold text-[#6d7175]">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveSubTab("plans")}
            className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "plans"
                ? "text-[#008060] border-b-2 border-[#008060]"
                : "hover:text-[#202223]"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>套餐策略</span>
          </button>
          <button
            onClick={() => setActiveSubTab("subs")}
            className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === "subs"
                ? "text-[#008060] border-b-2 border-[#008060]"
                : "hover:text-[#202223]"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>订阅历史</span>
          </button>
        </div>

        {activeSubTab === "plans" ? (
          <button
            onClick={() => setShowPlanModal(true)}
            className="text-xs bg-[#008060] hover:bg-[#006e52] text-white py-1.5 px-3.5 rounded-md font-bold transition flex items-center gap-1 shadow-sm mb-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            新建价格套餐
          </button>
        ) : (
          <button
            onClick={() => setShowSubModal(true)}
            className="text-xs bg-[#008060] hover:bg-[#006e52] text-white py-1.5 px-3.5 rounded-md font-bold transition flex items-center gap-1 shadow-sm mb-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            新建订阅合同
          </button>
        )}
      </div>

      {activeSubTab === "plans" ? (
        <div className="space-y-6 animate-fade-in">
          {/* Main Plans management list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`card-shopify p-5 space-y-4 flex flex-col justify-between relative overflow-hidden ${
                  plan.status === "上架" ? "border-emerald-500/10" : "bg-neutral-50/55"
                }`}
              >
                {/* Upper card info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-gray-500 font-mono block">ID: {plan.id}</span>
                      <h3 className="text-base font-bold text-[#202223]">{plan.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {plan.status === "上架" ? (
                        <span className="text-[10px] text-[#008060] font-bold bg-[#e2f1e4] px-1.5 py-0.5 rounded border border-[#bbe5b3]">
                          线上售卖
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-500 font-bold bg-[#fff0f0] px-1.5 py-0.5 rounded border border-red-200">
                          下架停售
                        </span>
                      )}
                      
                      {/* Delete button option */}
                      <button 
                        onClick={() => {
                          if (confirm(`确定销毁套餐 "${plan.name}" (${plan.id}) 吗？`)) {
                            onDeletePlan(plan.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded hover:bg-slate-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="py-2.5 border-y border-[#f1f1f1] flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[10px] text-[#6d7175]">按月支付价格</p>
                      <p className="text-sm font-mono font-bold text-gray-800">€{plan.priceMonthly}/月</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#6d7175]">按年支付总价</p>
                      <p className="text-sm font-mono font-bold text-[#008060]">€{plan.priceYearly}/年</p>
                    </div>
                  </div>

                  {/* Feature Switches grid checklist (Section 12: swithches for product, order, Multicurrency, language) */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#6d7175] uppercase tracking-wider block mb-1.5">
                      功能模块开关:
                    </span>
                    <div className="grid grid-cols-3 gap-1 shadow-2xs p-2 rounded-md bg-slate-55 border border-slate-100">
                      {Object.keys(features[plan.id] || { 商品: true, 订单: true, 库存: true, 客户: true }).map((f) => {
                        const active = features[plan.id]?.[f];
                        return (
                          <button
                            key={f}
                            onClick={() => toggleFeature(plan.id, f)}
                            className={`flex items-center justify-between text-[10px] font-bold p-1 px-1.5 rounded transition select-none cursor-pointer ${
                              active
                                ? "bg-[#e2f1e4] text-[#008060] border border-[#bbe5b3]"
                                : "bg-neutral-100 text-gray-400 border border-neutral-200"
                            }`}
                            title={`点击反转 ${f} 功能授权`}
                          >
                            <span>{f}</span>
                            {active ? (
                              <span className="text-[8px]">✔</span>
                            ) : (
                              <span className="text-[8px]">✖</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Lower Action buttons */}
                <div className="pt-4 border-t border-[#f1f1f1] flex justify-between gap-2 text-xs font-bold">
                  {/* Status upper-lower switch */}
                  <button
                    onClick={() => {
                      const next = plan.status === "上架" ? "下架" : "上架";
                      onUpdatePlan(plan.id, { status: next });
                    }}
                    className={`flex-1 py-1 px-2.5 rounded border text-center cursor-pointer transition flex items-center justify-center gap-1 ${
                      plan.status === "上架"
                        ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                        : "border-[#bbe5b3] text-[#008060] hover:bg-[#e2f1e4]"
                    }`}
                  >
                    {plan.status === "上架" ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>下架套餐</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>上架套餐</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenPlanEdit(plan)}
                    className="py-1 px-3 bg-white text-[#202223] hover:bg-gray-50 border border-[#cbd0d2] rounded cursor-pointer transition flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>编辑</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Subscriptions active logs component */
        <div className="card-shopify overflow-hidden bg-white animate-fade-in">
          <div className="overflow-x-auto text-xs font-sans text-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] font-bold">
                  <th className="py-3 px-4">订阅单编号</th>
                  <th className="py-3 px-4">关联店铺</th>
                  <th className="py-3 px-4">所购套餐</th>
                  <th className="py-3 px-4">订购周期</th>
                  <th className="py-3 px-4">成交金额</th>
                  <th className="py-3 px-4">启动时间</th>
                  <th className="py-3 px-4">运行状态</th>
                  <th className="py-3 px-4 text-right">更改行为</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e5]">
                {subs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/70 transition-colors h-[52px]">
                    <td className="py-2 px-4 font-mono font-medium text-gray-500">{sub.id}</td>
                    <td className="py-2 px-4 font-bold text-gray-900">{sub.storeName}</td>
                    <td className="py-2 px-4">
                      <span className="bg-slate-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200 font-bold">
                        {sub.planName}
                      </span>
                    </td>
                    <td className="py-2 px-4">{sub.cycle}</td>
                    <td className="py-2 px-4 font-mono font-bold text-[#008060]">€{sub.amount}</td>
                    <td className="py-2 px-4 font-mono text-[#6d7175]">{sub.startDate}</td>
                    <td className="py-2 px-4 font-bold">
                      {sub.status === "正常" && (
                        <span className="inline-flex items-center gap-1 text-[#008060] bg-[#e2f1e4] px-2 py-0.5 rounded-full border border-[#bbe5b3]">
                          正常活动
                        </span>
                      )}
                      {sub.status === "已过期" && (
                        <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                          欠费中断
                        </span>
                      )}
                      {sub.status === "关闭" && (
                        <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                          自主注销
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right whitespace-nowrap space-x-1.5">
                      {/* Subscription status toggles */}
                      <button
                        onClick={() => {
                          const nextStatus = sub.status === "正常" ? "已过期" : "正常";
                          onUpdateSub(sub.id, { status: nextStatus });
                        }}
                        className={`text-xs font-bold py-1 px-1.5 border rounded cursor-pointer transition ${
                          sub.status === "正常"
                            ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                            : "border-[#bbe5b3] text-[#008060] hover:bg-[#e2f1e4]"
                        }`}
                      >
                        {sub.status === "正常" ? "挂起" : "激活"}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`确定清除该订阅记录 "${sub.id}"?`)) {
                            onDeleteSub(sub.id);
                          }
                        }}
                        className="text-[#d82c0d] bg-red-50 hover:bg-red-100 font-bold py-1 px-1.5 border border-red-200 rounded transition cursor-pointer"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Plan Modal Dialog */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl border border-[#e1e3e5] animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e1e3e5]">
              <h3 className="text-xs font-bold text-gray-900">设计全新资费套餐模板</h3>
              <button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePlanSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">套餐名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 旗舰豪华版"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">按月付价格 (€) *</label>
                  <input
                    type="number"
                    required
                    value={newPlanPriceMonthly}
                    onChange={(e) => setNewPlanPriceMonthly(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] text-gray-800 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">按年结价格 (€) *</label>
                  <input
                    type="number"
                    required
                    value={newPlanPriceYearly}
                    onChange={(e) => setNewPlanPriceYearly(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] text-gray-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">状态</label>
                <select
                  value={newPlanStatus}
                  onChange={(e) => setNewPlanStatus(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none font-medium"
                >
                  <option value="上架">立即上架发售</option>
                  <option value="下架">仅作草稿暂不上线</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#f1f1f1] flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded text-center text-gray-600 bg-white hover:bg-slate-50 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#008060] hover:bg-[#006e52] rounded text-center text-white transition shadow-sm cursor-pointer"
                >
                  确认生成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subscription Modal Dialog */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl border border-[#e1e3e5] animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e1e3e5]">
              <h3 className="text-xs font-bold text-gray-900">开具多租户订阅服务契约</h3>
              <button onClick={() => setShowSubModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">关联商户店铺名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 露米服饰"
                  value={newSubStore}
                  onChange={(e) => setNewSubStore(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] text-gray-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">选定套餐战略模板</label>
                  <select
                    value={newSubPlan}
                    onChange={(e) => setNewSubPlan(e.target.value)}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none font-medium"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">契约实付金额 (€) *</label>
                  <input
                    type="number"
                    required
                    value={newSubAmount}
                    onChange={(e) => setNewSubAmount(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] text-gray-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">计费划账周期</label>
                  <select
                    value={newSubCycle}
                    onChange={(e) => setNewSubCycle(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none font-medium"
                  >
                    <option value="月付">按月结算付款</option>
                    <option value="年付">按年结算结清</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">授权履约状态</label>
                  <select
                    value={newSubStatus}
                    onChange={(e) => setNewSubStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none font-medium"
                  >
                    <option value="正常">正常运行中</option>
                    <option value="已过期">欠费阻断</option>
                    <option value="关闭">到期自动关闭</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#f1f1f1] flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setShowSubModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded text-center text-gray-600 bg-white hover:bg-slate-50 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#008060] hover:bg-[#006e52] rounded text-center text-white transition shadow-sm cursor-pointer"
                >
                  签发合同
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
