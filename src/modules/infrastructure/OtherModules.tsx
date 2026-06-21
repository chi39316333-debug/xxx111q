import React, { useState } from "react";
import { 
  Mail, MessageSquare, Check, Trash2, Shield, Plus, Power, RotateCcw, 
  Settings, Key, AlertTriangle, Play, HelpCircle, FileText, Database, HardDrive, Bell, Terminal, X
} from "lucide-react";
import { 
  TicketItem, PostItem, AppItem, ThemeItem, FileItem, ApiKeyItem, 
  WebhookItem, LogItem, SettingItem, AdminItem, RoleItem 
} from "../../types";

interface OtherModulesProps {
  moduleType: "ticket" | "post" | "app" | "theme" | "file" | "api" | "auth" | "log" | "set";
  tickets: TicketItem[];
  posts: PostItem[];
  apps: AppItem[];
  themes: ThemeItem[];
  files: FileItem[];
  apiKeys: ApiKeyItem[];
  webhooks: WebhookItem[];
  logs: LogItem[];
  settings: SettingItem[];
  onAddPost?: (post: PostItem) => void;
  onDeletePost?: (id: string) => void;
  onAddApiKey?: (key: ApiKeyItem) => void;
  onDeleteApiKey?: (id: string) => void;
  onAddWebhook?: (webhook: WebhookItem) => void;
  onDeleteWebhook?: (id: string) => void;
  onUpdateTicket: (id: string, updated: Partial<TicketItem>) => void;
  onUpdatePost: (id: string, updated: Partial<PostItem>) => void;
  onUpdateApp: (id: string, updated: Partial<AppItem>) => void;
  onUpdateTheme: (id: string, updated: Partial<ThemeItem>) => void;
  onUpdateFile: (id: string, updated: Partial<FileItem>) => void;
  onUpdateApiKey: (id: string, updated: Partial<ApiKeyItem>) => void;
  onUpdateWebhook: (id: string, updated: Partial<WebhookItem>) => void;
  onUpdateSettings: (key: string, value: string) => void;
  onTriggerAction: (actionType: string) => void;
}

