import React, { useState } from "react";
import { 
  Search, ShieldAlert, Ban, ShieldCheck, Trash2, Eye, User, Mail, 
  Phone, Globe, CheckCircle, Plus, X
} from "lucide-react";
import { UserItem } from "../../types";

interface UserModuleProps {
  users: UserItem[];
  onAddUser: (user: UserItem) => void;
  onUpdateUser: (id: string, updated: Partial<UserItem>) => void;
  onDeleteUser: (id: string) => void;
  onViewDetails: (user: UserItem) => void;
}

export default function UserModule({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onViewDetails
}: UserModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // New user form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserAvatar, setNewUserAvatar] = useState("👩");
  const [newUserStatus, setNewUserStatus] = useState<"启用" | "封禁">("启用");

  // Filters logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "全部" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert("请填写姓名与邮箱！");
      return;
    }
    const freshUser: UserItem = {
      id: `U-${Math.floor(800 + Math.random() * 200)}`,
      avatar: newUserAvatar,
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone || "未登记",
      status: newUserStatus
    };
    onAddUser(freshUser);
    
    // Reset states
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPhone("");
    setNewUserAvatar("👩");
    setNewUserStatus("启用");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Strip */}
      <div className="card-shopify p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-grow md:flex-initial md:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索姓名、手机、邮箱或 ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#008060] text-gray-800"
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
            <option value="启用">启用</option>
            <option value="封禁">封禁</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto text-xs bg-[#008060] hover:bg-[#006e52] text-white py-2 px-4 rounded-md font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          新增平台用户
        </button>
      </div>

      {/* Users table */}
      <div className="card-shopify overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] text-xs font-bold font-sans">
                <th className="py-3 px-4">头像 & ID</th>
                <th className="py-3 px-4">姓名</th>
                <th className="py-3 px-4">邮箱</th>
                <th className="py-3 px-4">手机号</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4 text-right">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e1e3e5] text-xs font-sans text-gray-700">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/70 transition-colors h-[52px]">
                  <td className="py-2.5 px-4 font-mono font-medium text-gray-500 whitespace-nowrap">
                    <span className="inline-block mr-2 text-base bg-slate-100 p-1 px-1.5 rounded-full">{user.avatar}</span>
                    {user.id}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-[#202223]">{user.name}</td>
                  <td className="py-2.5 px-4 font-mono">{user.email}</td>
                  <td className="py-2.5 px-4 font-mono">{user.phone}</td>
                  <td className="py-2.5 px-4 font-bold">
                    {user.status === "启用" ? (
                      <span className="inline-flex items-center gap-1 text-[#008060] bg-[#e2f1e4] px-2 py-0.5 rounded-full border border-[#bbe5b3]">
                        ● 正常启用
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#d82c0d] bg-[#fff0f0] px-2 py-0.5 rounded-full border border-red-200">
                        ● 已封锁
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {/* View */}
                    <button
                      onClick={() => onViewDetails(user)}
                      title="打开审计画册"
                      className="inline-flex items-center gap-0.5 text-xs text-[#202223] font-bold py-1 px-2 border border-slate-200 rounded bg-white hover:bg-slate-50 transition cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-[#2c6ecb]" />
                      <span>查看</span>
                    </button>

                    {/* Ban and Unban */}
                    <button
                      onClick={() => {
                        const nextStatus = user.status === "启用" ? "封禁" : "启用";
                        onUpdateUser(user.id, { status: nextStatus });
                      }}
                      className={`inline-flex items-center gap-0.5 text-xs font-bold py-1 px-2 border rounded transition cursor-pointer ${
                        user.status === "启用"
                          ? "border-red-200 text-[#d82c0d] hover:bg-red-50 bg-white"
                          : "border-[#bbe5b3] text-[#008060] hover:bg-[#e2f1e4] bg-white"
                      }`}
                    >
                      {user.status === "启用" ? (
                        <>
                          <Ban className="w-3 h-3" />
                          <span>封禁</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3" />
                          <span>解封</span>
                        </>
                      )}
                    </button>

                    {/* Wipe User */}
                    <button
                      onClick={() => {
                        if (confirm(`注意：确定彻底销户并注销 "${user.name}" 的多租户所有权吗？`)) {
                          onDeleteUser(user.id);
                        }
                      }}
                      className="inline-flex items-center gap-0.5 text-xs text-[#d82c0d] bg-red-50 hover:bg-red-100 font-bold py-1 px-2 border border-red-200 rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>删除</span>
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#6d7175]">
                    未检索到符合过滤条件的平台用户。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3 border-t border-[#e1e3e5] bg-[#f9fafb] flex items-center justify-between text-xs text-[#202223] font-bold">
          <span>
            共筛选出 <strong className="font-mono">{filteredUsers.length}</strong> 位用户 | 当前第 {currentPage}/{totalPages} 页
          </span>
          <div className="flex gap-1 font-bold">
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

      {/* Add User Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl border border-[#e1e3e5] animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#f9fafb] border-b border-[#e1e3e5]">
              <h3 className="text-xs font-bold text-gray-900">创建全新多租户商户用户</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">姓名 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 柯林斯"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">邮箱地址 *</label>
                <input
                  type="email"
                  required
                  placeholder="例如: brandon@merchant.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] text-gray-800 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">手机号码</label>
                <input
                  type="text"
                  placeholder="例如: 13988887777"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full p-2 border border-slate-200 bg-white rounded outline-none focus:ring-1 focus:ring-[#008060] text-gray-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pb-1">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">状态</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none font-medium"
                  >
                    <option value="启用">启用</option>
                    <option value="封禁">隔离</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">选取头像</label>
                  <select
                    value={newUserAvatar}
                    onChange={(e) => setNewUserAvatar(e.target.value)}
                    className="w-full p-2 border border-slate-200 bg-white rounded outline-none font-medium"
                  >
                    <option value="👩">👩 职女性</option>
                    <option value="👨">👨 创业男</option>
                    <option value="👧">👧 极客女孩</option>
                    <option value="🧙">🧙 开发者</option>
                    <option value="🦊">🦊 金狐狸</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#f1f1f1] flex gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-1.5 border border-slate-200 rounded text-center text-gray-600 bg-white hover:bg-slate-50 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#008060] hover:bg-[#006e52] rounded text-center text-white transition shadow-sm cursor-pointer"
                >
                  确认开户
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
