import {
  StoreItem,
  UserItem,
  PlanItem,
  SubItem,
  MoneyItem,
  OrderItem,
  BillItem,
  InvoiceItem,
  AppItem,
  ThemeItem,
  FileItem,
  PostItem,
  TicketItem,
  LogItem,
  ApiKeyItem,
  WebhookItem,
  NotifyItem,
  BackupItem,
  SettingItem
} from "../types";

export const initialStores: StoreItem[] = [
  { id: "S-101", logo: "🛍️", name: "露米服饰", domain: "lumi.shop", plan: "企业版", status: "启用", expireDate: "2026-12-01" },
  { id: "S-102", logo: "🛋️", name: "凡特家居", domain: "vantage.shop", plan: "专业版", status: "启用", expireDate: "2026-11-15" },
  { id: "S-103", logo: "☕", name: "索拉北欧", domain: "snor.shop", plan: "基础版", status: "禁用", expireDate: "2026-08-30" },
  { id: "S-104", logo: "🎨", name: "墨色工作室", domain: "ink.shop", plan: "专业版", status: "冻结", expireDate: "2026-05-18" },
  { id: "S-105", logo: "🍩", name: "甜甜圈坊", domain: "donut.shop", plan: "基础版", status: "启用", expireDate: "2026-10-24" }
];

export const initialUsers: UserItem[] = [
  { id: "U-801", avatar: "👩", name: "罗斯托娃", email: "elena@lumi.cc", phone: "13812345678", status: "启用" },
  { id: "U-802", avatar: "👨", name: "马库斯", email: "marcus@vantage.com", phone: "13911112222", status: "启用" },
  { id: "U-803", avatar: "👧", name: "田中雪", email: "yuki@soranor.se", phone: "13533334444", status: "启用" },
  { id: "U-804", avatar: "👩", name: "索菲马丁", email: "sophie@inky.fr", phone: "13766667777", status: "封禁" }
];

export const initialPlans: PlanItem[] = [
  { id: "P-01", name: "基础版", priceMonthly: 29, priceYearly: 290, status: "上架" },
  { id: "P-02", name: "专业版", priceMonthly: 79, priceYearly: 790, status: "上架" },
  { id: "P-03", name: "企业版", priceMonthly: 199, priceYearly: 1990, status: "上架" },
  { id: "P-04", name: "开发者版", priceMonthly: 499, priceYearly: 4990, status: "下架" }
];

export const initialSubs: SubItem[] = [
  { id: "SUB-001", storeName: "露米服饰", planName: "企业版", amount: 199, cycle: "月付", status: "正常", startDate: "2026-01-10" },
  { id: "SUB-002", storeName: "凡特家居", planName: "专业版", amount: 79, cycle: "月付", status: "正常", startDate: "2026-02-14" },
  { id: "SUB-003", storeName: "索拉北欧", planName: "基础版", amount: 290, cycle: "年付", status: "已过期", startDate: "2025-03-01" },
  { id: "SUB-004", storeName: "墨色工作室", planName: "专业版", amount: 79, cycle: "月付", status: "关闭", startDate: "2026-04-18" }
];

export const initialPayouts: MoneyItem[] = [
  { id: "PAY-001", partnerName: "主题开发者阿里", amount: 1450, status: "审核中", time: "2026-06-20 16:10" },
  { id: "PAY-002", partnerName: "应用创作者SEO", amount: 2800, status: "审核中", time: "2026-06-20 15:40" },
  { id: "PAY-003", partnerName: "本地化集成公司", amount: 590, status: "已放款", time: "2026-06-19 11:20" }
];

export const initialOrders: OrderItem[] = [
  { id: "ORD-1", storeName: "露米服饰", amount: 560, time: "16:15" },
  { id: "ORD-2", storeName: "凡特家居", amount: 890, time: "15:30" },
  { id: "ORD-3", storeName: "甜甜圈坊", amount: 120, time: "14:20" }
];

export const initialBills: BillItem[] = [
  { id: "BIL-1", customerName: "罗斯托娃", amount: 199, status: "已付", time: "2026-06-01" },
  { id: "BIL-2", customerName: "马库斯", amount: 79, status: "已付", time: "2026-06-02" },
  { id: "BIL-3", customerName: "田中雪", amount: 29, status: "未付", time: "2026-06-15" }
];

export const initialInvoices: InvoiceItem[] = [
  { id: "INV-1", storeName: "露米服饰", amount: 199, tax: 15, time: "2026-06-01" },
  { id: "INV-2", storeName: "凡特家居", amount: 79, tax: 6, time: "2026-06-02" }
];

export const initialApps: AppItem[] = [
  { id: "APP-01", name: "SEO优化大师", version: "v2.4.1", status: "上架", type: "营销" },
  { id: "APP-02", name: "全球物流助手", version: "v1.1.2", status: "上架", type: "物流" },
  { id: "APP-03", name: "货到付款扩展", version: "v4.0.0", status: "下架", type: "交易" },
  { id: "APP-04", name: "微信支付对接", version: "v2.0.1", status: "上架", type: "交易" }
];

