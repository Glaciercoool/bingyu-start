import { browser } from 'wxt/browser';
import { APP_VERSION, DATA_VERSION, DEFAULT_START_PAGE_DATA } from '../../data/defaultData';
import type { StartPageBackup, StartPageData } from '../../types/startpage';

const STORAGE_KEY = 'bingyu-start:data:v1';

function mergeStartPageData(value: Partial<StartPageData> | undefined): StartPageData {
  return {
    ...DEFAULT_START_PAGE_DATA,
    ...value,
    settings: {
      ...DEFAULT_START_PAGE_DATA.settings,
      ...value?.settings,
      customWallpapers: value?.settings?.customWallpapers ?? DEFAULT_START_PAGE_DATA.settings.customWallpapers,
    },
    sites: value?.sites ?? DEFAULT_START_PAGE_DATA.sites,
    dockItems: value?.dockItems ?? DEFAULT_START_PAGE_DATA.dockItems,
    hitokotoList: value?.hitokotoList ?? DEFAULT_START_PAGE_DATA.hitokotoList,
    notes: value?.notes ?? DEFAULT_START_PAGE_DATA.notes,
    folders: value?.folders ?? DEFAULT_START_PAGE_DATA.folders,
    pinnedNoteIds: value?.pinnedNoteIds ?? DEFAULT_START_PAGE_DATA.pinnedNoteIds,
    currentEngine: value?.currentEngine ?? DEFAULT_START_PAGE_DATA.currentEngine,
    searchHistoryData: value?.searchHistoryData ?? DEFAULT_START_PAGE_DATA.searchHistoryData,
  };
}

async function canUseExtensionStorage(): Promise<boolean> {
  try {
    return Boolean(browser.storage?.local);
  } catch {
    return false;
  }
}

export async function loadStartPageData(): Promise<StartPageData> {
  if (await canUseExtensionStorage()) {
    const stored = await browser.storage.local.get(STORAGE_KEY);
    if (stored[STORAGE_KEY]) {
      return mergeStartPageData(stored[STORAGE_KEY] as Partial<StartPageData>);
    }
  }

  const local = globalThis.localStorage?.getItem(STORAGE_KEY);
  return mergeStartPageData(local ? (JSON.parse(local) as Partial<StartPageData>) : undefined);
}

export async function saveStartPageData(data: StartPageData): Promise<void> {
  if (await canUseExtensionStorage()) {
    await browser.storage.local.set({ [STORAGE_KEY]: data });
    return;
  }

  globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createBackup(data: StartPageData): StartPageBackup {
  return {
    version: DATA_VERSION,
    appVersion: APP_VERSION,
    exportDate: new Date().toISOString(),
    data,
  };
}

export function parseBackup(raw: string): StartPageData {
  const parsed = JSON.parse(raw) as StartPageBackup | Partial<StartPageData> | { data?: Partial<StartPageData> };

  if ('data' in parsed && parsed.data) {
    return mergeStartPageData(parsed.data);
  }

  return mergeStartPageData(parsed as Partial<StartPageData>);
}
