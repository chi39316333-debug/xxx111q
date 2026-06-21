import React, { useState, useEffect } from "react";
import { 
  Search, ArrowRight, User, Key, RefreshCw, Layers, Sparkles, 
  Trash2, Eye, ShieldAlert, CheckCircle, ExternalLink, Globe,
  Shield, Laptop, Cpu, Check, AlertCircle, ChevronRight
} from "lucide-react";
import { StoreItem, PlanItem } from "../../types";

interface StoreModuleProps {
  stores: StoreItem[];
  plans: PlanItem[];
  onUpdateStore: (id: string, updated: Partial<StoreItem>) => void;
  onDeleteStore: (id: string) => void;
  onLoginAsStore: (store: StoreItem) => void;
  onViewDetails: (store: StoreItem) => void;
  onOpenCreateDrawer: () => void;
}

export default function StoreModule({
  stores,
  plans,
  onUpdateStore,
  onDeleteStore,
  onLoginAsStore,
  onViewDetails,
  onOpenCreateDrawer
}: StoreModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"list" | "domains" | "limits">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [planFilter, setPlanFilter] = useState("全部");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Custom Domain State Sandbox
  const [selectedDomainStore, setSelectedDomainStore] = useState<string>(stores[0]?.id || "");
  const [customDomainText, setCustomDomainText] = useState("www.shop-adidas.de");
  const [domainLogs, setDomainLogs] = useState<string[]>([]);
  const [domainVerifyStep, setDomainVerifyStep] = useState<number>(0);
  const [sslActive, setSslActive] = useState(false);

  // Rate limits state sandbox
  const [selectedLimitStore, setSelectedLimitStore] = useState<string>(stores[0]?.id || "");
  const [reqBatchLogs, setReqBatchLogs] = useState<{ id: number; method: string; url: string; time: string; status: number; message: string }[]>([]);
  const [bucketCount, setBucketCount] = useState<number>(0);
  const [isSimulatingLimits, setIsSimulatingLimits] = useState(false);

  const activeLimitStoreObj = stores.find(s => s.id === selectedLimitStore) || stores[0];

  const triggerDomainSslVerification = () => {
    if (!customDomainText.trim()) {
      alert("请输入独立域名名");
      return;
    }
    setDomainVerifyStep(1);
    setSslActive(false);
    setDomainLogs(["[System DNS] 发起 DNS authoritative lookup 并寻址独立 IP...", "[System DNS] A Record 映射校验指向 SaaS集群公有入口: 104.18.23.41."]);

    setTimeout(() => {
      setDomainVerifyStep(2);
      setDomainLogs(prev => [...prev, "[ACME Engine] 触发 HTTP-01 challenge 手动及自动验证握手...", "[ACME Engine] 域名验证通过。向 Let's Encrypt CA 服务器发起证书签名请求。"]);
    }, 1200);

    setTimeout(() => {
      setDomainVerifyStep(3);
      setDomainLogs(prev => [...prev, "[Nginx Core] 正在本地动态配置反向代理 Nginx Virtual Host 段...", "[Nginx Core] 生成 ECDSA e-256 TLS 1.3 证书与公私钥对成功并自动写入。"]);
    }, 2400);

    setTimeout(() => {
      setDomainVerifyStep(4);
      setSslActive(true);
      setDomainLogs(prev => [...prev, "🎉 [Let's Encrypt] SSL 自动化证书签发流程圆满成功！映射地址: https://" + customDomainText]);
      // Update in local data
      if (selectedDomainStore) {
        onUpdateStore(selectedDomainStore, { domain: customDomainText });
      }
    }, 3600);
  };

  const runRateLimitSimulation = () => {
    if (isSimulatingLimits) return;
    setIsSimulatingLimits(true);
    setReqBatchLogs([]);
    setBucketCount(0);

    const storeObj = stores.find(s => s.id === selectedLimitStore) || stores[0];
    const planLimits: Record<string, { limit: number; desc: string }> = {
      "基础版": { limit: 5, desc: "基础版（降配保护：最大并发 5 req/s）" },
      "专业版": { limit: 12, desc: "专业版（中配保护：最大并发 12 req/s）" },
      "企业版": { limit: 30, desc: "旗舰版（高性能：无限并发）" }
    };

    const quota = planLimits[storeObj?.plan || "基础版"] || planLimits["基础版"];

    let logsAcc: { id: number; method: string; url: string; time: string; status: number; message: string }[] = [];
    let currentInBucket = 0;

    let index = 1;
    const interval = setInterval(() => {
      if (index > 20) {
        clearInterval(interval);
        setIsSimulatingLimits(false);
        return;
      }

      currentInBucket += 1;
      const willReject = currentInBucket > quota.limit;
      const status = willReject ? 429 : 200;
      const msg = willReject 
        ? `🔥 请求丢弃 - 租户触发 [${storeObj?.plan}] Leaky-Bucket 速率熔断防火墙！已丢弃重定向至本地错误保护` 
        : `✅ 请求放行 - 租户行级安全匹配及身份校验合格通过。`;

      if (willReject) {
        setBucketCount(prev => prev + 1);
      }

      logsAcc = [
        {
          id: index,
          method: "GET",
          url: `/api/v1/stores/${storeObj?.id || "S-01"}/products`,
          time: new Date().toLocaleTimeString() + `.${Math.floor(Math.random() * 900)}`,
          status,
          message: msg
        },
        ...logsAcc
      ];
      setReqBatchLogs([...logsAcc]);
      index++;
    }, 180);
  };

  // Filtered store listing
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          store.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          store.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "全部" || store.status === statusFilter;
    const matchesPlan = planFilter === "全部" || store.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage) || 1;
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Visual Tab Selection */}
      <div className="flex border-b border-[#e1e3e5] gap-3">
        <button
          onClick={() => setActiveSubTab("list")}
          className={`pb-2.5 px-3 text-xs font-bold transition-all cursor-pointer border-b-2 ${
            activeSubTab === "list" 
              ? "border-[#008060] text-[#008060] font-sans" 
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          店铺资产名录 (Tenant Stores)
        </button>
        <button
          onClick={() => setActiveSubTab("domains")}
          className={`pb-2.5 px-3 text-xs font-bold transition-all cursor-pointer border-b-2 ${
            activeSubTab === "domains" 
              ? "border-[#008060] text-[#008060]" 
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          SSL & 顶级域名绑定 (Custom Domains Integration)
        </button>
        <button
          onClick={() => setActiveSubTab("limits")}
          className={`pb-2.5 px-3 text-xs font-bold transition-all cursor-pointer border-b-2 ${
            activeSubTab === "limits" 
              ? "border-[#008060] text-[#008060]" 
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          限速熔断及网关配额校验 (Plan Quota Sandbox)
        </button>
      </div>

      {/* Sub Tab: Store List */}
      {activeSubTab === "list" && (
        <>
          {/* Search and Filters Strip */}
          <div className="card-shopify p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Left Side Inputs */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:w-64 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索店铺名、域名或 ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#008060] text-gray-800 font-medium"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-white border border-slate-200 rounded-md py-2 px-3 outline-none text-gray-700 font-bold"
              >
                <option value="全部">全部状态</option>
                <option value="启用">正常启用</option>
                <option value="禁用">封锁禁用</option>
                <option value="冻结">冻结申诉</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => {
                  setPlanFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-white border border-slate-200 rounded-md py-2 px-3 outline-none text-gray-700 font-bold"
              >
                <option value="全部">全套餐</option>
                <option value="企业版">企业版</option>
                <option value="专业版">专业版</option>
                <option value="基础版">基础版</option>
              </select>
            </div>

            {/* Right Side Actions */}
            <button
              onClick={onOpenCreateDrawer}
              className="w-full md:w-auto text-xs bg-[#008060] hover:bg-[#006e52] text-white py-2 px-4 rounded-md font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              创建店铺
            </button>
          </div>

          {/* Main Shopify table layout */}
          <div className="card-shopify overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] text-xs font-bold font-sans">
                    <th className="py-3 px-4">标志 & ID</th>
                    <th className="py-3 px-4">商户店名</th>
                    <th className="py-3 px-4">独立域名</th>
                    <th className="py-3 px-4">运行套餐</th>
                    <th className="py-3 px-4">当前状态</th>
                    <th className="py-3 px-4">到期时间</th>
                    <th className="py-3 px-4 text-right">管理操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3e5] text-xs font-sans text-gray-700">
                  {paginatedStores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50/70 transition-colors h-[52px]">
                      <td className="py-2.5 px-4 font-mono font-medium text-gray-500 whitespace-nowrap">
                        <span className="inline-block mr-2 text-base">{store.logo}</span>
                        {store.id}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-[#202223]">{store.name}</td>
                      <td className="py-2.5 px-4">
                        <a 
                          href={`https://${store.domain}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#2c6ecb] hover:underline flex items-center gap-1 font-mono tracking-tight"
                        >
                          {store.domain}
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="bg-slate-100/80 text-gray-700 font-bold px-2 py-0.5 rounded border border-gray-200/50">
                          {store.plan}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-bold">
                        {store.status === "启用" && (
                          <span className="inline-flex items-center gap-1 text-[#008060] bg-[#e2f1e4] px-2 py-0.5 rounded-full border border-[#bbe5b3]">
                            ● 运行中
                          </span>
                        )}
                        {store.status === "禁用" && (
                          <span className="inline-flex items-center gap-1 text-[#d82c0d] bg-[#fff0f0] px-2 py-0.5 rounded-full border border-red-200">
                            ● 封锁中
                          </span>
                        )}
                        {store.status === "冻结" && (
                          <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            ● 待审核
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[#6d7175]">{store.expireDate}</td>
                      <td className="py-2.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* View */}
                        <button
                          onClick={() => onViewDetails(store)}
                          title="查看详情"
                          className="inline-flex items-center gap-0.5 text-[#202223] font-bold py-1 px-2 border border-slate-200 rounded bg-white hover:bg-slate-50 transition cursor-pointer text-[11px]"
                        >
                          <Eye className="w-3 h-3 text-[#2c6ecb]" />
                          <span>查看</span>
                        </button>

                        {/* Quick status switch toggle */}
                        <button
                          onClick={() => {
                            const nextStatus = store.status === "启用" ? "禁用" : "启用";
                            onUpdateStore(store.id, { status: nextStatus });
                          }}
                          title={store.status === "启用" ? "点击禁用该商户" : "点击启动该商户"}
                          className={`inline-flex items-center gap-0.5 font-bold py-1 px-2 border rounded transition cursor-pointer text-[11px] ${
                            store.status === "启用"
                              ? "border-red-200 text-[#d82c0d] hover:bg-red-50 bg-white"
                              : "border-[#bbe5b3] text-[#008060] hover:bg-[#e2f1e4] bg-white"
                          }`}
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span>{store.status === "启用" ? "禁用" : "启用"}</span>
                        </button>

                        {/* Impersonated Login */}
                        <button
                          onClick={() => onLoginAsStore(store)}
                          title="模拟超级穿透调试"
                          className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 font-bold py-1 px-2 border border-emerald-200 rounded transition cursor-pointer text-[11px] animate-pulse"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>仿冒调试</span>
                        </button>

                        {/* Hard Delete */}
                        <button
                          onClick={() => {
                            if (confirm(`确认物理擦除店铺 "${store.name}" 吗？该操作不可逆！`)) {
                              onDeleteStore(store.id);
                            }
                          }}
                          title="真删除数据"
                          className="inline-flex items-center gap-0.5 text-[#d82c0d] bg-red-50 hover:bg-red-100 font-bold py-1 px-2 border border-red-200 rounded transition cursor-pointer text-[11px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>物理擦除</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {paginatedStores.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-[#6d7175]">
                        未检索到符合过滤条件的店铺资源。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Component */}
            <div className="p-3 border-t border-[#e1e3e5] bg-[#f9fafb] flex items-center justify-between text-xs text-[#202223] font-bold">
              <span>
                共筛选出 <strong className="font-mono">{filteredStores.length}</strong> 家店铺 | 当前第 {currentPage}/{totalPages} 页
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white border border-[#cbd0d2] hover:bg-gray-50 rounded text-gray-700 transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  前页
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white border border-[#cbd0d2] hover:bg-gray-50 rounded text-gray-700 transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  后页
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sub Tab: Domains & SSL Automation */}
      {activeSubTab === "domains" && (
        <div className="card-shopify p-5 space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-[#008060]" />
              <span>Let's Encrypt 顶级域名自动签名验证系统 (SSL Provisoner & DNS Sharder)</span>
            </h3>
            <p className="text-[11px] text-[#6d7175]">
              多租户独立站绑定。零配置 HTTPS 自动化，支持 ACM 域名配置与 CNAME 递归验证安全检查
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4 bg-slate-50 p-4 rounded-md border border-slate-200 text-xs space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">目标商户主体 (Tenant)</label>
                <select
                  value={selectedDomainStore}
                  onChange={(e) => setSelectedDomainStore(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded font-bold"
                >
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">新独立域名 (Domain)</label>
                <input
                  type="text"
                  value={customDomainText}
                  onChange={(e) => setCustomDomainText(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded font-mono font-bold"
                  placeholder="e.g. store.custom.com"
                />
              </div>

              <button
                onClick={triggerDomainSslVerification}
                className="w-full py-2 bg-[#008060] hover:bg-[#006e52] text-white rounded font-bold cursor-pointer text-xs"
              >
                验证解析并下发证书
              </button>

              <div className="p-3 bg-white border border-slate-100 rounded text-[10px] space-y-1.5 text-gray-600">
                <span className="font-bold text-gray-800 uppercase block">📡 全球边缘集群 DNS A记录:</span>
                <p>1. <span className="font-mono bg-slate-100 px-1 font-bold">@ A 104.18.23.41</span> (主站加速段)</p>
                <p>2. <span className="font-mono bg-slate-100 px-1 font-bold">cname cname.shopifysaas.com</span> (CNAME节点)</p>
              </div>
            </div>

            <div className="md:col-span-8 space-y-3 text-xs">
              <span className="font-bold text-gray-700 block">自动签名流水线实时输出 (Let's Encrypt Logs)</span>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-md h-[180px] font-mono text-[11px] text-slate-300 space-y-1.5 overflow-y-auto">
                {domainVerifyStep === 0 ? (
                  <p className="text-gray-500 animate-pulse">● 待执行。请填完参数并在左方点击进行 DNS 握手与证书自动下发签发...</p>
                ) : (
                  domainLogs.map((log, i) => (
                    <p key={i} className={log.startsWith("🎉") ? "text-emerald-400 font-bold" : "text-gray-300"}>
                      {log}
                    </p>
                  ))
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 p-3 bg-white border border-slate-200 rounded flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">证书签发机构 (Issuer)</span>
                    <span className="font-bold text-[#008060]">Let's Encrypt ECDSA Authority</span>
                  </div>
                  <Cpu className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex-1 p-3 bg-white border border-slate-200 rounded flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold">安全红线隔离状态 (Isolation)</span>
                    <span className={`font-bold ${sslActive ? "text-emerald-600" : "text-amber-500"}`}>
                      {sslActive ? "🔒 物理多态 Nginx 独立容器隔离" : "⏳ 待下发"}
                    </span>
                  </div>
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub Tab: Rate Limits and Leaky Bucket Sandbox */}
      {activeSubTab === "limits" && (
        <div className="card-shopify p-5 space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#008060]" />
              <span>多租户网关限速与防抖沙箱 (Gateway Rate-Limit and Leaky-Bucket Simulator)</span>
            </h3>
            <p className="text-[11px] text-[#6d7175]">
              模拟大流量压测下各资费等级（基础版、专业版、旗舰版）硬编码触发 429 Too Many Requests 逻辑，测试熔断器保活
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4 bg-slate-50 p-4 rounded-md border border-slate-200 text-xs space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">选择模拟限速店铺</label>
                <select
                  value={selectedLimitStore}
                  onChange={(e) => setSelectedLimitStore(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded font-bold"
                >
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - 套餐: [{s.plan}]</option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 bg-white border border-slate-100 rounded space-y-2">
                <span className="font-bold text-gray-800 uppercase text-[10px] block">当前层网限限制 (Rate Quotas):</span>
                <p className="text-[11px]">商户等级: <strong className="text-blue-600">{activeLimitStoreObj?.plan || "基础版"}</strong></p>
                {activeLimitStoreObj?.plan === "基础版" && (
                  <ul className="list-disc pl-4 text-[10px] text-red-600 font-bold space-y-1">
                    <li>限速阈值: 5 次请求 / 1秒内并发</li>
                    <li>熔断保护: 滑动窗口防火墙严厉过滤</li>
                  </ul>
                )}
                {activeLimitStoreObj?.plan === "专业版" && (
                  <ul className="list-disc pl-4 text-[10px] text-amber-600 font-bold space-y-1">
                    <li>限速阈值: 12 次请求 / 1秒内并发</li>
                    <li>熔断保护: 中级队列缓冲及漏桶算法</li>
                  </ul>
                )}
                {activeLimitStoreObj?.plan === "企业版" && (
                  <ul className="list-disc pl-4 text-[10px] text-emerald-600 font-bold space-y-1">
                    <li>限速阈值: 不限并发</li>
                    <li>保护机制: 物理独立服务器节点集群无感路由</li>
                  </ul>
                )}
              </div>

              <button
                onClick={runRateLimitSimulation}
                disabled={isSimulatingLimits}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isSimulatingLimits ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>压测中... (20次并发撞车中)</span>
                  </>
                ) : (
                  <span>🚀 立即发起 20 次突发大流量压测</span>
                )}
              </button>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-md">
                <span>Leaky-Bucket 漏桶算法防 Ddos 引擎模拟，被丢弃(429)数量: <strong>{bucketCount}</strong> 次</span>
                <span className="font-mono text-[10px] font-bold bg-white text-[#008060] px-2 py-0.5 rounded">
                  {isSimulatingLimits ? "ACTIVE SIMULATION" : "COOLDOWN"}
                </span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto border border-slate-200 rounded-md bg-white text-xs divide-y">
                {reqBatchLogs.length === 0 ? (
                  <p className="text-center py-12 text-gray-400 font-sans">
                    暂无压测日志跑出。请点击左侧按钮，系统会以 180ms/次 发送高并发 API 指令来验证底层 SaaS 熔断阀防火墙。
                  </p>
                ) : (
                  reqBatchLogs.map((log) => (
                    <div key={log.id} className="p-2.5 flex items-start justify-between gap-3 text-[11px] hover:bg-slate-50 transition">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-400">#{log.id}</span>
                          <span className="font-mono text-gray-500 font-bold">[{log.time}]</span>
                          <span className="font-mono font-bold text-blue-600">{log.method}</span>
                          <span className="font-mono font-medium text-gray-600">{log.url}</span>
                        </div>
                        <p className={log.status === 429 ? "text-red-600 font-bold" : "text-gray-500 font-medium"}>
                          {log.message}
                        </p>
                      </div>

                      <span className={`font-mono font-extrabold px-1.5 py-0.5 rounded text-[10px] ${
                        log.status === 429 
                          ? "bg-red-50 text-red-600 border border-red-200" 
                          : "bg-[#e2f1e4] text-[#008060] border border-[#bbe5b3]"
                      }`}>
                        {log.status === 429 ? "429 Too Many" : "200 OK"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
