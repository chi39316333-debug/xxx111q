import React, { useState } from "react";
import { 
  TrendingUp, Users, ShoppingBag, Globe, DollarSign, 
  Activity, ArrowUpRight, Plus, Volume2, Shield
} from "lucide-react";

interface DashboardModuleProps {
  storesCount: number;
  usersCount: number;
  totalIncome: number;
  activeStores: number;
  onQuickAction: (action: string) => void;
}

export default function DashboardModule({ 
  storesCount, 
  usersCount, 
  totalIncome, 
  activeStores, 
  onQuickAction 
}: DashboardModuleProps) {
  const [selectedChart, setSelectedChart] = useState<string>("income");

  // Mock data for trends
  const chartData: Record<string, { label: string; value: string; points: number[] }> = {
    income: { label: "收入趋势", value: "€" + (totalIncome * 11.2).toFixed(2), points: [1200, 1900, 3200, 4800, 5100, 6800, 8900] },
    store: { label: "店铺趋势", value: `${storesCount} 个`, points: [1, 2, 3, 3, 4, 4, storesCount] },
    user: { label: "用户趋势", value: `${usersCount} 人`, points: [2, 3, 3, 4, 4, 5, usersCount] },
    order: { label: "订单趋势", value: "1,240 笔", points: [200, 450, 610, 840, 930, 1100, 1240] }
  };

  const currentChart = chartData[selectedChart] || chartData.income;

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "今日收入", val: "€1,240.00", desc: "今日实时付款", trend: "+12.4%", color: "text-[#008060]" },
          { title: "总收入", val: `€${(totalIncome * 11.2).toFixed(2)}`, desc: "历史累加收入", trend: "+18.2%", color: "text-[#008060]" },
          { title: "店铺数", val: `${storesCount} 个`, desc: "入驻主网店数", trend: "+20.0%", color: "text-[#2c6ecb]" },
          { title: "用户数", val: `${usersCount} 人`, desc: "多租入驻商家", trend: "+8.5%", color: "text-[#2c6ecb]" },
          { title: "订单数", val: "1,240 笔", desc: "主链路由成交", trend: "+15.3%", color: "text-[#008060]" },
          { title: "在线数", val: `${activeStores} 在线`, desc: "网关保活进程", trend: "100.0%", color: "text-[#008060]" },
          { title: "增长率", val: "38.5%", desc: "月度环比跃升", trend: "+4.2%", color: "text-[#2c6ecb]" },
          { title: "续费率", val: "94.2%", desc: "租户持久黏性", trend: "+0.8%", color: "text-[#008060]" }
        ].map((kpi, idx) => (
          <div key={idx} className="card-shopify p-4 flex flex-col justify-between">
            <div>
              <span className="text-[12px] text-[#6d7175] font-semibold tracking-wide">
                {kpi.title}
              </span>
              <p className="text-xl font-bold text-[#202223] mt-1 font-mono">
                {kpi.val}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#f1f1f1] text-[11px]">
              <span className="text-[#6d7175]">{kpi.desc}</span>
              <span className={`font-mono font-bold ${kpi.color}`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts section with SVG graphics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Metric Trend Card */}
        <div className="card-shopify p-5 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
            <div>
              <h3 className="text-sm font-bold text-[#202223]">{currentChart.label}</h3>
              <p className="text-[11px] text-[#6d7175]">Shopify SaaS 微内核平台核心统计指标</p>
            </div>
            
            {/* Chart toggle tags */}
            <div className="flex gap-1.5 bg-[#f1f1f1] p-1 rounded-md text-[11px] font-bold">
              {Object.keys(chartData).map(k => (
                <button
                  key={k}
                  onClick={() => setSelectedChart(k)}
                  className={`px-2.5 py-0.5 rounded cursor-pointer transition ${
                    selectedChart === k
                      ? "bg-white text-[#202223] shadow-xs"
                      : "text-[#6d7175] hover:text-[#202223]"
                  }`}
                >
                  {chartData[k].label.replace("趋势", "")}
                </button>
              ))}
            </div>
          </div>

          {/* SVG line chart representation */}
          <div className="h-48 bg-gray-50 rounded-lg border border-[#e1e3e5] p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-2 left-3 bg-[#e2f1e4] text-[#008060] font-mono text-[11px] font-bold px-1.5 py-0.5 rounded border border-[#bbe5b3]">
              值: {currentChart.value}
            </div>

            {/* Custom Interactive SVG Line Plot */}
            <div className="w-full h-32 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#008060" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#008060" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#e1e3e5" strokeDasharray="4 4" />
                <line x1="0" y1="65" x2="500" y2="65" stroke="#e1e3e5" strokeDasharray="4 4" />
                <line x1="0" y1="110" x2="500" y2="110" stroke="#e1e3e5" strokeDasharray="4 4" />
                
                {/* Area under the line */}
                <path
                  d={`M 0 120 
                      L 0 ${110 - (currentChart.points[0] / Math.max(...currentChart.points)) * 90} 
                      L 83 ${110 - (currentChart.points[1] / Math.max(...currentChart.points)) * 90}
                      L 166 ${110 - (currentChart.points[2] / Math.max(...currentChart.points)) * 90}
                      L 249 ${110 - (currentChart.points[3] / Math.max(...currentChart.points)) * 90}
                      L 332 ${110 - (currentChart.points[4] / Math.max(...currentChart.points)) * 90}
                      L 415 ${110 - (currentChart.points[5] / Math.max(...currentChart.points)) * 90}
                      L 500 ${110 - (currentChart.points[6] / Math.max(...currentChart.points)) * 90}
                      L 500 120 Z`}
                  fill="url(#chartGrad)"
                />

                {/* Main Curve Line */}
                <path
                  d={`M 0 ${110 - (currentChart.points[0] / Math.max(...currentChart.points)) * 90} 
                      L 83 ${110 - (currentChart.points[1] / Math.max(...currentChart.points)) * 90}
                      L 166 ${110 - (currentChart.points[2] / Math.max(...currentChart.points)) * 90}
                      L 249 ${110 - (currentChart.points[3] / Math.max(...currentChart.points)) * 90}
                      L 332 ${110 - (currentChart.points[4] / Math.max(...currentChart.points)) * 90}
                      L 415 ${110 - (currentChart.points[5] / Math.max(...currentChart.points)) * 90}
                      L 500 ${110 - (currentChart.points[6] / Math.max(...currentChart.points)) * 90}`}
                  fill="none"
                  stroke="#008060"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Dots on points */}
                {currentChart.points.map((p, i) => {
                  const max = Math.max(...currentChart.points);
                  const cx = i === 6 ? 500 : i * 83;
                  const cy = 110 - (p / max) * 90;
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="4"
                      fill="#ffffff"
                      stroke="#008060"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>

            {/* X Axis dates */}
            <div className="flex justify-between text-[10px] text-[#6d7175] font-mono border-t border-[#e1e3e5] pt-1">
              <span>06-14</span>
              <span>06-15</span>
              <span>06-16</span>
              <span>06-17</span>
              <span>06-18</span>
              <span>06-19</span>
              <span>今日 (最新)</span>
            </div>
          </div>
        </div>

        {/* Demographic & Sources Distributions */}
        <div className="card-shopify p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#202223] pb-2 border-b border-[#f1f1f1]">
            全网分布比例
          </h3>

          <div className="space-y-4 text-xs font-semibold">
            {/* Country Distribution */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#6d7175]">地区分布</span>
              <div className="space-y-1">
                {[
                  { region: "中国大陆", pct: "64%" },
                  { region: "欧洲北美", pct: "22%" },
                  { region: "亚太其它", pct: "14%" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-16 text-[#202223] font-sans text-left">{item.region}</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#008060] h-full" style={{ width: item.pct }} />
                    </div>
                    <span className="w-8 font-mono text-[#6d7175] text-right">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Distribution */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#6d7175]">设备分布</span>
              <div className="space-y-1">
                {[
                  { device: "桌面浏览器", pct: "58%" },
                  { device: "手机移动端", pct: "37%" },
                  { device: "API 虚拟节点", pct: "5%" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-16 text-[#202223] font-sans text-left">{item.device}</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2c6ecb] h-full" style={{ width: item.pct }} />
                    </div>
                    <span className="w-8 font-mono text-[#6d7175] text-right">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Corporate Grade OLAP Multi-dimensional Query Engine */}
      <div className="card-shopify p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#f1f1f1]">
          <div>
            <h3 className="text-sm font-bold text-[#202223] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#008060] animate-pulse" />
              <span>SaaS 智能多维分析数仓 (OLAP Data Warehouse Workbench)</span>
            </h3>
            <p className="text-[11px] text-[#6d7175]">
              支持跨租户物理层行级聚合、流计算与商业智能 BI 数据魔方实时跑批
            </p>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase font-mono">
            OLAP MODE: Real-time Hybrid
          </span>
        </div>

        {/* Aggregate configuration filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-md border border-slate-200">
          <div className="space-y-1">
            <label className="font-bold text-gray-700">主切片维度 (Dimension)</label>
            <select
              value={selectedChart} // Reuse or map state
              onChange={(e) => setSelectedChart(e.target.value)}
              className="w-full p-2 border border-slate-200 bg-white rounded font-bold outline-none text-gray-700"
            >
              <option value="income">按商户主体订阅 (tenant_id)</option>
              <option value="store">按套餐流派 (plan_tier)</option>
              <option value="user">按区域注册时区 (geo_shard)</option>
              <option value="order">按结算提现状态 (clearing_status)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700">度量算子 (Aggregation)</label>
            <select className="w-full p-2 border border-slate-200 bg-white rounded font-mono outline-none text-gray-700 font-bold">
              <option value="SUM">SUM (增量合计)</option>
              <option value="AVG">AVG (周期日均)</option>
              <option value="COUNT">COUNT (原子计频)</option>
              <option value="MAX">MAX (单笔峰值)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-700">被积函数 (Base Metric)</label>
            <select className="w-full p-2 border border-slate-200 bg-white rounded outline-none text-gray-700 font-bold">
              <option value="revenue">总对账流流水金额 (gross_revenue)</option>
              <option value="requests">API 触发调用频发 count(request_id)</option>
              <option value="subs">新增订阅账单总价 (mrr_value)</option>
              <option value="tax">合规增值税额 (eu_vat_collected)</option>
            </select>
          </div>

          <div className="space-y-1 flex flex-col justify-end">
            <button
              onClick={() => {
                onQuickAction("olap_run");
                alert("✨ OLAP 数仓分布式预聚合重算就绪。已从只读 Replica 分支拉取 4,812 条快照记录，耗时 12ms。");
              }}
              className="w-full py-2 bg-[#008060] hover:bg-[#006e52] text-white rounded font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              立即跑批重算
            </button>
          </div>
        </div>

        {/* Dynamic SQL logic and Live BI Table Plot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300">
              <div className="flex items-center justify-between text-[10px] text-gray-500 pb-1.5 border-b border-gray-800 mb-1.5 font-sans font-bold">
                <span>⚡ 生成的底层多维 SQL 段落</span>
                <span className="text-[#008060]">COMPILED GREEN</span>
              </div>
              <p className="text-emerald-400 font-bold">
                SELECT
              </p>
              <p className="pl-4">
                {selectedChart === "income" && "t.tenant_name AS shard_key,"}
                {selectedChart === "store" && "p.tier_level AS shard_key,"}
                {selectedChart === "user" && "u.geo_location AS shard_key,"}
                {selectedChart === "order" && "c.status_code AS shard_key,"}
              </p>
              <p className="pl-4 text-sky-400">
                SUM(m.amount_cents) / 100 AS real_gross_value,
              </p>
              <p className="pl-4 text-pink-400">
                COUNT(m.id) AS atomic_transactions
              </p>
              <p className="text-emerald-400 font-bold">FROM</p>
              <p className="pl-4">
                {selectedChart === "income" && "plat_tenants t JOIN tenant_metrics m ON t.id = m.tenant_id"}
                {selectedChart === "store" && "plat_plans p JOIN tenant_metrics m ON p.id = m.plan_id"}
                {selectedChart === "user" && "plat_users u JOIN tenant_metrics m ON u.id = m.user_id"}
                {selectedChart === "order" && "clearing_receipts c JOIN tenant_metrics m ON m.clearing_id = c.id"}
              </p>
              <p className="text-emerald-400 font-bold">GROUP BY</p>
              <p className="pl-4">shard_key</p>
              <p className="text-emerald-400 font-bold">ORDER BY</p>
              <p className="pl-4">real_gross_value DESC LIMIT 100;</p>
            </div>
            <p className="text-[10px] text-gray-500">
               注：SaaS平台由于涉及高吞吐量计费，所有财务对账均不进行实时全表扫描，而是在列式分布式数仓中通过预编译物化视图（Materialized View）定时刷新以维护高性能。
            </p>
          </div>

          <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-3.5 space-y-3">
            <span className="text-[11px] font-bold text-gray-700 block">实时预计算物化视图结果 (OLAP Aggregates)</span>
            <div className="space-y-3">
              {[
                {
                  key: selectedChart === "income" ? "阿迪达斯旗舰店 (adidas)" : selectedChart === "store" ? "旗舰商户级套餐 (Enterprise)" : selectedChart === "user" ? "中国大陆华东集群 (CN-EAST)" : "已入账放款结算 (CLEARED)",
                  amount: "€43,900.00", Count: "2,420次", pct: "72%"
                },
                {
                  key: selectedChart === "income" ? "耐克海淘体验店 (nike-vip)" : selectedChart === "store" ? "专业大商户级套餐 (Professional)" : selectedChart === "user" ? "欧洲西部集群 (EU-WEST)" : "已审批待解冻 (PENDING_UNFREEZE)",
                  amount: "€14,800.00", Count: "940次", pct: "41%"
                },
                {
                  key: selectedChart === "income" ? "三只松鼠官方店 (squirrel)" : selectedChart === "store" ? "基础标准级套餐 (Standard)" : selectedChart === "user" ? "北美东部高频集群 (US-EAST)" : "风控防作弊拦截中 (BLOCKED_RISK)",
                  amount: "€3,200.00", Count: "190次", pct: "12%"
                }
              ].map((row, rIdx) => (
                <div key={rIdx} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900 font-bold">{row.key}</span>
                    <div className="space-x-2 font-mono text-gray-500">
                      <span className="text-[#008060] font-bold">{row.amount}</span>
                      <span>({row.Count})</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-[#008060]" style={{ width: row.pct }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#6d7175]">
              <span>同步引擎延迟: <strong className="font-mono text-[#008060]">0.42s</strong> (流批一体)</span>
              <span>行级安全控制 (RLS): <strong className="text-blue-600 font-mono">已严格生效</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Shortcut Actions (名字<=4字) */}
      <div className="card-shopify p-5 space-y-3">
        <h3 className="text-sm font-bold text-[#202223] flex items-center gap-1.5">
          <ArrowUpRight className="w-4 h-4 text-[#008060]" />
          平台快捷
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
          <button
            onClick={() => onQuickAction("create_store")}
            className="flex items-center justify-center gap-1 bg-white hover:bg-gray-50 border border-[#cbd0d2] text-[#202223] p-2.5 rounded-md cursor-pointer transition active:scale-95 animate-pulse"
          >
            <Plus className="w-3.5 h-3.5 text-[#008060]" />
            创建店铺
          </button>
          <button
            onClick={() => onQuickAction("create_plan")}
            className="flex items-center justify-center gap-1 bg-white hover:bg-gray-50 border border-[#cbd0d2] text-[#202223] p-2.5 rounded-md cursor-pointer transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#008060]" />
            创建套餐
          </button>
          <button
            onClick={() => onQuickAction("post_announcement")}
            className="flex items-center justify-center gap-1 bg-white hover:bg-gray-50 border border-[#cbd0d2] text-[#202223] p-2.5 rounded-md cursor-pointer transition active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#008060]" />
            发布公告
          </button>
          <button
            onClick={() => onQuickAction("create_role")}
            className="flex items-center justify-center gap-1 bg-white hover:bg-gray-50 border border-[#cbd0d2] text-[#202223] p-2.5 rounded-md cursor-pointer transition active:scale-95"
          >
            <Shield className="w-3.5 h-3.5 text-[#008060]" />
            创建角色
          </button>
        </div>
      </div>
    </div>
  );
}
