import { styled } from '@linaria/react';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  white-space: nowrap;
`;

export const NameText = styled.span`
  font-size: 14px;
  color: var(--header_text);
  font-weight: 500;
`;

export const NameInput = styled.input`
  width: 100px;
  padding: 4px 8px;
  border: 1px solid var(--primary);
  border-radius: 4px;
  font-size: 14px;
  background: var(--mvpCard_bg);
  color: var(--mvpCard_text);
  outline: none;

  &:focus {
    border-color: var(--mvpCard_controls_edit);
  }
`;

export const EditIcon = styled.span`
  display: flex;
  align-items: center;
  opacity: 0.5;

  ${Container}:hover & {
    opacity: 1;
  }

  svg {
    color: var(--header_text);
  }
`;
