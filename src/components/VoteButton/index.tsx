import { useVoteTimer } from '@/hooks/useVoteTimer';
import { Button, CooldownLabel, Timer, VoteLabel, Wrapper } from './styles';

export function VoteButton() {
  const { canVote, formattedRemaining, vote } = useVoteTimer();

  return (
    <Wrapper>
      {canVote ? (
        <Button onClick={vote}>
          <VoteLabel>VOTAR</VoteLabel>
        </Button>
      ) : (
        <Button>
          <CooldownLabel>Podrás votar de nuevo en:</CooldownLabel>
          <Timer>{formattedRemaining}</Timer>
        </Button>
      )}
    </Wrapper>
  );
}
