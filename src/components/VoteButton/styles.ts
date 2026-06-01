import { styled } from '@linaria/react';

export const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10px;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  min-width: 260px;
  padding: 6px 24px;

  border: 2px solid var(--primary);
  border-radius: 8px;

  background-color: var(--mvpCard_bg);
  color: var(--mvpCard_text);

  font-size: 14px;

  &:hover {
    opacity: 0.85;
  }
`;

export const VoteLabel = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: var(--mvpCard_killButton);
`;

export const CooldownLabel = styled.span`
  font-size: 12px;
  color: var(--mvpCard_text);
  opacity: 0.85;
`;

export const Timer = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: var(--primary);
  letter-spacing: 1px;
`;
