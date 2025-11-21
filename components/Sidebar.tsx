import React from 'react';
import { LayoutDashboard, FilePlus, List, MessageSquareText, Settings, FolderOpen } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'ໜ້າຫຼັກ (Dashboard)', icon: LayoutDashboard },
    { id: 'list', label: 'ລາຍການເອກະສານ (List)', icon: List },
    { id: 'add', label: 'ເພີ່ມເອກະສານ (Add)', icon: FilePlus },
    { id: 'ai', label: 'ສອບຖາມ AI (Chat)', icon: MessageSquareText },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col flex-shrink-0 transition-all">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
          S
        </div>
        <h1 className="text-xl font-bold tracking-tight">SalaDoc AI</h1>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm">Storage</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mb-1">
            <div className="w-3/4 bg-blue-500 h-1.5 rounded-full"></div>
          </div>
          <span className="text-xs text-slate-400">75% used of 1GB</span>
        </div>
        <button className="w-full mt-4 flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white text-sm">
          <Settings className="w-4 h-4" />
          <span>ຕັ້ງຄ່າ (Settings)</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;