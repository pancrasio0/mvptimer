interface IMapMark {
  x: number;
  y: number;
}

interface ISpawn {
  mapname: string;
  respawnTime: number;
}

interface IMvp {
  id: number;
  name: string;
  spawn: Array<ISpawn>;
  stats: {
    level: number;
    health: number;
    baseExperience: number;
    jobExperience: number;
  };
  respawnTimerSoonThresholdMs?: number;
  deathTime?: Date;
  deathMap?: string;
  deathPosition?: IMapMark;
  killedBy?: string;
}

interface IKill {
  id?: number;
  mvp_id: number;
  death_map: string;
  death_time: string;
  death_position: IMapMark | null;
  killed_by: string;
  killed_by_name?: string;
  created_at?: string;
}
