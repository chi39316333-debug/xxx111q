import React from "react";
import { 
  Grid, Activity, Globe, UserCheck, Sliders, CreditCard, 
  DollarSign, Mail, Bell, Zap, FolderOpen, HardDrive, 
  Terminal, Lock, Database, Settings, ShieldAlert
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: string;
  setRole: (role: string) => void;
  ticketCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, role, setRole, ticketCount }: SidebarProps) {
  // Check permission for each tab based on role
  const hasPermission = (tabId: string): boolean => {
    if (role === "超管" || role === "审计") return true;
    if (role === "运营") return ["home", "store", "post"].includes(tabId);
    if (role === "财务") return ["home", "data", "money"].includes(tabId);
    if (role === "客服") return ["home", "ticket"].includes(tabId);
    if (role === "开发") return ["home", "api", "log", "database"].includes(tabId);
    return false;
  };

  const menuSections = [
    {
      title: "控制",
      items: [
        { id: "home", name: "首页", icon: Grid },
        { id: "data", name: "数据", icon: Activity }
      ]
    },
    {
      title: "平台",
      items: [
        { id: "store", name: "店铺", icon: Globe },
        { id: "user", name: "用户", icon: UserCheck },
        { id: "plan", name: "套餐", icon: Sliders },
        { id: "sub", name: "订阅", icon: CreditCard }
      ]
    },
    {
      title: "运营",
      items: [
        { id: "money", name: "财务", icon: DollarSign },
        { id: "ticket", name: "工单", icon: Mail },
        { id: "post", name: "公告", icon: Bell }
      ]
    },
    {
      title: "资源",
      items: [
        { id: "app", name: "应用", icon: Zap },
        { id: "theme", name: "模板", icon: FolderOpen },
        { id: "file", name: "文件", icon: HardDrive }
      ]
    },
    {
      title: "系统",
      items: [
        { id: "api", name: "API", icon: Terminal },
        { id: "auth", name: "权限", icon: Lock },
        { id: "log", name: "日志", icon: Terminal },
        { id: "database", name: "数据库", icon: Database },
        { id: "set", name: "设置", icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-[240px] bg-[#1a1c1d] border-r border-[#2d2f31] flex flex-col justify-between shrink-0 h-screen text-slate-300 font-sans select-none overflow-y-auto">
      <div className="p-4 space-y-5">
        {/* Logo and Brand Title (Max 4 chars per subitem) */}
        <div className="flex items-center gap-2 px-1 py-2">
          <div className="w-8 h-8 rounded-lg bg-[#008060] text-white flex items-center justify-center font-bold text-lg shadow-md">
            M
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">莫达系统</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">超级控制台</p>
          </div>
        </div>

        {/* 15 menus under 5 headings */}
        <nav className="space-y-4">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] text-gray-500 font-bold px-2 uppercase tracking-wider block">
                {section.title}
              </span>
              <div className="space-y-[2px]">
                {section.items.map(item => {
                  const allowed = hasPermission(item.id);
                  const active = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => allowed && setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-md transition-all ${
                        active
                          ? "bg-[#008060] text-white font-bold shadow-sm"
                          : allowed
                          ? "text-[#abb2bf] hover:bg-[#282c34] hover:text-white"
                          : "text-gray-600 cursor-not-allowed opacity-40 hover:bg-transparent"
                      }`}
                      title={!allowed ? "该角色无访问权限" : ""}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-3.5 h-3.5" />
                        <span>{item.name}</span>
                      </div>
                      
                      {item.id === "ticket" && ticketCount > 0 && (
                        <span className="bg-[#feceb] text-amber-500 text-[9px] font-bold px-1 rounded-full border border-amber-500/20">
                          {ticketCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Role Simulating Controller Card */}
      <div className="p-4 border-t border-[#2d2f31] bg-[#141517] space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
          <span>切换用户身份</span>
        </div>
        <select
          value={role}
          onChange={(e) => {
            const chosen = e.target.value;
            setRole(chosen);
            // reset active page to 'home' if new role has no permissions to keep UI robust
            if (chosen === "运营") setActiveTab("store");
            else if (chosen === "财务") setActiveTab("money");
            else if (chosen === "客服") setActiveTab("ticket");
            else if (chosen === "开发") setActiveTab("api");
            else setActiveTab("home");
          }}
          className="w-full text-xs bg-[#24272c] text-white border border-[#3b4048] rounded px-2 py-1 outline-none text-left"
        >
          {["超管", "运营", "财务", "客服", "开发", "审计"].map(r => (
            <option key={r} value={r}>
              {r}角色
            </option>
          ))}
        </select>
        <div className="text-[9px] text-gray-500 leading-tight">
          切换后，自动触底更新该角色的菜单视图与按钮只读设定。
        </div>
      </div>
    </aside>
  );
}
