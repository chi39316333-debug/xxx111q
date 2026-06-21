import React, { useState, useEffect } from "react";
import { 
  Database, DatabaseBackup, Plus, Trash2, Edit2, Check, X, Search, RefreshCw, AlertTriangle, FileJson
} from "lucide-react";

interface DatabaseModuleProps {
  onTriggerReset: () => Promise<void>;
  onRefreshAllData: () => Promise<void>;
}

export default function DatabaseModule({ onTriggerReset, onRefreshAllData }: DatabaseModuleProps) {
  const [tablesList, setTablesList] = useState<{ [key: string]: number }>({});
  const [selectedTable, setSelectedTable] = useState<string>("stores");
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Inline edit state
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedRowData, setEditedRowData] = useState<any>({});
  
  // Add new row state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRowData, setNewRowData] = useState<any>({});

  const tableEndpoints: { [key: string]: string } = {
    "stores": "店铺表 (stores)",
    "users": "用户表 (users)",
    "plans": "套餐策略表 (plans)",
    "subs": "订阅合同表 (subs)",
    "payouts": "财务出账表 (payouts)",
    "orders": "订单表 (orders)",
    "bills": "账单表 (bills)",
    "invoices": "发票税额表 (invoices)",
    "apps": "应用扩展表 (apps)",
    "themes": "外观模板表 (themes)",
    "files": "CDN素材表 (files)",
    "posts": "平台公告表 (posts)",
    "tickets": "商户工单表 (tickets)",
    "apiKeys": "API密钥表 (apiKeys)",
    "webhooks": "回调订阅表 (webhooks)",
    "settings": "系统变量表 (settings)",
    "logs": "审计日志表 (logs)"
  };

  // 1. Fetch tables stats
  const fetchTableStats = async () => {
    try {
      const res = await fetch("/api/db/stats");
      const d = await res.json();
      setTablesList(d);
    } catch (e) {
      console.error("Failed to load table stats", e);
    }
  };

  // 2. Fetch specific table rows
  const fetchTableRows = async (tableName: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/db/${tableName}`);
      const d = await res.json();
      setTableRows(d);
      setEditingRowId(null);
      setIsAddingNew(false);
    } catch (e) {
      console.error(`Failed to load rows for table ${tableName}`, e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableStats();
    fetchTableRows(selectedTable);
  }, [selectedTable]);

  // Handle cell edit save
  const handleSaveEdit = async (idValue: string) => {
    try {
      const idField = selectedTable === "settings" ? "key" : "id";
      const res = await fetch(`/api/db/${selectedTable}/${idValue}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedRowData)
      });
      if (res.ok) {
        setEditingRowId(null);
        await fetchTableRows(selectedTable);
        await fetchTableStats();
        await onRefreshAllData();
      } else {
        alert("保存失败，请检查数据格式");
      }
    } catch (e) {
      console.error("Error saving edits", e);
    }
  };

  // Handle cell delete
  const handleDeleteRow = async (idValue: string) => {
    if (!confirm(`确定要从数据库中永久物理删除此条记录 (${idValue}) 吗？`)) return;
    try {
      const res = await fetch(`/api/db/${selectedTable}/${idValue}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchTableRows(selectedTable);
        await fetchTableStats();
        await onRefreshAllData();
      }
    } catch (e) {
      console.error("Error deleting row", e);
    }
  };

  // Handle inserting new row
  const handleAddNewRow = async () => {
    try {
      const res = await fetch(`/api/db/${selectedTable}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRowData)
      });
      if (res.ok) {
        setIsAddingNew(false);
        setNewRowData({});
        await fetchTableRows(selectedTable);
        await fetchTableStats();
        await onRefreshAllData();
      } else {
        const err = await res.json();
        alert(`创建失败: ${err.error || "请检查数据内容"}`);
      }
    } catch (e) {
      console.error("Error adding row", e);
    }
  };

  // Auto layout dynamic columns
  const getKeys = () => {
    if (tableRows.length > 0) {
      return Object.keys(tableRows[0]);
    }
    // fallbacks based on tables schemas
    if (selectedTable === "settings") return ["key", "value"];
    return ["id", "name", "status"];
  };

  const columns = getKeys();

  // Search filter
  const filteredRows = tableRows.filter((row: any) => {
    if (!searchQuery) return true;
    return Object.values(row).some((val: any) => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleResetDb = async () => {
    if (!confirm("⚠️ 确定要重置所有数据库表吗？此操作将擦除当前修改，重新使用初始模版数据覆写根目录 /db 下的所有 JSON 数据库文件！")) return;
    setLoading(true);
    try {
      await onTriggerReset();
      await fetchTableStats();
      await fetchTableRows(selectedTable);
      alert("数据库已成功重置，模版表结构重新载入完毕！");
    } catch (e) {
      console.error("Reset DB failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-gray-700 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-[#e1e3e5] gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#202223] flex items-center gap-1.5">
            <Database className="w-4 h-4 text-[#008060]" />
            <span>本地 JSON 物理数据库审计中心 ({Object.keys(tablesList).length} 张表)</span>
          </h3>
          <p className="text-[11px] text-[#6d7175]">物理数据库存储于项目根目录 /db/ 下，每次增删改读均对文件执行同步 IO 读写，告别 Demo 状态！</p>
        </div>
        <button
          onClick={handleResetDb}
          className="text-xs bg-red-50 hover:bg-red-100 text-[#d82c0d] border border-red-200 py-1.5 px-3.5 rounded font-bold flex items-center gap-1 cursor-pointer transition"
          title="将 /db 中的所有表重置为内置的种子副本"
        >
          <DatabaseBackup className="w-3.5 h-3.5" />
          <span>一键初始化重置物理库</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Tables Sidebar Index */}
        <div className="xl:col-span-1 card-shopify bg-white p-4 space-y-3 border border-[#e1e3e5] rounded-lg">
          <div className="flex items-center justify-between text-xs font-bold text-[#202223] uppercase tracking-wider pb-2 border-b border-gray-100">
            <span>数据库表文件</span>
            <span className="text-[10px] text-gray-400">（真实行数）</span>
          </div>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {Object.keys(tableEndpoints).map((tableName) => {
              const active = selectedTable === tableName;
              const rowCount = tablesList[tableName] || 0;
              return (
                <button
                  key={tableName}
                  onClick={() => setSelectedTable(tableName)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all ${
                    active
                      ? "bg-slate-100 text-[#008060] font-bold border-l-4 border-[#008060]"
                      : "text-gray-700 hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <span className="truncate">{tableEndpoints[tableName]}</span>
                  <span className="font-mono text-[10px] bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-gray-500 font-bold">
                    {rowCount} 行
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Database Rows Table View */}
        <div className="xl:col-span-3 card-shopify bg-white p-5 border border-[#e1e3e5] rounded-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder={`在 ${tableNameToLabel(selectedTable)} 中搜索元数据...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-9 pr-3 py-1.5 w-full bg-[#f1f1f1]/80 hover:bg-[#f1f1f1] border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#008060] font-medium"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {!isAddingNew && (
                <button
                  onClick={() => {
                    setIsAddingNew(true);
                    // Generate empty row with default fields
                    const empty: any = {};
                    columns.forEach(col => {
                      if (col === "id") {
                        empty[col] = `${selectedTable.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
                      } else {
                        empty[col] = "";
                      }
                    });
                    setNewRowData(empty);
                  }}
                  className="flex-1 sm:flex-none text-xs bg-[#008060] hover:bg-[#006e52] text-white py-1.5 px-3 rounded font-bold flex items-center justify-center gap-1 transition shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加一条记录</span>
                </button>
              )}
              <button
                onClick={() => fetchTableRows(selectedTable)}
                className="p-1.5 border border-slate-200 rounded hover:bg-slate-50 transition text-gray-500"
                title="重新加载当前表"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-xs text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#008060] mb-3" />
              正在对物理 JSON 数据库进行同步读取并构建表格...
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table rendering block */}
              <div className="overflow-x-auto border border-gray-100 rounded-md">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#f9fafb] border-b border-[#e1e3e5] text-[#202223] font-bold">
                      {columns.map((col) => (
                        <th key={col} className="py-2.5 px-4 font-mono select-none">
                          {col}
                        </th>
                      ))}
                      <th className="py-2.5 px-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e1e3e5] text-gray-700">
                    {/* Add new inline editor row */}
                    {isAddingNew && (
                      <tr className="bg-emerald-50/50">
                        {columns.map((col) => (
                          <td key={col} className="py-2 px-3">
                            <input
                              type="text"
                              value={newRowData[col] || ""}
                              onChange={(e) => setNewRowData({ ...newRowData, [col]: e.target.value })}
                              placeholder={col}
                              className="w-full p-1 border border-emerald-300 rounded outline-none font-sans text-xs bg-white text-gray-800"
                              disabled={col === "id" && selectedTable !== "settings"}
                            />
                          </td>
                        ))}
                        <td className="py-2 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={handleAddNewRow}
                            className="bg-[#008060] text-white p-1 rounded hover:bg-[#006e52] cursor-pointer"
                            title="提交写入底层文件"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setIsAddingNew(false)}
                            className="bg-white border border-slate-300 text-gray-600 p-1 rounded hover:bg-slate-50 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    )}

                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + 1} className="py-12 text-center text-gray-400">
                          没有在此数据表中检索到符合筛选指令的记录。
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row: any, rIdx: number) => {
                        const idField = selectedTable === "settings" ? "key" : "id";
                        const rowId = row[idField];
                        const isEditing = editingRowId === rowId;

                        return (
                          <tr key={rowId || rIdx} className="hover:bg-slate-50/30 transition-colors h-[40px]">
                            {columns.map((col) => {
                              const cellVal = row[col];
                              return (
                                <td key={col} className="py-2 px-4">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={editedRowData[col] ?? cellVal}
                                      onChange={(e) => setEditedRowData({ ...editedRowData, [col]: e.target.value })}
                                      className="w-full p-1 border border-[#008060] rounded outline-none text-xs text-gray-800 font-sans"
                                      disabled={col === idField}
                                    />
                                  ) : (
                                    <span className={col === "id" || col === "key" ? "font-mono font-bold text-gray-500 bg-gray-100 p-0.5 px-1 rounded border border-gray-200 text-[10px]" : "font-sans"}>
                                      {typeof cellVal === "object" ? JSON.stringify(cellVal) : String(cellVal)}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                            
                            <td className="py-2 px-4 text-right space-x-2 whitespace-nowrap">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveEdit(rowId)}
                                    className="text-xs font-bold text-[#008060] bg-emerald-50 border border-[#bbe5b3] p-1 rounded hover:bg-[#e2f1e4] cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setEditingRowId(null)}
                                    className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 p-1 rounded hover:bg-gray-100 cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingRowId(rowId);
                                      setEditedRowData({ ...row });
                                    }}
                                    className="text-xs font-bold text-gray-400 hover:text-gray-700 inline-block"
                                    title="快速编辑改格"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRow(rowId)}
                                    className="text-xs font-bold text-red-400 hover:text-red-600 inline-block"
                                    title="永久物理删除行"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                <span>过滤所得: {filteredRows.length} / {tableRows.length} 行记录</span>
                <span className="flex items-center gap-1 text-[#008060]">
                  <FileJson className="w-3 h-3" />
                  <span>实时自动同步至 /db/{selectedTable}.json</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function tableNameToLabel(tableName: string): string {
  const mapping: { [key: string]: string } = {
    "stores": "店铺表",
    "users": "用户表",
    "plans": "资费套餐表",
    "subs": "订阅表",
    "payouts": "分账打款表",
    "orders": "订单流水表",
    "bills": "用户账单表",
    "invoices": "发票税息表",
    "apps": "插件目录表",
    "themes": "外观模块表",
    "files": "CDN素材库表",
    "posts": "公告大厅表",
    "tickets": "技术支持工单表",
    "apiKeys": "对外API密钥表",
    "webhooks": "回调推送表",
    "settings": "平台变量表",
    "logs": "核心日志审计流"
  };
  return mapping[tableName] || tableName;
}
