'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useListStore } from '@/stores/list-store';
import { LIST_COLORS, LIST_EMOJIS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ListCreatorProps {
  open: boolean;
  onClose: () => void;
}

export function ListCreator({ open, onClose }: ListCreatorProps) {
  const addList = useListStore((s) => s.addList);
  const [name, setName] = useState('');
  const [color, setColor] = useState(LIST_COLORS[4]);
  const [emoji, setEmoji] = useState('📁');

  const handleCreate = () => {
    if (!name.trim()) return;
    addList({ name: name.trim(), color, emoji });
    setName('');
    setColor(LIST_COLORS[4]);
    setEmoji('📁');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="New List">
      <div className="space-y-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="List name..."
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          autoFocus
        />

        <div>
          <label className="text-xs text-[var(--fg-quieter)] mb-2 block">Color</label>
          <div className="flex flex-wrap gap-2">
            {LIST_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  'h-7 w-7 rounded-full transition-transform',
                  color === c && 'ring-2 ring-offset-2 ring-[var(--accent)] ring-offset-[var(--bg-raised)] scale-110'
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--fg-quieter)] mb-2 block">Icon</label>
          <div className="flex flex-wrap gap-1.5">
            {LIST_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={cn(
                  'h-8 w-8 rounded-lg flex items-center justify-center text-lg transition-colors',
                  emoji === e ? 'bg-[var(--accent)] ring-2 ring-[var(--accent)]' : 'hover:bg-[var(--bg-quiet)]'
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleCreate} className="w-full" disabled={!name.trim()}>
          Create List
        </Button>
      </div>
    </Dialog>
  );
}
