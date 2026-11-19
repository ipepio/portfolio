import * as migration_20261119_144525 from './20261119_144525';
import * as migration_20261119_165457 from './20261119_165457';

export const migrations = [
  {
    up: migration_20261119_144525.up,
    down: migration_20261119_144525.down,
    name: '20261119_144525',
  },
  {
    up: migration_20261119_165457.up,
    down: migration_20261119_165457.down,
    name: '20261119_165457'
  },
];
