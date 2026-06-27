    // ==================== 应用版本 ====================
    const APP_VERSION = '1.0.2';
    const DATA_VERSION = 1; // 数据结构版本，用于未来迁移
    
    // ⭐ 默认站点版本号 - 每次修改 defaultSites 或 defaultDockItems 时递增这些版本号
    const SITES_VERSION = 1.3;      // 修改 defaultSites 时递增
    const DOCK_VERSION = 1.3;       // 修改 defaultDockItems 时递增


        // ==================== 更新日志数据 ====================
    const CHANGELOG_DATA = [
      {
        date: '2026-06-27',
        items: [
          { type: 'new', text: '桌面模式新增文件夹布局切换：支持 1x1、1x2、2x1、2x2、2x4 多种桌面占位' },
          { type: 'new', text: '文件夹内网站支持右键操作：在新标签页打开、编辑、删除、移动到桌面' },
          { type: 'new', text: '桌面文件夹大布局下可直接点击内部应用打开网站，并支持文件夹内拖拽排序' },
          { type: 'improve', text: '优化桌面文件夹为深色透明玻璃质感，修复大布局红色背景异常' },
          { type: 'improve', text: '优化桌面网格占位与空槽插入，应用可更接近平板桌面一样拖入空白位置' },
          { type: 'fix', text: '修复文件夹添加网址弹窗被遮挡、添加后不显示、位置移动不稳定等问题' },
          { type: 'fix', text: '修复桌面模式便签、固定到主屏幕便签与普通模式不同步的问题' },
          { type: 'improve', text: '默认桌面将语雀替换为 Google Scholar，并调整专注与待办的默认位置关系' },
        ]
      },
      {
        date: '2025-11-30',
        items: [
          { type: 'new', text: '全新的冰屿起始页正式发布' },
          { type: 'new', text: '支持自定义壁纸' },
          { type: 'new', text: '便签功能支持 任务列表' },
          { type: 'new', text: '底搜索后自动清空输入框' },
          { type: 'new', text: '记录搜索历史' },
          { type: 'new', text: '底部快捷栏支持拖拽排序' },
          { type: 'fix', text: '功能测试' },
        ]
      },
      {
        date: '2025-11-29',
        items: [
          { type: 'improve', text: '优化搜索框交互体验' },
          { type: 'fix', text: '修复壁纸加载失败的问题' },
          { type: 'new', text: '新增一言句子自定义功能' },
        ]
      },
      {
        date: '2025-11-26',
        items: [
        ]
      }
    ];

    // 项目上线日期（用于计算上线天数）
    const PROJECT_START_DATE = new Date('2025-11-26');

    // ==================== 关于弹窗函数 ====================
    function openAboutModal() {
      // 更新版本号
      document.getElementById('aboutVersionBadge').textContent = `v${APP_VERSION}`;
      
      // 计算上线天数
      const today = new Date();
      const daysOnline = Math.floor((today - PROJECT_START_DATE) / (1000 * 60 * 60 * 24));
      document.getElementById('aboutDaysOnline').textContent = daysOnline;
      
      // 最近更新日期
      if (CHANGELOG_DATA.length > 0) {
        document.getElementById('aboutLastUpdate').textContent = CHANGELOG_DATA[0].date;
      }
      
      // 渲染更新日志
      renderChangelog();
      
      // 重置头部状态
      document.getElementById('aboutHeader').classList.remove('collapsed');
      document.getElementById('aboutChangelog').scrollTop = 0;
      
      // 显示弹窗
      document.getElementById('aboutModalOverlay').classList.add('show');
      document.getElementById('aboutModal').classList.add('show');
    }

    function closeAboutModal() {
      document.getElementById('aboutModalOverlay').classList.remove('show');
      document.getElementById('aboutModal').classList.remove('show');
    }

    function renderChangelog() {
      const container = document.getElementById('aboutChangelog');
      const typeLabels = {
        'new': '新增',
        'fix': '修复',
        'improve': '优化',
        'remove': '移除'
      };
      
      container.innerHTML = CHANGELOG_DATA.map(section => `
        <div class="changelog-section">
          <div class="changelog-date">${section.date}</div>
          <div class="changelog-items">
            ${section.items.map(item => `
              <div class="changelog-item">
                <span class="changelog-tag ${item.type}">${typeLabels[item.type] || item.type}</span>
                <span class="changelog-text">${item.text}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    // 滚动时隐藏头部信息的动画
    function setupAboutScrollEffect() {
      const changelog = document.getElementById('aboutChangelog');
      const header = document.getElementById('aboutHeader');
      
      changelog.addEventListener('scroll', () => {
        if (changelog.scrollTop > 30) {
          header.classList.add('collapsed');
        } else {
          header.classList.remove('collapsed');
        }
      });
    }




    // ==================== 数据存储 ====================
    const defaultWallpapers = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920',
      'https://images.unsplash.com/photo-1764100039100-9c62823c0f5c?q=80&w=1716&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1764083572103-d860aa226bf3?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920',
      './assets/wallpaper/pic1.jpg',
      './assets/wallpaper/pic2.jpg',
    ];

    const defaultHitokoto = [
      '前途是光明的，道路是曲折',
      '人生天地之间，若白驹过隙，忽然而已',
      '不要谩骂以前的自己，他当初一个人站在雾里也很迷茫',
      '坚冰还盖着北海的时候，我看见了怒放的梅花',
      '遇事不怒，基本吃素，多多散步，劳逸适度',
      '何必用必然的死亡，困住豁然的一生',
      '爱是人类最小剂量的共产主义'
      
    ];

    // ⭐ 每个默认站点必须有唯一的 id 和 isDefault: true
    // ⭐ 修改这里后，记得递增上面的 SITES_VERSION
    const defaultSites = [
      { id: 'default-notes', name: '便签', url: '#notes', icon: '📝', color: '#f59e0b', isSpecial: true, isDefault: true },
      { id: 'default-theme', name: '深色主题', url: '#theme', icon: '🌙', color: '#1e1b4b', isSpecial: true, isDefault: true },
      { id: 'default-research', name: '科研', url: './research/', icon: '🔬', color: 'linear-gradient(135deg, #0ea5e9, #14b8a6)', isDefault: true },
      { id: 'default-translate', name: '翻译', url: 'https://fanyi.youdao.com/#/TextTranslate', icon: '<img src="./assets/ico/1.svg" width="24" height="24">', color: '#06b6d4', isDefault: true },
      { id: 'default-doubao', name: '豆包', url: 'https://www.doubao.com/chat/', icon: '<img src="./assets/ico/doubao2.png" width="36" height="36">',  color: 'linear-gradient(135deg, #10b981, #059669)', isDefault: true },
      // { id: 'default-image', name: '图片', url: 'https://unsplash.com', icon: '🖼️', color: '#f43f5e', isDefault: true },
      
      // { id: 'default-airportal', name: '空投快传', url: 'https://airportal.cn', icon: '☁️', color: '#3b82f6', isDefault: true },
      { id: 'default-qqmail', name: 'QQ 邮箱', url: 'https://mail.qq.com', icon: '<img src="./assets/ico/qqemail.svg" width="48" height="48">', color: 'transparent', isDefault: true },
      { id: 'default-netease', name: '网易云音乐', url: 'https://music.163.com', icon: '<img src="./assets/ico/wangyiyun.svg" width="48" height="48">', color:'transparent', isDefault: true },
      { id: 'default-bilibili', name: 'bilibili', url: 'https://www.bilibili.com', icon: '<img src="./assets/ico/bilibili.svg" width="48" height="48">', color: 'transparent', isDefault: true },
      { id: 'default-douyin', name: '抖音', url: 'https://www.douyin.com', icon: '<img src="./assets/ico/douyin.svg" width="48" height="48">', color: 'transparent', isDefault: true },  
      { id: 'default-Google scholar', name: '谷歌学术', url: 'https://scholar.google.com', icon: '<img src="./assets/ico/Google scholar.svg" width="48" height="48">', color: 'transparent', isDefault: true },   
      { id: 'default-github', name: 'Github', url: 'https://github.com', icon: '<img src="./assets/ico/github.svg" width="48" height="48">', color: 'transparent', isDefault: true }, 
    ];

    // ⭐ 每个默认Dock项必须有唯一的 id 和 isDefault: true
    // ⭐ 修改这里后，记得递增上面的 DOCK_VERSION
    const defaultDockItems = [
      { id: 'dock-apps', name: '应用', icon: 'apps', color: 'linear-gradient(135deg, #6366f1, #8b5cf6)', action: 'apps', isDefault: true },
      { id: 'dock-research', name: '科研', url: './research/', icon: '🔬', color: 'linear-gradient(135deg, #0ea5e9, #14b8a6)', isDefault: true },
      { id: 'dock-notes', name: '便签', icon: '📝', color: 'linear-gradient(135deg, #f59e0b, #d97706)', action: 'notes', isDefault: true },
      { id: 'dock-translate', name: '有道翻译', url: 'https://fanyi.youdao.com/#/TextTranslate', icon: '<img src="./assets/ico/1.svg" width="24" height="24">', color: 'linear-gradient(135deg, #06b6d4, #0891b2)', isDefault: true },
      { id: 'default-Google scholar', name: '谷歌学术', url: 'https://scholar.google.com', icon: '<img src="./assets/ico/Google scholar.svg" width="48" height="48">', color: 'transparent', isDefault: true },  
      { id: 'default-github', name: 'Github', url: 'https://github.com', icon: '<img src="./assets/ico/github.svg" width="48" height="48">', color: 'transparent', isDefault: true },  
      
      { id: 'dock-doubao', name: '豆包', url: 'https://www.doubao.com/chat/', icon: '<img src="./assets/ico/doubao2.png" width="36" height="36">', color: 'linear-gradient(135deg, #10b981, #059669)', isDefault: true },
      
      { id: 'dock-theme', name: '深色主题', icon: '🌙', color: 'linear-gradient(135deg, #1e1b4b, #312e81)', action: 'theme', isDefault: true },
    ];

    // 加载存储的数据
    function loadData(key, defaultValue) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch {
        return defaultValue;
      }
    }

    function saveData(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    }

    // ==================== 数据迁移系统 ====================
    /**
     * 智能合并用户数据和默认数据
     * - 保留用户自定义的项目（没有 isDefault 或 id 不以 'default-'/'dock-' 开头的）
     * - 更新/添加新的默认项目
     * - 移除被删除的旧默认项目
     */
    function migrateData() {
      const storedSitesVersion = loadData('sitesVersion', 0);
      const storedDockVersion = loadData('dockVersion', 0);
      
      // 迁移 Sites
      if (storedSitesVersion < SITES_VERSION) {
        console.log(`[迁移] Sites 版本从 ${storedSitesVersion} 升级到 ${SITES_VERSION}`);
        const currentSites = loadData('sites', null);
        
        if (currentSites !== null) {
          // 分离用户自定义站点和旧默认站点
          const userSites = currentSites.filter(site => !site.isDefault && !site.id?.startsWith('default-'));
          const oldDefaultIds = currentSites.filter(site => site.isDefault || site.id?.startsWith('default-')).map(s => s.id);
          
          // 合并：新默认站点 + 用户自定义站点
          const mergedSites = [...defaultSites];
          
          // 把用户站点添加到末尾
          userSites.forEach(userSite => {
            // 确保用户站点有唯一ID（如果没有则生成）
            if (!userSite.id) {
              userSite.id = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }
            mergedSites.push(userSite);
          });
          
          saveData('sites', mergedSites);
          console.log(`[迁移] Sites 合并完成: ${defaultSites.length} 默认 + ${userSites.length} 用户自定义`);
        }
        
        saveData('sitesVersion', SITES_VERSION);
      }
      
      // 迁移 Dock
      if (storedDockVersion < DOCK_VERSION) {
        console.log(`[迁移] Dock 版本从 ${storedDockVersion} 升级到 ${DOCK_VERSION}`);
        const currentDock = loadData('dockItems', null);
        
        if (currentDock !== null) {
          // 分离用户自定义项和旧默认项
          const userDockItems = currentDock.filter(item => !item.isDefault && !item.id?.startsWith('dock-'));
          
          // 合并：新默认Dock项 + 用户自定义项
          const mergedDock = [...defaultDockItems];
          
          // 把用户项添加到末尾
          userDockItems.forEach(userItem => {
            if (!userItem.id) {
              userItem.id = 'user-dock-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }
            mergedDock.push(userItem);
          });
          
          saveData('dockItems', mergedDock);
          console.log(`[迁移] Dock 合并完成: ${defaultDockItems.length} 默认 + ${userDockItems.length} 用户自定义`);
        }
        
        saveData('dockVersion', DOCK_VERSION);
      }
    }

    // 显示 Toast 提示
    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = `toast ${type} show`;
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }

    // ==================== 数据导入导出 ====================
    function exportData() {
      const exportData = {
        version: DATA_VERSION,
        appVersion: APP_VERSION,
        exportDate: new Date().toISOString(),
        data: {
          settings: loadData('settings', {}),
          sites: loadData('sites', defaultSites),
          dockItems: loadData('dockItems', defaultDockItems),
          hitokotoList: loadData('hitokotoList', defaultHitokoto),
          notes: loadData('notes', []),
          folders: loadData('folders', []),
          pinnedNoteIds: loadData('pinnedNoteIds', []),
          currentEngine: loadData('currentEngine', 'baidu'),
          searchHistoryData: loadData('searchHistoryData', []),
          desktopMode: loadData('desktopMode', false),
          desktopItems: loadData('desktopItems', getDefaultDesktopItems())
        }
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `startpage-backup-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('数据导出成功！');
    }

    function importData(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // 验证数据格式
          if (!importedData.data) {
            throw new Error('无效的备份文件格式');
          }

          // 恢复数据
          const { data } = importedData;
          if (data.settings) saveData('settings', data.settings);
          if (data.sites) saveData('sites', data.sites);
          if (data.dockItems) saveData('dockItems', data.dockItems);
          if (data.hitokotoList) saveData('hitokotoList', data.hitokotoList);
          if (data.notes) saveData('notes', data.notes);
          if (data.folders) saveData('folders', data.folders);
          if (data.pinnedNoteIds) saveData('pinnedNoteIds', data.pinnedNoteIds);
          if (data.currentEngine) saveData('currentEngine', data.currentEngine);
          if (data.searchHistoryData) saveData('searchHistoryData', data.searchHistoryData);
          if (typeof data.desktopMode === 'boolean') saveData('desktopMode', data.desktopMode);
          if (data.desktopItems) saveData('desktopItems', data.desktopItems);

          showToast('数据导入成功！页面将刷新...');
          setTimeout(() => {
            location.reload();
          }, 1500);
        } catch (error) {
          showToast('导入失败: ' + error.message, 'error');
        }
      };
      reader.readAsText(file);
    }

    function resetAllData() {
      if (confirm('确定要重置所有数据吗？此操作不可恢复！\n\n建议先导出备份。')) {
        if (confirm('再次确认：真的要删除所有数据吗？')) {
          localStorage.clear();
          showToast('数据已重置！页面将刷新...');
          setTimeout(() => {
            location.reload();
          }, 1500);
        }
      }
    }

    // 状态
    let settings = loadData('settings', {
      autoClear: true,
      searchHistory: true,
      tabBehavior: 'engine',
      showDock: true,
      newTab: true,
      themeColor: '#00d4ff',
      darkMode: 'on',
      vignette: true,
      currentWallpaper: defaultWallpapers[0]
    });

    let sites = loadData('sites', defaultSites);
    let dockItems = loadData('dockItems', defaultDockItems);
    let hitokotoList = loadData('hitokotoList', defaultHitokoto);
    let searchHistoryData = loadData('searchHistoryData', []);
    let notes = loadData('notes', []);
    let folders = loadData('folders', [{ id: 'default', name: '默认', collapsed: false }]);
    let pinnedNoteIds = loadData('pinnedNoteIds', []);
    let currentEngine = loadData('currentEngine', 'baidu');
    let currentNoteId = null;
    let isNotesFullscreen = false;
    let contextMenuTarget = null;
    let workspaceContextMenuTarget = null;  // workspace应用右键菜单目标
    let editingSiteIndex = -1;  // 正在编辑的站点索引
    let draggedItem = null;
    let desktopMode = loadData('desktopMode', false);
    let desktopItems = loadData('desktopItems', getDefaultDesktopItems());
    let desktopContextTargetId = null;
    let desktopAddType = 'folder';
    let desktopAddParentId = null;

    // ==================== 初始化 ====================
    function init() {
      // ⭐ 首先执行数据迁移，确保用户数据与新版本兼容
      migrateData();
      
      // 重新加载可能被迁移更新的数据
      sites = loadData('sites', defaultSites);
      dockItems = loadData('dockItems', defaultDockItems);
      
      applySettings();
      updateClock();
      setInterval(updateClock, 1000);
      renderWallpaperGrid();
      renderWorkspaceGrid();
      renderDockBar();
      initDockDrag();
      renderHitokoto();
      renderNotes();
      renderPinnedNotes();
      renderDesktopGrid();
      applyDesktopMode();
      bindEvents();
      updateEngineUI();
      
    }

    // ==================== 时钟 ====================
    function updateClock() {
      const now = new Date();
      const time = now.toTimeString().slice(0, 8);
      document.getElementById('clock').textContent = time;
      const workspaceClock = document.getElementById('workspaceClock');
      if (workspaceClock) workspaceClock.textContent = time;
    }





    // 应用深色/浅色模式
    function applyDarkMode() {
      if (settings.darkMode === 'off') {
        document.body.classList.add('light-mode');
      } else if (settings.darkMode === 'on') {
        document.body.classList.remove('light-mode');
      } else if (settings.darkMode === 'auto') {
        // 跟随系统
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.body.classList.remove('light-mode');
        } else {
          document.body.classList.add('light-mode');
        }
      }
    }








    // ==================== 设置应用 ====================
    function applySettings() {
      document.documentElement.style.setProperty('--theme-color', settings.themeColor);
      applyDarkMode();  // 🔧 添加神色模式
      const bgLayer = document.getElementById('backgroundLayer');
      if (settings.currentWallpaper) {
        bgLayer.style.backgroundImage = `url(${settings.currentWallpaper})`;
      }
      
      document.getElementById('vignetteLayer').style.display = settings.vignette ? 'block' : 'none';
      document.getElementById('dockBar').style.display = settings.showDock ? 'flex' : 'none';
      
      updateSettingsUI();
    }

    function updateSettingsUI() {
      document.getElementById('autoClearToggle').classList.toggle('active', settings.autoClear);
      document.getElementById('searchHistoryToggle').classList.toggle('active', settings.searchHistory);
      document.getElementById('dockToggle').classList.toggle('active', settings.showDock);
      document.getElementById('newTabToggle').classList.toggle('active', settings.newTab);
      document.getElementById('vignetteToggle').classList.toggle('active', settings.vignette);
      
      document.getElementById('tabBehaviorSelect').value = settings.tabBehavior;
      document.getElementById('darkModeSelect').value = settings.darkMode;
      
      document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.color === settings.themeColor);
      });
    }

    // ==================== 搜索功能 ====================
    const searchEngines = {
      baidu: { icon: '<img src="./assets/搜索/baidu.svg" width="20" height="20">', url: 'https://www.baidu.com/s?wd=' },
      bing: { icon: '<img src="./assets/搜索/bing.svg" width="20" height="20">', url: 'https://www.bing.com/search?q=' },
      google: { icon: '<img src="./assets/搜索/google.svg" width="20" height="20">', url: 'https://www.google.com/search?q=' },
      yandex: { icon: '<img src="./assets/搜索/yandex.svg" width="20" height="20">', url: 'https://yandex.com/search/?text=' }
    };

    function updateEngineUI() {
      const engine = searchEngines[currentEngine];
      document.getElementById('currentEngineIcon').innerHTML = engine.icon;  // ← 这里改成 innerHTML
      document.querySelectorAll('.engine-option[data-engine]').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.engine === currentEngine);
      });
    }

    function setEngine(engineName) {
      currentEngine = engineName;
      saveData('currentEngine', currentEngine);
      updateEngineUI();
      document.getElementById('engineDropdown').classList.remove('show');
    }

    function doSearch() {
      const query = document.getElementById('searchInput').value.trim();
      if (!query) return;
      
      if (settings.searchHistory) {
        searchHistoryData = [query, ...searchHistoryData.filter(h => h !== query)].slice(0, 20);
        saveData('searchHistoryData', searchHistoryData);
      }
      
      const url = searchEngines[currentEngine].url + encodeURIComponent(query);
      if (settings.newTab) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
      
      if (settings.autoClear) {
        document.getElementById('searchInput').value = '';
      }
    }

    // function showSearchHistory() {
    //   if (!settings.searchHistory || searchHistoryData.length === 0) return;
      
    //   const container = document.getElementById('searchHistory');
    //   container.innerHTML = searchHistoryData.map(item => `
    //     <div class="search-history-item" data-query="${item}">
    //       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    //         <circle cx="12" cy="12" r="10"/>
    //         <polyline points="12 6 12 12 16 14"/>
    //       </svg>
    //       <span>${item}</span>
    //     </div>
    //   `).join('');
    //   container.classList.add('show');
    // }

    function showSearchHistory() {
      if (!settings.searchHistory) return;
      
      const container = document.getElementById('searchHistory');
      
      if (searchHistoryData.length === 0) {
        container.innerHTML = '<div class="search-history-empty">暂无搜索历史</div>';
        container.classList.add('show');
        return;
      }
      
      container.innerHTML = searchHistoryData.map(item => `
        <div class="search-history-item" data-query="${item}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>${item}</span>
        </div>
      `).join('') + `
        <div class="search-history-divider"></div>
        <div class="search-history-clear" id="clearHistoryBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          <span>清除历史记录</span>
        </div>
      `;
      container.classList.add('show');
    }



    // ==================== 一言 ====================
    function renderHitokoto() {
      const text = hitokotoList[Math.floor(Math.random() * hitokotoList.length)];
      document.getElementById('hitokoto').textContent = text;
    }

    function renderHitokotoList() {
      const container = document.getElementById('hitokotoList');
      container.innerHTML = hitokotoList.map((text, index) => `
        <div class="hitokoto-item">
          <span class="hitokoto-item-text">${text}</span>
          <button class="hitokoto-item-delete" data-index="${index}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      `).join('');
    }

    // ==================== 壁纸 ====================
    function renderWallpaperGrid() {
      const grid = document.getElementById('wallpaperGrid');
      grid.innerHTML = defaultWallpapers.map((url, index) => `
        <div class="wallpaper-item ${settings.currentWallpaper === url ? 'active' : ''}" data-url="${url}">
          <img src="${url.includes('unsplash') ? url + '&w=300' : url}" alt="壁纸 ${index + 1}">
          <div class="check-icon">✓</div>
        </div>
      `).join('');
    }

    function setWallpaper(url) {
      settings.currentWallpaper = url;
      saveData('settings', settings);
      document.getElementById('backgroundLayer').style.backgroundImage = `url(${url})`;
      renderWallpaperGrid();
    }

    // ==================== Dock 栏 ====================
    function renderDockBar() {
      const dock = document.getElementById('dockBar');
      dock.innerHTML = dockItems.map((item, index) => {
        if (item.action === 'apps') {
          return `
            <div class="dock-item" data-title="${item.name}" data-action="apps" data-index="${index}" style="background: ${item.color};">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
          `;
        } else if (item.action === 'notes') {
          return `<div class="dock-item" data-title="${item.name}" data-action="notes" data-index="${index}" style="background: ${item.color};">${item.icon}</div>`;
        } else if (item.action === 'theme') {
          return `<div class="dock-item" data-title="${item.name}" data-action="theme" data-index="${index}" style="background: ${item.color};">${item.icon}</div>`;
        } else {
          return `<a class="dock-item" href="${item.url}" target="_blank" data-title="${item.name}" data-index="${index}" style="background: ${item.color};">${item.icon}</a>`;
        }
      }).join('');
    }




  
// ==================== Dock 拖拽排序功能 ====================
    let dragState = {
      isDragging: false,
      draggedIndex: -1,
      shakeTimer: null,
      hasShaken: false
    };

    function initDockDrag() {
      const dock = document.getElementById('dockBar');
      
      dock.addEventListener('mousedown', handleDragStart);
      dock.addEventListener('touchstart', handleDragStart, { passive: false });
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);
    }

    function handleDragStart(e) {
      const item = e.target.closest('.dock-item');
      if (!item) return;
      
      e.preventDefault();
      
      dragState.isDragging = true;
      dragState.draggedIndex = parseInt(item.dataset.index);
      dragState.hasShaken = false;
      
      item.classList.add('dragging');
    }

    function handleDragMove(e) {
      if (!dragState.isDragging) return;
      
      e.preventDefault();
      const touch = e.touches ? e.touches[0] : e;
      const dock = document.getElementById('dockBar');
      const items = [...dock.querySelectorAll('.dock-item')];
      
      items.forEach(item => {
        const index = parseInt(item.dataset.index);
        if (index === dragState.draggedIndex) return;
        
        const rect = item.getBoundingClientRect();
        const isOver = touch.clientX > rect.left && touch.clientX < rect.right;
        
        if (isOver) {
          item.classList.add('drag-over');
          
          // 只抖动1秒，之后不再抖动
          if (!dragState.hasShaken && !item.classList.contains('shake')) {
            item.classList.add('shake');
            
            dragState.shakeTimer = setTimeout(() => {
              item.classList.remove('shake');
              dragState.hasShaken = true;
            }, 300);
          }
        } else {
          item.classList.remove('drag-over', 'shake');
        }
      });
    }

    function handleDragEnd(e) {
      if (!dragState.isDragging) return;
      
      const touch = e.changedTouches ? e.changedTouches[0] : e;
      const dock = document.getElementById('dockBar');
      const items = [...dock.querySelectorAll('.dock-item')];
      
      // 清除所有样式
      items.forEach(item => {
        item.classList.remove('dragging', 'drag-over', 'shake');
      });
      
      // 查找目标位置并交换
      let targetIndex = -1;
      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (touch.clientX > rect.left && touch.clientX < rect.right) {
          targetIndex = parseInt(item.dataset.index);
        }
      });
      
      if (targetIndex !== -1 && targetIndex !== dragState.draggedIndex) {
        const temp = dockItems[dragState.draggedIndex];
        dockItems[dragState.draggedIndex] = dockItems[targetIndex];
        dockItems[targetIndex] = temp;
        saveData('dockItems', dockItems);
        renderDockBar();
      }
      
      // 清除定时器
      if (dragState.shakeTimer) {
        clearTimeout(dragState.shakeTimer);
      }
      
      dragState.isDragging = false;
      dragState.draggedIndex = -1;
      dragState.shakeTimer = null;
      dragState.hasShaken = false;
    }









    // ==================== 工作区 ====================
    function renderWorkspaceGrid() {
      const grid = document.getElementById('workspaceGrid');
      grid.innerHTML = sites.map((site, index) => {
        const deleteBtn = !site.isSpecial ? `<button class="workspace-item-delete" data-index="${index}">×</button>` : '';
        
        if (site.url === '#notes') {
          return `
            <div class="workspace-item" data-action="notes" data-index="${index}" draggable="true">
              ${deleteBtn}
              <div class="workspace-item-icon" style="background: ${site.color}">${site.icon}</div>
              <span class="workspace-item-name">${site.name}</span>
            </div>
          `;
        }
        if (site.url === '#theme') {
          return `
            <div class="workspace-item" data-action="theme" data-index="${index}" draggable="true">
              ${deleteBtn}
              <div class="workspace-item-icon" style="background: ${site.color}">${site.icon}</div>
              <span class="workspace-item-name">${site.name}</span>
            </div>
          `;
        }
        return `
          <a class="workspace-item" href="${site.url}" target="${settings.newTab ? '_blank' : '_self'}" data-index="${index}" draggable="true">
            ${deleteBtn}
            <div class="workspace-item-icon" style="background: ${site.color}">${site.icon}</div>
            <span class="workspace-item-name">${site.name}</span>
          </a>
        `;
      }).join('') + `
        <div class="workspace-item workspace-add-item" id="addSiteBtn">
          <span class="workspace-add-icon">+</span>
        </div>
      `;

      bindWorkspaceDragEvents();
    }

    function bindWorkspaceDragEvents() {
      const items = document.querySelectorAll('.workspace-item[draggable="true"]');
      
      items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
          draggedItem = item;
          item.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
          document.querySelectorAll('.workspace-item').forEach(i => i.classList.remove('drag-over'));
          draggedItem = null;
        });

        item.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (draggedItem && draggedItem !== item && !item.classList.contains('workspace-add-item')) {
            item.classList.add('drag-over');
          }
        });

        item.addEventListener('dragleave', () => {
          item.classList.remove('drag-over');
        });

        item.addEventListener('drop', (e) => {
          e.preventDefault();
          item.classList.remove('drag-over');
          
          if (draggedItem && draggedItem !== item) {
            const fromIndex = parseInt(draggedItem.dataset.index);
            const toIndex = parseInt(item.dataset.index);
            
            if (!isNaN(fromIndex) && !isNaN(toIndex)) {
              const movedItem = sites.splice(fromIndex, 1)[0];
              sites.splice(toIndex, 0, movedItem);
              saveData('sites', sites);
              renderWorkspaceGrid();
            }
          }
        });
      });
    }

    // ==================== 便签 ====================
    function renderNotes() {
      const list = document.getElementById('notesList');
      
      let html = '';
      
      folders.forEach(folder => {
        const folderNotes = notes.filter(n => (n.folderId || 'default') === folder.id);
        
        html += `
          <div class="notes-folder" data-folder-id="${folder.id}">
            <div class="notes-folder-header ${folder.collapsed ? 'collapsed' : ''}" data-folder-id="${folder.id}">
              <span class="folder-arrow">▼</span>
              <span>📁 ${folder.name}</span>
              <div style="margin-left:auto;display:flex;gap:4px;">
                <button class="add-note-to-folder-btn" data-folder-id="${folder.id}" title="在此文件夹新建便签" style="background:none;border:none;color:var(--theme-color);cursor:pointer;font-size:16px;padding:0 4px;">+</button>
                ${folder.id !== 'default' ? `<button class="delete-folder-btn" data-folder-id="${folder.id}" style="background:none;border:none;color:var(--text-muted);cursor:pointer;">×</button>` : ''}
              </div>
            </div>
            <div class="notes-folder-content ${folder.collapsed ? 'collapsed' : ''}">
              ${folderNotes.map(note => `
                <div class="notes-list-item ${currentNoteId === note.id ? 'active' : ''}" data-id="${note.id}" draggable="true">
                  <div class="notes-list-item-title">${note.title || '无标题'}</div>
                  <div class="notes-list-item-date">${note.date}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      });
      
      list.innerHTML = html;
      bindNotesDragEvents();
      bindFolderDragEvents(); // ⭐ 添加这一行 目录可以拖拽排序
    }

    function bindNotesDragEvents() {
      const noteItems = document.querySelectorAll('.notes-list-item');
      const folderHeaders = document.querySelectorAll('.notes-folder-header');
      
      noteItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
          draggedItem = item;
          item.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
          item.classList.remove('dragging');
          document.querySelectorAll('.notes-list-item, .notes-folder-header').forEach(i => i.classList.remove('drag-over'));
          draggedItem = null;
        });
      });

      folderHeaders.forEach(header => {
        header.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (draggedItem) {
            header.classList.add('drag-over');
          }
        });

        header.addEventListener('dragleave', () => {
          header.classList.remove('drag-over');
        });

        header.addEventListener('drop', (e) => {
          e.preventDefault();
          header.classList.remove('drag-over');
          
          if (draggedItem) {
            const noteId = draggedItem.dataset.id;
            const folderId = header.dataset.folderId;
            
            const note = notes.find(n => n.id === noteId);
            if (note) {
              note.folderId = folderId;
              saveData('notes', notes);
              renderNotes();
            }
          }
        });
      });
    }

    // function renderPinnedNotes() {
    //   const container = document.getElementById('pinnedNotes');
    //   const pinnedNotes = notes.filter(n => pinnedNoteIds.includes(n.id));
      
    //   container.innerHTML = pinnedNotes.map(note => {
    //     const lines = note.content.split('\n');
    //     const title = lines[0] || '无标题';
    //     const content = lines.slice(1).join('\n');
        
    //     return `
    //       <div class="pinned-note" data-id="${note.id}">
    //         <div class="pinned-note-title">${title}</div>
    //         ${content ? `<div class="pinned-note-content">${content}</div>` : ''}
    //         <div class="pinned-note-date">${note.date}</div>
    //       </div>
    //     `;
    //   }).join('');
    // }


    // ==================== 目录拖拽排序功能 ====================
    function bindFolderDragEvents() {
      const folderElements = document.querySelectorAll('.notes-folder');
      let draggedFolder = null;
      
      folderElements.forEach((folderEl, index) => {
        const folderId = folderEl.dataset.folderId;
        
        // 默认目录不可拖拽
        if (folderId === 'default') {
          return;
        }
        
        const header = folderEl.querySelector('.notes-folder-header');
        header.style.cursor = 'move';
        header.setAttribute('draggable', 'true');
        
        header.addEventListener('dragstart', (e) => {
          if (e.target.closest('.delete-folder-btn') || e.target.closest('.add-note-to-folder-btn')) {
            e.preventDefault();
            return;
          }
          draggedFolder = folderEl;
          folderEl.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });
        
        header.addEventListener('dragend', () => {
          folderEl.classList.remove('dragging');
          document.querySelectorAll('.notes-folder').forEach(f => f.classList.remove('drag-over'));
          draggedFolder = null;
        });
        
        folderEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          if (draggedFolder && draggedFolder !== folderEl) {
            // 不允许拖到默认目录之前
            if (folderEl.dataset.folderId === 'default') {
              return;
            }
            folderEl.classList.add('drag-over');
          }
        });
        
        folderEl.addEventListener('dragleave', () => {
          folderEl.classList.remove('drag-over');
        });
        
        folderEl.addEventListener('drop', (e) => {
          e.preventDefault();
          folderEl.classList.remove('drag-over');
          
          if (draggedFolder && draggedFolder !== folderEl) {
            const draggedId = draggedFolder.dataset.folderId;
            const targetId = folderEl.dataset.folderId;
            
            // 不允许拖到默认目录位置
            if (targetId === 'default') {
              return;
            }
            
            const draggedIndex = folders.findIndex(f => f.id === draggedId);
            const targetIndex = folders.findIndex(f => f.id === targetId);
            
            if (draggedIndex !== -1 && targetIndex !== -1) {
              // 交换位置
              const temp = folders[draggedIndex];
              folders.splice(draggedIndex, 1);
              folders.splice(targetIndex, 0, temp);
              
              saveData('folders', folders);
              renderNotes();
            }
          }
        });
      });
}



    function renderPinnedNotes() {
      const container = document.getElementById('pinnedNotes');
      const pinnedNotes = notes.filter(n => pinnedNoteIds.includes(n.id));
      
      container.innerHTML = pinnedNotes.map(note => {
        const title = noteTitle(note);
        const content = notePreview(note);
        
        // 渲染任务列表
        let tasksHtml = '';
        if (note.tasks && note.tasks.length > 0) {
          tasksHtml = `
            <div class="pinned-note-tasks">
              ${note.tasks.map(task => `
                <div class="pinned-task-item ${task.completed ? 'completed' : ''}">
                  <div class="pinned-task-checkbox">
                    ${task.completed ? '✓' : ''}
                  </div>
                  <span>${escapeHtml(task.text)}</span>
                </div>
              `).join('')}
            </div>
          `;
        }
        
        return `
          <div class="pinned-note" data-id="${escapeHtml(note.id)}">
            <div class="pinned-note-title">${escapeHtml(title)}</div>
            ${content ? `<div class="pinned-note-content">${escapeHtml(content)}</div>` : ''}
            ${tasksHtml}
            <div class="pinned-note-date">${escapeHtml(noteDateLabel(note))}</div>
          </div>
        `;
      }).join('');
    }









    // function selectNote(id) {
    //   currentNoteId = id;
    //   const note = notes.find(n => n.id === id);
    //   const editor = document.getElementById('notesEditor');
      
    //   if (note) {
    //     editor.innerHTML = `<textarea placeholder="在此键入...">${note.content}</textarea>`;
    //     const textarea = editor.querySelector('textarea');
    //     textarea.addEventListener('input', (e) => {
    //       note.content = e.target.value;
    //       const firstLine = e.target.value.split('\n')[0];
    //       note.title = firstLine.slice(0, 30) || '无标题';
    //       saveData('notes', notes);
    //       renderNotes();
    //       renderPinnedNotes();
    //     });
    //     textarea.focus();
    //   } else {
    //     editor.innerHTML = '<div class="notes-editor-placeholder">在此键入以创建新的便签</div>';
    //   }
      
    //   renderNotes();
      
    //   const pinBtn = document.getElementById('pinNoteBtn');
    //   if (pinBtn && currentNoteId) {
    //     pinBtn.classList.toggle('active', pinnedNoteIds.includes(currentNoteId));
    //   }
    // }

    function selectNote(id) {
      currentNoteId = id;
      const note = notes.find(n => n.id === id);
      const editor = document.getElementById('notesEditor');
      
      if (note) {
        // 初始化任务列表（如果不存在）
        if (!note.tasks) {
          note.tasks = [];
        }
        
        // editor.innerHTML = `
        //   <textarea placeholder="在此键入...">${note.content}</textarea>
        //   <div class="task-list">
        //     <div class="task-list-header">
        //       <span class="task-list-title">任务列表</span>
        //       <button class="add-task-btn" id="addTaskBtn">+ 添加任务</button>
        //     </div>
        //     <div class="task-items" id="taskItems"></div>
        //   </div>
        // `;

        editor.innerHTML = `
          <textarea placeholder="在此键入..." id="noteTextarea">${note.content}</textarea>
          <div class="editor-resize-handle" id="editorResizeHandle" title="拖拽调整大小"></div>
          <div class="task-list">
            <div class="task-list-header">
              <span class="task-list-title">任务列表</span>
              <button class="add-task-btn" id="addTaskBtn">+ 添加任务</button>
            </div>
            <div class="task-items" id="taskItems"></div>
          </div>
        `;
        
        const textarea = editor.querySelector('textarea');
        textarea.addEventListener('input', (e) => {
          note.content = e.target.value;
          const firstLine = e.target.value.split('\n')[0];
          note.title = firstLine.slice(0, 30) || '无标题';
          saveData('notes', notes);
          renderNotes();
          renderPinnedNotes();
          refreshDesktopNoteWidgets();
        });
        textarea.focus();
        
        // 渲染任务列表
        renderTaskList(note);
        
        // 添加任务按钮事件
        document.getElementById('addTaskBtn').addEventListener('click', () => {
          addTask(note);
        });
        // 初始化分隔条拖拽功能
        initEditorResize();
        
      } else {
        editor.innerHTML = '<div class="notes-editor-placeholder">在此键入以创建新的便签</div>';
      }
      
      renderNotes();
      
      const pinBtn = document.getElementById('pinNoteBtn');
      if (pinBtn && currentNoteId) {
        pinBtn.classList.toggle('active', pinnedNoteIds.includes(currentNoteId));
      }
    }








    function addNote(folderId = 'default') {
      const now = new Date();
      const note = {
        id: Date.now().toString(),
        title: '新便签',
        content: '',
        folderId: folderId,
        date: `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      };
      notes.unshift(note);
      saveData('notes', notes);
      selectNote(note.id);
      refreshDesktopNoteWidgets();
    }


    function deleteNote() {
      if (!currentNoteId) return;
      
      // 添加确认弹窗
      if (!confirm('确定要删除这个便签吗？此操作无法撤销。')) {
        return;
      }
      
      notes = notes.filter(n => n.id !== currentNoteId);
      pinnedNoteIds = pinnedNoteIds.filter(id => id !== currentNoteId);
      saveData('notes', notes);
      saveData('pinnedNoteIds', pinnedNoteIds);
      currentNoteId = null;
      selectNote(null);
      renderPinnedNotes();
      refreshDesktopNoteWidgets();
    }



    function pinNote() {
      if (!currentNoteId) return;
      if (pinnedNoteIds.includes(currentNoteId)) {
        pinnedNoteIds = pinnedNoteIds.filter(id => id !== currentNoteId);
      } else {
        pinnedNoteIds.push(currentNoteId);
      }
      saveData('pinnedNoteIds', pinnedNoteIds);
      renderPinnedNotes();
      refreshDesktopNoteWidgets();
      
      const pinBtn = document.getElementById('pinNoteBtn');
      if (pinBtn) {
        pinBtn.classList.toggle('active', pinnedNoteIds.includes(currentNoteId));
      }
    }

    function toggleNotesFullscreen() {
      const modal = document.getElementById('notesModal');
      isNotesFullscreen = !isNotesFullscreen;
      modal.classList.toggle('fullscreen', isNotesFullscreen);
      
      const btn = document.getElementById('expandNoteBtn');
      if (isNotesFullscreen) {
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 14h6m0 0v6m0-6L3 21M20 10h-6m0 0V4m0 6l7-7"/>
          </svg>
        `;
      } else {
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        `;
      }
    }

    function addFolder() {
      const name = document.getElementById('folderNameInput').value.trim();
      if (name) {
        folders.push({
          id: Date.now().toString(),
          name: name,
          collapsed: false
        });
        saveData('folders', folders);
        renderNotes();
        document.getElementById('addFolderModal').classList.remove('show');
        document.getElementById('folderNameInput').value = '';
      }
    }



    // ==================== 编辑器分隔条拖拽功能 ====================
    function initEditorResize() {
      const handle = document.getElementById('editorResizeHandle');
      const textarea = document.getElementById('noteTextarea');
      const editor = document.getElementById('notesEditor');
      
      if (!handle || !textarea || !editor) return;
      
      let isResizing = false;
      let startY = 0;
      let startHeight = 0;
      
      handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        startHeight = textarea.offsetHeight;
        editor.classList.add('resizing');
        document.body.style.cursor = 'ns-resize';
        e.preventDefault();
      });
      
      document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const deltaY = e.clientY - startY;
        const newHeight = Math.max(80, Math.min(startHeight + deltaY, editor.offsetHeight - 150));
        textarea.style.height = newHeight + 'px';
      });
      
      document.addEventListener('mouseup', () => {
        if (isResizing) {
          isResizing = false;
          editor.classList.remove('resizing');
          document.body.style.cursor = '';
        }
      });
      
      // 触摸设备支持
      handle.addEventListener('touchstart', (e) => {
        isResizing = true;
        startY = e.touches[0].clientY;
        startHeight = textarea.offsetHeight;
        editor.classList.add('resizing');
        e.preventDefault();
      }, { passive: false });
      
      document.addEventListener('touchmove', (e) => {
        if (!isResizing) return;
        
        const deltaY = e.touches[0].clientY - startY;
        const newHeight = Math.max(80, Math.min(startHeight + deltaY, editor.offsetHeight - 150));
        textarea.style.height = newHeight + 'px';
      }, { passive: false });
      
      document.addEventListener('touchend', () => {
        if (isResizing) {
          isResizing = false;
          editor.classList.remove('resizing');
        }
      });
    }



    

        // ==================== 任务列表功能 ====================
    let selectedTaskId = null;

    function renderTaskList(note) {
      const container = document.getElementById('taskItems');
      if (!container || !note.tasks) return;
      
      container.innerHTML = note.tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''} ${selectedTaskId === task.id ? 'selected' : ''}" 
            data-task-id="${task.id}">
          <div class="task-checkbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="task-content">
            <div class="task-text">${escapeHtml(task.text)}</div>
          </div>
        </div>
      `).join('');
      
      // 绑定任务点击事件
      container.querySelectorAll('.task-item').forEach(item => {
        const taskId = item.dataset.taskId;
        
        // 点击checkbox切换完成状态
        item.querySelector('.task-checkbox').addEventListener('click', (e) => {
          e.stopPropagation();
          toggleTaskComplete(note, taskId);
        });
        
        // 点击任务项选中
        item.addEventListener('click', (e) => {
          if (e.target.closest('.task-checkbox')) return;
          selectTask(taskId);
        });
        
        // 双击编辑任务
        item.addEventListener('dblclick', (e) => {
          if (e.target.closest('.task-checkbox')) return;
          editTask(note, taskId);
        });
      });
    }

    function addTask(note) {
      const taskId = Date.now().toString();
      const newTask = {
        id: taskId,
        text: '',
        completed: false
      };
      note.tasks.push(newTask);
      saveData('notes', notes);
      renderTaskList(note);
      
      // 立即进入编辑模式
      editTask(note, taskId);
    }

    function editTask(note, taskId) {
      const task = note.tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"]`);
      if (!taskItem) return;
      
      const taskContent = taskItem.querySelector('.task-content');
      const originalText = task.text;
      
      taskContent.innerHTML = `<input type="text" class="task-input" value="${escapeHtml(task.text)}" placeholder="输入任务内容...">`;
      
      const input = taskContent.querySelector('.task-input');
      input.focus();
      input.select();
      
      const saveTask = () => {
        const newText = input.value.trim();
        if (newText) {
          task.text = newText;
          saveData('notes', notes);
          renderTaskList(note);
          renderPinnedNotes();
          refreshDesktopNoteWidgets();
        } else if (!originalText) {
          // 新任务没有输入内容，删除它
          note.tasks = note.tasks.filter(t => t.id !== taskId);
          saveData('notes', notes);
          renderTaskList(note);
        } else {
          // 编辑时清空，恢复原内容
          renderTaskList(note);
        }
      };
      
      input.addEventListener('blur', saveTask);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.blur();
        } else if (e.key === 'Escape') {
          task.text = originalText;
          renderTaskList(note);
        }
      });
    }

    function toggleTaskComplete(note, taskId) {
      const task = note.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        saveData('notes', notes);
        renderTaskList(note);
        renderPinnedNotes();
        refreshDesktopNoteWidgets();
      }
    }

    function selectTask(taskId) {
      selectedTaskId = (selectedTaskId === taskId) ? null : taskId;
      const note = notes.find(n => n.id === currentNoteId);
      if (note) {
        renderTaskList(note);
      }
    }

    function deleteSelectedTask() {
      if (!selectedTaskId || !currentNoteId) return;
      
      const note = notes.find(n => n.id === currentNoteId);
      if (note && note.tasks) {
        note.tasks = note.tasks.filter(t => t.id !== selectedTaskId);
        selectedTaskId = null;
        saveData('notes', notes);
        renderTaskList(note);
        renderPinnedNotes();
        refreshDesktopNoteWidgets();
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // ==================== 桌面模式 ====================
    const DESKTOP_WIDGETS = {
      calendar:  { name: '日历',     icon: '📅', desc: '当月日历，标记今天', w: 2, h: 2 },
      countdown: { name: '倒数日',   icon: '⏳', desc: '距目标还有多少天', w: 2, h: 2 },
      todo:      { name: '待办清单', icon: '✓',  desc: '记录今天要做的事', w: 2, h: 2 },
      note:      { name: '便签',     icon: '✎',  desc: '同步原便签与固定内容', w: 2, h: 2 },
      pomodoro:  { name: '专注钟',   icon: '🍅', desc: '番茄工作法计时', w: 2, h: 2 },
      weather:   { name: '天气',     icon: '⛅', desc: '实时天气与 7 日预报', w: 2, h: 2 }
    };

    const DESKTOP_TINTS = [
      'linear-gradient(150deg,#eef1e8,#d8e2d4)',
      'linear-gradient(150deg,#f4ece2,#e7d9cb)',
      'linear-gradient(150deg,#e9eef2,#d4dfe6)',
      'linear-gradient(150deg,#f1eae8,#e2d2d8)',
      'linear-gradient(150deg,#efeae0,#ddd6c4)',
      'linear-gradient(150deg,#e7efe9,#cfe0d6)'
    ];
    const WEATHER_CACHE_MS = 60 * 60 * 1000; // 天气主体缓存 1 小时，减少新标签页重复调用
    const WEATHER_GEO_CACHE_MS = 7 * 24 * 60 * 60 * 1000; // 城市/区县搜索结果缓存 7 天
    const WEATHER_SEARCH_DEBOUNCE_MS = 650; // 城市搜索防抖，避免每个字都请求
    const WEATHER_MIN_SEARCH_LENGTH = 2; // 少于 2 个字符不触发城市搜索
    // 和风天气 QWeather 配置：
    // 方式 1：直接在这里填写 QWEATHER_API_KEY（自己使用最快）。
    // 方式 2：在浏览器控制台设置 localStorage.setItem('QWEATHER_API_KEY', '你的Key')。
    // 方式 3：正式发布建议改成你自己的后端代理，不要把 Key 暴露在前端。
    const QWEATHER_API_KEY = '8e198666295f4f6195f6cb0c08b5afc1';
    const QWEATHER_JWT = '';
    const QWEATHER_WEATHER_HOST = 'https://m44bjc9h7q.re.qweatherapi.com';
    const QWEATHER_GEO_HOST = 'https://m44bjc9h7q.re.qweatherapi.com';
    const QWEATHER_AIR_HOST = 'https://m44bjc9h7q.re.qweatherapi.com';
    const WEATHER_PROVIDER = 'qweather';


    const desktopTimers = {};
    let desktopEditId = null;
    let desktopFolderOpenId = null;
    let desktopDragId = null;
    let folderChildDragId = null;
    let folderChildSuppressClick = false;
    let weatherDetailItemId = null;
    let weatherSidebarOpen = false;
    let weatherRenderedEntries = [];
    let weatherSearchSuggestions = [];
    let weatherSearchLoading = false;
    let weatherSearchQuery = '';
    const WEATHER_LIST_STORAGE_KEY = 'bingyu_weather_saved_list_v2';
    const WEATHER_LIST_LIMIT = 8;
    const DESKTOP_FOLDER_LAYOUTS = {
      '1x1': { key: '1x1', w: 1, h: 1, limit: 4, previewCols: 2, previewRows: 2, name: '1x1' },
      '1x2': { key: '1x2', w: 2, h: 1, limit: 3, previewCols: 3, previewRows: 1, name: '1x2' },
      '2x1': { key: '2x1', w: 1, h: 2, limit: 3, previewCols: 1, previewRows: 3, name: '2x1' },
      '2x2': { key: '2x2', w: 2, h: 2, limit: 4, previewCols: 2, previewRows: 2, name: '2x2' },
      '2x4': { key: '2x4', w: 4, h: 2, limit: 8, previewCols: 4, previewRows: 2, name: '2x4' }
    };

    function getDesktopFolderLayoutConfig(layout) {
      return DESKTOP_FOLDER_LAYOUTS[layout] || DESKTOP_FOLDER_LAYOUTS['1x1'];
    }

    function applyDesktopFolderLayout(item, layout) {
      if (!item || item.type !== 'folder') return item;
      const cfg = getDesktopFolderLayoutConfig(layout || item.layout);
      item.layout = cfg.key;
      item.w = cfg.w;
      item.h = cfg.h;
      item.children = Array.isArray(item.children) ? item.children : [];
      return item;
    }

    function dtId(prefix) {
      return `desktop-${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    }

    function defaultCountdownDate() {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return toDateInputValue(d);
    }

    function toDateInputValue(d) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function parseDateOnly(value) {
      if (!value) return null;
      const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    }

    function todayKey() {
      return toDateInputValue(new Date());
    }

    function clampNumber(n, min, max) {
      return Math.min(max, Math.max(min, Number(n) || 0));
    }

    function pct(n) {
      return `${Math.round(clampNumber(n, 0, 100))}%`;
    }

    function formatShortTime(value) {
      if (!value) return '--:--';
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value).slice(11, 16) || '--:--';
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    function formatShortDate(value) {
      const d = parseDateOnly(value);
      if (!d) return '未设置';
      return `${d.getMonth() + 1}月${d.getDate()}日 周${'日一二三四五六'[d.getDay()]}`;
    }

    function formatRelativeTime(ts) {
      if (!ts) return '尚未保存';
      const diff = Math.max(0, Date.now() - Number(ts));
      if (diff < 60000) return '刚刚保存';
      if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
      return `${Math.floor(diff / 86400000)} 天前`;
    }

    function windDirection(deg) {
      if (deg === null || deg === undefined || deg === '') return '--';
      const dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
      return dirs[Math.round((Number(deg) % 360) / 45) % 8];
    }

    function getDefaultDesktopItems() {
      const soon = defaultCountdownDate();
      return [
        { id: 'dt-cal', type: 'widget', widget: 'calendar', title: '日历', w: 2, h: 2 },
        { id: 'dt-weather', type: 'widget', widget: 'weather', title: '天气', city: 'Beijing', w: 2, h: 2 },
        {
          id: 'dt-folder-research', type: 'folder', title: '科研工具', icon: '📚', layout: '1x1', w: 1, h: 1, children: [
            { id: 'dt-c-scholar', type: 'site', title: 'Scholar', url: 'https://scholar.google.com', icon: '' },
            { id: 'dt-c-arxiv', type: 'site', title: 'arXiv', url: 'https://arxiv.org', icon: '' },
            { id: 'dt-c-github', type: 'site', title: 'GitHub', url: 'https://github.com', icon: '' },
            { id: 'dt-c-ss', type: 'site', title: 'Semantic', url: 'https://www.semanticscholar.org', icon: '' }
          ]
        },
        { id: 'dt-s-bilibili', type: 'site', title: '哔哩哔哩', url: 'https://www.bilibili.com', icon: '' },
        { id: 'dt-s-zhihu', type: 'site', title: '知乎', url: 'https://www.zhihu.com', icon: '' },
        { id: 'dt-s-scholar-main', type: 'site', title: 'Google Scholar', url: 'https://scholar.google.com', icon: '' },
        { id: 'dt-pomo', type: 'widget', widget: 'pomodoro', title: '专注', w: 2, h: 2, minutes: 25, focusTask: '' },
        { id: 'dt-todo', type: 'widget', widget: 'todo', title: '待办', w: 2, h: 2, todos: [{ text: '读一篇论文', done: false }, { text: '整理今天的灵感', done: false }] },
        { id: 'dt-note', type: 'widget', widget: 'note', title: '便签', w: 2, h: 2 },
        { id: 'dt-count', type: 'widget', widget: 'countdown', title: '倒数日', targetDate: soon, createdAt: todayKey(), w: 2, h: 2 }
      ];
    }

    function migrateDesktopItemsV3(list) {
      const removedWidgets = new Set(['clock', 'quote', 'search']);
      const walk = (items = []) => items
        .filter(item => !(item.type === 'widget' && removedWidgets.has(item.widget)))
        .map(item => {
          if (item.children) item.children = walk(item.children);
          if (item.type === 'widget' && item.widget === 'note') {
            delete item.text;
            delete item.updatedAt;
            item.title = item.title || '便签';
          }
          return item;
        });
      const next = walk(Array.isArray(list) ? list : []);
      const hasSyncedNote = next.some(item => item.type === 'widget' && item.widget === 'note');
      if (!hasSyncedNote) next.push({ id: 'dt-note', type: 'widget', widget: 'note', title: '便签', w: 2, h: 2 });
      return next;
    }

    function migrateDesktopItemsV4(list) {
      const next = Array.isArray(list) ? list : [];
      const yuque = next.find(item => item && item.type === 'site' && (item.id === 'dt-s-yuque' || (/yuque\.com/i.test(item.url || '') && item.title === '语雀')));
      if (yuque) {
        yuque.id = yuque.id === 'dt-s-yuque' ? 'dt-s-scholar-main' : yuque.id;
        yuque.title = 'Google Scholar';
        yuque.url = 'https://scholar.google.com';
        yuque.icon = '';
      }
      const countIndex = next.findIndex(item => item && (item.id === 'dt-count' || (item.type === 'widget' && item.widget === 'countdown')));
      const pomoIndex = next.findIndex(item => item && (item.id === 'dt-pomo' || (item.type === 'widget' && item.widget === 'pomodoro')));
      if (countIndex >= 0 && pomoIndex >= 0 && countIndex < pomoIndex) {
        const temp = next[countIndex];
        next[countIndex] = next[pomoIndex];
        next[pomoIndex] = temp;
      }
      return next;
    }

    function migrateDesktopItemsV5(list) {
      const walk = (items = []) => items.map(item => {
        if (item && item.type === 'folder') applyDesktopFolderLayout(item, item.layout || '1x1');
        if (item && Array.isArray(item.children)) item.children = walk(item.children);
        return item;
      });
      return walk(Array.isArray(list) ? list : []);
    }

    // 旧版桌面数据 → v3：移除重复的桌面时钟 / 每日一言 / 快捷搜索，并让便签接入同一套 notes 数据。
    (function ensureDesktopSchema() {
      try {
        const v = loadData('desktopSchemaV', 0);
        if (v < 2) desktopItems = getDefaultDesktopItems();
        normalizeDesktopItems(desktopItems);
        if (v < 3) desktopItems = migrateDesktopItemsV3(desktopItems);
        normalizeDesktopItems(desktopItems);
        if (v < 4) desktopItems = migrateDesktopItemsV4(desktopItems);
        normalizeDesktopItems(desktopItems);
        if (v < 5) desktopItems = migrateDesktopItemsV5(desktopItems);
        normalizeDesktopItems(desktopItems);
        saveData('desktopItems', desktopItems);
        saveData('desktopSchemaV', 5);
      } catch (e) { /* 忽略迁移异常 */ }
    })();

    function saveDesktopState() {
      saveData('desktopMode', desktopMode);
      saveData('desktopItems', desktopItems);
    }

    function normalizeDesktopItems(list) {
      (list || []).forEach(it => {
        if (it.type === 'widget') {
          const d = DESKTOP_WIDGETS[it.widget] || { w: 2, h: 2 };
          it.w = it.w || d.w;
          it.h = it.h || d.h;
          if (it.widget === 'weather') {
            it.w = Math.max(it.w || 2, 2);
            it.h = Math.max(it.h || 2, 2);
          }
          if (it.widget === 'countdown') {
            it.h = Math.max(it.h || 2, 2);
            it.createdAt = it.createdAt || todayKey();
          }
          if (it.widget === 'pomodoro') {
            it.minutes = it.minutes || 25;
            it.focusTask = it.focusTask || '';
          }
        } else if (it.type === 'folder') {
          applyDesktopFolderLayout(it, it.layout || '1x1');
        } else {
          it.w = 1;
          it.h = 1;
        }
        if (it.children) normalizeDesktopItems(it.children);
      });
      return list;
    }

    function normalizeDesktopUrl(url) {
      if (!url) return '';
      if (url.startsWith('#') || url.startsWith('./') || url.startsWith('/') || url.startsWith('http')) return url;
      return `https://${url}`;
    }

    function getDesktopItemById(id, list = desktopItems) {
      for (const item of list) {
        if (item.id === id) return item;
        if (item.children) {
          const child = getDesktopItemById(id, item.children);
          if (child) return child;
        }
      }
      return null;
    }

    function removeDesktopItemById(id, list = desktopItems) {
      const index = list.findIndex(item => item.id === id);
      if (index >= 0) { list.splice(index, 1); return true; }
      for (const item of list) {
        if (item.children && removeDesktopItemById(id, item.children)) return true;
      }
      return false;
    }

    function findDesktopParentFolderOfChild(id, list = desktopItems) {
      for (const item of list) {
        if (item.type === 'folder' && Array.isArray(item.children)) {
          const index = item.children.findIndex(child => child.id === id);
          if (index >= 0) return { folder: item, index };
          const nested = findDesktopParentFolderOfChild(id, item.children);
          if (nested) return nested;
        }
      }
      return null;
    }

    function moveDesktopItemToRoot(id) {
      const found = findDesktopParentFolderOfChild(id);
      if (!found) {
        showToast('这个项目已经在桌面上了');
        return;
      }
      const [moved] = found.folder.children.splice(found.index, 1);
      if (!moved) return;
      desktopItems.push(moved);
      saveDesktopState();
      renderDesktopGrid();
      if (desktopFolderOpenId) {
        const folder = getDesktopItemById(desktopFolderOpenId);
        if (folder) renderFolderPopGrid(folder);
      }
      showToast(`已移动「${moved.title || '网址'}」到桌面`);
    }

    function getCountdownDays(targetDate) {
      if (!targetDate) return 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = parseDateOnly(targetDate);
      if (!target) return 0;
      target.setHours(0, 0, 0, 0);
      return Math.round((target - today) / 86400000);
    }

    function countdownProgress(item) {
      if (!item || !item.targetDate) return 0;
      const start = parseDateOnly(item.createdAt) || new Date();
      const end = parseDateOnly(item.targetDate);
      if (!end) return 0;
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const total = Math.max(1, Math.abs(end - start));
      const passed = Math.abs(today - start);
      return clampNumber((passed / total) * 100, 0, 100);
    }

    // ---------- 图标 / 缩略图 ----------
    function dtTint(s) {
      s = s || '';
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return DESKTOP_TINTS[h % DESKTOP_TINTS.length];
    }

    function isImgIcon(v) {
      return /^(https?:|\.?\/)/.test(v) || /\.(svg|png|jpe?g|webp|gif|ico)$/i.test(v);
    }

    function dtFavicon(url) {
      if (!url) return '';
      try {
        if (url.startsWith('#') || url.startsWith('./') || url.startsWith('/')) return '';
        const u = new URL(normalizeDesktopUrl(url));
        return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
      } catch (e) { return ''; }
    }

    function cleanIcon(v) {
      return (v && !String(v).includes('<')) ? String(v) : '';
    }

    function renderSiteTile(item) {
      const tint = dtTint(item.title || item.url || '');
      const ic = cleanIcon(item.icon);
      if (ic && isImgIcon(ic)) return `<div class="dt-icon" style="--tint:${tint}"><img src="${escapeHtml(ic)}" alt=""></div>`;
      if (ic) return `<div class="dt-icon" style="--tint:${tint}"><span class="dt-icon-emoji">${escapeHtml(ic)}</span></div>`;
      const fav = dtFavicon(item.url);
      const letter = (item.title || '·').trim().charAt(0).toUpperCase();
      if (fav) {
        return `<div class="dt-icon" style="--tint:${tint}"><img src="${fav}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="dt-icon-letter" style="display:none;background:${tint}">${escapeHtml(letter)}</span></div>`;
      }
      return `<div class="dt-icon" style="--tint:${tint}"><span class="dt-icon-letter" style="background:${tint}">${escapeHtml(letter)}</span></div>`;
    }

    function renderFolderPreviewIcon(k) {
      const ic = cleanIcon(k.icon);
      if (ic && isImgIcon(ic)) return `<img src="${escapeHtml(ic)}" alt="">`;
      if (ic) return `<span class="dt-folder-preview-emoji">${escapeHtml(ic)}</span>`;
      const fav = dtFavicon(k.url);
      const letter = escapeHtml((k.title || '·').charAt(0).toUpperCase());
      const tint = dtTint(k.title || k.url || '');
      if (fav) {
        return `<img src="${fav}" alt="" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="dt-folder-preview-letter" style="display:none;background:${tint}">${letter}</span>`;
      }
      return `<span class="dt-folder-preview-letter" style="background:${tint}">${letter}</span>`;
    }

    function renderFolderTile(item) {
      const cfg = getDesktopFolderLayoutConfig(item.layout);
      const kids = (item.children || []).slice(0, cfg.limit);
      if (cfg.key === '1x1') {
        const cells = [0, 1, 2, 3].map(i => {
          const k = kids[i];
          if (!k) return '<div></div>';
          const ic = cleanIcon(k.icon);
          if (ic && isImgIcon(ic)) return `<div><img src="${escapeHtml(ic)}" alt=""></div>`;
          if (ic) return `<div>${escapeHtml(ic)}</div>`;
          const fav = dtFavicon(k.url);
          if (fav) return `<div><img src="${fav}" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'"></div>`;
          return `<div>${escapeHtml((k.title || '·').charAt(0))}</div>`;
        }).join('');
        return `<div class="dt-icon dt-folder-tile"><div class="dt-folder-mini">${cells}</div></div>`;
      }
      const cells = Array.from({ length: cfg.limit }, (_, i) => {
        const k = kids[i];
        if (!k) return '<div class="dt-folder-preview-empty"></div>';
        return `<div class="dt-folder-preview-app" data-folder-quick-id="${escapeHtml(k.id)}" title="${escapeHtml(k.title || '打开网址')}">${renderFolderPreviewIcon(k)}</div>`;
      }).join('');
      return `<div class="dt-icon dt-folder-tile dt-folder-large-tile" style="--folder-preview-cols:${cfg.previewCols};--folder-preview-rows:${cfg.previewRows};"><div class="dt-folder-preview">${cells}</div></div>`;
    }

    // ---------- 小组件渲染 ----------
    function renderCalendar() {
      const now = new Date();
      const y = now.getFullYear(), m = now.getMonth(), today = now.getDate();
      const first = new Date(y, m, 1).getDay();
      const days = new Date(y, m + 1, 0).getDate();
      const wk = ['日', '一', '二', '三', '四', '五', '六'];
      let cells = wk.map(d => `<span class="dt-cal-wk">${d}</span>`).join('');
      for (let i = 0; i < first; i++) cells += '<span class="dt-cal-dim"></span>';
      for (let d = 1; d <= days; d++) cells += `<span class="${d === today ? 'dt-cal-today' : ''}">${d}</span>`;
      return `<div class="dt-widget dt-cal"><div class="dt-cal-head">${y}年${m + 1}月</div><div class="dt-cal-grid">${cells}</div></div>`;
    }

    function getPomo(item) {
      const total = (item.minutes || 25) * 60;
      const key = todayKey();
      if (!item.pomo) item.pomo = { remaining: total, running: false, sessionsToday: 0, lastDate: key, task: item.focusTask || '' };
      if (item.pomo.lastDate !== key) {
        item.pomo.sessionsToday = 0;
        item.pomo.lastDate = key;
      }
      if (item.pomo.remaining === undefined || item.pomo.remaining === null) item.pomo.remaining = total;
      if (item.pomo.task === undefined) item.pomo.task = item.focusTask || '';
      if (item.pomo.running && item.pomo.startedAt) {
        const elapsed = Math.floor((Date.now() - item.pomo.startedAt) / 1000);
        const base = item.pomo.remainingAtStart || item.pomo.remaining || total;
        item.pomo.remaining = Math.max(0, base - elapsed);
      }
      desktopTimers[item.id] = item.pomo;
      return item.pomo;
    }

    function fmtPomo(s) {
      const m = Math.floor(s / 60), ss = s % 60;
      return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    }

    function weatherIconType(code) {
      const c = parseInt(code, 10);
      // QWeather 图标码：100 晴，101-104 多云/阴，300-399 雨，400-499 雪，500-515 雾/霾/沙尘等。
      if (c === 100) return 'sun';
      if ([101, 102, 103].includes(c)) return 'partly';
      if ([104, 150, 151, 152, 153].includes(c)) return 'cloud';
      if ((c >= 300 && c < 400) || [350, 351, 399].includes(c)) return [302, 303, 304].includes(c) ? 'storm' : 'rain';
      if (c >= 400 && c < 500) return 'snow';
      if (c >= 500 && c < 600) return 'fog';

      // Open-Meteo / WMO 兼容映射，作为 fallback 保留。
      if (c === 0 || c === 113) return 'sun';
      if ([1, 2, 116].includes(c)) return 'partly';
      if (c === 3 || c === 119 || c === 122) return 'cloud';
      if ([45, 48, 143, 248, 260].includes(c)) return 'fog';
      if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(c) || c >= 176 && c < 317) return 'rain';
      if ([71, 73, 75, 77, 85, 86].includes(c) || c >= 317 && c < 386) return 'snow';
      if ([95, 96, 99].includes(c) || c >= 386) return 'storm';
      return 'cloud';
    }

    function weatherIcon(code) {
      const type = weatherIconType(code);
      const map = { sun: '☀', partly: '⛅', cloud: '☁', fog: '🌫', rain: '🌧', snow: '❄', storm: '⛈' };
      return map[type] || '☁';
    }

    function weatherIconMarkup(code, className = '') {
      const type = weatherIconType(code);
      const cls = `dt-weather-svg ${className}`.trim();
      const common = `class="${cls}" viewBox="0 0 64 64" aria-hidden="true" focusable="false"`;
      if (type === 'sun') return `<svg ${common}><circle cx="32" cy="32" r="12"/><path d="M32 5v9M32 50v9M5 32h9M50 32h9M13 13l6.5 6.5M44.5 44.5 51 51M51 13l-6.5 6.5M19.5 44.5 13 51"/></svg>`;
      if (type === 'partly') return `<svg ${common}><circle cx="24" cy="24" r="9"/><path d="M24 5v7M24 36v7M5 24h7M36 24h7M10 10l5 5M33 33l5 5M38 10l-5 5"/><path class="cloud" d="M24 48h24a9 9 0 0 0 0-18 14 14 0 0 0-26-3A10.5 10.5 0 0 0 24 48Z"/></svg>`;
      if (type === 'rain') return `<svg ${common}><path class="cloud" d="M18 39h30a10 10 0 0 0 0-20 16 16 0 0 0-30-3A12 12 0 0 0 18 39Z"/><path d="M22 47l-4 7M34 47l-4 7M46 47l-4 7"/></svg>`;
      if (type === 'snow') return `<svg ${common}><path class="cloud" d="M18 37h30a10 10 0 0 0 0-20 16 16 0 0 0-30-3A12 12 0 0 0 18 37Z"/><path d="M24 47v9M20 51h8M40 47v9M36 51h8"/></svg>`;
      if (type === 'storm') return `<svg ${common}><path class="cloud" d="M18 37h30a10 10 0 0 0 0-20 16 16 0 0 0-30-3A12 12 0 0 0 18 37Z"/><path d="M34 40l-7 12h8l-5 8"/></svg>`;
      if (type === 'fog') return `<svg ${common}><path class="cloud" d="M18 34h30a10 10 0 0 0 0-20 16 16 0 0 0-30-3A12 12 0 0 0 18 34Z"/><path d="M12 45h40M18 53h32"/></svg>`;
      return `<svg ${common}><path class="cloud" d="M18 42h30a10 10 0 0 0 0-20 16 16 0 0 0-30-3A12 12 0 0 0 18 42Z"/></svg>`;
    }

    function weatherCodeText(code) {
      const c = parseInt(code, 10);
      const map = {
        100: '晴', 101: '多云', 102: '少云', 103: '晴间多云', 104: '阴',
        300: '阵雨', 301: '强阵雨', 302: '雷阵雨', 303: '强雷阵雨', 304: '雷阵雨伴冰雹',
        305: '小雨', 306: '中雨', 307: '大雨', 308: '极端降雨', 309: '毛毛雨',
        310: '暴雨', 311: '大暴雨', 312: '特大暴雨', 313: '冻雨', 314: '小到中雨',
        315: '中到大雨', 316: '大到暴雨', 317: '暴雨到大暴雨', 318: '大暴雨到特大暴雨',
        399: '雨', 400: '小雪', 401: '中雪', 402: '大雪', 403: '暴雪',
        404: '雨夹雪', 405: '雨雪天气', 406: '阵雨夹雪', 407: '阵雪',
        408: '小到中雪', 409: '中到大雪', 410: '大到暴雪', 499: '雪',
        500: '薄雾', 501: '雾', 502: '霾', 503: '扬沙', 504: '浮尘',
        507: '沙尘暴', 508: '强沙尘暴', 509: '浓雾', 510: '强浓雾',
        511: '中度霾', 512: '重度霾', 513: '严重霾', 514: '大雾', 515: '特强浓雾',
        900: '热', 901: '冷',
        0: '晴', 1: '少云', 2: '多云', 3: '阴',
        45: '有雾', 48: '雾凇',
        51: '小毛毛雨', 53: '毛毛雨', 55: '较强毛毛雨',
        56: '冻毛毛雨', 57: '强冻毛毛雨',
        61: '小雨', 63: '中雨', 65: '大雨',
        66: '冻雨', 67: '强冻雨',
        71: '小雪', 73: '中雪', 75: '大雪', 77: '雪粒',
        80: '阵雨', 81: '强阵雨', 82: '暴阵雨',
        85: '阵雪', 86: '强阵雪',
        95: '雷暴', 96: '雷暴伴冰雹', 99: '强雷暴伴冰雹'
      };
      if (map[c]) return map[c];
      if (c === 113) return '晴';
      if (c === 116) return '少云';
      if (c === 119 || c === 122) return '多云';
      if (c >= 176 && c < 317) return '雨';
      if (c >= 317 && c < 386) return '雪';
      if (c >= 386) return '雷雨';
      return '天气';
    }

    function weatherAqiText(value) {
      const v = Math.round(Number(value) || 0);
      if (!v) return { text: '--', value: '--', level: 'unknown' };
      if (v <= 50) return { text: '优', value: v, level: 'good' };
      if (v <= 100) return { text: '良', value: v, level: 'fair' };
      if (v <= 150) return { text: '轻度污染', value: v, level: 'light' };
      if (v <= 200) return { text: '中度污染', value: v, level: 'moderate' };
      if (v <= 300) return { text: '重度污染', value: v, level: 'heavy' };
      return { text: '严重污染', value: v, level: 'severe' };
    }

    function windLevel(speed) {
      const s = Number(speed) || 0;
      if (s < 1) return 0;
      if (s < 6) return 1;
      if (s < 12) return 2;
      if (s < 20) return 3;
      if (s < 29) return 4;
      if (s < 39) return 5;
      if (s < 50) return 6;
      return 7;
    }

    function formatWeatherPublish(value) {
      const d = new Date(value || Date.now());
      if (Number.isNaN(d.getTime())) return '--';
      return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    function weatherLifeAdvice(w) {
      if (!w) return '点击定位后，将为你加载当前位置的天气情况。';
      const type = weatherIconType(w.code);
      if (w.aqi && Number(w.aqi) > 100) return '空气质量一般，外出建议减少长时间剧烈运动。';
      if (type === 'rain' || type === 'storm') return '可能有降水，出门记得带伞，路面湿滑注意安全。';
      if (type === 'snow') return '天气寒冷并可能有雪，注意保暖与道路结冰。';
      if (Number(w.high) >= 34) return '白天温度较高，注意补水、防晒，尽量避开正午暴晒。';
      if (Number(w.low) <= 0) return '早晚温度较低，出门注意添衣保暖。';
      if (w.healthAdvice) return w.healthAdvice;
      return '各类人群可多参加户外活动，多呼吸一下清新的空气。';
    }

    function normalizeWeatherPlaceParts(place) {
      const parts = String(place || '')
        .split(/[·•,，\/]/)
        .map(s => s.trim())
        .filter(Boolean);
      const normalize = (value) => String(value || '')
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[省市区县]$/g, '');
      const out = [];
      parts.forEach(part => {
        const key = normalize(part);
        if (!key) return;
        if (!out.some(existing => normalize(existing) === key)) out.push(part);
      });
      return out;
    }

    function weatherPlaceShort(place) {
      const parts = normalizeWeatherPlaceParts(place);
      if (!parts.length) return '天气';
      return parts[parts.length - 1] || parts[0];
    }

    function weatherPlaceTitle(place) {
      const parts = normalizeWeatherPlaceParts(place);
      if (!parts.length) return '天气';
      // 省/市/区县都保留，避免“澧县”这类区县被显示成上级城市“常德”。
      return parts.map((part, index) => {
        if (index === 0) return part;
        return part.replace(/区$/g, '');
      }).join(' · ');
    }

    function noteTitle(note) {
      if (!note) return '无标题';
      const firstLine = String(note.content || '').split('\n')[0].trim();
      return note.title || firstLine || '无标题';
    }

    function notePreview(note) {
      if (!note) return '';
      const title = noteTitle(note);
      const lines = String(note.content || '').split('\n');
      const body = lines[0]?.trim() === title ? lines.slice(1).join('\n') : lines.join('\n');
      return body.trim() || '空便签';
    }

    function noteDateLabel(note) {
      return note?.date || (note?.updatedAt ? new Date(note.updatedAt).toLocaleDateString('zh-CN') : '');
    }

    function renderSyncedNotesWidget(item) {
      const pinned = notes.filter(n => pinnedNoteIds.includes(n.id));
      const source = pinned.length ? pinned : notes;
      const rows = source.slice(0, 3).map(note => `
        <button class="dt-note-row" data-note-id="${escapeHtml(note.id)}" type="button" title="点击打开这条便签">
          <span class="dt-note-row-title">${escapeHtml(noteTitle(note))}</span>
          <span class="dt-note-row-pin">${pinnedNoteIds.includes(note.id) ? '📌' : ''}</span>
          <span class="dt-note-row-content">${escapeHtml(notePreview(note))}</span>
        </button>`).join('');
      const footLeft = pinned.length ? `已固定 ${pinned.length}` : `${notes.length} 个便签`;
      const footRight = source[0] ? noteDateLabel(source[0]) : '点击创建';
      return `<div class="dt-widget dt-note dt-note-sync" data-notes-open title="点击打开同步便签">
        <div class="dt-w-title"><span>${escapeHtml(item.title || '便签')}</span><span class="dt-w-sub">同步主屏幕</span></div>
        ${rows ? `<div class="dt-note-list">${rows}</div>` : `<div class="dt-note-empty">还没有便签<br>点击这里创建第一条</div>`}
        <div class="dt-note-foot"><span>${escapeHtml(footLeft)}</span><span>${escapeHtml(footRight)}</span></div>
      </div>`;
    }

    function openNotesFromDesktop(noteId) {
      const modal = document.getElementById('notesModal');
      if (modal) modal.classList.add('show');
      if (!notes.length) {
        addNote();
        return;
      }
      const pinned = notes.find(n => pinnedNoteIds.includes(n.id));
      const targetId = noteId || currentNoteId || pinned?.id || notes[0]?.id;
      if (targetId) selectNote(targetId);
    }

    function refreshDesktopNoteWidgets() {
      if (!Array.isArray(desktopItems)) return;
      desktopItems.forEach(item => {
        if (item.type === 'widget' && item.widget === 'note') rerenderCell(item.id);
      });
    }

    function renderWidgetBody(item) {
      switch (item.widget) {
        case 'clock':
          return `<div class="dt-widget dt-clock"><div class="dt-clock-time" data-clock="time">--:--</div><div class="dt-clock-date" data-clock="date"></div></div>`;
        case 'calendar':
          return renderCalendar();
        case 'countdown': {
          const days = getCountdownDays(item.targetDate);
          const word = days === 0 ? '今天' : (days > 0 ? '天后' : '天前');
          const progress = countdownProgress(item);
          return `<div class="dt-widget dt-count">
            <div class="dt-w-title"><span>${escapeHtml(item.title || '倒数日')}</span><span>⏳</span></div>
            <div class="dt-count-num"><b data-count="${escapeHtml(item.targetDate || '')}">${Math.abs(days)}</b><i>${word}</i></div>
            <div class="dt-progress" title="时间进度"><span style="--p:${pct(progress)}"></span></div>
            <div class="dt-count-meta"><span>${escapeHtml(formatShortDate(item.targetDate))}</span><span>${Math.round(progress)}%</span></div>
            <div class="dt-count-date">${escapeHtml(item.targetDate || '未设置日期')}</div></div>`;
        }
        case 'todo': {
          const list = item.todos || [];
          const remaining = list.filter(t => !t.done).length;
          const done = list.length - remaining;
          const progress = list.length ? done / list.length * 100 : 0;
          const rows = list.map((t, i) => `<label class="dt-todo-item ${t.done ? 'done' : ''}" data-i="${i}">
              <span class="dt-check" data-todo-toggle>✓</span>
              <span class="dt-todo-text">${escapeHtml(t.text)}</span>
              <button class="dt-todo-focus" type="button" data-todo-focus title="设为专注任务">▶</button>
              <button class="dt-todo-del" data-todo-del title="删除">×</button>
            </label>`).join('') || `<div style="font-size:12px;color:var(--text-muted);padding:6px 0">还没有待办，加一条吧</div>`;
          return `<div class="dt-widget dt-todo">
            <div class="dt-w-title"><span>${escapeHtml(item.title || '待办')}</span><span class="dt-w-sub">${remaining} 项未完成</span></div>
            <div class="dt-todo-stat"><div class="dt-progress"><span style="--p:${pct(progress)}"></span></div><span>${done}/${list.length || 0}</span></div>
            <div class="dt-todo-list">${rows}</div>
            <div class="dt-todo-add"><input type="text" data-todo-add placeholder="添加待办，回车确认"></div></div>`;
        }
        case 'note':
          return renderSyncedNotesWidget(item);
        case 'pomodoro': {
          const st = getPomo(item);
          const total = (item.minutes || 25) * 60;
          const progress = total ? (1 - st.remaining / total) * 100 : 0;
          const task = st.task || item.focusTask || '';
          return `<div class="dt-widget dt-pomo ${st.running ? 'is-running' : ''}">
            <div class="dt-pomo-top"><span>${escapeHtml(item.title || '专注')}</span><span>今日 ${st.sessionsToday || 0} 轮</span></div>
            <input class="dt-pomo-task" data-pomo-task value="${escapeHtml(task)}" placeholder="这轮专注做什么？">
            <div class="dt-pomo-time" data-pomo="${item.id}">${fmtPomo(st.remaining)}</div>
            <div class="dt-progress" title="专注进度"><span style="--p:${pct(progress)}"></span></div>
            <div class="dt-pomo-ctrl">
              <button class="dt-pomo-btn primary" data-pomo-toggle>${st.running ? '暂停' : '开始'}</button>
              <button class="dt-pomo-btn" data-pomo-reset>重置</button>
            </div>
            <div class="dt-pomo-meta"><span>${item.minutes || 25} 分钟</span><span>${st.running ? '正在专注' : '准备开始'}</span></div></div>`;
        }
        case 'quote': {
          const text = item.text || pickQuote();
          return `<div class="dt-widget dt-quote">
            <div class="dt-quote-mark">“</div>
            <div class="dt-quote-text" data-quote>${escapeHtml(text)}</div>
            <div class="dt-w-title" style="margin-top:8px"><span>每日一言</span><span data-quote-refresh style="cursor:pointer;font-size:14px">↻</span></div></div>`;
        }
        case 'search':
          return `<div class="dt-widget dt-search">
            <div class="dt-search-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
            <input type="text" data-dsearch placeholder="输入后回车搜索..."></div>`;
        case 'weather': {
          const w = item._weather;
          if (w) {
            const aqi = weatherAqiText(w.aqi);
            return `<div class="dt-widget dt-weather dt-weather-card" data-weather-open title="点击查看详细天气">
              <div class="dt-weather-card-head">
                <div class="dt-weather-city">${escapeHtml(weatherPlaceShort(w.place || item.place || item.city || '天气'))}<span class="dt-weather-pin">⌖</span></div>
                <div class="dt-weather-symbol">${weatherIconMarkup(w.code)}<span>${escapeHtml(w.desc)}</span></div>
              </div>
              <div class="dt-weather-card-temp">${Math.round(w.temp)}°</div>
              <div class="dt-weather-card-foot">
                <div>AQI <b>${escapeHtml(w.airCategory || aqi.text)}/${escapeHtml(w.aqiDisplay || aqi.value)}</b></div>
                <div>最高${Math.round(w.high)}° 最低${Math.round(w.low)}°</div>
              </div>
            </div>`;
          }
          if (item._weatherError) return `<div class="dt-widget dt-weather dt-weather-card dt-weather-empty" data-weather-open>
            <div class="dt-weather-card-head"><div class="dt-weather-city">天气<span class="dt-weather-pin">⌖</span></div><div class="dt-weather-symbol">${weatherIconMarkup(2)}<span>待定位</span></div></div>
            <div class="dt-weather-card-temp" style="font-size:19px;line-height:1.35">天气暂时不可用</div>
            <div class="dt-weather-card-foot"><div>${escapeHtml(item._weatherError)}</div><div class="dt-weather-actions"><button class="dt-mini-btn" type="button" data-weather-refresh>重试</button></div></div>
          </div>`;
          return `<div class="dt-widget dt-weather dt-weather-card dt-weather-empty" data-weather-open>
            <div class="dt-weather-card-head"><div class="dt-weather-city">本地天气<span class="dt-weather-pin">⌖</span></div><div class="dt-weather-symbol">${weatherIconMarkup(0)}<span>定位</span></div></div>
            <div class="dt-weather-card-temp" style="font-size:21px;line-height:1.35">点击获取位置</div>
            <div class="dt-weather-card-foot"><div>AQI --/--</div><div>加载当地天气</div></div>
          </div>`;
        }
        default:
          return `<div class="dt-widget"><div class="dt-w-title">${escapeHtml(item.title || '组件')}</div></div>`;
      }
    }

    function pickQuote() {
      try {
        if (typeof hitokotoList !== 'undefined' && hitokotoList.length) {
          return hitokotoList[Math.floor(Math.random() * hitokotoList.length)];
        }
      } catch (e) { /* noop */ }
      return '生活明朗，万物可爱';
    }

    function dtCellTools(item) {
      const editable = item.type === 'site' || item.type === 'folder' ||
        (item.type === 'widget' && ['countdown', 'note', 'weather'].includes(item.widget));
      return `<div class="dt-cell-tools">
        ${editable ? '<button class="dt-tool-btn edit" data-act="edit" title="编辑">✎</button>' : ''}
        <button class="dt-tool-btn del" data-act="del" title="删除">×</button>
      </div>`;
    }

    function renderDesktopCell(item) {
      const w = item.w || 1, h = item.h || 1;
      const style = `grid-column:span ${w};grid-row:span ${h}`;
      const label = escapeHtml(item.title || '未命名');
      if (item.type === 'widget') {
        return `<div class="dt-cell is-widget" style="${style}" data-id="${item.id}" data-type="widget" draggable="true" aria-label="${label}">
          <div class="dt-grip" draggable="true" data-grip><span></span><span></span></div>
          ${dtCellTools(item)}
          ${renderWidgetBody(item)}
        </div>`;
      }
      const tile = item.type === 'folder' ? renderFolderTile(item) : renderSiteTile(item);
      const folderClass = item.type === 'folder' ? ` is-folder-cell dt-folder-layout-${getDesktopFolderLayoutConfig(item.layout).key}` : '';
      const layoutAttr = item.type === 'folder' ? ` data-layout="${getDesktopFolderLayoutConfig(item.layout).key}"` : '';
      return `<div class="dt-cell is-icon${folderClass}" style="${style}" data-id="${item.id}" data-type="${item.type}"${layoutAttr} draggable="true">
        ${dtCellTools(item)}
        ${tile}
        <div class="dt-label">${label}</div>
      </div>`;
    }

    function renderDesktopGrid() {
      const grid = document.getElementById('desktopGrid');
      if (!grid) return;
      normalizeDesktopItems(desktopItems);
      if (!desktopItems.length) {
        grid.innerHTML = `<div class="dt-empty">
          <div class="dt-empty-card">
            <div class="dt-empty-kicker">Desktop</div>
            <div class="dt-empty-title">桌面还是空的</div>
            <div class="dt-empty-text">先放几个真正每天会用的东西：天气、专注钟、科研入口，或者从原来的常用站点导入。</div>
            <div class="dt-empty-actions">
              <button class="dt-empty-btn primary" data-empty-action="widget">添加组件</button>
              <button class="dt-empty-btn" data-empty-action="site">添加网址</button>
              <button class="dt-empty-btn" data-empty-action="folder">新建文件夹</button>
              <button class="dt-empty-btn" data-empty-action="restore">恢复默认</button>
            </div>
          </div>
        </div>`;
        if (desktopMode) requestAnimationFrame(updateDesktopLayerMetrics);
        return;
      }
      grid.innerHTML = desktopItems.map(renderDesktopCell).join('');
      refreshDesktopWidgets();
      if (desktopMode) requestAnimationFrame(updateDesktopLayerMetrics);
    }

    function rerenderCell(id) {
      const item = getDesktopItemById(id);
      const el = document.querySelector(`#desktopGrid .dt-cell[data-id="${id}"]`);
      if (!item || !el) return;
      const tmp = document.createElement('div');
      tmp.innerHTML = renderDesktopCell(item);
      el.replaceWith(tmp.firstElementChild);
    }

    function refreshDesktopWidgets() {
      tickDesktopClocks();
      desktopItems.forEach(it => {
        if (it.type === 'widget' && it.widget === 'weather' && (!it._weather || !weatherCacheIsFresh(it))) fetchWeather(it);
      });
    }

    function currentWeatherProviderLabel() {
      return WEATHER_PROVIDER === 'qweather' ? 'QWeather' : 'Open-Meteo';
    }

    function weatherCacheIsFresh(item) {
      const expectedProvider = currentWeatherProviderLabel();
      return item && item.weatherCache && item.weatherCache.updatedAt &&
        item.weatherCache.provider === expectedProvider &&
        (Date.now() - item.weatherCache.updatedAt < WEATHER_CACHE_MS);
    }

    function pickWeatherHourly(hourly, data) {
      const times = hourly.time || [];
      const now = new Date((data && data.updatedAt) || Date.now()).getTime();
      let start = times.findIndex(t => {
        const v = new Date(t).getTime();
        return !Number.isNaN(v) && v >= now - 30 * 60 * 1000;
      });
      if (start < 0) start = 0;
      const visibleHours = 24;
      return times.slice(start, start + visibleHours).map((time, offset) => {
        const i = start + offset;
        return {
          time,
          temp: Number((hourly.temperature_2m || [])[i] ?? data.temp),
          pop: Number((hourly.precipitation_probability || [])[i] ?? 0),
          code: Number((hourly.weather_code || [])[i] ?? data.code)
        };
      });
    }

    function buildWeatherData(item, raw, airRaw) {
      const current = raw.current || {};
      const daily = raw.daily || {};
      const hourly = raw.hourly || {};
      const air = (airRaw && airRaw.current) || {};
      const aqiValue = Number(air.us_aqi ?? air.european_aqi ?? 0);
      const data = {
        place: item.place || item.city || '天气',
        updatedAt: current.time || new Date().toISOString(),
        temp: Number(current.temperature_2m ?? 0),
        feels: Number(current.apparent_temperature ?? current.temperature_2m ?? 0),
        humidity: Number(current.relative_humidity_2m ?? 0),
        pressure: Number(current.pressure_msl ?? current.surface_pressure ?? 0),
        wind: Number(current.wind_speed_10m ?? 0),
        windDir: windDirection(current.wind_direction_10m),
        windLevel: windLevel(current.wind_speed_10m),
        precip: Number(current.precipitation ?? 0),
        code: Number(current.weather_code ?? 3),
        high: Number((daily.temperature_2m_max || [current.temperature_2m || 0])[0]),
        low: Number((daily.temperature_2m_min || [current.temperature_2m || 0])[0]),
        sunrise: (daily.sunrise || [])[0],
        sunset: (daily.sunset || [])[0],
        aqi: aqiValue,
        pm25: Number(air.pm2_5 ?? 0),
        pm10: Number(air.pm10 ?? 0)
      };
      data.desc = weatherCodeText(data.code);
      data.ico = weatherIcon(data.code);
      data.hourly = pickWeatherHourly(hourly, data);
      data.daily = (daily.time || []).slice(0, 7).map((time, i) => ({
        time,
        high: Number((daily.temperature_2m_max || [])[i] ?? data.high),
        low: Number((daily.temperature_2m_min || [])[i] ?? data.low),
        pop: Number((daily.precipitation_probability_max || [])[i] ?? 0),
        code: Number((daily.weather_code || [])[i] ?? data.code)
      }));
      return data;
    }

    function readWeatherConfigValue(name, fallback = '') {
      try {
        const v = localStorage.getItem(name) || localStorage.getItem(name.toLowerCase());
        if (v) return v.trim();
      } catch (_) { /* noop */ }
      try {
        if (window && typeof window[name] === 'string' && window[name].trim()) return window[name].trim();
      } catch (_) { /* noop */ }
      return String(fallback || '').trim();
    }

    function normalizeQWeatherHost(value) {
      const raw = String(value || '').trim().replace(/\/+$/, '');
      if (!raw) return '';
      return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    }

    function getQWeatherConfig() {
      return {
        apiKey: readWeatherConfigValue('QWEATHER_API_KEY', QWEATHER_API_KEY),
        jwt: readWeatherConfigValue('QWEATHER_JWT', QWEATHER_JWT),
        weatherHost: normalizeQWeatherHost(readWeatherConfigValue('QWEATHER_WEATHER_HOST', QWEATHER_WEATHER_HOST)),
        geoHost: normalizeQWeatherHost(readWeatherConfigValue('QWEATHER_GEO_HOST', QWEATHER_GEO_HOST)),
        airHost: normalizeQWeatherHost(readWeatherConfigValue('QWEATHER_AIR_HOST', QWEATHER_AIR_HOST))
      };
    }

    function qWeatherHasCredential() {
      const cfg = getQWeatherConfig();
      const key = cfg.apiKey && !/^(your|replace|demo|test|xxx|请填写)/i.test(cfg.apiKey);
      const jwt = cfg.jwt && !/^(your|replace|demo|test|xxx|请填写)/i.test(cfg.jwt);
      return !!(key || jwt);
    }

    function qWeatherBuildUrl(host, path, params = {}) {
      const cfg = getQWeatherConfig();
      const base = normalizeQWeatherHost(host || cfg.weatherHost);
      if (!base) throw new Error('和风天气 API Host 为空，请先配置专属 API Host');
      const url = new URL(path, base);
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v) !== '') url.searchParams.set(k, String(v));
      });
      if (!cfg.jwt && cfg.apiKey) url.searchParams.set('key', cfg.apiKey);
      return url;
    }

    async function qWeatherFetch(host, path, params = {}) {
      const cfg = getQWeatherConfig();
      const headers = cfg.jwt ? { Authorization: `Bearer ${cfg.jwt}` } : {};
      const url = qWeatherBuildUrl(host, path, params);
      try { console.debug('[Bingyu Weather] QWeather request:', url.origin + url.pathname); } catch (_) { /* noop */ }
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`和风天气请求失败：HTTP ${res.status}`);
      const data = await res.json();
      if (data.code && data.code !== '200') {
        const msgMap = {
          204: '没有找到这个城市',
          400: '请求参数错误',
          401: '和风天气认证失败，请检查 API Key/JWT',
          402: '接口次数或余额不足',
          403: '没有访问这个数据接口的权限',
          404: '接口地址不存在',
          429: '请求过于频繁'
        };
        throw new Error(msgMap[data.code] || `和风天气接口返回 ${data.code}`);
      }
      return data;
    }

    function qWeatherLocationQueryFromLatLon(lat, lon) {
      return `${Number(lon).toFixed(4)},${Number(lat).toFixed(4)}`;
    }

    function qWeatherPlaceFromLocation(loc, fallback = '天气') {
      if (!loc) return fallback;
      const parts = [loc.adm1, loc.adm2, loc.name].filter(Boolean);
      const label = normalizeWeatherPlaceParts(parts.join(' · ')).join(' · ');
      return label || loc.name || fallback;
    }

    async function qWeatherLookupLocation(location, fallback = '天气') {
      const cached = readWeatherGeoCache(location, 1);
      if (cached) return cached;
      const cfg = getQWeatherConfig();
      const geo = await qWeatherFetch(cfg.geoHost, '/geo/v2/city/lookup', {
        location,
        lang: 'zh',
        number: 1
      });
      const loc = geo.location && geo.location[0];
      if (!loc) throw new Error('没有找到这个城市');
      const result = {
        id: loc.id,
        lat: Number(loc.lat),
        lon: Number(loc.lon),
        name: loc.name || fallback,
        place: qWeatherPlaceFromLocation(loc, fallback)
      };
      writeWeatherGeoCache(location, 1, result);
      return result;
    }

    async function qWeatherSearchLocations(location) {
      const cached = readWeatherGeoCache(location, 8);
      if (cached) return cached;
      const cfg = getQWeatherConfig();
      const geo = await qWeatherFetch(cfg.geoHost, '/geo/v2/city/lookup', {
        location,
        lang: 'zh',
        number: 8
      });
      const result = (geo.location || []).map(loc => ({
        id: loc.id,
        lat: Number(loc.lat),
        lon: Number(loc.lon),
        name: loc.name || location,
        adm1: loc.adm1 || '',
        adm2: loc.adm2 || '',
        country: loc.country || '',
        place: qWeatherPlaceFromLocation(loc, location)
      }));
      writeWeatherGeoCache(location, 8, result);
      return result;
    }

    function normalizeQWeatherAirAqi(airRaw) {
      if (!airRaw) {
        return { aqi: 0, aqiDisplay: '--', category: '', level: '', primary: '', pm25: 0, pm10: 0, pubTime: '', indexCode: '' };
      }

      // 兼容旧版 Web API v7: /v7/air/now
      if (airRaw.now) {
        const now = airRaw.now || {};
        const value = Number(now.aqi || 0);
        return {
          aqi: value,
          aqiDisplay: now.aqi || (value ? String(value) : '--'),
          category: now.category || '',
          level: now.level || '',
          primary: now.primary || '',
          pm25: Number(now.pm2p5 || now.pm25 || 0),
          pm10: Number(now.pm10 || 0),
          pubTime: now.pubTime || '',
          indexCode: 'v7'
        };
      }

      // 新版空气质量 API v1: /airquality/v1/current/{latitude}/{longitude}
      // 返回 indexes[] 和 pollutants[]，中国优先使用 cn-mee，其次 cn-mee-1h；其他地区优先使用当地 AQI，最后才用 qaqi。
      const indexes = Array.isArray(airRaw.indexes) ? airRaw.indexes : [];
      const preferredCodes = [
        'cn-mee', 'cn-mee-1h',
        'hk-epd', 'mo-smg', 'tw-me', 'tw-me-1h',
        'jp-moe', 'kr-moe', 'sg-nea', 'sg-nea-pm1h',
        'us-epa', 'us-epa-nc', 'eu-eea',
        'ca-eccc', 'gb-defra', 'fr-atmo',
        'qaqi'
      ];
      const pickByCode = (code) => indexes.find(it => String(it.code || '').toLowerCase() === code);
      let index = preferredCodes.map(pickByCode).find(Boolean);
      if (!index) index = indexes.find(it => String(it.code || '').toLowerCase() !== 'qaqi') || indexes[0] || {};

      const pollutants = Array.isArray(airRaw.pollutants) ? airRaw.pollutants : [];
      const findPollutant = (code) => pollutants.find(p => String(p.code || '').toLowerCase() === code);
      const cleanPollutantName = (value, code = '') => {
        const key = String(code || value || '').toLowerCase();
        if (key === 'pm2p5' || key === 'pm25') return 'PM2.5';
        if (key === 'pm10') return 'PM10';
        if (key === 'no2') return 'NO₂';
        if (key === 'so2') return 'SO₂';
        if (key === 'o3') return 'O₃';
        if (key === 'co') return 'CO';
        return String(value || code || '').replace(/\s+/g, '').toUpperCase();
      };
      const pollutantInfo = (code) => {
        const hit = findPollutant(code) || {};
        const concentration = hit.concentration || {};
        return {
          name: cleanPollutantName(hit.name, hit.code || code),
          value: Number(concentration.value ?? 0),
          unit: concentration.unit || 'μg/m³'
        };
      };
      const primary = index.primaryPollutant || {};
      const health = index.health || {};
      const advice = health.advice || {};
      const pm25 = pollutantInfo('pm2p5');
      const pm10 = pollutantInfo('pm10');
      const primaryName = cleanPollutantName(primary.name, primary.code);
      const primaryHit = primary.code ? pollutantInfo(String(primary.code).toLowerCase()) : { value: 0, unit: '' };

      const value = Number(index.aqi ?? 0);
      return {
        aqi: value,
        aqiDisplay: index.aqiDisplay || (value ? String(value) : '--'),
        category: index.category || '',
        level: index.level || '',
        primary: primaryName,
        primaryValue: primaryHit.value,
        primaryUnit: primaryHit.unit,
        pm25: pm25.value,
        pm25Unit: pm25.unit,
        pm10: pm10.value,
        pm10Unit: pm10.unit,
        pubTime: (airRaw.metadata && airRaw.metadata.tag) || '',
        indexCode: index.code || '',
        healthEffect: health.effect || '',
        healthAdvice: advice.generalPopulation || advice.sensitivePopulation || ''
      };
    }


    function readWeatherSavedList() {
      try {
        const raw = localStorage.getItem(WEATHER_LIST_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (_) { return []; }
    }

    function writeWeatherSavedList(entries) {
      try { localStorage.setItem(WEATHER_LIST_STORAGE_KEY, JSON.stringify((entries || []).slice(0, WEATHER_LIST_LIMIT))); }
      catch (_) { /* noop */ }
    }

    function weatherGeoCacheKey(location, number = 8) {
      const value = String(location || '').trim().toLowerCase();
      if (!value) return '';
      return `bingyu_weather_geo_cache_v1:${number}:${value}`;
    }

    function readWeatherGeoCache(location, number = 8) {
      try {
        const key = weatherGeoCacheKey(location, number);
        if (!key) return null;
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const pack = JSON.parse(raw);
        if (!pack || !pack.expiresAt || Date.now() > pack.expiresAt) {
          localStorage.removeItem(key);
          return null;
        }
        return pack.data || null;
      } catch (_) { return null; }
    }

    function writeWeatherGeoCache(location, number = 8, data = null) {
      try {
        const key = weatherGeoCacheKey(location, number);
        if (!key || !data) return;
        localStorage.setItem(key, JSON.stringify({
          updatedAt: Date.now(),
          expiresAt: Date.now() + WEATHER_GEO_CACHE_MS,
          data
        }));
      } catch (_) { /* noop */ }
    }

    function weatherEntryKeyFromItem(item, data) {
      if (!item && !data) return '';
      if (item && item.weatherUseLocation) return '__location__';
      return (item && item.qweatherLocationId) || (data && data.qweatherLocationId) || normalizeWeatherPlaceParts((data && data.place) || (item && item.place) || (item && item.city) || '天气').join('-');
    }

    function cloneWeatherData(data) {
      if (!data) return null;
      try { return JSON.parse(JSON.stringify(data)); } catch (_) { return data; }
    }

    function buildWeatherListEntry(item, data) {
      if (!item || !data) return null;
      const place = data.place || item.place || item.city || '天气';
      const shortCity = weatherPlaceShort(place) || item.city || '天气';
      const weatherData = cloneWeatherData(data);
      if (weatherData) weatherData.place = place;
      return {
        key: weatherEntryKeyFromItem(item, data),
        place,
        city: shortCity,
        lat: item.lat,
        lon: item.lon,
        qweatherLocationId: item.qweatherLocationId || '',
        weatherUseLocation: !!item.weatherUseLocation,
        temp: Math.round(Number(data.temp || 0)),
        high: Math.round(Number(data.high || data.temp || 0)),
        low: Math.round(Number(data.low || data.temp || 0)),
        desc: data.desc || '',
        code: Number(data.code || 0),
        updatedAt: Date.now(),
        weatherData
      };
    }

    function saveWeatherListEntry(item, data) {
      const entry = buildWeatherListEntry(item, data);
      if (!entry) return false;
      const list = readWeatherSavedList().filter(it => {
        if (!it) return false;
        if (entry.weatherUseLocation && it.weatherUseLocation) return false;
        return it.key !== entry.key && it.place !== entry.place;
      });
      list.unshift(entry);
      writeWeatherSavedList(list);
      return true;
    }

    function updateWeatherListEntryIfExists(item, data) {
      const freshEntry = buildWeatherListEntry(item, data);
      if (!freshEntry) return false;
      const list = readWeatherSavedList();
      let changed = false;
      const next = list.map(entry => {
        if (!entry) return entry;
        const sameLocation = freshEntry.weatherUseLocation && entry.weatherUseLocation;
        const sameKey = freshEntry.key && entry.key && freshEntry.key === entry.key;
        const samePlace = freshEntry.place && entry.place && freshEntry.place === entry.place;
        if (!(sameLocation || sameKey || samePlace)) return entry;
        changed = true;
        return { ...entry, ...freshEntry, updatedAt: Date.now() };
      });
      if (changed) writeWeatherSavedList(next);
      return changed;
    }

    function removeWeatherListEntry(entry) {
      if (!entry) return;
      const list = readWeatherSavedList().filter(it => {
        if (!it) return false;
        if (entry.weatherUseLocation && it.weatherUseLocation) return false;
        return it.key !== entry.key && it.place !== entry.place;
      });
      writeWeatherSavedList(list);
    }

    function getWeatherListEntries(item, data) {
      const out = [];
      readWeatherSavedList().forEach(entry => {
        if (!entry) return;
        const dup = out.some(it => (it.weatherUseLocation && entry.weatherUseLocation) || (it.key && entry.key && it.key === entry.key) || (it.place && entry.place && it.place === entry.place));
        if (!dup) out.push(entry);
      });
      return out.slice(0, WEATHER_LIST_LIMIT);
    }

    function renderWeatherSidebar(item, weather) {
      weatherRenderedEntries = getWeatherListEntries(item, weather);
      const currentEntry = buildWeatherListEntry(item, weather);
      const currentKey = currentEntry && currentEntry.key;
      const isSaved = !!(currentKey && weatherRenderedEntries.some(entry => entry && ((entry.key && entry.key === currentKey) || (entry.place && currentEntry.place && entry.place === currentEntry.place))));
      const currentPreview = weather ? `<div class="dt-weather-current-save-card">
          <div class="dt-weather-current-save-main">
            <div class="dt-weather-current-save-title">${escapeHtml(weatherPlaceTitle(weather.place || item.place || item.city || '当前天气'))}</div>
            <div class="dt-weather-current-save-desc">${weatherIconMarkup(weather.code)}<span>${escapeHtml(weather.desc || '天气')}</span></div>
          </div>
          <button type="button" class="dt-weather-save-btn ${isSaved ? 'saved' : ''}" data-weather-save-current>${isSaved ? '已保存' : '保存'}</button>
        </div>` : '<div class="dt-weather-side-empty">加载天气后可以保存到列表</div>';
      const cards = weatherRenderedEntries.map((entry, index) => {
        const title = entry.weatherUseLocation ? `我的位置 · ${weatherPlaceShort(entry.place || entry.city || '当前位置')}` : (entry.place || entry.city || '城市');
        const active = currentEntry && ((entry.key && entry.key === currentEntry.key) || (entry.place && entry.place === currentEntry.place));
        return `<button type="button" class="dt-weather-sidecard ${active ? 'active' : ''}" data-weather-entry-index="${index}" title="左键切换，右键提示移除">
          <div class="dt-weather-sidecard-main">
            <div class="dt-weather-sidecard-place">${escapeHtml(title)}</div>
            <div class="dt-weather-sidecard-desc">${weatherIconMarkup(entry.code)}<span>${escapeHtml(entry.desc || '天气')}</span></div>
          </div>
          <div class="dt-weather-sidecard-meta">
            <div class="dt-weather-sidecard-temp">${Math.round(Number(entry.temp || 0))}°</div>
            <div class="dt-weather-sidecard-range">最高${Math.round(Number(entry.high || 0))}° 最低${Math.round(Number(entry.low || 0))}°</div>
          </div>
        </button>`;
      }).join('') || '<div class="dt-weather-side-empty">还没有保存的城市</div>';
      return `<aside class="dt-weather-sidepanel ${weatherSidebarOpen ? 'show' : ''}">
        <div class="dt-weather-sidepanel-head">
          <div class="dt-weather-sidepanel-title">天气列表</div>
          <button type="button" class="dt-weather-sidepanel-close" data-weather-sidebar-close>×</button>
        </div>
        ${currentPreview}
        <div class="dt-weather-sidepanel-list">${cards}</div>
      </aside>`;
    }

    function renderWeatherSuggestionBox() {
      if (!weatherSearchQuery || String(weatherSearchQuery).trim().length < 1) return '';
      if (weatherSearchLoading) return '<div class="dt-weather-suggest-status">正在搜索城市…</div>';
      if (!weatherSearchSuggestions.length) return '<div class="dt-weather-suggest-status">没有匹配城市</div>';
      return weatherSearchSuggestions.map((loc, index) => `<button type="button" class="dt-weather-suggest-item" data-weather-suggestion-index="${index}">
        <span>${escapeHtml(loc.place || loc.name || '城市')}</span>
        <em>${escapeHtml([loc.adm1, loc.adm2].filter(Boolean).join(' · ') || loc.country || '')}</em>
      </button>`).join('');
    }

    function updateWeatherSuggestionBox() {
      const box = document.querySelector('#dtWeatherDetail [data-weather-suggestions]');
      if (box) box.innerHTML = renderWeatherSuggestionBox();
    }

    let weatherSearchTimer = null;
    function scheduleWeatherSuggestionSearch(rawValue) {
      const value = String(rawValue || '').trim();
      weatherSearchQuery = value;
      if (weatherSearchTimer) clearTimeout(weatherSearchTimer);
      const visibleLength = Array.from(value).length;
      if (!value || visibleLength < WEATHER_MIN_SEARCH_LENGTH) {
        weatherSearchSuggestions = [];
        weatherSearchLoading = false;
        updateWeatherSuggestionBox();
        return;
      }
      const cached = readWeatherGeoCache(value, 8);
      if (cached) {
        weatherSearchSuggestions = cached;
        weatherSearchLoading = false;
        updateWeatherSuggestionBox();
        return;
      }
      weatherSearchLoading = true;
      updateWeatherSuggestionBox();
      weatherSearchTimer = setTimeout(async () => {
        const queryAtRequest = value;
        try {
          const results = await qWeatherSearchLocations(queryAtRequest);
          if (weatherSearchQuery === queryAtRequest) weatherSearchSuggestions = results;
        }
        catch (err) {
          console.warn('[Bingyu Weather] city suggestion failed:', err && err.message ? err.message : err);
          if (weatherSearchQuery === queryAtRequest) weatherSearchSuggestions = [];
        }
        finally {
          if (weatherSearchQuery === queryAtRequest) {
            weatherSearchLoading = false;
            updateWeatherSuggestionBox();
          }
        }
      }, WEATHER_SEARCH_DEBOUNCE_MS);
    }

    function clearWeatherSuggestions() {
      weatherSearchQuery = '';
      weatherSearchSuggestions = [];
      weatherSearchLoading = false;
      if (weatherSearchTimer) clearTimeout(weatherSearchTimer);
      updateWeatherSuggestionBox();
    }

    function performWeatherSearch(item, rawValue) {
      const value = String(rawValue || '').trim();
      if (!item || !value) return;
      item.city = value;
      item.place = value;
      item.weatherUseLocation = false;
      delete item.lat;
      delete item.lon;
      delete item.weatherCache;
      delete item.qweatherLocationId;
      clearWeatherSuggestions();
      saveDesktopState();
      fetchWeather(item, true);
    }

    function applyWeatherSuggestion(item, loc) {
      if (!item || !loc) return;
      item.city = loc.name || weatherPlaceShort(loc.place) || item.city;
      item.place = loc.place || qWeatherPlaceFromLocation(loc, item.city);
      item.lat = Number(loc.lat);
      item.lon = Number(loc.lon);
      item.qweatherLocationId = loc.id || '';
      item._lastWeatherCity = item.city;
      item.weatherUseLocation = false;
      delete item.weatherCache;
      clearWeatherSuggestions();
      saveDesktopState();
      fetchWeather(item, true);
    }

    function applyWeatherListEntry(item, entry) {
      if (!item || !entry) return;
      item.city = entry.city || weatherPlaceShort(entry.place) || entry.place || item.city;
      item.place = entry.place || entry.city || item.place;
      item.weatherUseLocation = !!entry.weatherUseLocation;
      item.lat = entry.lat;
      item.lon = entry.lon;
      item.qweatherLocationId = entry.qweatherLocationId || '';
      item._lastWeatherCity = item.weatherUseLocation ? '__qweather_location__' : item.city;
      if (entry.weatherData) {
        const data = cloneWeatherData(entry.weatherData);
        data.place = entry.place || data.place;
        item._weather = data;
        // 关键：沿用保存列表的真实更新时间，不再把旧缓存伪装成“刚刚更新”。
        item.weatherCache = { updatedAt: Number(entry.updatedAt || 0), provider: data.source || 'QWeather', data };
        item._weatherError = '';
        saveDesktopState();
        rerenderCell(item.id);
        renderWeatherDetail(item);
        if (!weatherCacheIsFresh(item)) fetchWeather(item, true, { locate: false });
        return;
      }
      delete item.weatherCache;
      saveDesktopState();
      fetchWeather(item, true, { locate: false });
    }


    function buildQWeatherData(item, nowRaw, hourlyRaw, dailyRaw, airRaw, place) {
      const now = nowRaw.now || {};
      const daily0 = (dailyRaw.daily || [])[0] || {};
      const air = normalizeQWeatherAirAqi(airRaw);
      const currentCode = Number(now.icon || daily0.iconDay || 104);
      const data = {
        source: 'QWeather',
        place: place || item.place || item.city || '天气',
        updatedAt: now.obsTime || nowRaw.updateTime || new Date().toISOString(),
        temp: Number(now.temp ?? 0),
        feels: Number(now.feelsLike ?? now.temp ?? 0),
        humidity: Number(now.humidity ?? 0),
        pressure: Number(now.pressure ?? 0),
        wind: Number(now.windSpeed ?? 0),
        windDir: (now.windDir || '').replace(/风$/g, '') || windDirection(now.wind360),
        windLevel: Number(now.windScale ?? windLevel(now.windSpeed)),
        precip: Number(now.precip ?? 0),
        code: currentCode,
        desc: now.text || weatherCodeText(currentCode),
        high: Number(daily0.tempMax ?? now.temp ?? 0),
        low: Number(daily0.tempMin ?? now.temp ?? 0),
        sunrise: daily0.sunrise || '',
        sunset: daily0.sunset || '',
        aqi: air.aqi,
        aqiDisplay: air.aqiDisplay,
        airCategory: air.category,
        airLevel: air.level,
        airPrimary: air.primary,
        airPrimaryValue: air.primaryValue,
        airPrimaryUnit: air.primaryUnit,
        airIndexCode: air.indexCode,
        airPubTime: air.pubTime,
        airHealthAdvice: air.healthAdvice,
        pm25: air.pm25,
        pm25Unit: air.pm25Unit || 'μg/m³',
        pm10: air.pm10,
        pm10Unit: air.pm10Unit || 'μg/m³'
      };
      data.ico = weatherIcon(data.code);
      data.hourly = (hourlyRaw.hourly || []).slice(0, 24).map(h => ({
        time: h.fxTime,
        temp: Number(h.temp ?? data.temp),
        pop: Number(h.pop ?? 0),
        code: Number(h.icon ?? data.code),
        desc: h.text || weatherCodeText(h.icon)
      }));
      data.daily = (dailyRaw.daily || []).slice(0, 7).map((d) => ({
        time: d.fxDate,
        high: Number(d.tempMax ?? data.high),
        low: Number(d.tempMin ?? data.low),
        pop: Number(d.precip ?? 0),
        code: Number(d.iconDay ?? d.iconNight ?? data.code),
        desc: d.textDay || d.textNight || weatherCodeText(d.iconDay)
      }));
      return data;
    }

    async function fetchQWeatherData(item, options = {}) {
      const cfg = getQWeatherConfig();
      if (!qWeatherHasCredential()) {
        throw new Error('请先配置和风天气 API Key：在 public/legacy-newtab.js 填 QWEATHER_API_KEY，或控制台 localStorage.setItem(\"QWEATHER_API_KEY\", \"你的Key\")');
      }

      const query = (item.city || '北京').trim();
      let lat = item.lat;
      let lon = item.lon;
      let place = item.place || query;
      let locationId = item.qweatherLocationId || '';
      let locationParam = locationId || query;

      if (options.locate) {
        const pos = await getBrowserPosition();
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        const loc = await qWeatherLookupLocation(qWeatherLocationQueryFromLatLon(lat, lon), '当前位置');
        locationId = loc.id;
        place = loc.place;
        item.lat = loc.lat || lat;
        item.lon = loc.lon || lon;
        item.place = place;
        item.city = weatherPlaceShort(place) || item.city || '当前位置';
        item.qweatherLocationId = locationId;
        item._lastWeatherCity = '__qweather_location__';
        item.weatherUseLocation = true;
        locationParam = locationId;
      } else if (!locationId) {
        const loc = await qWeatherLookupLocation(query, query);
        locationId = loc.id;
        lat = loc.lat;
        lon = loc.lon;
        place = loc.place;
        item.lat = lat;
        item.lon = lon;
        item.place = place;
        item.qweatherLocationId = locationId;
        item._lastWeatherCity = query;
        item.weatherUseLocation = false;
        locationParam = locationId;
      } else {
        // 已经由搜索候选/保存列表拿到了精确 locationId，就不要再用文本二次搜索。
        // 否则“澧县”这类区县会被 Geo API 按上级城市口径重新匹配成“常德”。
        locationParam = locationId;
      }

      const airLat = Number(lat || item.lat);
      const airLon = Number(lon || item.lon);
      const hasAirLatLon = Number.isFinite(airLat) && Number.isFinite(airLon);
      const airPath = hasAirLatLon
        ? `/airquality/v1/current/${airLat.toFixed(2)}/${airLon.toFixed(2)}`
        : '';

      const [nowRaw, hourlyRaw, dailyRaw, airRaw] = await Promise.all([
        qWeatherFetch(cfg.weatherHost, '/v7/weather/now', { location: locationParam, lang: 'zh', unit: 'm' }),
        qWeatherFetch(cfg.weatherHost, '/v7/weather/24h', { location: locationParam, lang: 'zh', unit: 'm' }),
        qWeatherFetch(cfg.weatherHost, '/v7/weather/7d', { location: locationParam, lang: 'zh', unit: 'm' }),
        airPath
          ? qWeatherFetch(cfg.airHost, airPath, { lang: 'zh' }).then((res) => {
              try { console.debug('[Bingyu Weather] QWeather airquality raw:', res); } catch (_) { /* noop */ }
              return res;
            }).catch((err) => {
              console.warn('[Bingyu Weather] QWeather airquality v1 failed:', err && err.message ? err.message : err);
              return null;
            })
          : null
      ]);

      return buildQWeatherData(item, nowRaw, hourlyRaw, dailyRaw, airRaw, place);
    }

    function getBrowserPosition() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('当前浏览器不支持定位'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 9000,
          maximumAge: 15 * 60 * 1000
        });
      });
    }

    async function reverseGeocodeName(lat, lon) {
      try {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=zh`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('reverse geocode failed');
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || '';
        const district = data.locality && data.locality !== city ? data.locality : '';
        const admin = data.principalSubdivision && data.principalSubdivision !== city ? data.principalSubdivision : '';
        const label = normalizeWeatherPlaceParts([admin, city, district].filter(Boolean).join(' · ')).join(' · ');
        return label || data.locality || data.principalSubdivision || '当前位置';
      } catch {
        return '当前位置';
      }
    }

    async function fetchWeather(item, force = false, options = {}) {
      if (!item) return;
      const wantLocate = !!options.locate;
      if (item._weatherLoading && !force) return;
      if (!force && !wantLocate && weatherCacheIsFresh(item)) {
        item._weather = item.weatherCache.data;
        rerenderCell(item.id);
        if (weatherDetailItemId === item.id) renderWeatherDetail(item);
        return;
      }
      item._weatherLoading = true;
      item._weatherError = '';
      rerenderCell(item.id);
      if (weatherDetailItemId === item.id) renderWeatherDetail(item);

      try {
        let data;
        if (WEATHER_PROVIDER === 'qweather') {
          data = await fetchQWeatherData(item, { locate: wantLocate });
        } else {
          data = null;
        }

        // 兜底：如果你临时没有配置和风天气 Key，可把 WEATHER_PROVIDER 改成 'open-meteo'。
        if (!data) {
          const query = (item.city || 'Beijing').trim();
          let lat = item.lat;
          let lon = item.lon;
          let place = item.place || query;
          let usedLocation = false;
          let locateFailed = '';

          if (wantLocate) {
            try {
              const pos = await getBrowserPosition();
              lat = pos.coords.latitude;
              lon = pos.coords.longitude;
              place = await reverseGeocodeName(lat, lon);
              item.lat = lat;
              item.lon = lon;
              item.place = place;
              item.city = weatherPlaceShort(place) || item.city || '当前位置';
              item._lastWeatherCity = '__location__';
              item.weatherUseLocation = true;
              usedLocation = true;
            } catch (geoErr) {
              locateFailed = geoErr && geoErr.message ? geoErr.message : '定位被拒绝';
              item.weatherUseLocation = false;
            }
          }

          if (!usedLocation && (force || !lat || !lon || item._lastWeatherCity !== query)) {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=zh&format=json`;
            const geoRes = await fetch(geoUrl);
            if (!geoRes.ok) throw new Error('城市查询失败');
            const geo = await geoRes.json();
            const hit = geo.results && geo.results[0];
            if (!hit) throw new Error(locateFailed ? `定位失败，且没有找到默认城市：${query}` : '没有找到这个城市');
            lat = hit.latitude;
            lon = hit.longitude;
            place = normalizeWeatherPlaceParts([hit.admin1, hit.name, hit.admin2].filter(Boolean).join(' · ')).join(' · ') || query;
            item.lat = lat;
            item.lon = lon;
            item.place = place;
            item._lastWeatherCity = query;
            if (!item.city) item.city = query;
          }

          const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,precipitation,pressure_msl,surface_pressure&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=7&wind_speed_unit=kmh`;
          const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=us_aqi,european_aqi,pm10,pm2_5&timezone=auto`;
          const [raw, airRaw] = await Promise.all([
            fetch(forecastUrl).then(res => { if (!res.ok) throw new Error('天气请求失败'); return res.json(); }),
            fetch(airUrl).then(res => res.ok ? res.json() : null).catch(() => null)
          ]);
          data = buildWeatherData(item, raw, airRaw);
          data.source = 'Open-Meteo';
          data.place = place;
          item._weatherError = locateFailed && usedLocation === false ? `已使用默认城市天气；定位：${locateFailed}` : '';
        }

        item._weather = data;
        item.weatherCache = { updatedAt: Date.now(), provider: data.source || currentWeatherProviderLabel(), data };
        updateWeatherListEntryIfExists(item, data);
        item._weatherError = '';
        saveDesktopState();
        rerenderCell(item.id);
        if (weatherDetailItemId === item.id) renderWeatherDetail(item);
      } catch (e) {
        item._weatherError = e.message || '网络不可用，稍后再试';
        rerenderCell(item.id);
        if (weatherDetailItemId === item.id) renderWeatherDetail(item);
      } finally {
        item._weatherLoading = false;
      }
    }
    function renderWeatherTrendSvg(hours) {
      if (!hours || !hours.length) return '';
      const temps = hours.map(h => Number(h.temp));
      const min = Math.min(...temps);
      const max = Math.max(...temps);
      const span = Math.max(1, max - min);
      const step = 78;
      const leftPad = 39;
      const width = Math.max(180, leftPad * 2 + (hours.length - 1) * step);
      const pointsData = hours.map((h, i) => {
        const x = leftPad + i * step;
        const y = 78 - ((Number(h.temp) - min) / span) * 44;
        return { x, y, temp: Math.round(Number(h.temp || 0)) };
      });
      const points = pointsData.map(p => `${p.x},${p.y}`).join(' ');
      const labels = pointsData.map(p => `<text x="${p.x}" y="${p.y - 14}" text-anchor="middle">${p.temp}°</text>`).join('');
      const dots = pointsData.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3.4"/>`).join('');
      return `<svg class="dt-weather-trend-svg" viewBox="0 0 ${width} 104" preserveAspectRatio="none">${labels}<polyline points="${points}"/>${dots}</svg>`;
    }

    function renderWeatherDetail(item) {
      const box = document.getElementById('dtWeatherDetail');
      if (!box || !item) return;
      const w = item._weather;
      const displayPlace = weatherPlaceTitle((w && w.place) || item.place || item.city || '天气');
      const shortQueryPlace = weatherPlaceShort(displayPlace || item.city || '天气');
      const queryValue = weatherSearchQuery || '';
      const topQuery = `<div class="dt-weather-query-wrap"><div class="dt-weather-query"><input type="text" data-weather-city-input placeholder="搜索城市、区县" value="${escapeHtml(queryValue)}" autocomplete="off"><button type="button" data-weather-locate title="定位当前位置">⌖</button><button type="button" data-weather-sidebar-toggle title="天气列表">☰</button></div><div class="dt-weather-search-popover" data-weather-suggestions>${renderWeatherSuggestionBox()}</div></div>`;
      document.getElementById('dtWeatherHead').textContent = '天气';
      if (!w) {
        box.innerHTML = `<div class="dt-weather-detail-shell ${weatherSidebarOpen ? 'sidebar-open' : ''}">
          <div class="dt-weather-main">
            <div class="dt-weather-detail-top">
              <div class="dt-weather-publish"><b>${escapeHtml(displayPlace || item.city || '本地天气')}</b><span>${escapeHtml(item._weatherError || '点击“定位”后加载当前位置天气。')}</span></div>
              ${topQuery}
            </div>
            <div class="dt-weather-loading-card">
              <div>${weatherIconMarkup(0)}</div>
              <strong>${item._weatherLoading ? '正在加载天气…' : '点击定位加载本地天气'}</strong>
              <p>${escapeHtml(item._weatherError || '浏览器会请求位置权限。允许后会自动更新城市、温度、空气质量、24 小时与 7 天预报。')}</p>
              <button class="dt-mini-btn" type="button" data-weather-locate>使用当前位置</button>
            </div>
          </div>
          ${renderWeatherSidebar(item, w)}
        </div>`;
        return;
      }
      const aqi = weatherAqiText(w.aqi);
      const hours = w.hourly || [];
      const trend = renderWeatherTrendSvg(hours);
      const hourly = hours.map(h => `<div class="dt-hour-cell">
          <div class="dt-hour-time">${escapeHtml(formatShortTime(h.time))}</div>
          <div class="dt-hour-ico">${weatherIconMarkup(h.code)}</div>
        </div>`).join('');
      const daily = (w.daily || []).map((d, i) => {
        const date = parseDateOnly(d.time);
        const dayName = i === 0 ? '今天' : (date ? `周${'日一二三四五六'[date.getDay()]}` : '未来');
        const dayDate = date ? `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '--';
        return `<div class="dt-day-forecast-card ${i === 0 ? 'today' : ''}">
          <div class="dt-day-name">${escapeHtml(dayName)}</div>
          <div class="dt-day-date">${escapeHtml(dayDate)}</div>
          <div class="dt-day-ico">${weatherIconMarkup(d.code)}</div>
          <div class="dt-day-desc">${escapeHtml(weatherCodeText(d.code))}</div>
          <div class="dt-day-range"><b>${Math.round(d.high)}°</b><span>${Math.round(d.low)}°</span></div>
        </div>`;
      }).join('');
      box.innerHTML = `<div class="dt-weather-detail-shell ${weatherSidebarOpen ? 'sidebar-open' : ''}">
        <div class="dt-weather-main">
          <div class="dt-weather-detail-top">
            <div class="dt-weather-publish"><b>${escapeHtml(displayPlace)} ${escapeHtml(w.desc)}</b><span>发布于:${escapeHtml(formatWeatherPublish(w.updatedAt))}</span></div>
            ${topQuery}
          </div>
          <section class="dt-weather-hero2">
            <div class="dt-weather-now">
              <div class="dt-weather-bigtemp">${Math.round(w.temp)}°</div>
              <div class="dt-weather-now-meta">
                <div class="dt-weather-aqi"><span class="leaf">⌁</span> AQI ${escapeHtml(w.airCategory || aqi.text)}/${escapeHtml(w.aqiDisplay || aqi.value)}</div>
                <div class="dt-weather-cond">${weatherIconMarkup(w.code)}<span>${escapeHtml(w.desc)}</span><span>${escapeHtml(w.windDir)}风</span><span>${Math.round(w.windLevel)}级</span></div>
              </div>
            </div>
            <p class="dt-weather-advice">${escapeHtml(weatherLifeAdvice(w))}</p>
            <div class="dt-weather-metrics">
              <span><b>温度</b>${Math.round(w.low)}°~${Math.round(w.high)}°</span>
              <span><b>湿度</b>${Math.round(w.humidity)}%</span>
              <span><b>气压</b>${Math.round(w.pressure || 0)}hPa</span>
              <span><b>PM2.5</b>${Number(w.pm25 || 0).toFixed(0)} ${escapeHtml(w.pm25Unit || 'μg/m³')}</span>
              <span><b>PM10</b>${Number(w.pm10 || 0).toFixed(0)} ${escapeHtml(w.pm10Unit || 'μg/m³')}</span>
              <span><b>首污</b>${escapeHtml(w.airPrimary || '--')}</span>
              <span><b>降水</b>${Number(w.precip).toFixed(0)}mm</span>
              <span><b>日出</b>${escapeHtml(formatShortTime(w.sunrise))}</span>
              <span><b>日落</b>${escapeHtml(formatShortTime(w.sunset))}</span>
            </div>
          </section>
          <section class="dt-weather-block">
            <div class="dt-weather-section-title">24小时天气预报</div>
            <div class="dt-weather-hourly-strip" data-weather-hourly-strip><div class="dt-weather-hourly-inner" style="--hour-count:${hours.length}">${hourly}${trend}</div></div>
          </section>
          <section class="dt-weather-block">
            <div class="dt-weather-section-title">7日天气预报</div>
            <div class="dt-weather-daily-grid">${daily}</div>
          </section>
        </div>
        ${renderWeatherSidebar(item, w)}
      </div>`;
      initWeatherDetailInteractions(box);
    }


    function initWeatherDetailInteractions(root) {
      const strip = root && root.querySelector ? root.querySelector('[data-weather-hourly-strip]') : null;
      if (!strip || strip.dataset.enhanced === '1') return;
      strip.dataset.enhanced = '1';
      strip.addEventListener('wheel', (e) => {
        if (strip.scrollWidth <= strip.clientWidth + 2) return;
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (!delta) return;
        e.preventDefault();
        strip.scrollLeft += delta;
      }, { passive: false });
      let dragging = false;
      let startX = 0;
      let startScrollLeft = 0;
      strip.addEventListener('pointerdown', (e) => {
        if (strip.scrollWidth <= strip.clientWidth + 2) return;
        dragging = true;
        startX = e.clientX;
        startScrollLeft = strip.scrollLeft;
        strip.classList.add('is-grabbing');
        if (strip.setPointerCapture) {
          try { strip.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
        }
      });
      const stopDrag = (e) => {
        dragging = false;
        strip.classList.remove('is-grabbing');
        if (e && strip.releasePointerCapture) {
          try { strip.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }
        }
      };
      strip.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        e.preventDefault();
        strip.scrollLeft = startScrollLeft - (e.clientX - startX);
      });
      strip.addEventListener('pointerup', stopDrag);
      strip.addEventListener('pointercancel', stopDrag);
      strip.addEventListener('pointerleave', () => {
        if (!dragging) strip.classList.remove('is-grabbing');
      });
    }

    function openWeatherDetail(id) {
      const item = getDesktopItemById(id);
      if (!item) return;
      weatherDetailItemId = id;
      weatherSidebarOpen = false;
      clearWeatherSuggestions();
      document.getElementById('dtWeatherOverlay').classList.add('show');
      renderWeatherDetail(item);
      const forceProviderRefresh = !weatherCacheIsFresh(item);
      fetchWeather(item, forceProviderRefresh, { locate: false });
    }

    function closeWeatherDetail() {
      document.getElementById('dtWeatherOverlay').classList.remove('show');
      weatherDetailItemId = null;
      weatherSidebarOpen = false;
      clearWeatherSuggestions();
    }

    // ---------- 时间驱动 ----------
    function greetingText(h) {
      if (h < 5) return '夜深了，早点休息';
      if (h < 11) return '早安，愿你今天温柔且自由';
      if (h < 14) return '午安，记得好好吃饭';
      if (h < 18) return '下午好，喝杯茶歇一歇';
      if (h < 23) return '晚上好，今天辛苦啦';
      return '夜深了，早点休息';
    }

    function tickDesktopClocks() {
      const now = new Date();
      const time = now.toTimeString().slice(0, 5);
      const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 周${'日一二三四五六'[now.getDay()]}`;
      document.querySelectorAll('#desktopGrid [data-clock="time"]').forEach(el => el.textContent = time);
      document.querySelectorAll('#desktopGrid [data-clock="date"]').forEach(el => el.textContent = dateStr);
      document.querySelectorAll('#desktopGrid [data-count]').forEach(el => {
        el.textContent = Math.abs(getCountdownDays(el.dataset.count));
      });
    }

    function tickDesktop() {
      const now = new Date();
      const gt = document.getElementById('dtGreetTime');
      if (gt) gt.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const gx = document.getElementById('dtGreetText');
      if (gx) gx.textContent = greetingText(now.getHours());
      if (!desktopMode) return;
      desktopItems.forEach(item => {
        if (item.type !== 'widget' || item.widget !== 'pomodoro') return;
        const st = getPomo(item);
        if (!st.running) return;
        const el = document.querySelector(`[data-pomo="${item.id}"]`);
        if (el) el.textContent = fmtPomo(st.remaining);
        const bar = document.querySelector(`.dt-cell[data-id="${item.id}"] .dt-progress span`);
        if (bar) {
          const total = (item.minutes || 25) * 60;
          bar.style.setProperty('--p', pct(total ? (1 - st.remaining / total) * 100 : 0));
        }
        if (st.remaining <= 0) completePomo(item);
      });
      tickDesktopClocks();
    }

    // ---------- 模式开关 ----------
    function applyDesktopMode() {
      document.body.classList.toggle('desktop-mode-active', desktopMode);
      const btn = document.getElementById('desktopModeBtn');
      if (btn) btn.classList.toggle('active', desktopMode);
      const layer = document.getElementById('desktopModeLayer');
      if (layer) layer.setAttribute('aria-hidden', desktopMode ? 'false' : 'true');
      if (desktopMode) {
        updateDesktopLayerMetrics();
        tickDesktop();
        refreshDesktopWidgets();
        setTimeout(updateDesktopLayerMetrics, 80);
      }
    }

    function toggleDesktopMode(force) {
      desktopMode = typeof force === 'boolean' ? force : !desktopMode;
      saveDesktopState();
      applyDesktopMode();
      ['desktopContextMenu', 'desktopItemMenu'].forEach(id => document.getElementById(id).classList.remove('show'));
      if (desktopMode) {
        const ws = document.getElementById('workspaceOverlay');
        if (ws) ws.classList.remove('show');
      }
      showToast(desktopMode ? '已进入桌面模式' : '已返回起始页');
    }

    // ---------- 打开 ----------
    function openDesktopUrl(url, forceNewTab = false) {
      const normalized = normalizeDesktopUrl(url);
      if (!normalized) return;
      window.open(normalized, forceNewTab || settings.newTab ? '_blank' : '_self');
    }

    function openDesktopItem(item) {
      if (!item) return;
      if (item.type === 'folder') openDesktopFolder(item);
      else if (item.type === 'site') openDesktopUrl(item.url);
    }

    function openDesktopFolder(item) {
      desktopFolderOpenId = item.id;
      document.getElementById('dtFolderName').value = item.title || '文件夹';
      renderFolderPopGrid(item);
      document.getElementById('dtFolderOverlay').classList.add('show');
    }

    function renderFolderPopGrid(item) {
      const grid = document.getElementById('dtFolderGrid');
      const kids = item.children || [];
      if (!kids.length) {
        grid.innerHTML = `<div class="dt-folder-empty2">文件夹是空的<br>点击下方按钮添加网址</div>`;
        return;
      }
      grid.innerHTML = kids.map(k => `<div class="dt-cell is-icon dt-folder-child" data-id="${k.id}" data-type="${k.type || 'site'}" draggable="true" style="cursor:pointer">
          ${dtCellTools(k)}
          ${renderSiteTile(k)}
          <div class="dt-label">${escapeHtml(k.title || '未命名')}</div>
        </div>`).join('');
    }

    // ---------- 右键菜单定位 ----------
    function showDesktopContextMenu(menu, x, y) {
      if (!menu) return;
      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
      menu.classList.add('show');
      const rect = menu.getBoundingClientRect();
      if (rect.right > window.innerWidth) menu.style.left = `${Math.max(12, window.innerWidth - rect.width - 12)}px`;
      if (rect.bottom > window.innerHeight) menu.style.top = `${Math.max(12, window.innerHeight - rect.height - 12)}px`;
    }

    function openDesktopItemInNewTab(item) {
      if (!item) return;
      if (item.type === 'folder') {
        openDesktopFolder(item);
        return;
      }
      if (item.type === 'site') openDesktopUrl(item.url, true);
    }

    function setDesktopFolderLayout(id, layout) {
      const item = getDesktopItemById(id);
      if (!item || item.type !== 'folder') return;
      const cfg = getDesktopFolderLayoutConfig(layout);
      applyDesktopFolderLayout(item, cfg.key);
      saveDesktopState();
      renderDesktopGrid();
      if (desktopFolderOpenId === id) renderFolderPopGrid(item);
      showToast(`已切换为 ${cfg.name} 文件夹布局`);
    }

    function configureDesktopItemMenu(item, inFolder = false) {
      const menu = document.getElementById('desktopItemMenu');
      if (!menu || !item) return;
      const addChild = menu.querySelector('[data-action="add-child"]');
      const moveRoot = menu.querySelector('[data-action="move-root"]');
      const openLabel = menu.querySelector('.dt-menu-open-label');
      const layoutPanels = menu.querySelectorAll('[data-folder-layout-panel]');
      if (addChild) addChild.style.display = (item.type === 'folder') ? 'flex' : 'none';
      if (moveRoot) moveRoot.style.display = (inFolder && item.type === 'site') ? 'flex' : 'none';
      if (openLabel) openLabel.textContent = item.type === 'folder' ? '打开文件夹' : '在新标签页打开';
      layoutPanels.forEach(el => { el.style.display = (item.type === 'folder') ? 'block' : 'none'; });
      menu.querySelectorAll('[data-folder-layout]').forEach(btn => {
        btn.classList.toggle('active', item.type === 'folder' && btn.dataset.folderLayout === getDesktopFolderLayoutConfig(item.layout).key);
      });
    }

    function updateDesktopLayerMetrics() {
      const layer = document.getElementById('desktopModeLayer');
      const search = document.querySelector('.search-section');
      if (!layer || !search) return;
      const rect = search.getBoundingClientRect();
      const naturalTop = Math.ceil(rect.bottom + 34);
      const minHeight = window.innerWidth <= 900 ? 300 : 360;
      const maxTop = Math.max(220, window.innerHeight - minHeight - 34);
      const top = Math.min(Math.max(naturalTop, 230), maxTop);
      layer.style.setProperty('--desktop-layer-top', `${top}px`);
    }

    function prepareDesktopP0Ui() {
      const ctx = document.getElementById('desktopContextMenu');
      const item = document.getElementById('desktopItemMenu');
      if (ctx) {
        ctx.innerHTML = `
          <div class="desktop-menu-section">添加</div>
          <div class="desktop-menu-item" data-action="add"><span class="dt-mi">＋</span><span>添加组件</span></div>
          <div class="desktop-menu-item" data-action="add-site"><span class="dt-mi">↗</span><span>添加网址</span></div>
          <div class="desktop-menu-item" data-action="add-folder"><span class="dt-mi">□</span><span>新建文件夹</span></div>
          <div class="desktop-menu-divider"></div>
          <div class="desktop-menu-section">整理</div>
          <div class="desktop-menu-item" data-action="import"><span class="dt-mi">↓</span><span>导入常用站点</span></div>
          <div class="desktop-menu-item" data-action="tidy"><span class="dt-mi">⌘</span><span>自动整理桌面</span></div>
          <div class="desktop-menu-item" data-action="wallpaper"><span class="dt-mi">◐</span><span>更换壁纸</span></div>
          <div class="desktop-menu-item" data-action="reset"><span class="dt-mi">↺</span><span>恢复默认桌面</span></div>
          <div class="desktop-menu-divider"></div>
          <div class="desktop-menu-item danger" data-action="exit"><span class="dt-mi">⤺</span><span>退出桌面模式</span></div>`;
      }
      if (item) {
        item.innerHTML = `
          <div class="desktop-menu-layout" data-folder-layout-panel>
            <div class="desktop-menu-layout-title"><span class="dt-mi">▦</span><span>布局</span></div>
            <div class="dt-layout-options">
              <button class="dt-layout-pill" data-folder-layout="1x1">1x1</button>
              <button class="dt-layout-pill" data-folder-layout="1x2">1x2</button>
              <button class="dt-layout-pill" data-folder-layout="2x1">2x1</button>
              <button class="dt-layout-pill" data-folder-layout="2x2">2x2</button>
              <button class="dt-layout-pill" data-folder-layout="2x4">2x4</button>
            </div>
          </div>
          <div class="desktop-menu-divider" data-folder-layout-panel></div>
          <div class="desktop-menu-item" data-action="open"><span class="dt-mi">↗</span><span class="dt-menu-open-label">在新标签页打开</span></div>
          <div class="desktop-menu-item" data-action="edit"><span class="dt-mi">✎</span><span>编辑</span></div>
          <div class="desktop-menu-item" data-action="add-child"><span class="dt-mi">＋</span><span>添加网址到此文件夹</span></div>
          <div class="desktop-menu-item" data-action="move-root"><span class="dt-mi">✥</span><span>移动到桌面</span></div>
          <div class="desktop-menu-divider"></div>
          <div class="desktop-menu-item danger" data-action="delete"><span class="dt-mi">×</span><span>删除</span></div>`;
      }

      const setText = (selector, text) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
      };
      const setAttr = (id, attr, value) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute(attr, value);
      };

      setText('#dtAddOverlay .dt-panel-head h3', '添加到桌面');
      setText('#dtAddOverlay .dt-tab[data-tab="widget"]', '组件');
      setText('#dtAddOverlay .dt-tab[data-tab="site"]', '网址');
      setText('#dtAddOverlay .dt-tab[data-tab="folder"]', '文件夹');
      setText('label[for="dtSiteName"]', '名称');
      setText('label[for="dtSiteUrl"]', '网址');
      setText('label[for="dtSiteIcon"]', '图标（可选）');
      setText('label[for="dtFolderInput"]', '文件夹名称');
      setText('label[for="dtFolderIcon"]', '图标（可选）');
      setText('#dtSiteAdd', '添加网址');
      setText('#dtFolderAddBtn', '创建文件夹');
      setText('#dtEditCancel', '取消');
      setText('#dtEditSave', '保存');
      setText('#dtFolderAdd', '＋ 添加网址到此文件夹');
      setAttr('dtSiteName', 'placeholder', '例如 GitHub');
      setAttr('dtSiteUrl', 'placeholder', 'github.com');
      setAttr('dtSiteIcon', 'placeholder', '留空自动获取，或填 emoji / 图片地址');
      setAttr('dtFolderInput', 'placeholder', '例如 科研工具');
      setAttr('dtFolderIcon', 'placeholder', '例如 📚');
      setAttr('dtAddBtn', 'title', '添加到桌面');
      setAttr('dtWallBtn', 'title', '更换壁纸');
      setAttr('dtExitBtn', 'title', '退出桌面模式');
    }

    function focusDesktopAddInput(tab) {
      const id = tab === 'site' ? 'dtSiteUrl' : tab === 'folder' ? 'dtFolderInput' : null;
      if (!id) return;
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.focus();
      }, 80);
    }

    function markDesktopInputError(id, message) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('is-invalid');
        el.focus();
        setTimeout(() => el.classList.remove('is-invalid'), 1400);
      }
      showToast(message, 'error');
    }

    function desktopTitleFromUrl(url) {
      try {
        const u = new URL(normalizeDesktopUrl(url));
        return u.hostname.replace(/^www\./, '').split('.')[0] || u.hostname;
      } catch (e) {
        return '';
      }
    }

    function isDesktopUrlValid(url) {
      const normalized = normalizeDesktopUrl(url);
      if (/^(#|\.\/|\/)/.test(normalized)) return true;
      try { new URL(normalized); return true; } catch (e) { return false; }
    }

    function desktopTargetList(parentId = desktopAddParentId) {
      if (!parentId) return desktopItems;
      const p = getDesktopItemById(parentId);
      if (!p || p.type !== 'folder') return desktopItems;
      p.children = p.children || [];
      return p.children;
    }

    function desktopUrlExists(url, list = desktopItems) {
      const normalized = normalizeDesktopUrl(url);
      for (const it of list) {
        if (it.type === 'site' && normalizeDesktopUrl(it.url) === normalized) return true;
        if (it.children && desktopUrlExists(normalized, it.children)) return true;
      }
      return false;
    }

    function resetDesktopToDefault(confirmFirst = true) {
      if (confirmFirst && !confirm('确定要恢复默认桌面吗？当前桌面布局会被替换。')) return;
      desktopItems = getDefaultDesktopItems();
      saveDesktopState();
      renderDesktopGrid();
      updateDesktopLayerMetrics();
      showToast('已恢复默认桌面');
    }

    // ---------- 添加面板 ----------
    function openDesktopAdd(tab = 'widget', parentId = null) {
      desktopAddParentId = parentId;
      const overlay = document.getElementById('dtAddOverlay');
      const head = overlay?.querySelector('.dt-panel-head h3');
      clearAddForms();
      buildWidgetGallery();
      if (parentId) {
        const folder = getDesktopItemById(parentId);
        overlay.classList.add('folder-child-mode');
        if (head) head.textContent = `添加网址到「${folder?.title || '文件夹'}」`;
      } else {
        overlay.classList.remove('folder-child-mode');
        if (head) head.textContent = '添加到桌面';
      }
      setDesktopAddTab(parentId ? 'site' : tab);
      overlay.classList.add('show');
      focusDesktopAddInput(parentId ? 'site' : tab);
    }

    function closeDesktopAdd() {
      const overlay = document.getElementById('dtAddOverlay');
      overlay.classList.remove('show', 'folder-child-mode');
      const head = overlay.querySelector('.dt-panel-head h3');
      if (head) head.textContent = '添加到桌面';
      desktopAddParentId = null;
      document.querySelectorAll('#dtAddOverlay .is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }

    function setDesktopAddTab(tab) {
      document.querySelectorAll('#dtAddOverlay .dt-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
      document.querySelectorAll('#dtAddOverlay .dt-pane').forEach(p => { p.hidden = p.dataset.pane !== tab; });
      focusDesktopAddInput(tab);
    }

    function buildWidgetGallery() {
      const g = document.getElementById('dtGallery');
      g.innerHTML = Object.entries(DESKTOP_WIDGETS).map(([key, w]) => `
        <button class="dt-gcard" data-widget="${key}" title="${w.w} x ${w.h}">
          <span class="dt-gcard-ico">${w.icon}</span>
          <span class="dt-gcard-meta"><span class="dt-gcard-name">${w.name}</span><span class="dt-gcard-desc">${w.desc}</span></span>
        </button>`).join('');
    }

    function clearAddForms() {
      ['dtSiteName', 'dtSiteUrl', 'dtSiteIcon', 'dtFolderInput', 'dtFolderIcon'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }

    function addDesktopWidget(key) {
      const def = DESKTOP_WIDGETS[key];
      if (!def) return;
      const item = { id: dtId(key), type: 'widget', widget: key, title: def.name, w: def.w, h: def.h };
      if (key === 'countdown') { item.targetDate = defaultCountdownDate(); item.createdAt = todayKey(); item.title = '倒数日'; }
      if (key === 'todo') item.todos = [];
      if (key === 'note') item.title = '便签';
      if (key === 'pomodoro') { item.minutes = 25; item.focusTask = ''; }
      if (key === 'weather') item.city = 'Beijing';
      desktopItems.push(item);
      saveDesktopState();
      renderDesktopGrid();
      closeDesktopAdd();
      showToast(`已添加「${def.name}」`);
      if (key === 'countdown' || key === 'weather') openDesktopEdit(item.id);
    }

    function addDesktopSiteFromForm() {
      const rawName = (document.getElementById('dtSiteName').value || '').trim();
      const url = (document.getElementById('dtSiteUrl').value || '').trim();
      const icon = (document.getElementById('dtSiteIcon').value || '').trim();
      if (!url) { markDesktopInputError('dtSiteUrl', '请先填写网址'); return; }
      const normalizedUrl = normalizeDesktopUrl(url);
      if (!isDesktopUrlValid(normalizedUrl)) { markDesktopInputError('dtSiteUrl', '网址格式不太对'); return; }
      const parentId = desktopAddParentId;
      const targetList = desktopTargetList(parentId);
      if (desktopUrlExists(normalizedUrl, targetList)) { markDesktopInputError('dtSiteUrl', parentId ? '这个网址已经在当前文件夹里了' : '这个网址已经在桌面里了'); return; }
      const name = rawName || desktopTitleFromUrl(normalizedUrl);
      if (!name) { markDesktopInputError('dtSiteName', '请填写名称'); return; }
      const item = { id: dtId('site'), type: 'site', title: name, url: normalizedUrl, icon };
      targetList.push(item);
      saveDesktopState();
      renderDesktopGrid();
      const folderOverlay = document.getElementById('dtFolderOverlay');
      if (folderOverlay.classList.contains('show') && desktopFolderOpenId) {
        const p = getDesktopItemById(desktopFolderOpenId);
        if (p) renderFolderPopGrid(p);
      }
      closeDesktopAdd();
      clearAddForms();
      showToast(`已添加「${name}」`);
    }

    function addDesktopFolderFromForm() {
      const name = (document.getElementById('dtFolderInput').value || '').trim();
      const icon = (document.getElementById('dtFolderIcon').value || '').trim();
      if (!name) { markDesktopInputError('dtFolderInput', '请填写文件夹名称'); return; }
      const exists = desktopItems.some(i => i.type === 'folder' && i.title === name);
      if (exists) { markDesktopInputError('dtFolderInput', '已经有同名文件夹了'); return; }
      desktopItems.push({ id: dtId('folder'), type: 'folder', title: name, icon: icon || '📁', children: [] });
      saveDesktopState();
      renderDesktopGrid();
      closeDesktopAdd();
      clearAddForms();
      showToast(`已创建「${name}」`);
    }

    // ---------- 编辑弹窗 ----------
    function dtShowRow(id, show) {
      const el = document.getElementById(id);
      if (el) el.style.display = show ? 'grid' : 'none';
    }

    function openDesktopEdit(id) {
      const item = getDesktopItemById(id);
      if (!item) return;
      if (item.type === 'widget' && item.widget === 'note') {
        openNotesFromDesktop();
        return;
      }
      desktopEditId = id;
      document.getElementById('dtEditHead').textContent = '编辑 · ' + (item.title || '项目');
      document.getElementById('dtEditTitle').value = item.title || '';
      const isWidget = item.type === 'widget';
      const isWeather = isWidget && item.widget === 'weather';
      const isCountdown = isWidget && item.widget === 'countdown';
      const isNote = isWidget && item.widget === 'note';

      dtShowRow('dtEditTitleRow', true);
      dtShowRow('dtEditUrlRow', item.type === 'site' || isWeather);
      dtShowRow('dtEditDateRow', isCountdown);
      dtShowRow('dtEditQuickDateRow', isCountdown);
      dtShowRow('dtEditTextRow', isNote);
      dtShowRow('dtEditIconRow', item.type === 'site' || item.type === 'folder');

      document.querySelector('#dtEditUrlRow label').textContent = isWeather ? '城市（支持 Beijing / 北京）' : '网址';
      document.getElementById('dtEditUrl').value = isWeather ? (item.city || '') : (item.url || '');
      document.getElementById('dtEditDate').value = item.targetDate || '';
      document.getElementById('dtEditText').value = item.text || '';
      document.getElementById('dtEditIcon').value = cleanIcon(item.icon);
      updateCountdownPreview();

      document.getElementById('dtEditOverlay').classList.add('show');
    }

    function closeDesktopEdit() {
      document.getElementById('dtEditOverlay').classList.remove('show');
      desktopEditId = null;
    }

    function setCountdownDateOffset(days) {
      const d = new Date();
      d.setDate(d.getDate() + Number(days || 0));
      document.getElementById('dtEditDate').value = toDateInputValue(d);
      updateCountdownPreview();
    }

    function updateCountdownPreview() {
      const preview = document.getElementById('dtCountdownPreview');
      if (!preview) return;
      const value = document.getElementById('dtEditDate')?.value || '';
      if (!value) {
        preview.textContent = '选择日期后显示剩余天数';
        return;
      }
      const days = getCountdownDays(value);
      const label = days === 0 ? '就是今天' : (days > 0 ? `还有 ${days} 天` : `已经过去 ${Math.abs(days)} 天`);
      preview.textContent = `${formatShortDate(value)} · ${label}`;
    }

    function saveDesktopEdit() {
      const item = getDesktopItemById(desktopEditId);
      if (!item) return;
      const title = (document.getElementById('dtEditTitle').value || '').trim();
      if (!title) { markDesktopInputError('dtEditTitle', '名称不能为空'); return; }
      item.title = title;
      if (item.type === 'site') {
        const rawUrl = (document.getElementById('dtEditUrl').value || '').trim();
        if (!rawUrl) { markDesktopInputError('dtEditUrl', '网址不能为空'); return; }
        const normalizedUrl = normalizeDesktopUrl(rawUrl);
        if (!isDesktopUrlValid(normalizedUrl)) { markDesktopInputError('dtEditUrl', '网址格式不太对'); return; }
        item.url = normalizedUrl;
        item.icon = (document.getElementById('dtEditIcon').value || '').trim();
      }
      if (item.type === 'folder') {
        item.icon = (document.getElementById('dtEditIcon').value || '').trim() || '📁';
      }
      if (item.type === 'widget') {
        if (item.widget === 'countdown') {
          const targetDate = document.getElementById('dtEditDate').value;
          if (!targetDate) { markDesktopInputError('dtEditDate', '请设置目标日期'); return; }
          item.targetDate = targetDate;
          item.createdAt = item.createdAt || todayKey();
        }
        if (item.widget === 'note') {
          // 桌面便签已经改为同步主便签数据，不再单独保存 item.text。
        }
        if (item.widget === 'weather') {
          const city = (document.getElementById('dtEditUrl').value || '').trim() || 'Beijing';
          if (city !== item.city) {
            delete item.lat;
            delete item.lon;
            delete item.place;
            delete item.weatherCache;
          }
          item.city = city;
          item._weather = null;
          item._weatherError = '';
        }
      }
      saveDesktopState();
      renderDesktopGrid();
      if (desktopFolderOpenId) {
        const folder = getDesktopItemById(desktopFolderOpenId);
        if (folder) renderFolderPopGrid(folder);
      }
      closeDesktopEdit();
      showToast('已保存');
      if (item.type === 'widget' && item.widget === 'weather') fetchWeather(item, true);
    }

    // ---------- 项目操作 ----------
    function deleteDesktopItem(id) {
      removeDesktopItemById(id);
      saveDesktopState();
      renderDesktopGrid();
      if (desktopFolderOpenId) {
        const folder = getDesktopItemById(desktopFolderOpenId);
        if (folder) renderFolderPopGrid(folder);
      }
    }

    function importSitesToDesktop() {
      const cands = (typeof sites !== 'undefined' ? sites : [])
        .filter(s => s.url && !s.url.startsWith('#'))
        .slice(0, 10)
        .map(s => ({ id: dtId('site'), type: 'site', title: s.name, url: s.url, icon: cleanIcon(s.icon) }));
      if (!cands.length) { showToast('没有可导入的站点', 'error'); return; }
      desktopItems.push(...cands);
      saveDesktopState();
      renderDesktopGrid();
      showToast(`已导入 ${cands.length} 个站点`);
    }

    function tidyDesktop() {
      const order = { widget: 0, folder: 1, site: 2 };
      desktopItems.sort((a, b) => (order[a.type] ?? 3) - (order[b.type] ?? 3));
      saveDesktopState();
      renderDesktopGrid();
      showToast('已整理桌面');
    }

    function getDesktopDropAnchorFromPoint(clientX, clientY) {
      const grid = document.getElementById('desktopGrid');
      if (!grid) return null;
      const cells = Array.from(grid.querySelectorAll('.dt-cell[data-id]')).filter(el => el.dataset.id !== desktopDragId);
      if (!cells.length) return null;
      const gridRect = grid.getBoundingClientRect();
      const style = getComputedStyle(grid);
      const cellSize = parseFloat(style.getPropertyValue('--dt-cell')) || 94;
      const gap = parseFloat(style.columnGap || style.gap) || 18;
      const pitch = Math.max(1, cellSize + gap);
      const cols = Math.max(1, Math.round((gridRect.width + gap) / pitch));
      const dropCol = Math.max(0, Math.floor((clientX - gridRect.left) / pitch));
      const dropRow = Math.max(0, Math.floor((clientY - gridRect.top) / pitch));
      const dropOrder = dropRow * cols + dropCol;
      let best = null;
      for (const el of cells) {
        const r = el.getBoundingClientRect();
        const col = Math.max(0, Math.floor((r.left - gridRect.left + cellSize * 0.45) / pitch));
        const row = Math.max(0, Math.floor((r.top - gridRect.top + cellSize * 0.45) / pitch));
        const order = row * cols + col;
        if (order >= dropOrder && (!best || order < best.order)) best = { id: el.dataset.id, after: false, order };
      }
      return best;
    }

    // ---------- 拖拽排序 ----------
    function dtReorder(dragId, targetId, after) {
      if (!dragId || dragId === targetId) return;
      const from = desktopItems.findIndex(i => i.id === dragId);
      if (from < 0) return;
      const [moved] = desktopItems.splice(from, 1);
      let to = desktopItems.findIndex(i => i.id === targetId);
      if (to < 0) { desktopItems.push(moved); }
      else { if (after) to++; desktopItems.splice(to, 0, moved); }
      saveDesktopState();
      renderDesktopGrid();
      updateDesktopLayerMetrics();
    }

    function dtReorderFolderChild(dragId, targetId, after) {
      const folder = getDesktopItemById(desktopFolderOpenId);
      if (!folder || folder.type !== 'folder' || !Array.isArray(folder.children) || !dragId || dragId === targetId) return;
      const from = folder.children.findIndex(i => i.id === dragId);
      if (from < 0) return;
      const [moved] = folder.children.splice(from, 1);
      let to = folder.children.findIndex(i => i.id === targetId);
      if (to < 0) folder.children.push(moved);
      else {
        if (after) to++;
        folder.children.splice(to, 0, moved);
      }
      saveDesktopState();
      renderFolderPopGrid(folder);
      renderDesktopGrid();
    }

    // ---------- 小组件交互 ----------
    function togglePomo(id) {
      const item = getDesktopItemById(id);
      if (!item) return;
      const st = getPomo(item);
      const total = (item.minutes || 25) * 60;
      if (st.running) {
        st.running = false;
        delete st.startedAt;
        delete st.remainingAtStart;
      } else {
        if (st.remaining <= 0) st.remaining = total;
        st.running = true;
        st.startedAt = Date.now();
        st.remainingAtStart = st.remaining;
      }
      item.pomo = st;
      saveDesktopState();
      rerenderCell(id);
    }

    function resetPomo(id) {
      const item = getDesktopItemById(id);
      if (!item) return;
      const task = (item.pomo && item.pomo.task) || item.focusTask || '';
      item.pomo = { remaining: (item.minutes || 25) * 60, running: false, sessionsToday: (item.pomo && item.pomo.sessionsToday) || 0, lastDate: todayKey(), task };
      desktopTimers[id] = item.pomo;
      saveDesktopState();
      rerenderCell(id);
    }

    function completePomo(item) {
      const total = (item.minutes || 25) * 60;
      const st = getPomo(item);
      st.running = false;
      st.remaining = total;
      st.remainingAtStart = total;
      st.sessionsToday = (st.sessionsToday || 0) + 1;
      delete st.startedAt;
      item.pomo = st;
      saveDesktopState();
      rerenderCell(item.id);
      showToast('专注完成，休息一下 ☕');
    }

    function savePomoTask(id, text) {
      const item = getDesktopItemById(id);
      if (!item) return;
      const st = getPomo(item);
      st.task = text;
      item.focusTask = text;
      item.pomo = st;
      saveDesktopState();
    }

    function focusTodo(id, i) {
      const item = getDesktopItemById(id);
      if (!item || !item.todos || !item.todos[i]) return;
      const target = desktopItems.find(it => it.type === 'widget' && it.widget === 'pomodoro');
      if (!target) { showToast('先添加一个专注钟组件', 'error'); return; }
      savePomoTask(target.id, item.todos[i].text);
      rerenderCell(target.id);
      showToast('已设为当前专注任务');
    }

    function toggleTodo(id, i) {
      const item = getDesktopItemById(id);
      if (!item || !item.todos || !item.todos[i]) return;
      item.todos[i].done = !item.todos[i].done;
      saveDesktopState();
      rerenderCell(id);
    }

    function delTodo(id, i) {
      const item = getDesktopItemById(id);
      if (!item || !item.todos) return;
      item.todos.splice(i, 1);
      saveDesktopState();
      rerenderCell(id);
    }

    function addTodo(id, text) {
      const item = getDesktopItemById(id);
      if (!item || !text.trim()) return;
      item.todos = item.todos || [];
      item.todos.push({ text: text.trim(), done: false, createdAt: Date.now() });
      saveDesktopState();
      rerenderCell(id);
      const inp = document.querySelector(`.dt-cell[data-id="${id}"] [data-todo-add]`);
      if (inp) inp.focus();
    }

    function saveNote(id, text) {
      const item = getDesktopItemById(id);
      if (!item) return;
      item.text = text;
      item.updatedAt = Date.now();
      saveDesktopState();
      const status = document.querySelector(`.dt-cell[data-id="${id}"] [data-note-status]`);
      if (status) status.textContent = '刚刚保存';
      const count = document.querySelector(`.dt-cell[data-id="${id}"] .dt-note-foot span:first-child`);
      if (count) count.textContent = `${text.length} 字`;
    }

    function desktopSearch(q) {
      if (!q.trim()) return;
      const active = document.querySelector('.engine-option.active');
      const base = (active && active.dataset.url) ? active.dataset.url : 'https://www.baidu.com/s?wd=';
      window.open(base + encodeURIComponent(q), settings.newTab ? '_blank' : '_self');
    }

    function refreshQuote(el) {
      const wrap = el.closest('.dt-quote');
      if (!wrap) return;
      const q = wrap.querySelector('[data-quote]');
      if (q) q.textContent = pickQuote();
    }

    // ==================== 事件绑定 ====================
    function bindEvents() {
      // 搜索
      document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doSearch();
      });
      document.getElementById('searchSubmitBtn').addEventListener('click', doSearch);
      
      // 搜索引擎切换
      document.getElementById('engineBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('engineDropdown').classList.toggle('show');
        document.getElementById('searchHistory').classList.remove('show');
      });
      
      document.querySelectorAll('.engine-option[data-engine]').forEach(opt => {
        opt.addEventListener('click', () => setEngine(opt.dataset.engine));
      });
      
      // 搜索历史
      document.getElementById('searchInput').addEventListener('focus', showSearchHistory);
      document.getElementById('searchHistory').addEventListener('click', (e) => {
        const item = e.target.closest('.search-history-item');
        if (item) {
          document.getElementById('searchInput').value = item.dataset.query;
          document.getElementById('searchHistory').classList.remove('show');
        }
      });

      // 清除搜索历史
      document.getElementById('searchHistory').addEventListener('click', (e) => {
        const clearBtn = e.target.closest('.search-history-clear');
        if (clearBtn) {
          e.stopPropagation();
          searchHistoryData = [];
          saveData('searchHistoryData', searchHistoryData);
          document.getElementById('searchHistory').classList.remove('show');
          showToast('搜索历史已清除');
        }
      });



      
      // Alt + 数字切换搜索引擎
      document.addEventListener('keydown', (e) => {
        if (e.altKey) {
          const engines = ['baidu', 'bing', 'google', 'yandex'];
          const num = parseInt(e.key);
          if (num >= 1 && num <= 4) {
            e.preventDefault();
            setEngine(engines[num - 1]);
          }
        }
        
        if (e.key === 'Tab' && document.activeElement === document.getElementById('searchInput')) {
          if (settings.tabBehavior === 'engine') {
            e.preventDefault();
            const engines = ['baidu', 'bing', 'google', 'yandex'];
            const currentIndex = engines.indexOf(currentEngine);
            const nextIndex = e.shiftKey 
              ? (currentIndex - 1 + engines.length) % engines.length 
              : (currentIndex + 1) % engines.length;
            setEngine(engines[nextIndex]);
          }
        }
      });
      
      
      // 点击外部关闭下拉菜单和右键菜单
      document.addEventListener('click', (e) => {
        // 如果点击的是搜索框内部，不关闭搜索历史
        if (!e.target.closest('.search-container')) {
          document.getElementById('searchHistory').classList.remove('show');
        }
        document.getElementById('engineDropdown').classList.remove('show');
        document.getElementById('contextMenu').classList.remove('show');
        document.getElementById('workspaceContextMenu').classList.remove('show');
        if (!e.target.closest('.desktop-context-menu')) {
          document.getElementById('desktopContextMenu').classList.remove('show');
          document.getElementById('desktopItemMenu').classList.remove('show');
        }
      });
      // 右键打开工作区
      document.addEventListener('contextmenu', (e) => {
        if (desktopMode) return;

        const target = e.target;
        
        const isExcluded = target.closest('.workspace-overlay') || 
                          target.closest('.settings-panel') || 
                          target.closest('.notes-modal') ||
                          target.closest('.hitokoto-section') ||
                          target.closest('.dock-bar') ||
                          target.closest('.search-section') ||
                          target.closest('.add-site-modal') ||
                          target.closest('.hitokoto-modal') ||
                          target.closest('.add-folder-modal') ||
                          target.closest('.pinned-notes') ||
                          target.closest('.desktop-mode-layer') ||
                          target.closest('.desktop-context-menu') ||
                          target.closest('.dt-overlay') ||
                          target.closest('.top-right-buttons');
        
        if (!isExcluded) {
          e.preventDefault();
          document.getElementById('workspaceOverlay').classList.add('show');
        }
      });

      // Dock 栏右键菜单
      document.getElementById('dockBar').addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const dockItem = e.target.closest('.dock-item');
        contextMenuTarget = dockItem;
        
        const contextMenu = document.getElementById('contextMenu');
        // contextMenu.style.left = e.clientX + 'px';
        // contextMenu.style.top = e.clientY + 'px';
        // contextMenu.classList.add('show');
        contextMenu.style.left = e.clientX + 'px';
        contextMenu.classList.add('show');
        // 检查菜单是否超出屏幕底部，如果超出则向上显示
        const menuHeight = contextMenu.offsetHeight;
        const windowHeight = window.innerHeight;
        if (e.clientY + menuHeight > windowHeight) {
          contextMenu.style.top = (e.clientY - menuHeight) + 'px';
        } else {
          contextMenu.style.top = e.clientY + 'px';
        }
      });

      // 右键菜单操作
      document.getElementById('contextMenu').addEventListener('click', (e) => {
        const action = e.target.closest('.context-menu-item')?.dataset.action;
        
        if (action === 'add') {
          document.getElementById('addSiteModal').classList.add('show');
          document.getElementById('addSiteModal').dataset.target = 'dock';
        } else if (action === 'delete' && contextMenuTarget) {
          const index = parseInt(contextMenuTarget.dataset.index);
          if (!isNaN(index)) {
            const item = dockItems[index];
            // 保护"应用"按钮不可删除
            if (item && item.action === 'apps') {
              showToast('"应用"按钮无法删除', 'error');
            } else {
              dockItems.splice(index, 1);
              saveData('dockItems', dockItems);
              renderDockBar();
              showToast('应用已删除');
            }
          }
        }
        
        document.getElementById('contextMenu').classList.remove('show');
        contextMenuTarget = null;
      });
      
      // ESC 关闭
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.getElementById('workspaceOverlay').classList.remove('show');
          document.getElementById('settingsPanel').classList.remove('show');
          document.getElementById('settingsOverlay').classList.remove('show');
          document.getElementById('notesModal').classList.remove('show');
          document.getElementById('addSiteModal').classList.remove('show');
          document.getElementById('editSiteModal').classList.remove('show');
          document.getElementById('hitokotoModal').classList.remove('show');
          document.getElementById('addFolderModal').classList.remove('show');
          document.getElementById('contextMenu').classList.remove('show');
          document.getElementById('workspaceContextMenu').classList.remove('show');
          document.getElementById('desktopContextMenu').classList.remove('show');
          document.getElementById('desktopItemMenu').classList.remove('show');
          document.getElementById('dtAddOverlay').classList.remove('show');
          document.getElementById('dtEditOverlay').classList.remove('show');
          document.getElementById('dtFolderOverlay').classList.remove('show');
          document.getElementById('dtWeatherOverlay').classList.remove('show');
          desktopEditId = null;
          desktopFolderOpenId = null;
          weatherDetailItemId = null;
          isNotesFullscreen = false;
          document.getElementById('notesModal').classList.remove('fullscreen');
        }
      });
      
      // 点击工作区空白关闭
      document.getElementById('workspaceOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('workspaceOverlay')) {
          document.getElementById('workspaceOverlay').classList.remove('show');
        }
      });
      
      // 工作区项目点击
      document.getElementById('workspaceGrid').addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.workspace-item-delete');
        if (deleteBtn) {
          e.preventDefault();
          e.stopPropagation();
          const index = parseInt(deleteBtn.dataset.index);
          if (!isNaN(index)) {
            sites.splice(index, 1);
            saveData('sites', sites);
            renderWorkspaceGrid();
          }
          return;
        }
        
        const item = e.target.closest('.workspace-item');
        if (!item) return;
        
        if (item.dataset.action === 'notes') {
          document.getElementById('workspaceOverlay').classList.remove('show');
          document.getElementById('notesModal').classList.add('show');
        } else if (item.dataset.action === 'theme') {
          settings.darkMode = settings.darkMode === 'on' ? 'off' : 'on';
          saveData('settings', settings);
          applyDarkMode();  // 🔧 添加这一行
          showToast(settings.darkMode === 'on' ? '已切换到深色模式' : '已切换到浅色模式');
        } else if (item.id === 'addSiteBtn') {
          document.getElementById('addSiteModal').classList.add('show');
          document.getElementById('addSiteModal').dataset.target = 'workspace';
        }
      });

      // workspace应用右键菜单
      document.getElementById('workspaceGrid').addEventListener('contextmenu', (e) => {
        const item = e.target.closest('.workspace-item');
        // 排除添加按钮
        if (!item || item.id === 'addSiteBtn') return;
        
        e.preventDefault();
        e.stopPropagation();
        
        workspaceContextMenuTarget = item;
        
        const contextMenu = document.getElementById('workspaceContextMenu');
        contextMenu.style.left = e.clientX + 'px';
        
        // 检查菜单是否超出屏幕底部，如果超出则向上显示
        contextMenu.classList.add('show');
        const menuHeight = contextMenu.offsetHeight;
        const windowHeight = window.innerHeight;
        if (e.clientY + menuHeight > windowHeight) {
          contextMenu.style.top = (e.clientY - menuHeight) + 'px';
        } else {
          contextMenu.style.top = e.clientY + 'px';
        }
      });

      // workspace右键菜单操作
      document.getElementById('workspaceContextMenu').addEventListener('click', (e) => {
        const action = e.target.closest('.context-menu-item')?.dataset.action;
        
        if (!workspaceContextMenuTarget) return;
        
        const index = parseInt(workspaceContextMenuTarget.dataset.index);
        
        if (action === 'edit' && !isNaN(index)) {
          // 编辑应用
          const site = sites[index];
          if (site && !site.isSpecial) {
            editingSiteIndex = index;
            document.getElementById('editSiteNameInput').value = site.name || '';
            document.getElementById('editSiteUrlInput').value = site.url || '';
            document.getElementById('editSiteIconInput').value = site.icon || '';
            document.getElementById('editSiteModal').classList.add('show');
          } else if (site && site.isSpecial) {
            showToast('系统应用无法编辑', 'error');
          }
        } else if (action === 'addToDock' && !isNaN(index)) {
          // 添加到便捷栏
          const site = sites[index];
          if (site) {
            // 检查是否已存在
            const exists = dockItems.some(item => 
              (item.url && item.url === site.url) || 
              (item.action && site.url === '#' + item.action)
            );
            
            if (exists) {
              showToast('该应用已在便捷栏中', 'error');
            } else {
              const newDockItem = {
                name: site.name,
                icon: site.icon,
                color: `linear-gradient(135deg, ${site.color}, ${site.color})`
              };
              
              if (site.url === '#notes') {
                newDockItem.action = 'notes';
              } else if (site.url === '#theme') {
                newDockItem.action = 'theme';
              } else {
                newDockItem.url = site.url;
              }
              
              dockItems.push(newDockItem);
              saveData('dockItems', dockItems);
              renderDockBar();
              showToast('已添加到便捷栏');
            }
          }
        } else if (action === 'delete' && !isNaN(index)) {
          // 删除应用
          const site = sites[index];
          if (site && site.isSpecial) {
            showToast('系统应用无法删除', 'error');
          } else {
            sites.splice(index, 1);
            saveData('sites', sites);
            renderWorkspaceGrid();
            showToast('应用已删除');
          }
        }
        
        document.getElementById('workspaceContextMenu').classList.remove('show');
        workspaceContextMenuTarget = null;
      });

      // Dock 栏点击
      document.getElementById('dockBar').addEventListener('click', (e) => {
        const item = e.target.closest('.dock-item');
        if (!item) return;
        
        const action = item.dataset.action;
        if (action === 'apps') {
          document.getElementById('workspaceOverlay').classList.add('show');
        } else if (action === 'notes') {
          document.getElementById('notesModal').classList.add('show');
        } else if (action === 'theme') {
          settings.darkMode = settings.darkMode === 'on' ? 'off' : 'on';
          saveData('settings', settings);
          applyDarkMode();  // 🔧 添加这一行，立即深色应用
          showToast(settings.darkMode === 'on' ? '已切换到深色模式' : '已切换到浅色模式');
        }
      });

      // 桌面模式
      const dtGrid = document.getElementById('desktopGrid');
      const dtLayer = document.getElementById('desktopModeLayer');
      const dtCtxMenu = document.getElementById('desktopContextMenu');
      const dtItemMenu = document.getElementById('desktopItemMenu');

      prepareDesktopP0Ui();
      window.addEventListener('resize', () => {
        if (desktopMode) updateDesktopLayerMetrics();
      });

      document.getElementById('desktopModeBtn').addEventListener('click', () => toggleDesktopMode());
      document.getElementById('dtExitBtn').addEventListener('click', () => toggleDesktopMode(false));
      document.getElementById('dtAddBtn').addEventListener('click', () => openDesktopAdd('widget'));
      document.getElementById('dtWallBtn').addEventListener('click', () => {
        document.getElementById('settingsPanel').classList.add('show');
        document.getElementById('settingsOverlay').classList.add('show');
        showToast('在设置面板里更换壁纸');
      });

      // 每秒驱动时钟 / 倒数日 / 专注钟 / 问候语
      setInterval(tickDesktop, 1000);

      // 空白处 / 项目 右键菜单
      dtLayer.addEventListener('contextmenu', (e) => {
        if (!desktopMode) return;
        if (e.target.closest('.dt-topbar')) return;
        e.preventDefault();
        e.stopPropagation();
        const cell = e.target.closest('.dt-cell');
        if (cell) {
          desktopContextTargetId = cell.dataset.id;
          desktopContextParentFolderId = null;
          const item = getDesktopItemById(desktopContextTargetId);
          configureDesktopItemMenu(item, false);
          dtCtxMenu.classList.remove('show');
          showDesktopContextMenu(dtItemMenu, e.clientX, e.clientY);
        } else {
          desktopContextTargetId = null;
          desktopContextParentFolderId = null;
          dtItemMenu.classList.remove('show');
          showDesktopContextMenu(dtCtxMenu, e.clientX, e.clientY);
        }
      });

      // 画布点击（图标打开 / 组件交互 / 工具按钮）
      dtGrid.addEventListener('click', (e) => {
        const emptyAction = e.target.closest('[data-empty-action]');
        if (emptyAction) {
          const action = emptyAction.dataset.emptyAction;
          if (action === 'restore') resetDesktopToDefault(false);
          else openDesktopAdd(action);
          return;
        }
        const cell = e.target.closest('.dt-cell');
        if (!cell) return;
        const id = cell.dataset.id;
        const folderQuick = e.target.closest('[data-folder-quick-id]');
        if (folderQuick) {
          e.preventDefault();
          e.stopPropagation();
          const child = getDesktopItemById(folderQuick.dataset.folderQuickId);
          if (child) openDesktopItem(child);
          return;
        }
        const toolBtn = e.target.closest('.dt-tool-btn');
        if (toolBtn) {
          if (toolBtn.dataset.act === 'edit') openDesktopEdit(id);
          else if (toolBtn.dataset.act === 'del') { if (confirm('确定删除这个项目吗？')) deleteDesktopItem(id); }
          return;
        }
        if (e.target.closest('[data-pomo-toggle]')) { togglePomo(id); return; }
        if (e.target.closest('[data-pomo-reset]')) { resetPomo(id); return; }
        if (e.target.closest('[data-quote-refresh]')) { refreshQuote(e.target.closest('[data-quote-refresh]')); return; }
        if (e.target.closest('[data-weather-refresh]')) { fetchWeather(getDesktopItemById(id), true); return; }
        if (e.target.closest('[data-weather-detail]')) { openWeatherDetail(id); return; }
        if (e.target.closest('[data-weather-edit]')) { openDesktopEdit(id); return; }
        const noteRow = e.target.closest('.dt-note-sync [data-note-id]');
        if (noteRow) { openNotesFromDesktop(noteRow.dataset.noteId); return; }
        if (e.target.closest('[data-notes-open]')) { openNotesFromDesktop(); return; }
        const weatherItem = getDesktopItemById(id);
        if (weatherItem && weatherItem.type === 'widget' && weatherItem.widget === 'weather' && !e.target.closest('.dt-weather-actions')) { openWeatherDetail(id); return; }
        const todoDel = e.target.closest('[data-todo-del]');
        if (todoDel) { e.preventDefault(); delTodo(id, parseInt(todoDel.closest('.dt-todo-item').dataset.i, 10)); return; }
        const todoFocus = e.target.closest('[data-todo-focus]');
        if (todoFocus) { e.preventDefault(); focusTodo(id, parseInt(todoFocus.closest('.dt-todo-item').dataset.i, 10)); return; }
        const todoItem = e.target.closest('.dt-todo-item');
        if (todoItem) { toggleTodo(id, parseInt(todoItem.dataset.i, 10)); return; }
        if (e.target.closest('.dt-todo-add') || e.target.closest('.dt-pomo-task') || e.target.closest('.dt-weather-actions')) return;
        if (cell.classList.contains('is-icon')) openDesktopItem(getDesktopItemById(id));
      });

      // 待办 / 搜索 回车
      dtGrid.addEventListener('keydown', (e) => {
        const cell = e.target.closest('.dt-cell');
        if (!cell) return;
        if (e.target.matches('[data-todo-add]') && e.key === 'Enter') {
          e.preventDefault();
          const v = e.target.value;
          e.target.value = '';
          addTodo(cell.dataset.id, v);
        }
        if (e.target.matches('[data-dsearch]') && e.key === 'Enter') {
          e.preventDefault();
          desktopSearch(e.target.value);
          e.target.value = '';
        }
        if (e.target.matches('[data-pomo-task]') && e.key === 'Enter') {
          e.preventDefault();
          e.target.blur();
        }
      });

      // 便签 / 专注任务实时保存
      dtGrid.addEventListener('input', (e) => {
        const cell = e.target.closest('.dt-cell');
        if (cell && e.target.matches('[data-note]')) saveNote(cell.dataset.id, e.target.value);
        if (cell && e.target.matches('[data-pomo-task]')) savePomoTask(cell.dataset.id, e.target.value);
      });

      // 拖拽排序
      dtGrid.addEventListener('dragstart', (e) => {
        const cell = e.target.closest('.dt-cell');
        if (!cell) return;
        if (e.target.closest('input, textarea, button, a, [contenteditable="true"], .dt-todo-item, .dt-folder-preview-app')) {
          e.preventDefault();
          return;
        }
        desktopDragId = cell.dataset.id;
        cell.classList.add('dragging');
        dtGrid.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.dropEffect = 'move';
        try { e.dataTransfer.setData('text/plain', desktopDragId); } catch (_) {}
      });
      dtGrid.addEventListener('dragend', () => {
        desktopDragId = null;
        dtGrid.classList.remove('is-dragging');
        dtGrid.querySelectorAll('.dragging,.drop-before,.drop-after').forEach(el => el.classList.remove('dragging', 'drop-before', 'drop-after'));
      });
      dtGrid.addEventListener('dragover', (e) => {
        if (!desktopDragId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        dtGrid.querySelectorAll('.drop-before,.drop-after').forEach(el => el.classList.remove('drop-before', 'drop-after'));
        const cell = e.target.closest('.dt-cell');
        if (cell && cell.dataset.id !== desktopDragId) {
          const r = cell.getBoundingClientRect();
          cell.classList.add(e.clientX > r.left + r.width / 2 ? 'drop-after' : 'drop-before');
        }
      });
      dtGrid.addEventListener('drop', (e) => {
        if (!desktopDragId) return;
        e.preventDefault();
        const cell = e.target.closest('.dt-cell');
        if (cell && cell.dataset.id !== desktopDragId) {
          const r = cell.getBoundingClientRect();
          dtReorder(desktopDragId, cell.dataset.id, e.clientX > r.left + r.width / 2);
        } else if (!cell) {
          const anchor = getDesktopDropAnchorFromPoint(e.clientX, e.clientY);
          if (anchor && anchor.id !== desktopDragId) dtReorder(desktopDragId, anchor.id, anchor.after);
          else dtReorder(desktopDragId, null, true);
        }
        desktopDragId = null;
        dtGrid.classList.remove('is-dragging');
        dtGrid.querySelectorAll('.dragging,.drop-before,.drop-after').forEach(el => el.classList.remove('dragging', 'drop-before', 'drop-after'));
      });

      // 空白处右键菜单动作
      dtCtxMenu.addEventListener('click', (e) => {
        const action = e.target.closest('.desktop-menu-item')?.dataset.action;
        if (!action) return;
        if (action === 'add') openDesktopAdd('widget');
        else if (action === 'add-site') openDesktopAdd('site');
        else if (action === 'add-folder') openDesktopAdd('folder');
        else if (action === 'import') importSitesToDesktop();
        else if (action === 'tidy') tidyDesktop();
        else if (action === 'wallpaper') {
          document.getElementById('settingsPanel').classList.add('show');
          document.getElementById('settingsOverlay').classList.add('show');
          showToast('在设置面板里更换壁纸');
        } else if (action === 'reset') {
          resetDesktopToDefault(true);
        } else if (action === 'exit') toggleDesktopMode(false);
        dtCtxMenu.classList.remove('show');
      });

      // 项目右键菜单动作
      dtItemMenu.addEventListener('click', (e) => {
        const item = getDesktopItemById(desktopContextTargetId);
        if (!item) return;
        const layoutBtn = e.target.closest('[data-folder-layout]');
        if (layoutBtn) {
          if (item.type === 'folder') setDesktopFolderLayout(item.id, layoutBtn.dataset.folderLayout);
          desktopContextTargetId = null;
          desktopContextParentFolderId = null;
          dtItemMenu.classList.remove('show');
          return;
        }
        const action = e.target.closest('.desktop-menu-item')?.dataset.action;
        if (!action) return;
        if (action === 'open') openDesktopItemInNewTab(item);
        else if (action === 'edit') openDesktopEdit(item.id);
        else if (action === 'add-child') {
          if (item.type === 'folder') openDesktopAdd('site', item.id);
          else showToast('只有文件夹可以添加子项目', 'error');
        } else if (action === 'move-root') {
          moveDesktopItemToRoot(item.id);
        } else if (action === 'delete') {
          deleteDesktopItem(item.id);
          showToast('已删除');
        }
        desktopContextTargetId = null;
        desktopContextParentFolderId = null;
        dtItemMenu.classList.remove('show');
      });

      // 添加面板
      document.querySelectorAll('#dtAddOverlay .dt-tab').forEach(tab => {
        tab.addEventListener('click', () => setDesktopAddTab(tab.dataset.tab));
      });
      document.getElementById('dtGallery').addEventListener('click', (e) => {
        const card = e.target.closest('[data-widget]');
        if (card) addDesktopWidget(card.dataset.widget);
      });
      document.getElementById('dtSiteAdd').addEventListener('click', addDesktopSiteFromForm);
      document.getElementById('dtSiteUrl').addEventListener('keydown', (e) => { if (e.key === 'Enter') addDesktopSiteFromForm(); });
      document.getElementById('dtFolderAddBtn').addEventListener('click', addDesktopFolderFromForm);
      document.getElementById('dtFolderInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') addDesktopFolderFromForm(); });
      document.getElementById('dtAddClose').addEventListener('click', closeDesktopAdd);
      document.getElementById('dtAddOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('dtAddOverlay')) closeDesktopAdd();
      });

      // 编辑弹窗
      document.getElementById('dtEditSave').addEventListener('click', saveDesktopEdit);
      document.getElementById('dtEditCancel').addEventListener('click', closeDesktopEdit);
      document.getElementById('dtEditClose').addEventListener('click', closeDesktopEdit);
      document.getElementById('dtEditOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('dtEditOverlay')) closeDesktopEdit();
      });
      document.getElementById('dtEditDate').addEventListener('input', updateCountdownPreview);
      document.querySelectorAll('#dtEditQuickDateRow [data-date-offset]').forEach(btn => {
        btn.addEventListener('click', () => setCountdownDateOffset(btn.dataset.dateOffset));
      });

      // 文件夹弹窗
      const dtFolderGridEl = document.getElementById('dtFolderGrid');
      dtFolderGridEl.addEventListener('click', (e) => {
        if (folderChildSuppressClick) {
          folderChildSuppressClick = false;
          return;
        }
        const cell = e.target.closest('.dt-cell');
        if (!cell) return;
        const edit = e.target.closest('.dt-tool-btn.edit');
        if (edit) {
          openDesktopEdit(cell.dataset.id);
          return;
        }
        const del = e.target.closest('.dt-tool-btn.del');
        if (del) {
          deleteDesktopItem(cell.dataset.id);
          return;
        }
        openDesktopItem(getDesktopItemById(cell.dataset.id));
      });
      dtFolderGridEl.addEventListener('contextmenu', (e) => {
        const cell = e.target.closest('.dt-folder-child');
        if (!cell) return;
        e.preventDefault();
        e.stopPropagation();
        desktopContextTargetId = cell.dataset.id;
        desktopContextParentFolderId = desktopFolderOpenId;
        const item = getDesktopItemById(desktopContextTargetId);
        configureDesktopItemMenu(item, true);
        dtCtxMenu.classList.remove('show');
        showDesktopContextMenu(dtItemMenu, e.clientX, e.clientY);
      });
      dtFolderGridEl.addEventListener('dragstart', (e) => {
        const cell = e.target.closest('.dt-cell');
        if (!cell || e.target.closest('button')) return;
        folderChildDragId = cell.dataset.id;
        cell.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.dropEffect = 'move';
        try { e.dataTransfer.setData('text/plain', folderChildDragId); } catch (_) {}
        e.stopPropagation();
      });
      dtFolderGridEl.addEventListener('dragend', () => {
        folderChildDragId = null;
        dtFolderGridEl.querySelectorAll('.dragging,.drop-before,.drop-after').forEach(el => el.classList.remove('dragging', 'drop-before', 'drop-after'));
      });
      dtFolderGridEl.addEventListener('dragover', (e) => {
        if (!folderChildDragId) return;
        e.preventDefault();
        e.stopPropagation();
        dtFolderGridEl.querySelectorAll('.drop-before,.drop-after').forEach(el => el.classList.remove('drop-before', 'drop-after'));
        const cell = e.target.closest('.dt-cell');
        if (cell && cell.dataset.id !== folderChildDragId) {
          const r = cell.getBoundingClientRect();
          cell.classList.add(e.clientX > r.left + r.width / 2 ? 'drop-after' : 'drop-before');
        }
      });
      dtFolderGridEl.addEventListener('drop', (e) => {
        if (!folderChildDragId) return;
        e.preventDefault();
        e.stopPropagation();
        const cell = e.target.closest('.dt-cell');
        if (cell && cell.dataset.id !== folderChildDragId) {
          const r = cell.getBoundingClientRect();
          dtReorderFolderChild(folderChildDragId, cell.dataset.id, e.clientX > r.left + r.width / 2);
          folderChildSuppressClick = true;
        }
        folderChildDragId = null;
        dtFolderGridEl.querySelectorAll('.dragging,.drop-before,.drop-after').forEach(el => el.classList.remove('dragging', 'drop-before', 'drop-after'));
      });
      document.getElementById('dtFolderName').addEventListener('input', (e) => {
        const p = getDesktopItemById(desktopFolderOpenId);
        if (p) { p.title = e.target.value; saveData('desktopItems', desktopItems); renderDesktopGrid(); }
      });
      document.getElementById('dtFolderAdd').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!desktopFolderOpenId) return;
        openDesktopAdd('site', desktopFolderOpenId);
      });
      document.getElementById('dtFolderOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('dtFolderOverlay')) {
          document.getElementById('dtFolderOverlay').classList.remove('show');
          dtItemMenu.classList.remove('show');
          desktopFolderOpenId = null;
          desktopContextParentFolderId = null;
        }
      });

      // 天气详情弹窗
      document.getElementById('dtWeatherClose').addEventListener('click', closeWeatherDetail);
      document.getElementById('dtWeatherOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('dtWeatherOverlay')) closeWeatherDetail();
        if (e.target.closest('[data-weather-refresh]') && weatherDetailItemId) {
          fetchWeather(getDesktopItemById(weatherDetailItemId), true);
        }
        if (e.target.closest('[data-weather-locate]') && weatherDetailItemId) {
          fetchWeather(getDesktopItemById(weatherDetailItemId), true, { locate: true });
        }
        if (e.target.closest('[data-weather-sidebar-toggle]') && weatherDetailItemId) {
          weatherSidebarOpen = !weatherSidebarOpen;
          const shell = document.querySelector('#dtWeatherDetail .dt-weather-detail-shell');
          const side = document.querySelector('#dtWeatherDetail .dt-weather-sidepanel');
          if (shell) shell.classList.toggle('sidebar-open', weatherSidebarOpen);
          if (side) side.classList.toggle('show', weatherSidebarOpen);
        }
        if (e.target.closest('[data-weather-sidebar-close]') && weatherDetailItemId) {
          weatherSidebarOpen = false;
          const shell = document.querySelector('#dtWeatherDetail .dt-weather-detail-shell');
          const side = document.querySelector('#dtWeatherDetail .dt-weather-sidepanel');
          if (shell) shell.classList.remove('sidebar-open');
          if (side) side.classList.remove('show');
        }
        if (e.target.closest('[data-weather-save-current]') && weatherDetailItemId) {
          const item = getDesktopItemById(weatherDetailItemId);
          if (item && item._weather) {
            saveWeatherListEntry(item, item._weather);
            renderWeatherDetail(item);
          }
        }
        const suggestion = e.target.closest('[data-weather-suggestion-index]');
        if (suggestion && weatherDetailItemId) {
          const item = getDesktopItemById(weatherDetailItemId);
          applyWeatherSuggestion(item, weatherSearchSuggestions[Number(suggestion.dataset.weatherSuggestionIndex)]);
        }
        const card = e.target.closest('[data-weather-entry-index]');
        if (card && weatherDetailItemId) {
          const item = getDesktopItemById(weatherDetailItemId);
          applyWeatherListEntry(item, weatherRenderedEntries[Number(card.dataset.weatherEntryIndex)]);
        }
      });
      document.getElementById('dtWeatherOverlay').addEventListener('keydown', (e) => {
        if (e.target.matches('[data-weather-city-input]') && e.key === 'Enter' && weatherDetailItemId) {
          e.preventDefault();
          const item = getDesktopItemById(weatherDetailItemId);
          const value = e.target.value.trim();
          if (item && value) performWeatherSearch(item, value);
        }
      });
      document.getElementById('dtWeatherOverlay').addEventListener('input', (e) => {
        if (e.target.matches('[data-weather-city-input]') && weatherDetailItemId) {
          scheduleWeatherSuggestionSearch(e.target.value);
        }
      });
      document.getElementById('dtWeatherOverlay').addEventListener('contextmenu', (e) => {
        const card = e.target.closest('[data-weather-entry-index]');
        if (!card || !weatherDetailItemId) return;
        e.preventDefault();
        const entry = weatherRenderedEntries[Number(card.dataset.weatherEntryIndex)];
        if (!entry) return;
        const label = entry.place || entry.city || '这个城市';
        const ok = window.confirm(`确定从天气列表中移除「${label}」吗？`);
        if (!ok) return;
        removeWeatherListEntry(entry);
        renderWeatherDetail(getDesktopItemById(weatherDetailItemId));
      });

      // 设置面板
      document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsPanel').classList.add('show');
        document.getElementById('settingsOverlay').classList.add('show');
      });
      
      document.getElementById('settingsClose').addEventListener('click', () => {
        document.getElementById('settingsPanel').classList.remove('show');
        document.getElementById('settingsOverlay').classList.remove('show');
      });
      
      document.getElementById('settingsOverlay').addEventListener('click', () => {
        document.getElementById('settingsPanel').classList.remove('show');
        document.getElementById('settingsOverlay').classList.remove('show');
      });
      
      document.getElementById('darkModeSelect').addEventListener('change', (e) => {
      settings.darkMode = e.target.value;
      saveData('settings', settings);
      applyDarkMode();
    });
      
      // Toggle 开关
      document.querySelectorAll('.toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
          toggle.classList.toggle('active');
          const id = toggle.id;
          if (id === 'autoClearToggle') settings.autoClear = toggle.classList.contains('active');
          if (id === 'searchHistoryToggle') settings.searchHistory = toggle.classList.contains('active');
          if (id === 'dockToggle') {
            settings.showDock = toggle.classList.contains('active');
            document.getElementById('dockBar').style.display = settings.showDock ? 'flex' : 'none';
          }
          if (id === 'newTabToggle') settings.newTab = toggle.classList.contains('active');
          if (id === 'vignetteToggle') {
            settings.vignette = toggle.classList.contains('active');
            document.getElementById('vignetteLayer').style.display = settings.vignette ? 'block' : 'none';
          }
          saveData('settings', settings);
        });
      });
      
      // 颜色选择
      document.querySelectorAll('.color-option').forEach(opt => {
        opt.addEventListener('click', () => {
          document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
          settings.themeColor = opt.dataset.color;
          document.documentElement.style.setProperty('--theme-color', settings.themeColor);
          saveData('settings', settings);
        });
      });
      
      // 壁纸选择
      document.getElementById('wallpaperGrid').addEventListener('click', (e) => {
        const item = e.target.closest('.wallpaper-item');
        if (item) setWallpaper(item.dataset.url);
      });
      
      // 上传壁纸
      document.getElementById('uploadWallpaperBtn').addEventListener('click', () => {
        document.getElementById('wallpaperFileInput').click();
      });
      
      document.getElementById('wallpaperFileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setWallpaper(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
      
      // 便签
      document.getElementById('closeNotesBtn').addEventListener('click', () => {
        document.getElementById('notesModal').classList.remove('show');
        isNotesFullscreen = false;
        document.getElementById('notesModal').classList.remove('fullscreen');
      });
      
      document.getElementById('addNoteBtn').addEventListener('click', () => addNote());
      document.getElementById('deleteNoteBtn').addEventListener('click', deleteNote);
      document.getElementById('pinNoteBtn').addEventListener('click', pinNote);
      document.getElementById('expandNoteBtn').addEventListener('click', toggleNotesFullscreen);
      
      document.getElementById('notesList').addEventListener('click', (e) => {
        // 在文件夹中新建便签
        const addNoteBtn = e.target.closest('.add-note-to-folder-btn');
        if (addNoteBtn) {
          e.stopPropagation();
          const folderId = addNoteBtn.dataset.folderId;
          addNote(folderId);
          return;
        }

        


        const deleteFolderBtn = e.target.closest('.delete-folder-btn');

        if (deleteFolderBtn) {
          e.stopPropagation();
          const folderId = deleteFolderBtn.dataset.folderId;
          
          // 添加确认弹窗
          const folder = folders.find(f => f.id === folderId);
          const folderNotes = notes.filter(n => n.folderId === folderId);
          const noteCount = folderNotes.length;
          const confirmMessage = noteCount > 0 
            ? `确定要删除目录"${folder.name}"吗？\n该目录中的 ${noteCount} 个便签将被移动到默认目录。` 
            : `确定要删除目录"${folder.name}"吗？`;
          
          if (!confirm(confirmMessage)) {
            return;
          }

          notes.forEach(note => {
            if (note.folderId === folderId) {
              note.folderId = 'default';
            }
          });
          folders = folders.filter(f => f.id !== folderId);
          saveData('folders', folders);
          saveData('notes', notes);
          renderNotes();
          return;
        }






        
        const folderHeader = e.target.closest('.notes-folder-header');
        if (folderHeader && !e.target.closest('.delete-folder-btn')) {
          const folderId = folderHeader.dataset.folderId;
          const folder = folders.find(f => f.id === folderId);
          if (folder) {
            folder.collapsed = !folder.collapsed;
            saveData('folders', folders);
            renderNotes();
          }
          return;
        }
        
        const item = e.target.closest('.notes-list-item');
        if (item) selectNote(item.dataset.id);
      });
      

      // 便签收纳切换
      document.getElementById('pinnedNotesToggle').addEventListener('click', () => {
        document.getElementById('pinnedNotesWrapper').classList.toggle('collapsed');
      });



      // 固定便签点击
      document.getElementById('pinnedNotes').addEventListener('click', (e) => {
        const note = e.target.closest('.pinned-note');
        if (note) {
          document.getElementById('notesModal').classList.add('show');
          selectNote(note.dataset.id);
        }
      });
      
      // 添加文件夹
      document.getElementById('addFolderBtn').addEventListener('click', () => {
        document.getElementById('addFolderModal').classList.add('show');
      });
      
      document.getElementById('cancelAddFolder').addEventListener('click', () => {
        document.getElementById('addFolderModal').classList.remove('show');
        document.getElementById('folderNameInput').value = '';
      });
      
      document.getElementById('confirmAddFolder').addEventListener('click', addFolder);
      
      // 一言
      document.getElementById('hitokoto').addEventListener('click', renderHitokoto);
      document.getElementById('hitokoto').addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        renderHitokotoList();
        document.getElementById('hitokotoModal').classList.add('show');
      });
      
      document.getElementById('hitokotoSettingsBtn').addEventListener('click', () => {
        renderHitokotoList();
        document.getElementById('hitokotoModal').classList.add('show');
      });
      
      document.getElementById('closeHitokotoModal').addEventListener('click', () => {
        document.getElementById('hitokotoModal').classList.remove('show');
      });
      
      document.getElementById('addHitokotoBtn').addEventListener('click', () => {
        const input = document.getElementById('newHitokotoInput');
        const text = input.value.trim();
        if (text) {
          hitokotoList.push(text);
          saveData('hitokotoList', hitokotoList);
          input.value = '';
          renderHitokotoList();
        }
      });
      
      document.getElementById('hitokotoList').addEventListener('click', (e) => {
        const btn = e.target.closest('.hitokoto-item-delete');
        if (btn) {
          const index = parseInt(btn.dataset.index);
          hitokotoList.splice(index, 1);
          saveData('hitokotoList', hitokotoList);
          renderHitokotoList();
        }
      });
      
      // 添加站点
      document.getElementById('cancelAddSite').addEventListener('click', () => {
        document.getElementById('addSiteModal').classList.remove('show');
      });
      
      document.getElementById('confirmAddSite').addEventListener('click', () => {
        const name = document.getElementById('siteNameInput').value.trim();
        const url = document.getElementById('siteUrlInput').value.trim();
        const icon = document.getElementById('siteIconInput').value.trim() || '🔗';
        const target = document.getElementById('addSiteModal').dataset.target;
        
        if (name && url) {
          const newSite = {
            id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9), // ⭐ 添加唯一ID
            name,
            url: url.startsWith('http') ? url : `https://${url}`,
            icon,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            isDefault: false  // ⭐ 标记为用户自定义
          };

          if (target === 'dock') {
            dockItems.push({
              ...newSite,
              id: 'user-dock-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9), // ⭐ Dock用不同前缀
              color: `linear-gradient(135deg, ${newSite.color}, ${newSite.color})`
            });
            saveData('dockItems', dockItems);
            renderDockBar();
          } else {
            sites.push(newSite);
            saveData('sites', sites);
            renderWorkspaceGrid();
          }
          
          document.getElementById('addSiteModal').classList.remove('show');
          document.getElementById('siteNameInput').value = '';
          document.getElementById('siteUrlInput').value = '';
          document.getElementById('siteIconInput').value = '';
        }
      });

      // 编辑站点
      document.getElementById('cancelEditSite').addEventListener('click', () => {
        document.getElementById('editSiteModal').classList.remove('show');
        editingSiteIndex = -1;
      });
      
      document.getElementById('confirmEditSite').addEventListener('click', () => {
        if (editingSiteIndex < 0 || editingSiteIndex >= sites.length) return;
        
        const name = document.getElementById('editSiteNameInput').value.trim();
        const url = document.getElementById('editSiteUrlInput').value.trim();
        const icon = document.getElementById('editSiteIconInput').value.trim() || '🔗';
        
        if (name && url) {
          sites[editingSiteIndex].name = name;
          sites[editingSiteIndex].url = url.startsWith('http') ? url : `https://${url}`;
          sites[editingSiteIndex].icon = icon;
          
          saveData('sites', sites);
          renderWorkspaceGrid();
          
          document.getElementById('editSiteModal').classList.remove('show');
          document.getElementById('editSiteNameInput').value = '';
          document.getElementById('editSiteUrlInput').value = '';
          document.getElementById('editSiteIconInput').value = '';
          editingSiteIndex = -1;
          
          showToast('应用已更新');
        }
      });

      // 数据管理按钮
      document.getElementById('exportDataBtn').addEventListener('click', exportData);
      
      document.getElementById('importDataBtn').addEventListener('click', () => {
        document.getElementById('importFileInput').click();
      });
      
      document.getElementById('importFileInput').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          importData(file);
        }
      });
      
      document.getElementById('resetDataBtn').addEventListener('click', resetAllData);

      // 关于弹窗
      document.getElementById('openAboutBtn').addEventListener('click', openAboutModal);
      document.getElementById('aboutCloseBtn').addEventListener('click', closeAboutModal);
      document.getElementById('aboutModalOverlay').addEventListener('click', closeAboutModal);
   
      // 初始化滚动效果
      setupAboutScrollEffect();

      


      // 微信群弹窗
      document.getElementById('openWechatModal').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('wechatModalOverlay').classList.add('show');
        document.getElementById('wechatModal').classList.add('show');
      });

      document.getElementById('wechatModalClose').addEventListener('click', () => {
        document.getElementById('wechatModalOverlay').classList.remove('show');
        document.getElementById('wechatModal').classList.remove('show');
      });

      document.getElementById('wechatModalOverlay').addEventListener('click', () => {
        document.getElementById('wechatModalOverlay').classList.remove('show');
        document.getElementById('wechatModal').classList.remove('show');
      });


      // 打赏支持弹窗
      document.getElementById('openSupportModal').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('supportModalOverlay').classList.add('show');
        document.getElementById('supportModal').classList.add('show');
      });

      document.getElementById('supportModalClose').addEventListener('click', () => {
        document.getElementById('supportModalOverlay').classList.remove('show');
        document.getElementById('supportModal').classList.remove('show');
      });

      document.getElementById('supportModalOverlay').addEventListener('click', () => {
        document.getElementById('supportModalOverlay').classList.remove('show');
        document.getElementById('supportModal').classList.remove('show');
      });











      // 任务删除快捷键
      document.addEventListener('keydown', (e) => {
        if ((e.key === 'Backspace' || e.key === 'Delete') && selectedTaskId) {
          // 确保不是在输入框中
          if (document.activeElement.tagName !== 'INPUT' && 
              document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            deleteSelectedTask();
          }
        }
      });

       

    }

    // 初始化
    init();
