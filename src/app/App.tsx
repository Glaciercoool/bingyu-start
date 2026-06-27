import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Settings, UserRound } from 'lucide-react';
import ClockPanel from '../components/ClockPanel';
import DockBar from '../components/DockBar';
import NotesPanel from '../components/NotesPanel';
import SearchBox from '../components/SearchBox';
import SettingsPanel from '../components/SettingsPanel';
import ShortcutGrid from '../components/ShortcutGrid';
import Sidebar from '../components/Sidebar';
import { DEFAULT_START_PAGE_DATA, SEARCH_ENGINES } from '../data/defaultData';
import { loadBookmarkFolders } from '../features/bookmarks/bookmarks';
import { createBackup, loadStartPageData, parseBackup, saveStartPageData } from '../lib/storage/startpageStorage';
import type { BookmarkFolder, DockItem, SiteItem, StartPageData } from '../types/startpage';

export default function App() {
  const [data, setData] = useState<StartPageData>(DEFAULT_START_PAGE_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);

  useEffect(() => {
    loadStartPageData()
      .then((loaded) => setData(loaded))
      .finally(() => setHydrated(true));

    loadBookmarkFolders().then(setBookmarkFolders);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      saveStartPageData(data);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [data, hydrated]);

  const hitokoto = useMemo(() => {
    const list = data.hitokotoList.length ? data.hitokotoList : DEFAULT_START_PAGE_DATA.hitokotoList;
    return list[new Date().getDate() % list.length];
  }, [data.hitokotoList]);

  const pinnedNotes = useMemo(() => {
    return data.notes.filter((note) => data.pinnedNoteIds.includes(note.id)).slice(0, 3);
  }, [data.notes, data.pinnedNoteIds]);

  function updateData(patch: Partial<StartPageData>) {
    setData((current) => ({ ...current, ...patch }));
  }

  function openUrl(url: string) {
    if (url === '#notes') {
      setNotesOpen(true);
      return;
    }

    if (url === '#theme') {
      setData((current) => ({
        ...current,
        settings: {
          ...current.settings,
          darkMode: current.settings.darkMode === 'off' ? 'on' : 'off',
        },
      }));
      return;
    }

    window.open(url, data.settings.newTab ? '_blank' : '_self', 'noopener,noreferrer');
  }

  function openSite(site: SiteItem) {
    openUrl(site.url);
  }

  function openDockItem(item: DockItem) {
    if (item.action === 'notes') {
      setNotesOpen(true);
      return;
    }

    if (item.action === 'settings') {
      setSettingsOpen(true);
      return;
    }

    if (item.action === 'theme') {
      openUrl('#theme');
      return;
    }

    if (item.url) openUrl(item.url);
  }

  function search(query: string) {
    const engine = SEARCH_ENGINES[data.currentEngine];
    const url = engine.searchUrl.replace('{query}', encodeURIComponent(query));

    if (data.settings.searchHistory) {
      setData((current) => ({
        ...current,
        searchHistoryData: [query, ...current.searchHistoryData.filter((item) => item !== query)].slice(0, 20),
      }));
    }

    window.open(url, data.settings.newTab ? '_blank' : '_self', 'noopener,noreferrer');
  }

  function exportData() {
    const backup = createBackup(data);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `bingyu-start-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function importData(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setData(parseBackup(String(reader.result)));
      } catch {
        window.alert('导入失败：无法识别这个备份文件。');
      }
    };
    reader.readAsText(file);
  }

  function resetData() {
    if (!window.confirm('确定要重置所有本地数据吗？建议先导出备份。')) return;
    setData(DEFAULT_START_PAGE_DATA);
  }

  const shellStyle = {
    '--accent-color': data.settings.themeColor,
    '--current-wallpaper': `url("${data.settings.currentWallpaper}")`,
  } as CSSProperties;

  return (
    <div
      className={`app-shell ${data.settings.darkMode === 'off' ? 'light-mode' : ''}`}
      style={shellStyle}
      data-vignette={data.settings.vignette}
    >
      <div className="background-layer" />
      <div className="vignette-layer" />

      <Sidebar onOpenSettings={() => setSettingsOpen(true)} onOpenNotes={() => setNotesOpen(true)} />

      <div className="top-actions">
        <button type="button" title="用户">
          <UserRound size={22} />
        </button>
        <button type="button" title="设置" onClick={() => setSettingsOpen(true)}>
          <Settings size={22} />
        </button>
      </div>

      {pinnedNotes.length > 0 && (
        <aside className="pinned-notes">
          {pinnedNotes.map((note) => (
            <button key={note.id} type="button" onClick={() => setNotesOpen(true)}>
              <strong>{note.title}</strong>
              <span>{note.content || '空便签'}</span>
            </button>
          ))}
        </aside>
      )}

      <main className="main-stage">
        <ClockPanel hitokoto={hitokoto} />
        <SearchBox
          currentEngine={data.currentEngine}
          history={data.searchHistoryData}
          autoClear={data.settings.autoClear}
          onEngineChange={(currentEngine) => updateData({ currentEngine })}
          onSearch={search}
          onClearHistory={() => updateData({ searchHistoryData: [] })}
        />
        <ShortcutGrid
          sites={data.sites}
          bookmarkFolders={bookmarkFolders}
          onOpenSite={openSite}
          onOpenUrl={openUrl}
        />
      </main>

      <DockBar items={data.dockItems} visible={data.settings.showDock} onOpenDockItem={openDockItem} />

      <SettingsPanel
        open={settingsOpen}
        settings={data.settings}
        onClose={() => setSettingsOpen(false)}
        onChange={(settings) => updateData({ settings })}
        onExportData={exportData}
        onImportData={importData}
        onResetData={resetData}
      />

      <NotesPanel
        open={notesOpen}
        notes={data.notes}
        pinnedNoteIds={data.pinnedNoteIds}
        onClose={() => setNotesOpen(false)}
        onChangeNotes={(notes) => updateData({ notes })}
        onChangePinned={(pinnedNoteIds) => updateData({ pinnedNoteIds })}
      />
    </div>
  );
}