export const initialThemes: ThemeItem[] = [
  { id: "TH-01", name: "黎明定制版", price: "免费", status: "发布" },
  { id: "TH-02", name: "丝绒高雅款", price: "¥1800", status: "发布" },
  { id: "TH-03", name: "极简科技感", price: "¥2400", status: "草稿" }
];

export const initialFiles: FileItem[] = [
  { id: "F-1", name: "主题模板包.zip", size: "12.4 MB", type: "压缩包", time: "2026-06-18", status: "正常" },
  { id: "F-2", name: "店铺横幅图.webp", size: "1.2 MB", type: "图片", time: "2026-06-19", status: "正常" },
  { id: "F-3", name: "服务条款隐私.pdf", size: "450 KB", type: "文档", time: "2026-06-20", status: "正常" },
  { id: "F-4", name: "废弃标志备份.png", size: "85 KB", type: "图片", time: "2026-05-30", status: "回收" }
];

export const initialPosts: PostItem[] = [
  { id: "PST-1", title: "安全服务升级 notice", content: "将于2026年6月25日凌晨2点进行系统升级，更新V24.5内核层。", status: "发布", time: "2026-06-20" },
  { id: "PST-2", title: "商户扣款费率公告", content: "由于渠道合作变更，自下月起微信支付提现费率将进行微调。", status: "发布", time: "2026-06-15" },
  { id: "PST-3", title: "测试端点废弃说明", content: "旧版v2接口将于下季末关闭，请开发者及时向最新版v4迁移。", status: "草稿", time: "2026-06-10" }
];

export const initialTickets: TicketItem[] = [
  { id: "TK-401", category: "系统故障", status: "待回复", email: "elena@lumi.cc", subject: "SSL自签证书更新报错103", assignedTo: "客服专员甲", time: "2026-06-20 16:45" },
  { id: "TK-402", category: "功能建议", status: "已回复", email: "marcus@vantage.com", subject: "建议对接Stripe Link支付组件", assignedTo: "财务核算组", time: "2026-06-20 15:10" },
  { id: "TK-403", category: "账号申诉", status: "已关闭", email: "hacker@temp.com", subject: "解封申请：店铺涉嫌虚假交易", assignedTo: "系统超管", time: "2026-06-18 09:30" }
];

export const initialLogs: LogItem[] = [
  { id: "L-201", time: "16:55", operator: "系统守护", action: "底层初始化", detail: "TLS握手 1.3 校验通过" },
  { id: "L-202", time: "16:15", operator: "超级管理员", action: "禁用店铺", detail: "因支付透支封禁网店 S-103" },
  { id: "L-203", time: "15:20", operator: "系统守护", action: "检查健康度", detail: "Drizzle Schema 指密一致" }
];

export const initialApiKeys: ApiKeyItem[] = [
  { id: "K-001", prefix: "pk_live_51PLa", name: "主站生产秘钥", status: "启用", time: "2026-01-01" },
  { id: "K-002", prefix: "pk_test_30fA", name: "Sandbox沙箱密钥", status: "启用", time: "2026-01-02" },
  { id: "K-003", prefix: "pk_live_99dD", name: "应用分发Key", status: "禁用", time: "2026-03-10" }
];

export const initialWebhooks: WebhookItem[] = [
  { id: "WH-1", url: "https://api.partner.com/store-created", topic: "stores/create", status: "启用" },
  { id: "WH-2", url: "https://audit.security-intel.com/webhook", topic: "security/auth-warn", status: "启用" },
  { id: "WH-3", url: "https://dispatch.shipping-main.com/hook", topic: "orders/fulfill", status: "禁用" }
];

export const initialNotifies: NotifyItem[] = [
  { id: "N-1", title: "安全审计提醒：有外部节点登录警告", time: "17:00", read: false },
  { id: "N-2", title: "备份提示：数据库成功备份至腾讯云COS", time: "12:00", read: true }
];

export const initialBackups: BackupItem[] = [
  { id: "B-1", name: "full_snapshot_20260620.sql", size: "45.2 MB", time: "2026-06-20 00:00" },
  { id: "B-2", name: "full_snapshot_20260619.sql", size: "44.8 MB", time: "2026-06-19 00:00" },
  { id: "B-3", name: "full_snapshot_20260618.sql", size: "44.1 MB", time: "2026-06-18 00:00" }
];

export const initialSettings: SettingItem[] = [
  { key: "platform_name", value: "多租户系统" },
  { key: "smtp_server", value: "smtp.moda.net" },
  { key: "cname_target", value: "cname.moda.com" },
  { key: "rate_limit", value: "3000" }
];
