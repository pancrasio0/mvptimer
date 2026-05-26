import { styled } from '@linaria/react';

export const Container = styled.div`
  cursor: pointer;

  > svg {
    width: 22px;
    height: 22px;
    stroke-width: 2px;
    color: white;
  }

  &:hover {
    opacity: 0.8;
  }
`;