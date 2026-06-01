import { useMemo, useState } from 'react';
import { Map, RefreshCcw, Trash2, Edit2, Bell, BellOff } from '@styled-icons/feather';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';

import { MvpSprite } from '../MvpSprite';
import { MvpCardCountdown } from '../MvpCardCountdown';
import { ModalMvpMap } from '@/modals';

import { useNotification, useNotificationPrefs } from '@/hooks';
import { notifKey } from '@/hooks/useNotificationPrefs';

import { useMvpsContext } from '@/contexts/MvpsContext';
import { useSettings } from '@/contexts/SettingsContext';
import { getMvpRespawnTime, getMvpSoonThreshold } from '@/utils';
import { GetTranslateText } from '@/utils/GetTranslateText';

import {
  Container,
  Header,
  ID,
  Name,
  KilledBy,
  MapName,
  Controls,
  Control,
  Bold,
  KilledNow,
  EditButton,
  BellButton,
} from './styles';

interface MvpCardProps {
  mvp: IMvp;
}

export function MvpCard({ mvp }: MvpCardProps) {
  const { killMvp, resetMvpTimer, removeMvpByMap, setEditingMvp } =
    useMvpsContext();
  const { respawnAsCountdown, animatedSprites } = useSettings();
  const { respawnNotification } = useNotification();
  const { has: hasNotifPref, toggle: toggleNotifPref } = useNotificationPrefs();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const isActive = !!mvp.deathMap;
  const notifPrefKey = isActive ? notifKey(mvp.id, mvp.deathMap) : notifKey(mvp.id);
  const isNotifEnabled = hasNotifPref(notifPrefKey);

  const nextRespawn = useMemo(
    () => dayjs(mvp.deathTime).add(getMvpRespawnTime(mvp), 'ms'),
    [mvp]
  );

  function handleKilledNow() {
    const hasMoreThanOneMap = mvp.spawn.length > 1;

    isActive
      ? killMvp(mvp)
      : hasMoreThanOneMap
      ? setEditingMvp(mvp)
      : killMvp({ ...mvp, deathMap: mvp.spawn[0].mapname });
  }

  return (
    <>
      <Container>
        <Header>
          <ID>{`(${mvp.id})`}</ID>
          <Name>{mvp.name}</Name>
          {isActive && mvp.killedBy && <KilledBy>by {mvp.killedBy}</KilledBy>}
        </Header>

        <MvpSprite id={mvp.id} name={mvp.name} animated={animatedSprites} />

        {isActive ? (
          <>
            <MvpCardCountdown
              nextRespawn={nextRespawn}
              respawnAsCountdown={respawnAsCountdown}
              respawnTimerSoonThresholdMs={getMvpSoonThreshold(mvp)}
              onTriggerNotification={
                isNotifEnabled
                  ? () =>
                      respawnNotification(
                        mvp.id,
                        `${mvp.name} ${GetTranslateText('will_respawn')}`,
                        `${mvp.deathMap} - ${nextRespawn.format('HH:mm')}`
                      )
                  : undefined
              }
            />

            <BellButton
              onClick={() => toggleNotifPref(notifPrefKey)}
              title={isNotifEnabled ? 'Disable notification' : 'Enable notification'}
              active={isNotifEnabled}
            >
              {isNotifEnabled ? <Bell /> : <BellOff />}
            </BellButton>

            <MapName>
              <FormattedMessage id='map' />
              {'\n'}
              <Bold>{mvp.deathMap}</Bold>
            </MapName>

            <Controls>
              <Control
                onClick={() => setIsMapModalOpen(true)}
                title={GetTranslateText('controls.show_map')}
              >
                <Map />
              </Control>
              <Control
                onClick={() => resetMvpTimer(mvp)}
                title={GetTranslateText('controls.reset_timer')}
              >
                <RefreshCcw />
              </Control>
              <Control
                onClick={() => removeMvpByMap(mvp.id, mvp.deathMap)}
                title={GetTranslateText('controls.remove')}
              >
                <Trash2 />
              </Control>
            </Controls>
          </>
        ) : (
          <>
            <BellButton
              onClick={() => toggleNotifPref(notifPrefKey)}
              title={isNotifEnabled ? 'Disable notification' : 'Enable notification'}
              active={isNotifEnabled}
            >
              {isNotifEnabled ? <Bell /> : <BellOff />}
            </BellButton>

            <Controls isActive={!isActive}>
              <KilledNow onClick={handleKilledNow}>
                <FormattedMessage id='killed_now' />
              </KilledNow>
              <EditButton onClick={() => setEditingMvp(mvp)}>
                <FormattedMessage id='edit' />
              </EditButton>
            </Controls>
          </>
        )}
      </Container>

      {isActive && isMapModalOpen && (
        <ModalMvpMap
          deathMap={mvp.deathMap}
          deathPosition={mvp.deathPosition}
          close={() => setIsMapModalOpen(false)}
        />
      )}
    </>
  );
}
