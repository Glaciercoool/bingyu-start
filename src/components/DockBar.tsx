import IconGlyph from './IconGlyph';
import type { DockItem } from '../types/startpage';

interface DockBarProps {
  items: DockItem[];
  visible: boolean;
  onOpenDockItem: (item: DockItem) => void;
}

export default function DockBar({ items, visible, onOpenDockItem }: DockBarProps) {
  if (!visible) return null;

  return (
    <nav className="dock-bar" aria-label="底部快捷栏">
      {items.map((item) => (
        <button
          key={item.id}
          className="dock-item"
          type="button"
          style={{ background: item.color }}
          title={item.name}
          onClick={() => onOpenDockItem(item)}
        >
          <IconGlyph icon={item.icon} label={item.name} />
        </button>
      ))}
    </nav>
  );
}
