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

  min-width: 240px;
  padding: 6px 24px;

  border: 0;
  border-radius: 8px;

  font-weight: bold;

  &:hover {
    opacity: 0.85;
  }
`;

export const VoteButtonActive = styled(Button)`
  background-color: var(--mvpCard_controls_edit);
  color: #fff;
  font-size: 20px;
  padding: 10px 36px;
`;

export const CooldownContainer = styled(Button)`
  background-color: var(--mvpCard_bg);
  border: 2px solid var(--mvpCard_controls_edit);
  cursor: default;
`;

export const CooldownLabel = styled.span`
  font-size: 12px;
  color: var(--mvpCard_text);
  opacity: 0.8;
`;

export const Timer = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: var(--mvpCard_controls_edit);
  letter-spacing: 1px;
`;
