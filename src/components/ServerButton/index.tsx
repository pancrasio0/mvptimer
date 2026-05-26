import { useSettings } from '@/contexts/SettingsContext';

import { Button } from './styles';

export function ServerButton() {
  const { server } = useSettings();

  return (
    <Button>
      {server}
    </Button>
  );
}
