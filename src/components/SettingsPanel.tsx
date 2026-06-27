import { Download, ImagePlus, RotateCcw, Upload, X } from 'lucide-react';
import { DEFAULT_WALLPAPERS } from '../data/defaultData';
import type { Settings } from '../types/startpage';

interface SettingsPanelProps {
  open: boolean;
  settings: Settings;
  onClose: () => void;
  onChange: (settings: Settings) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  onResetData: () => void;
}

export default function SettingsPanel({
  open,
  settings,
  onClose,
  onChange,
  onExportData,
  onImportData,
  onResetData,
}: SettingsPanelProps) {
  if (!open) return null;

  const wallpapers = [...DEFAULT_WALLPAPERS, ...settings.customWallpapers];

  function patchSettings(patch: Partial<Settings>) {
    onChange({ ...settings, ...patch });
  }

  function uploadWallpaper(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      patchSettings({
        currentWallpaper: image,
        customWallpapers: [image, ...settings.customWallpapers],
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="modal-layer">
      <section className="settings-panel" aria-label="设置">
        <header className="modal-header">
          <h2>常规设置</h2>
          <button type="button" title="关闭" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="settings-content">
          <section className="settings-section">
            <h3>搜索</h3>
            <label className="settings-row">
              <span>
                搜索后自动清空输入框
                <small>适合把起始页当作快速跳转入口</small>
              </span>
              <input
                type="checkbox"
                checked={settings.autoClear}
                onChange={(event) => patchSettings({ autoClear: event.target.checked })}
              />
            </label>
            <label className="settings-row">
              <span>
                记录搜索历史
                <small>仅保存在本机扩展存储中</small>
              </span>
              <input
                type="checkbox"
                checked={settings.searchHistory}
                onChange={(event) => patchSettings({ searchHistory: event.target.checked })}
              />
            </label>
            <label className="settings-row">
              <span>
                新标签页打开结果
                <small>关闭后会在当前页跳转</small>
              </span>
              <input
                type="checkbox"
                checked={settings.newTab}
                onChange={(event) => patchSettings({ newTab: event.target.checked })}
              />
            </label>
          </section>

          <section className="settings-section">
            <h3>外观</h3>
            <label className="settings-row">
              <span>显示底部快捷栏</span>
              <input
                type="checkbox"
                checked={settings.showDock}
                onChange={(event) => patchSettings({ showDock: event.target.checked })}
              />
            </label>
            <label className="settings-row">
              <span>暗角效果</span>
              <input
                type="checkbox"
                checked={settings.vignette}
                onChange={(event) => patchSettings({ vignette: event.target.checked })}
              />
            </label>
            <label className="settings-row color-row">
              <span>主题色</span>
              <input
                type="color"
                value={settings.themeColor}
                onChange={(event) => patchSettings({ themeColor: event.target.value })}
              />
            </label>
          </section>

          <section className="settings-section">
            <h3>壁纸</h3>
            <label className="wallpaper-upload">
              <ImagePlus size={22} />
              <span>上传本地图片</span>
              <input type="file" accept="image/*" onChange={(event) => uploadWallpaper(event.target.files?.[0])} />
            </label>
            <div className="wallpaper-grid">
              {wallpapers.map((wallpaper) => (
                <button
                  key={wallpaper}
                  className={settings.currentWallpaper === wallpaper ? 'wallpaper-option active' : 'wallpaper-option'}
                  type="button"
                  onClick={() => patchSettings({ currentWallpaper: wallpaper })}
                >
                  <img src={wallpaper} alt="" />
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>数据管理</h3>
            <div className="data-actions">
              <button type="button" onClick={onExportData}>
                <Download size={17} />
                导出数据
              </button>
              <label>
                <Upload size={17} />
                导入数据
                <input type="file" accept="application/json,.json" onChange={(event) => event.target.files?.[0] && onImportData(event.target.files[0])} />
              </label>
              <button className="danger" type="button" onClick={onResetData}>
                <RotateCcw size={17} />
                重置数据
              </button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
