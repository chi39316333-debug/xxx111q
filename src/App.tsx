import React, { useState, useMemo } from "react";
import { 
  Plus, Search, HelpCircle, Bell, Volume2, Shield, User, ChevronDown, 
  Terminal, Globe, DollarSign, Command, Sparkles, AlertCircle, RefreshCw, X
} from "lucide-react";

// Mock data and type lists
import { 
  initialStores, initialUsers, initialPlans, initialSubs, initialPayouts,
  initialOrders, initialBills, initialInvoices, initialApps, initialThemes,
  initialFiles, initialPosts, initialTickets, initialLogs, initialApiKeys,
  initialWebhooks, initialNotifies, initialBackups, initialSettings
} from "./data/mockData";

import { 
  StoreItem, UserItem, PlanItem, SubItem, MoneyItem, FileItem,
  AppItem, ThemeItem, TicketItem, PostItem, ApiKeyItem, WebhookItem,
  SettingItem, LogItem
} from "./types";

// Page modules
import Sidebar from "./shared/components/Sidebar";
import RightDrawer from "./shared/components/RightDrawer";
import SidekickPanel from "./shared/components/SidekickPanel";
import DashboardModule from "./modules/dashboard/DashboardModule";
import StoreModule from "./modules/stores/StoreModule";
import UserModule from "./modules/users/UserModule";
import PlanModule from "./modules/plans/PlanModule";
import FinanceModule from "./modules/finance/FinanceModule";
import OtherModules from "./modules/infrastructure/OtherModules";
import DatabaseModule from "./modules/infrastructure/DatabaseModule";

