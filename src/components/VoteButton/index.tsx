import { useVoteTimer } from '@/hooks/useVoteTimer';
import {
  CooldownContainer,
  CooldownLabel,
  Timer,
  VoteButtonActive,
  Wrapper,
} from './styles';

export function VoteButton() {
  const { canVote, formattedRemaining, vote } = useVoteTimer();

  return (
    <Wrapper>
      {canVote ? (
        <VoteButtonActive onClick={vote}>VOTAR</VoteButtonActive>
      ) : (
        <CooldownContainer>
          <CooldownLabel>Podrás votar de nuevo en:</CooldownLabel>
          <Timer>{formattedRemaining}</Timer>
        </CooldownContainer>
      )}
    </Wrapper>
  );
}