export default function OtherModules({
  moduleType,
  tickets,
  posts,
  apps,
  themes,
  files,
  apiKeys,
  webhooks,
  logs,
  settings,
  onAddPost,
  onDeletePost,
  onAddApiKey,
  onDeleteApiKey,
  onAddWebhook,
  onDeleteWebhook,
  onUpdateTicket,
  onUpdatePost,
  onUpdateApp,
  onUpdateTheme,
  onUpdateFile,
  onUpdateApiKey,
  onUpdateWebhook,
  onUpdateSettings,
  onTriggerAction
}: OtherModulesProps) {
  const [ticketReplyText, setTicketReplyText] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Filters state
  const [ticketCategory, setTicketCategory] = useState("全部");
  const [postsStatus, setPostsStatus] = useState("全部");

  // Create modals state
  const [showPostModal, setShowPostModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  // New fields
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const [newApiKeyName, setNewApiKeyName] = useState("");

  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookTopic, setNewWebhookTopic] = useState("orders/create");

  // Webhook Event Delivery states for enterprise standard
  const [simWebhookId, setSimWebhookId] = useState<string>("");
  const [simEventTopic, setSimEventTopic] = useState<string>("orders/create");
  const [simDeliveries, setSimDeliveries] = useState<Array<{
    id: string;
    url: string;
    topic: string;
    timestamp: string;
    signature: string;
    attempts: Array<{ attempt: number; time: string; status: number; msg: string }>;
    status: "success" | "retry" | "failed";
  }>>([
    {
      id: "evt_9b83f01c",
      url: "https://api.merchant-service.com/webhooks/receiver",
      topic: "orders/create",
      timestamp: "2026-06-21 09:20:15",
      signature: "X-Shopify-Hmac-SHA256: 8a6f3bdfc9d2319f3900ade929281bc89a78bf9320e838ffae2",
      attempts: [
        { attempt: 1, time: "09:20:15", status: 504, msg: "Gateway Timeout (Retrying...)" },
        { attempt: 2, time: "09:20:17", status: 500, msg: "Database Connection Error (Retrying...)" },
        { attempt: 3, time: "09:20:21", status: 200, msg: "OK (Acknowledged)" }
      ],
      status: "success"
    },
    {
      id: "evt_2a18ceef",
      url: "https://shopflux-crm.co/hooks/shopify",
      topic: "products/update",
      timestamp: "2026-06-21 09:18:02",
      signature: "X-Shopify-Hmac-SHA256: c38290ba8f31920ac3998fdeabef98203c98302f30edce00a29",
      attempts: [
        { attempt: 1, time: "09:18:02", status: 404, msg: "Endpoint Not Found (Retries Exhausted)" }
      ],
      status: "failed"
    }
  ]);

  // App Store & Theme Customizer sandboxed states
  const [simAppId, setSimAppId] = useState<string>("app_stripe");
  const [appBridgeAction, setAppBridgeAction] = useState<string>("shopify.toast.show");
  const [appBridgeLogs, setAppBridgeLogs] = useState<string[]>([
    "INIT: AppBridge.initialized() successfully handshaked with Shopify Admin Iframe parent.",
    "READY: Listeners bound for postMessage channel (origin: '*')."
  ]);
  const [simToastText, setSimToastText] = useState<string>("订单同步处理完成！");
  const [showSimToast, setShowSimToast] = useState<boolean>(false);
  const [simThemeColor, setSimThemeColor] = useState<string>("#008060");
  const [simThemeRadius, setSimThemeRadius] = useState<string>("8px");
  const [simGridCols, setSimGridCols] = useState<number>(2);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert("请填写公告标题与内容");
      return;
    }
    const fresh: PostItem = {
      id: `PST-${Math.floor(100 + Math.random() * 900)}`,
      title: newPostTitle,
      content: newPostContent,
      time: new Date().toLocaleDateString(),
      status: "发布"
    };
    if (onAddPost) onAddPost(fresh);
    setNewPostTitle("");
    setNewPostContent("");
    setShowPostModal(false);
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiKeyName.trim()) return;
    const fresh: ApiKeyItem = {
      id: `KEY-${Math.floor(100 + Math.random() * 900)}`,
      name: newApiKeyName,
      prefix: "shpat_" + Math.random().toString(36).substring(3, 8),
      time: new Date().toLocaleDateString(),
      status: "启用"
    };
    if (onAddApiKey) onAddApiKey(fresh);
    setNewApiKeyName("");
    setShowApiKeyModal(false);
  };

  const handleWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) return;
    const fresh: WebhookItem = {
      id: `WH-${Math.floor(100 + Math.random() * 900)}`,
      url: newWebhookUrl,
      topic: newWebhookTopic,
      status: "启用"
    };
    if (onAddWebhook) onAddWebhook(fresh);
    setNewWebhookUrl("");
    setShowWebhookModal(false);
  };

  const handleFireWebhookSimulation = () => {
    const destWh = webhooks.find(w => w.id === simWebhookId) || webhooks[0];
    const targetUrl = destWh ? destWh.url : "https://sandbox-echo.shopify.net/webhook-receiver";
    const topic = simEventTopic;
    const eventId = "evt_" + Math.random().toString(36).substring(3, 11);
    
    // Formulate a clean sha signature
    const sampleSig = "X-Shopify-Hmac-SHA256: " + Array.from({length: 64}, () => "0123456789abcdef"[Math.floor(Math.random()*16)]).join("");

    const newDelivery = {
      id: eventId,
      url: targetUrl,
      topic: topic,
      timestamp: new Date().toLocaleDateString() + " " + new Date().toTimeString().split(" ")[0],
      signature: sampleSig,
      attempts: [
        { attempt: 1, time: new Date().toTimeString().split(" ")[0], status: 100, msg: "Webhook Dispatch Queueing..." }
      ],
      status: "retry" as const
    };
    
    setSimDeliveries(prev => [newDelivery, ...prev]);
    
    // First step backoff
    setTimeout(() => {
      setSimDeliveries(prev => prev.map(d => {
        if (d.id === eventId) {
          return {
            ...d,
            attempts: [
              ...d.attempts,
              { attempt: 1, time: new Date().toTimeString().split(" ")[0], status: 504, msg: "Gateway Timeout (exponential back-off active, rescheduling in 2000ms)" }
            ]
          };
        }
        return d;
      }));
    }, 1200);

    // Final retry delivery
    setTimeout(() => {
      setSimDeliveries(prev => prev.map(d => {
        if (d.id === eventId) {
          return {
            ...d,
            attempts: [
              ...d.attempts,
              { attempt: 2, time: new Date().toTimeString().split(" ")[0], status: 200, msg: "OK (Acknowledged success under Retry Step 2)" }
            ],
            status: "success"
          };
        }
        return d;
      }));
    }, 3000);
  };

  const handleFireAppBridge = () => {
    const timestamp = new Date().toTimeString().split(" ")[0];
    let actionLog = "";
    
    if (appBridgeAction === "shopify.toast.show") {
      actionLog = `SEND: [AppBridge -> ShopifyAdmin] PostMessage posted { type: "APP_BRIDGE_TOAST_SHOW", message: "${simToastText}" }`;
      setShowSimToast(true);
      setTimeout(() => setShowSimToast(false), 3500);
    } else if (appBridgeAction === "shopify.modal.open") {
      actionLog = `SEND: [AppBridge -> ShopifyAdmin] PostMessage posted { type: "APP_BRIDGE_MODAL_OPEN", config: { title: "Confirm Action", size: "small" } }`;
      alert("模拟沙箱弹窗 (Simulated App Bridge Modal):\n\n[App Store 安全握手正常] 该第三方APP已经通过 App Bridge 请求拉起管理员全局警告确认框！");
    } else if (appBridgeAction === "shopify.loading.start") {
      actionLog = `SEND: [AppBridge -> ShopifyAdmin] PostMessage posted { type: "APP_BRIDGE_LOADING_START" }`;
      alert("模拟加载动画 (Simulated App Bridge Loading):\n\n[App Bridge] 正在模拟拉起顶部绿色载入跑马灯进度条。");
    }

    setAppBridgeLogs(prev => [
      `${timestamp} - ${actionLog}`,
      `${timestamp} - RECEIVE: [ShopifyAdmin -> AppBridge] Parent frame safely acknowledged origin validation for App ID: "${simAppId}".`,
      ...prev
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-700 font-sans">
      
      {/* --------------------- 16. 工单模块 (Support Ticket) --------------------- */}
      {moduleType === "ticket" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#e1e3e5]">
            <div>
              <h3 className="text-sm font-bold text-[#202223]">商户工单分流</h3>
              <p className="text-[11px] text-[#6d7175]">多租户平台商户的系统故障与诉求</p>
            </div>
            <select
              value={ticketCategory}
              onChange={(e) => setTicketCategory(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded px-2.5 py-1.5 outline-none font-bold"
            >
              <option value="全部">全部类型</option>
              <option value="系统故障">系统故障</option>
              <option value="功能建议">功能建议</option>
              <option value="账号申诉">账号申诉</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket List Table/View */}
            <div className="card-shopify p-4 lg:col-span-2 space-y-3 bg-white">
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[#202223] font-bold">
                      <th className="py-2.5 px-3">编号</th>
                      <th className="py-2.5 px-3">主题摘要</th>
                      <th className="py-2.5 px-3">响应状态</th>
                      <th className="py-2.5 px-3">分配人员</th>
                      <th className="py-2.5 px-3 text-right">人工对接</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e1e3e5]">
                    {tickets
                      .filter(t => ticketCategory === "全部" || t.category === ticketCategory)
                      .map((t) => (
                        <tr 
                          key={t.id} 
                          onClick={() => setSelectedTicketId(t.id)}
                          className={`hover:bg-slate-50/50 cursor-pointer transition-colors ${
                            selectedTicketId === t.id ? "bg-[#e2f1e4]/40" : ""
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-gray-500">{t.id}</td>
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-gray-800">{t.subject}</p>
                            <p className="text-[10px] text-[#6d7175]">{t.email} • {t.category}</p>
                          </td>
                          <td className="py-2.5 px-3">
                            {t.status === "待回复" && (
                              <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                                待回复
                              </span>
                            )}
                            {t.status === "已回复" && (
                              <span className="text-[10px] bg-[#e2f1e4] text-[#008060] border border-[#bbe5b3] px-1.5 py-0.5 rounded font-bold">
                                已答复
                              </span>
                            )}
                            {t.status === "已关闭" && (
                              <span className="text-[10px] bg-gray-50 text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded font-bold">
                                已结案
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-[#202223] font-medium">{t.assignedTo}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button className="text-xs font-bold text-[#2c6ecb] hover:underline cursor-pointer">
                              对接
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ticket Thread Discussion box */}
            <div className="card-shopify p-4 space-y-4 bg-white">
              <h4 className="text-xs font-bold text-[#202223] uppercase tracking-wider pb-1.5 border-b border-[#f1f1f1]">
                工单处理控制台
              </h4>
              {selectedTicketId ? (
                (() => {
                  const currentTicket = tickets.find(t => t.id === selectedTicketId);
                  if (!currentTicket) return <p className="text-xs text-gray-400">选择工单处理</p>;

                  return (
                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-[10px] text-[#6d7175]">来源商户邮箱:</span>
                        <p className="font-mono text-[#202223] font-bold">{currentTicket.email}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6d7175]">求助内文及截图:</span>
                        <p className="bg-slate-50 p-2.5 rounded text-[#202223] border border-slate-100 italic leading-relaxed">
                          "{currentTicket.subject}" - 系统检测到底层自签域名证书握手103，请安排技术响应重置域名路由。
                        </p>
                      </div>

                      {/* Reply textbox */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gray-700">追加答复内文:</span>
                        <textarea
                          rows={3}
                          placeholder="编写商户回复消息，一键发送并置状态为已回复..."
                          value={ticketReplyText}
                          onChange={(e) => setTicketReplyText(e.target.value)}
                          className="w-full text-xs p-2 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-[#008060]"
                        />
                        <button
                          onClick={() => {
                            if (!ticketReplyText.trim()) return;
                            onUpdateTicket(currentTicket.id, { status: "已回复" });
                            setTicketReplyText("");
                            alert("回复成功，工单状态已刷新！");
                          }}
                          className="w-full text-xs font-bold bg-[#008060] text-white py-1.5 rounded hover:bg-[#006e52] cursor-pointer shadow-xs transition"
                        >
                          发信答复并归档
                        </button>
                      </div>

                      <div className="pt-2 border-t border-[#f1f1f1] flex justify-between gap-2">
                        <button
                          onClick={() => onUpdateTicket(currentTicket.id, { assignedTo: "高级工程师" })}
                          className="flex-1 py-1 px-2 text-center text-gray-700 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer font-bold"
                        >
                          分配研发
                        </button>
                        <button
                          onClick={() => onUpdateTicket(currentTicket.id, { status: "已关闭" })}
                          className="flex-1 py-1 px-2 text-center text-[#d82c0d] border border-red-100 bg-red-50 hover:bg-red-100 rounded cursor-pointer font-bold"
                        >
                          关闭工单
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12 text-[#6d7175] text-xs">
                  <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  请点击左表中的任意待决工单开始审核与流转。
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --------------------- 公告公告模块 (Announcements) --------------------- */}
      {moduleType === "post" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#e1e3e5]">
            <div>
              <h3 className="text-sm font-bold text-[#202223]">平台公告分发</h3>
              <p className="text-[11px] text-[#6d7175]">向所有 Shopify 租户推送安全补丁及费率调整公告</p>
            </div>
            <button
              onClick={() => setShowPostModal(true)}
              className="text-xs bg-[#008060] hover:bg-[#006e52] text-white py-1.5 px-3.5 rounded font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新建公告</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="card-shopify p-4 space-y-3 bg-white flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-gray-400 font-mono">{post.id} • {post.time}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      post.status === "发布" 
                        ? "bg-[#e2f1e4] text-[#008060] border border-[#bbe5b3]" 
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}>
                      {post.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{post.title}</h4>
                  <p className="text-xs text-[#6d7175] leading-relaxed italic bg-slate-50 p-2.5 rounded border border-slate-100">
                    "{post.content}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f1f1f1] flex justify-between gap-2 text-xs font-bold">
                  <button
                    onClick={() => {
                      const next = post.status === "发布" ? "草稿" : "发布";
                      onUpdatePost(post.id, { status: next });
                    }}
                    className={`flex-1 py-1 px-2 border rounded cursor-pointer transition ${
                      post.status === "发布" ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-[#bbe5b3] text-[#008060] hover:bg-[#e2f1e4]"
                    }`}
                  >
                    {post.status === "发布" ? "下架公告" : "立即发布"}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("确定擦除此条系统公告吗？")) {
                        if (onDeletePost) {
                          onDeletePost(post.id);
                        } else {
                          onUpdatePost(post.id, { id: "DELETED" });
                        }
                      }
                    }}
                    className="py-1 px-3 border border-red-200 text-[#d82c0d] hover:bg-red-50 rounded cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------- 14. 应用市场 (Apps Directory) --------------------- */}
      {moduleType === "app" && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-[#e1e3e5]">
            <h3 className="text-sm font-bold text-[#202223]">核心应用拓展</h3>
            <p className="text-[11px] text-[#6d7175]">租户可以在其控制台中按需安装的平台官方与第三方应用插件</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {apps.map((app) => (
              <div key={app.id} className="card-shopify p-4 space-y-3 bg-white flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-[#f1f1f1] text-[#6d7175] font-mono px-1.5 py-0.5 rounded font-bold">
                      {app.type}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{app.version}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{app.name}</h4>
                </div>

                <div className="pt-3 border-t border-[#f1f1f1] flex items-center justify-between text-xs font-bold">
                  <span className={`text-[10px] ${app.status === "上架" ? "text-[#008060]" : "text-gray-400"}`}>
                    ● {app.status === "上架" ? "线上运行" : "下线维护"}
                  </span>
                  
                  <button
                    onClick={() => {
                      const next = app.status === "上架" ? "下架" : "上架";
                      onUpdateApp(app.id, { status: next });
                    }}
                    className={`py-1 px-2.5 border rounded cursor-pointer transition text-[11px] ${
                      app.status === "上架" ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-[#bbe5b3] text-[#008060] hover:bg-[#e2f1e4]"
                    }`}
                  >
                    {app.status === "上架" ? "下架" : "上架"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive OAuth & App Bridge Playground */}
          <div className="card-shopify p-5 bg-white border border-slate-200 mt-6 space-y-4 relative overflow-hidden">
            {showSimToast && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#002e25] text-white text-xs font-bold px-4 py-2 rounded-full border border-[#008060] shadow-lg flex items-center gap-2 animate-fade-in">
                <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span>{simToastText}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#008060] bg-[#e2f1e4] px-1.5 py-0.5 rounded border border-[#bbe5b3]">
                App Bridge Sandbox
              </span>
              <h4 className="text-sm font-bold text-gray-900">应用生态 API 签名 & App Bridge 全双工消息沙盒</h4>
            </div>
            <p className="text-xs text-gray-500 font-sans">
              多租户 SaaS 中，第三方 App 均挂载在沙箱 Iframe 内。两者通过标准的 window.postMessage 相互进行权限查验与接口握手。
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Simulator controls */}
              <div className="lg:col-span-5 bg-slate-50 p-4 border border-slate-200 rounded text-xs space-y-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">选择调试 App 资源 (ID):</label>
                  <select
                    value={simAppId}
                    onChange={(e) => setSimAppId(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-[11px] font-bold text-gray-800 outline-none"
                  >
                    <option value="app_stripe">stripe_connect (Stripe 分账服务)</option>
                    <option value="app_klaviyo">klaviyo_marketing (Klaviyo 邮件流推送)</option>
                    <option value="app_shipstation">ship_station_logistics (海运船坞智能标单)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">App Bridge 调用指令 (Action):</label>
                  <select
                    value={appBridgeAction}
                    onChange={(e) => setAppBridgeAction(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded font-bold text-slate-800 outline-none"
                  >
                    <option value="shopify.toast.show">shopify.toast.show (气泡弹出通知)</option>
                    <option value="shopify.modal.open">shopify.modal.open (拉起全局安全警告框)</option>
                    <option value="shopify.loading.start">shopify.loading.start (拉起顶部进程载入动画)</option>
                  </select>
                </div>

                {appBridgeAction === "shopify.toast.show" && (
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">气泡通知文案:</label>
                    <input
                      type="text"
                      value={simToastText}
                      onChange={(e) => setSimToastText(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded font-bold"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleFireAppBridge}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs cursor-pointer transition shadow-xs"
                >
                  ⚡ 向父级 Admin 投递 postMessage 握手信号
                </button>
              </div>

              {/* Simulated frame logs */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900 border border-slate-800 p-4 rounded text-[10px] font-mono text-emerald-400 space-y-2">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-800 text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                  <span>APP BRIDGE FRAME MESSAGE BUS</span>
                  <span className="text-emerald-500 animate-pulse">● CONNECTED</span>
                </div>

                <div className="flex-1 max-h-[140px] overflow-y-auto space-y-1.5 leading-normal pr-1 flex flex-col-reverse">
                  {appBridgeLogs.map((log, idx) => {
                    const isSend = log.includes("SEND:");
                    return (
                      <div key={idx} className={isSend ? "text-amber-300 font-semibold" : "text-sky-300"}>
                        {log}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded text-[9px] text-gray-400 space-y-1 font-sans mt-2">
                  <p className="font-bold text-gray-350">🛡️ 作用域权限令牌授给声明 (OAuth Scopes for this App ID):</p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[8px] pt-1">
                    <span className="bg-slate-800 text-gray-300 px-1.5 py-0.5 rounded">read_orders</span>
                    <span className="bg-slate-800 text-gray-300 px-1.5 py-0.5 rounded">write_inventory</span>
                    <span className="bg-slate-800 text-gray-300 px-1.5 py-0.5 rounded">read_shipping_labels</span>
                    <span className="bg-red-950/40 text-red-400 px-1.5 py-0.5 rounded border border-red-900/30 font-bold font-sans">write_gateways [DENIED]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------- 15. 模板引擎 (Themes Directory) --------------------- */}
      {moduleType === "theme" && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-[#e1e3e5]">
            <h3 className="text-sm font-bold text-[#202223]">外观模板仓库</h3>
            <p className="text-[11px] text-[#6d7175]">租户店铺的前端模板资源，支持可视化区块及版本回滚</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {themes.map((theme) => (
              <div key={theme.id} className="card-shopify p-5 bg-white space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 font-mono">{theme.id}</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded ${
                      theme.status === "发布" ? "bg-[#e2f1e4] text-[#008060] border border-[#bbe5b3]" : "bg-neutral-100 text-gray-500"
                    }`}>
                      {theme.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#202223]">{theme.name}</h4>
                    <p className="text-xs text-[#008060] font-mono font-bold mt-1">
                      零售建议价: {theme.price}
                    </p>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-[#f1f1f1] flex justify-between gap-1 text-xs font-bold">
                  {/* Status toggle action */}
                  <button
                    onClick={() => {
                      const next = theme.status === "发布" ? "草稿" : "发布";
                      onUpdateTheme(theme.id, { status: next });
                    }}
                    className={`flex-1 py-1 text-center border rounded cursor-pointer transition ${
                      theme.status === "发布" ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-[#bbe5b3] text-[#008060] hover:bg-[#e2f1e4]"
                    }`}
                  >
                    {theme.status === "发布" ? "转为草稿" : "立即发布"}
                  </button>
                  <button
                    onClick={() => alert(`${theme.name} 页面编译器沙箱已就绪，正在渲染预览 DOM...`)}
                    className="px-2.5 py-1 text-[#2c6ecb] border border-blue-200 bg-blue-50/50 hover:bg-blue-100 rounded cursor-pointer transition"
                  >
                    渲染
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Custom Theme Live Sandbox */}
          <div className="card-shopify p-5 bg-slate-50 border border-slate-200 mt-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#008060] bg-[#e2f1e4] px-1.5 py-0.5 rounded border border-[#bbe5b3]">
                Live Re-render Sandbox
              </span>
              <h4 className="text-sm font-bold text-gray-900">4. 核心模板 CSS 变量热更新渲染沙盒</h4>
            </div>
            <p className="text-xs text-gray-500 font-sans">
              商户可以在不修改任何 Liquid/JSON 主体模板代码的情况下，任意配置其店铺外观的主色调、边框圆角、及网格排版并实时预览。
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs select-none">
              {/* Settings customizer panel */}
              <div className="lg:col-span-4 bg-white p-4.5 border border-slate-200 rounded-md shadow-xs space-y-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                  外观个性化配置 (Visual Settings):
                </span>

                {/* Primary Color Picker */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">店铺品牌主色调 (Brand Theme Accent):</label>
                  <div className="grid grid-cols-5 gap-1.5 animate-fade-in">
                    {[
                      { name: "Shopify Green", hex: "#008060" },
                      { name: "Royal Navy", hex: "#0f172a" },
                      { name: "Midnight Purple", hex: "#6366f1" },
                      { name: "Luxury Maroon", hex: "#991b1b" },
                      { name: "Sunset Gold", hex: "#ea580c" }
                    ].map((col, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => setSimThemeColor(col.hex)}
                        className="h-8 rounded cursor-pointer transition border border-black/10 flex items-center justify-center relative shadow-2xs"
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {simThemeColor === col.hex && (
                          <Check className="w-4 h-4 text-white drop-shadow-sm font-bold" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">按钮及卡片圆角 (Border Radius):</label>
                  <div className="flex gap-2">
                    {["0px", "4px", "8px", "16px", "999px"].map((rad) => (
                      <button
                        key={rad}
                        type="button"
                        onClick={() => setSimThemeRadius(rad)}
                        className={`flex-1 py-1.5 rounded border font-mono text-[10px] font-bold transition cursor-pointer ${
                          simThemeRadius === rad
                            ? "bg-slate-900 border-slate-900 text-white animate-pulse"
                            : "bg-white border-slate-200 text-gray-600 hover:bg-slate-50"
                        }`}
                      >
                        {rad === "999px" ? "Full" : rad}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid layout */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">商品网格排版 (Product Layout Grid):</label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => setSimGridCols(cols)}
                        className={`flex-1 py-1.5 rounded border font-bold transition cursor-pointer text-xs ${
                          simGridCols === cols
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-slate-200 text-gray-600 hover:bg-slate-50"
                        }`}
                      >
                        {cols} 列 {cols === 1 ? "(List)" : cols === 2 ? "(Compact)" : "(Wide)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generated Global variables */}
                <div className="space-y-1 bg-slate-950 p-3 rounded font-mono text-[10px] text-gray-400 border border-slate-800">
                  <span className="text-[8px] font-semibold text-gray-500 uppercase block">输出生成的 CSS 核心样式变量：</span>
                  <p className="text-[#008060] font-bold">:root &#123;</p>
                  <p className="pl-3">--store-brand-accent: <span className="font-bold" style={{ color: simThemeColor }}>{simThemeColor}</span>;</p>
                  <p className="pl-3">--store-card-radius: <span>{simThemeRadius}</span>;</p>
                  <p className="pl-3">--store-layout-columns: <span>{simGridCols}</span>;</p>
                  <p className="text-[#008060] font-bold">&#125;</p>
                </div>
              </div>

              {/* Simulated live preview store browser cabinet */}
              <div className="lg:col-span-8 border border-slate-200 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden h-[330px]">
                {/* Mock browser header */}
                <div className="bg-[#f1f3f5] border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="bg-white px-10 py-0.5 rounded text-[10px] text-gray-400 font-mono flex items-center gap-1.5 border border-slate-200/50 shadow-2xs">
                    <span className="text-emerald-500 font-bold">🔒 SECURE</span>
                    <span>https://luxury-kitchenware.myshopify.com ?preview=active</span>
                  </div>
                  <div className="w-4"></div>
                </div>

                {/* Simulated storefront container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs bg-slate-50">
                  {/* Simulated Header */}
                  <div className="flex justify-between items-center pb-2.5 border-b border-gray-200">
                    <span className="font-black text-sm tracking-wider uppercase" style={{ color: simThemeColor }}>LuxeKitchen.</span>
                    <div className="flex gap-3 text-gray-500 text-[10px] font-semibold">
                      <span>HOME</span>
                      <span>PRODUCTS</span>
                      <span>OFFERS</span>
                    </div>
                  </div>

                  {/* Simulated Hero */}
                  <div className="p-5 text-white rounded flex justify-between items-center text-left shadow-sm transition-all" style={{ backgroundColor: simThemeColor, borderRadius: simThemeRadius }}>
                    <div className="space-y-1 max-w-[70%]">
                      <span className="text-[9px] uppercase tracking-widest font-extrabold text-white/80 block">Autumn Exclusives</span>
                      <h5 className="text-base font-extrabold tracking-tight">Luxury Stoneware Edition</h5>
                      <p className="text-[10px] text-white/90 leading-normal font-medium">手工研磨哑光陶瓷餐具，24小时限时特惠。</p>
                    </div>
                    <button
                      type="button"
                      className="bg-white text-slate-900 font-bold px-3 py-1.5 shadow-xs whitespace-nowrap text-[10px] uppercase transition hover:scale-105 active:scale-95 cursor-pointer font-extrabold"
                      style={{ borderRadius: simThemeRadius }}
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Grid list container */}
                  <div className={`grid gap-3 transition-all ${simGridCols === 1 ? "grid-cols-1" : simGridCols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                    {[
                      { name: "Nordic Minimalist Pot", price: "$129.00", desc: "欧式典雅哑光铸铁锅器" },
                      { name: "Classic Tea Brewer", price: "$85.00", desc: "轻熟典奢耐热高硼酸茶具" },
                      { name: "Raw Wooden Spatula", price: "$19.00", desc: "生态环保榉木手工料理铲" }
                    ].slice(0, simGridCols === 1 ? 2 : 3).map((item, keyIdx) => (
                      <div key={keyIdx} className="bg-white p-3 border border-gray-200 transition-all hover:shadow-xs flex flex-col justify-between" style={{ borderRadius: simThemeRadius }}>
                        <div className="space-y-1">
                          <div className="w-full h-12 bg-gray-150 rounded flex items-center justify-center text-gray-400 font-bold text-[9px] uppercase border border-slate-200/40" style={{ borderRadius: simThemeRadius }}>
                            📷 Product Image
                          </div>
                          <h6 className="font-extrabold text-gray-800 text-[11px] truncate">{item.name}</h6>
                          <p className="text-[10px] text-gray-400 truncate leading-normal">{item.desc}</p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100">
                          <span className="font-extrabold text-gray-900">{item.price}</span>
                          <span className="text-[9px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100 px-1 py-0.5 rounded font-mono">
                            IN STOCK
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------- 17. 文件管理 (Files Cabinet) --------------------- */}
      {moduleType === "file" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#e1e3e5]">
            <div>
              <h3 className="text-sm font-bold text-[#202223]">CDN云盘仓储</h3>
              <p className="text-[11px] text-[#6d7175]">用于商户上传的商品图、店铺视频及文档资源的存储与监控</p>
            </div>
            <button
              onClick={() => {
                alert("CDN 回收站已擦除！已成功释放 35.8 MB 对象存储空间。");
                onTriggerAction("clear_recycle_bin");
              }}
              className="text-xs bg-red-50 hover:bg-red-100 text-[#d82c0d] border border-red-200 py-1.5 px-3.5 rounded font-bold transition cursor-pointer"
            >
              清空回收站
            </button>
          </div>

          <div className="card-shopify bg-white overflow-hidden">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] font-bold">
                    <th className="py-2.5 px-4">素材文件名</th>
                    <th className="py-2.5 px-4">体积</th>
                    <th className="py-2.5 px-4">格式类别</th>
                    <th className="py-2.5 px-4">最后更新</th>
                    <th className="py-2.5 px-4">CDN状态</th>
                    <th className="py-2.5 px-4 text-right">人工介入</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3e5] text-gray-700">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-slate-50/30 transition-colors h-[48px]">
                      <td className="py-2 px-4 font-bold text-gray-900">{file.name}</td>
                      <td className="py-2 px-4 font-mono">{file.size}</td>
                      <td className="py-2 px-4 font-mono text-gray-500">{file.type}</td>
                      <td className="py-2 px-4 font-mono text-[#6d7175]">{file.time}</td>
                      <td className="py-2 px-4 font-bold">
                        {file.status === "正常" ? (
                          <span className="text-[#008060] bg-[#e2f1e4] px-1.5 py-0.5 rounded border border-[#bbe5b3]">
                            加速分发中
                          </span>
                        ) : (
                          <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                            已移入回收站
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-right space-x-2">
                        {file.status === "回收" ? (
                          <button
                            onClick={() => onUpdateFile(file.id, { status: "正常" })}
                            className="text-xs font-bold text-[#008060] hover:underline cursor-pointer"
                          >
                            恢复
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateFile(file.id, { status: "回收" })}
                            className="text-xs font-bold text-[#d82c0d] hover:underline cursor-pointer"
                          >
                            回收
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------- 18. API 模块 & Webhooks (Developer) --------------------- */}
      {moduleType === "api" && (
        <div className="space-y-6">
          {/* API keys listing */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#e1e3e5]">
              <div>
                <h3 className="text-sm font-bold text-[#202223]">核心 API 密钥</h3>
                <p className="text-[11px] text-[#6d7175]">系统超级管理和各租户与第三方平台对接的安全秘钥</p>
              </div>
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="text-xs bg-[#008060] hover:bg-[#006e52] text-white py-1.5 px-3 rounded font-bold cursor-pointer transition flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>生成密钥</span>
              </button>
            </div>

            <div className="card-shopify bg-white overflow-hidden">
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] font-bold">
                      <th className="py-2.5 px-4">密钥名称</th>
                      <th className="py-2.5 px-4">密钥前缀 (密文)</th>
                      <th className="py-2.5 px-4">授予时间</th>
                      <th className="py-2.5 px-4">安全状态</th>
                      <th className="py-2.5 px-4 text-right">管理操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e1e3e5]">
                    {apiKeys.map((key) => (
                      <tr key={key.id} className="hover:bg-slate-50/20 h-[48px]">
                        <td className="py-2 px-4 font-bold text-gray-800">{key.name}</td>
                        <td className="py-2 px-4 font-mono text-gray-400">{key.prefix}********************</td>
                        <td className="py-2 px-4 font-mono text-[#6d7175]">{key.time}</td>
                        <td className="py-2 px-4 font-bold">
                          {key.status === "启用" ? (
                            <span className="text-[#008060] bg-[#e2f1e4] px-1.5 py-0.5 rounded border border-[#bbe5b3]">
                              有效
                            </span>
                          ) : (
                            <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                              禁
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => {
                              const next = key.status === "启用" ? "禁用" : "启用";
                              onUpdateApiKey(key.id, { status: next });
                            }}
                            className={`text-[11px] font-bold py-1 px-2 border rounded cursor-pointer transition ${
                              key.status === "启用" ? "border-red-200 text-[#d82c0d] hover:bg-red-50" : "border-[#bbe5b3] text-[#008060] hover:bg-[#e2f1e4]"
                            }`}
                          >
                            {key.status === "启用" ? "封禁" : "激活"}
                          </button>
                          {onDeleteApiKey && (
                            <button
                              onClick={() => {
                                if (confirm("确定要删除此 API Key 吗？")) {
                                  onDeleteApiKey(key.id);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer inline-block"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Webhooks Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#e1e3e5]">
              <div>
                <h3 className="text-sm font-bold text-[#202223]">核心 Webhooks 回调订阅</h3>
                <p className="text-[11px] text-[#6d7175]">店铺创建、支付成交、安全警告等级触发的回调推流事件</p>
              </div>
              <button
                onClick={() => setShowWebhookModal(true)}
                className="text-xs bg-[#008060] hover:bg-[#006e52] text-white py-1.5 px-3 rounded font-bold cursor-pointer transition flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加 Webhook</span>
              </button>
            </div>

            <div className="card-shopify bg-white overflow-hidden">
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] font-bold">
                      <th className="py-2.5 px-4">目标 URL</th>
                      <th className="py-2.5 px-4">触发事件 Topic</th>
                      <th className="py-2.5 px-4">状态</th>
                      <th className="py-2.5 px-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e1e3e5]">
                    {webhooks.map((wh) => (
                      <tr key={wh.id} className="hover:bg-slate-50/20 h-[48px]">
                        <td className="py-2 px-4 font-mono font-medium text-gray-600">{wh.url}</td>
                        <td className="py-2 px-4 font-mono text-[#008060] font-bold">{wh.topic}</td>
                        <td className="py-2 px-4 font-bold">
                          {wh.status === "启用" ? (
                            <span className="text-[#008060] bg-[#e2f1e4] px-1.5 py-0.5 rounded border border-[#bbe5b3]">
                              正常播报
                            </span>
                          ) : (
                            <span className="text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                              挂起
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => {
                              const next = wh.status === "启用" ? "禁用" : "启用";
                              onUpdateWebhook(wh.id, { status: next });
                            }}
                            className={`text-[11px] font-bold py-1 px-2 border rounded cursor-pointer transition ${
                              wh.status === "启用" ? "border-red-200 text-[#d82c0d] hover:bg-red-50" : "border-[#bbe5b3] text-[#008060] hover:bg-[#e2f1e4]"
                            }`}
                          >
                            {wh.status === "启用" ? "禁用" : "开启"}
                          </button>
                          {onDeleteWebhook && (
                            <button
                              onClick={() => {
                                if (confirm("确定要删除此 Webhook 回调吗？")) {
                                  onDeleteWebhook(wh.id);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer inline-block"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Webhook Simulator */}
            <div className="card-shopify p-5 bg-white border border-slate-200 mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#008060] bg-[#e2f1e4] px-1.5 py-0.5 rounded border border-[#bbe5b3]">
                  Enterprise Delivery Standard
                </span>
                <h4 className="text-sm font-bold text-gray-900">3. 高可靠异步分发与指数退避投递沙盒</h4>
              </div>
              <p className="text-xs text-gray-500 font-sans">
                模拟消息中心遭遇接收方网络抖动或50x宕机时的指数重试与 HMAC 秘钥认证。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 border border-slate-200 rounded text-xs select-none">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">选择订阅回调端点:</label>
                  <select
                    value={simWebhookId}
                    onChange={(e) => setSimWebhookId(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-[11px]"
                  >
                    <option value="">-- 选择目标端点 --</option>
                    {webhooks.map(wh => (
                      <option key={wh.id} value={wh.id}>{wh.url} ({wh.topic})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">触发事件 Topic:</label>
                  <select
                    value={simEventTopic}
                    onChange={(e) => setSimEventTopic(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded font-bold text-[#008060]"
                  >
                    <option value="orders/create">orders/create (成交出单)</option>
                    <option value="products/update">products/update (SKU更新)</option>
                    <option value="customers/delete">customers/delete (GDPR注销申请)</option>
                    <option value="shop/redact">shop/redact (租户隔离删除)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleFireWebhookSimulation}
                    className="w-full bg-[#008060] hover:bg-[#006e52] text-white font-bold py-2 px-4 rounded text-xs cursor-pointer flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>🚀 触发高可靠异步投递流</span>
                  </button>
                </div>
              </div>

              {/* Delivery logs queue list */}
              <div className="space-y-3.5">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block font-mono">投递事件流日志排队 (Logs Retry Queue):</span>
                
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden bg-white text-xs">
                  {simDeliveries.map((delivery) => (
                    <div key={delivery.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/30 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#008060]">{delivery.id}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-sky-50 text-sky-800 border border-sky-200 font-bold uppercase">{delivery.topic}</span>
                          <span className="font-mono text-gray-400 text-[10px]">{delivery.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {delivery.status === "success" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e2f1e4] text-[#008060] border border-[#bbe5b3]">
                              ● Acknowledged (SUCCESS)
                            </span>
                          )}
                          {delivery.status === "retry" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 animate-pulse font-sans">
                              ⏳ Retrying (Exponential Backoff Active...)
                            </span>
                          )}
                          {delivery.status === "failed" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-500 border border-red-200">
                              ● Max Retries Exhausted (FAILED)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded text-[10px] font-mono space-y-1.5 border border-slate-200 leading-normal text-slate-600">
                        <div className="flex justify-between break-all gap-1">
                          <span>Target Endpoint:</span>
                          <span className="font-bold text-gray-800 break-all">{delivery.url}</span>
                        </div>
                        <div className="flex justify-between break-all text-sky-700 border-t border-dashed border-slate-200 pt-1 gap-1">
                          <span>Security Headers:</span>
                          <span className="font-bold break-all">{delivery.signature}</span>
                        </div>
                      </div>

                      {/* Attempts step visual timeline */}
                      <div className="pl-4 border-l-2 border-slate-200 space-y-2 mt-2">
                        {delivery.attempts.map((attempt, attIdx) => (
                          <div key={attIdx} className="relative text-[10px]">
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border border-white bg-slate-400"></div>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-bold text-gray-500">Attempt #{attempt.attempt} ({attempt.time})</span>
                              <span className={`px-1 py-0.5 rounded font-bold ${attempt.status === 200 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : attempt.status === 100 ? "bg-slate-100 text-slate-600" : "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                                HTTP {attempt.status}
                              </span>
                              <span className="text-gray-600 font-sans">{attempt.msg}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------- 19. 权限模型 (RBAC Hierarchy) --------------------- */}
      {moduleType === "auth" && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-[#e1e3e5]">
            <h3 className="text-sm font-bold text-[#202223]">核心 RBAC 权限分配</h3>
            <p className="text-[11px] text-[#6d7175]">平台员工二级权限组规则：包括菜单权限、页面权限、按钮权限和 API 权限</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { role: "超级管理员", scope: "超级全局控制链", desc: "拥有平台及每个租户数据库和 API 的读写执行最高权限", color: "border-emerald-500", tags: ["菜单全通", "只读特权", "写指令允许", "API写允许"] },
              { role: "运营管理员", scope: "店铺及公告推送", desc: "店铺详情、合同升级、下放公告推送管理。API阻断只读权限。", color: "border-blue-400", tags: ["菜单:店铺", "菜单:公告", "数据:店铺级"] },
              { role: "客服专员组", scope: "工单答复流转", desc: "拥有对租户工单回复、关闭，移交，等级变动的操作与响应权限", color: "border-amber-400", tags: ["菜单:工单", "工单回复", "移交高级工程师"] }
            ].map((roleEl, idx) => (
              <div key={idx} className={`card-shopify p-5 bg-white border-t-4 ${roleEl.color} space-y-4 flex flex-col justify-between`}>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-gray-900">{roleEl.role}</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold font-mono uppercase tracking-wide">
                    授权域: {roleEl.scope}
                  </span>
                  <p className="text-xs text-[#6d7175] leading-relaxed italic">
                    "{roleEl.desc}"
                  </p>
                </div>

                <div className="space-y-1 pt-3.5 border-t border-[#f1f1f1]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">功能安全令牌:</span>
                  <div className="flex flex-wrap gap-1">
                    {roleEl.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[9px] bg-slate-50 border border-slate-200 text-[#202223] rounded px-1.5 py-0.5 font-bold font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------- 20. 操作审计日志 (Audit Logger Stream) --------------------- */}
      {moduleType === "log" && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-[#e1e3e5]">
            <h3 className="text-sm font-bold text-[#202223]">核心审计操作日志流</h3>
            <p className="text-[11px] text-[#6d7175]">高频日志监控记录：核心 API限流、管理员操作审计、安全事件自动捕获</p>
          </div>

          <div className="card-shopify bg-[#1a1c1d] border border-[#2d2f31] p-4 text-xs font-mono text-slate-300 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#2d2f31] text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span>终端输出流 (实时)</span>
              <span className="text-emerald-500">● 活字流在线</span>
            </div>

            <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-1 border-b border-[#24272c]/50">
                  <span className="text-gray-500 font-bold">[{log.time}]</span>
                  <span className="text-[#008060] font-bold">[{log.operator}]</span>
                  <span className="text-amber-500 font-bold">{log.action}:</span>
                  <span className="text-slate-200">{log.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------- 21. 控制台系统设置 (System settings) --------------------- */}
      {moduleType === "set" && (
        <div className="space-y-6">
          <div className="pb-2 border-b border-[#e1e3e5]">
            <h3 className="text-sm font-bold text-[#202223]">平台系统主干设定</h3>
            <p className="text-[11px] text-[#6d7175]">设置SMTP主服务器、平台域名、API访问限流规则与冷备快照快门</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Base values card Form */}
            <div className="card-shopify p-5 bg-white space-y-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest pb-1 border-b border-gray-100">
                系统变量
              </h4>

              <div className="space-y-3.5 text-xs">
                {settings.map((set) => (
                  <div key={set.key} className="flex flex-col gap-1">
                    <label className="font-bold text-gray-800 uppercase text-[10px] tracking-wider">
                      {set.key === "platform_name" && "平台默认展示字标题"}
                      {set.key === "smtp_server" && "SMTP 核心传输网关"}
                      {set.key === "cname_target" && "外接多租户 CNAME 域名网关"}
                      {set.key === "rate_limit" && "第三方 API 每分钟最大流量限制"}
                    </label>
                    <input
                      type="text"
                      value={set.value}
                      onChange={(e) => onUpdateSettings(set.key, e.target.value)}
                      className="p-2 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-[#008060] font-mono text-gray-800 font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick backup triggers and infrastructure logs */}
            <div className="card-shopify p-5 bg-white space-y-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest pb-1 border-b border-gray-100">
                备份 & 高级动作
              </h4>

              <div className="space-y-3 text-xs leading-relaxed">
                <p className="text-[#6d7175]">
                  多租户系统的系统及数据库冷备存盘支持。支持手动触控对核心表（stores、plans、subs、files）执行 SQL DDL 快照备份。
                </p>

                <div className="pt-2.5 space-y-2">
                  <button
                    onClick={() => {
                      alert("系统数据库快照构建成功！已打包并存储至腾讯云 COS [full_backup_sql].zip");
                      onTriggerAction("trigger_backup");
                    }}
                    className="w-full py-2 bg-[#008060] hover:bg-[#006e52] text-white font-bold rounded-md cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Database className="w-4 h-4" />
                    <span>打包系统快照备份</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm("警告！清退底层 Redis 与系统对象缓存可能会使商家登录状态暂时挂起，确定吗？")) {
                        alert("已经发出 Redis FlushALL 洗白指令。系统已即时恢复轻缓存装载状态。");
                      }
                    }}
                    className="w-full py-2 bg-red-50 hover:bg-red-100 text-[#d82c0d] border border-red-200 font-bold rounded-md cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>擦除 Redis 轻量缓存</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Post creation modal overlay */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl border border-[#e1e3e5] animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e1e3e5]">
              <h3 className="text-xs font-bold text-gray-900">发布平台广播通知</h3>
              <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handlePostSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">广播公告标题 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 平台 5.2 版本更新及安全补丁通告"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">通告详细内文 *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="请输入要分发给全部商户的详细内文，不超过300字..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060]"
                />
              </div>
              <div className="pt-3 border-t border-[#f1f1f1] flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded text-center text-gray-600 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#008060] hover:bg-[#006e52] rounded text-center text-white transition cursor-pointer"
                >
                  推行发布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Key Modal overlay */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl border border-[#e1e3e5] animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e1e3e5]">
              <h3 className="text-xs font-bold text-gray-900">签发新超级 API 秘钥</h3>
              <button onClick={() => setShowApiKeyModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleApiKeySubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">密钥调用者/系统名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: ERP自动调拨服务"
                  value={newApiKeyName}
                  onChange={(e) => setNewApiKeyName(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-bold"
                />
              </div>
              <p className="text-[10px] text-[#6d7175]">
                ● 系统将自动为您生成以 <code className="bg-slate-100 px-1 py-0.5 font-bold">shpat_</code> 为前缀的完全哈希安全通信令牌。
              </p>
              <div className="pt-3 border-t border-[#f1f1f1] flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded text-center text-gray-600 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#008060] hover:bg-[#006e52] rounded text-center text-white transition cursor-pointer"
                >
                  立即生成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Webhook Modal overlay */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl border border-[#e1e3e5] animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e1e3e5]">
              <h3 className="text-xs font-bold text-gray-900">订阅新 Webhook 高频分发</h3>
              <button onClick={() => setShowWebhookModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleWebhookSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">接收端 URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.merchant.com/v1/webhook"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">触发事件 (Topic) *</label>
                <select
                  value={newWebhookTopic}
                  onChange={(e) => setNewWebhookTopic(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] font-mono font-bold"
                >
                  <option value="orders/create">订单新建 (orders/create)</option>
                  <option value="orders/paid">订单实付支付 (orders/paid)</option>
                  <option value="app/uninstalled">商家卸载插件 (app/uninstalled)</option>
                  <option value="store/frozen">店铺冻结清盘 (store/frozen)</option>
                </select>
              </div>
              <div className="pt-3 border-t border-[#f1f1f1] flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setShowWebhookModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded text-center text-gray-600 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#008060] hover:bg-[#006e52] rounded text-center text-white transition cursor-pointer"
                >
                  登记接入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