export default function App() {
  // Current logged role simulation: "超管" | "运营" | "财务" | "客服" | "开发" | "审计"
  const [role, setRole] = useState<string>("超管");
  const [activeTab, setActiveTab] = useState<string>("home");

  // Databases states
  const [stores, setStores] = useState<StoreItem[]>(initialStores);
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [plans, setPlans] = useState<PlanItem[]>(initialPlans);
  const [subs, setSubs] = useState<SubItem[]>(initialSubs);
  const [payouts, setPayouts] = useState<MoneyItem[]>(initialPayouts);
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [bills, setBills] = useState<any[]>(initialBills);
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);
  const [apps, setApps] = useState<AppItem[]>(initialApps);
  const [themes, setThemes] = useState<ThemeItem[]>(initialThemes);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [tickets, setTickets] = useState<TicketItem[]>(initialTickets);
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(initialApiKeys);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>(initialWebhooks);
  const [notifies, setNotifies] = useState<any[]>(initialNotifies);
  const [backups, setBackups] = useState<any[]>(initialBackups);
  const [settings, setSettings] = useState<SettingItem[]>(initialSettings);

  const fetchAllDatabaseData = async () => {
    try {
      const res = await fetch("/api/db/all");
      if (res.ok) {
        const d = await res.json();
        if (d.stores) setStores(d.stores);
        if (d.users) setUsers(d.users);
        if (d.plans) setPlans(d.plans);
        if (d.subs) setSubs(d.subs);
        if (d.payouts) setPayouts(d.payouts);
        if (d.orders) setOrders(d.orders);
        if (d.bills) setBills(d.bills);
        if (d.invoices) setInvoices(d.invoices);
        if (d.apps) setApps(d.apps);
        if (d.themes) setThemes(d.themes);
        if (d.files) setFiles(d.files);
        if (d.posts) setPosts(d.posts);
        if (d.tickets) setTickets(d.tickets);
        if (d.logs) setLogs(d.logs);
        if (d.apiKeys) setApiKeys(d.apiKeys);
        if (d.webhooks) setWebhooks(d.webhooks);
        if (d.settings) setSettings(d.settings);
        if (d.notifies) setNotifies(d.notifies);
        if (d.backups) setBackups(d.backups);
      }
    } catch (e) {
      console.error("Failed to load filesystem DB data:", e);
    }
  };

  React.useEffect(() => {
    fetchAllDatabaseData();
  }, []);

  // Global search & notifications
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  // Store impersonated login state ("登录商户" mode)
  const [impersonatedMerchant, setImpersonatedMerchant] = useState<StoreItem | null>(null);

  // Drawer control
  const [isSidekickOpen, setIsSidekickOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerType, setDrawerType] = useState<"store_view" | "store_create" | "user_view" | "plan_edit" | "post_create" | "role_create" | null>(null);
  
  // Selected resource for detailed view/edit
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);

  // Form states for creating & saving
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreDomain, setNewStoreDomain] = useState("");
  const [newStorePlan, setNewStorePlan] = useState("专业版");
  const [newStoreLogo, setNewStoreLogo] = useState("🛍️");
  
  const [tempPlanName, setTempPlanName] = useState("");
  const [tempPlanMonthly, setTempPlanMonthly] = useState(0);
  const [tempPlanYearly, setTempPlanYearly] = useState(0);

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  // System notification counter
  const unreadCount = notifies.filter(n => !n.read).length;

  // Global state mutator with audit logger integration (Section 25 of spec)
  const appendAuditLog = (operatorName: string, actionName: string, detailText: string) => {
    const freshLog: LogItem = {
      id: `L-${Math.floor(100 + Math.random() * 900)}`,
      time: new Date().toLocaleTimeString("zh-CN", { hour: '2-digit', minute: '2-digit' }),
      operator: operatorName,
      action: actionName,
      detail: detailText
    };
    setLogs(prev => [freshLog, ...prev]);
    fetch("/api/db/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(freshLog)
    }).catch(console.error);
  };

  // Updaters implementation
  const handleUpdateStore = async (id: string, updated: Partial<StoreItem>) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    try {
      await fetch(`/api/db/stores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error(e);
    }
    appendAuditLog(role + "管理员", "修改店铺", `店ID: ${id} 属性变动为: ${JSON.stringify(updated)}`);
  };

  const handleDeleteStore = async (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`/api/db/stores/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
    appendAuditLog("超级管理员", "删除店铺", `彻底物理清退店铺资料，其ID为: ${id}`);
  };

  const handleUpdateUser = async (id: string, updated: Partial<UserItem>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    try {
      await fetch(`/api/db/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error(e);
    }
    appendAuditLog(role + "管理员", "修改用户", `修改用户账户 ${id}: ${JSON.stringify(updated)}`);
  };

  const handleDeleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    try {
      await fetch(`/api/db/users/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
    appendAuditLog("超级管理员", "删除用户", `清退平台用户 ID: ${id}`);
  };

  const handleUpdatePlan = async (id: string, updated: Partial<PlanItem>) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    try {
      await fetch(`/api/db/plans/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error(e);
    }
    appendAuditLog("超级管理员", "调整套餐", `套餐ID: ${id} 更新规则 ${JSON.stringify(updated)}`);
  };

  const handleUpdateSub = async (id: string, updated: Partial<SubItem>) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    try {
      await fetch(`/api/db/subs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.error(e);
    }
    appendAuditLog(role + "管理端", "变更订阅周期", `订阅合同 ${id} 重新配置`);
  };

  const handlePayoutStatus = async (id: string, status: "审核中" | "已放款" | "已驳回") => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    try {
      await fetch(`/api/db/payouts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error(e);
    }
    const item = payouts.find(p => p.id === id);
    appendAuditLog("财务主管", `分账提现审理 [${status}]`, `打款给 ${item?.partnerName} 金额为 €${item?.amount}`);
  };

  const handleAddUser = async (u: UserItem) => {
    setUsers(prev => [u, ...prev]);
    try {
      await fetch("/api/db/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(u)
      });
      appendAuditLog(role + "管理员", "增接入驻新租户", `用户 "${u.name}" (${u.email}) 账户创建成功！`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPlan = async (p: PlanItem) => {
    setPlans(prev => [p, ...prev]);
    try {
      await fetch("/api/db/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      appendAuditLog("超级管理员", "增加资费策略", `核心套餐 "${p.name}" (€${p.priceMonthly}/月) 新增发布`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePlan = async (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/db/plans/${id}`, { method: "DELETE" });
      appendAuditLog("超级管理员", "扣废资费策略", `物理清缴废弃套餐 ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSub = async (s: SubItem) => {
    setSubs(prev => [s, ...prev]);
    try {
      await fetch("/api/db/subs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s)
      });
      appendAuditLog(role + "管理员", "增补商户订阅", `店铺订阅实例合同 ${s.id} 挂载就绪`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSub = async (id: string) => {
    setSubs(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`/api/db/subs/${id}`, { method: "DELETE" });
      appendAuditLog("超级管理员", "注销商户合同", `注销商户套餐租赁合同 ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPayout = async (p: MoneyItem) => {
    setPayouts(prev => [p, ...prev]);
    try {
      await fetch("/api/db/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      appendAuditLog("财务人员", "新建出账申请", `商户提现款 ${p.id} 已生成挂起 €${p.amount}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePayout = async (id: string) => {
    setPayouts(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/db/payouts/${id}`, { method: "DELETE" });
      appendAuditLog("财务主管", "删除出账记录", `剔除出账审核项 ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddBill = async (b: any) => {
    setBills(prev => [b, ...prev]);
    try {
      await fetch("/api/db/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b)
      });
      appendAuditLog("财务专员", "录来账对账单", `录入商户对账单 €${b.amount}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBill = async (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
    try {
      await fetch(`/api/db/bills/${id}`, { method: "DELETE" });
      appendAuditLog("财务专员", "物理清空来账", `剔除商户往来对账单 ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddInvoice = async (inv: any) => {
    setInvoices(prev => [inv, ...prev]);
    try {
      await fetch("/api/db/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inv)
      });
      appendAuditLog("合规主管", "签署税务发票", `为店铺主体 ${inv.storeName} 新签署发票 €${inv.amount}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    try {
      await fetch(`/api/db/invoices/${id}`, { method: "DELETE" });
      appendAuditLog("合规主管", "撤毁作废发票", `删除税务合规发票流水号 ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPost = async (p: PostItem) => {
    setPosts(prev => [p, ...prev]);
    try {
      await fetch("/api/db/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      appendAuditLog(role + "管理员", "分发全局通告", `新增紧急通告 "${p.title}"`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/db/posts/${id}`, { method: "DELETE" });
      appendAuditLog("超级管理员", "删除全局通告", `清除内网公示公告 ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddApiKey = async (k: ApiKeyItem) => {
    setApiKeys(prev => [k, ...prev]);
    try {
      await fetch("/api/db/apiKeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(k)
      });
      appendAuditLog(role + "管理员", "生成API通信凭据", `生成超级凭据授权 ${k.name}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    try {
      await fetch(`/api/db/apiKeys/${id}`, { method: "DELETE" });
      appendAuditLog("超级管理员", "销毁API凭据", `封禁并清退了该 API Key ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddWebhook = async (w: WebhookItem) => {
    setWebhooks(prev => [w, ...prev]);
    try {
      await fetch("/api/db/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(w)
      });
      appendAuditLog(role + "管理员", "添加事件Webhook分发", `订阅了事件 ${w.topic} 到链接 ${w.url}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
    try {
      await fetch(`/api/db/webhooks/${id}`, { method: "DELETE" });
      appendAuditLog("超级管理员", "解绑Webhook分发", `解除了事件推流监听 ${id}`);
    } catch (e) {
      console.error(e);
    }
  };

  // Open create / detail drawers
  const handleOpenStoreDetails = (store: StoreItem) => {
    setSelectedStore(store);
    setDrawerTitle("店铺审计详情");
    setDrawerType("store_view");
    setIsDrawerOpen(true);
  };

  const handleOpenUserDetails = (user: UserItem) => {
    setSelectedUser(user);
    setDrawerTitle("用户审计及安全画册");
    setDrawerType("user_view");
    setIsDrawerOpen(true);
  };

  const handleOpenPlanEdit = (plan: PlanItem) => {
    setSelectedPlan(plan);
    setTempPlanName(plan.name);
    setTempPlanMonthly(plan.priceMonthly);
    setTempPlanYearly(plan.priceYearly);
    setDrawerTitle("编辑资费套餐策略");
    setDrawerType("plan_edit");
    setIsDrawerOpen(true);
  };

  const handleOpenPostCreate = () => {
    setNewPostTitle("");
    setNewPostContent("");
    setDrawerTitle("分发全平台紧急通告");
    setDrawerType("post_create");
    setIsDrawerOpen(true);
  };

  const handleOpenStoreCreate = () => {
    setNewStoreName("");
    setNewStoreDomain("");
    setDrawerTitle("入驻全新 Shopify SaaS 商家");
    setDrawerType("store_create");
    setIsDrawerOpen(true);
  };

  const handleOpenRoleCreate = () => {
    setDrawerTitle("增补 RBAC 专员访问权限组");
    setDrawerType("role_create");
    setIsDrawerOpen(true);
  };

  // Quick setup actions from home page shortcuts
  const handleQuickAction = (action: string) => {
    if (action === "create_store") handleOpenStoreCreate();
    else if (action === "create_plan") {
      setActiveTab("plan");
      alert("请点击套餐卡片底部的‘编辑’以进行调整，或在此快速生成套餐配置！");
    }
    else if (action === "post_announcement") {
      setActiveTab("post");
      handleOpenPostCreate();
    }
    else if (action === "create_role") {
      setActiveTab("auth");
      handleOpenRoleCreate();
    }
  };

  // Master triggers
  const handleTriggerAction = (actionType: string) => {
    if (actionType === "clear_recycle_bin") {
      const discarded = files.filter(f => f.status === "回收");
      discarded.forEach(f => {
        fetch(`/api/db/files/${f.id}`, { method: "DELETE" }).catch(console.error);
      });
      setFiles(prev => prev.filter(f => f.status === "正常"));
      appendAuditLog("系统守护", "清退磁盘", "清退对象存储回收站，彻底销毁冗余物理图片及zip");
    } else if (actionType === "trigger_backup") {
      const snapName = `snapshots_manual_${Date.now().toString().slice(-4)}.sql`;
      const newB = { id: `B-${Math.floor(100 + Math.random() * 900)}`, name: snapName, size: "45.1 MB", time: "2026-06-20实时" };
      setBackups(prev => [newB, ...prev]);
      fetch("/api/db/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newB)
      }).catch(console.error);
      appendAuditLog("基础架构守护", "快照打包", `全网用户、商户、订阅记录及套餐打包存储至腾讯云COS!`);
    } else if (actionType === "create_store_submit") {
      if (!newStoreName.trim() || !newStoreDomain.trim()) return;
      const createdItem: StoreItem = {
        id: `S-${Math.floor(100 + Math.random() * 900)}`,
        logo: newStoreLogo,
        name: newStoreName,
        domain: newStoreDomain,
        plan: newStorePlan,
        status: "启用",
        expireDate: "2026-12-25"
      };
      setStores(prev => [createdItem, ...prev]);
      fetch("/api/db/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdItem)
      }).catch(console.error);
      setIsDrawerOpen(false);
      appendAuditLog(role + "管理员", "增接入驻新店铺", `商户 "${newStoreName}" 注册 CNAME 路由 ${newStoreDomain} 成功！`);
    } else if (actionType === "plan_edit_submit") {
      if (!selectedPlan) return;
      handleUpdatePlan(selectedPlan.id, {
        name: tempPlanName,
        priceMonthly: tempPlanMonthly,
        priceYearly: tempPlanYearly
      });
      setIsDrawerOpen(false);
    } else if (actionType === "post_create_submit") {
      if (!newPostTitle.trim() || !newPostContent.trim()) return;
      const createdPost: PostItem = {
        id: `PST-${Math.floor(100 + Math.random() * 900)}`,
        title: newPostTitle,
        content: newPostContent,
        status: "发布",
        time: "2026-06-20"
      };
      setPosts(prev => [createdPost, ...prev]);
      fetch("/api/db/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createdPost)
      }).catch(console.error);
      setIsDrawerOpen(false);
      appendAuditLog(role + "管理员", "分发紧急要闻", `发布内网及商家面板要闻 "${newPostTitle}"`);
    }
  };

  // Compute active store totals for KPI
  const activeStoresCount = stores.filter(s => s.status === "启用").length;

  return (
    <div className="flex h-screen bg-[#F1F1F1] text-[#202223] font-sans antialiased overflow-hidden">
      
      {/* --------------------- LEFT SIDE BAR (深色侧栏 240px) --------------------- */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        role={role} 
        setRole={setRole}
        ticketCount={tickets.filter(t => t.status === "待回复").length}
      />

      {/* --------------------- MAIN RIGHT CONTAINER --------------------- */}
      <div className="flex-1 flex flex-col min-w-0 h-screen font-sans">
        
        {/* Merchant Impersonation Warning Banner (Shopify mode) */}
        {impersonatedMerchant && (
          <div className="bg-[#feebc8] text-[#c05621] border-b border-[#fbd38d] px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs z-10 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="animate-pulse text-base">🔴</span>
              <span>
                正在强力模拟商家身份登录: <strong className="font-bold">{impersonatedMerchant.name}</strong> ({impersonatedMerchant.domain})。
                您当前可查看其网关分销与订单日志，此环境操作将双向同步底层数据库。
              </span>
            </div>
            <button
              onClick={() => {
                setImpersonatedMerchant(null);
                appendAuditLog("系统守护", "退出登录模拟", "管理员优雅退出商家多租户前台模拟态");
              }}
              className="bg-white hover:bg-orange-100 text-[#c05621] border border-orange-300 font-bold px-2 py-0.5 rounded cursor-pointer transition text-[11px]"
            >
              一键锁屏退回超管
            </button>
          </div>
        )}

        {/* --------------------- TOP BAR (白色 56px) --------------------- */}
        <header className="h-[56px] bg-white border-b border-[#e1e3e5] px-5 flex items-center justify-between shrink-0 select-none z-10">
          
          {/* Breadcrumb Title (Names within 4 chars constraint) */}
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-[#008060]" />
            <h2 className="text-sm font-bold tracking-tight text-[#202223] font-sans">
              {activeTab === "home" && "首页数据"}
              {activeTab === "data" && "数据监控"}
              {activeTab === "store" && "商户店铺"}
              {activeTab === "user" && "租户用户"}
              {activeTab === "plan" && "套餐策略"}
              {activeTab === "sub" && "订阅合同"}
              {activeTab === "money" && "财务清算"}
              {activeTab === "ticket" && "商户工单"}
              {activeTab === "post" && "宣传公告"}
              {activeTab === "app" && "应用市场"}
              {activeTab === "theme" && "外观模板"}
              {activeTab === "file" && "CDN文件"}
              {activeTab === "api" && "密钥回调"}
              {activeTab === "auth" && "RBAC权限"}
              {activeTab === "log" && "系统日志"}
              {activeTab === "set" && "平台设置"}
            </h2>
            <div className="h-4 w-px bg-gray-200.5 mx-2" />
            <span className="text-[10px] text-[#6d7175] font-bold bg-gray-100 p-0.5 px-2 rounded-full border border-gray-200/50 uppercase tracking-widest font-mono">
              ROLE: {role}
            </span>
          </div>

          {/* Quick Stats Banner Search */}
          <div className="hidden md:flex relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="极速穿透检索店铺、工单或安全状态..."
              value={globalSearchTerm}
              onChange={(e) => {
                const term = e.target.value;
                setGlobalSearchTerm(term);
                // Smart auto-routing for ultra-fast experience
                if (term.toLowerCase().includes("S-") || term.includes("店")) {
                  setActiveTab("store");
                } else if (term.toLowerCase().includes("U-") || term.includes("用户")) {
                  setActiveTab("user");
                } else if (term.toLowerCase().includes("PAY-") || term.includes("提现")) {
                  setActiveTab("money");
                }
              }}
              className="text-xs pl-9 pr-3 py-1.5 w-full bg-[#f1f1f1]/80 hover:bg-[#f1f1f1] border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#008060] font-medium"
            />
          </div>

          {/* Right Toolbar Widgets */}
          <div className="flex items-center gap-3">
            
            {/* Shopify Sidekick Toggle Button */}
            <button
              onClick={() => setIsSidekickOpen(!isSidekickOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-extrabold transition cursor-pointer select-none ${
                isSidekickOpen
                  ? "bg-[#feebc8] text-[#bf5600] border-amber-300 shadow-xs"
                  : "bg-white hover:bg-amber-50/40 text-amber-900 border-slate-200.5 shadow-3xs"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#bf5600] animate-pulse shrink-0" />
              <span>Sidekick AI</span>
              {isSidekickOpen ? (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Live alerts button */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                className="p-1.5 hover:bg-[#f1f1f1] rounded-md text-gray-500 hover:text-gray-900 transition flex items-center relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#d82c0d] rounded-full animate-ping" />
                )}
              </button>

              {/* Notification overlay popup */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-[#e1e3e5] shadow-xl z-50 p-4 space-y-3 animate-slide-in">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e1e3e5]">
                    <span className="text-xs font-bold text-[#202223]">实时安全告警</span>
                    <button 
                      onClick={() => {
                        notifies.forEach(n => {
                          if (!n.read) {
                            fetch(`/api/db/notifies/${n.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ read: true })
                            }).catch(console.error);
                          }
                        });
                        setNotifies(prev => prev.map(n => ({ ...n, read: true })));
                        setIsNotificationsOpen(false);
                      }} 
                      className="text-[10px] text-[#008060] hover:underline font-bold cursor-pointer"
                    >
                      标记已读
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs text-gray-600 font-sans">
                    {notifies.map((n) => (
                      <div key={n.id} className={`p-2 rounded ${n.read ? "bg-white" : "bg-[#e2f1e4]/40 border-l-2 border-[#008060]"}`}>
                        <p className="font-bold text-gray-800 leading-tight">{n.title}</p>
                        <span className="text-[9px] text-[#6d7175] font-mono block mt-1">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick guide widget */}
            <div className="relative">
              <button 
                onClick={() => setIsHelpOpen(!isHelpOpen)}
                className="p-1.5 hover:bg-[#f1f1f1] rounded-md text-gray-500 hover:text-gray-900 transition flex items-center cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {isHelpOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-[#e1e3e5] shadow-xl z-50 p-4 space-y-2 animate-slide-in">
                  <span className="text-xs font-bold text-gray-900 block pb-1 border-b border-[#e1e3e5]">超管系统极速入门</span>
                  <p className="text-[11px] text-[#6d7175] leading-relaxed">
                    本后台遵循极简而严苛的第一方 Shopify 视觉设计系统与全功能开发规范打造：
                    <br />● 所有操作、提现审批均即时写回底层状态。
                    <br />● 切换左下角用户身份，可实时预览 RBAC 一级、二级功能锁。
                  </p>
                </div>
              )}
            </div>

            {/* Administrator visual profile block */}
            <div className="relative">
              <button 
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className="flex items-center gap-1 p-1 hover:bg-[#f1f1f1] rounded-md transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#008060] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  C
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {isAvatarOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-[#e1e3e5] shadow-xl z-50 py-1 text-xs text-gray-700 animate-slide-in font-bold">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-gray-900 font-bold">莫达超管专员</p>
                    <p className="text-[10px] text-gray-400 font-mono">chi39316333@gmail.cc</p>
                  </div>
                  <button 
                    onClick={() => {
                      alert("正在安全校验您的加密令牌...");
                      setIsAvatarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#f1f1f1] transition cursor-pointer"
                  >
                    重刷新安全令牌
                  </button>
                  <button 
                    onClick={() => {
                      setRole("超管");
                      setIsAvatarOpen(false);
                      appendAuditLog("超级管理员", "自保自签", "重置并恢复超级管理员权限链");
                      alert("已一键退回到平台超级管理员！");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#f1f1f1] text-[#d82c0d] transition cursor-pointer border-t border-gray-100"
                  >
                    重设角色为超管
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* --------------------- MAIN WORK CONTENT FIELD (100% height, max-w 1600px, deep padding) --------------------- */}
        <main className="flex-1 overflow-y-auto p-6 max-w-[1600px] w-full mx-auto space-y-6">
          
          {/* Dashboard KPI and visual widgets (首页 & 数据) */}
          {(activeTab === "home" || activeTab === "data") && (
            <DashboardModule 
              storesCount={stores.length}
              usersCount={users.length}
              totalIncome={payouts.reduce((acc, p) => acc + (p.status === "已放款" ? p.amount : 0), 0) + 1240}
              activeStores={activeStoresCount}
              onQuickAction={handleQuickAction}
            />
          )}

          {/* Tenants Stores list section (店铺) */}
          {activeTab === "store" && (
            <StoreModule 
              stores={stores}
              plans={plans}
              onUpdateStore={handleUpdateStore}
              onDeleteStore={handleDeleteStore}
              onLoginAsStore={(store) => {
                setImpersonatedMerchant(store);
                appendAuditLog("平台超级管理员", "进入调试登录态", `管理员以此商家权限穿透至该多租户系统后台 S-Id: ${store.id}`);
              }}
              onViewDetails={handleOpenStoreDetails}
              onOpenCreateDrawer={handleOpenStoreCreate}
            />
          )}

          {/* User management component (用户) */}
          {activeTab === "user" && (
            <UserModule 
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onViewDetails={handleOpenUserDetails}
            />
          )}

          {/* Packages subscriptions catalog (套餐 & 订阅) */}
          {(activeTab === "plan" || activeTab === "sub") && (
            <PlanModule 
              plans={plans}
              subs={subs}
              onAddPlan={handleAddPlan}
              onDeletePlan={handleDeletePlan}
              onAddSub={handleAddSub}
              onDeleteSub={handleDeleteSub}
              onUpdatePlan={handleUpdatePlan}
              onUpdateSub={handleUpdateSub}
              onOpenPlanEdit={handleOpenPlanEdit}
            />
          )}

          {/* Fin payouts reviewers (财务) */}
          {activeTab === "money" && (
            <FinanceModule 
              payouts={payouts}
              bills={bills}
              invoices={invoices}
              onAddPayout={handleAddPayout}
              onDeletePayout={handleDeletePayout}
              onAddBill={handleAddBill}
              onDeleteBill={handleDeleteBill}
              onAddInvoice={handleAddInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onUpdatePayoutStatus={handlePayoutStatus}
            />
          )}

          {/* Helpdesk support list, Posts catalog, App list, Webhooks list, Auditing logs stream */}
          {["ticket", "post", "app", "theme", "file", "api", "auth", "log", "set"].includes(activeTab) && (
            <OtherModules 
              moduleType={activeTab as any}
              tickets={tickets}
              posts={posts}
              apps={apps}
              themes={themes}
              files={files}
              apiKeys={apiKeys}
              webhooks={webhooks}
              logs={logs}
              settings={settings}
              onAddPost={handleAddPost}
              onDeletePost={handleDeletePost}
              onAddApiKey={handleAddApiKey}
              onDeleteApiKey={handleDeleteApiKey}
              onAddWebhook={handleAddWebhook}
              onDeleteWebhook={handleDeleteWebhook}
              onUpdateTicket={(id, updated) => {
                setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
                fetch(`/api/db/tickets/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updated)
                }).catch(console.error);
              }}
              onUpdatePost={(id, updated) => {
                setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
                fetch(`/api/db/posts/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updated)
                }).catch(console.error);
              }}
              onUpdateApp={(id, updated) => {
                setApps(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
                fetch(`/api/db/apps/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updated)
                }).catch(console.error);
              }}
              onUpdateTheme={(id, updated) => {
                setThemes(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
                fetch(`/api/db/themes/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updated)
                }).catch(console.error);
              }}
              onUpdateFile={(id, updated) => {
                setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
                fetch(`/api/db/files/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updated)
                }).catch(console.error);
              }}
              onUpdateApiKey={(id, updated) => {
                setApiKeys(prev => prev.map(k => k.id === id ? { ...k, ...updated } : k));
                fetch(`/api/db/apiKeys/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updated)
                }).catch(console.error);
              }}
              onUpdateWebhook={(id, updated) => {
                setWebhooks(prev => prev.map(w => w.id === id ? { ...w, ...updated } : w));
                fetch(`/api/db/webhooks/${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updated)
                }).catch(console.error);
              }}
              onUpdateSettings={(key, value) => {
                setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
                fetch(`/api/db/settings/${key}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ value })
                }).catch(console.error);
              }}
              onTriggerAction={handleTriggerAction}
            />
          )}

          {/* Database Admin Module */}
          {activeTab === "database" && (
            <DatabaseModule 
              onTriggerReset={async () => {
                await fetch("/api/db/reset", { method: "POST" });
                await fetchAllDatabaseData();
              }}
              onRefreshAllData={fetchAllDatabaseData}
            />
          )}

        </main>
      </div>

      {/* --------------------- GLOBAL DRAWER COMPONENT (Shopify style Right Slide) --------------------- */}
      <RightDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title={drawerTitle}
      >
        
        {/* A. View specific Store details (Section 10 of spec) */}
        {drawerType === "store_view" && selectedStore && (
          <div className="space-y-4 text-xs font-sans text-gray-700">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-[#e1e3e5]">
              <span className="text-3xl block p-1 bg-white rounded-md shadow-xs">{selectedStore.logo}</span>
              <div>
                <h4 className="text-sm font-bold text-[#202223]">{selectedStore.name}</h4>
                <p className="font-mono text-gray-400">域名主体 CNAME: {selectedStore.domain}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">元数据审计明细:</span>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <div className="bg-neutral-50 p-2.5 rounded border border-gray-100">
                  <span className="text-[9px] text-[#6d7175] block">数据库实例ID</span>
                  <span className="font-mono font-bold text-gray-900">{selectedStore.id}</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded border border-gray-100">
                  <span className="text-[9px] text-[#6d7175] block">系统到期时间</span>
                  <span className="font-mono font-bold text-slate-800">{selectedStore.expireDate}</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded border border-gray-100 font-bold">
                  <span className="text-[9px] text-[#6d7175] block">运行中资费版本</span>
                  <span className="text-[#008060]">{selectedStore.plan}</span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded border border-gray-100">
                  <span className="text-[9px] text-[#6d7175] block">当前网关响应字</span>
                  <span className="font-bold text-[#2c6ecb]">● TLS SSL正常</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">安全策略与周期管理:</span>
              
              <div className="space-y-2">
                <div className="flex gap-2.5">
                  <button
                    onClick={() => {
                      const newExp = prompt("重新规划到期年份 (格式 YYYY-MM-DD):", selectedStore.expireDate);
                      if (newExp) {
                        handleUpdateStore(selectedStore.id, { expireDate: newExp });
                        setIsDrawerOpen(false);
                      }
                    }}
                    className="flex-1 py-2 bg-white border border-slate-200 rounded text-center font-bold hover:bg-slate-50 cursor-pointer shadow-2xs transition active:scale-95"
                  >
                    更改到期年限
                  </button>
                  <button
                    onClick={() => {
                      const chosenPlan = prompt("升级/降级至新套餐 (企业版/专业版/基础版):", selectedStore.plan);
                      if (chosenPlan && ["企业版", "专业版", "基础版"].includes(chosenPlan)) {
                        handleUpdateStore(selectedStore.id, { plan: chosenPlan });
                        setIsDrawerOpen(false);
                      }
                    }}
                    className="flex-1 py-1.5 bg-white border border-slate-300 text-gray-800 hover:bg-gray-50 rounded text-center cursor-pointer font-bold shadow-2xs transition active:scale-95"
                  >
                    契约升级/降级
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const currentStatus = selectedStore.status;
                      const targetStr = currentStatus === "启用" ? "禁用" : "启用";
                      handleUpdateStore(selectedStore.id, { status: targetStr });
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full py-2 rounded font-bold text-center border cursor-pointer shadow-2xs transition active:scale-95 ${
                      selectedStore.status === "启用"
                        ? "border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100"
                        : "border-[#bbe5b3] text-[#008060] bg-emerald-50 hover:bg-emerald-100"
                    }`}
                  >
                    {selectedStore.status === "启用" ? "自主降级冻结" : "重新恢复运转"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* B. Create a brand new Store (Section 22 of spec: submitable popup) */}
        {drawerType === "store_create" && (
          <div className="space-y-4 text-xs font-sans text-gray-700">
            <p className="text-[#6d7175] mb-2 leading-relaxed">
              入驻多租户店铺需要向全局代理网关 Nginx 注册一个物理 CNAME 二级或一级独立域名：
            </p>

            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">店铺名称 (SaaS Tenant Name)</label>
                <input
                  type="text"
                  placeholder="例如: 赫本家居生活馆"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-[#008060]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">分配绑定二级域名 (Shop Domain)</label>
                <input
                  type="text"
                  placeholder="例如: hepburn.shop"
                  value={newStoreDomain}
                  onChange={(e) => setNewStoreDomain(e.target.value)}
                  className="p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-[#008060]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">核心套餐类型</label>
                <select
                  value={newStorePlan}
                  onChange={(e) => setNewStorePlan(e.target.value)}
                  className="p-2 border border-slate-200 bg-white rounded outline-none font-medium"
                >
                  <option value="基础版">基础版 (€29/月)</option>
                  <option value="专业版">专业版 (€79/月)</option>
                  <option value="企业版">企业版 (€199/月)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">选择个性品牌标志 (Emoji)</label>
                <div className="flex gap-2 pt-1">
                  {["🛍️", "🛋️", "☕", "🎨", "🍩", "👠", "🧸"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setNewStoreLogo(emoji)}
                      type="button"
                      className={`p-2 border rounded text-lg flex items-center justify-center transition cursor-pointer select-none ${
                        newStoreLogo === emoji ? "border-[#008060] bg-emerald-50 scale-110" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#f1f1f1] flex gap-2">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-2 text-center text-gray-600 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer font-bold"
              >
                取消
              </button>
              <button
                onClick={() => handleTriggerAction("create_store_submit")}
                disabled={!newStoreName.trim() || !newStoreDomain.trim()}
                className="flex-1 py-2 text-center text-white bg-[#008060] hover:bg-[#006e52] rounded shadow-xs font-bold transition disabled:opacity-50 cursor-pointer"
              >
                一键部署并开通
              </button>
            </div>
          </div>
        )}

        {/* C. View complete user profiles and history audits (Section 11) */}
        {drawerType === "user_view" && selectedUser && (
          <div className="space-y-4 text-xs font-sans text-gray-700">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-[#e1e3e5]">
              <span className="text-3xl bg-white p-2 rounded-full shadow-2xs block">{selectedUser.avatar}</span>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{selectedUser.name}</h4>
                <p className="font-mono text-gray-400">用户唯一编号: {selectedUser.id}</p>
              </div>
            </div>

            {/* Login history elements list (Section 11 specifications) */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">登录史 & 浏览器指纹:</span>
              
              <div className="p-3 bg-slate-50 rounded border border-gray-100 space-y-2">
                <div className="flex justify-between border-b border-gray-200/50 pb-1.5 align-middle">
                  <span className="text-[10px] text-[#6d7175]">常用IP地址:</span>
                  <span className="font-mono text-gray-900 font-bold">184.22.105.14 (上海徐汇)</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/50 pb-1.5 align-middle">
                  <span className="text-[10px] text-[#6d7175]">登入设备指纹:</span>
                  <span className="font-bold text-gray-900">Chrome macOS M2 Core</span>
                </div>
                <div className="flex justify-between pb-1 align-middle">
                  <span className="text-[10px] text-[#6d7175]">近1小时行为:</span>
                  <span className="text-amber-600 font-bold">查看网关提现报表</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">密码重设和授权令牌:</span>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert(`密码策略已重设！一条重置自建私钥链接已派发至该租户邮箱: ${selectedUser.email}`);
                    setIsDrawerOpen(false);
                  }}
                  className="w-full py-2 bg-white hover:bg-slate-50 text-[#202223] border border-slate-300 hover:border-slate-400 text-center font-bold rounded shadow-2xs transition active:scale-95 cursor-pointer"
                >
                  重置该商户密码及私钥
                </button>
                <button
                  onClick={() => {
                    const toggleDest = selectedUser.status === "启用" ? "封禁" : "启用";
                    handleUpdateUser(selectedUser.id, { status: toggleDest });
                    setIsDrawerOpen(false);
                  }}
                  className={`w-full py-2 font-bold text-center border rounded shadow-2xs transition active:scale-95 cursor-pointer ${
                    selectedUser.status === "启用"
                      ? "border-red-200 text-[#d82c0d] bg-red-50 hover:bg-red-100"
                      : "border-[#bbe5b3] text-[#008060] bg-emerald-50 hover:bg-emerald-100"
                  }`}
                >
                  {selectedUser.status === "启用" ? "一键强制物理封禁" : "解除隔离重投运转"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* D. Adjust Plans structures & prices (Section 12: submitable Drawer) */}
        {drawerType === "plan_edit" && selectedPlan && (
          <div className="space-y-4 text-xs font-sans text-gray-700">
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">套餐产品线名称</label>
                <input
                  type="text"
                  value={tempPlanName}
                  onChange={(e) => setTempPlanName(e.target.value)}
                  className="p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-[#008060] font-bold text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">单月授权费 (Monthly Fee, €)</label>
                <input
                  type="number"
                  value={tempPlanMonthly}
                  onChange={(e) => setTempPlanMonthly(Number(e.target.value))}
                  className="p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-[#008060] font-mono font-bold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">年度结转款 (Yearly Fee, €)</label>
                <input
                  type="number"
                  value={tempPlanYearly}
                  onChange={(e) => setTempPlanYearly(Number(e.target.value))}
                  className="p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-[#008060] font-mono font-bold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#f1f1f1] flex gap-2">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-2 text-center text-gray-600 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer font-bold"
              >
                取消
              </button>
              <button
                onClick={() => handleTriggerAction("plan_edit_submit")}
                className="flex-1 py-2 text-center text-white bg-[#008060] hover:bg-[#006e52] rounded font-bold cursor-pointer shadow-xs transition"
              >
                保存变更
              </button>
            </div>
          </div>
        )}

        {/* E. Broadcast urgent system post announcements (Section 16: submitable drawer) */}
        {drawerType === "post_create" && (
          <div className="space-y-4 text-xs font-sans text-gray-700">
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">公告主题大标题 (≤20字)</label>
                <input
                  type="text"
                  placeholder="例如: 凌晨2点核心TLS接口冷升级"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-[#008060] font-bold text-gray-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">核心提醒正文内容</label>
                <textarea
                  placeholder="编辑推送给所有进件商户看见的核心条款或接口变更细节..."
                  rows={6}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-[#008060] leading-relaxed text-gray-800"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#f1f1f1] flex gap-2 font-bold">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-2 text-center text-gray-600 bg-white border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => handleTriggerAction("post_create_submit")}
                disabled={!newPostTitle.trim() || !newPostContent.trim()}
                className="flex-1 py-2 text-center text-white bg-[#008060] hover:bg-[#006e52] rounded shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                全网派发首播
              </button>
            </div>
          </div>
        )}

        {/* F. Add new personnel role group to RBAC (Section 19: submitable drawer) */}
        {drawerType === "role_create" && (
          <div className="space-y-4 text-xs font-sans text-gray-700">
            <p className="text-[#6d7175] mb-2 leading-relaxed">
              向 RBAC 权限大树插接一个全新二级专员角色，用来将安全组或审核组的细颗粒权限指派到人：
            </p>

            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">拟定角色名称 (名字≤4字)</label>
                <input
                  type="text"
                  placeholder="例如: 财务审计"
                  className="p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-[#008060]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#202223]">核心描述</label>
                <input
                  type="text"
                  placeholder="负责租户付款、发票、税率和开发者打款"
                  className="p-2 border border-slate-200 rounded outline-none"
                />
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-bold text-[#202223] block mb-1">勾选功能安全模块:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["菜单：店铺", "菜单：财务", "出账API执行", "删除店铺权限", "退款审批权限", "写系统配置文件"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 p-1 hover:bg-slate-50 rounded cursor-pointer select-none">
                      <input type="checkbox" className="rounded text-[#008060] focus:ring-[#008060]" />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#f1f1f1] flex gap-2 font-bold">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-2 text-center text-gray-600 bg-white border border-slate-200 hover:bg-slate-50 rounded cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert("高级安全组：增补 RBAC 权限专责节点成功！已经把规则写入底层 roles");
                  setIsDrawerOpen(false);
                }}
                className="flex-1 py-2 text-center text-white bg-[#008060] hover:bg-[#006e52] rounded shadow-xs cursor-pointer"
              >
                写入规则大数
              </button>
            </div>
          </div>
        )}

      </RightDrawer>

    </div>
  );
}
