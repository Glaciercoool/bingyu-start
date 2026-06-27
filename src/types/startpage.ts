export type SearchEngineId = 'baidu' | 'bing' | 'google' | 'yandex';

export interface SearchEngineConfig {
  id: SearchEngineId;
  name: string;
  shortcut: string;
  icon: string;
  searchUrl: string;
}

export interface Settings {
  autoClear: boolean;
  searchHistory: boolean;
  showDock: boolean;
  newTab: boolean;
  themeColor: string;
  darkMode: 'on' | 'off' | 'auto';
  vignette: boolean;
  currentWallpaper: string;
  customWallpapers: string[];
}

export interface SiteItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  group: string;
  description?: string;
  isSpecial?: boolean;
  isDefault?: boolean;
}

export interface DockItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  url?: string;
  action?: 'apps' | 'notes' | 'theme' | 'settings';
  isDefault?: boolean;
}

export interface NoteFolder {
  id: string;
  name: string;
  collapsed: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  folderId: string;
  updatedAt: string;
}

export interface StartPageData {
  settings: Settings;
  sites: SiteItem[];
  dockItems: DockItem[];
  hitokotoList: string[];
  notes: NoteItem[];
  folders: NoteFolder[];
  pinnedNoteIds: string[];
  currentEngine: SearchEngineId;
  searchHistoryData: string[];
}

export interface StartPageBackup {
  version: number;
  appVersion: string;
  exportDate: string;
  data: StartPageData;
}

export interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkNode[];
}

export interface BookmarkFolder {
  id: string;
  title: string;
  children: BookmarkNode[];
}
