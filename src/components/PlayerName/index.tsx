import { useState, useEffect, useRef } from 'react';
import { Edit2 } from '@styled-icons/feather';

import { getPlayerName, setPlayerName } from '@/lib/supabase';

import { Container, NameText, NameInput, EditIcon } from './styles';

export function PlayerName() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(getPlayerName());
  }, []);

  function handleSave() {
    const trimmed = name.trim();
    setPlayerName(trimmed);
    setName(trimmed);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setName(getPlayerName());
      setEditing(false);
    }
  }

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (editing) {
    return (
      <Container>
        <NameInput
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder='Your name'
          maxLength={20}
        />
      </Container>
    );
  }

  return (
    <Container onClick={() => setEditing(true)} title='Click to change name'>
      <NameText>{name || 'Anonymous'}</NameText>
      <EditIcon>
        <Edit2 size={14} />
      </EditIcon>
    </Container>
  );
}
