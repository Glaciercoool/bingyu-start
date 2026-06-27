import { CalendarDays, ExternalLink, Flame, Star, SunMedium } from 'lucide-react';
import IconGlyph from './IconGlyph';
import type { BookmarkFolder, SiteItem } from '../types/startpage';

interface ShortcutGridProps {
  sites: SiteItem[];
  bookmarkFolders: BookmarkFolder[];
  onOpenSite: (site: SiteItem) => void;
  onOpenUrl: (url: string) => void;
}

const widgets = [
  {
    id: 'days',
    title: '你在世界已经',
    value: '8723',
    unit: '天',
    caption: '2002-08-06',
    className: 'widget-days',
  },
  {
    id: 'weather',
    title: '海淀',
    value: '31°',
    unit: '晴',
    caption: 'AQI 良 / 最高29° 最低18°',
    className: 'widget-weather',
  },
  {
    id: 'calendar',
    title: '2026年6月',
    value: '24',
    unit: '周三',
    caption: '第175天 第26周',
    className: 'widget-calendar',
  },
];

function groupSites(sites: SiteItem[]) {
  return sites.reduce<Record<string, SiteItem[]>>((groups, site) => {
    const group = site.group || '常用';
    groups[group] ||= [];
    groups[group].push(site);
    return groups;
  }, {});
}

export default function ShortcutGrid({ sites, bookmarkFolders, onOpenSite, onOpenUrl }: ShortcutGridProps) {
  const groupedSites = groupSites(sites);

  return (
    <section className="dashboard-grid" aria-label="快捷入口">
      <div className="widget-row">
        {widgets.map((widget) => (
          <article key={widget.id} className={`metric-widget ${widget.className}`}>
            <div className="metric-title">{widget.title}</div>
            <div className="metric-value">
              {widget.value}
              <span>{widget.unit}</span>
            </div>
            <div className="metric-caption">{widget.caption}</div>
          </article>
        ))}

        <article className="mini-widget">
          <SunMedium size={36} />
          <span>壁纸</span>
        </article>

        <article className="hot-widget">
          <div className="hot-tabs">
            <span>百度</span>
            <span>微博</span>
            <span>知乎</span>
          </div>
          <ol>
            <li>公交车上座率越来越低</li>
            <li>韩国总理到访母校清华大学</li>
            <li>中国汽车保有量达到3.7亿辆</li>
            <li>火箭军一级军士长：要做好打仗的准备</li>
          </ol>
        </article>
      </div>

      <div className="shortcut-section">
        {Object.entries(groupedSites).map(([group, items]) => (
          <article className="shortcut-card" key={group}>
            <div className="shortcut-card-title">{group}</div>
            <div className="shortcut-list">
              {items.slice(0, 8).map((site) => (
                <button
                  key={site.id}
                  className="shortcut-item"
                  type="button"
                  title={site.description || site.name}
                  onClick={() => onOpenSite(site)}
                >
                  <span className="shortcut-icon" style={{ background: site.color }}>
                    <IconGlyph icon={site.icon} label={site.name} />
                  </span>
                  <span className="shortcut-name">{site.name}</span>
                </button>
              ))}
            </div>
          </article>
        ))}

        {bookmarkFolders.map((folder) => (
          <article className="shortcut-card bookmark-card" key={folder.id}>
            <div className="shortcut-card-title">
              <Star size={16} />
              {folder.title || 'Edge 收藏夹'}
            </div>
            <div className="bookmark-list">
              {folder.children.slice(0, 6).map((bookmark) => (
                <button
                  key={bookmark.id}
                  className="bookmark-row"
                  type="button"
                  title={bookmark.url}
                  onClick={() => bookmark.url && onOpenUrl(bookmark.url)}
                >
                  <ExternalLink size={14} />
                  <span>{bookmark.title}</span>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="bottom-hint">
        <CalendarDays size={16} />
        <span>请不要担心你行动的结果，只仅关注行动本身就好了。</span>
        <Flame size={16} />
      </div>
    </section>
  );
}
