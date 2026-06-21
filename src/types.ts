export interface StoreItem {
  id: string;
  logo: string;
  name: string;
  domain: string;
  plan: string;
  status: "启用" | "禁用" | "冻结";
  expireDate: string;
}

export interface UserItem {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  status: "启用" | "封禁";
}

export interface PlanItem {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  status: "上架" | "下架";
}

export interface SubItem {
  id: string;
  storeName: string;
  planName: string;
  amount: number;
  cycle: "月付" | "年付";
  status: "正常" | "已过期" | "关闭";
  startDate: string;
}

export interface MoneyItem {
  id: string;
  partnerName: string;
  amount: number;
  status: "审核中" | "已放款" | "已驳回";
  time: string;
}

export interface OrderItem {
  id: string;
  storeName: string;
  amount: number;
  time: string;
}

export interface BillItem {
  id: string;
  customerName: string;
  amount: number;
  status: "已付" | "未付";
  time: string;
}

export interface InvoiceItem {
  id: string;
  storeName: string;
  amount: number;
  tax: number;
  time: string;
}

export interface AppItem {
  id: string;
  name: string;
  version: string;
  status: "上架" | "下架";
  type: string;
}

export interface ThemeItem {
  id: string;
  name: string;
  price: string;
  status: "发布" | "草稿";
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  time: string;
  status: "正常" | "回收";
}

export interface PostItem {
  id: string;
  title: string;
  content: string;
  status: "发布" | "草稿";
  time: string;
}

export interface TicketItem {
  id: string;
  category: "系统故障" | "功能建议" | "账号申诉";
  status: "待回复" | "已回复" | "已关闭";
  email: string;
  subject: string;
  assignedTo: string;
  time: string;
}

export interface LogItem {
  id: string;
  time: string;
  operator: string;
  action: string;
  detail: string;
}

export interface ApiKeyItem {
  id: string;
  prefix: string;
  name: string;
  status: "启用" | "禁用";
  time: string;
}

export interface WebhookItem {
  id: string;
  url: string;
  topic: string;
  status: "启用" | "禁用";
}

export interface NotifyItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

export interface BackupItem {
  id: string;
  name: string;
  size: string;
  time: string;
}

export interface SettingItem {
  key: string;
  value: string;
}

export interface AdminItem {
  id: string;
  name: string;
  role: string;
  email: string;
  status: "启用" | "禁用";
}

export interface RoleItem {
  id: string;
  name: string;
  scope: string;
  desc: string;
  tags: string[];
}
