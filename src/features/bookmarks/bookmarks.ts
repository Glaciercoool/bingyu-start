import { browser } from 'wxt/browser';
import type { BookmarkFolder, BookmarkNode } from '../../types/startpage';

function normalizeNode(node: any): BookmarkNode {
  return {
    id: String(node.id),
    title: node.title || '未命名',
    url: node.url,
    children: node.children?.map(normalizeNode),
  };
}

function collectFolders(nodes: any[], folders: BookmarkFolder[] = []): BookmarkFolder[] {
  for (const node of nodes) {
    if (node.children?.length) {
      const childBookmarks = node.children.filter((child: any) => child.url).map(normalizeNode);
      if (childBookmarks.length) {
        folders.push({
          id: String(node.id),
          title: node.title || '收藏夹',
          children: childBookmarks.slice(0, 8),
        });
      }

      collectFolders(node.children, folders);
    }
  }

  return folders;
}

export async function loadBookmarkFolders(): Promise<BookmarkFolder[]> {
  try {
    if (!browser.bookmarks?.getTree) return [];
    const tree = await browser.bookmarks.getTree();
    return collectFolders(tree).slice(0, 4);
  } catch {
    return [];
  }
}
