import { useEffect, useState } from 'react';
import { Pin, Plus, Trash2, X } from 'lucide-react';
import type { NoteItem } from '../types/startpage';

interface NotesPanelProps {
  open: boolean;
  notes: NoteItem[];
  pinnedNoteIds: string[];
  onClose: () => void;
  onChangeNotes: (notes: NoteItem[]) => void;
  onChangePinned: (ids: string[]) => void;
}

function createNote(): NoteItem {
  return {
    id: `note-${Date.now()}`,
    title: '新的便签',
    content: '',
    folderId: 'default',
    updatedAt: new Date().toISOString(),
  };
}

export default function NotesPanel({
  open,
  notes,
  pinnedNoteIds,
  onClose,
  onChangeNotes,
  onChangePinned,
}: NotesPanelProps) {
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id);

  useEffect(() => {
    if (!notes.some((note) => note.id === selectedNoteId)) {
      setSelectedNoteId(notes[0]?.id);
    }
  }, [notes, selectedNoteId]);

  if (!open) return null;

  const current = notes.find((note) => note.id === selectedNoteId) ?? notes[0];
  const isPinned = current ? pinnedNoteIds.includes(current.id) : false;

  function addNote() {
    onChangeNotes([createNote(), ...notes]);
  }

  function updateCurrent(patch: Partial<NoteItem>) {
    if (!current) return;
    onChangeNotes(
      notes.map((note) =>
        note.id === current.id ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note,
      ),
    );
  }

  function deleteCurrent() {
    if (!current) return;
    const nextNotes = notes.filter((note) => note.id !== current.id);
    onChangeNotes(nextNotes.length ? nextNotes : [createNote()]);
    onChangePinned(pinnedNoteIds.filter((id) => id !== current.id));
  }

  function togglePin() {
    if (!current) return;
    onChangePinned(
      isPinned ? pinnedNoteIds.filter((id) => id !== current.id) : [...new Set([current.id, ...pinnedNoteIds])],
    );
  }

  return (
    <div className="modal-layer">
      <section className="notes-modal" aria-label="便签">
        <header className="modal-header">
          <h2>便签</h2>
          <div className="modal-actions">
            <button type="button" title="新建便签" onClick={addNote}>
              <Plus size={18} />
            </button>
            <button className={isPinned ? 'active' : ''} type="button" title="置顶" onClick={togglePin}>
              <Pin size={18} />
            </button>
            <button type="button" title="删除" onClick={deleteCurrent}>
              <Trash2 size={18} />
            </button>
            <button type="button" title="关闭" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="notes-body">
          <aside className="notes-list">
            {notes.map((note) => (
              <button
                key={note.id}
                className={note.id === current?.id ? 'note-row active' : 'note-row'}
                type="button"
                onClick={() => setSelectedNoteId(note.id)}
              >
                <span>{note.title || '未命名'}</span>
                <small>{new Date(note.updatedAt).toLocaleDateString('zh-CN')}</small>
              </button>
            ))}
          </aside>

          {current && (
            <main className="notes-editor">
              <input
                value={current.title}
                placeholder="标题"
                onChange={(event) => updateCurrent({ title: event.target.value })}
              />
              <textarea
                value={current.content}
                placeholder="写下你的想法、实验记录、论文灵感..."
                onChange={(event) => updateCurrent({ content: event.target.value })}
              />
            </main>
          )}
        </div>
      </section>
    </div>
  );
}
