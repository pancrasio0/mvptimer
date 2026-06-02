import { RefreshCcw } from '@styled-icons/feather';
import { useVoteTimer } from '@/hooks/useVoteTimer';
import {
  CooldownContainer,
  CooldownLabel,
  Inner,
  RefreshButton,
  Timer,
  VoteButtonActive,
  Wrapper,
} from './styles';

export function VoteButton() {
  const { canVote, formattedRemaining, vote, resetVote } = useVoteTimer();

  return (
    <Wrapper>
      {canVote ? (
        <VoteButtonActive onClick={vote}>VOTAR</VoteButtonActive>
      ) : (
        <Inner>
          <CooldownContainer>
            <CooldownLabel>Podrás votar de nuevo en:</CooldownLabel>
            <Timer>{formattedRemaining}</Timer>
          </CooldownContainer>
          <RefreshButton onClick={resetVote} title='Reiniciar voto'>
            <RefreshCcw />
          </RefreshButton>
        </Inner>
      )}
    </Wrapper>
  );
}
