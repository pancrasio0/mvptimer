import { Wifi, WifiOff } from '@styled-icons/feather';
import { useSettings } from '@/contexts/SettingsContext';
import { Container } from './styles';

export function OnlineToggle() {
  const { isOnline, toggleOnline } = useSettings();

  return (
    <Container onClick={toggleOnline} title={isOnline ? 'Online mode' : 'Offline mode'}>
      {isOnline ? <Wifi /> : <WifiOff />}
    </Container>
  );
}
