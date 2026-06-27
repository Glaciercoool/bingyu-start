import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Clock3, Search, X } from 'lucide-react';
import { SEARCH_ENGINES } from '../data/defaultData';
import type { SearchEngineId } from '../types/startpage';

interface SearchBoxProps {
  currentEngine: SearchEngineId;
  history: string[];
  autoClear: boolean;
  onEngineChange: (engine: SearchEngineId) => void;
  onSearch: (query: string) => void;
  onClearHistory: () => void;
}

const engineIds = Object.keys(SEARCH_ENGINES) as SearchEngineId[];

export default function SearchBox({
  currentEngine,
  history,
  autoClear,
  onEngineChange,
  onSearch,
  onClearHistory,
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [engineOpen, setEngineOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const engine = SEARCH_ENGINES[currentEngine];
  const visibleHistory = useMemo(() => history.slice(0, 6), [history]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.altKey) return;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < engineIds.length) {
        event.preventDefault();
        onEngineChange(engineIds[index]);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEngineChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setEngineOpen(false);
        setHistoryOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function submitSearch(value = query) {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    if (autoClear) setQuery('');
    setHistoryOpen(false);
  }

  return (
    <div className="search-wrap" ref={wrapperRef}>
      <form
        className="search-box"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <button
          className="search-engine-button"
          type="button"
          title="切换搜索引擎"
          onClick={() => setEngineOpen((open) => !open)}
        >
          <img src={engine.icon} alt={engine.name} />
          <ChevronDown size={16} />
        </button>

        <input
          className="search-input"
          value={query}
          placeholder="输入搜索内容"
          autoComplete="off"
          onFocus={() => setHistoryOpen(true)}
          onChange={(event) => setQuery(event.target.value)}
        />

        {query && (
          <button className="search-clear-button" type="button" title="清空" onClick={() => setQuery('')}>
            <X size={18} />
          </button>
        )}

        <button className="search-submit-button" type="submit" title="搜索">
          <Search size={24} />
        </button>
      </form>

      {engineOpen && (
        <div className="engine-menu">
          {engineIds.map((id) => {
            const option = SEARCH_ENGINES[id];
            return (
              <button
                key={id}
                className={id === currentEngine ? 'engine-option active' : 'engine-option'}
                type="button"
                onClick={() => {
                  onEngineChange(id);
                  setEngineOpen(false);
                }}
              >
                <img src={option.icon} alt="" />
                <span>{option.name}</span>
                <kbd>{option.shortcut}</kbd>
              </button>
            );
          })}
        </div>
      )}

      {historyOpen && visibleHistory.length > 0 && (
        <div className="search-history-panel">
          {visibleHistory.map((item) => (
            <button key={item} className="search-history-row" type="button" onClick={() => submitSearch(item)}>
              <Clock3 size={16} />
              <span>{item}</span>
            </button>
          ))}
          <button className="search-history-clear" type="button" onClick={onClearHistory}>
            清空搜索历史
          </button>
        </div>
      )}
    </div>
  );
}
