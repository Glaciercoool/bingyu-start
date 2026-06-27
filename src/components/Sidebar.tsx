import { Bot, Code2, Home, Layers3, NotebookPen, Palette, Plus, Settings } from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
  onOpenNotes: () => void;
}

const navItems = [
  { id: 'home', label: '主页', icon: Home },
  { id: 'code', label: '编程', icon: Code2 },
  { id: 'design', label: '设计', icon: Palette },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'research', label: '科研', icon: NotebookPen },
  { id: 'all', label: '综合', icon: Layers3 },
];

export default function Sidebar({ onOpenSettings, onOpenNotes }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="侧边导航">
      <div className="sidebar-avatar">冰</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className="sidebar-button" type="button" title={item.label}>
              <Icon size={22} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-bottom">
        <button className="sidebar-button compact" type="button" title="新建便签" onClick={onOpenNotes}>
          <Plus size={24} />
        </button>
        <button className="sidebar-button compact" type="button" title="设置" onClick={onOpenSettings}>
          <Settings size={22} />
        </button>
      </div>
    </aside>
  );
}
