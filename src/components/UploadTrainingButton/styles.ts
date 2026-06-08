import { styled } from '@linaria/react';

export const Wrapper = styled.div`
  position: relative;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 8px 20px;
  border: 0;
  border-radius: 8px;

  font-weight: bold;
  font-size: 14px;

  background-color: var(--mvpCard_controls_edit);
  color: #fff;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  padding: 6px 12px;
  background-color: #d10000;
  color: #fff;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 10;
`;

export const SuccessMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--modal_bg);
  border: 2px solid var(--mvpCard_controls_edit);
  border-radius: 8px;
  padding: 24px 32px;
  z-index: 1000;
  min-width: 320px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

export const SuccessTitle = styled.h3`
  color: var(--mvpCard_controls_edit);
  font-size: 18px;
  margin-bottom: 12px;
  text-align: center;
`;

export const SummaryLine = styled.p`
  color: var(--modal_text);
  font-size: 14px;
  margin-bottom: 6px;
`;

export const CloseButton = styled.button`
  display: block;
  margin: 16px auto 0;
  padding: 8px 24px;
  border: 0;
  border-radius: 8px;
  font-weight: bold;
  font-size: 14px;
  background-color: var(--mvpCard_controls_edit);
  color: #fff;

  &:hover {
    opacity: 0.85;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;
